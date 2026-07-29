import type { Metadata } from "next"
import Link from "next/link"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { FeatureHero } from "@/components/features/feature-hero"
import { RelatedFeatures } from "@/components/features/related-features"
import { FeatureFaq } from "@/components/features/feature-faq"
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

// Localized AI Visibility Tracker feature page: en at
// /features/ai-visibility-tracker, fr at /fr/features/ai-visibility-tracker.
// ALL display copy lives in the `featurePages.ai-visibility-tracker` namespace
// (shared strings in `featurePages.common`); structural data — hue, mockup
// sample data, comparison cell booleans, market codes — stays here. The
// tracker mockup depicts the English product UI, so its sample data stays
// English on both locales. Market NAMES are localized (messages `markets.list`,
// index-matched to MARKET_CODES). Product, tier and engine names are never
// translated. Scope guard (DEBRIEF-2026-07-29 §3.1): the tracker covers 20
// markets; GEO Scan covers 8 — keep the two claims scoped; make no claims here
// about the Domain Overview mentions dataset (Google-only outside the US).

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "featurePages.ai-visibility-tracker.meta" })
  return {
    title: { absolute: t("title") },
    description: t("description"),
    openGraph: { title: t("ogTitle"), description: t("ogDescription") },
    alternates: marketingAlternatesFor("/features/ai-visibility-tracker", locale),
  }
}

type Faq = { question: string; answer: string }
type CompRow = { label: string; cells: (boolean | string)[] }
type TrustItem = { title: string; body: string }

// —— English product-UI mockup sample data (stays English on both locales) ——
const trackerStats = [
  { label: "Visibility score", value: "68", unit: "/100", trend: "+6", positive: true },
  { label: "Share of voice", value: "24", unit: "%", trend: "+3", positive: true },
  { label: "Prompts tracked", value: "50", unit: "active", trend: "", positive: true },
  { label: "Citations captured", value: "312", unit: "URLs", trend: "+41", positive: true },
]

const trackedPrompts = [
  { prompt: "best crm for startups", engines: ["ChatGPT", "Perplexity", "AI Overviews"], status: "cited" },
  { prompt: "top sales tools 2026", engines: ["Gemini", "Claude"], status: "mentioned" },
  { prompt: "acme vs rivalcorp", engines: ["ChatGPT", "Grok", "Bing Copilot"], status: "cited" },
  { prompt: "alternatives to rivalcorp", engines: [], status: "absent" },
]

// ISO codes, index-matched to the localized names in messages `markets.list`.
// Live registry order (Wave 1, 2026-07-29): 8 original + 12 added.
const MARKET_CODES = [
  "US", "GB", "AU", "CA", "IE", "FR", "ES", "DE",
  "SG", "IN", "NZ", "ZA", "AE", "MX", "HK", "PH", "MY", "NG", "AT", "CH",
]

const statusStyle: Record<string, string> = {
  cited: "bg-accent-400/15 text-accent-300 border-accent-400/30",
  mentioned: "bg-sky-400/15 text-sky-300 border-sky-400/30",
  absent: "bg-red-400/10 text-red-300 border-red-400/25",
}

export default async function AiVisibilityTrackerPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("featurePages.ai-visibility-tracker")
  const c = await getTranslations("featurePages.common")
  const base = locale === routing.defaultLocale ? "" : `/${locale}`
  const urlBase = `${siteConfig.url}${base}`

  const steps = t.raw("how.steps") as Step[]
  const trustItems = t.raw("trust.items") as TrustItem[]
  const comparisonColumns = t.raw("comparison.columns") as string[]
  const comparisonRows = t.raw("comparison.rows") as CompRow[]
  const faqs = t.raw("faqs") as Faq[]
  const marketNames = t.raw("markets.list") as string[]
  const statusLabels = t.raw("mockup.statusLabels") as Record<string, string>
  const cardDescriptions = c.raw("cardDescriptions") as Record<string, string>
  const breadcrumbLabels = { home: c("breadcrumbHome"), features: c("breadcrumbFeatures") }

  return (
    <>
      <JsonLd
        data={[
          softwareApplicationSchema({
            name: "AI Visibility Tracker",
            description: t("schema.appDescription"),
            url: `${urlBase}/features/ai-visibility-tracker`,
          }),
          howToSchema({
            name: t("schema.howToName"),
            steps: steps.map((s) => ({ name: s.title, text: s.body })),
          }),
        ]}
      />

      {/* Hero — cool atmosphere (trend line / over-time feel); the tracker
          mockup is the light source */}
      <FeatureHero
        featureName="AI Visibility Tracker"
        hue="cool"
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
        primaryLabel={t("hero.primaryLabel")}
        primaryHref={siteConfig.appSignupUrl}
        secondaryLabel={t("hero.secondaryLabel")}
        secondaryHref="#how"
        microcopy={t("hero.microcopy")}
      >
        {/* Tracker mockup — dark command-center treatment. Product UI is
            English; sample data stays English on both locales. */}
        <div aria-hidden="true" className="relative rounded-[2rem] border border-gray-700/80 ring-1 ring-white/5 bg-[var(--surface-ink)] p-6 shadow-[0_30px_80px_-20px_rgba(11,18,32,0.45)] sm:p-8">
          <div
            className="pointer-events-none absolute inset-0 rounded-[2rem] opacity-[0.05]"
            style={{
              backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative">
            {/* Brand header */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="relative inline-flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-400" />
                </span>
                <span className="font-mono text-[13px] font-semibold text-white">acme.io</span>
              </div>
              <span className="rounded-full border border-gray-700 bg-gray-900/60 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                US · en-US
              </span>
            </div>

            {/* Headline stats */}
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {trackerStats.map((s) => (
                <div key={s.label} className="rounded-xl border border-gray-800 bg-gray-900/40 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">{s.label}</p>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="font-mono text-xl font-bold tabular-nums text-white">{s.value}</span>
                    <span className="font-mono text-[10px] text-gray-500">{s.unit}</span>
                  </div>
                  {s.trend && (
                    <p className={`mt-0.5 font-mono text-[10px] font-semibold ${s.positive ? "text-accent-400" : "text-red-400"}`}>
                      {s.trend} vs last scan
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Tracked prompt rows */}
            <div className="mt-4 space-y-2">
              {trackedPrompts.map((p) => (
                <div key={p.prompt} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-xl border border-gray-800 bg-gray-900/40 px-4 py-3">
                  <span className="font-mono text-[12px] text-gray-300">&ldquo;{p.prompt}&rdquo;</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {p.engines.map((e) => (
                      <span key={e} className="rounded-full border border-gray-700 bg-gray-900/60 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-gray-400">
                        {e}
                      </span>
                    ))}
                    <span className={`rounded-full border px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider ${statusStyle[p.status]}`}>
                      {statusLabels[p.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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

      {/* Markets — the Wave 1 story */}
      <section className="border-t border-[var(--surface-cool-border)] bg-[var(--surface-cool)] px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-sky-700">
            {t("markets.eyebrow")}
          </p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            {t("markets.h2")}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-700">
            {t("markets.body")}
          </p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {MARKET_CODES.map((code, i) => (
              <li
                key={code}
                className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-3 py-1.5 text-[13px] font-medium text-gray-800"
              >
                <span className="font-mono text-[10px] font-semibold text-sky-700">{code}</span>
                {marketNames[i]}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Honest measurement */}
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
        current="ai-visibility-tracker"
        related={["geo-scan", "domain-overview", "competitor-intel", "citation-interceptor"]}
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
