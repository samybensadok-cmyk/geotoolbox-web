"use client"

import { useBfLive } from "@/components/promo/use-bf-live"
import { BF, BF_CARD_COPY, BF_SERVICES, bfEndLabel, bfLocale, bfServicePrice, fmtUsd, formatBfCountdown, parseUsd } from "@/lib/black-friday"
import { useCountdown } from "@/components/promo/use-countdown"
import { BfCountdown } from "@/components/promo/bf-countdown"
import b from "./black-friday-services.module.css"

/**
 * SG_BF2026_SVC_V1 — Black Friday display on the services pages (EN only; the services pages are EN-only).
 * Discount is applied server-side by service_checkout.php for the three direct-buy items; these components only
 * show it. Client-only (server snapshot = not live) so a statically rendered page never freezes the offer into
 * HTML after the end date; a 30 s tick flips it in an open tab.
 * Dark-kit look (2026-11-28): the services pages render inside <DarkPage>; the Black Friday yellow stays the
 * promo color (same as the site-wide promo bar), lime stays the brand accent.
 */
export { useBfLive }

const isDirectBuy = (href?: string) => !!href && BF_SERVICES.directBuyRe.test(href)

/** Price with the list price struck through + a red "-25%" badge, for direct-buy items while live. */
export function BfServicePrice({ price, href, size = "md" }: { price: string; href?: string; size?: "md" | "lg" }) {
  const live = useBfLive()
  const list = parseUsd(price)
  if (!live || !isDirectBuy(href) || list === null) return <>{price}</>
  return (
    <span className={b.price}>
      <s className={`${b.was} ${size === "lg" ? b.wasLg : b.wasMd}`}>{fmtUsd(list)}</s>
      <span className={b.now}>{fmtUsd(bfServicePrice(list))}</span>
      <span className={b.off}>
        −{BF_SERVICES.percentOff}%
      </span>
    </span>
  )
}

/** Replaces the list amount inside a CTA label ("Buy the Report — $1,250") with the Black Friday amount. */
export function BfServiceLabel({ label, href }: { label: string; href?: string }) {
  const live = useBfLive()
  const list = parseUsd(label)
  if (!live || !isDirectBuy(href) || list === null) return <>{label}</>
  return <>{label.replace(/\$\s?[\d,]+(?:\.\d+)?/, fmtUsd(bfServicePrice(list)))}</>
}

/** "From $6,500"-style call-based offers: a small "15% off month 1" note while live. */
export function BfRetainerNote({ href }: { href?: string }) {
  const live = useBfLive()
  if (!live || isDirectBuy(href)) return null
  return (
    <span className={b.note}>
      Black Friday: {BF_SERVICES.retainerMonth1PercentOff}% off month 1 if signed by Dec 2
    </span>
  )
}

/** Full-width band at the top of every services page while the offer is live. */
export function BfServicesBand() {
  const live = useBfLive()
  const msLeft = useCountdown(live ? Math.floor(Date.parse(BF.endIso) / 1000) : null)
  if (!live) return null
  return (
    <section aria-label="Black Friday offer on services" className={b.band}>
      <div className={b.bandInner}>
        <div className={b.bandCopy}>
          <p className={b.bandHead}>
            <span className={b.chip}>BLACK FRIDAY</span>
            <strong className={b.bandTitle}>{BF_SERVICES.percentOff}% off our done-for-you services</strong>
          </p>
          <p className={b.bandPrices}>
            {([["Visibility Report", 1250], ["Flagship article", 450], ["Cluster sprint", 3500]] as const).map(([name, usd]) => (
              <span key={name} className={b.bandItem}>
                {name} <s>{fmtUsd(usd)}</s> <b>{fmtUsd(bfServicePrice(usd))}</b>
              </span>
            ))}
          </p>
          <p className={b.bandTerms}>
            Sprints and retainers: {BF_SERVICES.retainerMonth1PercentOff}% off month 1. Ends {bfEndLabel("en")}, 11:59 PM PT.
          </p>
        </div>
        <div className={b.bandSide}>
          {msLeft !== null && msLeft > 0 && (
            <span className={b.countdown} aria-live="off">
              <span className={b.endsIn}>Ends in</span>
              <BfCountdown msLeft={msLeft} locale="en" size="sm" />
              <span className="sr-only">{formatBfCountdown(msLeft, "en")}</span>
            </span>
          )}
          <a href="#pricing" className={b.dealsBtn}>
            See deals <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </section>
  )
}

/**
 * SG_BF2026_V2 — "Pricing [−40%]" nav pill while live (Rank Math "Pricing SALE", Surfer "Pricing • BF SALE").
 * Desktop: lg+ only — the md nav has ~30 px headroom in FR/DE at 768 px (see header.tsx), the pill is ~38 px.
 */
export function BfNavPill({ locale, className = "" }: { locale?: string; className?: string }) {
  const live = useBfLive()
  if (!live) return null
  return (
    <span className={`ml-1.5 rounded-full bg-yellow-400 px-1.5 py-px text-[10px] font-extrabold leading-4 text-neutral-950 ${className}`}>
      {BF_CARD_COPY[bfLocale(locale)].toggle}
    </span>
  )
}
