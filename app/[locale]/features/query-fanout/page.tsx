import type { Metadata } from "next"
import Link from "next/link"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { FeatureHero } from "@/components/features/feature-hero"
import { RelatedFeatures } from "@/components/features/related-features"
import { FeatureFaq } from "@/components/features/feature-faq"
import { FeatureComparisonTable } from "@/components/features/feature-comparison-table"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { softwareApplicationSchema, howToSchema } from "@/lib/seo-schema"
import { marketingAlternatesFor } from "@/lib/i18n/siblings"

// Localized Query Fan-Out feature page: en at /features/query-fanout, fr at
// /fr/features/query-fanout. Relocated from app/(marketing)/features/query-fanout.
// ALL display copy lives in the `featurePages.query-fanout` message namespace
// (shared strings in `featurePages.common`); structural data — hues, the
// mockup device sample data (fan-out queries are search queries → English) —
// stays here. Product and engine names are never translated.

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "featurePages.query-fanout.meta" })
  return {
    title: { absolute: t("title") },
    description: t("description"),
    openGraph: { title: t("ogTitle"), description: t("ogDescription") },
    alternates: marketingAlternatesFor("/features/query-fanout", locale),
  }
}

type Step = { verb: string; title: string; body: string }
type Inside = { num: string; tag: string; title: string; body: string }
type Faq = { question: string; answer: string }
type Cell = boolean | string
type CompRow = { label: string; cells: Cell[] }

// —— Example hero-device data (clearly labelled "Example data" in the UI).
// Fan-out queries are literal search queries → English on both locales. ——
const fanRows: { q: string; engines: string[]; kind: "fired" | "related"; vol: string }[] = [
  { q: "best AI SEO tools compared 2026", engines: ["ChatGPT", "Gemini", "Grok"], kind: "fired", vol: "2.4K/mo" },
  { q: "how to measure AI search visibility", engines: ["Gemini", "Grok"], kind: "fired", vol: "880/mo" },
  { q: "GEO tools built for agencies", engines: ["Gemini"], kind: "fired", vol: "parent reach" },
  { q: "do AI SEO tools actually work", engines: ["Perplexity"], kind: "related", vol: "no volume" },
]

// —— Divergence matrix: intents × engines (filled = that engine fired a query for it) ——
type EngineKey = "chatgpt" | "gemini" | "perplexity" | "grok"
// ChatGPT's API returns a single web-search call per request, so it fires for at
// most one intent here — Gemini/Grok carry the depth, Perplexity surfaces related.
const divergence: { intent: string; type: "shared" | "whitespace"; on: Record<EngineKey, boolean> }[] = [
  { intent: "Compare the leading tools", type: "shared", on: { chatgpt: true, gemini: true, perplexity: true, grok: true } },
  { intent: "How to measure AI visibility", type: "shared", on: { chatgpt: false, gemini: true, perplexity: true, grok: true } },
  { intent: "Pricing & plans for teams", type: "shared", on: { chatgpt: false, gemini: true, perplexity: true, grok: false } },
  { intent: "GEO tools for agencies", type: "whitespace", on: { chatgpt: false, gemini: true, perplexity: false, grok: false } },
  { intent: "Are these tools worth it?", type: "whitespace", on: { chatgpt: false, gemini: false, perplexity: true, grok: false } },
  { intent: "Free AI visibility checker", type: "whitespace", on: { chatgpt: false, gemini: false, perplexity: false, grok: true } },
]

export default async function QueryFanoutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("featurePages.query-fanout")
  const c = await getTranslations("featurePages.common")
  const base = locale === routing.defaultLocale ? "" : `/${locale}`
  const urlBase = `${siteConfig.url}${base}`

  const steps = t.raw("how.steps") as Step[]
  const inside = t.raw("inside.items") as Inside[]
  const comparisonColumns = t.raw("comparison.columns") as string[]
  const comparisonRows = t.raw("comparison.rows") as CompRow[]
  const faqs = t.raw("faqs") as Faq[]
  const cardDescriptions = c.raw("cardDescriptions") as Record<string, string>
  const breadcrumbLabels = { home: c("breadcrumbHome"), features: c("breadcrumbFeatures") }

  return (
    <>
      {/* ——— Hero: iris glow, dark ground, custom fan-out instrument ——— */}
      <JsonLd
        data={[
          softwareApplicationSchema({
            name: "AI Query Fan-Out",
            description: t("schema.appDescription"),
            url: `${urlBase}/features/query-fanout`,
          }),
          howToSchema({
            name: t("schema.howToName"),
            steps: steps.map((s) => ({ name: s.title, text: s.body })),
          }),
        ]}
      />

      <FeatureHero
        featureName="Query Fan-Out"
        hue="iris"
        base={base}
        breadcrumbLabels={breadcrumbLabels}
        eyebrow={t("hero.eyebrow")}
        title={
          <>
            {t("hero.h1Line1")}
            <span className="block">
              {t("hero.h1Line2Lead")}<span className="text-accent-300">{t("hero.h1Accent")}</span>{t("hero.h1Line2Tail")}
            </span>
          </>
        }
        subhead={t("hero.subhead")}
        primaryLabel={t("hero.primaryLabel")}
        primaryHref="/tools/query-fanout"
        secondaryLabel={t("hero.secondaryLabel")}
        secondaryHref="#how"
        microcopy={t("hero.microcopy")}
      >
        <FanOutDevice ariaLabel={t("device.ariaLabel")} srOnly={t("device.srOnly")} />
      </FeatureHero>

      {/* ——— Pain scenario ——— */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
            {t("pain.eyebrow")}
          </p>
          <p className="mt-4 text-[clamp(1.15rem,2vw,1.4rem)] font-medium leading-relaxed tracking-tight text-gray-900">
            {t("pain.p1")}
          </p>
          <p className="mt-5 text-[15px] leading-relaxed text-gray-600">
            {t("pain.p2")}
          </p>
        </div>
      </section>

      {/* ——— How it works: numbered rail (not cards) ——— */}
      <section id="how" className="scroll-mt-20 border-t border-[var(--surface-iris-border)] bg-[var(--surface-iris)] px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">{t("how.eyebrow")}</p>
            <h2 className="mt-3 text-[clamp(1.6rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
              {t("how.h2")}
            </h2>
          </div>

          <ol className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.verb} className="relative">
                {/* connector line on desktop */}
                {i < steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-12 right-0 top-[18px] hidden h-px bg-gradient-to-r from-gray-300 to-transparent md:block"
                  />
                )}
                <div className="flex items-center gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent-200 bg-white font-mono text-[13px] font-bold tabular-nums text-accent-700">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                    {s.verb}
                  </span>
                </div>
                <h3 className="mt-5 text-[17px] font-bold leading-snug tracking-tight text-gray-900">{s.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-gray-600">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ——— The divergence map: the signature artifact ——— */}
      <section className="border-t border-gray-100 bg-white px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                {t("divergence.eyebrow")}
              </p>
              <h2 className="mt-3 text-[clamp(1.6rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
                {t("divergence.h2")}
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-gray-600">
                {t("divergence.intro")}
              </p>
              <dl className="mt-8 space-y-5">
                <div className="flex gap-4">
                  <dt className="mt-1 shrink-0">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-700">
                      <span className="h-2 w-2 rounded-full bg-white" />
                    </span>
                  </dt>
                  <dd className="text-[14px] leading-relaxed text-gray-600">
                    <span className="font-semibold text-gray-900">{t("divergence.sharedLabel")}</span>{t("divergence.sharedRest")}
                  </dd>
                </div>
                <div className="flex gap-4">
                  <dt className="mt-1 shrink-0">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-dashed border-amber-400 bg-amber-50">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                    </span>
                  </dt>
                  <dd className="text-[14px] leading-relaxed text-gray-600">
                    <span className="font-semibold text-gray-900">{t("divergence.whitespaceLabel")}</span>{t("divergence.whitespaceRest")}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="lg:col-span-7">
              <DivergenceMatrix
                ariaLabel={t("divergence.matrixAria")}
                caption={t("divergence.matrixCaption")}
                runYourOwn={t("divergence.matrixRunYourOwn")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ——— What's inside: numbered editorial grid (anti-card) ——— */}
      <section className="border-t border-[var(--surface-iris-border)] bg-[var(--surface-iris)] px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[5fr_7fr] lg:items-end lg:gap-16">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                {t("inside.eyebrow")}
              </p>
              <h2 className="mt-3 text-[clamp(1.6rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
                {t("inside.h2")}
              </h2>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-gray-600">
              {t("inside.intro")}
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {inside.map((s) => (
              <div key={s.num} className="relative pl-12">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 font-mono text-[22px] font-bold leading-none tabular-nums text-accent-500"
                >
                  {s.num}
                </span>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">{s.tag}</p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight text-gray-900">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Comparison ——— */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">{t("comparison.eyebrow")}</p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
              {t("comparison.h2")}
            </h2>
            <div className="mt-8 rounded-[2rem] border border-gray-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.16)] sm:p-8">
              <FeatureComparisonTable
                columns={comparisonColumns}
                rows={comparisonRows}
                yesLabel={c("comparison.yes")}
                noLabel={c("comparison.no")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ——— Honest data + BYOK demo teaser ——— */}
      <section className="border-t border-gray-100 bg-accent-50/40 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
            {t("byok.eyebrow")}
          </p>
          <h2 className="mt-3 text-[clamp(1.4rem,2.6vw,2rem)] font-bold leading-tight tracking-tight text-gray-900">
            {t("byok.h2")}
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
            {t("byok.p1")}
          </p>
          <p className="mt-4 rounded-xl border border-accent-200 bg-white p-4 text-[14px] leading-relaxed text-gray-700">
            {t("byok.p2")}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/tools/query-fanout"
              className="inline-flex items-center gap-2 rounded-full bg-accent-900 px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-accent-800 active:translate-y-[1px]"
            >
              {t("byok.demoCta")}
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href={`${base}/pricing`}
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent-700 hover:text-accent-800"
            >
              {t("byok.plansCta")}
              <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
          </div>
        </div>
      </section>

      <FeatureFaq items={faqs} heading={c("faqHeading")} />

      <RelatedFeatures
        current="query-fanout"
        related={["geo-scan", "content-studio", "competitor-intel"]}
        base={base}
        copy={c.raw("related") as { eyebrow: string; heading: string; allFeatures: string; learnMore: string }}
        descriptions={cardDescriptions}
      />

      {/* ——— Final CTA ——— */}
      <section className="bg-gray-950 px-6 py-20 sm:py-24">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              {t("finalCta.h2")}
            </h2>
            <p className="mt-2 text-base text-gray-300">
              {t("finalCta.sub")}
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Link
              href="/tools/query-fanout"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 active:translate-y-[1px]"
            >
              {t("finalCta.demoCta")}
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href={`${base}/pricing`}
              className="text-[14px] font-semibold text-gray-300 transition-colors hover:text-white"
            >
              {t("finalCta.pricingCta")}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

/* ————————————————————————————————————————————————————————————————
   Signature device — the fan-out instrument. Custom-coded, honest
   ("Example data"), mono tabular numbers, one live pulse dot. Depicts the
   English product UI, so its visible sample data stays English; only the
   figure aria-label and sr-only prefix are localized (screen-reader copy).
———————————————————————————————————————————————————————————————— */
function FanOutDevice({ ariaLabel, srOnly }: { ariaLabel: string; srOnly: string }) {
  return (
    <figure
      aria-label={ariaLabel}
      className="relative m-0 rounded-[2rem] border border-gray-200 bg-white p-5 shadow-[0_30px_80px_-28px_rgba(15,23,42,0.30)] sm:p-7"
    >
      <span className="sr-only">{srOnly}</span>
      {/* Header: the seed */}
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="relative inline-flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
          </span>
          <span className="truncate font-mono text-[13px] font-semibold text-gray-900">
            seed: best ai seo tool
          </span>
        </div>
        <span className="shrink-0 font-mono text-[10px] text-gray-500">fan-out · 12s</span>
      </div>

      {/* Stat strip — borderless, divided by lines */}
      <div className="mt-4 grid grid-cols-3 divide-x divide-gray-100 text-center">
        {[
          { v: "25", l: "queries" },
          { v: "19", l: "clusters" },
          { v: "4", l: "engines" },
        ].map((s) => (
          <div key={s.l} className="px-2">
            <div className="font-mono text-2xl font-bold tabular-nums text-accent-700">{s.v}</div>
            <div className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-gray-500">{s.l}</div>
          </div>
        ))}
      </div>

      {/* The fan — query rows */}
      <div className="mt-5">
        <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
          Real fan-out queries
        </p>
        <ul className="divide-y divide-gray-100">
          {fanRows.map((r) => (
            <li key={r.q} className="flex items-center justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate font-mono text-[12.5px] text-gray-800">{r.q}</p>
                <p className="mt-1 truncate font-mono text-[10px] text-gray-500">{r.engines.join(" · ")}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={`rounded-full px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider ${
                    r.kind === "fired"
                      ? "bg-accent-50 text-accent-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {r.kind === "fired" ? "Fired" : "Related"}
                </span>
                <span className="w-20 text-right font-mono text-[10px] tabular-nums text-gray-600">{r.vol}</span>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-2 font-mono text-[11px] text-accent-700">+ 21 more queries</p>
      </div>

      {/* Divergence footnote */}
      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">Divergence</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-accent-700">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-500" /> 11 shared
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-amber-400 bg-amber-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-700">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-600" /> 8 whitespace
        </span>
        <span className="ml-auto font-mono text-[10px] text-gray-500">Example data</span>
      </div>
    </figure>
  )
}

/* ————————————————————————————————————————————————————————————————
   Divergence matrix — intents × engines presence grid. Depicts the English
   product UI, so its column headers, legend and sample intents stay English;
   only the figure aria-label, the sr-only caption, and the CTA link are
   localized.
———————————————————————————————————————————————————————————————— */
function DivergenceMatrix({
  ariaLabel,
  caption,
  runYourOwn,
}: {
  ariaLabel: string
  caption: string
  runYourOwn: string
}) {
  const engineKeys: { key: EngineKey; label: string }[] = [
    { key: "chatgpt", label: "ChatGPT" },
    { key: "gemini", label: "Gemini" },
    { key: "perplexity", label: "Perplexity" },
    { key: "grok", label: "Grok" },
  ]
  return (
    <figure
      aria-label={ariaLabel}
      className="m-0 overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-[0_24px_60px_-28px_rgba(15,23,42,0.18)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-gray-100 bg-gray-50 px-5 py-3 sm:px-7">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-600">
          Intents × engines
        </span>
        <div className="flex items-center gap-3 font-mono text-[10px] text-gray-500">
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent-700" /> fired
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-accent-700" /> related
          </span>
          <span className="text-gray-500">Example data</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-left">
          <caption className="sr-only">
            {caption}
          </caption>
          <thead>
            <tr className="border-b border-gray-100">
              <th scope="col" className="px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500 sm:px-7">
                Intent
              </th>
              {engineKeys.map((e) => (
                <th
                  key={e.key}
                  scope="col"
                  className="px-2 py-3 text-center font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500"
                >
                  {e.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {divergence.map((row) => {
              const isWhitespace = row.type === "whitespace"
              return (
                <tr key={row.intent} className={isWhitespace ? "bg-amber-50/50" : ""}>
                  <th scope="row" className="px-5 py-3.5 text-left font-normal sm:px-7">
                    <span className="text-[13px] font-medium text-gray-900">{row.intent}</span>
                    {isWhitespace && (
                      <span className="ml-2 rounded-full border border-dashed border-amber-400 px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-amber-700">
                        Whitespace
                      </span>
                    )}
                  </th>
                  {engineKeys.map((e) => {
                    const on = row.on[e.key]
                    if (!on) {
                      return (
                        <td key={e.key} className="px-2 py-3.5 text-center">
                          <span
                            className="inline-block h-2.5 w-2.5 rounded-full border border-gray-300 bg-white"
                            aria-label={`${row.intent} — ${e.label}: not fired`}
                          />
                        </td>
                      )
                    }
                    // Perplexity exposes related questions, not fired searches — render a ring.
                    if (e.key === "perplexity") {
                      return (
                        <td key={e.key} className="px-2 py-3.5 text-center">
                          <span
                            className={`inline-block h-4 w-4 rounded-full border-2 ${isWhitespace ? "border-amber-600" : "border-accent-700"}`}
                            aria-label={`${row.intent} — Perplexity: related question`}
                          />
                        </td>
                      )
                    }
                    return (
                      <td key={e.key} className="px-2 py-3.5 text-center">
                        <span
                          className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${
                            isWhitespace ? "bg-amber-600" : "bg-accent-700"
                          }`}
                          aria-label={`${row.intent} — ${e.label}: fired`}
                        >
                          <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 12 12" fill="none">
                            <path d="M2.5 6.2 5 8.5 9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <figcaption className="flex items-center justify-between border-t border-gray-100 px-5 py-3 sm:px-7">
        <span className="font-mono text-[11px] text-gray-500">3 shared · 3 whitespace shown</span>
        <Link
          href="/tools/query-fanout"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-accent-700 hover:text-accent-800"
        >
          {runYourOwn}
          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h6m0 0L6 3m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </figcaption>
    </figure>
  )
}
