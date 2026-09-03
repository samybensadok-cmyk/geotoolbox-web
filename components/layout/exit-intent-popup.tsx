"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { trackEvent } from "@/lib/analytics"
import { PLANS } from "@/lib/plans"
import {
  PROMO,
  fmtPromoAmount,
  isPromoLive,
  promoDaysLeft,
  promoDeadlineLabel,
  promoPrice,
  rememberPromo,
  type PromoLocale,
} from "@/lib/promo"

/**
 * SG_PROMO_EXIT_V1 (2026-08-15) — desktop exit-intent popup for the founding
 * offer, paired with components/layout/promo-banner.tsx (top-of-page,
 * always-visible) as a second, last-chance surface. Same offer, same code
 * (PROMO.code / FOUNDING30), same continuity mechanism (?promo=…&bv=… into
 * /pricing → signup → checkout) — see lib/promo.ts for why that has to be one
 * source of truth.
 *
 * Distinct from the banner on purpose:
 *   - Fires once, on the classic desktop exit-intent signal (mouse leaves
 *     through the top of the viewport), not on every page load — a popup
 *     that fires on load is just an interstitial, not an exit-intent.
 *   - Touch/coarse-pointer devices never get a mouseleave-to-top event this
 *     way (there's no cursor to leave through the chrome), so this is
 *     deliberately desktop-only rather than bolting on an unreliable mobile
 *     proxy (rapid-upward-scroll false-positives while reading).
 *   - A short dwell delay (ARM_DELAY_MS) before arming, so it can't fire the
 *     instant a tab gets focus-shuffled right after navigation.
 *   - Permanent dismiss (closing it — the ✕, "no thanks", backdrop, or Esc —
 *     all count) persists in localStorage under a campaign-versioned key, same
 *     "new campaign = new key" discipline as the banner's DISMISS_KEY.
 *   - Suppressed everywhere the banner is suppressed (/services — a sitewide
 *     discount code above a $4,000 offer creates discount ambiguity) plus
 *     /pricing and /app itself, where popping "here's a discount" over the
 *     page whose entire job is selling the plan is redundant at best.
 */

const DISMISS_KEY = `exitIntentDismissed:${PROMO.code}:v1`
const SHOWN_KEY = `exitIntentShown:${PROMO.code}:v1`
const ARM_DELAY_MS = 8_000

const PLUS_FULL = PLANS.find((p) => p.id === "consultant")?.priceMonthly ?? 199
const PLUS_PROMO = promoPrice(PLUS_FULL)

type Copy = {
  eyebrow: string
  headline: string
  body: string
  cta: string
  secondary: string
  code: string
  daysLeft: (n: number) => string
  dismissAria: string
}

function buildCopy(deadline: Record<PromoLocale, string>): Record<PromoLocale, Copy> {
  return {
    en: {
      eyebrow: "Before you go",
      headline: `Take ${PROMO.percentOff}% off, on us`,
      body: `The Plus plan for $${fmtPromoAmount(PLUS_PROMO, "en")}/mo instead of $${PLUS_FULL} — locked in for ${PROMO.months} months. Only ${PROMO.seats} founding seats, ends ${deadline.en}.`,
      cta: "Claim my founding rate",
      secondary: "No thanks, I'll pay full price later",
      code: "Code",
      daysLeft: (n) => (n === 1 ? "1 day left" : `${n} days left`),
      dismissAria: "Close",
    },
    fr: {
      eyebrow: "Avant de partir",
      headline: `−${PROMO.percentOff} % offerts`,
      body: `La formule Plus à ${fmtPromoAmount(PLUS_PROMO, "fr")} €/mois au lieu de ${PLUS_FULL} € — tarif verrouillé pendant ${PROMO.months} mois. Plus que ${PROMO.seats} places fondateurs, jusqu’au ${deadline.fr}.`,
      cta: "Profiter du tarif fondateurs",
      secondary: "Non merci, je paierai plein tarif",
      code: "Code",
      daysLeft: (n) => (n === 1 ? "1 jour restant" : `${n} jours restants`),
      dismissAria: "Fermer",
    },
    es: {
      eyebrow: "Antes de irte",
      headline: `−${PROMO.percentOff} % de descuento`,
      body: `El plan Plus por $${fmtPromoAmount(PLUS_PROMO, "es")}/mes en lugar de $${PLUS_FULL} — fijo durante ${PROMO.months} meses. Solo quedan ${PROMO.seats} plazas fundadoras, hasta el ${deadline.es}.`,
      cta: "Conseguir la tarifa fundadora",
      secondary: "No, gracias, pagaré el precio completo",
      code: "Código",
      daysLeft: (n) => (n === 1 ? "queda 1 día" : `quedan ${n} días`),
      dismissAria: "Cerrar",
    },
    de: {
      eyebrow: "Bevor du gehst",
      headline: `${PROMO.percentOff} % Rabatt — geschenkt`,
      body: `Der Plus-Tarif für ${fmtPromoAmount(PLUS_PROMO, "de")} €/Monat statt ${PLUS_FULL} € — festgeschrieben für ${PROMO.months} Monate. Nur noch ${PROMO.seats} Gründerplätze, bis ${deadline.de}.`,
      cta: "Gründerpreis sichern",
      secondary: "Nein danke, ich zahle später den vollen Preis",
      code: "Code",
      daysLeft: (n) => (n === 1 ? "noch 1 Tag" : `noch ${n} Tage`),
      dismissAria: "Schließen",
    },
  }
}

function isSuppressedPath(pathname: string | null): boolean {
  if (!pathname) return false
  // Same money-page reasoning as the banner (/services), plus the pages whose
  // own job is already "sell the plan" (/pricing, /app) where a discount
  // interstitial competes with the page instead of rescuing a bounce.
  return (
    pathname.startsWith("/services") ||
    pathname.startsWith("/app") ||
    /^\/(fr|es|de)?\/?pricing/.test(pathname)
  )
}

export function ExitIntentPopup({ locale = "en" }: { locale?: string }) {
  const [open, setOpen] = useState(false)
  const [armed, setArmed] = useState(false)
  const pathname = usePathname()
  const loc: PromoLocale = locale === "fr" || locale === "es" || locale === "de" ? locale : "en"
  const dialogRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)

  const suppressed = isSuppressedPath(pathname)
  // This component mounts once in RootShell for the app's lifetime, so a
  // visitor who dwells on an article (arms) and then client-side-navigates to
  // a suppressed page (e.g. /pricing) without a full reload must not stay
  // armed — the arm effect below only re-runs on a `suppressed` transition,
  // so the listener effect needs its own always-current read to avoid firing
  // on a stale closure from before the navigation.
  const suppressedRef = useRef(suppressed)
  useEffect(() => {
    suppressedRef.current = suppressed
    if (suppressed) setArmed(false)
  }, [suppressed])

  // Arm after a dwell delay — never on a page the popup is suppressed on, and
  // never for a visitor who already saw or dismissed this campaign.
  useEffect(() => {
    if (suppressed || !isPromoLive()) return
    let dismissed = false
    let shown = false
    try {
      dismissed = localStorage.getItem(DISMISS_KEY) === "1"
      shown = sessionStorage.getItem(SHOWN_KEY) === "1"
    } catch {
      /* ignore */
    }
    if (dismissed || shown) return
    // Coarse pointer (touch) devices don't generate a "mouse left through the
    // top of the viewport" signal — skip arming entirely rather than ship a
    // popup that can only be closed, never legitimately triggered, on mobile.
    if (typeof window !== "undefined" && !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return
    }
    const id = window.setTimeout(() => setArmed(true), ARM_DELAY_MS)
    return () => window.clearTimeout(id)
  }, [suppressed])

  // The actual exit-intent listener — only attached once armed.
  useEffect(() => {
    if (!armed) return
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY > 0 || e.relatedTarget !== null || suppressedRef.current) return
      setOpen(true)
      // One-shot: unarm immediately so a dismissed popup can't be re-triggered
      // by a second mouseleave in the same page view (the effect cleanup below
      // then drops this listener; SHOWN_KEY blocks re-arming on remount).
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

  const copy = useRef<Record<PromoLocale, Copy> | null>(null)
  if (!copy.current) {
    copy.current = buildCopy({
      en: promoDeadlineLabel("en"),
      fr: promoDeadlineLabel("fr"),
      es: promoDeadlineLabel("es"),
      de: promoDeadlineLabel("de"),
    })
  }
  const t = copy.current[loc]

  useEffect(() => {
    if (!open) return
    trackEvent("promo_exit_view", { promo_code: PROMO.code, locale: loc, page_path: pathname })

    const previouslyFocused = document.activeElement as HTMLElement | null
    ctaRef.current?.focus()

    // Scroll lock — a centered modal over a page that still scrolls behind it
    // reads as broken, and lets a keyboard/screen-reader user tab into content
    // that's visually covered.
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dismiss()
        return
      }
      if (e.key !== "Tab" || !dialogRef.current) return
      // Minimal focus trap: cycle Tab/Shift+Tab within the dialog's focusable
      // elements so it doesn't leak focus into the (visually covered) page.
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
    trackEvent("promo_exit_dismiss", { promo_code: PROMO.code, locale: loc, page_path: pathname })
    setOpen(false)
  }

  if (!open) return null

  const pricingPath = loc === "en" ? "/pricing" : `/${loc}/pricing`
  const href = `${pricingPath}?promo=${PROMO.code}&bv=exit-intent`
  const daysLeft = promoDaysLeft()

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/60 px-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) dismiss()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-intent-headline"
        className="relative w-full max-w-md animate-fade-up rounded-3xl border border-gray-200 bg-white p-7 shadow-[0_32px_80px_-24px_rgba(11,18,32,0.45)] sm:p-8"
      >
        <button
          type="button"
          aria-label={t.dismissAria}
          onClick={dismiss}
          className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600"
        >
          ✕
        </button>

        <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
          {t.eyebrow}
        </p>
        <h2 id="exit-intent-headline" className="mt-2 text-[1.5rem] font-bold leading-tight tracking-tight text-gray-900">
          {t.headline}
        </h2>
        <p className="mt-3 text-[14.5px] leading-relaxed text-gray-700">{t.body}</p>

        <div className="mt-3 flex items-center gap-1.5 font-mono text-[11px] text-gray-500">
          <span className="rounded border border-gray-200 px-1.5 py-0.5">
            {t.code} {PROMO.code}
          </span>
          {daysLeft <= 14 && <span className="rounded border border-gray-200 px-1.5 py-0.5">{t.daysLeft(daysLeft)}</span>}
        </div>

        <a
          ref={ctaRef}
          href={href}
          onClick={() => {
            rememberPromo(PROMO.code, "exit-intent")
            trackEvent("promo_exit_click", { promo_code: PROMO.code, locale: loc, page_path: pathname })
          }}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-accent-900 px-6 py-3 text-[14.5px] font-semibold text-white transition-all duration-200 hover:bg-accent-800 hover:shadow-xl hover:shadow-accent-900/25 active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
        >
          {t.cta}
          <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        <button
          type="button"
          onClick={dismiss}
          className="mt-3 w-full text-center text-[12.5px] font-medium text-gray-500 transition-colors hover:text-gray-700"
        >
          {t.secondary}
        </button>
      </div>
    </div>
  )
}
