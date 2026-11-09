"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { usePathname } from "next/navigation"
import { trackEvent } from "@/lib/analytics"
import { BONUS, BONUS_COPY, bonusDeadlineEpoch, bonusDeadlineLabel, bonusLocale, formatBonusCountdown, isBonusLive } from "@/lib/annual-bonus"
import { useCountdown } from "@/components/promo/use-countdown"

/**
 * SG_ANNUAL_BONUS_NOV15_V1 (2026-11-09) — sitewide top banner: free SEO/GEO audit + 30-min call with any
 * annual plan bought before Sun Nov 15, midnight PT. Same mechanics as components/layout/sale-banner.tsx
 * (useSyncExternalStore dismissal, no hydration flash), no promo code: the CTA opens /pricing with the
 * annual toggle preselected (?interval=annual, read by components/pricing/pricing-cards.tsx).
 * Never utm_* on an internal link. Hides itself after BONUS.deadlineIso.
 */
const DISMISS_KEY = `bonusBannerDismissed:${BONUS.campaign}:v1`
const DISMISS_EVENT = "bonus-banner-dismiss"

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
    return false
  }
}

// /services sells the paid audit/report: a "free audit" banner above it contradicts the page. /app: in the product.
function isSuppressedPath(pathname: string | null): boolean {
  if (!pathname) return false
  return /^\/(?:(?:fr|es|de)\/)?services(?:\/|$)/.test(pathname) || pathname.startsWith("/app")
}

export function AnnualBonusBanner({ locale = "en" }: { locale?: string }) {
  const stored = useSyncExternalStore(subscribeDismiss, readDismissed, () => true)
  const [closed, setClosed] = useState(false)
  const pathname = usePathname()
  const loc = bonusLocale(locale)
  const t = BONUS_COPY[loc]
  const msLeft = useCountdown(bonusDeadlineEpoch())
  const visible = isBonusLive() && (msLeft === null || msLeft > 0) && !(stored || closed) && !isSuppressedPath(pathname)

  useEffect(() => {
    if (!visible) return
    trackEvent("promo_banner_view", { promo_variant: BONUS.campaign, locale: loc, page_path: pathname })
  }, [visible, loc, pathname])

  if (!visible) return null

  const pricingPath = loc === "en" ? "/pricing" : `/${loc}/pricing`
  const href = `${pricingPath}?interval=annual`

  return (
    <div role="region" aria-label={t.lead} className="bg-accent-700 px-3 py-2 text-white sm:px-4" data-banner-campaign={BONUS.campaign}>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-center text-[13px] leading-snug sm:text-sm">
        <p className="min-w-0">
          <strong className="font-semibold">{t.lead}</strong> {t.body(bonusDeadlineLabel(loc))}
        </p>
        {msLeft !== null && msLeft > 0 && (
          <span className="hidden whitespace-nowrap rounded border border-white/30 px-1.5 py-0.5 font-mono text-[11px] tabular-nums text-white/85 xl:inline" aria-live="off">
            {t.timeLeft(formatBonusCountdown(msLeft, loc))}
          </span>
        )}
        <a
          href={href}
          onClick={() => trackEvent("promo_banner_click", { promo_variant: BONUS.campaign, locale: loc, page_path: pathname })}
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
            trackEvent("promo_banner_dismiss", { promo_variant: BONUS.campaign, locale: loc, page_path: pathname })
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
