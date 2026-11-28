import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"
import { siteConfig } from "@/lib/config"
import { LegalNoticeContent } from "@/components/legal/legal-notice-content"
import { LegalNoticeEs } from "@/components/legal/legal-notice-es"
import { LegalNoticeDe } from "@/components/legal/legal-notice-de"
import { LegalFrame } from "@/components/legal/legal-frame"

// SG_LEGAL_V2 (2026-08-15): locale route so footer links resolve; renders the
// canonical content (bilingual for the legal notice, EN for the policy).
const SUPPORTED = ["fr", "es", "de"]
// SG_LEGAL_LOCALES (2026-11-19): native ES/DE translations (Opus-written, Opus + Codex reviewed); the canonical text prevails.
const NATIVE: Record<string, { title: string; description: string }> = {
  es: { title: "Aviso legal", description: "Información sobre el editor y el alojamiento de geotoolbox.ai." },
  de: { title: "Impressum", description: "Angaben zum Anbieter und Hosting von geotoolbox.ai." },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!SUPPORTED.includes(locale)) return {}
  return {
    title: NATIVE[locale]?.title ?? "Legal notice (Mentions légales)",
    description: NATIVE[locale]?.description ?? "Publisher and hosting information for geotoolbox.ai.",
    alternates: {
      canonical: `${siteConfig.url}/${locale}/legal`,
      languages: {
        en: `${siteConfig.url}/legal`,
        fr: `${siteConfig.url}/fr/legal`,
        es: `${siteConfig.url}/es/legal`,
        de: `${siteConfig.url}/de/legal`,
        "x-default": `${siteConfig.url}/legal`,
      },
    },
  }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!SUPPORTED.includes(locale)) notFound()
  setRequestLocale(locale)
  if (locale === "es") return <LegalFrame><LegalNoticeEs /></LegalFrame>
  if (locale === "de") return <LegalFrame><LegalNoticeDe /></LegalFrame>
  return <LegalFrame><LegalNoticeContent /></LegalFrame>
}
