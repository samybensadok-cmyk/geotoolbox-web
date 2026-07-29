import type { MetadataRoute } from "next"
import { getAllPosts, getAllGlossaryTerms } from "@/lib/content"
import { siteConfig } from "@/lib/config"
import { routing, bcp47 } from "@/i18n/routing"
import { alternatesFor } from "@/lib/i18n/siblings"
import { tools } from "@/lib/tools"

// Localized MARKETING routes (mounted under app/[locale]/): one entry per
// locale, each carrying the reciprocal hreflang set — same 1:1 same-path
// relationship marketingAlternatesFor() encodes for the page metadata. Keep
// this list in sync with the routes actually under app/[locale]/.
function marketingEntries(
  path: string,
  opts: { changeFrequency: "weekly" | "monthly"; priority: number },
) {
  const url = (loc: string) =>
    `${siteConfig.url}${loc === routing.defaultLocale ? "" : `/${loc}`}${path}`
  const languages = Object.fromEntries([
    ...routing.locales.map((l) => [bcp47[l], url(l)]),
    ["x-default", url(routing.defaultLocale)],
  ])
  return routing.locales.map((locale) => ({
    url: url(locale),
    lastModified: new Date(),
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
    alternates: { languages },
  }))
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...marketingEntries("", { changeFrequency: "weekly", priority: 1 }),
    // Blog index per locale, cross-referenced via hreflang alternates.
    ...routing.locales.map((locale) => ({
      url: locale === "en" ? `${siteConfig.url}/blog` : `${siteConfig.url}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
      alternates: {
        languages: Object.fromEntries([
          ...routing.locales.map((l) => [
            bcp47[l],
            l === "en" ? `${siteConfig.url}/blog` : `${siteConfig.url}/${l}/blog`,
          ]),
          ["x-default", `${siteConfig.url}/blog`],
        ]),
      },
    })),
    ...marketingEntries("/features", { changeFrequency: "weekly", priority: 0.9 }),
    ...marketingEntries("/pricing", { changeFrequency: "weekly", priority: 0.9 }),
    // 14 feature detail pages — localized under app/[locale]/features (2026-07-22).
    ...[
      "ai-visibility-tracker",
      "geo-scan",
      "agent-readiness",
      "query-fanout",
      "content-analyzer",
      "content-studio",
      "domain-overview",
      "competitor-intel",
      "community",
      "citation-interceptor",
      "ask-geotoolbox",
      "analytics",
      "pr-coverage-tracker",
      "white-label-reports",
    ].flatMap((slug) =>
      marketingEntries(`/features/${slug}`, { changeFrequency: "monthly", priority: 0.8 }),
    ),
    // EN-only commercial landing under app/(marketing)/services/. Plain single
    // entry (no hreflang) — same shape as the feature-detail pages below; NOT
    // marketingEntries(), which would emit /fr/... URLs that 404.
    {
      url: `${siteConfig.url}/services/ai-seo-agency`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/services/generative-engine-optimization`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/services/answer-engine-optimization`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/services/ai-automation-agency`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.url}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.url}/glossary`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/tools`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // Derived from the tools registry so a newly added tool can't be live on the
    // site yet silently missing from the sitemap — which is exactly what this
    // hardcoded list caused.
    ...tools.map((t) => t.slug).map((slug) => ({
      url: `${siteConfig.url}/tools/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    // Content URLs across all locales, each with reciprocal hreflang
    // alternates from the sibling map. Pre-FR this yields exactly the
    // original EN entries (no `alternates` key), so the sitemap is
    // byte-identical until FR content lands.
    ...routing.locales.flatMap((locale) =>
      getAllPosts(locale).map((post) => {
        const alt = alternatesFor("blog", post.slug, locale)
        return {
          url: alt.canonical,
          lastModified: new Date(post.updated ?? post.date),
          changeFrequency: "monthly" as const,
          priority: 0.8,
          ...(alt.languages ? { alternates: { languages: alt.languages } } : {}),
        }
      })
    ),
    ...routing.locales.flatMap((locale) =>
      getAllGlossaryTerms(locale).map((t) => {
        const alt = alternatesFor("glossary", t.slug, locale)
        return {
          url: alt.canonical,
          lastModified: t.updated ? new Date(t.updated) : new Date(),
          changeFrequency: "monthly" as const,
          priority: 0.6,
          ...(alt.languages ? { alternates: { languages: alt.languages } } : {}),
        }
      })
    ),
  ]
}
