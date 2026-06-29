import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { JsonLd } from "@/components/seo/json-ld"
import { aboutPageSchema, organizationSchema } from "@/lib/seo-schema"
import { siteConfig } from "@/lib/config"

export const metadata: Metadata = {
  title: "About",
  description:
    "GEO Toolbox is the platform to get your brand cited by AI — eleven tools to measure your AI search visibility, find why a page isn't cited, and win the citations you're missing across seven engines.",
  alternates: { canonical: `${siteConfig.url}/about` },
}

export default function AboutPage() {
  return (
    <>
      <JsonLd data={[aboutPageSchema(), organizationSchema()]} />
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--surface-warm,theme(colors.amber.50))] px-6 pt-14 pb-16 sm:pt-20 sm:pb-20">
        <div className="mx-auto max-w-4xl">
          <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "About", href: "" }]} />
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
            About
          </p>
          <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
            Built for the AI search era.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-700">
            GEO Toolbox is the platform to get your brand cited by AI. Eleven tools to measure your visibility across seven engines — ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews, Bing Copilot, and Grok — find why a page isn&apos;t cited, and win the citations your competitors are taking.
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-6 text-[17px] leading-relaxed text-gray-700">
            <p>
              AI engines are becoming the default interface between questions and answers. That shift rewrites the rules of visibility: there&apos;s no SERP to scroll, no ten blue links, just a generated response that either cites you or doesn&apos;t. Generative engine optimization (GEO) is the discipline that forms around that new reality — measuring where you stand, then winning the citations you&apos;re missing.
            </p>
            <p>
              GEO Toolbox exists to make that layer legible, then actionable. Every scan runs a prompt across seven engines, aggregates every domain and URL cited, and returns an AI visibility score from 0 to 100 alongside the raw citations, yours and your competitors&apos;. Eleven connected tools build on that primitive: scanning and query fan-out, agent readiness, content grading and briefing, competitive and community intelligence, offsite citation interception, earned-media tracking, and AI-driven analytics — the full workflow from the first scan to the published fix.
            </p>
            <p>
              The tool is built and operated by Samy Ben Sadok, its founder and an SEO and growth strategist with over a decade of experience. It offers a free plan plus paid plans from $49/mo, supports eight countries, and is used daily by agency teams and in-house SEO professionals tracking how AI cites their brands.
            </p>
            <p className="text-base text-gray-600">
              Questions, partnerships, or feedback?{" "}
              <a
                href="mailto:samy@geotoolbox.ai"
                className="font-semibold text-accent-700 underline hover:text-accent-800"
              >
                samy@geotoolbox.ai
              </a>
              .
            </p>
          </div>

          {/* CTA */}
          <div className="mt-14 flex flex-wrap items-center gap-3">
            <Link
              href="/app"
              prefetch={false}
              className="inline-flex items-center gap-2 rounded-full bg-accent-900 px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-accent-800 hover:shadow-xl hover:shadow-accent-900/25 active:translate-y-[1px]"
            >
              Run your first scan
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/features"
              className="rounded-full border border-gray-200 px-6 py-3.5 text-[15px] font-medium text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900"
            >
              Browse the toolset
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
