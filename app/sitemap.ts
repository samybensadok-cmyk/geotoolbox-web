import type { MetadataRoute } from "next"
import { getAllPosts, getAllGlossaryTerms } from "@/lib/content"
import { siteConfig } from "@/lib/config"

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const glossary = getAllGlossaryTerms()

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
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
    ...posts.map((post) => ({
      url: `${siteConfig.url}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...glossary.map((t) => ({
      url: `${siteConfig.url}/glossary/${t.slug}`,
      lastModified: t.updated ? new Date(t.updated) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ]
}
