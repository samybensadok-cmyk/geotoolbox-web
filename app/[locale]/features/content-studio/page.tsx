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
import { DualCTA } from "@/components/features/dual-cta"
import { FeatureComparisonTable } from "@/components/features/feature-comparison-table"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { softwareApplicationSchema, howToSchema } from "@/lib/seo-schema"
import { marketingAlternatesFor } from "@/lib/i18n/siblings"

// Localized Content Studio feature page: en at /features/content-studio, fr at
// /fr/features/content-studio. Relocated from
// app/(marketing)/features/content-studio. Display copy lives in the
// `featurePages.content-studio` namespace (shared strings in
// `featurePages.common`); structural data — hue, screenshot files/dimensions,
// comparison column headers (all product names), cell booleans, the cited-engine
// roster — stays here. Product, tier and engine names are never translated; the
// product screenshots depict the English UI.

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "featurePages.content-studio.meta" })
  return {
    title: { absolute: t("title") },
    description: t("description"),
    openGraph: { title: t("ogTitle"), description: t("ogDescription") },
    alternates: marketingAlternatesFor("/features/content-studio", locale),
  }
}

type BriefModule = { name: string; gloss: string }
type Outcome = { tag: string; title: string; body: string }
type Faq = { question: string; answer: string }
type CompRow = { label: string; cells: (boolean | string)[] }

// Comparison column headers — all product names, identical across locales.
const comparisonColumns = ["Surfer / Clearscope", "MarketMuse", "Content Studio"]
// The AI engines queried, shown as data-source marks in the proof block.
const citedEngines = ["chatgpt", "perplexity", "gemini", "claude", "aio", "grok"] as const

export default async function ContentStudioPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("featurePages.content-studio")
  const c = await getTranslations("featurePages.common")
  const base = locale === routing.defaultLocale ? "" : `/${locale}`
  const urlBase = `${siteConfig.url}${base}`

  const steps = t.raw("how.steps") as Step[]
  const briefModules = t.raw("brief.modules") as BriefModule[]
  const outcomes = t.raw("outcomes.items") as Outcome[]
  const comparisonRows = t.raw("comparison.rows") as CompRow[]
  const faqs = t.raw("faqs") as Faq[]
  const cardDescriptions = c.raw("cardDescriptions") as Record<string, string>
  const breadcrumbLabels = { home: c("breadcrumbHome"), features: c("breadcrumbFeatures") }

  return (
    <>
      <JsonLd
        data={[
          softwareApplicationSchema({
            name: "Content Studio",
            description: t("schema.appDescription"),
            url: `${urlBase}/features/content-studio`,
            applicationSubCategory: t("schema.appSubCategory"),
          }),
          howToSchema({
            name: t("schema.howToName"),
            steps: steps.map((s) => ({ name: s.title, text: s.body })),
          }),
        ]}
      />

      {/* Hero — pain-led, dark opening act; the real brief is the light source */}
      <FeatureHero
        featureName="Content Studio"
        hue="amber"
        base={base}
        breadcrumbLabels={breadcrumbLabels}
        eyebrow={t("hero.eyebrow")}
        title={
          <>
            {t("hero.h1Lead")} <span className="text-accent-300">{t("hero.h1Accent")}</span>
          </>
        }
        subhead={t("hero.subhead")}
        primaryLabel={t("hero.primaryLabel")}
        primaryHref="/app"
        secondaryLabel={t("hero.secondaryLabel")}
        secondaryHref="#brief"
        microcopy={t("hero.microcopy")}
      >
        <ScreenshotFrame
          src="/screenshots/content-studio/brief-studio.png"
          alt={t("hero.screenshotAlt")}
          width={2136}
          height={1090}
          priority
          caption={t("hero.screenshotCaption")}
        />
      </FeatureHero>

      {/* The cost of a well-written, uncited page */}
      <PainScenarioSection
        eyebrow={t("pain.eyebrow")}
        scenario={t("pain.scenario")}
        bridge={t("pain.bridge")}
      />

      {/* How it works (HowTo schema source) */}
      <HowItWorks3Step heading={t("how.heading")} steps={steps} />

      {/* What's in a brief — the real modules */}
      <section id="brief" className="border-t border-[var(--surface-warm-border)] bg-[var(--surface-warm)] px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
              {t("brief.eyebrow")}
            </p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
              {t("brief.h2")}
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-gray-600">
              {t("brief.intro.pre")}
              <Link href={`${base}/features/content-analyzer`} className="font-semibold text-accent-700 hover:text-accent-800">
                {t("brief.intro.linkLabel")}
              </Link>
              {t("brief.intro.post")}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-2">
            {briefModules.map((m) => (
              <div key={m.name} className="flex items-start gap-2.5">
                <svg className="mt-1 h-3.5 w-3.5 shrink-0 text-accent-600" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M3 7.5l2.5 2.5L11 4.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[14px] leading-snug text-gray-700">
                  <span className="font-semibold text-gray-900">{m.name}</span>
                  <span className="text-gray-500"> &mdash; {m.gloss}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-3xl">
            <ScreenshotFrame
              src="/screenshots/content-studio/extractability-checklist.png"
              alt={t("brief.screenshotAlt")}
              width={2136}
              height={1660}
              caption={t("brief.screenshotCaption")}
            />
          </div>
        </div>
      </section>

      {/* Act, don't just monitor */}
      <ActVsMonitorWedge
        eyebrow={c("wedge.eyebrow")}
        headline={t("wedge.headline")}
        emphasis={t("wedge.emphasis")}
        body={t("wedge.body")}
        example={t("wedge.example")}
        link={{ label: t("wedge.linkLabel"), href: `${base}/features/content-analyzer` }}
      />

      {/* Outcomes */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">{t("outcomes.eyebrow")}</p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
              {t("outcomes.h2")}
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2 lg:gap-x-16">
            {outcomes.map((o, i) => (
              <div key={o.tag} className="relative pl-12">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 font-mono text-[22px] font-bold leading-none tabular-nums text-accent-500"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">{o.tag}</p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight text-gray-900">{o.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{o.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA repeat at the section break */}
      <section className="border-t border-gray-100 bg-white px-6 py-10">
        <div className="mx-auto max-w-3xl">
          <DualCTA
            primaryLabel={t("dualCta.primaryLabel")}
            primaryHref="/app"
            microcopy={t("dualCta.microcopy")}
          />
        </div>
      </section>

      {/* Comparison */}
      <section className="border-t border-[var(--surface-warm-border)] bg-[var(--surface-warm)] px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">{t("comparison.eyebrow")}</p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
              {t("comparison.h2")}
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-gray-600">
              {t("comparison.intro")}
            </p>
          </div>
          <div className="mt-10">
            <FeatureComparisonTable
              columns={comparisonColumns}
              rows={comparisonRows}
              caption={t("comparison.caption")}
              yesLabel={c("comparison.yes")}
              noLabel={c("comparison.no")}
            />
          </div>
        </div>
      </section>

      {/* Light proof — real run, real provenance, no fabricated counters */}
      <section className="border-t border-gray-100 bg-white px-6 py-12">
        <SocialProofBlock
          miniCase={{
            result: t("proof.miniResult"),
            attribution: t("proof.miniAttribution"),
          }}
          engines={[...citedEngines]}
          engineGridLabel={c("engineGridLabel")}
          provenanceLine={t("proof.provenance")}
        />
      </section>

      <FeatureFaq items={faqs} heading={c("faqHeading")} />

      <RelatedFeatures
        current="content-studio"
        related={["content-analyzer", "geo-scan", "domain-overview"]}
        base={base}
        copy={c.raw("related") as { eyebrow: string; heading: string; allFeatures: string; learnMore: string }}
        descriptions={cardDescriptions}
      />

      {/* CTA */}
      <section className="bg-gray-950 px-6 py-20 sm:py-24">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              {t("finalCta.h2")}
            </h2>
            <p className="mt-2 text-base text-gray-300">{t("finalCta.sub")}</p>
          </div>
          <Link href="/app" prefetch={false} className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 active:translate-y-[1px]">
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
