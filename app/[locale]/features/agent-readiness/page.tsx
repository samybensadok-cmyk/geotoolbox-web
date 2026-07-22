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
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { softwareApplicationSchema, howToSchema } from "@/lib/seo-schema"
import { marketingAlternatesFor } from "@/lib/i18n/siblings"

// Localized Agent Readiness feature page: en at /features/agent-readiness, fr at
// /fr/features/agent-readiness. Relocated from
// app/(marketing)/features/agent-readiness. ALL display copy lives in the
// `featurePages.agent-readiness` message namespace (shared strings in
// `featurePages.common`); structural data — hue, screenshot files/dimensions,
// level numbers, layer/outcome indices — stays here. Product, tier, engine and
// technical crawler names (GPTBot, ClaudeBot, robots.txt, WAF …) are never
// translated.

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "featurePages.agent-readiness.meta" })
  return {
    title: { absolute: t("title") },
    description: t("description"),
    openGraph: { title: t("ogTitle"), description: t("ogDescription") },
    alternates: marketingAlternatesFor("/features/agent-readiness", locale),
  }
}

type Layer = { tag: string; title: string; note: string; checks: string[] }
type Level = { n: number; name: string; body: string; note?: string }
type Outcome = { tag: string; title: string; body: string }
type Faq = { question: string; answer: string }

export default async function AgentReadinessPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("featurePages.agent-readiness")
  const c = await getTranslations("featurePages.common")
  const base = locale === routing.defaultLocale ? "" : `/${locale}`
  const urlBase = `${siteConfig.url}${base}`

  const steps = t.raw("how.steps") as Step[]
  const layers = t.raw("layers.items") as Layer[]
  const levels = t.raw("levels.items") as Level[]
  const outcomes = t.raw("outcomes.items") as Outcome[]
  const faqs = t.raw("faqs") as Faq[]
  const cardDescriptions = c.raw("cardDescriptions") as Record<string, string>
  const breadcrumbLabels = { home: c("breadcrumbHome"), features: c("breadcrumbFeatures") }

  return (
    <>
      <JsonLd
        data={[
          softwareApplicationSchema({
            name: "Agent Readiness",
            description: t("schema.appDescription"),
            url: `${urlBase}/features/agent-readiness`,
            applicationSubCategory: t("schema.appSubCategory"),
          }),
          howToSchema({
            name: t("schema.howToName"),
            steps: steps.map((s) => ({ name: s.title, text: s.body })),
          }),
        ]}
      />

      {/* Hero — pain-led, with a real readiness report as proof */}
      <FeatureHero
        featureName="Agent Readiness"
        hue="steel"
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
            {t("hero.subheadPre")}
            <em>{t("hero.subheadEmph")}</em>
            {t("hero.subheadPost")}
          </>
        }
        primaryLabel={t("hero.primaryLabel")}
        secondaryLabel={t("hero.secondaryLabel")}
        secondaryHref="#layers"
        microcopy={t("hero.microcopy")}
      >
        <ScreenshotFrame
          src="/screenshots/agent-readiness/readiness-scores.png"
          alt={t("hero.screenshotAlt")}
          width={3270}
          height={938}
          priority
          caption={t("hero.screenshotCaption")}
        />
      </FeatureHero>

      {/* The cost of being unreachable */}
      <PainScenarioSection
        eyebrow={t("pain.eyebrow")}
        scenario={t("pain.scenario")}
        bridge={t("pain.bridge")}
      />

      {/* How it works (HowTo schema source) */}
      <HowItWorks3Step heading={t("how.heading")} steps={steps} />

      {/* The 28 checks — 3 layers */}
      <section id="layers" className="scroll-mt-20 border-t border-[var(--surface-steel-border)] bg-[var(--surface-steel)] px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">{t("layers.eyebrow")}</p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
              {t("layers.h2")}
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-gray-600">
              {t("layers.intro")}
            </p>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-3">
            {layers.map((l, i) => (
              <div key={l.tag} className="relative pl-12">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 font-mono text-[22px] font-bold leading-none tabular-nums text-accent-500"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">{l.tag}</span>
                  <span className="font-mono text-[10px] text-gray-500">{l.note}</span>
                </div>
                <h3 className="mt-2 text-lg font-semibold tracking-tight text-gray-900">{l.title}</h3>
                <ul className="mt-4 space-y-2.5 border-t border-[var(--surface-steel-border)] pt-4">
                  {l.checks.map((check) => (
                    <li key={check} className="flex items-start gap-2.5 text-[14px] leading-snug text-gray-700">
                      <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-600" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M3 7.5l2.5 2.5L11 4.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {check}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agent-Readiness Levels — the ladder */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">{t("levels.eyebrow")}</p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
              {t("levels.h2")}
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-gray-600">
              {t("levels.intro")}
            </p>
          </div>
          <ol className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {levels.map((l) => (
              <li key={l.n} className="relative border-t-2 border-accent-500 pt-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[22px] font-bold leading-none tabular-nums text-accent-600">L{l.n}</span>
                  <h3 className="text-lg font-semibold tracking-tight text-gray-900">{l.name}</h3>
                </div>
                {"note" in l && l.note ? (
                  <p className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-400">{l.note}</p>
                ) : null}
                <p className="mt-2 text-[14px] leading-relaxed text-gray-600">{l.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Act, don't just monitor — the exact fix */}
      <ActVsMonitorWedge
        eyebrow={c("wedge.eyebrow")}
        headline={c("wedge.headline")}
        emphasis={c("wedge.emphasis")}
        body={t("wedge.body")}
        example={t("wedge.example")}
        link={{ label: t("wedge.linkLabel"), href: `${base}/features/content-analyzer` }}
      />

      {/* Outcomes */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">{t("outcomes.eyebrow")}</p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
              {t("outcomes.h2")}
            </h2>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
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

      {/* Light proof */}
      <section className="border-t border-gray-100 bg-white px-6 py-12">
        <SocialProofBlock provenanceLine={t("proof.provenance")} engineGridLabel={c("engineGridLabel")} />
      </section>

      <FeatureFaq items={faqs} heading={c("faqHeading")} />

      <RelatedFeatures
        current="agent-readiness"
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
          <Link href={siteConfig.appSignupUrl} prefetch={false} className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 active:translate-y-[1px]">
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
