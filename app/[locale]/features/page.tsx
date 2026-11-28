import type { Metadata } from "next"
import Link from "next/link"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { breadcrumbsSchema, itemListSchema } from "@/lib/seo-schema"
import { marketingAlternatesFor } from "@/lib/i18n/siblings"
import { currencyParam } from "@/lib/i18n/currency"
import { Arrow, Index, kit as k } from "@/components/brand/dark-kit"
import { FeaturePage, FeatureCloseCta, FxIndex, fx } from "@/components/features/fx"

// Localized features hub: en at /features, fr at /fr/features. Relocated from
// app/(marketing)/features/page.tsx. Individual /features/<slug> pages stay
// EN-only under (marketing). Display copy comes from the `features` message
// namespace by index; the structural meta (slug, product name, anchor key)
// stays here — product/brand names are never translated.
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

// Structural group meta (stable across locales): anchor key and each feature's
// slug + English product name. Display label/headline/blurb/highlights come
// from messages, merged by index.
const groupMeta: {
  key: string
  features: { slug: string; name: string }[]
}[] = [
  {
    key: "scanning",
    features: [
      { slug: "ai-visibility-tracker", name: "AI Visibility Tracker" },
      { slug: "geo-scan", name: "GEO Scan" },
      { slug: "agent-readiness", name: "Agent Readiness" },
      { slug: "query-fanout", name: "Query Fan-Out" },
    ],
  },
  {
    key: "analysis",
    features: [
      { slug: "content-analyzer", name: "Content Analyzer" },
      { slug: "content-studio", name: "Content Studio" },
    ],
  },
  {
    key: "intelligence",
    features: [
      { slug: "domain-overview", name: "Domain Overview" },
      { slug: "competitor-intel", name: "Competitor Intel" },
      { slug: "community", name: "Community" },
      { slug: "citation-interceptor", name: "Citation Interceptor" },
      { slug: "ask-geotoolbox", name: "Ask GeoToolBox" },
    ],
  },
  {
    key: "reporting",
    features: [
      { slug: "analytics", name: "Analytics (GSC + GA4)" },
      { slug: "pr-coverage-tracker", name: "PR Coverage Tracker" },
      { slug: "white-label-reports", name: "White-Label Reports" },
    ],
  },
]

type GroupCopy = {
  label: string
  headline: string
  features: { blurb: string; highlights: string[] }[]
}

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

  const numberOf = (slug: string) => String(allFeatures.findIndex((f) => f.slug === slug) + 1).padStart(2, "0")

  return (
    <FeaturePage>
      {/* Hero: dark directory head; the chip strip jumps to each feature below */}
      <section className={`${k.heroGlow} ${fx.dirHero}`}>
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

        <div className={k.wrap}>
          <div className={fx.dirHeroGrid}>
            <div>
              <Index label={t("hero.eyebrow")} />
              <h1 className={fx.dirTitle}>
                {t("hero.h1a")}
                <br />
                <span className={fx.dirTitleMark}>{t("hero.h1b")}</span>
              </h1>
            </div>
            <p className={fx.dirIntro}>{t("hero.intro")}</p>
          </div>

          <ul className={fx.chips}>
            {allFeatures.map((f) => (
              <li key={f.slug}>
                <Link href={`#feature-${f.slug}`} className={fx.chip}>
                  {f.name.replace(" (GSC + GA4)", "")}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Directory: one row per feature, grouped as before */}
      <section className={fx.dir}>
        {/* Mobile sticky jump-nav, group-level */}
        <nav aria-label="Feature groups" className={`${fx.jump} lg:hidden`}>
          <ul className={fx.jumpList}>
            {groups.map((g) => (
              <li key={g.key}>
                <a href={`#group-${g.key}`} className={fx.jumpLink}>
                  {g.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={k.wrap}>
          {groups.map((group) => (
            <div key={group.key} id={`group-${group.key}`} className={fx.group}>
              {/* Group label, sticky on desktop */}
              <div className={fx.groupAside}>
                <FxIndex label={group.label} />
                <h2 className={fx.groupTitle}>{group.headline}</h2>
                <p className={fx.groupCount}>
                  {group.features.length}{" "}
                  {group.features.length === 1 ? t("toolSingular") : t("toolPlural")}
                </p>
              </div>

              <ul className={fx.dirList}>
                {group.features.map((f) => (
                  <li key={f.slug}>
                    <Link href={`${base}/features/${f.slug}`} id={`feature-${f.slug}`} className={fx.dirRow}>
                      <span className={fx.dirNum}>{numberOf(f.slug)}</span>
                      <div>
                        <h3 className={fx.dirName}>{f.name}</h3>
                        <p className={fx.dirBlurb}>{f.blurb}</p>
                        <ul className={fx.dirMeta}>
                          {f.highlights.map((h) => (
                            <li key={h}>{h}</li>
                          ))}
                        </ul>
                      </div>
                      <Arrow />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA: features-index closing card (calm, like the homepage close) */}
      <FeatureCloseCta
        title={t("cta.h2")}
        sub={t("cta.body")}
        foot={t("cta.foot")}
      >
        <Link
          href={`${siteConfig.appSignupUrl}&ref=features-hub${currencyParam(locale)}`}
          prefetch={false}
          className={k.btnLime}
        >
          {t("cta.ctaPrimary")}
          <Arrow />
        </Link>
      </FeatureCloseCta>
    </FeaturePage>
  )
}
