import { Hero } from "@/components/landing/hero"
import { Engines } from "@/components/landing/engines"
import { Problem } from "@/components/landing/problem"
import { Playbook } from "@/components/landing/playbook"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Features } from "@/components/landing/features"
import { LatestPosts } from "@/components/landing/latest-posts"
import { CTA } from "@/components/landing/cta"

export default function Home() {
  return (
    <>
      <Hero />
      <Engines />
      <Problem />
      <HowItWorks />
      <Playbook />
      <Features />
      <LatestPosts />
      <CTA />
    </>
  )
}
