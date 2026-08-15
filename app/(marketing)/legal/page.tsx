import type { Metadata } from "next"
import { siteConfig } from "@/lib/config"
import { LegalNoticeContent } from "@/components/legal/legal-notice-content"

export const metadata: Metadata = {
  title: "Legal notice (Mentions légales)",
  description: "Publisher and hosting information for geotoolbox.ai.",
  alternates: {
    canonical: `${siteConfig.url}/legal`,
    languages: {
      en: `${siteConfig.url}/legal`,
      fr: `${siteConfig.url}/fr/legal`,
      es: `${siteConfig.url}/es/legal`,
      "x-default": `${siteConfig.url}/legal`,
    },
  },
}

export default function Page() {
  return <LegalNoticeContent />
}
