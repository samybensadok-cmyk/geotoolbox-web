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
import { FeatureComparisonTable } from "@/components/features/feature-comparison-table"
import { TrustSecurityBlock } from "@/components/features/trust-security"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { softwareApplicationSchema, howToSchema } from "@/lib/seo-schema"
import { marketingAlternatesFor } from "@/lib/i18n/siblings"

// Localized White-Label Reports feature page: en at /features/white-label-reports,
// fr at /fr/features/white-label-reports. Relocated from
// app/(marketing)/features/white-label-reports. ALL display copy lives in the
// `featurePages.white-label-reports` message namespace (shared strings in
// `featurePages.common`); structural data — hue, cell booleans, anchors — stays
// here. The report-preview figure is an illustrative JSX mockup that DEPICTS the
// product, so its UI sample labels stay English on both locales (only the
// aria-label, sr-only, and figcaption are translated).

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "featurePages.white-label-reports.meta" })
  return {
    title: { absolute: t("title") },
    description: t("description"),
    openGraph: { title: t("ogTitle"), description: t("ogDescription") },
    alternates: marketingAlternatesFor("/features/white-label-reports", locale),
  }
}

type Faq = { question: string; answer: string }
type CompRow = { label: string; cells: (boolean | string)[] }

export default async function WhiteLabelReportsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("featurePages.white-label-reports")
  const c = await getTranslations("featurePages.common")
  const base = locale === routing.defaultLocale ? "" : `/${locale}`
  const urlBase = `${siteConfig.url}${base}`

  const steps = t.raw("how.steps") as Step[]
  const trustItems = t.raw("trust.items") as { title: string; body: string }[]
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
            name: "White-Label Client Reports",
            description: t("schema.appDescription"),
            url: `${urlBase}/features/white-label-reports`,
          }),
          howToSchema({
            name: t("schema.howToName"),
            steps: steps.map((s) => ({ name: s.title, text: s.body })),
          }),
        ]}
      />

      <FeatureHero
        featureName="White-Label Reports"
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
        primaryHref={`${base}/pricing`}
        secondaryLabel={t("hero.secondaryLabel")}
        secondaryHref="#how"
        microcopy={t("hero.microcopy")}
      >
        {/* Illustrative report preview — the referenced real screenshot was never
            captured (public/screenshots/white-label-reports/ is empty and the
            image 400s in prod), so this JSX card follows the same explicitly
            illustrative pattern as the analytics/community heroes until a real
            capture replaces it. Its UI sample labels depict the English product,
            so they stay English on both locales. */}
        <figure
          aria-label={t("hero.figureAriaLabel")}
          className="m-0"
        >
          <span className="sr-only">{t("hero.figureSrOnly")}</span>
          <div className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-[0_30px_80px_-28px_rgba(15,23,42,0.30)]">
            {/* Report masthead — the agency's slots, not ours */}
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-dashed border-gray-300 font-mono text-[9px] font-semibold uppercase text-gray-400">
                  Logo
                </span>
                <div>
                  <p className="text-[13px] font-bold text-gray-900">Your Agency</p>
                  <p className="font-mono text-[10px] text-gray-500">AI Visibility Report · Monthly</p>
                </div>
              </div>
              <span className="rounded-full bg-accent-50 px-2.5 py-1 font-mono text-[10px] font-semibold text-accent-700">
                Your accent color
              </span>
            </div>
            {/* Headline stats */}
            <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100 text-center">
              {[
                { v: "72", l: "Visibility score" },
                { v: "148", l: "AI citations" },
                { v: "31%", l: "Share of voice" },
              ].map((s) => (
                <div key={s.l} className="px-2 py-4">
                  <div className="font-mono text-2xl font-bold tabular-nums text-gray-900">{s.v}</div>
                  <div className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-gray-500">{s.l}</div>
                </div>
              ))}
            </div>
            {/* Engine rows */}
            <ul className="divide-y divide-gray-100 px-6">
              {[
                { e: "ChatGPT", s: "Cited", up: true },
                { e: "Perplexity", s: "Cited", up: true },
                { e: "Gemini", s: "Mentioned", up: false },
              ].map((r) => (
                <li key={r.e} className="flex items-center justify-between py-2.5">
                  <span className="font-mono text-[12px] font-medium text-gray-800">{r.e}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold ${
                      r.up ? "bg-accent-50 text-accent-700" : "bg-amber-50 text-amber-800"
                    }`}
                  >
                    {r.s}
                  </span>
                </li>
              ))}
            </ul>
            {/* White-label footer — the point of the feature */}
            <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-3">
              <span className="font-mono text-[10px] text-gray-500">Prepared by Your Agency</span>
              <span className="font-mono text-[10px] text-gray-400 line-through decoration-gray-400">
                Powered by GEO Toolbox
              </span>
            </div>
          </div>
          <figcaption className="mt-3 text-[12px] leading-relaxed text-gray-400">
            {t("hero.figcaption")}
          </figcaption>
        </figure>
      </FeatureHero>

      <PainScenarioSection
        eyebrow={t("pain.eyebrow")}
        scenario={t("pain.scenario")}
        bridge={t("pain.bridge")}
      />

      <div id="how">
        <HowItWorks3Step heading={t("how.heading")} steps={steps} />
      </div>

      <TrustSecurityBlock
        heading={t("trust.heading")}
        items={trustItems}
      />

      <ActVsMonitorWedge
        eyebrow={c("wedge.eyebrow")}
        headline={c("wedge.headline")}
        emphasis={c("wedge.emphasis")}
        body={t("wedge.body")}
        example={t("wedge.example")}
        link={{ label: t("wedge.linkLabel"), href: `${base}/features/pr-coverage-tracker` }}
      />

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

      <FeatureFaq items={faqs} heading={c("faqHeading")} />

      <RelatedFeatures
        current="white-label-reports"
        related={["pr-coverage-tracker", "domain-overview", "competitor-intel"]}
        base={base}
        copy={c.raw("related") as { eyebrow: string; heading: string; allFeatures: string; learnMore: string }}
        descriptions={cardDescriptions}
      />

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
