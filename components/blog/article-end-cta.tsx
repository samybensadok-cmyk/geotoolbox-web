"use client"

import Link from "next/link"
import { trackEvent } from "@/lib/analytics"
import { promoQuery, resolveOfferFromLocation } from "@/lib/promo"
import { currencyParam } from "@/lib/i18n/currency"

/**
 * SG_BLOG_CTA_V2 (2026-09-01) — the page-closing CTA for articles and glossary terms.
 *
 * Three things changed from what it replaced:
 *
 * 1. **Destination.** It pointed at `/app`, which for an anonymous visitor renders the full
 *    logged-out application shell — ~25 sidebar tabs and the Content Studio panel, with no
 *    framing, no explanation, and the only signup affordance a small button in the sidebar
 *    footer (verified against the live rewrite target on 2026-09-01). A button labelled
 *    "try for free" / "run a free scan" now lands on the signup form, which is what it promises.
 *
 * 2. **Attribution.** `blog_cta_click` fires before the hop to the Replit backend, which records
 *    no landing params of its own (no `$_GET['ref']` reader, no utm capture at signup). `ref=`
 *    is a breadcrumb, deliberately not `utm_*` — an internal `utm_source` makes GA4 start a new
 *    session and overwrites the visitor's real acquisition source.
 *
 * 3. **The founding offer.** The sitewide banner advertises 30% off on these pages. A reader who
 *    saw the banner but did not click it used to reach checkout at list price — the same
 *    read-30%-get-list mismatch that was fixed on /pricing, re-created on the highest-traffic
 *    surface. The offer is resolved with the SAME precedence /pricing uses (URL param, then a
 *    stored banner click, then the live public offer) and is `isPromoLive()`-gated, so it
 *    disappears on its own after the deadline.
 *
 * Resolved client-side, so the href gains the offer on hydration.
 */

let cacheKey: string | null = null
let cacheVal = ""

function offerSuffix(): string {
  const key = typeof window === "undefined" ? "" : window.location.search
  if (cacheKey !== key) {
    cacheKey = key
    cacheVal = promoQuery(resolveOfferFromLocation())
  }
  return cacheVal
}

export function ArticleEndCta({
  label,
  slug,
  locale,
  className,
  surface = "blog",
}: {
  label: string
  slug: string
  locale: string
  className?: string
  /** which content surface this rendered on — becomes the ref breadcrumb and the GA4 param */
  surface?: "blog" | "glossary"
}) {
  // FR checkout bills EUR (SG_EUR_CHECKOUT_V1). /pricing passes the currency explicitly rather
  // than letting js/auth.js's sgCheckoutCurrency() fall through to navigator.language; these
  // links now do the same, so a French-page reader on an English browser is not quoted USD.
  const currency = currencyParam(locale)
  const href = `/app/?page=signup&interval=monthly${currency}&ref=${surface}-end`

  return (
    <Link
      href={href + offerSuffix()}
      prefetch={false}
      onClick={() =>
        trackEvent("blog_cta_click", { placement: `${surface}_end`, cta_target: "signup", article: slug, locale })
      }
      className={className}
    >
      {label}
      <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  )
}
