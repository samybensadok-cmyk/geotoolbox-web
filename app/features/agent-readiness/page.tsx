import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { RelatedFeatures } from "@/components/features/related-features"
import { FeatureFaq } from "@/components/features/feature-faq"
import { ScreenshotFrame } from "@/components/features/screenshot-frame"
import { PainScenarioSection } from "@/components/features/pain-scenario"
import { HowItWorks3Step, type Step } from "@/components/features/how-it-works"
import { ActVsMonitorWedge } from "@/components/features/act-vs-monitor"
import { SocialProofBlock } from "@/components/features/social-proof"
import { DualCTA } from "@/components/features/dual-cta"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { softwareApplicationSchema, howToSchema } from "@/lib/seo-schema"

export const metadata: Metadata = {
  title: "AI Crawler & Agent Readiness Checker",
  description:
    "Can GPTBot, ClaudeBot, and PerplexityBot reach and read your site? Scan any URL: 28 checks across 34 AI crawlers, a headless-browser render of what an agent actually sees, JS-rendering parity, schema validation, and entity intelligence.",
  openGraph: {
    title: "AI Crawler & Agent Readiness Checker",
    description:
      "28 checks across 34 AI crawlers, a headless-browser render of what an agent sees, JS-rendering parity, schema validation, and entity intelligence.",
  },
  alternates: { canonical: `${siteConfig.url}/features/agent-readiness` },
}

const steps: Step[] = [
  {
    verb: "Give",
    title: "A root URL",
    body: "Agent Readiness runs infrastructure-level checks, so it starts at your root domain — not a single page.",
  },
  {
    verb: "Probe",
    title: "28 checks across 3 layers",
    body: "Standards and a 34-crawler access matrix, a headless-Chromium render of what an agent actually sees, and a content-intelligence read of clarity and entities.",
  },
  {
    verb: "Fix",
    title: "A readiness report",
    body: "The bot matrix, the above-fold capture, the JS-parity diff, and the exact fixes — the PDF adds full hop transcripts and screenshots.",
  },
]

const layers = [
  {
    tag: "Static",
    title: "Standards + crawler access",
    note: "robots.txt to schema",
    checks: [
      "robots.txt vs 34 AI crawlers",
      "Sitemap + Link headers",
      "Content Signals",
      "Markdown content negotiation",
      "Agentic content readiness",
      "Google agent-UX guidance",
      "schema.org @type validation",
    ],
  },
  {
    tag: "Visual",
    title: "What a headless agent sees",
    note: "Headless Chromium 138",
    checks: [
      "Above-fold screenshot (1280×800)",
      "JS-rendering parity (JS vs no-JS)",
      "Console + network health",
      "JS framework detection",
      "Form-action detection",
    ],
  },
  {
    tag: "Content",
    title: "Can an agent understand it",
    note: "Claude Haiku, cached 24h",
    checks: ["BLUF clarity score", "Entity-density analysis"],
  },
]

const outcomes = [
  {
    tag: "34 crawlers",
    title: "Every AI agent user agent",
    body: "We test your robots.txt and live access against 34 AI crawler user agents — GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Amazonbot, Bytespider, Applebot, meta-externalagent and more. For each: allowed or blocked, and the source of any block.",
  },
  {
    tag: "Visual capture",
    title: "What an agent actually sees",
    body: "A headless Chromium 138 capture of your above-the-fold render at 1280×800. Plenty of sites look fine in your browser and render empty to a bot — this shows the page the way an agent receives it.",
  },
  {
    tag: "JS parity",
    title: "Content that survives no-JS",
    body: "Most AI crawlers do not execute JavaScript. We diff the JS and no-JS render and flag any content, navigation, or links that only exist after hydration.",
  },
  {
    tag: "Standards parity",
    title: "Beyond robots.txt",
    body: "Sitemap and Link headers, Content Signals, Markdown content negotiation, agentic content readiness, and Google's agent-UX guidance — so an agent can both reach and traverse the site.",
  },
  {
    tag: "Schema validation",
    title: "Structured data that parses",
    body: "schema.org @type validation, so the structured data an agent reads is well-formed and type-correct — not just present.",
  },
  {
    tag: "Entity intelligence",
    title: "Clarity an agent can extract",
    body: "A content-intelligence pass scores BLUF clarity and entity density: whether an agent can quickly extract who you are and what the page actually says.",
  },
]

const faqs = [
  {
    question: "What is agent readiness?",
    answer:
      "Agent readiness measures whether AI agents and crawlers can reach, render, and understand your site. Where a page-level audit asks whether one page is citable, agent readiness asks whether an autonomous agent can fetch, see, and parse the site at all. It runs 28 live checks across three layers: standards and crawler access, a headless-browser visual render, and a content-intelligence read.",
  },
  {
    question: "Will this help me rank in ChatGPT and Perplexity?",
    answer:
      "It removes the blockers that keep you out of them. If GPTBot or PerplexityBot can't crawl you, or your content only exists after JavaScript runs, those engines can't cite you no matter how good the page is. Agent Readiness clears that access path; Content Analyzer then optimizes the page itself.",
  },
  {
    question: "How is it different from Content Analyzer?",
    answer:
      "Content Analyzer grades a single page A to F for citability. Agent Readiness works at the site/infrastructure level from a root URL: which of 34 AI crawlers can get in, what a headless agent actually sees, JS-rendering parity, and standards like sitemaps, Link headers, and markdown negotiation. Use Agent Readiness to clear the access path, then Content Analyzer to optimize the page once agents can reach it.",
  },
  {
    question: "Which AI crawlers does it check?",
    answer:
      "34 AI crawler user agents, including GPTBot and OAI-SearchBot (OpenAI), ClaudeBot, PerplexityBot, Google-Extended, CCBot, Amazonbot, Bytespider, Applebot, and meta-externalagent. For each: allowed or blocked, and the source of any block — robots.txt, a response header, or a firewall rule.",
  },
  {
    question: "Does it check JavaScript rendering?",
    answer:
      "Yes. We fetch the page with and without JavaScript execution and diff the two. Content, navigation, or links that only appear after hydration are flagged, because most AI crawlers do not run JS. We also detect the JS framework and any form actions.",
  },
  {
    question: "Can I export the report?",
    answer:
      "Yes. Every probe produces a report you can download as a PDF — the 34-crawler matrix, the above-fold capture, the JS-parity diff, full hop transcripts, and prioritized fixes. Clean enough to hand to a developer, detailed enough to debug.",
  },
]

export default function AgentReadinessPage() {
  return (
    <>
      {/* Hero — pain-led, with a real readiness report as proof */}
      <section className="relative overflow-hidden bg-[var(--surface-steel)] px-6 pt-16 pb-16 sm:pt-20 sm:pb-20">
        <JsonLd
          data={[
            softwareApplicationSchema({
              name: "Agent Readiness",
              description:
                "An AI crawler and agent readiness checker: 28 checks across 34 AI crawlers, a headless-browser render of what an agent sees, JS-rendering parity, schema validation, and entity intelligence.",
              url: `${siteConfig.url}/features/agent-readiness`,
              applicationSubCategory: "AI agent readiness scanner",
            }),
            howToSchema({
              name: "How to check your site's AI agent readiness",
              steps: steps.map((s) => ({ name: s.title, text: s.body })),
            }),
          ]}
        />

        <div className="mx-auto max-w-5xl">
          <Breadcrumbs featureName="Agent Readiness" />
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
              AI Crawler &amp; Agent Readiness
            </p>
            <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
              Can AI agents even reach your site?
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
              One forgotten robots.txt line or a JS-only page, and GPTBot, ClaudeBot, and PerplexityBot
              can&apos;t read you — so AI never cites you, and you never see an error. Agent Readiness scans
              any root URL across 34 AI crawlers, renders the page in a headless browser to show what an
              agent actually sees, and hands you the exact fixes.
            </p>
            <div className="mt-8">
              <DualCTA
                primaryLabel="Scan a URL free"
                secondaryLabel="See the 28 checks"
                secondaryHref="#layers"
                microcopy="One root URL is all it takes · results in minutes"
              />
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-4xl">
            <ScreenshotFrame
              src="/screenshots/agent-readiness/readiness-scores.png"
              alt="Agent Readiness report: an overall score of 44/100 (grade C), a breakdown of blockers, critical issues, quick wins and passing checks, and per-job scores for Product Discovery, Navigation, Task Completion and Form Handling."
              width={3270}
              height={938}
              priority
              caption="A real readiness report: one overall score, a blockers/critical/quick-wins breakdown, and per-job scores for the four things an AI agent has to do on your site."
            />
          </div>
        </div>
      </section>

      {/* The cost of being unreachable */}
      <PainScenarioSection
        eyebrow="The blind spot"
        scenario="Block GPTBot in a robots.txt rule someone added months ago, or ship a page whose content only appears after JavaScript runs, and AI engines simply can&apos;t read you — no citations, no recommendations, no AI referral traffic. There&apos;s no error to catch; you just never show up in the answer."
        bridge="Agent Readiness scans the whole access path — 34 crawlers, the headless render, JS parity — so you find the blocks before they quietly cost you citations."
      />

      {/* How it works (HowTo schema source) */}
      <HowItWorks3Step heading="From root URL to readiness report in three steps" steps={steps} />

      {/* The 28 checks — 3 layers */}
      <section id="layers" className="border-t border-gray-100 bg-gray-50 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">28 checks, 3 layers</p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
              Reach, render, and read.
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-gray-600">
              An agent has to get past your robots and firewall, render the page without a real browser, and pull meaning out of it. Each layer checks one of those.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {layers.map((l) => (
              <div key={l.tag} className="flex flex-col rounded-2xl border border-gray-200 bg-white p-7">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">{l.tag}</span>
                  <span className="font-mono text-[10px] text-gray-500">{l.note}</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold tracking-tight text-gray-900">{l.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {l.checks.map((c) => (
                    <li key={c} className="flex items-start gap-2.5 text-[14px] leading-snug text-gray-700">
                      <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-600" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M3 7.5l2.5 2.5L11 4.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Act, don't just monitor — the exact fix */}
      <ActVsMonitorWedge
        body="Agent Readiness doesn't just score you — every failed check comes with the source line (the robots.txt rule, the X-Robots-Tag header, the firewall rule) and the one-line fix."
        example="See ClaudeBot blocked? The report shows the exact robots.txt line doing it and what to change — so you unblock it and the next scan flips it to allowed."
        link={{ label: "Then grade the page itself with Content Analyzer", href: "/features/content-analyzer" }}
      />

      {/* Outcomes */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">What makes it different</p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
              The access path, not just the page.
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
            {outcomes.map((o) => (
              <div key={o.tag}>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">{o.tag}</p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight text-gray-900">{o.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{o.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Light proof */}
      <section className="border-t border-gray-100 bg-white px-6 py-12">
        <SocialProofBlock provenanceLine="Every check runs live against your real URL — a headless Chromium render and a live crawl against 34 AI crawler user agents, not a cached guess." />
      </section>

      <FeatureFaq items={faqs} />

      <RelatedFeatures current="agent-readiness" related={["content-analyzer", "geo-scan", "domain-overview"]} />

      {/* CTA */}
      <section className="bg-gray-950 px-6 py-20 sm:py-24">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              Scan your site for AI agents.
            </h2>
            <p className="mt-2 text-base text-gray-300">One root URL is all it takes. Results in minutes.</p>
          </div>
          <Link href={siteConfig.appSignupUrl} prefetch={false} className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 active:translate-y-[1px]">
            Run a scan
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  )
}
