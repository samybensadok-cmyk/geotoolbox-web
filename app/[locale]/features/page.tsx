import type { Metadata } from "next"
import Link from "next/link"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { breadcrumbsSchema, itemListSchema } from "@/lib/seo-schema"
import { marketingAlternatesFor } from "@/lib/i18n/siblings"

// Localized features hub: en at /features, fr at /fr/features. Relocated from
// app/(marketing)/features/page.tsx. Individual /features/<slug> pages stay
// EN-only under (marketing). Display copy comes from the `features` message
// namespace by index; the structural meta (slug, product name, tint, anchor
// key) stays here — product/brand names are never translated.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "features.meta" })
  return {
    title: { absolute: t("title") },
    description: t("description"),
    alternates: marketingAlternatesFor("/features", locale),
  }
}

// Per-feature atmospheric tint — matches each feature page's assigned
// --surface-* token in globals.css.
const tintMap = {
  mint:  { bg: "bg-[var(--surface-mint)]",  border: "border-[var(--surface-mint-border)]",  accent: "text-accent-700",   dot: "bg-accent-500" },
  lilac: { bg: "bg-[var(--surface-lilac)]", border: "border-[var(--surface-lilac-border)]", accent: "text-indigo-700",   dot: "bg-indigo-500" },
  warm:  { bg: "bg-[var(--surface-warm)]",  border: "border-[var(--surface-warm-border)]",  accent: "text-amber-800",    dot: "bg-amber-600" },
  steel: { bg: "bg-[var(--surface-steel)]", border: "border-[var(--surface-steel-border)]", accent: "text-slate-700",    dot: "bg-slate-500" },
  blush: { bg: "bg-[var(--surface-blush)]", border: "border-[var(--surface-blush-border)]", accent: "text-rose-700",     dot: "bg-rose-500" },
  peach: { bg: "bg-[var(--surface-peach)]", border: "border-[var(--surface-peach-border)]", accent: "text-orange-700",   dot: "bg-orange-500" },
  cool:  { bg: "bg-[var(--surface-cool)]",  border: "border-[var(--surface-cool-border)]",  accent: "text-sky-700",      dot: "bg-sky-500" },
  iris:  { bg: "bg-[var(--surface-iris)]",  border: "border-[var(--surface-iris-border)]",  accent: "text-violet-700",   dot: "bg-violet-500" },
} as const

type TintKey = keyof typeof tintMap

// Structural group meta (stable across locales): anchor key, eyebrow color,
// grid layout, and each feature's slug + English product name + tint. Display
// label/headline/blurb/highlights come from messages, merged by index.
const groupMeta: {
  key: string
  eyebrow: string
  gridCols: string
  features: { slug: string; name: string; tint: TintKey }[]
}[] = [
  {
    key: "scanning",
    eyebrow: "text-accent-700",
    gridCols: "grid-cols-1",
    features: [
      { slug: "geo-scan", name: "GEO Scan", tint: "mint" },
      { slug: "agent-readiness", name: "Agent Readiness", tint: "steel" },
      { slug: "query-fanout", name: "Query Fan-Out", tint: "iris" },
    ],
  },
  {
    key: "analysis",
    eyebrow: "text-emerald-700",
    gridCols: "grid-cols-1 md:grid-cols-2",
    features: [
      { slug: "content-analyzer", name: "Content Analyzer", tint: "lilac" },
      { slug: "content-studio", name: "Content Studio", tint: "warm" },
    ],
  },
  {
    key: "intelligence",
    eyebrow: "text-indigo-700",
    gridCols: "grid-cols-1 md:grid-cols-2",
    features: [
      { slug: "domain-overview", name: "Domain Overview", tint: "steel" },
      { slug: "competitor-intel", name: "Competitor Intel", tint: "blush" },
      { slug: "community", name: "Community", tint: "peach" },
      { slug: "citation-interceptor", name: "Citation Interceptor", tint: "lilac" },
      { slug: "ask-geotoolbox", name: "Ask GeoToolBox", tint: "mint" },
    ],
  },
  {
    key: "reporting",
    eyebrow: "text-amber-700",
    gridCols: "grid-cols-1 md:grid-cols-2",
    features: [
      { slug: "analytics", name: "Analytics (GSC + GA4)", tint: "cool" },
      { slug: "pr-coverage-tracker", name: "PR Coverage Tracker", tint: "warm" },
      { slug: "white-label-reports", name: "White-Label Reports", tint: "blush" },
    ],
  },
]

type GroupCopy = {
  label: string
  headline: string
  features: { blurb: string; highlights: string[] }[]
}

const CTA_PILLS = [
  "GEO Scan", "Query Fan-Out", "Domain Overview", "Content Analyzer", "Content Studio",
  "Competitor Intel", "Citation Interceptor", "Analytics", "Community", "PR Coverage",
]

export default async function FeaturesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("features")
  const tBlog = await getTranslations("blog")
  const base = locale === "en" ? "" : `/${locale}`
  const groupCopy = t.raw("groups") as GroupCopy[]

  // Merge structural meta with localized copy by index.
  const groups = groupMeta.map((g, gi) => ({
    ...g,
    label: groupCopy[gi].label,
    headline: groupCopy[gi].headline,
    features: g.features.map((f, fi) => ({ ...f, ...groupCopy[gi].features[fi] })),
  }))
  const allFeatures = groups.flatMap((g) => g.features)

  return (
    <>
      {/* Hero — dark opening act (homepage/feature-hero language); the tinted
          pill strip reads as each feature's colored light on the dark ground */}
      <section className="relative overflow-hidden bg-gray-950 px-6 pt-20 pb-14 sm:pt-24 sm:pb-16">
        {/* Ambient depth — brand-teal aurora + faint cool glow, as on the homepage hero */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: [
              "radial-gradient(ellipse 720px 520px at 85% 8%, rgba(20, 184, 166, 0.14), transparent 70%)",
              "radial-gradient(ellipse 640px 440px at 8% 30%, rgba(56, 189, 248, 0.05), transparent 70%)",
            ].join(","),
          }}
        />
        {/* Dotted grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(148 163 184 / 1) 1px, transparent 0)",
            backgroundSize: "22px 22px",
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.9) 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.9) 100%)",
            opacity: 0.07,
          }}
        />
        <JsonLd
          data={[
            breadcrumbsSchema([
              { name: tBlog("home"), url: base || "/" },
              { name: t("hero.eyebrow"), url: `${base}/features` },
            ]),
            itemListSchema(
              siteConfig.featureGroups.flatMap((g) => g.features).map((f) => ({
                name: f.name,
                url: `${base}/features/${f.slug}`,
              })),
              { name: "GEO Toolbox features" },
            ),
          ]}
        />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[6fr_6fr] lg:items-end lg:gap-16">
            <div className="animate-fade-up">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-300">
                {t("hero.eyebrow")}
              </p>
              <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-white">
                {t("hero.h1a")}
                <br />
                <span className="text-accent-300">{t("hero.h1b")}</span>
              </h1>
            </div>
            <p className="stagger-2 max-w-xl text-base leading-relaxed text-gray-300">
              {t("hero.intro")}
            </p>
          </div>

          {/* Atmospheric preview strip — each tinted pill is a colored light on
              the dark ground; each scrolls to its feature. */}
          <ul className="stagger-3 mt-10 flex flex-wrap items-center gap-2">
            {allFeatures.map((f) => {
              const tint = tintMap[f.tint]
              return (
                <li key={f.slug}>
                  <Link
                    href={`#feature-${f.slug}`}
                    className={`inline-flex items-center gap-2 rounded-full border ${tint.border} ${tint.bg} px-3 py-1.5 text-[12px] font-semibold text-gray-800 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_-6px_rgba(0,0,0,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${tint.dot}`} aria-hidden="true" />
                    {f.name.replace(" (GSC + GA4)", "")}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* Feature gallery — each card renders in its atmospheric color */}
      <section className="bg-white px-6 pb-24 sm:pb-32">
        {/* Mobile sticky jump-nav — group-level */}
        <nav
          aria-label="Feature groups"
          className="sticky top-14 z-20 -mx-6 mb-10 overflow-x-auto border-b border-gray-200 bg-white/90 px-6 py-3 backdrop-blur-md lg:hidden"
        >
          <ul className="mx-auto flex max-w-7xl gap-2 whitespace-nowrap">
            {groups.map((g) => (
              <li key={g.key}>
                <a
                  href={`#group-${g.key}`}
                  className="inline-block rounded-full bg-gray-100 px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-700 transition-colors duration-200 hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
                >
                  {g.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mx-auto max-w-7xl divide-y divide-gray-200">
          {groups.map((group) => (
            <div
              key={group.key}
              id={`group-${group.key}`}
              className="scroll-mt-28 grid grid-cols-1 gap-8 py-12 lg:grid-cols-[4fr_8fr] lg:gap-16 lg:py-16"
            >
              {/* Group label — sticky sidebar on desktop */}
              <div className="lg:sticky lg:top-20 lg:h-fit">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gray-400" aria-hidden="true" />
                  <p className={`font-mono text-[11px] font-semibold uppercase tracking-widest ${group.eyebrow}`}>
                    {group.label}
                  </p>
                </div>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900">
                  {group.headline}
                </h2>
                <p className="mt-2 text-[13px] text-gray-500">
                  {group.features.length}{" "}
                  {group.features.length === 1 ? t("toolSingular") : t("toolPlural")}
                </p>
              </div>

              {/* Feature tinted cards */}
              <div className={`grid gap-5 ${group.gridCols}`}>
                {group.features.map((f) => {
                  const tint = tintMap[f.tint]
                  return (
                    <Link
                      key={f.slug}
                      href={`${base}/features/${f.slug}`}
                      id={`feature-${f.slug}`}
                      className={`group/card scroll-mt-28 block rounded-2xl border ${tint.border} ${tint.bg} p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-16px_rgba(15,23,42,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 sm:p-7`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-semibold tracking-tight text-gray-900">
                          {f.name}
                        </h3>
                        <span
                          aria-hidden="true"
                          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${tint.border} bg-white ${tint.accent} transition-transform group-hover/card:translate-x-0.5`}
                        >
                          <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </div>
                      <p className="mt-3 text-[14.5px] leading-relaxed text-gray-700">
                        {f.blurb}
                      </p>
                      <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                        {f.highlights.map((h) => (
                          <li key={h} className="flex items-center gap-2 text-[13px] text-gray-700">
                            <span className={`h-1.5 w-1.5 rounded-full ${tint.dot}`} aria-hidden="true" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA — features-index variant with capability pills */}
      <section className="relative overflow-hidden bg-gray-950 px-6 py-20 sm:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[7fr_5fr] lg:items-end lg:gap-16">
            <div>
              <h2 className="text-[clamp(1.5rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-white">
                {t("cta.h2")}
              </h2>
              <p className="mt-3 max-w-xl text-base text-gray-300">
                {t("cta.body")}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-1.5">
                {CTA_PILLS.map((f) => (
                  <span
                    key={f}
                    className="rounded-full border border-gray-800 bg-gray-900/50 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-400"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-start gap-3 lg:items-end">
              <Link
                href="/app" prefetch={false}
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
              >
                {t("cta.ctaPrimary")}
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <p className="font-mono text-[11px] text-gray-500">
                {t("cta.foot")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
