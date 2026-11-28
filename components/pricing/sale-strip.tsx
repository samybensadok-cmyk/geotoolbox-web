"use client"

import { SALE, SALE_COPY, isSaleLive, saleDeadlineLabel, type SaleLocale } from "@/lib/sale"
import st from "./pricing-experience.module.css"

/**
 * SG_SALE_OCT30_V1 — one-line notice above the plan cards while the October sale is live, so the visitor
 * who clicked the banner sees the offer on /pricing. The cards keep LIST prices on purpose: the discount
 * is applied (and re-validated against Stripe) at checkout, so this can only under-promise.
 */
export function SaleStrip({ locale = "en" }: { locale?: string }) {
  if (!isSaleLive()) return null
  const loc: SaleLocale = locale === "fr" || locale === "es" || locale === "de" ? locale : "en"
  return (
    <p
      className={`${st.notice} ${st.noticeLime}`}
      data-sale-campaign={SALE.campaign}
    >
      {SALE_COPY[loc].strip(saleDeadlineLabel(loc))}
    </p>
  )
}
