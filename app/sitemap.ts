import type { MetadataRoute } from "next"
import { getAllPosts, getAllGlossaryTerms } from "@/lib/content"
import { siteConfig } from "@/lib/config"
import { routing, bcp47 } from "@/i18n/routing"
import { alternatesFor } from "@/lib/i18n/siblings"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
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
    {
      url: `${siteConfig.url}/features`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/pricing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
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
    ...siteConfig.featureGroups.flatMap((g) => g.features).map((f) => ({
      url: `${siteConfig.url}/features/${f.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
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
    ...["keyword-to-prompts", "query-fanout", "ai-readiness", "ai-crawler-checker", "llms-txt-checker"].map((slug) => ({
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
