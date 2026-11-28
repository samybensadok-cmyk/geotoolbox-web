import type { Metadata } from "next"
import { siteConfig } from "@/lib/config"
import { LegalNoticeContent } from "@/components/legal/legal-notice-content"
import { LegalFrame } from "@/components/legal/legal-frame"

export const metadata: Metadata = {
  title: "Legal notice (Mentions légales)",
  description: "Publisher and hosting information for geotoolbox.ai.",
  alternates: {
    canonical: `${siteConfig.url}/legal`,
    languages: {
      en: `${siteConfig.url}/legal`,
      fr: `${siteConfig.url}/fr/legal`,
      es: `${siteConfig.url}/es/legal`,
      de: `${siteConfig.url}/de/legal`,
      "x-default": `${siteConfig.url}/legal`,
    },
  },
}

export default function Page() {
  return <LegalFrame><LegalNoticeContent /></LegalFrame>
}
