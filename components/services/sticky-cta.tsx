"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import c from "./sticky-cta.module.css"

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
 * Dark-kit look (2026-11-28); the colors fall back to literal values so the bar
 * still renders correctly outside a <DarkPage>.
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
      <div className={c.bar}>
        <p className={c.message}>
          {message ?? (
            <>
              <span className={c.strong}>Founder-led</span> AI-visibility work — book an intro call.
            </>
          )}
        </p>
        <div className={c.actions}>
          <Link href={pricingHref} className={c.pricing}>
            {pricingLabel}
          </Link>
          <Link
            href={callHref}
            data-cta-placement="sticky_bar"
            {...(callHref.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={c.call}
          >
            Book a call
            <svg className={c.arrow} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
