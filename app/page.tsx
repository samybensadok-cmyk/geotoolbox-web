import type { Metadata } from "next"
import { Hero } from "@/components/landing/hero"
import { Problem } from "@/components/landing/problem"
import { Playbook } from "@/components/landing/playbook"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Features } from "@/components/landing/features"
import { LatestPosts } from "@/components/landing/latest-posts"
import { CTA } from "@/components/landing/cta"
import { JsonLd } from "@/components/seo/json-ld"
import { organizationSchema, websiteSchema } from "@/lib/seo-schema"
import { siteConfig } from "@/lib/config"

export const metadata: Metadata = {
  alternates: { canonical: siteConfig.url },
}

export default function Home() {
  return (
    <>
      <JsonLd data={[organizationSchema(), websiteSchema()]} />
      <Hero />
      <Problem />
      <HowItWorks />
      <Features />
      <Playbook />
      <LatestPosts />
      <CTA />
    </>
  )
}
