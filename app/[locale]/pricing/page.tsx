import styles from "@/components/pricing/pricing-experience.module.css"
import { DarkPage, Index, Arrow, kit as k } from "@/components/brand/dark-kit"
import type { Metadata } from "next"
import Link from "next/link"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { PricingCards, type PricingCardsCopy } from "@/components/pricing/pricing-cards"
import { ComparisonTable, type ComparisonCopy } from "@/components/pricing/comparison-table"
import { TryFreeBand, type TryFreeCopy } from "@/components/pricing/try-free-band"
import { PromoSignupLink } from "@/components/pricing/promo-signup-link"
import { SaleStrip } from "@/components/pricing/sale-strip"
import { AnnualBonusStrip } from "@/components/pricing/annual-bonus-strip"
import { BlackFridayStrip } from "@/components/pricing/black-friday-strip"
import { PricingFaq } from "@/components/pricing/pricing-faq"
import { ThreeWays } from "@/components/pricing/three-ways"
import { JsonLd } from "@/components/seo/json-ld"
import { siteConfig } from "@/lib/config"
import { PLANS } from "@/lib/plans"
import { marketingAlternatesFor } from "@/lib/i18n/siblings"
import { priceCurrency, currencyParam } from "@/lib/i18n/currency"

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
// The "Do it yourself" way in the three-ways block links back up to the cards.
const PLANS_ANCHOR = "plans"

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
      priceCurrency: priceCurrency(locale),
      lowPrice: String(Math.min(...priced)),
      highPrice: String(Math.max(...priced)),
      offerCount: priced.length,
    },
  }

  return (
    <>
      <JsonLd data={[breadcrumb, productSchema]} />

      {/* Dark kit (2026-11-28): presentation only; copy, links, tracking and JSON-LD are unchanged. */}
      <DarkPage>
      <section className={`${k.heroGlow} ${styles.hero}`}>
        <div className={k.wrap}>
          <Index label={t("hero.eyebrow")} />
          <h1 className={styles.heroTitle}>
            {t("hero.h1a")} <span>{t("hero.h1accent")}</span>
          </h1>
          <div className={styles.heroFoot}>
            <p className={styles.heroSub}>{t("hero.sub")}</p>
          </div>
        </div>
      </section>

      {/* Plans: offer strips, the audience/billing toggles and the cards, then what every plan includes. */}
      <section className={styles.plans}>
        <div className={k.wrap}>
        <SaleStrip locale={locale} />
        <AnnualBonusStrip locale={locale} />
        <BlackFridayStrip locale={locale} />
        <div id={PLANS_ANCHOR} className={styles.plansAnchor}>
          <PricingCards copy={cardsCopy} locale={locale} creditsLabel={compareCopy.groups[0].rows[0].label} />
        </div>

        {/* Shared features follow the plan decision. */}
        <div className={styles.included}>
          <p className={k.index}>{t("included.label")}</p>
          <ul className={k.tags}>
            {included.map((f) => (
              <li key={f}>
                <svg className={styles.tagCheck} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                  <path d="M3 8.5 6.5 12 13 4.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* SG_PRICING_V2 2026-07-27: the Starter promo strip that used to sit here
            is REMOVED (it advertised the retired $39/$49 pricing); the
            `pricing.strip.*` keys were deleted from messages/*.json in v2.1. */}
        </div>
      </section>

      {/* Three ways to work (2026-11-28): the plans above, done with you, done for you. */}
      <ThreeWays locale={locale} plansAnchor={PLANS_ANCHOR} />

      {/* How credits work — the make-or-break explainer, as a compact row */}
      <section className={`${k.section} ${k.sectionBorder}`}>
        <div className={`${k.wrap} ${styles.credits}`}>
          <div>
            <h2 className={styles.creditsTitle}>{t("credits.h2")}</h2>
            <p className={styles.creditsSub}>{t("credits.sub")}</p>
          </div>
          <ol className={styles.steps}>
            {creditCards.map((c, i) => (
              <li key={c.t}>
                <span aria-hidden="true" className={styles.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                <h3>{c.t}</h3>
                <p>{c.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Full comparison */}
      <div className={k.wrap}>
        <details className={styles.compare}>
          <summary className={styles.compareSummary}><span className={styles.compareTitle}>{t("compare.h2")}</span><span aria-hidden="true" className={styles.plus}>+</span></summary>
          <ComparisonTable copy={compareCopy} locale={locale} headingHidden />
        </details>
      </div>

      {/* Enterprise band */}
      <section className={k.section}>
        <div className={k.wrap}>
          <div className={styles.enterprise}>
            <div>
              <p className={k.index}>{t("enterprise.eyebrow")}</p>
              <h2 className={styles.enterpriseTitle}>{t("enterprise.h2")}</h2>
              <p className={styles.enterpriseBody}>{t("enterprise.body")}</p>
            </div>
            <Link
              href="https://calendly.com/samy-bensadok/30min-call"
              data-cta-placement="pricing_enterprise"
              target="_blank"
              rel="noopener noreferrer"
              className={k.btnOutline}
            >
              {t("enterprise.cta")} <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      <TryFreeBand copy={tryFreeCopy} />

      <PricingFaq items={faq} heading={t("faq.heading")} />

      {/* Final CTA */}
      <section className={k.section}>
        <div className={k.wrap}>
          <div className={styles.final}>
            <h2 className={styles.finalTitle}>
              {t("finalCta.h2")}
            </h2>
            <p className={styles.finalBody}>
              {t("finalCta.body")}
            </p>
            <PromoSignupLink
              // FR checkout bills EUR — pass the currency explicitly so
              // js/auth.js's sgCheckoutCurrency() doesn't have to guess.
              // SG_PROMO_ORGANIC_V1: and carry the founding offer, so the page's LAST CTA does
              // not quietly drop the discount its cards just advertised.
              href={`${siteConfig.appSignupUrl}${currencyParam(locale)}`}
              className={`${k.btnLime} ${styles.finalCta}`}
            >
              {t("finalCta.cta")}<Arrow />
            </PromoSignupLink>
          </div>
        </div>
      </section>
      </DarkPage>
    </>
  )
}
