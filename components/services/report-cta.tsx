"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { trackEvent } from "@/lib/analytics"
import { REPORT_OFFER } from "@/lib/report-offer"

/**
 * SG_REPORT_PUSH_V1 (2026-09-22) — the targeted half of the Report push: a card on the pages where
 * the reader is already shopping in our category (the 13 COMMERCIAL_INTENT_SLUGS articles) or
 * running a check on their own site (/tools/*). GSC 28d to 2026-09-21: 21 + 43 clicks — few, but
 * the only readers for whom a $1,250 diagnostic is a sane next step.
 *
 * EN only (the caller checks locale; /services/* is not localized). One view event per mount,
 * fired when the card actually scrolls into view, so view→click is a real rate.
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
    <section ref={ref} aria-labelledby={`report-cta-${placement}`} className="px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl rounded-3xl border border-accent-200 bg-gradient-to-b from-accent-50 to-white p-7 sm:p-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
              {lead}
            </p>
            <h2 id={`report-cta-${placement}`} className="mt-2 text-[clamp(1.35rem,2.6vw,1.75rem)] font-bold leading-tight tracking-tight text-gray-900">
              The {REPORT_OFFER.name}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-gray-700">A one-off diagnostic that maps:</p>
            <ul className="mt-4 space-y-1.5 text-[14.5px] text-gray-800">
              {REPORT_OFFER.points.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-600" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-2 md:items-center">
            <p className="text-[2rem] font-bold leading-none tracking-tight text-gray-900">{REPORT_OFFER.price}</p>
            <p className="text-[13px] text-gray-500">{REPORT_OFFER.billing} · no subscription</p>
            <a
              href={REPORT_OFFER.href}
              onClick={() => trackEvent("report_cta_click", { placement, page_path: pathname })}
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-accent-900 px-6 py-3 text-[14.5px] font-semibold text-white transition-all duration-200 hover:bg-accent-800 hover:shadow-xl hover:shadow-accent-900/25 active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
            >
              See what&apos;s in the Report
              <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
