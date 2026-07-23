"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

/**
 * StickyServiceCta — a slim bottom bar that fades in once the visitor has
 * scrolled past the hero, keeping "Book a call" and a jump-to-pricing link in
 * reach on a long page. Client-only (scroll listener). Hidden until ~1 viewport
 * of scroll so it never competes with the hero's own CTAs.
 *
 * `pricingHref` defaults to the on-page #pricing anchor; `callHref` is the
 * book-a-call target. While hidden the wrapper is `inert`, so the two links are
 * out of the tab order (no focus trap on an off-screen control). Under
 * prefers-reduced-motion the transition is disabled (it snaps, no slide).
 */
export function StickyServiceCta({
  callHref = "/contact",
  pricingHref = "#pricing",
  message,
  pricingLabel = "See pricing",
}: {
  callHref?: string
  pricingHref?: string
  // Optional copy overrides for pages whose claims differ from the flagship
  // (e.g. the no-price automation page). Defaults preserve the original copy.
  message?: React.ReactNode
  pricingLabel?: string
}) {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.9)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 transition-all duration-300 motion-reduce:transition-none ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
      aria-hidden={!shown}
      inert={!shown}
    >
      <div className="mx-auto mb-3 flex max-w-2xl items-center justify-between gap-3 rounded-full border border-gray-200 bg-white/95 px-4 py-2.5 shadow-[0_10px_40px_-12px_rgba(15,23,42,0.28)] backdrop-blur sm:px-5">
        <p className="hidden text-[13px] font-medium text-gray-700 sm:block">
          {message ?? (
            <>
              We take <span className="font-semibold text-gray-900">4 clients</span> at a time — book an intro call.
            </>
          )}
        </p>
        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
          <Link
            href={pricingHref}
            className="rounded-full px-3.5 py-2 text-[13px] font-semibold text-gray-700 transition-colors hover:text-gray-900"
          >
            {pricingLabel}
          </Link>
          <Link
            href={callHref}
            {...(callHref.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="inline-flex items-center gap-1.5 rounded-full bg-accent-900 px-5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-accent-800"
          >
            Book a call
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
