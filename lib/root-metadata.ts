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
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
}
