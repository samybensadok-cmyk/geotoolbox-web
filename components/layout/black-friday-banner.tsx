"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { usePathname } from "next/navigation"
import { trackEvent } from "@/lib/analytics"
import { BF, BF_COPY, bfCountdownEpoch, bfEndLabel, bfLocale, bfPhase, bfStartLabel, formatBfCountdown, isBfRush } from "@/lib/black-friday"
import { useCountdown } from "@/components/promo/use-countdown"

/**
 * SG_BF2026_V1 (2026-11-16) — sitewide Black Friday banner: teaser ("starts Mon Nov 23") until the window
 * opens, then the live offer with a countdown to the real end (Wed Dec 2 23:59:59 PT, the same instant the backend
 * stops applying the code; Stripe redeem_by / expires_at sit 2 h later so a session opened just before can still be paid). Same mechanics as annual-bonus-banner.tsx
 * (useSyncExternalStore dismissal, no hydration flash). No code: the backend applies the discount to every
 * eligible checkout in the window. Never utm_* on an internal link. Hides itself outside the window.
 * Dismiss keys differ per phase so a visitor who closed the teaser still sees the launch once.
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

// /app: in the product.
function isSuppressedPath(pathname: string | null): boolean {
  return !!pathname && pathname.startsWith("/app")
}

export function BlackFridayBanner({ locale = "en" }: { locale?: string }) {
  const stored = useSyncExternalStore(subscribeDismiss, readDismissed, () => "tl")
  // Review fix (Codex): remember WHICH phase was closed, so closing the teaser never hides the live banner
  // in a tab that stays open across the Nov 23 start.
  const [closedPhase, setClosedPhase] = useState<string | null>(null)
  const pathname = usePathname()
  const loc = bfLocale(locale)
  const t = BF_COPY[loc]
  const phase = bfPhase()
  const msLeft = useCountdown(bfCountdownEpoch())
  const dismissed = closedPhase === phase || (phase === "teaser" ? stored.includes("t") : stored.includes("l"))
  const visible = phase !== "off" && (msLeft === null || msLeft > 0) && !dismissed && !isSuppressedPath(pathname)
  const variant = `${BF.campaign}-${phase}`

  useEffect(() => {
    if (!visible) return
    trackEvent("promo_banner_view", { promo_variant: variant, locale: loc, page_path: pathname })
  }, [visible, variant, loc, pathname])

  if (!visible) return null

  const pricingPath = loc === "en" ? "/pricing" : `/${loc}/pricing`
  const lead = phase === "teaser" ? t.teaserLead : t.liveLead
  const body = phase === "teaser" ? t.teaserBody(bfStartLabel(loc)) : `${t.liveBody(bfEndLabel(loc))}${isBfRush() ? ` ${t.rushBonus}` : ""}`

  return (
    <div role="region" aria-label={lead} className="bg-accent-700 px-3 py-2 text-white sm:px-4" data-banner-campaign={variant}>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-center text-[13px] leading-snug sm:text-sm">
        <p className="min-w-0">
          <strong className="font-semibold">{lead}</strong> {body}
        </p>
        {msLeft !== null && msLeft > 0 && (
          <span className="hidden whitespace-nowrap rounded border border-white/30 px-1.5 py-0.5 font-mono text-[11px] tabular-nums text-white/85 xl:inline" aria-live="off">
            {phase === "teaser" ? t.startsIn(formatBfCountdown(msLeft, loc)) : t.timeLeft(formatBfCountdown(msLeft, loc))}
          </span>
        )}
        <a
          href={pricingPath}
          onClick={() => trackEvent("promo_banner_click", { promo_variant: variant, locale: loc, page_path: pathname })}
          className="inline-flex shrink-0 items-center rounded-full bg-white px-3.5 py-1 text-[13px] font-semibold text-accent-800 shadow-sm transition-colors hover:bg-accent-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          {t.cta} →
        </a>
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
          className="shrink-0 rounded px-1 text-white/80 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
