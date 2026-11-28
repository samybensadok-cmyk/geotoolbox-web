import type { Metadata } from "next"
import { siteConfig } from "@/lib/config"
import { PrivacyContent } from "@/components/legal/privacy-content"
import { LegalFrame } from "@/components/legal/legal-frame"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How GEO Toolbox collects, uses, and protects your data.",
  alternates: {
    canonical: `${siteConfig.url}/privacy`,
    languages: {
      en: `${siteConfig.url}/privacy`,
      fr: `${siteConfig.url}/fr/privacy`,
      es: `${siteConfig.url}/es/privacy`,
      de: `${siteConfig.url}/de/privacy`,
      "x-default": `${siteConfig.url}/privacy`,
    },
  },
}

export default function PrivacyPage() {
  return <LegalFrame><PrivacyContent /></LegalFrame>
}
