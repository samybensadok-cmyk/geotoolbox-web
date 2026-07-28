"use client"

/**
 * SG_CONSENT_V1 (2026-07-28) — consent banner + hard gate for GA4 and Clarity.
 *
 * Replaces the unconditional <ClarityAnalytics/> + <GoogleAnalytics/> mounts in
 * RootShell. Decision tree (all client-side, first effect):
 *
 *   sg_consent=granted            → mount trackers, no banner
 *   sg_consent=denied             → nothing, no banner
 *   no cookie + non-EEA country   → mount trackers, no banner (unchanged UX)
 *   no cookie + EEA/unknown       → banner shown, trackers HARD-GATED until
 *                                   Accept (CNIL-strict: no tag fires at all
 *                                   before consent — no cookieless pings)
 *
 * Country comes from the sg_cc cookie, populated once via /consent/geo (edge
 * header probe, 24h cache). Unknown fails CLOSED. Accept mounts the trackers
 * immediately (no reload); Refuse persists for 6 months. The footer's "Cookie
 * settings" button re-opens the banner via CONSENT_OPEN_EVENT.
 *
 * SEO note: only measurement scripts are gated — content, meta and structured
 * data render identically; the banner is position:fixed (zero CLS) and
 * Googlebot (US IPs) never triggers the EEA path.
 */

import { useCallback, useEffect, useState } from "react"
import { ClarityAnalytics } from "@/components/analytics/clarity"
import { GoogleAnalytics } from "@/components/analytics/google-analytics"
import {
  CONSENT_OPEN_EVENT,
  cacheCountry,
  getCachedCountry,
  getConsent,
  requiresConsent,
  setConsent,
} from "@/lib/consent"

const COPY = {
  en: {
    text: "We use cookies for analytics (Google Analytics, Microsoft Clarity) to understand how the site is used. Strictly necessary cookies are always on.",
    accept: "Accept",
    refuse: "Refuse",
    policy: "Privacy policy",
    policyHref: "/privacy",
    dialogLabel: "Cookie consent",
  },
  fr: {
    text: "Nous utilisons des cookies de mesure d’audience (Google Analytics, Microsoft Clarity) pour comprendre l’usage du site. Les cookies strictement nécessaires sont toujours actifs.",
    accept: "Accepter",
    refuse: "Refuser",
    policy: "Politique de confidentialité",
    policyHref: "/privacy",
    dialogLabel: "Consentement aux cookies",
  },
} as const

export function ConsentManager({ locale = "en" }: { locale?: string }) {
  const [trackersOn, setTrackersOn] = useState(false)
  const [bannerOpen, setBannerOpen] = useState(false)
  const copy = COPY[locale === "fr" ? "fr" : "en"]

  // Initial decision. Runs client-only; until it resolves, nothing loads —
  // fail-closed by construction.
  useEffect(() => {
    const consent = getConsent()
    if (consent === "granted") { setTrackersOn(true); return }
    if (consent === "denied") return

    const decide = (country: string) => {
      if (requiresConsent(country)) setBannerOpen(true)
      else setTrackersOn(true)
    }

    const cached = getCachedCountry()
    if (cached !== "") { decide(cached); return } // "unknown" sentinel is a valid cache hit (fails closed in decide)

    let cancelled = false
    fetch("/consent/geo", { credentials: "omit" })
      .then((r) => (r.ok ? r.json() : { c: "" }))
      .then((d: { c?: string }) => {
        if (cancelled) return // StrictMode replay: only the live effect writes + decides
        cacheCountry((d.c ?? "").toUpperCase())
        decide((d.c ?? "").toUpperCase())
      })
      .catch(() => { if (!cancelled) decide("") }) // network failure → fail closed (banner)
    return () => { cancelled = true }
  }, [])

  // Footer "Cookie settings" re-opens the banner (works after refuse OR accept).
  useEffect(() => {
    const open = () => setBannerOpen(true)
    window.addEventListener(CONSENT_OPEN_EVENT, open)
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, open)
  }, [])

  const accept = useCallback(() => {
    setConsent("granted")
    setBannerOpen(false)
    setTrackersOn(true)
  }, [])

  const refuse = useCallback(() => {
    setConsent("denied")
    setBannerOpen(false)
    // CNIL hygiene (Fable P3-5): best-effort expiry of tracker cookies already
    // set by a prior acceptance. GA sets _ga* with Domain=.<apex>, Clarity sets
    // _clck/_clsk host-only — expire under both scopes; unknown names are left
    // alone. Failures are non-fatal (the trackers themselves stay unloaded).
    try {
      const apex = "." + window.location.hostname.split(".").slice(-2).join(".")
      document.cookie.split(";").forEach((part) => {
        const name = part.split("=")[0].trim()
        if (/^(_ga|_gid|_gat|_clck|_clsk)/.test(name)) {
          document.cookie = `${name}=; path=/; max-age=0`
          document.cookie = `${name}=; path=/; domain=${apex}; max-age=0`
        }
      })
    } catch { /* non-fatal */ }
    // If trackers were already mounted (settings reopened after accept), a
    // reload is the only clean way to unload them — scripts can't be un-run.
    if (trackersOn) window.location.reload()
  }, [trackersOn])

  return (
    <>
      {trackersOn && (
        <>
          <ClarityAnalytics />
          <GoogleAnalytics />
        </>
      )}
      {bannerOpen && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label={copy.dialogLabel}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] backdrop-blur sm:px-6"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center">
            <p className="flex-1 text-[13px] leading-snug text-gray-700">
              {copy.text}{" "}
              <a href={copy.policyHref} className="underline decoration-gray-400 underline-offset-2 hover:text-gray-900">
                {copy.policy}
              </a>
            </p>
            {/* CNIL: refusing must be as easy as accepting — two equal buttons. */}
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={refuse}
                className="rounded-full border border-gray-300 px-4 py-1.5 text-[13px] font-semibold text-gray-700 hover:border-gray-400"
              >
                {copy.refuse}
              </button>
              <button
                type="button"
                onClick={accept}
                className="rounded-full bg-gray-900 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-gray-700"
              >
                {copy.accept}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
