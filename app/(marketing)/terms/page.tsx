import type { Metadata } from "next"
import { siteConfig } from "@/lib/config"
import { TermsContent } from "@/components/legal/terms-content"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for GEO Toolbox: subscriptions, free trials, automatic renewal, cancellation and refunds.",
  alternates: {
    canonical: `${siteConfig.url}/terms`,
    languages: {
      en: `${siteConfig.url}/terms`,
      fr: `${siteConfig.url}/fr/terms`,
      es: `${siteConfig.url}/es/terms`,
      "x-default": `${siteConfig.url}/terms`,
    },
  },
}

export default function TermsPage() {
  return <TermsContent />
}
