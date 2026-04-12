import { Hero } from "@/components/landing/hero"
import { Problem } from "@/components/landing/problem"
import { Features } from "@/components/landing/features"
import { LatestPosts } from "@/components/landing/latest-posts"
import { CTA } from "@/components/landing/cta"

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <Features />
      <LatestPosts />
      <CTA />
    </>
  )
}
