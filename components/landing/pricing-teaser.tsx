import Link from "next/link"
import { getTranslations, getLocale } from "next-intl/server"
import { PLANS, type PlanId } from "@/lib/plans"
import { siteConfig } from "@/lib/config"

/**
 * PricingTeaser — the transparency wedge, on the homepage.
 *
 * Most platforms in this category gate pricing behind a demo call; ours is
 * public down to the credit counts. Prices are read from lib/plans.ts (the
 * single source of truth) — only the copy lives in messages. Three paid
 * tiers on the card row (Free anchors low and stays off the homepage);
 * the full ladder lives on /pricing.
 */
const TEASER_IDS: PlanId[] = ["starter", "consultant", "agency"]

export async function PricingTeaser() {
  const t = await getTranslations("home.pricingTeaser")
  const locale = await getLocale()
  const base = locale === "en" ? "" : `/${locale}`
  // FR writes prices postfix, EN prefix. SG_PRICING_V2 2026-07-27: FR now quotes
  // EUR with the SAME numbers, no FX conversion ($299 -> 299 €) — the Stripe tier
  // Prices carry currency_options[eur] at identical amounts to match.
  const fmtPrice = (n: number) => (locale === "fr" ? `${n} €` : `$${n}`)
  const tiles = TEASER_IDS.map((id) => {
    const plan = PLANS.find((p) => p.id === id)!
    return {
      id,
      name: plan.name,
      priceMonthly: plan.priceMonthly ?? 0,
      annualPerMonth:
        plan.priceYearly && plan.priceYearly > 0 ? Math.round(plan.priceYearly / 12) : null,
      tagline: t(`tiles.${id}.tagline`),
      quotas: [
        t(`tiles.${id}.engines`),
        t(`tiles.${id}.credits`),
        t(`tiles.${id}.scans`),
      ],
    }
  })

  return (
    <section className="relative overflow-hidden bg-gray-950 px-6 py-24 sm:py-28">
      {/* Subtle grid bleed — same texture family as the closing CTA panel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[6fr_6fr] lg:items-end lg:gap-16">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-300">
              {t("eyebrow")}
            </p>
            <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-tight tracking-tight text-white">
              {t("h2")}
            </h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-gray-300">
            {t("intro")}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {tiles.map((tile) => (
            <div
              key={tile.id}
              className="rounded-3xl border border-gray-800 bg-white/[0.03] p-7 transition-colors hover:border-gray-700"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-[15px] font-semibold uppercase tracking-wider text-gray-300">
                  {tile.name}
                </h3>
                {tile.annualPerMonth !== null && (
                  <span className="font-mono text-[11px] text-gray-400">
                    {t("annualPrefix")} {fmtPrice(tile.annualPerMonth)}
                    {t("perMonth")}
                  </span>
                )}
              </div>
              <p className="mt-4 flex items-baseline gap-1.5">
                <span className="font-mono text-5xl font-bold tabular-nums tracking-tight text-white">
                  {fmtPrice(tile.priceMonthly)}
                </span>
                <span className="font-mono text-sm text-gray-400">{t("perMonth")}</span>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-gray-400">{tile.tagline}</p>
              <ul className="mt-6 space-y-2 border-t border-gray-800 pt-5">
                {tile.quotas.map((q) => (
                  <li key={q} className="flex items-center gap-2.5 font-mono text-[12px] text-gray-400">
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-lg text-sm leading-relaxed text-gray-400">{t("note")}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`${base}/pricing`}
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 hover:shadow-xl hover:shadow-black/30 active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
            >
              {t("seeAll")}
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href={siteConfig.appSignupUrl} prefetch={false}
              className="rounded-sm text-[13px] font-medium text-gray-400 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
            >
              {t("startFree")} &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
