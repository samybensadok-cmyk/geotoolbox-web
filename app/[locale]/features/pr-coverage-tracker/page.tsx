import type { Metadata } from "next"
import Link from "next/link"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { FeatureHero } from "@/components/features/feature-hero"
import { RelatedFeatures } from "@/components/features/related-features"
import { FeatureFaq } from "@/components/features/feature-faq"
import { ScreenshotFrame } from "@/components/features/screenshot-frame"
import { PainScenarioSection } from "@/components/features/pain-scenario"
import { HowItWorks3Step, type Step } from "@/components/features/how-it-works"
import { ActVsMonitorWedge } from "@/components/features/act-vs-monitor"
import { SocialProofBlock } from "@/components/features/social-proof"
import { FeatureComparisonTable } from "@/components/features/feature-comparison-table"
import { TrustSecurityBlock } from "@/components/features/trust-security"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { softwareApplicationSchema, howToSchema } from "@/lib/seo-schema"
import { marketingAlternatesFor } from "@/lib/i18n/siblings"

// Localized PR Coverage Tracker feature page: en at /features/pr-coverage-tracker,
// fr at /fr/features/pr-coverage-tracker. Relocated from
// app/(marketing)/features/pr-coverage-tracker. ALL display copy lives in the
// `featurePages.pr-coverage-tracker` namespace (shared strings in
// `featurePages.common`); structural data — hues, screenshot files/dimensions,
// comparison cell booleans — stays here. Quoted UI statuses inside the
// screenshot copy (Dead, Blocked, In Google …) stay English on both locales,
// since they mirror the English product UI. Product, tier and engine names are
// never translated.

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "featurePages.pr-coverage-tracker.meta" })
  return {
    title: { absolute: t("title") },
    description: t("description"),
    openGraph: { title: t("ogTitle"), description: t("ogDescription") },
    alternates: marketingAlternatesFor("/features/pr-coverage-tracker", locale),
  }
}

type Faq = { question: string; answer: string }
type CompRow = { label: string; cells: (boolean | string)[] }
type TrustItem = { title: string; body: string }

export default async function PrCoverageTrackerPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("featurePages.pr-coverage-tracker")
  const c = await getTranslations("featurePages.common")
  const base = locale === routing.defaultLocale ? "" : `/${locale}`
  const urlBase = `${siteConfig.url}${base}`

  const steps = t.raw("how.steps") as Step[]
  const trustItems = t.raw("trust.items") as TrustItem[]
  const comparisonColumns = t.raw("comparison.columns") as string[]
  const comparisonRows = t.raw("comparison.rows") as CompRow[]
  const faqs = t.raw("faqs") as Faq[]
  const cardDescriptions = c.raw("cardDescriptions") as Record<string, string>
  const breadcrumbLabels = { home: c("breadcrumbHome"), features: c("breadcrumbFeatures") }

  return (
    <>
      <JsonLd
        data={[
          softwareApplicationSchema({
            name: "PR Coverage Tracker",
            description: t("schema.appDescription"),
            url: `${urlBase}/features/pr-coverage-tracker`,
          }),
          howToSchema({
            name: t("schema.howToName"),
            steps: steps.map((s) => ({ name: s.title, text: s.body })),
          }),
        ]}
      />

      {/* Hero — pain-led, dark opening act; the real coverage table is the light source */}
      <FeatureHero
        featureName="PR Coverage Tracker"
        hue="amber"
        base={base}
        breadcrumbLabels={breadcrumbLabels}
        eyebrow={t("hero.eyebrow")}
        title={
          <>
            {t("hero.h1Lead")} <span className="text-accent-300">{t("hero.h1Accent")}</span>
            {t("hero.h1Tail")}
          </>
        }
        subhead={
          <>
            {t("hero.subhead.pre")}<em>{t("hero.subhead.em1")}</em>{t("hero.subhead.mid1")}
            <em>{t("hero.subhead.em2")}</em>{t("hero.subhead.mid2")}<em>{t("hero.subhead.em3")}</em>
            {t("hero.subhead.mid3")}<em>{t("hero.subhead.em4")}</em>{t("hero.subhead.post")}
          </>
        }
        primaryLabel={t("hero.primaryLabel")}
        primaryHref={`${base}/pricing`}
        secondaryLabel={t("hero.secondaryLabel")}
        secondaryHref="#how"
        microcopy={t("hero.microcopy")}
      >
        <ScreenshotFrame
          src="/screenshots/pr-coverage-tracker/coverage-table.png"
          alt={t("hero.screenshotAlt")}
          width={2010}
          height={980}
          priority
          caption={t("hero.screenshotCaption")}
        />
      </FeatureHero>

      {/* The blind spot */}
      <PainScenarioSection
        eyebrow={t("pain.eyebrow")}
        scenario={t("pain.scenario")}
        bridge={t("pain.bridge")}
      />

      {/* How it works (HowTo schema source) */}
      <div id="how">
        <HowItWorks3Step heading={t("how.heading")} steps={steps} />
      </div>

      {/* The wedge — honest measurement */}
      <TrustSecurityBlock
        heading={t("trust.heading")}
        items={trustItems}
        note={t("trust.note")}
      />

      {/* Act, don't just monitor */}
      <ActVsMonitorWedge
        eyebrow={c("wedge.eyebrow")}
        headline={c("wedge.headline")}
        emphasis={c("wedge.emphasis")}
        body={t("wedge.body")}
        example={t("wedge.example")}
        link={{ label: t("wedge.linkLabel"), href: `${base}/features/citation-interceptor` }}
      />

      {/* Comparison */}
      <section className="border-t border-[var(--surface-warm-border)] bg-[var(--surface-warm)] px-6 py-16 sm:py-20">
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

      {/* Light proof — provenance (no fabricated numbers) */}
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
            provenanceLine={t("proofSec.provenance")}
            engineGridLabel={c("engineGridLabel")}
          />
        </div>
      </section>

      <FeatureFaq items={faqs} heading={c("faqHeading")} />

      <RelatedFeatures
        current="pr-coverage-tracker"
        related={["ai-visibility-tracker", "citation-interceptor", "domain-overview", "white-label-reports"]}
        base={base}
        copy={c.raw("related") as { eyebrow: string; heading: string; allFeatures: string; learnMore: string }}
        descriptions={cardDescriptions}
      />

      {/* Final CTA — Scale & Enterprise */}
      <section className="bg-gray-950 px-6 py-20 sm:py-24">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              {t("finalCta.h2")}
            </h2>
            <p className="mt-2 text-base text-gray-300">{t("finalCta.sub")}</p>
          </div>
          <Link
            href={`${base}/pricing`}
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
