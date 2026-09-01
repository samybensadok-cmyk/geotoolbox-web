import type { Metadata } from "next"
import Link from "next/link"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { PricingCards, type PricingCardsCopy } from "@/components/pricing/pricing-cards"
import { ComparisonTable, type ComparisonCopy } from "@/components/pricing/comparison-table"
import { TryFreeBand, type TryFreeCopy } from "@/components/pricing/try-free-band"
import { FeatureFaq } from "@/components/features/feature-faq"
import { JsonLd } from "@/components/seo/json-ld"
import { siteConfig } from "@/lib/config"
import { PLANS } from "@/lib/plans"
import { marketingAlternatesFor } from "@/lib/i18n/siblings"

// Localized pricing page: en at /pricing, fr at /fr/pricing. Relocated from
// app/(marketing)/pricing/page.tsx (Next forbids a (marketing) route colliding
// with the [locale] segment). ALL copy comes from the `pricing` message
// namespace.
//
// What is structurally safe vs merely checked:
//  - PRICES and the included/excluded checkmarks are COMPUTED from lib/plans.ts
//    (the catalog only supplies word templates and `null` cells), so no
//    translation can alter them.
//  - The per-card quota lines and the comparison table's string cells are
//    DUPLICATED display copy, because they have to be translatable. Those can
//    go stale if plans.ts changes. `npm run check:pricing` is the guard that
//    catches it — run it after any plans.ts edit.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "pricing.meta" })
  const path = locale === routing.defaultLocale ? "/pricing" : `/${locale}/pricing`
  return {
    // `absolute` because the root template appends " | GEO Toolbox"; the brand
    // is baked into the message so both locales render the intended <title>.
    title: { absolute: t("title") },
    description: t("description"),
    alternates: marketingAlternatesFor("/pricing", locale),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: path,
      type: "website",
    },
  }
}

const ENGINES = [
  "ChatGPT",
  "Perplexity",
  "Google AI Overviews",
  "Google AI Mode",
  "Gemini",
  "Bing Copilot",
  "Claude",
  "Grok",
]

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("pricing")
  const tBlog = await getTranslations("blog")
  const base = locale === routing.defaultLocale ? "" : `/${locale}`

  const cardsCopy = t.raw("cards") as PricingCardsCopy
  const compareCopy = t.raw("compare") as ComparisonCopy
  const included = t.raw("included.items") as string[]
  const creditCards = t.raw("credits.cards") as { t: string; d: string }[]
  const tryFreeCopy = t.raw("tryFree") as TryFreeCopy
  const faq = t.raw("faq.items") as { question: string; answer: string }[]

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tBlog("home"), item: `${siteConfig.url}${base || ""}` },
      { "@type": "ListItem", position: 2, name: t("hero.eyebrow"), item: `${siteConfig.url}${base}/pricing` },
    ],
  }

  const priced = PLANS.filter((p) => p.priceMonthly !== null).map((p) => p.priceMonthly as number)
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    description: siteConfig.description,
    url: `${siteConfig.url}${base}/pricing`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    publisher: { "@id": `${siteConfig.url}/#organization` },
    offers: {
      "@type": "AggregateOffer",
      // FR displays (and Stripe bills) EUR at identical numeric amounts
      // (SG_EUR_CHECKOUT_V1), so the schema currency follows the locale.
      // offerCount counts only self-serve priced tiers — Enterprise is
      // custom-quoted and sits outside the low/high range.
      priceCurrency: locale === "fr" ? "EUR" : "USD",
      lowPrice: String(Math.min(...priced)),
      highPrice: String(Math.max(...priced)),
      offerCount: priced.length,
    },
  }

  return (
    <>
      <JsonLd data={[breadcrumb, productSchema]} />

      {/* Hero + cards */}
      <section className="bg-white px-6 pt-16 pb-12 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">{t("hero.eyebrow")}</p>
          <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
            {t("hero.h1a")} <span className="text-accent-700">{t("hero.h1accent")}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
            {t("hero.sub")}
          </p>
        </div>

        {/* Core features included on every plan — cards only show
            per-tier deltas, so the shared baseline needs its own, visible-enough
            band. Moved ABOVE the cards (was a barely-visible gray strip below them,
            easy to miss entirely) so visitors see the shared floor before comparing
            what each tier adds on top of it. */}
        <div className="mx-auto mt-10 max-w-4xl">
          <div className="rounded-2xl border border-accent-200 bg-accent-50/50 px-6 py-6 sm:px-10">
            <p className="text-center font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
              {t("included.label")}
            </p>
            <ul className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {included.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-1.5 rounded-full border border-accent-200 bg-white px-3.5 py-1.5 text-[13px] font-semibold text-gray-800 shadow-sm"
                >
                  <svg className="h-3.5 w-3.5 shrink-0 text-accent-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M3 8.5 6.5 12 13 4.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-7xl">
          <PricingCards copy={cardsCopy} locale={locale} />
        </div>

        {/* SG_PRICING_V2 2026-07-27: the Starter promo strip that used to sit here
            is REMOVED (it advertised the retired $39/$49 pricing); the
            `pricing.strip.*` keys were deleted from messages/*.json in v2.1. */}
      </section>

      {/* SG_PRICING_TRYFREE_V1: the no-card way in — sits between the cards and
          the credits explainer, so a visitor who balks at the card requirement
          meets the free tools before the billing mechanics. */}
      <TryFreeBand copy={tryFreeCopy} />

      {/* How credits work — the make-or-break explainer */}
      <section className="border-t border-gray-100 bg-accent-50/40 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[clamp(1.4rem,2.6vw,2rem)] font-bold tracking-tight text-gray-900">
              {t("credits.h2")}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-gray-700">
              {t("credits.sub")}
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {creditCards.map((c) => (
              <div key={c.t} className="rounded-2xl border border-gray-200 bg-white p-6">
                <h3 className="text-[15px] font-bold text-gray-900">{c.t}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-gray-600">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engine trust bar */}
      <section className="border-t border-gray-100 bg-white px-6 py-12">
        <div className="mx-auto max-w-5xl text-center">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
            {t("engines.label")}
          </p>
          <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {ENGINES.map((e) => (
              <li key={e} className="text-[14px] font-semibold text-gray-700">
                {e}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Full comparison */}
      <ComparisonTable copy={compareCopy} locale={locale} />

      {/* Enterprise band */}
      <section className="bg-gray-950 px-6 py-16">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-400">{t("enterprise.eyebrow")}</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">{t("enterprise.h2")}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-gray-300">
              {t("enterprise.body")}
            </p>
          </div>
          <Link
            href="https://calendly.com/samy-bensadok/30min-call"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-colors hover:bg-gray-100"
          >
            {t("enterprise.cta")}
          </Link>
        </div>
      </section>

      <FeatureFaq items={faq} heading={t("faq.heading")} />

      {/* Final CTA */}
      <section className="border-t border-gray-100 bg-white px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-[clamp(1.6rem,3vw,2.5rem)] font-bold tracking-tight text-gray-900">
            {t("finalCta.h2")}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-gray-600">
            {t("finalCta.body")}
          </p>
          <Link
            // FR checkout bills EUR — pass the currency explicitly so
            // js/auth.js's sgCheckoutCurrency() doesn't have to guess.
            href={`${siteConfig.appSignupUrl}${locale === "fr" ? "&currency=eur" : ""}`}
            prefetch={false}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-accent-900 px-8 py-4 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-accent-800 hover:shadow-xl hover:shadow-accent-900/25"
          >
            {t("finalCta.cta")}
          </Link>
        </div>
      </section>
    </>
  )
}
