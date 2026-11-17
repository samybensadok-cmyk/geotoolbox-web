"use client"

import { useBfLive } from "@/components/promo/use-bf-live"
import { BF, BF_SERVICES, bfEndLabel, bfServicePrice, fmtUsd, formatBfCountdown, parseUsd } from "@/lib/black-friday"
import { useCountdown } from "@/components/promo/use-countdown"

/**
 * SG_BF2026_SVC_V1 — Black Friday display on the services pages (EN only; the services pages are EN-only).
 * Discount is applied server-side by service_checkout.php for the three direct-buy items; these components only
 * show it. Client-only (server snapshot = not live) so a statically rendered page never freezes the offer into
 * HTML after the end date; a 30 s tick flips it in an open tab.
 */
export { useBfLive }

const isDirectBuy = (href?: string) => !!href && BF_SERVICES.directBuyRe.test(href)

/** Price with the list price struck through + a red "-25%" badge, for direct-buy items while live. */
export function BfServicePrice({ price, href, size = "md" }: { price: string; href?: string; size?: "md" | "lg" }) {
  const live = useBfLive()
  const list = parseUsd(price)
  if (!live || !isDirectBuy(href) || list === null) return <>{price}</>
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <s className={`font-medium text-gray-400 decoration-red-500 decoration-2 ${size === "lg" ? "text-[0.6em]" : "text-[0.7em]"}`}>{fmtUsd(list)}</s>
      <span className="text-red-600">{fmtUsd(bfServicePrice(list))}</span>
      <span className="self-center rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-white" style={{ fontSize: "11px", lineHeight: 1.4 }}>
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
    <span className="mt-1 inline-block rounded-full bg-red-50 px-2.5 py-0.5 text-[12px] font-bold text-red-700 ring-1 ring-red-200">
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
    <section aria-label="Black Friday offer on services" className="bg-neutral-950 px-4 py-5 text-white sm:py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <p className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
            <span className="rounded-sm bg-yellow-400 px-2 py-0.5 text-[11px] font-extrabold tracking-[0.12em] text-neutral-950">BLACK FRIDAY</span>
            <strong className="text-xl font-extrabold sm:text-2xl">{BF_SERVICES.percentOff}% off our done-for-you services</strong>
          </p>
          <p className="mt-1.5 text-[14px] text-white/80">
            {([["Visibility Report", 1250], ["Flagship article", 450], ["Cluster sprint", 3500]] as const).map(([name, usd], i) => (
              <span key={name} className="whitespace-nowrap">
                {i > 0 && " · "}
                {name} <s className="text-white/50">{fmtUsd(usd)}</s> <b className="text-yellow-300">{fmtUsd(bfServicePrice(usd))}</b>
              </span>
            ))}
          </p>
          <p className="mt-1 text-[12.5px] text-white/60">
            Sprints and retainers: {BF_SERVICES.retainerMonth1PercentOff}% off the first month when signed by {bfEndLabel("en")}, 11:59 PM PT. Discount applied automatically at checkout.
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-center gap-2">
          {msLeft !== null && msLeft > 0 && (
            <span className="font-mono text-[13px] tabular-nums text-white/80">
              Ends in <b className="text-white">{formatBfCountdown(msLeft, "en")}</b>
            </span>
          )}
          <a href="#pricing" className="inline-flex items-center gap-1 rounded-full bg-yellow-400 px-5 py-2 text-[14px] font-bold text-neutral-950 hover:bg-yellow-300">
            See the deals <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </section>
  )
}
