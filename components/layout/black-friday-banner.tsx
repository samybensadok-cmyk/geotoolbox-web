"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { usePathname } from "next/navigation"
import { trackEvent } from "@/lib/analytics"
import { BF, BF_COPY, bfCountdownEpoch, bfLocale, bfPhase, formatBfCountdown } from "@/lib/black-friday"
import { useCountdown } from "@/components/promo/use-countdown"
import { BfCountdown } from "@/components/promo/bf-countdown"

/**
 * SG_BF2026_V1 (2026-11-16, redesigned after operator review: "looks quite bad, copy not conversion oriented") —
 * sitewide Black Friday bar. Black background + yellow accent (the Black Friday convention, distinct from the
 * teal of past campaigns), one line on desktop: BLACK FRIDAY badge · "Up to 40% off GEO Toolbox" · short
 * qualifier (year one / 3 months / no code) · countdown · CTA. Mobile keeps badge + headline + CTA.
 * Countdown runs to the real end (Wed Dec 2 23:59:59 PT = the instant the backend stops applying the code).
 * Same dismissal mechanics as before (useSyncExternalStore, no hydration flash; per-phase key, closed state
 * keyed by phase). Hidden on /app and on /services (services pages carry their own Black Friday offer).
 *
 * SG_BF2026_V2 (2026-11-18, operator: "wording is too long and complicated ... should be 'up to 40%' off"): benchmark of
 * 19 live Black Friday bars (BLACK-FRIDAY-DEALS-2026/design-bench/BENCHMARK-2026-11-18.md) = one number, 4-12 words,
 * one line, ticking D/H/M/S tiles. The bar now says only "Up to 40% off every plan"; the annual/monthly terms and the
 * annual bonus live on the plan cards, where the visitor picks the interval.
 */
const DISMISS_EVENT = "bf-banner-dismiss"
const dismissKey = (phase: string) => `bfBannerDismissed:${BF.campaign}:${phase}:v1`

function subscribeDismiss(cb: () => void): () => void {
  window.addEventListener("storage", cb)
  window.addEventListener(DISMISS_EVENT, cb)
  return () => {
    window.removeEventListener("storage", cb)
    window.removeEventListener(DISMISS_EVENT, cb)
  }
}
function readDismissed(): string {
  try {
    return [localStorage.getItem(dismissKey("teaser")) === "1" ? "t" : "", localStorage.getItem(dismissKey("live")) === "1" ? "l" : ""].join("")
  } catch {
    return ""
  }
}

function isSuppressedPath(pathname: string | null): boolean {
  if (!pathname) return false
  return pathname.startsWith("/app") || /^\/(?:(?:fr|es|de)\/)?services(?:\/|$)/.test(pathname)
}

export function BlackFridayBanner({ locale = "en" }: { locale?: string }) {
  const stored = useSyncExternalStore(subscribeDismiss, readDismissed, () => "tl")
  const [closedPhase, setClosedPhase] = useState<string | null>(null)
  const pathname = usePathname()
  const loc = bfLocale(locale)
  const t = BF_COPY[loc]
  const phase = bfPhase()
  const msLeft = useCountdown(bfCountdownEpoch())
  const dismissed = closedPhase === phase || (phase === "teaser" ? stored.includes("t") : stored.includes("l"))
  const visible = phase === "live" && (msLeft === null || msLeft > 0) && !dismissed && !isSuppressedPath(pathname)
  const variant = `${BF.campaign}-${phase}`

  useEffect(() => {
    if (!visible) return
    trackEvent("promo_banner_view", { promo_variant: variant, locale: loc, page_path: pathname })
  }, [visible, variant, loc, pathname])

  if (!visible) return null

  const pricingPath = loc === "en" ? "/pricing" : `/${loc}/pricing`

  return (
    <div role="region" aria-label={`${t.badge}: ${t.headline}`} className="relative bg-neutral-950 text-white" data-banner-campaign={variant}>
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-x-3 gap-y-1 px-10 py-2 sm:gap-x-4">
        <span className="hidden shrink-0 rounded-sm bg-yellow-400 px-2 py-0.5 text-[11px] font-extrabold tracking-[0.12em] text-neutral-950 sm:inline">
          {t.badge}
        </span>
        <p className="min-w-0 text-center text-[13px] leading-snug sm:text-left sm:text-sm">
          <strong className="font-extrabold text-yellow-300 sm:hidden">{t.mobileHeadline}</strong>
          <strong className="hidden font-extrabold text-white sm:inline">{t.headline}</strong>
        </p>
        {msLeft !== null && msLeft > 0 && (
          <span className="hidden shrink-0 items-center gap-2 md:inline-flex" aria-live="off">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/60">{t.endsIn}</span>
            <BfCountdown msLeft={msLeft} locale={loc} size="sm" />
            <span className="sr-only">{formatBfCountdown(msLeft, loc)}</span>
          </span>
        )}
        <a
          href={pricingPath}
          onClick={() => trackEvent("promo_banner_click", { promo_variant: variant, locale: loc, page_path: pathname })}
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-yellow-400 px-3.5 py-1 text-[13px] font-bold text-neutral-950 shadow-sm transition-colors hover:bg-yellow-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-200"
        >
          <span className="sm:hidden">{t.mobileCta}</span>
          <span className="hidden sm:inline">{t.bannerCta}</span> <span aria-hidden="true">→</span>
        </a>
      </div>
      <button
        type="button"
        aria-label={t.dismiss}
        onClick={() => {
          try {
            localStorage.setItem(dismissKey(phase), "1")
          } catch {
            /* ignore */
          }
          trackEvent("promo_banner_dismiss", { promo_variant: variant, locale: loc, page_path: pathname })
          setClosedPhase(phase)
          window.dispatchEvent(new Event(DISMISS_EVENT))
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-1.5 text-white/60 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      >
        ✕
      </button>
    </div>
  )
}
