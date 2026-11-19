import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"
import { siteConfig } from "@/lib/config"
import { RefundPolicyContent } from "@/components/legal/refund-policy-content"
import { RefundPolicyEs } from "@/components/legal/refund-policy-es"
import { RefundPolicyDe } from "@/components/legal/refund-policy-de"

// SG_LEGAL_V2 (2026-08-15): locale route so footer links resolve; renders the
// canonical content (bilingual for the legal notice, EN for the policy).
const SUPPORTED = ["fr", "es", "de"]
// SG_LEGAL_LOCALES (2026-11-19): native ES/DE translations (Opus-written, Opus + Codex reviewed); the canonical text prevails.
const NATIVE: Record<string, { title: string; description: string }> = {
  es: { title: "Política de cancelación y reembolso", description: "Cómo funcionan las suscripciones, las pruebas gratuitas, la cancelación y los reembolsos de GEO Toolbox." },
  de: { title: "Kündigungs- und Erstattungsrichtlinie", description: "Wie Abonnements, kostenlose Testphasen, Kündigung und Erstattungen bei GEO Toolbox funktionieren." },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!SUPPORTED.includes(locale)) return {}
  return {
    title: NATIVE[locale]?.title ?? "Cancellation & Refund Policy",
    description: NATIVE[locale]?.description ?? "How GEO Toolbox subscriptions, free trials, cancellation and refunds work.",
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
  if (locale === "es") return <RefundPolicyEs />
  if (locale === "de") return <RefundPolicyDe />
  return <RefundPolicyContent />
}
