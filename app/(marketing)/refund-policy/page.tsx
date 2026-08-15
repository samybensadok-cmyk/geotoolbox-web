import type { Metadata } from "next"
import { siteConfig } from "@/lib/config"
import { RefundPolicyContent } from "@/components/legal/refund-policy-content"

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy",
  description: "How GEO Toolbox subscriptions, free trials, cancellation and refunds work.",
  alternates: {
    canonical: `${siteConfig.url}/refund-policy`,
    languages: {
      en: `${siteConfig.url}/refund-policy`,
      fr: `${siteConfig.url}/fr/refund-policy`,
      es: `${siteConfig.url}/es/refund-policy`,
      "x-default": `${siteConfig.url}/refund-policy`,
    },
  },
}

export default function Page() {
  return <RefundPolicyContent />
}
