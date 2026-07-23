import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { StickyServiceCta } from "@/components/services/sticky-cta"
import { FeatureFaq } from "@/components/features/feature-faq"
import { ProofResults } from "@/components/services/proof-results"
import { JsonLd } from "@/components/seo/json-ld"
import { siteConfig } from "@/lib/config"
import { PRIMARY_AUTHOR } from "@/lib/authors"
import { proofStats, contentCounts } from "@/lib/proof-stats"

const PAGE_URL = `${siteConfig.url}/services/ai-automation-agency`
// Book-a-call only at launch (operator decision 2026-07-23): every build is
// scoped and quoted per project — no Stripe checkout item on this page.
const CALL_HREF = "https://calendly.com/samy-bensadok/30min-call"

// Single-sourced in lib/proof-stats.ts (shared with the OG image).
const CONTENT_COUNTS = contentCounts

export const metadata: Metadata = {
  // Base title 40 chars — template suffix "| GEO Toolbox" keeps total ≤60.
  title: "AI Automation Agency & Agent Development",
  description:
    "Founder-led AI automation agency building custom AI agents, Claude skills and internal tools — with fixed quotes, human approval gates and full ownership.",
  openGraph: {
    title: "The AI Agents That Run This Business — Built For Yours",
    description:
      "Custom AI agents, Claude skills and internal tools for content, lead gen and operations — built by the solo operator whose own agents run geotoolbox.ai. Fixed quotes, human approval gates, full ownership.",
  },
  alternates: { canonical: PAGE_URL },
}

// What I build — the three delivery formats, defined honestly. The buyer
// doesn't need to pick one before the call: the workflow determines the build.
const definitionRows = [
  {
    num: "01",
    title: "Claude skills — a workflow your AI runs the same way every time.",
    body: "A skill packages your process — instructions, references, scripts, quality gates — so Claude executes it reliably instead of improvising from a prompt. My flagship skill runs a 14-phase research-and-QA pipeline that writes this site's blog. Skills fit repeatable knowledge work: research, content, reporting, review.",
  },
  {
    num: "02",
    title: "AI agents & automations — systems that watch, decide and deliver.",
    body: "An agent monitors sources, makes bounded decisions, calls tools and hands you a finished output — a scored lead list, an enriched report, a filed alert — with human approval gates where the stakes require them. Not a chatbot: a worker with a job description and a paper trail.",
  },
  {
    num: "03",
    title: "Custom AI tools — when the workflow needs an interface.",
    body: "Calculators that qualify leads on your site, white-label scanners your agency resells, internal dashboards your team actually opens. Purpose-built, small surface area, shipped into production — not a prototype that dies in a demo.",
  },
]

type FlowRow = { num: string; verb: string; title: string; body: string; output: string }

const flow: FlowRow[] = [
  {
    num: "01",
    verb: "Scope",
    title: "One workflow, mapped end to end — with an honest build-or-don't verdict.",
    body: "We take one repetitive, expensive workflow and map its inputs, outputs, tools and judgment points. You get a written blueprint: what to build (skill, agent, tool — or nothing, if automation isn't the answer), the risks, and a fixed quote. No hourly meter, no discovery theater.",
    output: "workflow blueprint + fixed quote",
  },
  {
    num: "02",
    verb: "Build",
    title: "A working system on your real inputs — with QA gates and test cases.",
    body: "I build in Claude Code the same way I build for my own revenue: test cases from your actual data, multi-model review before anything ships, human approval checkpoints wherever an output touches a customer or a database. You see it run against your real workflow before handoff.",
    output: "production system, tested on your data",
  },
  {
    num: "03",
    verb: "Own",
    title: "Documented handoff — the code, the prompts, the playbook are yours.",
    body: "Every build ships with documentation your team can operate from, and you own all of it: code, skills, prompts, data. If we stop working together, you keep everything needed to run and maintain the system — no vendor lock-in. Optional: I keep running and improving it on a monthly arrangement.",
    output: "docs + full ownership",
  },
]

type Tier = {
  name: string
  price: string
  billing: string
  summary: string
  detail: string
  chip: "One-off" | "Retainer"
  featured?: boolean
}

// All three engagements are book-a-call: builds are priced per project after
// the scoping call, so no dollar figures are shown or invented here.
const tiers: Tier[] = [
  {
    name: "Workflow Blueprint",
    price: "Fixed fee",
    billing: "One-off · quoted on the call",
    summary: "One workflow mapped, a build-or-don't verdict, and a fixed quote for the build.",
    detail:
      "The paid scoping engagement that follows the free intro call: your workflow mapped end to end, the right format chosen (skill, agent, tool — or an honest 'don't build this'), risks and data handling assessed, and a fixed build quote. The blueprint is yours either way.",
    chip: "One-off",
  },
  {
    name: "Pilot Build",
    price: "Fixed quote",
    billing: "One-off · scoped to one workflow",
    summary: "One workflow turned into a working, documented system — in production, not a demo.",
    detail:
      "A single, hard-scoped workflow built into a production system: tested on your real inputs, QA-gated, documented and handed off. Deliberately narrow — the pilot has to earn the next build. Quoted after the Blueprint, or directly from the intro call when the workflow is already well-defined.",
    chip: "One-off",
    featured: true,
  },
  {
    name: "Build & Run",
    price: "Monthly",
    billing: "Retainer · systems I built or audited",
    summary: "I keep your systems running, improving and current as models and APIs move.",
    detail:
      "Monitoring, fixes, prompt and skill refinement, model updates, and a monthly improvement allowance — for systems I built or have audited. Month to month after an initial period we agree on the call.",
    chip: "Retainer",
  },
]

type ClientBuild = {
  label: string
  system: string
  points: string[]
}

// Client builds — named only where cleared. The two agency tool builds are
// white-label arrangements and are never named (operator rule, 2026-07-23); the
// suspension scanner's client is never named (standing rule). Modern Mill is
// cleared to name.
const clientBuilds: ClientBuild[] = [
  {
    label: "Modern Mill · building-materials manufacturer",
    system: "Two lead-capture calculators",
    points: [
      "Product-specific calculators that turn spec-stage visitors into qualified leads on the site.",
      "Scoped, built and shipped as embeddable tools their marketing team runs without a developer.",
    ],
  },
  {
    label: "Google Ads agency · lead generation",
    system: "Suspension-lead monitoring pipeline",
    points: [
      "Watches three public sources for businesses with suspended ad accounts — the agency's exact buyer, at the exact moment of need.",
      "Deduplicates, scores and enriches every lead, then delivers a ranked spreadsheet. Runs on a schedule, not on someone's to-do list.",
    ],
  },
  {
    label: "B2B SEO agency · white-label",
    system: "AI visibility scanner",
    points: [
      "A white-label scan tool the agency runs under its own brand to show clients where they appear — or don't — in AI answers.",
      "Built on the same engine as geotoolbox.ai, packaged for an agency's sales motion.",
    ],
  },
  {
    label: "GTM agency · sales operations",
    system: "Go-to-market workflow tool",
    points: [
      "A custom tool supporting the agency's outbound motion — built to their exact process.",
      "Scoped tight, shipped fast, owned by the client.",
    ],
  },
]

const problemPoints = [
  {
    num: "01",
    text: "Your team spends hours a week copying data between tools, re-researching the same questions, or formatting the same report — work a system should do.",
  },
  {
    num: "02",
    text: "You tried ChatGPT and a Zapier flow. It worked until the task needed judgment — then it broke, hallucinated, or quietly produced garbage nobody checked.",
  },
  {
    num: "03",
    text: "The agencies quoting you five figures for 'AI transformation' can't show you one system of their own running in production.",
  },
]

const faqs = [
  {
    question: "What's the difference between an AI agent, an automation, and a Claude skill?",
    answer:
      "An automation is a fixed pipeline: trigger, steps, output — great until a step needs judgment. An AI agent adds bounded decision-making: it can read, evaluate, choose tools and escalate to a human. A Claude skill is a packaged workflow — instructions, references, scripts and quality gates — that makes Claude run your process the same way every time instead of improvising. Most real builds combine all three, and you don't need to pick the format before we talk: the workflow determines the build.",
  },
  {
    question: "What does an AI automation agency actually do?",
    answer:
      "The honest version: take one expensive, repetitive workflow, decide whether it should be automated at all, then build the smallest system that does it reliably — with test cases, human approval gates and documentation. The dishonest version sells a chatbot demo and a retainer. This page is the honest version, run by one operator whose own systems are public: the blog this site publishes is written by one of them.",
  },
  {
    question: "How much does it cost?",
    answer:
      "The intro call is free; every build after it is quoted as a fixed price — no hourly billing, no open-ended retainer to get a number. Cost tracks the workflow's complexity: integrations, judgment points, and how much QA the stakes demand. The Blueprint stage exists precisely so you get a fixed quote and a build-or-don't verdict before committing to anything bigger.",
  },
  {
    question: "Can't I just use ChatGPT and Zapier myself?",
    answer:
      "For simple, deterministic flows — yes, and I'll tell you so on the call. The gap shows up when a task needs judgment, when an output touches customers or a database, or when 'usually works' isn't good enough. Production systems need test cases, approval gates, error handling and docs. That engineering layer is what you're buying; the API calls are the cheap part.",
  },
  {
    question: "Who owns the code, prompts and data?",
    answer:
      "You do — all of it. Code, skills, prompts, documentation, and every dataset the system produces. Builds run in your accounts wherever practical, so API keys, costs and data stay under your control. If we stop working together, everything keeps running and nothing is held hostage.",
  },
  {
    question: "Will an agent run unsupervised?",
    answer:
      "Only where the stakes allow it. Anything that touches a customer, spends money or writes to a system of record gets a human approval gate by default — you approve, the system executes. Full autonomy is earned per-workflow as trust builds, not promised on a sales call. Anyone selling you a fully autonomous digital employee on day one is selling the demo, not the system.",
  },
  {
    question: "Why you and not a dev shop?",
    answer:
      `Proof of work. I built geotoolbox.ai solo — scan engine, tracker, billing, admin — and the AI systems that run it: a 14-phase skill that has written all ${contentCounts.en + contentCounts.fr} of its published articles, plus the QA pipeline that reviews them. Dev shops show you a portfolio of other people's logos; I can show you the systems, running, on the site you're reading. The trade-off, stated plainly: I'm one operator with limited build slots, so scope is deliberately narrow and there's sometimes a wait.`,
  },
]

// Service node — no offers[] block: engagements are quoted per project (no
// public prices), and schema Offers without prices validate poorly.
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "AI Automation Agency & Agent Development",
  description:
    "Founder-led AI automation service: custom AI agents, Claude skills and internal AI tools for content, lead generation, sales and agency operations — scoped fixed-quote builds with human approval gates, testing and full client ownership.",
  url: PAGE_URL,
  areaServed: "Worldwide",
  serviceType: [
    "AI Automation",
    "AI Agent Development",
    "Claude Skills Development",
    "Custom AI Tools",
  ],
  provider: {
    "@type": "Person",
    "@id": `${siteConfig.url}/author/${PRIMARY_AUTHOR.slug}#person`,
    name: PRIMARY_AUTHOR.name,
    url: `${siteConfig.url}/author/${PRIMARY_AUTHOR.slug}`,
    jobTitle: PRIMARY_AUTHOR.role,
    ...(PRIMARY_AUTHOR.avatar ? { image: `${siteConfig.url}${PRIMARY_AUTHOR.avatar}` } : {}),
  },
}

export default function AiAutomationAgencyPage() {
  const fmt = (n: number) => n.toLocaleString("en-US")
  const totalArticles = CONTENT_COUNTS.en + CONTENT_COUNTS.fr

  return (
    <>
      <JsonLd data={serviceSchema} />

      {/* 1 — Hero: self-demo headline + founder credential + GSC receipt card */}
      <section className="relative overflow-hidden bg-white px-6 pt-10 pb-16 sm:pt-14 sm:pb-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: [
              "radial-gradient(ellipse 640px 440px at 10% 12%, rgba(241, 243, 252, 0.7), transparent 70%)",
              "radial-gradient(ellipse 720px 520px at 88% 6%, rgba(204, 251, 241, 0.55), transparent 72%)",
            ].join(","),
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(15 23 42 / 1) 1px, transparent 0)",
            backgroundSize: "22px 22px",
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.85) 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.85) 100%)",
            opacity: 0.05,
          }}
        />

        <div className="relative mx-auto max-w-7xl">
          <Breadcrumbs
            trail={[
              { name: "Home", href: "/" },
              { name: "Services", href: "" },
              { name: "AI Automation & Agents", href: "" },
            ]}
          />

          <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="animate-fade-up lg:col-span-6">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                AI automation agency — done for you
              </p>

              <div className="mt-4">
                <span className="inline-flex items-center gap-2.5 rounded-full border border-gray-200 bg-white/80 py-1 pl-1 pr-4 shadow-sm backdrop-blur">
                  <Image
                    src={PRIMARY_AUTHOR.avatar ?? "/authors/samy-ben-sadok.jpg"}
                    alt={PRIMARY_AUTHOR.name}
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                  <span className="text-[12px] font-medium text-gray-700">
                    <span className="font-semibold text-gray-900">Samy Ben Sadok</span>
                    <span className="mx-1.5 text-gray-300" aria-hidden="true">·</span>
                    Founder, GEO Toolbox
                  </span>
                </span>
              </div>

              <h1 className="mt-6 text-[clamp(2rem,4.4vw,3.4rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
                I built the AI agents that run this business.{" "}
                <span className="text-accent-700">I&apos;ll build yours.</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
                Custom AI agents, Claude skills and internal tools that do real work — research, content,
                lead generation, operations. The proof is the site you&apos;re on: its {totalArticles}-article
                blog is written by a skill I built, QA&apos;d by an agent pipeline, and it ranks. Yours is an
                intro call away.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={CALL_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-accent-900 px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-accent-800 hover:shadow-xl hover:shadow-accent-900/25 active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
                >
                  Book an intro call
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link
                  href="#case-study"
                  className="rounded-full border border-gray-200 px-6 py-3.5 text-[15px] font-medium text-gray-700 transition-colors duration-200 hover:border-gray-400 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
                >
                  See what I&apos;ve built
                </Link>
              </div>
              <p className="mt-4 text-xs text-gray-500">
                Free 30-min intro call · fixed quotes, no hourly billing · limited build slots.
              </p>

              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                {[
                  "Fixed quote before any build",
                  "You own the code, prompts & docs",
                  "Human approval gates by default",
                ].map((point) => (
                  <li key={point} className="flex items-center gap-1.5 text-[12px] font-medium text-gray-600">
                    <svg className="h-3.5 w-3.5 shrink-0 text-accent-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3.5 8.5l3 3 6-6.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Receipt card — GSC query growth for the site the agents run. */}
            <div className="animate-fade-up stagger-2 lg:col-span-6">
              <div className="relative lg:-mr-4 xl:-mr-10">
                <div
                  aria-hidden="true"
                  className="absolute -inset-8 rounded-[3rem] opacity-70"
                  style={{
                    background:
                      "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(94, 234, 212, 0.18), transparent 70%)",
                    filter: "blur(16px)",
                  }}
                />
                <div aria-hidden="true" className="absolute -bottom-6 left-8 right-8 h-8 rounded-full bg-gray-900/8 blur-xl" />
                <figure className="relative">
                  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_20px_60px_-20px_rgba(15,23,42,0.16)]">
                    <div aria-hidden="true" className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3">
                      <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                      <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                      <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                      <span className="ml-3 inline-flex items-center gap-1.5 rounded-md border border-gray-100 bg-white px-2.5 py-1 font-mono text-[11px] text-gray-500">
                        <svg className="h-3 w-3 text-accent-600" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="2.5" y="5.5" width="7" height="4.5" rx="1" />
                          <path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" strokeLinecap="round" />
                        </svg>
                        Search Console — geotoolbox.ai
                      </span>
                      <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-gray-500 shadow-sm">
                        The receipt
                      </span>
                    </div>
                    <div className="bg-white p-2">
                      <Image
                        src="/services/automation/gsc-queries-growth-2026-07.png"
                        width={2496}
                        height={816}
                        alt={`Google Search Console chart: queries ranked for geotoolbox.ai growing from 27 in May 2026 to ${fmt(proofStats.google.rankedKeywords)} in July 2026 — content produced by the article-writing skill.`}
                        fetchPriority="high"
                        sizes="(min-width: 1024px) min(48vw, 720px), 100vw"
                        className="h-auto w-full"
                      />
                    </div>
                  </div>
                  <figcaption className="mt-3 font-mono text-[12px] text-gray-500">
                    27 → {fmt(proofStats.google.rankedKeywords)} Google queries (90-day GSC view), after about{" "}
                    {proofStats.weeksToResult} weeks of publishing — every page written by the skill. As of{" "}
                    {proofStats.asOf}.
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2 — Category definition: what I build (skills / agents / tools) */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
              What I build
            </p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
              Skills, agents, tools — <span className="text-accent-700">the workflow decides which.</span>
            </h2>
          </div>

          <ol className="mt-10 divide-y divide-gray-200 border-y border-gray-200">
            {definitionRows.map((d) => (
              <li key={d.num} className="grid grid-cols-1 gap-4 py-7 md:grid-cols-[auto_1fr] md:gap-10">
                <span className="font-mono text-2xl font-bold tabular-nums text-accent-700 md:text-3xl">
                  {d.num}
                </span>
                <div>
                  <h3 className="text-lg font-semibold leading-snug tracking-tight text-gray-900">{d.title}</h3>
                  <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-gray-600">{d.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-8 text-[14px] leading-relaxed text-gray-500">
            You don&apos;t need to choose the format before we talk — bring the workflow, I&apos;ll recommend
            the build. Background reading:{" "}
            <Link href="/glossary/ai-agent" className="font-medium text-accent-700 underline decoration-accent-200 underline-offset-2 hover:decoration-accent-500">
              what an AI agent is
            </Link>
            ,{" "}
            <Link href="/blog/agentic-ai" className="font-medium text-accent-700 underline decoration-accent-200 underline-offset-2 hover:decoration-accent-500">
              agentic AI
            </Link>{" "}
            and{" "}
            <Link href="/blog/what-is-claude-code" className="font-medium text-accent-700 underline decoration-accent-200 underline-offset-2 hover:decoration-accent-500">
              Claude Code
            </Link>
            . This page is the done-for-you service.
          </p>
        </div>
      </section>

      {/* 3 — Proof band (dark, shared): the site the systems run, by the numbers */}
      <ProofResults />

      {/* 4 — Problem frame */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
              Why this usually fails
            </p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
              Three symptoms. <span className="text-accent-700">One cause.</span>
            </h2>
          </div>

          <ol className="mt-10 divide-y divide-gray-200 border-y border-gray-200">
            {problemPoints.map((p) => (
              <li key={p.num} className="flex items-start gap-6 py-6 md:gap-10">
                <span className="font-mono text-2xl font-bold tabular-nums text-accent-700 md:text-3xl">
                  {p.num}
                </span>
                <p className="max-w-2xl pt-1 text-[17px] font-medium leading-snug tracking-tight text-gray-800 md:text-lg">
                  {p.text}
                </p>
              </li>
            ))}
          </ol>

          <p className="mt-10 max-w-3xl text-[clamp(1.15rem,2vw,1.5rem)] font-semibold leading-snug tracking-tight text-gray-600">
            One cause: automation shipped without{" "}
            <span className="text-accent-700">engineering discipline</span> — no test cases, no approval
            gates, no one accountable when the output is wrong. That&apos;s the part I actually sell.
          </p>
        </div>
      </section>

      {/* 5 — What you get + how it runs */}
      <section className="border-t border-[var(--surface-mint-border)] bg-[var(--surface-mint)] px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[5fr_7fr] lg:items-end lg:gap-16">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                What you get, and how it runs
              </p>
              <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
                Three stages. <span className="text-accent-700">Scope, build, own.</span>
              </h2>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-gray-600">
              Every stage ends in an artifact you can hold — a blueprint with a fixed quote, a system running
              on your real data, documentation your team operates from. You always know what the money
              bought, and you can stop at any stage.
            </p>
          </div>

          <ol className="mt-14 space-y-4">
            {flow.map((f) => (
              <li
                key={f.num}
                className="grid grid-cols-1 gap-5 rounded-2xl border border-[var(--surface-mint-border)] bg-white/70 p-6 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-8 md:p-7"
              >
                <div className="flex items-center gap-4 md:w-36 md:flex-col md:items-start md:gap-2.5">
                  <span className="font-mono text-3xl font-bold tabular-nums text-accent-700 md:text-4xl">
                    {f.num}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-accent-50 px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                    {f.verb}
                  </span>
                </div>
                <div className="md:border-l md:border-[var(--surface-mint-border)] md:pl-8">
                  <h3 className="text-lg font-semibold leading-snug tracking-tight text-gray-900">{f.title}</h3>
                  <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-gray-600">{f.body}</p>
                </div>
                <div className="md:text-right">
                  <p className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 font-mono text-[12px] text-gray-700">
                    <svg className="h-3 w-3 text-accent-600" viewBox="0 0 12 12" fill="none">
                      <path d="M3 6h6m0 0L6 3m3 3L6 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="truncate">{f.output}</span>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6 — Flagship case study: the skill that writes this site */}
      <section id="case-study" className="scroll-mt-20 border-t border-[var(--surface-mint-border)] bg-[var(--surface-mint)] px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[7fr_5fr] lg:gap-16">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                The case study is the site you&apos;re on
              </p>
              <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
                One skill writes this blog. <span className="text-accent-700">An agent pipeline QAs it.</span>
              </h2>
              <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-gray-600">
                <p>
                  Every article on this site is produced by a Claude skill I built: a 14-phase pipeline that
                  runs keyword and SERP research, competitor analysis, a multi-model fact panel, drafting,
                  independent fact-checking and a scored QA gate — before a human ever hits publish. It has
                  produced {CONTENT_COUNTS.en} English articles, {CONTENT_COUNTS.fr} French localizations and{" "}
                  {CONTENT_COUNTS.glossary} glossary entries as of {CONTENT_COUNTS.asOf}.
                </p>
                <p>
                  The output holds up under the only test that matters — public performance data. After about{" "}
                  {proofStats.weeksToResult} weeks of active publishing, the domain had grown from 27 Google
                  queries to {fmt(proofStats.google.rankedKeywords)} in the 90-day GSC view, with{" "}
                  {fmt(proofStats.google.top10)} on page one. Separately, Bing&apos;s AI Performance report
                  logs ~{fmt(proofStats.aiCitations.total)} AI-citation appearances over its own trailing{" "}
                  {proofStats.aiCitations.windowDays}-day window. That&apos;s what a production AI system
                  looks like: measurable output, quality gates, a paper trail.
                </p>
              </div>
            </div>

            {/* Receipt card — the content-system figures, single-sourced above */}
            <div className="lg:pt-2">
              <div className="rounded-2xl border border-[var(--surface-mint-border)] bg-white p-7 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.16)]">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                  The content system · the receipt
                </p>
                <dl className="mt-6 space-y-5">
                  <div className="flex items-baseline justify-between gap-4 border-b border-gray-100 pb-5">
                    <dt className="text-[13px] font-medium text-gray-600">Articles published (EN + FR)</dt>
                    <dd className="font-mono text-2xl font-bold tabular-nums text-gray-900">{totalArticles}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 border-b border-gray-100 pb-5">
                    <dt className="text-[13px] font-medium text-gray-600">Glossary entries</dt>
                    <dd className="font-mono text-2xl font-bold tabular-nums text-gray-900">
                      {CONTENT_COUNTS.glossary}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-[13px] font-medium text-gray-600">
                      Operators running it
                      <span className="mt-0.5 block font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                        one skill · one person
                      </span>
                    </dt>
                    <dd className="font-mono text-2xl font-bold tabular-nums text-gray-900">1</dd>
                  </div>
                </dl>
                <p className="mt-6 border-t border-gray-100 pt-4 text-[12px] leading-relaxed text-gray-500">
                  Counts from this site&apos;s public content as of {CONTENT_COUNTS.asOf}. Ranking and
                  AI-citation figures in the dark band above — sourced and stamped per stat.
                </p>
              </div>
            </div>
          </div>

          {/* Receipts strip — the two dashboards behind the claims above */}
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            {[
              {
                chrome: "Bing WMT · AI Performance",
                src: "/services/automation/bing-ai-citations-11.5k-2026-07.png",
                width: 2666,
                height: 722,
                alt: `Bing Webmaster Tools AI Performance report: ~${fmt(proofStats.aiCitations.total)} total AI-citation appearances and ${proofStats.aiCitations.avgCitedPages} average cited pages over a trailing ${proofStats.aiCitations.windowDays}-day window.`,
                caption: `~${fmt(proofStats.aiCitations.total)} AI-citation appearances · trailing ${proofStats.aiCitations.windowDays}-day Bing sample (Copilot + partners) · not unique citations.`,
              },
              {
                chrome: "Google Analytics 4",
                src: "/services/automation/ga4-users-growth-2026-07.png",
                width: 1584,
                height: 802,
                alt: "Google Analytics 4 chart: 1.7K active users for 21 June to 22 July 2026, up 1,053% on the previous period.",
                caption: "1.7K active users, +1,053% vs the previous period · GA4, 21 Jun – 22 Jul 2026.",
              },
            ].map((r) => (
              <figure
                key={r.src}
                className="overflow-hidden rounded-2xl border border-[var(--surface-mint-border)] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
              >
                <div aria-hidden="true" className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-2.5">
                  <span className="h-2 w-2 rounded-full bg-gray-300" />
                  <span className="h-2 w-2 rounded-full bg-gray-300" />
                  <span className="h-2 w-2 rounded-full bg-gray-300" />
                  <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-gray-400">
                    {r.chrome}
                  </span>
                </div>
                <div className="bg-white p-2">
                  <Image
                    src={r.src}
                    width={r.width}
                    height={r.height}
                    alt={r.alt}
                    sizes="(min-width: 768px) min(46vw, 640px), 100vw"
                    className="h-auto w-full"
                  />
                </div>
                <figcaption className="border-t border-gray-100 px-5 py-3 font-mono text-[11px] leading-relaxed text-gray-500">
                  {r.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 6b — Client builds: what's shipped for other operators */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
              Client builds, in production
            </p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
              Systems shipped for other operators —{" "}
              <span className="text-accent-700">still running.</span>
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-gray-600">
              Alongside geotoolbox.ai itself — a full SaaS I built solo with the same tooling — these are
              client builds: each one a scoped workflow turned into a system the client owns and runs.
              Some clients are named with permission; white-label builds stay anonymous by design.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {clientBuilds.map((c) => (
              <div
                key={c.label}
                className="flex flex-col rounded-2xl border border-gray-200 bg-white p-7 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all hover:border-gray-300 hover:shadow-[0_20px_40px_-20px_rgba(15,23,42,0.14)]"
              >
                <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                  {c.label}
                </p>
                <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-gray-900">
                  {c.system}
                </h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {c.points.map((point) => (
                    <li key={point} className="flex gap-2.5 text-[14px] leading-relaxed text-gray-600">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-700" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 — Engagement ladder + risk reversal */}
      <section id="pricing" className="scroll-mt-20 border-t border-[var(--surface-mint-border)] bg-[var(--surface-mint)] px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
              How to start
            </p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
              Start with one workflow. <span className="text-accent-700">Scale when it earns it.</span>
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-gray-600">
              The intro call is free; everything beyond it is quoted as a fixed price before work begins — no
              hourly billing, no open-ended retainer to find out a number. You can stop after any stage and
              keep everything.
            </p>
          </div>

          {/* Fit-filter — qualifies before the tiers so call slots go to real
              prospects with a real workflow. */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-accent-200 bg-white/70 p-6">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                This is for you if
              </p>
              <ul className="mt-4 space-y-2.5 text-[14px] leading-snug text-gray-700">
                {[
                  "A workflow recurs weekly, has describable inputs and outputs, and eats expensive time.",
                  "The work is research, content, lead gen, reporting or ops — judgment work, not just data plumbing.",
                  "You want a system your team owns and operates, with docs — not a dependency on me.",
                ].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <svg className="mt-1 h-3.5 w-3.5 shrink-0 text-accent-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3.5 8.5l3 3 6-6.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white/70 p-6">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                This isn&apos;t for you if
              </p>
              <ul className="mt-4 space-y-2.5 text-[14px] leading-snug text-gray-600">
                {[
                  "You want an 'AI strategy' but can't name one workflow to start with.",
                  "You expect a fully autonomous employee with no human checkpoints on day one.",
                  "It's a one-off task in disguise — a script, not a system. (I'll tell you on the call.)",
                ].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <svg className="mt-1 h-3.5 w-3.5 shrink-0 text-gray-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4l8 8m0-8l-8 8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 items-start gap-5 md:grid-cols-3">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={
                  t.featured
                    ? "relative flex flex-col rounded-2xl border-2 border-accent-500 bg-white p-7 shadow-[0_24px_50px_-24px_rgba(13,148,136,0.35)] md:-mt-3"
                    : "relative flex flex-col rounded-2xl border border-gray-200 bg-white p-7 transition-all hover:border-gray-300 hover:shadow-[0_12px_24px_-12px_rgba(15,23,42,0.08)]"
                }
              >
                {t.featured && (
                  <span className="absolute -top-3 left-7 inline-flex items-center rounded-full bg-accent-700 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white shadow-sm">
                    Recommended start
                  </span>
                )}
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-[15px] font-bold tracking-tight text-gray-900">{t.name}</h3>
                  <span
                    className={
                      t.chip === "One-off"
                        ? "rounded-full bg-accent-50 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-accent-700"
                        : "rounded-full bg-gray-100 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500"
                    }
                  >
                    {t.chip}
                  </span>
                </div>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold tracking-tight text-gray-900">{t.price}</span>
                </div>
                <p className="mt-1 text-[12px] font-medium text-gray-500">{t.billing}</p>
                <p className="mt-4 text-[13px] font-semibold leading-snug text-gray-800">{t.summary}</p>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-gray-600">{t.detail}</p>
                <div className="mt-6">
                  <Link
                    href={CALL_HREF}
                    prefetch={false}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                      t.featured
                        ? "inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-900 px-5 py-3 text-[13px] font-semibold text-white transition-all duration-200 hover:bg-accent-800 active:translate-y-[1px]"
                        : "inline-flex w-full items-center justify-center rounded-full border border-gray-300 px-5 py-3 text-[13px] font-semibold text-gray-800 transition-colors hover:border-gray-400 hover:text-gray-900"
                    }
                  >
                    Book an intro call
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-[13px] font-medium text-gray-500">
            The Blueprint fee is credited toward its Pilot Build if you continue within 30 days. Limited
            build slots — one operator, deliberately narrow scope.
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-gray-500">
            Is your problem visibility rather than workflow? That&apos;s the other half of this business — see{" "}
            <Link href="/services/ai-seo-agency" className="font-medium text-accent-700 underline decoration-accent-200 underline-offset-2 hover:decoration-accent-500">
              done-for-you AI SEO
            </Link>
            ,{" "}
            <Link href="/services/generative-engine-optimization" className="font-medium text-accent-700 underline decoration-accent-200 underline-offset-2 hover:decoration-accent-500">
              generative engine optimization
            </Link>{" "}
            and{" "}
            <Link href="/services/answer-engine-optimization" className="font-medium text-accent-700 underline decoration-accent-200 underline-offset-2 hover:decoration-accent-500">
              answer engine optimization
            </Link>
            .
          </p>

          {/* Risk reversal */}
          <div className="mt-10 grid grid-cols-1 gap-7 rounded-2xl border border-gray-200 bg-white p-8 sm:grid-cols-3">
            <div>
              <h3 className="text-[14px] font-bold tracking-tight text-gray-900">Scope guarantee</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-gray-600">
                Every build has an agreed acceptance test: the system produces the agreed output from your
                real inputs. If it doesn&apos;t, I fix it at no extra fee — or tell you to stop before
                spending more. I never promise revenue or full autonomy; no honest builder can.
              </p>
            </div>
            <div>
              <h3 className="text-[14px] font-bold tracking-tight text-gray-900">You own everything</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-gray-600">
                Code, skills, prompts, docs, data — yours, running in your accounts wherever practical. If
                we stop working together, you keep everything needed to operate and maintain the system,
                with no vendor lock-in.
              </p>
            </div>
            <div>
              <h3 className="text-[14px] font-bold tracking-tight text-gray-900">Stop at any stage</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-gray-600">
                The Blueprint has to earn the Pilot; the Pilot has to earn anything bigger. If the Blueprint
                says &ldquo;don&apos;t build this,&rdquo; you keep the analysis and owe nothing more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8 — FAQ (also emits FAQPage JSON-LD from the same items) */}
      <FeatureFaq items={faqs} heading="The seven questions I always get" />

      {/* 9 — Final CTA */}
      <section className="relative overflow-hidden bg-gray-950 px-6 py-20 sm:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="relative mx-auto flex max-w-5xl flex-col items-start gap-8 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              Bring me one repetitive, expensive workflow.
            </h2>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-gray-300">
              On the call I&apos;ll tell you straight whether it should be a skill, an agent, a tool — or
              nothing at all. Founder to founder, no handoff, no pitch deck.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              href={CALL_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 hover:shadow-xl hover:shadow-black/30 active:translate-y-[1px]"
            >
              Book an intro call
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <StickyServiceCta
        callHref={CALL_HREF}
        pricingHref="#pricing"
        message={
          <>
            Limited <span className="font-semibold text-gray-900">founder-led build slots</span> — book an
            intro call.
          </>
        }
        pricingLabel="How it works"
      />
    </>
  )
}
