"use client"

import Link from "next/link"
import { useSyncExternalStore } from "react"
import { promoQuery, resolveOfferFromLocation } from "@/lib/promo"

/**
 * SG_PROMO_ORGANIC_V1 (2026-09-01) — a signup link that carries whatever offer the visitor is
 * actually entitled to.
 *
 * /pricing has three routes to signup: the plan cards, the comparison table's "Choose" column,
 * and the closing CTA. Only the cards carried `?promo=`. That was survivable while the discount
 * was shown ONLY to banner-clickers — they also had the code in localStorage, so js/auth.js
 * recovered it at signup. It stopped being survivable the moment the cards began showing the
 * founding price to every visitor without writing storage: verified live on 2026-09-01, an
 * organic visitor read $69.30 on the Starter card and could then click "Choose" 400px below it
 * and reach checkout at $99.
 *
 * Resolved client-side (the page is statically prerendered), so the href gains the offer on
 * hydration — the same moment the card prices change.
 *
 * `useSyncExternalStore` rather than useEffect+setState: the value is read from `window`, is
 * constant for the life of the page, and this shape gives the server render an explicit empty
 * snapshot instead of a post-hydration re-render (and keeps react-hooks/set-state-in-effect
 * quiet). The snapshot MUST be referentially stable or React re-renders forever, hence the cache.
 *
 * `href` must already contain a `?` — `promoQuery` returns an `&`-prefixed fragment.
 */

let cacheKey: string | null = null
let cacheVal = ""

function getSnapshot(): string {
  const key = typeof window === "undefined" ? "" : window.location.search
  if (cacheKey !== key) {
    cacheKey = key
    cacheVal = promoQuery(resolveOfferFromLocation())
  }
  return cacheVal
}
const getServerSnapshot = () => ""
const subscribe = () => () => {}

export function PromoSignupLink({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: React.ReactNode
}) {
  const suffix = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  return (
    <Link href={href + suffix} prefetch={false} className={className}>
      {children}
    </Link>
  )
}
