"use client"

import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { PLANS, type Plan } from "@/lib/plans"

// Free + Enterprise are handled as standalone strips (Ahrefs-style); the cards
// and the comparison table show the paid self-serve tiers only.
const SELF_SERVE = PLANS.filter((p) => p.id !== "enterprise" && p.id !== "free")

function priceDisplay(plan: Plan, annual: boolean) {
  if (plan.priceMonthly === null) return { big: "Custom", sub: null, save: null }
  if (plan.priceMonthly === 0) return { big: "$0", sub: "free forever", save: null }
  if (annual && plan.priceYearly) {
    const perMo = Math.round(plan.priceYearly / 12)
    const save = plan.priceMonthly * 12 - plan.priceYearly
    return {
      big: `$${perMo}`,
      sub: `billed $${plan.priceYearly.toLocaleString()}/yr`,
      save: `Save $${save.toLocaleString()}`,
    }
  }
  return { big: `$${plan.priceMonthly}`, sub: "billed monthly", save: null }
}

export function PricingCards() {
  const [annual, setAnnual] = useState(true)

  return (
    <div>
      {/* Billing toggle */}
      <div className="flex items-center justify-center">
        <div
          role="radiogroup"
          aria-label="Billing period"
          className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 p-1"
        >
          {([
            ["Monthly", false],
            ["Annual", true],
          ] as const).map(([label, isAnnual]) => (
            <button
              key={label}
              type="button"
              role="radio"
              aria-checked={annual === isAnnual}
              onClick={() => setAnnual(isAnnual)}
              className={cn(
                "relative rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors",
                annual === isAnnual
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              {label}
              {label === "Annual" && (
                <span className="ml-1.5 rounded-full bg-accent-100 px-1.5 py-0.5 text-[10px] font-semibold text-accent-800">
                  −17%
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SELF_SERVE.map((plan) => {
          const p = priceDisplay(plan, annual)
          return (
            <div
              key={plan.id}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-white p-6",
                plan.featured
                  ? "border-accent-300 shadow-[0_20px_60px_-24px_rgba(13,148,136,0.45)] xl:-mt-3 xl:mb-3"
                  : "border-gray-200"
              )}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-6 inline-flex items-center rounded-full bg-accent-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                  {plan.badge}
                </span>
              )}

              <h3 className="text-[15px] font-bold tracking-tight text-gray-900">{plan.name}</h3>

              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight text-gray-900">{p.big}</span>
                {plan.priceMonthly !== null && plan.priceMonthly > 0 && (
                  <span className="text-sm font-medium text-gray-500">/mo</span>
                )}
              </div>
              <div className="mt-1 flex min-h-[20px] items-center gap-2">
                {p.sub && <span className="text-xs text-gray-500">{p.sub}</span>}
                {p.save && annual && (
                  <span className="rounded bg-accent-50 px-1.5 py-0.5 text-[11px] font-semibold text-accent-700">
                    {p.save}
                  </span>
                )}
              </div>

              <p className="mt-4 min-h-[40px] text-[13px] leading-snug text-gray-600">{plan.tagline}</p>

              <Link
                href={plan.cta.href}
                prefetch={false}
                className={cn(
                  "mt-5 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[14px] font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2",
                  plan.featured
                    ? "bg-accent-900 text-white hover:bg-accent-800 hover:shadow-lg hover:shadow-accent-900/25"
                    : "border border-gray-300 text-gray-900 hover:border-gray-400 hover:bg-gray-50"
                )}
              >
                {plan.cta.label}
              </Link>

              {/* Quota block — same 5 rows, same order, every card */}
              <dl className="mt-6 space-y-2 border-t border-gray-100 pt-5 text-[13px]">
                {Object.values(plan.quotas).map((q, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-700">
                    <svg className="h-3.5 w-3.5 shrink-0 text-accent-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M3 8.5 6.5 12 13 4.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className={i === 0 ? "font-semibold text-gray-900" : ""}>{q}</span>
                  </div>
                ))}
              </dl>

              {/* Feature highlights */}
              <div className="mt-5 border-t border-gray-100 pt-5">
                {plan.inheritsFrom && (
                  <p className="mb-2 text-[12px] font-medium text-gray-500">
                    Everything in {plan.inheritsFrom}, plus:
                  </p>
                )}
                <ul className="space-y-1.5 text-[13px] text-gray-700">
                  {plan.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2">
                      <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-500" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
