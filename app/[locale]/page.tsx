import type { Metadata } from "next"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { Hero } from "@/components/landing/hero"
import { ProofStrip } from "@/components/landing/proof-strip"
import { Problem } from "@/components/landing/problem"
import { ScanSignal } from "@/components/landing/scan-signal"
import { Playbook } from "@/components/landing/playbook"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Features } from "@/components/landing/features"
import { PricingTeaser } from "@/components/landing/pricing-teaser"
import { FreeTools } from "@/components/landing/free-tools"
import { LatestPosts } from "@/components/landing/latest-posts"
import { CTA } from "@/components/landing/cta"
import { JsonLd } from "@/components/seo/json-ld"
import { organizationSchema, websiteSchema } from "@/lib/seo-schema"
import { marketingAlternatesFor } from "@/lib/i18n/siblings"

// The home page renders for BOTH locales from here: en at `/` (as-needed, no
// prefix) and fr at `/fr`. This replaces the former app/(marketing)/page.tsx —
// mounting it under [locale] is what lets /fr resolve without a route conflict
// at `/`. setRequestLocale + generateStaticParams keep both prerendered STATIC.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "home.meta" })
  return {
    // absolute opts out of the "%s | GEO Toolbox" template (brand is in-string).
    title: { absolute: t("title") },
    description: t("description"),
    alternates: marketingAlternatesFor("", locale),
  }
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <>
      <JsonLd data={[organizationSchema(), websiteSchema()]} />
      <Hero />
      <ProofStrip />
      <Problem />
      <ScanSignal />
      <HowItWorks />
      <Features />
      <PricingTeaser />
      <FreeTools />
      <Playbook />
      <LatestPosts />
      <CTA />
    </>
  )
}
