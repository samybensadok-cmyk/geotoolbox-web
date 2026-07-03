import { getAllPosts } from "@/lib/content"
import { siteConfig } from "@/lib/config"

export async function GET() {
  // All locales in one feed; FR slugs live under /fr/blog/. pubDate uses the
  // `updated` date when present so refreshed posts carry a freshness signal
  // (AI ingestion pipelines + feed readers resurface them).
  const posts = [...getAllPosts("en"), ...getAllPosts("fr")].sort(
    (a, b) =>
      new Date(b.updated ?? b.date).getTime() - new Date(a.updated ?? a.date).getTime()
  )

  const items = posts
    .map((post) => {
      const url = `${siteConfig.url}${post.locale === "en" ? "" : `/${post.locale}`}/blog/${post.slug}`
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${new Date(post.updated ?? post.date).toUTCString()}</pubDate>
      <author>${post.author}</author>
      ${post.tags.map((t) => `<category>${t}</category>`).join("\n      ")}
    </item>`
    })
    .join("")

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name}</title>
    <link>${siteConfig.url}</link>
    <description>${siteConfig.description}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  })
}
