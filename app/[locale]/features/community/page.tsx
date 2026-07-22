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

// Localized Community feature page: en at /features/community, fr at
// /fr/features/community. Relocated from app/(marketing)/features/community.
// ALL display copy lives in the `featurePages.community` message namespace
// (shared strings in `featurePages.common`); structural data — hues, the hero
// mockup's sample data (thread titles, subreddit names, statuses), subreddit
// identifiers — stays here in English, since the mockup depicts the English
// product UI. Product, tier and engine names are never translated.

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "featurePages.community.meta" })
  return {
    title: { absolute: t("title") },
    description: t("description"),
    openGraph: { title: t("ogTitle"), description: t("ogDescription") },
    alternates: marketingAlternatesFor("/features/community", locale),
  }
}

type Outcome = { tag: string; title: string; body: string }
type Pattern = { badge: string; title: string; body: string; actionBody: string }
type Faq = { question: string; answer: string }

// Sample data for the hero mockup — depicts the English product UI, so thread
// titles, subreddit names, engine names and statuses stay English on both locales.
const threads = [
  {
    sub: "r/SEO",
    title: "Is Ahrefs worth it in 2026?",
    engines: ["ChatGPT", "Perplexity"],
    sentiment: "Mixed",
    risk: false,
  },
  {
    sub: "r/marketing",
    title: "Best AI SEO tools comparison",
    engines: ["ChatGPT", "Claude", "Perplexity"],
    sentiment: "Positive",
    risk: false,
  },
  {
    sub: "r/TechSEO",
    title: "Schema markup no longer matters?",
    engines: ["Gemini"],
    sentiment: "Negative",
    risk: true,
  },
  {
    sub: "r/bigSEO",
    title: "How to track AI citations",
    engines: ["Perplexity"],
    sentiment: "Mixed",
    risk: false,
  },
]

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("featurePages.community")
  const c = await getTranslations("featurePages.common")
  const base = locale === routing.defaultLocale ? "" : `/${locale}`
  const urlBase = `${siteConfig.url}${base}`

  const outcomes = t.raw("outcomes.items") as Outcome[]
  const patterns = t.raw("catches.patterns") as Pattern[]
  const faqs = t.raw("faqs") as Faq[]
  const cardDescriptions = c.raw("cardDescriptions") as Record<string, string>
  const breadcrumbLabels = { home: c("breadcrumbHome"), features: c("breadcrumbFeatures") }

  return (
    <>
      <JsonLd data={[
        softwareApplicationSchema({
          name: "Community Insights",
          description: t("schema.appDescription"),
          url: `${urlBase}/features/community`,
        }),
      ]} />

      {/* Hero — warm social atmosphere, migrated to the shared dark FeatureHero */}
      <FeatureHero
        featureName="Community"
        hue="peach"
        base={base}
        breadcrumbLabels={breadcrumbLabels}
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subhead={t("hero.subhead")}
        primaryLabel={t("hero.primaryLabel")}
        primaryHref="/app"
        secondaryLabel={t("hero.secondaryLabel")}
        secondaryHref="#outcomes"
        microcopy=""
      >
        {/* Community visual — sample data stays English (depicts the product UI) */}
        <figure className="m-0" aria-label={t("hero.figureAriaLabel")}>
              <span className="sr-only">{t("hero.srOnly")}</span>
              <div className="relative rounded-[2rem] border border-gray-200 bg-white p-6 sm:p-8 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.12)]">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-600">
                    AI-cited threads
                  </span>
                  <span className="rounded-full bg-accent-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-accent-700">
                    4 tracked
                  </span>
                </div>
                <ul className="mt-3 divide-y divide-gray-100">
                  {threads.map((thread) => (
                    <li key={thread.title} className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-semibold text-accent-700">{thread.sub}</span>
                        {thread.risk && (
                          <span className="rounded-full bg-amber-100 px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-amber-800">
                            Risk
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[13px] font-medium text-gray-900">{thread.title}</p>
                      <div className="mt-1.5 flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-accent-700" />
                          <span>Cited by {thread.engines.join(", ")}</span>
                        </div>
                        <span
                          className={`font-mono font-semibold ${
                            thread.sentiment === "Positive"
                              ? "text-accent-700"
                              : thread.sentiment === "Negative"
                              ? "text-red-600"
                              : "text-gray-700"
                          }`}
                        >
                          {thread.sentiment}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
        </figure>
      </FeatureHero>

      {/* Outcomes — white breather alternating with the peach atmosphere */}
      <section id="outcomes" className="bg-white px-6 py-24 sm:py-28">
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

      {/* What it catches — concrete examples (peach tint, breaks the white run before FAQ) */}
      <section className="border-y border-[var(--surface-peach-border)] bg-[var(--surface-peach)] px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[5fr_7fr] lg:items-end lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">{t("catches.eyebrow")}</p>
              <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-gray-900">
                {t("catches.h2")}
              </h2>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-gray-600">
              {t("catches.intro")}
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Pattern 1 — Misinformation. Subreddit name stays English (sample data). */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber-100 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-amber-800">
                  {patterns[0].badge}
                </span>
              </div>
              <p className="mt-4 font-mono text-[12px] text-amber-900">r/TechSEO</p>
              <h3 className="mt-1 text-base font-semibold tracking-tight text-gray-900">
                {patterns[0].title}
              </h3>
              <p className="mt-3 text-[13px] leading-relaxed text-gray-700">
                {patterns[0].body}
              </p>
              <div className="mt-4 rounded-lg border border-amber-200 bg-white/70 p-3">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-amber-800">
                  {t("catches.recommendedAction")}
                </p>
                <p className="mt-1 text-[13px] text-gray-800">
                  {patterns[0].actionBody}
                </p>
              </div>
            </div>

            {/* Pattern 2 — High-engagement opportunity */}
            <div className="rounded-2xl border border-accent-200 bg-accent-50/40 p-6">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-accent-100 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-accent-800">
                  {patterns[1].badge}
                </span>
              </div>
              <p className="mt-4 font-mono text-[12px] text-accent-800">r/marketing</p>
              <h3 className="mt-1 text-base font-semibold tracking-tight text-gray-900">
                {patterns[1].title}
              </h3>
              <p className="mt-3 text-[13px] leading-relaxed text-gray-700">
                {patterns[1].body}
              </p>
              <div className="mt-4 rounded-lg border border-accent-200 bg-white/70 p-3">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent-800">
                  {t("catches.recommendedAction")}
                </p>
                <p className="mt-1 text-[13px] text-gray-800">
                  {patterns[1].actionBody}
                </p>
              </div>
            </div>

            {/* Pattern 3 — Subreddit focus */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-gray-100 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-700">
                  {patterns[2].badge}
                </span>
              </div>
              <p className="mt-4 font-mono text-[12px] text-gray-700">r/SEO · r/bigSEO · r/TechSEO</p>
              <h3 className="mt-1 text-base font-semibold tracking-tight text-gray-900">
                {patterns[2].title}
              </h3>
              <p className="mt-3 text-[13px] leading-relaxed text-gray-700">
                {patterns[2].body}
              </p>
              <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-600">
                  {t("catches.recommendedAction")}
                </p>
                <p className="mt-1 text-[13px] text-gray-800">
                  {patterns[2].actionBody}
                </p>
              </div>
            </div>
          </div>

          {/* Inline CTA at peak intent */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-6">
            <p className="text-[13px] text-gray-500">{t("catches.ctaNote")}</p>
            <Link
              href="/app"
              prefetch={false}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent-700 hover:text-accent-900"
            >
              {t("catches.ctaLink")}
              <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <FeatureFaq items={faqs} heading={c("faqHeading")} />

      <RelatedFeatures
        current="community"
        related={["competitor-intel", "domain-overview", "geo-scan"]}
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
