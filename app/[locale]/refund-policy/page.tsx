import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"
import { siteConfig } from "@/lib/config"
import { RefundPolicyContent } from "@/components/legal/refund-policy-content"

// SG_LEGAL_V2 (2026-08-15): locale route so footer links resolve; renders the
// canonical content (bilingual for the legal notice, EN for the policy).
const SUPPORTED = ["fr", "es", "de"]

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!SUPPORTED.includes(locale)) return {}
  return {
    title: "Cancellation & Refund Policy",
    description: "How GEO Toolbox subscriptions, free trials, cancellation and refunds work.",
    alternates: {
      canonical: `${siteConfig.url}/${locale}/refund-policy`,
      languages: {
        en: `${siteConfig.url}/refund-policy`,
        fr: `${siteConfig.url}/fr/refund-policy`,
        es: `${siteConfig.url}/es/refund-policy`,
        de: `${siteConfig.url}/de/refund-policy`,
        "x-default": `${siteConfig.url}/refund-policy`,
      },
    },
  }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!SUPPORTED.includes(locale)) notFound()
  setRequestLocale(locale)
  return <RefundPolicyContent />
}
