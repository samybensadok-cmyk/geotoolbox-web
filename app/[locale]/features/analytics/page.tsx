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

// Localized Analytics feature page: en at /features/analytics, fr at
// /fr/features/analytics. Relocated from app/(marketing)/features/analytics.
// ALL display copy lives in the `featurePages.analytics` message namespace
// (shared strings in `featurePages.common`); structural data — hues, dashboard
// tags, pictogram kinds, zone styling — stays here. The AI-traffic figure and
// the 13 dashboard tab names DEPICT the English product UI, so their sample
// data and tab labels stay English on both locales.

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "featurePages.analytics.meta" })
  return {
    title: { absolute: t("title") },
    description: t("description"),
    openGraph: { title: t("ogTitle"), description: t("ogDescription") },
    alternates: marketingAlternatesFor("/features/analytics", locale),
  }
}

type Viz = "bars" | "sparkDown" | "sparkUp" | "gauge" | "rows" | "dots" | "scatter" | "cloud" | "clusters" | "grid" | "compare"
type Cat = "Core" | "Opportunity" | "Diagnostic" | "Deep dive"
type Outcome = { tag: string; title: string; body: string }
type Faq = { question: string; answer: string }
type Zone = { label: string; subtitle: string }

// Structural map only — the tab name (product UI, EN) drives the localized
// description lookup; category + viz drive zone grouping and the pictogram.
const subDashboards: { tag: string; cat: Cat; viz: Viz }[] = [
  { tag: "Overview",        cat: "Core",        viz: "grid" },
  { tag: "Compare",         cat: "Core",        viz: "compare" },
  { tag: "Quick Wins",      cat: "Opportunity", viz: "gauge" },
  { tag: "Content Decay",   cat: "Opportunity", viz: "sparkDown" },
  { tag: "Click Potential", cat: "Opportunity", viz: "sparkUp" },
  { tag: "Cannibalization", cat: "Diagnostic",  viz: "scatter" },
  { tag: "Health",          cat: "Diagnostic",  viz: "dots" },
  { tag: "Trajectory",      cat: "Diagnostic",  viz: "sparkUp" },
  { tag: "Pages",           cat: "Deep dive",   viz: "rows" },
  { tag: "Sections",        cat: "Deep dive",   viz: "bars" },
  { tag: "Keywords",        cat: "Deep dive",   viz: "rows" },
  { tag: "Keyword Cloud",   cat: "Deep dive",   viz: "cloud" },
  { tag: "Clusters",        cat: "Deep dive",   viz: "clusters" },
]

// Illustrative mockup sample data — depicts the English product UI, so engine
// names and figures stay English on both locales (same as the FR HeroMockup).
const aiTraffic = [
  { source: "ChatGPT", sessions: 487, delta: "+23%" },
  { source: "Perplexity", sessions: 342, delta: "+41%" },
  { source: "AI Overviews", sessions: 203, delta: "+18%" },
  { source: "Gemini", sessions: 128, delta: "+8%" },
  { source: "Claude", sessions: 94, delta: "+12%" },
  { source: "Bing Copilot", sessions: 67, delta: "+4%" },
]

/**
 * Pictogram — tiny 56x32 SVG that hints at the shape of each dashboard view.
 * Stroke color is passed in (matches the card's group accent) so the whole
 * zone reads as visually consistent. Each picto is decorative (aria-hidden).
 */
function Pictogram({ kind, color }: { kind: Viz; color: string }) {
  const stroke = color
  const base = { width: 56, height: 32, viewBox: "0 0 56 32", fill: "none", "aria-hidden": true, className: "shrink-0" }

  switch (kind) {
    case "bars":
      return (
        <svg {...base}>
          <rect x="4"  y="18" width="6" height="10" rx="1" fill={stroke} opacity="0.35" />
          <rect x="14" y="10" width="6" height="18" rx="1" fill={stroke} opacity="0.55" />
          <rect x="24" y="6"  width="6" height="22" rx="1" fill={stroke} opacity="0.75" />
          <rect x="34" y="14" width="6" height="14" rx="1" fill={stroke} opacity="0.5" />
          <rect x="44" y="4"  width="6" height="24" rx="1" fill={stroke} />
        </svg>
      )
    case "sparkDown":
      return (
        <svg {...base}>
          <polyline
            points="4,6 14,11 22,9 30,16 38,21 46,24 52,28"
            stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
          />
          <circle cx="52" cy="28" r="2" fill={stroke} />
        </svg>
      )
    case "sparkUp":
      return (
        <svg {...base}>
          <polyline
            points="4,26 14,22 22,24 30,16 38,12 46,8 52,4"
            stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
          />
          <circle cx="52" cy="4" r="2" fill={stroke} />
        </svg>
      )
    case "gauge":
      return (
        <svg {...base}>
          <path d="M6 26 A 22 22 0 0 1 50 26" stroke={stroke} strokeWidth="2" opacity="0.25" fill="none" strokeLinecap="round" />
          <path d="M6 26 A 22 22 0 0 1 38 7"  stroke={stroke} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="38" cy="7" r="2.5" fill={stroke} />
        </svg>
      )
    case "rows":
      return (
        <svg {...base}>
          <rect x="4"  y="6"  width="44" height="3" rx="1.5" fill={stroke} opacity="0.85" />
          <rect x="4"  y="14" width="32" height="3" rx="1.5" fill={stroke} opacity="0.55" />
          <rect x="4"  y="22" width="38" height="3" rx="1.5" fill={stroke} opacity="0.35" />
        </svg>
      )
    case "dots":
      return (
        <svg {...base}>
          <circle cx="8"  cy="10" r="3" fill={stroke} />
          <circle cx="20" cy="10" r="3" fill={stroke} />
          <circle cx="32" cy="10" r="3" fill={stroke} opacity="0.35" />
          <circle cx="8"  cy="22" r="3" fill={stroke} opacity="0.35" />
          <circle cx="20" cy="22" r="3" fill={stroke} />
          <circle cx="32" cy="22" r="3" fill={stroke} />
          <circle cx="44" cy="16" r="3" fill={stroke} opacity="0.55" />
        </svg>
      )
    case "scatter":
      // two overlapping circles — cannibalization
      return (
        <svg {...base}>
          <circle cx="20" cy="16" r="10" stroke={stroke} strokeWidth="2" fill={stroke} fillOpacity="0.12" />
          <circle cx="34" cy="16" r="10" stroke={stroke} strokeWidth="2" fill={stroke} fillOpacity="0.12" />
        </svg>
      )
    case "cloud":
      // keyword cloud — varied-size tokens
      return (
        <svg {...base}>
          <rect x="4"  y="10" width="14" height="6" rx="2" fill={stroke} opacity="0.85" />
          <rect x="22" y="6"  width="18" height="8" rx="2" fill={stroke} />
          <rect x="44" y="11" width="10" height="5" rx="1.5" fill={stroke} opacity="0.5" />
          <rect x="8"  y="20" width="8"  height="4" rx="1.5" fill={stroke} opacity="0.35" />
          <rect x="20" y="18" width="12" height="6" rx="2" fill={stroke} opacity="0.65" />
          <rect x="36" y="20" width="16" height="5" rx="1.5" fill={stroke} opacity="0.85" />
        </svg>
      )
    case "clusters":
      // three grouped dot clusters
      return (
        <svg {...base}>
          <circle cx="9"  cy="10" r="2" fill={stroke} />
          <circle cx="14" cy="14" r="2" fill={stroke} />
          <circle cx="10" cy="18" r="2" fill={stroke} />
          <circle cx="28" cy="8"  r="2" fill={stroke} />
          <circle cx="32" cy="13" r="2" fill={stroke} />
          <circle cx="26" cy="16" r="2" fill={stroke} />
          <circle cx="44" cy="12" r="2" fill={stroke} />
          <circle cx="48" cy="18" r="2" fill={stroke} />
          <circle cx="43" cy="22" r="2" fill={stroke} />
        </svg>
      )
    case "grid":
      // KPI grid — 2x2 rounded tiles
      return (
        <svg {...base}>
          <rect x="6"  y="4"  width="20" height="11" rx="2" fill={stroke} opacity="0.65" />
          <rect x="30" y="4"  width="20" height="11" rx="2" fill={stroke} opacity="0.35" />
          <rect x="6"  y="19" width="20" height="11" rx="2" fill={stroke} opacity="0.5" />
          <rect x="30" y="19" width="20" height="11" rx="2" fill={stroke} opacity="0.85" />
        </svg>
      )
    case "compare":
      // side-by-side bar clusters, 2 periods
      return (
        <svg {...base}>
          <rect x="6"  y="14" width="4" height="14" rx="1" fill={stroke} opacity="0.35" />
          <rect x="12" y="8"  width="4" height="20" rx="1" fill={stroke} opacity="0.55" />
          <rect x="18" y="4"  width="4" height="24" rx="1" fill={stroke} opacity="0.75" />
          <rect x="32" y="10" width="4" height="18" rx="1" fill={stroke} opacity="0.55" />
          <rect x="38" y="16" width="4" height="12" rx="1" fill={stroke} opacity="0.75" />
          <rect x="44" y="6"  width="4" height="22" rx="1" fill={stroke} />
          <path d="M26 6 v20" stroke={stroke} strokeWidth="1" opacity="0.25" strokeDasharray="2 2" />
        </svg>
      )
    default:
      return null
  }
}

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("featurePages.analytics")
  const c = await getTranslations("featurePages.common")
  const base = locale === routing.defaultLocale ? "" : `/${locale}`
  const urlBase = `${siteConfig.url}${base}`

  const zones = t.raw("dashboards.zones") as Record<Cat, Zone>
  const dashDescriptions = t.raw("dashboards.descriptions") as Record<string, string>
  const outcomes = t.raw("outcomes.items") as Outcome[]
  const faqs = t.raw("faqs") as Faq[]
  const cardDescriptions = c.raw("cardDescriptions") as Record<string, string>
  const breadcrumbLabels = { home: c("breadcrumbHome"), features: c("breadcrumbFeatures") }

  return (
    <>
      <JsonLd data={[
        softwareApplicationSchema({
          name: "Analytics",
          description: t("schema.appDescription"),
          url: `${urlBase}/features/analytics`,
        }),
      ]} />

      {/* Hero — cool clinical atmosphere, migrated to the shared dark FeatureHero */}
      <FeatureHero
        featureName="Analytics"
        hue="cool"
        base={base}
        breadcrumbLabels={breadcrumbLabels}
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subhead={t("hero.subhead")}
        primaryLabel={t("hero.primaryLabel")}
        primaryHref="/app"
        secondaryLabel={t("hero.secondaryLabel")}
        secondaryHref="#dashboards"
        microcopy={
          <>
            <span className="font-semibold text-gray-300">{t("hero.microcopyBeta")}</span>{" "}
            {t("hero.microcopyPre")}{" "}
            <a
              href="mailto:samy@geotoolbox.ai"
              className="underline underline-offset-2 transition-colors hover:text-white"
            >
              {t("hero.microcopyEmail")}
            </a>{" "}
            {t("hero.microcopyPost")}
          </>
        }
      >
        {/* AI traffic visual */}
        <figure aria-label={t("hero.figureAriaLabel")} className="relative m-0 rounded-[2rem] border border-gray-200 bg-white p-6 sm:p-8 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.12)]">
                <span className="sr-only">{t("hero.figureSrOnly")}</span>
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-600">
                    AI traffic · last 30 days
                  </span>
                  <span className="rounded-full bg-accent-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-accent-700">
                    GA4 connected
                  </span>
                </div>
                <div className="mt-4 flex items-end gap-3 font-mono">
                  <p className="text-4xl font-bold tabular-nums text-accent-700">1,321</p>
                  <p className="pb-1 text-sm text-gray-600">AI-attributed sessions</p>
                  <p className="pb-1 ml-auto text-sm font-semibold text-accent-700">+27%</p>
                </div>
                <div className="mt-5 divide-y divide-gray-100">
                  {aiTraffic.map((row) => {
                    const pct = Math.round((row.sessions / 1321) * 100)
                    return (
                      <div key={row.source} className="py-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] font-medium text-gray-900">{row.source}</span>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[13px] font-semibold tabular-nums text-gray-900">{row.sessions}</span>
                            <span className="font-mono text-[11px] font-semibold text-accent-700">{row.delta}</span>
                          </div>
                        </div>
                        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-gray-100">
                          <div className="h-full rounded-full bg-accent-700" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
        </figure>
      </FeatureHero>

      {/* 13 sub-dashboards */}
      <section id="dashboards" className="border-t border-gray-100 bg-white px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[5fr_7fr] lg:items-end lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">{t("dashboards.eyebrow")}</p>
              <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-gray-900">
                {t("dashboards.h2")}
              </h2>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-gray-600">
              {t("dashboards.intro")}
            </p>
          </div>

          {/* Grouped by intent as 4 bento zones. Each zone has its own tinted
              panel + dot accent + subtitle, making the category coding
              genuinely visual instead of a 3px left border. Cards inside use
              white tiles with per-card mini-pictograms that hint at what the
              view actually looks like (bars/sparkline/gauge/dots/etc). */}
          <div className="mt-14 space-y-6">
            {(["Core", "Opportunity", "Diagnostic", "Deep dive"] as const).map((cat) => {
              const items = subDashboards.filter((d) => d.cat === cat)
              const zone = {
                Core:         { bg: "bg-accent-50/50",   border: "border-accent-100",   dot: "bg-accent-500",   text: "text-accent-700",   pictoHex: "#0f766e" },
                Opportunity:  { bg: "bg-emerald-50/50",  border: "border-emerald-100",  dot: "bg-emerald-500",  text: "text-emerald-700",  pictoHex: "#059669" },
                Diagnostic:   { bg: "bg-amber-50/60",    border: "border-amber-100",    dot: "bg-amber-500",    text: "text-amber-700",    pictoHex: "#b45309" },
                "Deep dive":  { bg: "bg-slate-100/50",   border: "border-slate-200",    dot: "bg-slate-500",    text: "text-slate-700",    pictoHex: "#475569" },
              }[cat]
              const gridCols = {
                Core:        "sm:grid-cols-2",
                Opportunity: "sm:grid-cols-2 lg:grid-cols-3",
                Diagnostic:  "sm:grid-cols-2 lg:grid-cols-3",
                "Deep dive": "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
              }[cat]
              return (
                <div
                  key={cat}
                  className={`rounded-3xl border ${zone.border} ${zone.bg} p-5 sm:p-7`}
                >
                  {/* Zone header */}
                  <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block h-2 w-2 rounded-full ${zone.dot}`} aria-hidden="true" />
                      <p className={`font-mono text-[11px] font-semibold uppercase tracking-widest ${zone.text}`}>
                        {zones[cat].label}
                      </p>
                      <span className="font-mono text-[11px] text-gray-500">
                        &middot; {items.length} {items.length === 1 ? t("dashboards.viewSingular") : t("dashboards.viewPlural")}
                      </span>
                    </div>
                    <span className="text-[13px] text-gray-600">{zones[cat].subtitle}</span>
                  </div>

                  {/* Tile grid */}
                  <div className={`grid grid-cols-1 gap-3 ${gridCols}`}>
                    {items.map((d) => (
                      <div
                        key={d.tag}
                        className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-[0_12px_24px_-12px_rgba(15,23,42,0.14)]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="text-[15px] font-semibold tracking-tight text-gray-900">
                              {d.tag}
                            </h3>
                            <p className="mt-1 text-[13px] leading-relaxed text-gray-600">
                              {dashDescriptions[d.tag]}
                            </p>
                          </div>
                          <Pictogram kind={d.viz} color={zone.pictoHex} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Inline CTA at peak intent — echoes the hero CTA with OAuth context */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-6">
            <p className="text-[13px] text-gray-500">
              {t("dashboards.ctaNote")}
            </p>
            <Link
              href="/app"
              prefetch={false}
              className="inline-flex items-center gap-1.5 rounded-sm text-[13px] font-semibold text-accent-700 transition-colors duration-200 hover:text-accent-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
            >
              {t("dashboards.ctaLink")}
              <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="border-t border-[var(--surface-cool-border)] bg-[var(--surface-cool)] px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">{t("outcomes.eyebrow")}</p>
            <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-gray-900">
              {t("outcomes.h2")}
            </h2>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
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
        current="analytics"
        related={["domain-overview", "geo-scan", "content-analyzer", "ask-geotoolbox"]}
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
            <p className="mt-2 text-base text-gray-300">
              {t("finalCta.ctaSubPre")}{" "}
              <a href="mailto:samy@geotoolbox.ai" className="font-semibold text-white underline underline-offset-2 hover:text-accent-400">
                {t("finalCta.ctaSubEmail")}
              </a>{" "}
              {t("finalCta.ctaSubPost")}
            </p>
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
