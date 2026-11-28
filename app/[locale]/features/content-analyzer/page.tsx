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
import { ScoreLegend } from "@/components/features/score-legend"
import { FeatureComparisonTable } from "@/components/features/feature-comparison-table"
import { AiEngineLogoGrid } from "@/components/features/ai-engine-logo-grid"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { softwareApplicationSchema, howToSchema } from "@/lib/seo-schema"
import { marketingAlternatesFor } from "@/lib/i18n/siblings"
import { kit as k, Arrow } from "@/components/brand/dark-kit"
import { FeaturePage, FxSection, FxHead, FeatureCloseCta, fx, HeroAccent } from "@/components/features/fx"

// Localized Content Analyzer feature page: en at /features/content-analyzer, fr
// at /fr/features/content-analyzer. Relocated from app/(marketing). ALL display
// copy lives in the `featurePages.content-analyzer` namespace (shared strings in
// `featurePages.common`); structural data — slugs, hues, screenshot files/dims,
// engine roster, cell booleans — stays here. Product, tier and engine names are
// never translated; the product score names Citability / AI Readability stay EN
// in FR prose, matching how tier names are handled.

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "featurePages.content-analyzer.meta" })
  return {
    title: { absolute: t("title") },
    description: t("description"),
    openGraph: { title: t("ogTitle"), description: t("ogDescription") },
    alternates: marketingAlternatesFor("/features/content-analyzer", locale),
  }
}

type Faq = { question: string; answer: string }
type CompRow = { label: string; cells: (boolean | string)[] }
type Outcome = { tag: string; title: string; body: string }
type Persona = { who: string; job: string }
type SignalItem = { name: string; gloss: string }
type LegendTier = { band: string; label: string }

const LEGEND_TONES = ["bad", "mid", "good"] as const

const citedEngines = ["chatgpt", "perplexity", "gemini", "claude", "aio", "grok"] as const

export default async function ContentAnalyzerPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("featurePages.content-analyzer")
  const c = await getTranslations("featurePages.common")
  const base = locale === routing.defaultLocale ? "" : `/${locale}`
  const urlBase = `${siteConfig.url}${base}`

  const steps = t.raw("how.steps") as Step[]
  const personas = t.raw("personas") as Persona[]
  const citabilitySignals = t.raw("signals.citabilityItems") as SignalItem[]
  const readabilitySignals = t.raw("signals.readabilityItems") as SignalItem[]
  const outcomes = t.raw("outcomes.items") as Outcome[]
  const comparisonColumns = t.raw("comparison.columns") as string[]
  const comparisonRows = t.raw("comparison.rows") as CompRow[]
  const faqs = t.raw("faqs") as Faq[]
  const legendTiers = (c.raw("scoreLegendAF") as LegendTier[]).map((tier, i) => ({
    ...tier,
    tone: LEGEND_TONES[i],
  }))
  const cardDescriptions = c.raw("cardDescriptions") as Record<string, string>
  const breadcrumbLabels = { home: c("breadcrumbHome"), features: c("breadcrumbFeatures") }

  return (
    <FeaturePage>
      {/* SoftwareApplication + HowTo schema */}
      <JsonLd
        data={[
          softwareApplicationSchema({
            name: "Content Analyzer",
            description: t("schema.appDescription"),
            url: `${urlBase}/features/content-analyzer`,
            applicationSubCategory: "AI citability checker",
          }),
          howToSchema({
            name: t("schema.howToName"),
            steps: steps.map((s) => ({ name: s.title, text: s.body })),
          }),
        ]}
      />

      {/* Hero — pain-led, dark opening act; the real two-score analyzer result is the light source */}
      <FeatureHero
        featureName="Content Analyzer"
        hue="lilac"
        base={base}
        breadcrumbLabels={breadcrumbLabels}
        eyebrow={t("hero.eyebrow")}
        title={
          <>
            {t("hero.h1Lead")} <HeroAccent text={t("hero.h1Accent")} />
            {t("hero.h1Tail")}
          </>
        }
        subhead={t("hero.subhead")}
        primaryLabel={t("hero.primaryLabel")}
        primaryHref="/app"
        secondaryLabel={t("hero.secondaryLabel")}
        secondaryHref="#signals"
        microcopy={t("hero.microcopy")}
      >
        {/* The real two-score analyzer result */}
        <ScreenshotFrame
          src="/screenshots/content-analyzer/citability-result-v2.png"
          alt={t("hero.screenshotAlt")}
          width={2108}
          height={1134}
          priority
          caption={t("hero.screenshotCaption")}
        />
        {/* Score legend + benchmark note — preserved from the original hero left column */}
        <div className="mt-6">
          <ScoreLegend tiers={legendTiers} />
          <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-gray-400">
            {t("hero.benchmarkNote")}
          </p>
        </div>
      </FeatureHero>

      {/* The cost of being uncited */}
      <PainScenarioSection
        eyebrow={t("pain.eyebrow")}
        scenario={t("pain.scenario")}
        bridge={t("pain.bridge")}
      />

      {/* How it works (HowTo schema source) */}
      <HowItWorks3Step heading={t("how.heading")} steps={steps} />

      {/* Who it's for — persona self-select (numbered editorial grid, anti-card) */}
      <FxSection>
        <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-3">
          {personas.map((p, i) => (
            <div key={p.who} className="relative pl-12">
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 font-mono text-[22px] font-bold leading-none tabular-nums text-accent-500"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">{p.who}</p>
              <p className="mt-2 text-[14px] leading-relaxed text-gray-600">{p.job}</p>
            </div>
          ))}
        </div>
      </FxSection>

      {/* What it checks — the real two-module model, shown in full */}
      <FxSection id="signals" band>
        <FxHead eyebrow={t("signals.eyebrow")} title={t("signals.h2")} lead={t("signals.intro")} />

        <div className="grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-2">
          {/* Citability */}
          <div className="border-t-2 border-accent-200 pt-6">
            <div className="flex items-baseline justify-between">
              <h3 className="text-lg font-semibold tracking-tight text-gray-900">{t("signals.citabilityHeading")}</h3>
              <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
                {t("signals.citabilityBadge")}
              </span>
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-gray-500">
              {t("signals.citabilitySubhead")}
            </p>
            <ul className="mt-5 space-y-3">
              {citabilitySignals.map((s) => (
                <li key={s.name} className="flex items-start gap-2.5">
                  <svg className="mt-1 h-3.5 w-3.5 shrink-0 text-accent-600" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M3 7.5l2.5 2.5L11 4.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[14px] leading-snug text-gray-700">
                    <span className="font-semibold text-gray-900">{s.name}</span>
                    <span className="text-gray-500"> &mdash; {s.gloss}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-gray-100 pt-4 text-[13px] leading-relaxed text-gray-500">
              {t("signals.citabilityFooter")}
            </p>
          </div>

          {/* AI Readability */}
          <div className="border-t-2 border-accent-200 pt-6">
            <div className="flex items-baseline justify-between">
              <h3 className="text-lg font-semibold tracking-tight text-gray-900">{t("signals.readabilityHeading")}</h3>
              <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
                {t("signals.readabilityBadge")}
              </span>
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-gray-500">
              {t("signals.readabilitySubheadPre")}
              <Link href={`${base}/features/agent-readiness`} className="font-semibold text-accent-700 hover:text-accent-800">
                {t("signals.readabilityLinkLabel")}
              </Link>
              {t("signals.readabilitySubheadPost")}
            </p>
            <ul className="mt-5 space-y-3">
              {readabilitySignals.map((s) => (
                <li key={s.name} className="flex items-start gap-2.5">
                  <svg className="mt-1 h-3.5 w-3.5 shrink-0 text-accent-600" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M3 7.5l2.5 2.5L11 4.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[14px] leading-snug text-gray-700">
                    <span className="font-semibold text-gray-900">{s.name}</span>
                    <span className="text-gray-500"> &mdash; {s.gloss}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* The benchmark table screenshot */}
        <div className="mx-auto mt-12 max-w-4xl">
          <ScreenshotFrame
            src="/screenshots/content-analyzer/signal-breakdown.png"
            alt={t("signals.breakdownAlt")}
            width={1219}
            height={1440}
            caption={t("signals.breakdownCaption")}
          />
        </div>
      </FxSection>

      {/* CTA repeat at the section break */}
      <FxSection className={fx.secTight} narrow>
        <div className={fx.dualBand}>
          <DualCTA
            primaryLabel={t("dualCta.primaryLabel")}
            primaryHref="/app"
            microcopy={t("dualCta.microcopy")}
          />
        </div>
      </FxSection>

      {/* Per-engine, live — the differentiator */}
      <FxSection band narrow>
        <FxHead
          eyebrow={t("perEngine.eyebrow")}
          title={t("perEngine.h2")}
          lead={
            <>
              {t("perEngine.bodyPre")}
              <Link href={`${base}/features/geo-scan`} className="font-semibold text-accent-700 hover:text-accent-800">
                {t("perEngine.linkLabel")}
              </Link>
              {t("perEngine.bodyPost")}
            </>
          }
        />
        <AiEngineLogoGrid
          engines={[...citedEngines]}
          label={t("perEngine.gridLabel")}
        />
      </FxSection>

      {/* Act, don't just monitor */}
      <ActVsMonitorWedge
        eyebrow={c("wedge.eyebrow")}
        headline={c("wedge.headline")}
        emphasis={t("wedge.emphasis")}
        body={t("wedge.body")}
        example={t("wedge.example")}
        link={{ label: t("wedge.linkLabel"), href: `${base}/features/content-studio` }}
      />

      {/* Outcomes */}
      <FxSection>
        <FxHead eyebrow={t("outcomes.eyebrow")} title={t("outcomes.h2")} />
        <div className={fx.outcomes}>
          {outcomes.map((o) => (
            <div key={o.tag} className={fx.outcome}>
              <p className={k.kicker}>{o.tag}</p>
              <h3 className={fx.itemTitle}>{o.title}</h3>
              <p className={fx.itemBody}>{o.body}</p>
            </div>
          ))}
        </div>
      </FxSection>

      {/* Comparison */}
      <FxSection band narrow>
        <FxHead
          eyebrow={t("comparison.eyebrow")}
          title={t("comparison.h2")}
          lead={
            <>
              {t("comparison.introPre")}
              <Link href={`${base}/features/domain-overview`} className="font-semibold text-accent-700 hover:text-accent-800">
                {t("comparison.linkLabel")}
              </Link>
              {t("comparison.introPost")}
            </>
          }
        />
        <FeatureComparisonTable
          columns={comparisonColumns}
          rows={comparisonRows}
          caption={t("comparison.caption")}
          yesLabel={c("comparison.yes")}
          noLabel={c("comparison.no")}
        />
      </FxSection>

      {/* Light proof — real run, real provenance, no fabricated counters */}
      <FxSection className={fx.secTight}>
        <SocialProofBlock
          miniCase={{
            result: t("proofSec.miniResult"),
            attribution: t("proofSec.miniAttribution"),
          }}
          engines={[...citedEngines]}
          provenanceLine={t("proofSec.provenance")}
          engineGridLabel={c("engineGridLabel")}
        />
      </FxSection>

      <FeatureFaq items={faqs} heading={c("faqHeading")} />

      <RelatedFeatures
        current="content-analyzer"
        related={["geo-scan", "content-studio", "agent-readiness"]}
        base={base}
        copy={c.raw("related") as { eyebrow: string; heading: string; allFeatures: string; learnMore: string }}
        descriptions={cardDescriptions}
      />

      {/* Final CTA */}
      <FeatureCloseCta title={t("finalCta.h2")} sub={t("finalCta.sub")}>
        <Link href="/app" prefetch={false} className={k.btnLime}>
          {t("finalCta.button")}
          <Arrow />
        </Link>
      </FeatureCloseCta>
    </FeaturePage>
  )
}
