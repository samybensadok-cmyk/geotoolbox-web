import type { Metadata } from "next"
import Link from "next/link"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { FeatureHero } from "@/components/features/feature-hero"
import { RelatedFeatures } from "@/components/features/related-features"
import { FeatureFaq } from "@/components/features/feature-faq"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { softwareApplicationSchema } from "@/lib/seo-schema"
import { marketingAlternatesFor } from "@/lib/i18n/siblings"

// Localized Domain Overview feature page: en at /features/domain-overview,
// fr at /fr/features/domain-overview. Relocated from
// app/(marketing)/features/domain-overview. ALL display copy lives in the
// `featurePages.domain-overview` message namespace (shared strings in
// `featurePages.common`); structural data — hues, mockup sample data — stays
// here. The command-center dashboard mockup depicts the English product UI,
// so its sample data stays English on both locales.

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "featurePages.domain-overview.meta" })
  return {
    title: { absolute: t("title") },
    description: t("description"),
    openGraph: { title: t("ogTitle"), description: t("ogDescription") },
    alternates: marketingAlternatesFor("/features/domain-overview", locale),
  }
}

type Section = { num: string; tag: string; title: string; body: string }
type Faq = { question: string; answer: string }

// —— English product-UI mockup sample data (stays English on both locales) ——
const headlineStats = [
  { label: "AI visibility", value: "72", unit: "/100", trend: "+8", positive: true },
  { label: "Cited pages", value: "34", unit: "pages", trend: "+5", positive: true },
  { label: "AI competitors", value: "12", unit: "domains", trend: "+2", positive: false },
  { label: "Co-cited with", value: "47", unit: "domains", trend: "+12", positive: true },
]

const citedPages = [
  { url: "/blog/ai-seo-guide", cites: 18, engines: ["ChatGPT", "Perplexity", "Claude"] },
  { url: "/product/citability", cites: 12, engines: ["Gemini", "AI Overviews"] },
  { url: "/tools/scanner", cites: 9, engines: ["ChatGPT", "Perplexity"] },
  { url: "/blog/what-is-geo", cites: 7, engines: ["Claude", "Bing Copilot"] },
]

const aiCompetitors = [
  { domain: "ahrefs.com", share: 87, delta: "+4" },
  { domain: "semrush.com", share: 62, delta: "-3" },
  { domain: "moz.com", share: 48, delta: "+1" },
  { domain: "searchenginejournal.com", share: 41, delta: "+6" },
]

export default async function DomainOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("featurePages.domain-overview")
  const c = await getTranslations("featurePages.common")
  const base = locale === routing.defaultLocale ? "" : `/${locale}`
  const urlBase = `${siteConfig.url}${base}`

  const sections = t.raw("sections") as Section[]
  const faqs = t.raw("faqs") as Faq[]
  const cardDescriptions = c.raw("cardDescriptions") as Record<string, string>
  const breadcrumbLabels = { home: c("breadcrumbHome"), features: c("breadcrumbFeatures") }

  return (
    <>
      <JsonLd data={[
        softwareApplicationSchema({
          name: "Domain Overview",
          description: t("schema.appDescription"),
          url: `${urlBase}/features/domain-overview`,
        }),
      ]} />

      {/* Hero — steel atmosphere (command-center / dashboard feel) */}
      <FeatureHero
        featureName="Domain Overview"
        hue="steel"
        base={base}
        breadcrumbLabels={breadcrumbLabels}
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subhead={t("hero.subhead")}
        primaryLabel={t("hero.primaryLabel")}
        primaryHref="/app"
        secondaryLabel={t("hero.secondaryLabel")}
        secondaryHref="#whats-inside"
        microcopy=""
      >
        {/* Dashboard visual — dark command-center treatment. Product UI is
            English; sample data stays English on both locales. */}
        <div aria-hidden="true" className="relative rounded-[2rem] border border-gray-700/80 ring-1 ring-white/5 bg-[var(--surface-ink)] p-6 shadow-[0_30px_80px_-20px_rgba(11,18,32,0.45)] sm:p-8">
          {/* Subtle grid overlay */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[2rem] opacity-[0.05]"
            style={{
              backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative">
            {/* Domain header */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="relative inline-flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-400" />
                </span>
                <span className="font-mono text-[13px] font-semibold text-white">geotoolbox.ai</span>
              </div>
              <span className="font-mono text-[11px] text-gray-500">updated 4m ago</span>
            </div>

            {/* Headline stats grid */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              {headlineStats.map((s) => (
                <div key={s.label} className="rounded-xl border border-gray-800 bg-gray-900/40 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">{s.label}</p>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="font-mono text-xl font-bold tabular-nums text-white">{s.value}</span>
                    <span className="font-mono text-[10px] text-gray-500">{s.unit}</span>
                  </div>
                  <p className={`mt-0.5 font-mono text-[10px] font-semibold ${s.positive ? "text-accent-400" : "text-red-400"}`}>
                    {s.trend} wk
                  </p>
                </div>
              ))}
            </div>

            {/* Cited pages */}
            <div className="mt-5">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-2">Top cited pages</p>
              <div className="divide-y divide-gray-800">
                {citedPages.slice(0, 3).map((p) => (
                  <div key={p.url} className="flex items-center justify-between py-2">
                    <span className="truncate font-mono text-[12px] text-gray-300">{p.url}</span>
                    <span className="font-mono text-[11px] font-semibold text-accent-400 tabular-nums">
                      {p.cites} cites
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FeatureHero>

      {/* What's inside */}
      <section id="whats-inside" className="border-t border-gray-100 bg-white px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[5fr_7fr] lg:items-end lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">{t("whatsInside.eyebrow")}</p>
              <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-gray-900">
                {t("whatsInside.h2")}
              </h2>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-gray-600">
              {t("whatsInside.intro")}
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
            {sections.map((s) => (
              <div key={s.tag} className="relative pl-12">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 font-mono text-[22px] font-bold tabular-nums leading-none text-accent-500"
                >
                  {s.num}
                </span>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                  {s.tag}
                </p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight text-gray-900">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI competitors visual */}
      <section className="border-t border-[var(--surface-steel-border)] bg-[var(--surface-steel)] px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">{t("sov.eyebrow")}</p>
              <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-gray-900">
                {t("sov.h2")}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-gray-600">
                {t("sov.body")}
              </p>
            </div>

            <div className="lg:col-span-7">
              <figure aria-label={t("sov.figureAria")} className="m-0 rounded-[2rem] border border-gray-200 bg-white p-6 sm:p-8 shadow-[0_20px_40px_-20px_rgba(15,23,42,0.08)]">
                <span className="sr-only">{t("sov.figureSrOnly")}</span>
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-600">
                    Top 4 of 12 · share of voice
                  </span>
                  <span className="font-mono text-[11px] text-gray-500">30 days</span>
                </div>
                <div className="mt-4 divide-y divide-gray-100">
                  {aiCompetitors.map((comp) => {
                    const positive = comp.delta.startsWith("+")
                    return (
                      <div key={comp.domain} className="py-4">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[13px] font-medium text-gray-900">{comp.domain}</span>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-sm font-semibold tabular-nums text-accent-700">{comp.share}%</span>
                            <span className={`font-mono text-[11px] font-semibold ${positive ? "text-accent-700" : "text-red-600"}`}>{comp.delta}</span>
                          </div>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                          <div className="h-full rounded-full bg-accent-700" style={{ width: `${comp.share}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-[13px] text-gray-500">{t("sov.figureCaption")}</span>
                  <Link
                    href="/app"
                    prefetch={false}
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent-700 hover:text-accent-900"
                  >
                    {t("sov.figureCta")}
                    <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </figure>
            </div>
          </div>
        </div>
      </section>

      <FeatureFaq items={faqs} heading={c("faqHeading")} />

      <RelatedFeatures
        current="domain-overview"
        related={["geo-scan", "competitor-intel", "analytics", "ask-geotoolbox"]}
        base={base}
        copy={c.raw("related") as { eyebrow: string; heading: string; allFeatures: string; learnMore: string }}
        descriptions={cardDescriptions}
      />

      {/* CTA */}
      <section className="bg-gray-950 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
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
