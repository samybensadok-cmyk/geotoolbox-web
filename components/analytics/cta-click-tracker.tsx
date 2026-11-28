"use client"

import { useEffect } from "react"
import { trackEvent } from "@/lib/analytics"

/**
 * SG_SERVICE_CLICKS_V1 (2026-11-28) — counts clicks on the two links that end a service-page visit:
 * a booking link (calendly.com) and the direct-buy Stripe checkout (/app/?action=service_checkout).
 *
 * Why one delegated listener instead of an onClick per link: the booking link is hard-coded in five files
 * (service pages, pricing page, comparison table, lib/plans.ts, scan results) and some of them are server
 * components. A single listener on `document` sees every one of them, plus links inside MDX articles.
 *
 * Capture phase + passive: it runs before any handler that could stop propagation, and it never blocks or
 * delays the navigation. It only reads the clicked anchor; it does not touch href, target or rel.
 *
 * Same consent rules as every other event: `trackEvent` is a no-op until GA4 is on `window`, so an EEA visitor
 * who has not accepted cookies is not counted (accepted, see ConsentManager).
 *
 * Params (see lib/analytics.ts): placement ← nearest ancestor `data-cta-placement`, else "unlabelled";
 * page_path; cta_target ← href without query string; `item` on buy clicks.
 */

const ITEM_RE = /^[a-z0-9_-]{1,32}$/

function classify(url: URL): { event: "book_call_click" | "service_buy_click"; item?: string } | null {
  const host = url.hostname.toLowerCase()
  if (host === "calendly.com" || host.endsWith(".calendly.com")) return { event: "book_call_click" }

  // Same-origin only: the checkout lives behind the Vercel rewrite /app/* -> backend.
  if (url.origin === window.location.origin && url.pathname.replace(/\/+$/, "") === "/app") {
    if (url.searchParams.get("action") === "service_checkout") {
      const item = url.searchParams.get("item") ?? ""
      return { event: "service_buy_click", item: ITEM_RE.test(item) ? item : undefined }
    }
  }
  return null
}

export function CtaClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      try {
        const el = e.target instanceof Element ? e.target : null
        const a = el?.closest("a[href]") as HTMLAnchorElement | null
        if (!a) return
        const url = new URL(a.href, window.location.href)
        const hit = classify(url)
        if (!hit) return
        const placement = a.closest("[data-cta-placement]")?.getAttribute("data-cta-placement") || "unlabelled"
        const external = url.origin !== window.location.origin
        trackEvent(hit.event, {
          placement,
          page_path: window.location.pathname,
          cta_target: external ? `${url.origin}${url.pathname}` : url.pathname,
          ...(hit.item ? { item: hit.item } : {}),
        })
      } catch {
        /* analytics must never break a click */
      }
    }
    document.addEventListener("click", onClick, { capture: true, passive: true })
    return () => document.removeEventListener("click", onClick, { capture: true })
  }, [])

  return null
}
