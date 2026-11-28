"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { trackEvent } from "@/lib/analytics"
import { REPORT_OFFER } from "@/lib/report-offer"
import r from "./report-cta.module.css"

/**
 * SG_REPORT_PUSH_V1 (2026-09-22) — the targeted half of the Report push: a card on the pages where
 * the reader is already shopping in our category (the COMMERCIAL_INTENT_SLUGS articles; 13 when this was written) or
 * running a check on their own site (/tools/*). GSC 28d to 2026-09-21: 21 + 43 clicks — few, but
 * the only readers for whom a $1,250 diagnostic is a sane next step.
 *
 * EN only (the caller checks locale; /services/* is not localized). One view event per mount,
 * fired when the card actually scrolls into view, so view→click is a real rate.
 *
 * Look (2026-11-28): a self-contained dark-kit card. It carries its own tokens and dark surface, so it reads the
 * same inside a light blog page and on a dark tool page, and it imports no kit component (no font preload added).
 */
export function ReportCta({ placement }: { placement: "article" | "tools" }) {
  const pathname = usePathname()
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === "undefined") return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          trackEvent("report_cta_view", { placement, page_path: pathname })
          io.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    io.observe(node)
    return () => io.disconnect()
  }, [placement, pathname])

  const lead = placement === "tools"
    ? "Want the whole picture, not one check?"
    : "Rather have it done for you?"

  return (
    <section ref={ref} aria-labelledby={`report-cta-${placement}`} className={r.section}>
      <div className={r.card}>
        <div className={r.copy}>
          <p className={r.kicker}>
            {lead}
          </p>
          <h2 id={`report-cta-${placement}`} className={r.title}>
            The {REPORT_OFFER.name}
          </h2>
          <p className={r.body}>A one-off diagnostic that maps:</p>
          <ul className={r.points}>
            {REPORT_OFFER.points.map((p) => (
              <li key={p}>
                <svg className={r.check} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="m3.5 8.5 3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className={r.side}>
          <p className={r.price}>{REPORT_OFFER.price}</p>
          <p className={r.billing}>{REPORT_OFFER.billing} · no subscription</p>
          <a
            href={REPORT_OFFER.href}
            onClick={() => trackEvent("report_cta_click", { placement, page_path: pathname })}
            className={r.cta}
          >
            See what&apos;s in the Report
            <svg className={r.arrow} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
