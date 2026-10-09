import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"
import { siteConfig } from "@/lib/config"
import { TermsContent } from "@/components/legal/terms-content"

// SG_LEGAL_V2 (2026-08-15): /fr/terms and /es/terms previously 404'd while the
// footer linked to them. Until a native translation ships, both render the EN
// Terms with a locale banner; §21.6 of the Terms states the EN text prevails.
const SUPPORTED = ["fr", "es", "de"] as const

const NOTE: Record<(typeof SUPPORTED)[number], { title: string; body: string }> = {
  fr: {
    title: "Conditions générales d'utilisation et de vente",
    body: "Ces conditions sont actuellement disponibles en anglais. Une version française est en préparation ; en cas de divergence, la version anglaise fait foi (art. 21.6). Pour toute question : samy@geotoolbox.ai.",
  },
  es: {
    title: "Términos del servicio",
    body: "Estos términos están disponibles actualmente en inglés. Se está preparando una versión en español; en caso de divergencia prevalece la versión inglesa (art. 21.6). Preguntas: samy@geotoolbox.ai.",
  },
  de: {
    title: "Allgemeine Geschäftsbedingungen",
    body: "Diese Bedingungen liegen derzeit auf Englisch vor. Eine deutsche Fassung ist in Arbeit; bei Abweichungen ist die englische Fassung maßgeblich (Art. 21.6). Fragen: samy@geotoolbox.ai.",
  },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!SUPPORTED.includes(locale as (typeof SUPPORTED)[number])) return {}
  return {
    title: NOTE[locale as (typeof SUPPORTED)[number]].title,
    description: "Terms of Service for GEO Toolbox (English version).",
    alternates: {
      canonical: `${siteConfig.url}/${locale}/terms`,
      languages: {
        en: `${siteConfig.url}/terms`,
        fr: `${siteConfig.url}/fr/terms`,
        es: `${siteConfig.url}/es/terms`,
        de: `${siteConfig.url}/de/terms`,
        "x-default": `${siteConfig.url}/terms`,
      },
    },
  }
}

export default async function TermsPageLocale({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!SUPPORTED.includes(locale as (typeof SUPPORTED)[number])) notFound()
  setRequestLocale(locale)
  const note = NOTE[locale as (typeof SUPPORTED)[number]]
  return (
    <TermsContent
      localeNote={
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900" lang={locale}>
          <strong>{note.title}.</strong> {note.body}
        </div>
      }
    />
  )
}
