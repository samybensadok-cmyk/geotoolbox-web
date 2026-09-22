"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { trackEvent } from "@/lib/analytics"
import { isPromoLive } from "@/lib/promo"
import { REPORT_OFFER } from "@/lib/report-offer"

/**
 * SG_REPORT_EXIT_V1 (2026-09-22) — desktop exit-intent popup for the $1,250 Report.
 *
 * Mechanics are the SG_PROMO_EXIT_V1 popup's (exit-intent-popup.tsx), deliberately unchanged:
 * arm after a dwell, fire once on a mouse-out through the top edge, never on touch devices, one
 * showing per session, gone for good once dismissed, Escape + focus trap + scroll lock.
 *
 * What is different:
 *   - EN only. The Report is sold on /services/*, which is not localized; a French reader must not
 *     be sent to an English sales page by an interstitial.
 *   - It links to the Report's section on its service page, never straight to checkout.
 *   - It stands down while a discount campaign is live (that popup owns the slot then).
 *   - Longer dwell (30s vs the promo's) — a $1,250 ask to a reader who bounced in 8s is noise.
 * Copy is REPORT_OFFER (lib/report-offer.ts), mirrored from the service page itself.
 */
const DISMISS_KEY = `exitIntentDismissed:${REPORT_OFFER.campaign}`
const SHOWN_KEY = `exitIntentShown:${REPORT_OFFER.campaign}`
const ARM_DELAY_MS = 30_000

function isSuppressedPath(pathname: string | null): boolean {
  if (!pathname) return false
  // The pages that already sell something: an interstitial there competes with the page.
  return pathname.startsWith("/services") || pathname.startsWith("/app") || pathname.startsWith("/pricing")
}

export function ReportExitPopup({ locale = "en" }: { locale?: string }) {
  const [open, setOpen] = useState(false)
  const [armed, setArmed] = useState(false)
  const pathname = usePathname()
  const dialogRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)

  const suppressed = locale !== "en" || isSuppressedPath(pathname)
  // Same stale-closure guard as the promo popup: this mounts once in RootShell, so a client-side
  // navigation onto a suppressed page must disarm, and the listener must read the current value.
  const suppressedRef = useRef(suppressed)
  // In-memory twin of SHOWN/DISMISS: when storage throws (private mode, blocked), the session
  // must still get at most one showing across client-side navigations (Codex review).
  const doneRef = useRef(false)
  useEffect(() => {
    suppressedRef.current = suppressed
    if (suppressed) {
      setArmed(false)
      setOpen(false)   // a history navigation onto a selling page must not keep the overlay
    }
  }, [suppressed])

  useEffect(() => {
    if (suppressed || isPromoLive()) return
    let dismissed = false
    let shown = false
    try {
      dismissed = localStorage.getItem(DISMISS_KEY) === "1"
      shown = sessionStorage.getItem(SHOWN_KEY) === "1"
    } catch {
      /* ignore */
    }
    if (dismissed || shown || doneRef.current) return
    if (typeof window !== "undefined" && !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
    const id = window.setTimeout(() => setArmed(true), ARM_DELAY_MS)
    return () => window.clearTimeout(id)
  }, [suppressed])

  useEffect(() => {
    if (!armed) return
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY > 0 || e.relatedTarget !== null || suppressedRef.current || doneRef.current) return
      doneRef.current = true
      setOpen(true)
      setArmed(false)
      try {
        sessionStorage.setItem(SHOWN_KEY, "1")
      } catch {
        /* ignore */
      }
    }
    document.addEventListener("mouseleave", onMouseLeave)
    return () => document.removeEventListener("mouseleave", onMouseLeave)
  }, [armed])

  useEffect(() => {
    if (!open) return
    trackEvent("promo_exit_view", { promo_variant: REPORT_OFFER.campaign, locale: "en", page_path: pathname })
    const previouslyFocused = document.activeElement as HTMLElement | null
    ctaRef.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dismiss()
        return
      }
      if (e.key !== "Tab" || !dialogRef.current) return
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
      previouslyFocused?.focus?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- dismiss is stable per render cycle of this effect
  }, [open])

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, "1")
    } catch {
      /* ignore */
    }
    trackEvent("promo_exit_dismiss", { promo_variant: REPORT_OFFER.campaign, locale: "en", page_path: pathname })
    setOpen(false)
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-gray-950/60 px-4 py-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) dismiss()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-exit-headline"
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto animate-fade-up rounded-3xl border border-gray-200 bg-white p-7 shadow-[0_32px_80px_-24px_rgba(11,18,32,0.45)] sm:p-8"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={dismiss}
          className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600"
        >
          ✕
        </button>

        <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
          Done for you
        </p>
        <h2 id="report-exit-headline" className="mt-2 text-[1.5rem] font-bold leading-tight tracking-tight text-gray-900">
          Find out who AI recommends in your market
        </h2>
        <p className="mt-3 text-[14.5px] leading-relaxed text-gray-700">
          The {REPORT_OFFER.name} is a one-off diagnostic that maps:
        </p>
        <ul className="mt-4 space-y-1.5 text-[14px] text-gray-800">
          {REPORT_OFFER.points.map((p) => (
            <li key={p} className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-600" aria-hidden="true" />
              {p}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[13px] text-gray-500">
          <span className="font-semibold text-gray-900">{REPORT_OFFER.price}</span>, {REPORT_OFFER.billing} · no subscription
        </p>

        <a
          ref={ctaRef}
          href={REPORT_OFFER.href}
          onClick={() => trackEvent("promo_exit_click", { promo_variant: REPORT_OFFER.campaign, locale: "en", page_path: pathname })}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-accent-900 px-6 py-3 text-[14.5px] font-semibold text-white transition-all duration-200 hover:bg-accent-800 hover:shadow-xl hover:shadow-accent-900/25 active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
        >
          See what&apos;s in the Report
          <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        <button
          type="button"
          onClick={dismiss}
          className="mt-3 w-full text-center text-[12.5px] font-medium text-gray-500 transition-colors hover:text-gray-700"
        >
          No thanks
        </button>
      </div>
    </div>
  )
}
