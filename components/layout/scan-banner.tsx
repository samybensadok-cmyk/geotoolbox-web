"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { usePathname } from "next/navigation"
import { trackEvent } from "@/lib/analytics"
import { isPromoLive } from "@/lib/promo"
import { siteConfig } from "@/lib/config"

/**
 * SG_SCAN_BANNER_V1 (2026-09-22) — sitewide top banner pushing the FREE first-run scan.
 *
 * Why the free scan and not a paid offer: ~97% of the site's clicks land on consumer chatbot
 * comparisons (GSC 28d to 2026-09-21: ~4,180 of 4,250). A $1,250 ask is wrong for that reader; "see
 * what ChatGPT says about your business, free" is the one ask that fits anyone with a website, and
 * it lands on the card-free first scan (signup → ?page=first-scan), whose result is gated behind the
 * trial (SG_FIRSTRUN_GATE_V1). The Report is pushed separately: exit popup + targeted cards.
 *
 * Stands down while a discount campaign is live (isPromoLive) — two stacked sitewide banners is
 * noise, and the promo banner is the one with a deadline.
 *
 * Attribution: GA4 promo_banner_* with promo_variant "scan-2026-09", and `?ref=banner-scan` on the
 * signup link (never utm_* on an internal link — it overwrites the visit's real source in GA4).
 */
const CAMPAIGN = "scan-2026-09"
// SG_SCAN_BANNER_OFF (2026-09-22): pulled within the hour. The link landed on the SIGNUP page, which
// is the trial-checkout form (tier picker, "Secure checkout" step, auto-renew consent) — the
// opposite of "free score, no card needed". Stays off until it lands on a domain-first page.
const LIVE = false
const DISMISS_KEY = `scanBannerDismissed:${CAMPAIGN}`

type Loc = "en" | "fr" | "es" | "de" | "nl"
// Copy promises only what the FREE result shows (SG_FIRSTRUN_GATE_V1): a visibility score and how
// many AI engines mention you. WHICH engines, and who they name instead, are behind the card — so
// no "does ChatGPT recommend you?" (that answer is gated) and no "full report".
const COPY: Record<Loc, { lead: string; body: string; cta: string; dismiss: string }> = {
  en: { lead: "Is AI recommending you?", body: "Get your free AI visibility score — see how many AI engines mention your site. No card needed.", cta: "Get my free score", dismiss: "Dismiss" },
  fr: { lead: "Les IA vous recommandent-elles ?", body: "Obtenez votre score de visibilité dans les IA, gratuitement : combien de moteurs d’IA citent votre site. Sans carte bancaire.", cta: "Obtenir mon score", dismiss: "Fermer" },
  es: { lead: "¿Te recomienda la IA?", body: "Consigue gratis tu puntuación de visibilidad en buscadores de IA: cuántos motores de IA mencionan tu sitio. Sin tarjeta.", cta: "Ver mi puntuación", dismiss: "Cerrar" },
  de: { lead: "Empfiehlt KI Sie weiter?", body: "Holen Sie sich Ihren kostenlosen KI-Sichtbarkeits-Score: wie viele KI-Suchmaschinen Ihre Website nennen. Ohne Kreditkarte.", cta: "Score abrufen", dismiss: "Schließen" },
  nl: { lead: "Raadt AI jou aan?", body: "Krijg gratis je AI-zichtbaarheidsscore: hoeveel AI-zoekmachines je site noemen. Zonder creditcard.", cta: "Mijn score bekijken", dismiss: "Sluiten" },
}

// Dismissal lives in localStorage. Read through useSyncExternalStore so the server render and the
// first client render agree (server snapshot = "dismissed" → nothing rendered, no hydration flash),
// and a dismiss in another tab hides it here too.
const DISMISS_EVENT = "scan-banner-dismiss"
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
    return false   // private mode: show it; the ✕ still hides it for this page view
  }
}

function isSuppressedPath(pathname: string | null): boolean {
  if (!pathname) return false
  // /services: a free-scan banner above a $1,250 / $6,500 offer undercuts the page.
  // /app: already in the product.
  return pathname.startsWith("/services") || pathname.startsWith("/app")
}

export function ScanBanner({ locale = "en" }: { locale?: string }) {
  const stored = useSyncExternalStore(subscribeDismiss, readDismissed, () => true)
  const [closed, setClosed] = useState(false)   // this page view, even when storage is unavailable
  const dismissed = stored || closed
  const pathname = usePathname()
  const loc: Loc = locale === "fr" || locale === "es" || locale === "de" || locale === "nl" ? locale : "en"
  const t = COPY[loc]
  const suppressed = isSuppressedPath(pathname)
  const promoLive = isPromoLive()

  const visible = LIVE && !dismissed && !suppressed && !promoLive
  useEffect(() => {
    if (!visible) return
    trackEvent("promo_banner_view", { promo_variant: CAMPAIGN, locale: loc, page_path: pathname })
  }, [visible, loc, pathname])

  if (!visible) return null

  const href = `${siteConfig.appSignupUrl}&ref=banner-scan`

  return (
    <div role="region" aria-label={t.lead} className="bg-accent-700 px-3 py-2 text-white sm:px-4" data-banner-campaign={CAMPAIGN}>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-center text-[13px] leading-snug sm:text-sm">
        <p className="min-w-0">
          <strong className="font-semibold">{t.lead}</strong> {t.body}
        </p>
        <a
          href={href}
          onClick={() => trackEvent("promo_banner_click", { promo_variant: CAMPAIGN, locale: loc, page_path: pathname })}
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
            trackEvent("promo_banner_dismiss", { promo_variant: CAMPAIGN, locale: loc, page_path: pathname })
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
