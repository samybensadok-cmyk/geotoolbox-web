import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"
import { siteConfig } from "@/lib/config"
import { LegalNoticeContent } from "@/components/legal/legal-notice-content"

// SG_LEGAL_V2 (2026-08-15): locale route so footer links resolve; renders the
// canonical content (bilingual for the legal notice, EN for the policy).
const SUPPORTED = ["fr", "es", "de", "nl"]

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!SUPPORTED.includes(locale)) return {}
  return {
    title: "Legal notice (Mentions légales)",
    description: "Publisher and hosting information for geotoolbox.ai.",
    alternates: {
      canonical: `${siteConfig.url}/${locale}/legal`,
      languages: {
        en: `${siteConfig.url}/legal`,
        fr: `${siteConfig.url}/fr/legal`,
        es: `${siteConfig.url}/es/legal`,
        de: `${siteConfig.url}/de/legal`,
        nl: `${siteConfig.url}/nl/legal`,
        "x-default": `${siteConfig.url}/legal`,
      },
    },
  }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!SUPPORTED.includes(locale)) notFound()
  setRequestLocale(locale)
  return <LegalNoticeContent />
}
