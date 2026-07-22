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

// Localized Competitor Intel feature page: en at /features/competitor-intel, fr
// at /fr/features/competitor-intel. Relocated from
// app/(marketing)/features/competitor-intel. Display copy lives in the
// `featurePages.competitor-intel` namespace (shared strings in
// `featurePages.common`); structural data — hue, sample threat-feed / SoV /
// gap-matrix mock data, cell booleans — stays here. The product mockups depict
// the English UI, so their sample data stays English on both locales.

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "featurePages.competitor-intel.meta" })
  return {
    title: { absolute: t("title") },
    description: t("description"),
    openGraph: { title: t("ogTitle"), description: t("ogDescription") },
    alternates: marketingAlternatesFor("/features/competitor-intel", locale),
  }
}

type InsideItem = { num: string; tag: string; title: string; body: string }
type Faq = { question: string; answer: string }

// Sample data for the hero threat-feed + share-of-voice mock (English UI depicted).
const competitors = [
  { domain: "ahrefs.com", share: 87, delta: "+4", gaps: 3 },
  { domain: "semrush.com", share: 62, delta: "-3", gaps: 5 },
  { domain: "moz.com", share: 48, delta: "+1", gaps: 8 },
  { domain: "searchenginejournal.com", share: 41, delta: "+6", gaps: 2 },
]

// Sample data for the mid-page gap-matrix figure (English UI depicted).
const gapMatrix = [
  { topic: "ai content optimization", you: false, ahrefs: true, semrush: false },
  { topic: "saas content strategy", you: true, ahrefs: true, semrush: true },
  { topic: "brand positioning for ai search", you: false, ahrefs: false, semrush: true },
  { topic: "ai seo tools comparison", you: true, ahrefs: false, semrush: false },
  { topic: "schema markup for llms", you: false, ahrefs: true, semrush: true },
  { topic: "content freshness signals", you: true, ahrefs: true, semrush: false },
]

export default async function CompetitorIntelPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("featurePages.competitor-intel")
  const c = await getTranslations("featurePages.common")
  const base = locale === routing.defaultLocale ? "" : `/${locale}`
  const urlBase = `${siteConfig.url}${base}`

  const insideItems = t.raw("inside.items") as InsideItem[]
  const faqs = t.raw("faqs") as Faq[]
  const cardDescriptions = c.raw("cardDescriptions") as Record<string, string>
  const breadcrumbLabels = { home: c("breadcrumbHome"), features: c("breadcrumbFeatures") }

  return (
    <>
      {/* Hero — blush glow (vigilance / threat-feed feel), dark ground */}
      <JsonLd data={[
        softwareApplicationSchema({
          name: "Competitor Intel",
          description: t("schema.appDescription"),
          url: `${urlBase}/features/competitor-intel`,
        }),
      ]} />

      <FeatureHero
        featureName="Competitor Intel"
        hue="blush"
        base={base}
        breadcrumbLabels={breadcrumbLabels}
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subhead={t("hero.subhead")}
        primaryLabel={t("hero.primaryLabel")}
        primaryHref="/app"
        secondaryLabel={t("hero.secondaryLabel")}
        secondaryHref="#inside"
        microcopy=""
      >
        {/* Competitor tracking visual — threat-feed first, SoV rail as compact context */}
        <div aria-hidden="true">
          <div className="relative rounded-[2rem] border border-gray-200 bg-white p-6 sm:p-7 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.12)]">
                {/* Live feed header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="relative inline-flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
                    </span>
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-800">
                      AI threat feed &middot; live
                    </span>
                  </div>
                  <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-red-700">
                    3 new today
                  </span>
                </div>

                {/* Primary threat — largest visual weight, shows the why + suggested action */}
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-red-700">
                      2h ago &middot; citation surge
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-red-700">+3</span>
                  </div>
                  <p className="mt-2 text-[14px] font-semibold leading-snug text-red-950">
                    <span className="font-mono">searchenginejournal.com</span>
                    <span className="font-normal text-red-900"> won </span>
                    <span className="italic">&ldquo;ai content optimization&rdquo;</span>
                  </p>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-red-800">
                    <span className="font-semibold">Why:</span> Published a 4,000-word guide six days ago. Now cited above yours on Perplexity and Claude.
                  </p>
                  <p className="mt-3 flex items-center gap-1.5 font-mono text-[11px] font-semibold text-red-700">
                    Open full report
                    <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h6m0 0L6 3m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </p>
                </div>

                {/* Secondary threat — tighter, signals "there's a feed of these" */}
                <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-amber-700">
                      1d ago &middot; competitor moved
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-amber-700">+1</span>
                  </div>
                  <p className="mt-1.5 text-[13px] leading-snug text-amber-950">
                    <span className="font-mono font-semibold">ahrefs.com</span>
                    <span className="text-amber-900"> picked up a citation on </span>
                    <span className="italic">&ldquo;best seo tool&rdquo;</span>
                  </p>
                </div>

                {/* Compact SoV rail — context, not the hero */}
                <div className="mt-5 border-t border-gray-100 pt-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                      Share of voice &middot; 30 days
                    </p>
                    <p className="font-mono text-[10px] text-gray-500">4 / 5 tracked</p>
                  </div>
                  <div className="space-y-2">
                    {competitors.map((comp) => {
                      const positive = comp.delta.startsWith("+")
                      return (
                        <div key={comp.domain} className="flex items-center gap-3">
                          <span className="w-44 shrink-0 truncate font-mono text-[12px] font-medium text-gray-800">{comp.domain}</span>
                          <div className="h-1 flex-1 overflow-hidden rounded-full bg-gray-100">
                            <div className="h-full rounded-full bg-accent-700" style={{ width: `${comp.share}%` }} />
                          </div>
                          <span className="w-9 shrink-0 text-right font-mono text-[11px] font-semibold tabular-nums text-accent-700">{comp.share}%</span>
                          <span className={`w-6 shrink-0 text-right font-mono text-[10px] font-semibold ${positive ? "text-accent-700" : "text-red-600"}`}>{comp.delta}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
          </div>
        </div>
      </FeatureHero>

      {/* Gap matrix section */}
      <section className="border-y border-[var(--surface-blush-border)] bg-[var(--surface-blush)] px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[5fr_7fr] lg:items-end lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">{t("gap.eyebrow")}</p>
              <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-gray-900">
                {t("gap.h2")}
              </h2>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-gray-600">
              {t("gap.intro")}
            </p>
          </div>

          {/* Legend — explains the symbols before the reader has to guess */}
          <div className="mt-8 flex flex-wrap items-center gap-5 text-[13px] text-gray-600">
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent-700">
                <svg className="h-3 w-3 text-white" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {t("gap.legendCited")}
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 bg-gray-100">
                <svg className="h-2.5 w-2.5 text-gray-500" viewBox="0 0 12 12" fill="none">
                  <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              {t("gap.legendAbsent")}
            </span>
          </div>

          <figure aria-label={t("gap.figureAria")} className="mt-6 overflow-hidden rounded-[2rem] border border-gray-200 bg-white">
            <span className="sr-only">{t("gap.srPrefix")}</span>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th scope="col" className="px-6 py-4 font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-600">Topic</th>
                    <th scope="col" className="px-4 py-4 text-center font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-600">You</th>
                    <th scope="col" className="px-4 py-4 text-center font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-600">ahrefs.com</th>
                    <th scope="col" className="px-4 py-4 text-center font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-600">semrush.com</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {gapMatrix.map((row) => (
                    <tr key={row.topic}>
                      <td className="px-6 py-4 font-mono text-[13px] text-gray-900">{row.topic}</td>
                      <td className="px-4 py-4 text-center">
                        <Cell present={row.you} />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Cell present={row.ahrefs} />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Cell present={row.semrush} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </figure>

          {/* Inline CTA at point of peak intent */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[13px] text-gray-500">{t("gap.exampleNote")}</p>
            <Link
              href="/app"
              prefetch={false}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent-700 hover:text-accent-900"
            >
              {t("gap.scanCta")}
              <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* What's inside */}
      <section id="inside" className="bg-white px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">{t("inside.eyebrow")}</p>
            <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-gray-900">
              {t("inside.h2")}
            </h2>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
            {insideItems.map((s) => (
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

      <FeatureFaq items={faqs} heading={c("faqHeading")} />

      <RelatedFeatures
        current="competitor-intel"
        related={["domain-overview", "geo-scan", "community", "ask-geotoolbox"]}
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

function Cell({ present }: { present: boolean }) {
  return present ? (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent-700">
      <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 14 14" fill="none">
        <path d="M3 7l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  ) : (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-gray-100">
      <svg className="h-3 w-3 text-gray-500" viewBox="0 0 12 12" fill="none">
        <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  )
}
