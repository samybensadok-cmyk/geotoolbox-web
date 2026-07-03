import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/config"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /*_rsc= = Next.js App Router RSC prefetch URLs. They 200 + canonicalize
      // to the clean URL, but Googlebot crawls them as noise. robots blocks only
      // crawlers, so real client-side navigation/prefetch is unaffected.
      disallow: ["/app/", "/api/", "/go/", "/*_rsc="],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
