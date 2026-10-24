"use client"

import { useState, useSyncExternalStore } from "react"
import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { trackEvent } from "@/lib/analytics"
import { formatCountdown, rememberPromo } from "@/lib/promo"
import { SALE, SALE_COPY, isSaleLive, saleDeadlineEpoch, saleDeadlineLabel, type SaleLocale } from "@/lib/sale"
import { useCountdown } from "@/components/promo/use-countdown"

/**
 * SG_SALE_OCT30_V1 (2026-10-24) — sitewide top banner for the October sale (30% off the first payment of
 * any plan until Oct 31). Replaces the free-scan banner (components/layout/scan-banner.tsx, now LIVE=false).
 *
 * One copy per locale, no variants, no seat counter, no 48-h reservation: the code is public and the offer
 * is enforced in Stripe + the backend (see lib/sale.ts). Hides itself after the deadline.
 *
 * Attribution: GA4 promo_banner_* with promo_variant = SALE.campaign, and `?promo=OCT30&bv=banner-oct30`
 * on the pricing link (carried to signup → checkout, where the backend pre-applies the code). Never utm_*
 * on an internal link (it overwrites the visit's real source in GA4).
 */
const DISMISS_KEY = `saleBannerDismissed:${SALE.code}:v1`
const DISMISS_EVENT = "sale-banner-dismiss"

// Dismissal lives in localStorage, read through useSyncExternalStore so the server render and the first
// client render agree (server snapshot = "dismissed" → nothing rendered, no hydration flash).
function subscribeDismiss(cb: () => void): () => void {
  window.addEventListener("storage", cb)
  window.addEventListener(DISMISS_EVENT, cb)
  return () => {
    window.removeEventListener("storage", cb)
    window.removeEventListener(DISMISS_EVENT, cb)
  }
}
function readDismissed(): boolean {
  try {
    return localStorage.getItem(DISMISS_KEY) === "1"
  } catch {
    return false // private mode: show it; the ✕ still hides it for this page view
  }
}

// /services: a discount banner above a $1,250 / $6,500 offer creates discount ambiguity. /app: in the product.
function isSuppressedPath(pathname: string | null): boolean {
  if (!pathname) return false
  return pathname.startsWith("/services") || pathname.startsWith("/app")
}

export function SaleBanner({ locale = "en" }: { locale?: string }) {
  const stored = useSyncExternalStore(subscribeDismiss, readDismissed, () => true)
  const [closed, setClosed] = useState(false)
  const pathname = usePathname()
  const loc: SaleLocale = locale === "fr" || locale === "es" || locale === "de" ? locale : "en"
  const t = SALE_COPY[loc]
  const deadlineMs = useCountdown(saleDeadlineEpoch())
  const visible = isSaleLive() && !(stored || closed) && !isSuppressedPath(pathname)

  useEffect(() => {
    if (!visible) return
    trackEvent("promo_banner_view", { promo_variant: SALE.campaign, promo_code: SALE.code, locale: loc, page_path: pathname })
  }, [visible, loc, pathname])

  if (!visible) return null

  const lead = t.lead(saleDeadlineLabel(loc))
  const pricingPath = loc === "en" ? "/pricing" : `/${loc}/pricing`
  const href = `${pricingPath}?promo=${SALE.code}&bv=${SALE.bannerVariant}`

  return (
    <div role="region" aria-label={lead} className="bg-accent-700 px-3 py-2 text-white sm:px-4" data-banner-campaign={SALE.campaign}>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-center text-[13px] leading-snug sm:text-sm">
        <p className="min-w-0">
          <strong className="font-semibold">{lead}</strong> {t.body}
        </p>
        <span className="hidden items-center gap-1.5 whitespace-nowrap font-mono text-[11px] text-white/85 xl:inline-flex">
          <span className="rounded border border-white/30 px-1.5 py-0.5">
            {t.code} {SALE.code}
          </span>
          {deadlineMs !== null && deadlineMs > 0 && (
            <span className="rounded border border-white/30 px-1.5 py-0.5 tabular-nums" aria-live="off">
              {t.timeLeft(formatCountdown(deadlineMs))}
            </span>
          )}
        </span>
        <a
          href={href}
          onClick={() => {
            trackEvent("promo_banner_click", { promo_variant: SALE.campaign, promo_code: SALE.code, locale: loc, page_path: pathname })
            rememberPromo(SALE.code, SALE.bannerVariant)
          }}
          className="inline-flex shrink-0 items-center rounded-full bg-white px-3.5 py-1 text-[13px] font-semibold text-accent-800 shadow-sm transition-colors hover:bg-accent-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          {t.cta} →
        </a>
        <button
          type="button"
          aria-label={t.dismiss}
          onClick={() => {
            try {
              localStorage.setItem(DISMISS_KEY, "1")
            } catch {
              /* ignore */
            }
            trackEvent("promo_banner_dismiss", { promo_variant: SALE.campaign, promo_code: SALE.code, locale: loc, page_path: pathname })
            setClosed(true)
            window.dispatchEvent(new Event(DISMISS_EVENT))
          }}
          className="shrink-0 rounded px-1 text-white/80 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
