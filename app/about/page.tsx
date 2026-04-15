import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/features/breadcrumbs"

export const metadata: Metadata = {
  title: "About",
  description:
    "GEO Toolbox is a measurement and intelligence layer for AI search — built to answer one question: when someone asks an AI engine about your space, who gets cited?",
}

export default function AboutPage() {
  return (
    <>
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
            GEO Toolbox is a measurement and intelligence layer for AI search. One scan, six engines, every citation &mdash; so teams can see, track, and shape how ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews, and Bing Copilot describe their brand.
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-6 text-[17px] leading-relaxed text-gray-700">
            <p>
              AI engines are becoming the default interface between questions and answers. That shift rewrites the rules of visibility: there&apos;s no SERP to scroll, no ten blue links, just a generated response that either names you or doesn&apos;t.
            </p>
            <p>
              GEO Toolbox exists to make that layer legible. Every scan runs a prompt across six engines, aggregates every domain and URL cited, and returns a 0&ndash;100 visibility score alongside the raw citations &mdash; yours and your competitors&apos;. Seven connected tools build on top of that primitive: scanning, content grading, briefing, competitive tracking, community monitoring, and AI-driven analytics.
            </p>
            <p>
              The tool is built and operated by Samy Mahmoudi out of StubGroup, an SEO agency that builds in public. It&apos;s currently free while in beta, supports eight countries, and is used daily by agency teams and in-house SEO professionals tracking how AI sees their brands.
            </p>
            <p className="text-base text-gray-600">
              Questions, partnerships, or feedback?{" "}
              <a
                href="mailto:hello@geotoolbox.ai"
                className="font-semibold text-accent-700 underline hover:text-accent-800"
              >
                hello@geotoolbox.ai
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
