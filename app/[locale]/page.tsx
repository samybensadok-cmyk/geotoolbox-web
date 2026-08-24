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
    // A page-level `alternates` REPLACES the root metadata's alternates wholesale,
    // which is how the homepage silently lost the root `types` block (llms.txt,
    // home.md, agents.md) from its <head> — verified live 2026-08-24: only the
    // hreflang links were emitted. The HTTP Link header still advertised them, but
    // an agent that parses the <head> and never reads response headers saw nothing.
    // Merge the site-level machine-readable surfaces back in.
    //
    // ONLY on the default locale: `/home.md` is the twin of `/`, not of `/fr` or
    // `/es` (the middleware rewrite is keyed to the bare `/`). Advertising it on a
    // localized homepage would point an agent at the wrong language.
    alternates: {
      ...marketingAlternatesFor("", locale),
      ...(locale === routing.defaultLocale
        ? {
            types: {
              "text/plain": [
                { url: "/llms.txt", title: "llms.txt" },
                { url: "/llms-full.txt", title: "llms-full.txt" },
                { url: "/llms-blog.txt", title: "Complete article index" },
                { url: "/llms-glossary.txt", title: "Complete glossary index" },
              ],
              "text/markdown": [{ url: "/home.md", title: "Homepage (markdown)" }],
            },
          }
        : {}),
    },
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
