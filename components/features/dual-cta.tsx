import Link from "next/link"
import { siteConfig } from "@/lib/config"

/**
 * DualCTA — a configurable feature-page CTA band giving both buyer archetypes an
 * on-ramp: a low-friction self-serve primary (→ /app, free, no card) plus an
 * optional artifact secondary ("See a sample report"). Distinct from the
 * homepage-specific components/landing/cta.tsx. Drop at every section break.
 */

export function DualCTA({
  primaryLabel = "Start free",
  primaryHref = siteConfig.appSignupUrl,
  secondaryLabel,
  secondaryHref,
  microcopy = "Free plan · no credit card",
  align = "center",
}: {
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  microcopy?: string
  align?: "center" | "left"
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <div className={`flex flex-wrap items-center gap-3 ${align === "center" ? "justify-center" : ""}`}>
        <Link
          href={primaryHref}
          prefetch={false}
          className="inline-flex items-center gap-2 rounded-full bg-accent-900 px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-accent-800 hover:shadow-xl hover:shadow-accent-900/25 active:translate-y-[1px]"
        >
          {primaryLabel}
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        {secondaryLabel && secondaryHref && (
          <Link
            href={secondaryHref}
            className="rounded-full border border-gray-200 px-6 py-3.5 text-[15px] font-medium text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900"
          >
            {secondaryLabel}
          </Link>
        )}
      </div>
      {microcopy && <p className="mt-3 text-[13px] text-gray-500">{microcopy}</p>}
    </div>
  )
}
