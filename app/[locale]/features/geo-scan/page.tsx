import type { Metadata } from "next"
import Link from "next/link"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { FeatureHero } from "@/components/features/feature-hero"
import { RelatedFeatures } from "@/components/features/related-features"
import { FeatureFaq } from "@/components/features/feature-faq"
import { ScreenshotFrame } from "@/components/features/screenshot-frame"
import { PainScenarioSection } from "@/components/features/pain-scenario"
import { ScoreLegend } from "@/components/features/score-legend"
import { HowItWorks3Step, type Step } from "@/components/features/how-it-works"
import { ActVsMonitorWedge } from "@/components/features/act-vs-monitor"
import { SocialProofBlock } from "@/components/features/social-proof"
import { FeatureComparisonTable } from "@/components/features/feature-comparison-table"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { softwareApplicationSchema, howToSchema } from "@/lib/seo-schema"
import { marketingAlternatesFor } from "@/lib/i18n/siblings"

// Localized GEO Scan feature page: en at /features/geo-scan, fr at
// /fr/features/geo-scan. Relocated from app/(marketing)/features/geo-scan.
// ALL display copy lives in the `featurePages.geo-scan` message namespace
// (shared strings in `featurePages.common`); structural data — slugs, hues,
// screenshot files/dimensions, cell booleans — stays here. Product, tier and
// engine names are never translated.

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "featurePages.geo-scan.meta" })
  return {
    title: { absolute: t("title") },
    description: t("description"),
    openGraph: { title: t("ogTitle"), description: t("ogDescription") },
    alternates: marketingAlternatesFor("/features/geo-scan", locale),
  }
}

type ScoreItem = { num: string; term: string; def: string }
type Outcome = { tag: string; title: string; body: string }
type Faq = { question: string; answer: string }
type CompRow = { label: string; cells: (boolean | string)[] }
type LegendTier = { band: string; label: string }

const LEGEND_TONES = ["bad", "mid", "good"] as const

export default async function GeoScanPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("featurePages.geo-scan")
  const c = await getTranslations("featurePages.common")
  const base = locale === routing.defaultLocale ? "" : `/${locale}`
  const urlBase = `${siteConfig.url}${base}`

  const steps = t.raw("how.steps") as Step[]
  const scoreItems = t.raw("score.items") as ScoreItem[]
  const comparisonColumns = t.raw("comparison.columns") as string[]
  const comparisonRows = t.raw("comparison.rows") as CompRow[]
  const outcomes = t.raw("outcomes.items") as Outcome[]
  const faqs = t.raw("faqs") as Faq[]
  const legendTiers = (c.raw("scoreLegend0100") as LegendTier[]).map((tier, i) => ({
    ...tier,
    tone: LEGEND_TONES[i],
  }))
  const cardDescriptions = c.raw("cardDescriptions") as Record<string, string>
  const breadcrumbLabels = { home: c("breadcrumbHome"), features: c("breadcrumbFeatures") }

  return (
    <>
      <JsonLd
        data={[
          softwareApplicationSchema({
            name: "GEO Scan",
            description: t("schema.appDescription"),
            url: `${urlBase}/features/geo-scan`,
          }),
          howToSchema({
            name: t("schema.howToName"),
            steps: steps.map((s) => ({ name: s.title, text: s.body })),
          }),
        ]}
      />

      {/* Hero — pain-led, dark opening act; the real scan result is the light source */}
      <FeatureHero
        featureName="GEO Scan"
        hue="teal"
        base={base}
        breadcrumbLabels={breadcrumbLabels}
        eyebrow={t("hero.eyebrow")}
        title={
          <>
            {t("hero.h1Lead")} <span className="text-accent-300">{t("hero.h1Accent")}</span>
            {t("hero.h1Tail")}
          </>
        }
        subhead={t("hero.subhead")}
        proof={t("hero.proof")}
        primaryLabel={t("hero.primaryLabel")}
        secondaryLabel={t("hero.secondaryLabel")}
        secondaryHref="#how"
        microcopy={t("hero.microcopy")}
      >
        {/* Real scan result as proof (anonymized, brand kept unnamed) */}
        <ScreenshotFrame
          src="/screenshots/geo-scan/ai-citation-lawyers-result.png"
          alt={t("hero.screenshotAlt")}
          width={1999}
          height={1602}
          priority
          caption={t("hero.screenshotCaption")}
        />
      </FeatureHero>

      {/* The cost of being invisible */}
      <PainScenarioSection
        eyebrow={t("pain.eyebrow")}
        scenario={t("pain.scenario")}
        bridge={t("pain.bridge")}
      />

      {/* What a scan gives you back — anchor the score + cited vs mentioned */}
      <section className="border-t border-[var(--surface-mint-border)] bg-[var(--surface-mint)] px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
            {t("score.eyebrow")}
          </p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            {t("score.h2")}
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-600">{t("score.intro")}</p>
          <div className="mt-6">
            <ScoreLegend tiers={legendTiers} />
          </div>
          <dl className="mt-8 divide-y divide-gray-200/70 border-y border-gray-200/70">
            {scoreItems.map(({ num, term, def }) => (
              <div key={term} className="flex items-baseline gap-4 py-4 sm:gap-6">
                <span
                  aria-hidden="true"
                  className="shrink-0 font-mono text-[15px] font-bold tabular-nums text-accent-500"
                >
                  {num}
                </span>
                <dt className="w-32 shrink-0 text-[14px] font-bold text-gray-900 sm:w-40">{term}</dt>
                <dd className="text-[13px] leading-relaxed text-gray-600">{def}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-[13px] leading-relaxed text-gray-500">{t("score.note")}</p>
        </div>
      </section>

      {/* How it works (HowTo schema source) */}
      <div id="how">
        <HowItWorks3Step heading={t("how.heading")} steps={steps} />
      </div>

      {/* Act, don't just monitor */}
      <ActVsMonitorWedge
        eyebrow={c("wedge.eyebrow")}
        headline={c("wedge.headline")}
        emphasis={c("wedge.emphasis")}
        body={t("wedge.body")}
        example={t("wedge.example")}
        link={{ label: t("wedge.linkLabel"), href: `${base}/features/content-analyzer` }}
      />

      {/* Proof — anonymized real-world case (a brand we run GEO for, kept unnamed) */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
            {t("proofSec.eyebrow")}
          </p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            {t("proofSec.h2")}
          </h2>
        </div>
        <div className="mt-10">
          <SocialProofBlock
            miniCase={{
              result: t("proofSec.miniResult"),
              attribution: t("proofSec.miniAttribution"),
            }}
            provenanceLine={t("proofSec.provenance")}
            engineGridLabel={c("engineGridLabel")}
          />
        </div>
      </section>

      {/* Comparison */}
      <section className="border-t border-[var(--surface-mint-border)] bg-[var(--surface-mint)] px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
            {t("comparison.eyebrow")}
          </p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            {t("comparison.h2")}
          </h2>
          <div className="mt-8">
            <FeatureComparisonTable
              columns={comparisonColumns}
              rows={comparisonRows}
              yesLabel={c("comparison.yes")}
              noLabel={c("comparison.no")}
            />
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
              {t("outcomes.eyebrow")}
            </p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
              {t("outcomes.h2")}
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
            {outcomes.map((o) => (
              <div key={o.tag}>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">{o.tag}</p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight text-gray-900">{o.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{o.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeatureFaq items={faqs} heading={c("faqHeading")} />

      <RelatedFeatures
        current="geo-scan"
        related={["domain-overview", "content-analyzer", "competitor-intel"]}
        base={base}
        copy={c.raw("related") as { eyebrow: string; heading: string; allFeatures: string; learnMore: string }}
        descriptions={cardDescriptions}
      />

      {/* Final CTA */}
      <section className="bg-gray-950 px-6 py-20 sm:py-24">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              {t("finalCta.h2")}
            </h2>
            <p className="mt-2 text-base text-gray-300">{t("finalCta.sub")}</p>
          </div>
          <Link
            href={siteConfig.appSignupUrl}
            prefetch={false}
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 active:translate-y-[1px]"
          >
            {t("finalCta.button")}
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  )
}
