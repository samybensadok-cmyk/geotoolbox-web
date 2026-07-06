import type { Metadata } from "next"
import { Hero } from "@/components/landing/hero"
import { Problem } from "@/components/landing/problem"
import { ScanSignal } from "@/components/landing/scan-signal"
import { Playbook } from "@/components/landing/playbook"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Features } from "@/components/landing/features"
import { LatestPosts } from "@/components/landing/latest-posts"
import { CTA } from "@/components/landing/cta"
import { JsonLd } from "@/components/seo/json-ld"
import { organizationSchema, websiteSchema } from "@/lib/seo-schema"
import { siteConfig } from "@/lib/config"

export const metadata: Metadata = {
  title: {
    absolute: "AI Search Visibility Platform — Get Your Brand Cited by AI | GEO Toolbox",
  },
  description:
    "Eleven tools to measure and own your brand's visibility in AI search. See where ChatGPT, Perplexity, Gemini, Claude, AI Overviews, Copilot, and Grok cite you — and win the citations you're missing. Free plan.",
  alternates: { canonical: siteConfig.url },
}

export default function Home() {
  return (
    <>
      <JsonLd data={[organizationSchema(), websiteSchema()]} />
      <Hero />
      <Problem />
      <ScanSignal />
      <HowItWorks />
      <Features />
      <Playbook />
      <LatestPosts />
      <CTA />
    </>
  )
}
