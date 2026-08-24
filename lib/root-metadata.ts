import type { Metadata } from "next"
import { siteConfig } from "@/lib/config"

// Base metadata shared by both root layouts ((marketing) + [locale]) so the two
// roots can't drift on metadataBase / OG / robots defaults. Per-page metadata
// (title, description, canonical, hreflang) still overrides on each route.
export const rootMetadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
    // The generated card at app/opengraph-image.tsx. With two root layouts in
    // route groups, the file-convention image does NOT auto-attach, so both
    // roots reference it explicitly here.
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "GEO Toolbox: AI Search Analytics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/opengraph-image"],
  },
  alternates: {
    types: {
      "text/plain": [
        { url: "/llms.txt", title: "llms.txt" },
        { url: "/llms-full.txt", title: "llms-full.txt" },
        { url: "/llms-blog.txt", title: "Complete article index" },
        { url: "/llms-glossary.txt", title: "Complete glossary index" },
      ],
      // /agents.md is the cold-discovery path: an agent that lands on a page
      // from web search sees these <head> alternates without ever fetching
      // /llms.txt, so the when-to-use guidance has to be reachable from here.
      "text/markdown": [
        { url: "/home.md", title: "Homepage (markdown)" },
        { url: "/agents.md", title: "Agent instructions" },
      ],
    },
  },
  robots: {
    index: true,
    follow: true,
  },
}
