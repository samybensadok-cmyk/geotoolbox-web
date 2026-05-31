import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { RelatedFeatures } from "@/components/features/related-features"
import { FeatureFaq } from "@/components/features/feature-faq"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { softwareApplicationSchema, breadcrumbsSchema } from "@/lib/seo-schema"

export const metadata: Metadata = {
  title: "Agent Readiness: can AI agents reach and read your site?",
  description:
    "Scan any URL for AI agent readiness. 28 checks across standards and 34 AI crawlers, a headless-browser render of what an agent actually sees, JS-rendering parity, schema validation, and entity intelligence. Find out if AI agents can reach, render, and understand your site.",
  openGraph: {
    title: "Agent Readiness: can AI agents reach and read your site?",
    description:
      "28 checks across standards + 34 AI crawlers, a headless-browser render of what an agent sees, JS-rendering parity, schema validation, and entity intelligence.",
  },
  alternates: { canonical: `${siteConfig.url}/features/agent-readiness` },
}

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

const botMatrix = [
  { bot: "GPTBot (OpenAI)", access: "Allowed", ok: true },
  { bot: "ClaudeBot (Anthropic)", access: "Allowed", ok: true },
  { bot: "PerplexityBot", access: "Allowed", ok: true },
  { bot: "Google-Extended", access: "Allowed", ok: true },
  { bot: "Bytespider", access: "Blocked", ok: false },
]

const steps = [
  {
    num: "01",
    verb: "Give",
    title: "A root URL",
    body: "Agent Readiness runs infrastructure-level checks, so it starts at your root domain, not a single page.",
    output: "https://stubgroup.com",
  },
  {
    num: "02",
    verb: "Probe",
    title: "28 checks across 3 layers",
    body: "Standards and a 34-crawler access matrix, a headless-Chromium render of what an agent actually sees, and a content-intelligence read of clarity and entities.",
    output: "28/28 · Static · Visual · Content",
  },
  {
    num: "03",
    verb: "Fix",
    title: "A readiness report",
    body: "The bot matrix, the above-fold capture, the JS-parity diff, and the exact fixes. The PDF adds full hop transcripts and screenshots.",
    output: "Report · transcripts + screenshots",
  },
]

const outcomes = [
  {
    tag: "34 crawlers",
    title: "Every AI agent user agent",
    body: "We test your robots.txt and live access against 34 AI crawler user agents, including GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Amazonbot, Bytespider, Applebot, and meta-externalagent. For each, allowed or blocked, and the source of any block.",
  },
  {
    tag: "Visual capture",
    title: "What an agent actually sees",
    body: "A headless Chromium 138 capture of your above-the-fold render at 1280×800. Plenty of sites look fine in your browser and render empty or broken to a bot. This shows the page the way an agent receives it.",
  },
  {
    tag: "JS parity",
    title: "Content that survives no-JS",
    body: "Most AI crawlers do not execute JavaScript. We diff the JS and no-JS render and flag any content, navigation, or links that only exist after hydration.",
  },
  {
    tag: "Standards parity",
    title: "Beyond robots.txt",
    body: "Sitemap and Link headers, Content Signals, Markdown content negotiation, agentic content readiness, and Google's agent-UX guidance, so an agent can both reach and traverse the site.",
  },
  {
    tag: "Schema validation",
    title: "Structured data that parses",
    body: "schema.org @type validation, so the structured data an agent reads is well-formed and type-correct, not just present.",
  },
  {
    tag: "Entity intelligence",
    title: "Clarity an agent can extract",
    body: "A content-intelligence pass with Claude Haiku scores BLUF clarity and entity density: whether an agent can quickly extract who you are and what the page actually says.",
  },
]

const faqs = [
  {
    question: "What is agent readiness?",
    answer:
      "Agent readiness measures whether AI agents and crawlers can reach, render, and understand your site. Where a page-level audit asks whether one page is citable, agent readiness asks whether an autonomous agent can fetch, see, and parse the site at all. It runs 28 live checks across three layers: standards and crawler access, a headless-browser visual render, and a content-intelligence read.",
  },
  {
    question: "How is it different from Content Analyzer?",
    answer:
      "Content Analyzer grades a single page A to F for citability. Agent Readiness works at the site and infrastructure level from a root URL: which of 34 AI crawlers can get in, what a headless agent actually sees, JS-rendering parity, and standards like sitemaps, Link headers, and markdown negotiation. Use Agent Readiness to clear the access path, then Content Analyzer to optimize the page once agents can reach it.",
  },
  {
    question: "Which AI crawlers does it check?",
    answer:
      "34 AI crawler user agents, including GPTBot and OAI-SearchBot (OpenAI), ClaudeBot, PerplexityBot, Google-Extended, CCBot, Amazonbot, Bytespider, Applebot, and meta-externalagent. For each one it reports allowed or blocked and the source of any block: robots.txt, a response header, or a firewall rule.",
  },
  {
    question: "What does “what an AI agent sees” mean?",
    answer:
      "We render your URL in a headless Chromium 138 browser and capture the above-the-fold view at 1280×800. Many sites look fine in your own browser but render empty or broken to a bot. The screenshot shows the page as an agent receives it, alongside console and network health.",
  },
  {
    question: "Does it check JavaScript rendering?",
    answer:
      "Yes. We fetch the page with and without JavaScript execution and diff the two. Content, navigation, or links that only appear after hydration are flagged, because most AI crawlers do not run JS. We also detect the JS framework and any form actions.",
  },
  {
    question: "Can I export the report?",
    answer:
      "Yes. Every probe produces a report you can download as a PDF, including the 34-crawler matrix, the above-fold capture, the JS-parity diff, full hop transcripts, and prioritized fixes. Clean enough to hand to a developer, detailed enough to debug.",
  },
]

export default function AgentReadinessPage() {
  return (
    <>
      {/* Hero — steel atmosphere (technical / infrastructure feel) */}
      <section className="relative overflow-hidden bg-[var(--surface-steel)] px-6 pt-20 pb-16 sm:pt-24 sm:pb-20">
        <JsonLd data={[
          softwareApplicationSchema({
            name: "Agent Readiness",
            description: "Scan any URL for AI agent readiness: 28 checks across standards and 34 AI crawlers, a headless-browser render of what an agent sees, JS-rendering parity, schema validation, and entity intelligence.",
            url: `${siteConfig.url}/features/agent-readiness`,
            applicationSubCategory: "AI agent readiness scanner",
          }),
          breadcrumbsSchema([
            { name: "Home", url: "/" },
            { name: "Features", url: "/features" },
            { name: "Agent Readiness", url: "/features/agent-readiness" },
          ]),
        ]} />

        <div className="mx-auto max-w-7xl">
          <Breadcrumbs featureName="Agent Readiness" />

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="lg:col-span-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">
                Agent Readiness
              </p>
              <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
                Can AI agents actually use your site?
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
                Scan any root URL for agent readiness. 28 checks across standards and 34 AI crawlers, a headless-browser render of what an agent sees, and a read on whether it can understand the page.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/app" prefetch={false} className="rounded-full bg-accent-900 px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-accent-800 hover:shadow-xl hover:shadow-accent-900/25 active:translate-y-[1px]">
                  Scan a URL
                </Link>
                <Link href="#layers" className="rounded-full border border-gray-300 px-6 py-3.5 text-[15px] font-medium text-gray-700 hover:border-gray-400 hover:text-gray-900">
                  See the 28 checks
                </Link>
              </div>
            </div>

            {/* Readiness card visual */}
            <div className="lg:col-span-6" aria-hidden="true">
              <div className="relative rounded-[2rem] border border-gray-200 bg-white p-8 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.12)]">
                <div className="flex items-start justify-between gap-6">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-[12px] text-gray-500">stubgroup.com</p>
                    <p className="mt-3 text-[11px] font-semibold uppercase tracking-widest text-gray-600">Checks live</p>
                    <p className="mt-1 font-mono text-[68px] font-bold leading-none tracking-tight text-accent-700">28<span className="text-gray-300">/28</span></p>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2">
                    {layers.map((l) => (
                      <div key={l.tag} className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[11px] font-semibold text-gray-700">
                        {l.tag}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-100 pt-5">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-500">AI crawler matrix</p>
                    <span className="font-mono text-[10px] text-gray-500">5 of 34</span>
                  </div>
                  <div className="space-y-1.5">
                    {botMatrix.map((b) => (
                      <div key={b.bot} className="flex items-center justify-between py-1.5">
                        <span className="text-[13px] text-gray-700">{b.bot}</span>
                        <span className={`font-mono text-[11px] font-semibold ${b.ok ? "text-accent-700" : "text-red-600"}`}>
                          {b.access}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[var(--surface-steel)] px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[5fr_7fr] lg:items-end lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">How it works</p>
              <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-gray-900">
                From root URL to readiness report.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-gray-600">
              One scan probes the whole access path: who can crawl you, what a headless agent renders, and whether the content reads clearly. No setup, no crawl scheduling.
            </p>
          </div>

          <ol className="mt-14 divide-y divide-gray-200">
            {steps.map((s) => (
              <li key={s.num} className="grid grid-cols-1 gap-6 py-8 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-10 md:py-10">
                <div className="flex items-center gap-4 md:block">
                  <span className="font-mono text-4xl font-bold tabular-nums text-accent-700 md:text-5xl">{s.num}</span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 md:hidden">{s.verb}</span>
                </div>
                <div>
                  <p className="hidden text-xs font-semibold uppercase tracking-widest text-gray-500 md:block">{s.verb}</p>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight text-gray-900">{s.title}</h3>
                  <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-gray-600">{s.body}</p>
                </div>
                <div className="md:text-right">
                  <p className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 font-mono text-[12px] text-gray-700">
                    <svg className="h-3 w-3 text-accent-600" viewBox="0 0 12 12" fill="none">
                      <path d="M3 6h6m0 0L6 3m3 3L6 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="truncate">{s.output}</span>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* The 28 checks — 3 layers */}
      <section id="layers" className="bg-gray-50 px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[5fr_7fr] lg:items-end lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">28 checks, 3 layers</p>
              <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-gray-900">
                Reach, render, and read.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-gray-600">
              An agent has to get past your robots and firewall, render the page without a real browser, and pull meaning out of it. Each layer checks one of those.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {layers.map((l) => (
              <div key={l.tag} className="flex flex-col rounded-[1.5rem] border border-gray-200 bg-white p-7">
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
          <p className="mt-4 text-xs text-gray-600">
            28 of 28 checks live. Real results show per-check evidence, the source line, and the exact fix.
          </p>
        </div>
      </section>

      {/* Outcomes */}
      <section className="bg-white px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">What makes it different</p>
            <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-gray-900">
              The access path, not just the page.
            </h2>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
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

      <FeatureFaq items={faqs} />

      <RelatedFeatures current="agent-readiness" related={["content-analyzer", "geo-scan", "domain-overview"]} />

      {/* CTA */}
      <section className="bg-gray-950 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              Scan your site for agents.
            </h2>
            <p className="mt-2 text-base text-gray-300">Free while in beta. No credit card. One root URL is all it takes.</p>
          </div>
          <Link href="/app" prefetch={false} className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 active:translate-y-[1px]">
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
