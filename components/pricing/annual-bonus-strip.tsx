"use client"

import { BONUS, BONUS_COPY, bonusDeadlineLabel, bonusLocale, isBonusLive } from "@/lib/annual-bonus"

/**
 * SG_ANNUAL_BONUS_NOV15_V1 — one-line notice above the plan cards while the annual-plan bonus is live
 * (free SEO/GEO audit + 30-min call, until Sun Nov 15 midnight PT). Prices are unchanged; nothing is
 * applied at checkout, the operator emails annual buyers to book.
 */
export function AnnualBonusStrip({ locale = "en" }: { locale?: string }) {
  if (!isBonusLive()) return null
  const loc = bonusLocale(locale)
  return (
    <p
      className="mx-auto mb-6 max-w-3xl rounded-xl border border-accent-200 bg-accent-50 px-4 py-2.5 text-center text-[13px] font-medium text-accent-900"
      data-bonus-campaign={BONUS.campaign}
    >
      {BONUS_COPY[loc].strip(bonusDeadlineLabel(loc))}
    </p>
  )
}
