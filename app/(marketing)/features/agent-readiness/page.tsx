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
    "Most scanners tell you a file exists. We fetch your site as GPTBot, ClaudeBot, and PerplexityBot — through your real WAF — render it the way an agent does without JavaScript, and back every access and standards check with the request and response we captured. Get a 0–100 score, a readiness level, and the exact fix for each blocker.",
  openGraph: {
    title: "AI Crawler & Agent Readiness Checker",
    description:
      "We fetch your site as real AI crawler identities through your WAF, render it without JavaScript, and show the request/response behind every access and standards check — with a 0–100 score, a readiness level, and exact fixes.",
  },
  alternates: { canonical: `${siteConfig.url}/features/agent-readiness` },
}

const steps: Step[] = [
  {
    verb: "Give",
    title: "A root URL",
    body: "Agent Readiness runs infrastructure-level checks, so it starts at your root domain — not a single page. No install, no code.",
  },
  {
    verb: "Probe",
    title: "As the real AI crawlers",
    body: "We request your site as GPTBot, ClaudeBot, PerplexityBot and more — through your live WAF — render it in a headless browser with and without JavaScript, and validate the standards agents rely on.",
  },
  {
    verb: "Fix",
    title: "A scored report + your level",
    body: "A 0–100 score, a readiness level, and each blocker with its source line and one-line fix. Access and standards findings include the exact request and response we captured.",
  },
]

const layers = [
  {
    tag: "Access",
    title: "Can the real crawlers get in",
    note: "Fetched as each bot",
    checks: [
      "Live fetch as GPTBot, ClaudeBot, PerplexityBot & more",
      "robots.txt vs 34 AI crawler agents",
      "Content-Signal coherence with your bot rules",
      "WAF / firewall blocks (per crawler identity)",
      "Indexability (noindex / nosnippet)",
    ],
  },
  {
    tag: "Discovery + render",
    title: "Can they find and read it",
    note: "HTTP + headless render",
    checks: [
      "JS-rendering parity (what survives no-JS)",
      "Above-fold capture of what an agent sees",
      "Sitemap, RFC 8288 Link headers, feeds",
      "Markdown negotiation (Accept: text/markdown + Vary)",
      "llms.txt, validated against the llmstxt.org spec",
    ],
  },
  {
    tag: "Structure + citation",
    title: "Can they trust and cite it",
    note: "Schema, entities, clarity",
    checks: [
      "schema.org @type + entity validation",
      "Reachable social / og:image",
      "Structured (JSON) error responses",
      "BLUF clarity + answerability",
      "Freshness & E-E-A-T trust signals",
    ],
  },
]

// The Agent-Readiness level model the score maps onto. L1–L3 are scored today;
// L4 signals are detected in the advanced panel but not yet scored.
const levels: { n: number; name: string; body: string; note?: string }[] = [
  { n: 1, name: "Crawlable", body: "AI crawlers can reach your pages, with no WAF or robots wall in the way." },
  { n: 2, name: "Bot-Aware", body: "You declare per-bot rules in robots or Content-Signals, so crawlers know what's welcome." },
  { n: 3, name: "Agent-Readable", body: "Content renders without JavaScript, and you serve markdown or a valid llms.txt an agent can lift." },
  { n: 4, name: "Agent-Operable", body: "Live capability surfaces like MCP and APIs. We detect these in the advanced panel; it's the top rung, and most sites aren't here yet.", note: "Detected, not yet scored" },
]

const outcomes = [
  {
    tag: "Access truth",
    title: "Fetched as the real crawlers",
    body: "Other tools parse your robots.txt. We actually request your site as GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Googlebot and CCBot — through your live WAF — and report what each one really gets back. A firewall rule that silently drops ClaudeBot shows up here; a robots.txt read never catches it.",
  },
  {
    tag: "Evidence receipts",
    title: "Checks that show their work",
    body: "No black-box score. The access and agentic-standards checks carry the request we sent and the response we got — status, headers, body preview — so you can see exactly why one passed or failed, and hand the receipt straight to a developer.",
  },
  {
    tag: "Honest by design",
    title: "We never guess",
    body: "If a page is JavaScript-only and we can't verify a signal, we say “unverifiable” — we don't score it as a failure. Verified-absent, blocked, and couldn't-check are three different states, each labeled with our confidence. A score you can trust beats a score that flatters you.",
  },
  {
    tag: "JS parity",
    title: "Content that survives no-JS",
    body: "Most AI crawlers do not execute JavaScript. We render your page with and without JS in a headless browser and flag any content, navigation, or links that only exist after hydration. It's a leading reason a perfectly good page stays invisible to agents.",
  },
  {
    tag: "Standards depth",
    title: "The whole agentic stack",
    body: "Markdown negotiation with Vary, llms.txt validated against the llmstxt.org spec, Content-Signal coherence, RFC 8288 Link headers, structured JSON errors, reachable og:image, plus a panel of emerging protocols (MCP cards, A2A, OpenAPI, x402) — detected, never used to pad your score.",
  },
  {
    tag: "The outcome link",
    title: "Readiness, next to real citations",
    body: "Being reachable is the means. Getting cited is the goal. Because GEO Toolbox also tracks your visibility across eight AI engines, readiness and citations live in one account, so a fix you ship has a payoff you can watch. That's a connection a standalone scanner can't make.",
  },
]

const faqs = [
  {
    question: "What is agent readiness?",
    answer:
      "Agent readiness measures whether AI agents and crawlers can reach, render, and understand your site. Where a page-level audit asks whether one page is citable, agent readiness asks whether an autonomous agent can fetch, see, and parse the site at all. It runs live checks across five pillars — access, discovery, render, structure, and citation — fetching your site as the real AI crawlers, rendering it in a headless browser, and validating the agentic standards, then maps the result to an Agent-Readiness Level.",
  },
  {
    question: "Will this help me rank in ChatGPT and Perplexity?",
    answer:
      "It removes the blockers that keep you out of them. If GPTBot or PerplexityBot can't crawl you, or your content only exists after JavaScript runs, those engines can't cite you no matter how good the page is. Agent Readiness clears that access path; Content Analyzer then optimizes the page itself.",
  },
  {
    question: "How is it different from Content Analyzer?",
    answer:
      "Content Analyzer grades a single page A to F for citability. Agent Readiness works at the site/infrastructure level from a root URL: whether the major crawler identities can actually get in (six fetched live, plus your robots.txt rules checked against 34 AI crawlers), what a headless agent actually sees, JS-rendering parity, and standards like sitemaps, Link headers, and markdown negotiation. Use Agent Readiness to clear the access path, then Content Analyzer to optimize the page once agents can reach it.",
  },
  {
    question: "Do you actually fetch my site as GPTBot, or just read robots.txt?",
    answer:
      "We actually fetch it. Agent Readiness sends live requests using the real crawler user agents — GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Googlebot, CCBot — straight through your WAF, and reports what each one really receives. That catches firewall and edge rules that a robots.txt read can't see. Each of these access checks comes with the request and response we captured, so you can verify it yourself.",
  },
  {
    question: "What's an Agent-Readiness Level?",
    answer:
      "A level model that sits next to your 0–100 score, so you can see progress. L0 if crawlers are blocked, then L1 Crawlable (bots can reach you), L2 Bot-Aware (you declare per-bot rules), and L3 Agent-Readable (content renders without JS and you serve markdown or a valid llms.txt). A fourth level, Agent-Operable — live capability surfaces like MCP or APIs — is detected in the advanced panel but not yet scored. Each scan names the next thing that raises your level.",
  },
  {
    question: "Which AI crawlers does it check?",
    answer:
      "We check your robots.txt rules against 34 AI crawler user agents — including GPTBot and OAI-SearchBot (OpenAI), ClaudeBot, PerplexityBot, Google-Extended, CCBot, Amazonbot, Bytespider, Applebot, and meta-externalagent — and we send live requests as six of the majors (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Googlebot, CCBot) to confirm what actually gets through your WAF. For each: allowed or blocked, and the source of any block — robots.txt, a response header, or a firewall rule.",
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
                "An AI crawler and agent readiness checker that fetches your site as the real crawler identities (GPTBot, ClaudeBot, PerplexityBot) through your WAF, renders it without JavaScript, validates the agentic standards, and returns a 0–100 score, a readiness level, and request/response receipts on the access and standards checks.",
              url: `${siteConfig.url}/features/agent-readiness`,
              applicationSubCategory: "AI agent readiness scanner",
            }),
            howToSchema({
              name: "How to check your site's AI agent readiness",
              steps: steps.map((s) => ({ name: s.title, text: s.body })),
            }),
          ]}
        />

        <div className="mx-auto max-w-7xl">
          <Breadcrumbs featureName="Agent Readiness" />
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Left — message */}
            <div className="animate-fade-up lg:col-span-6">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                AI Crawler &amp; Agent Readiness
              </p>
              <h1 className="mt-3 text-[clamp(2rem,4.2vw,3.25rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
                See your site the way <span className="text-accent-700">an AI agent does.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
                One forgotten robots.txt line, a firewall rule, or a JS-only page, and GPTBot, ClaudeBot, and
                PerplexityBot can&apos;t read you — so AI never cites you, and you never see an error. Agent
                Readiness fetches your site <em>as those real crawlers</em>, through your live WAF, renders it
                without JavaScript, and shows the request-and-response proof behind every access finding.
              </p>
              <div className="mt-8">
                <DualCTA
                  primaryLabel="Scan a URL free"
                  secondaryLabel="See what we check"
                  secondaryHref="#layers"
                  microcopy="One root URL is all it takes · results in minutes"
                />
              </div>
            </div>

            {/* Right — a real readiness report as proof */}
            <div className="animate-fade-up stagger-2 lg:col-span-6">
              <ScreenshotFrame
                src="/screenshots/agent-readiness/readiness-scores.png"
                alt="Agent Readiness report showing an overall 0–100 score and letter grade, a breakdown of blockers, critical issues, quick wins and passing checks, and a 'How AI agents experience your site' view scoring product discovery, navigation, task completion and form handling."
                width={3270}
                height={938}
                priority
                caption="A real readiness report: one overall score and grade, a blockers / critical / quick-wins / passing breakdown, and how well an agent can do each job on your site."
              />
            </div>
          </div>
        </div>
      </section>

      {/* The cost of being unreachable */}
      <PainScenarioSection
        eyebrow="The blind spot"
        scenario="Block GPTBot in a robots.txt rule someone added months ago, or ship a page whose content only appears after JavaScript runs, and AI engines simply can&apos;t read you — no citations, no recommendations, no AI referral traffic. There&apos;s no error to catch; you just never show up in the answer."
        bridge="Agent Readiness scans the whole access path — the live crawler-access matrix, the headless render, JS parity — so you find the blocks before they quietly cost you citations."
      />

      {/* How it works (HowTo schema source) */}
      <HowItWorks3Step heading="From root URL to readiness report in three steps" steps={steps} />

      {/* The 28 checks — 3 layers */}
      <section id="layers" className="scroll-mt-20 border-t border-[var(--surface-steel-border)] bg-[var(--surface-steel)] px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">What we check</p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
              Reach, render, and read.
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-gray-600">
              An agent has to get past your robots and firewall, render the page without a real browser, and pull meaning out of it. Every signal is scored with a confidence label — and anything we can&apos;t verify is marked, never counted against you.
            </p>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-3">
            {layers.map((l, i) => (
              <div key={l.tag} className="relative pl-12">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 font-mono text-[22px] font-bold leading-none tabular-nums text-accent-500"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">{l.tag}</span>
                  <span className="font-mono text-[10px] text-gray-500">{l.note}</span>
                </div>
                <h3 className="mt-2 text-lg font-semibold tracking-tight text-gray-900">{l.title}</h3>
                <ul className="mt-4 space-y-2.5 border-t border-[var(--surface-steel-border)] pt-4">
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

      {/* Agent-Readiness Levels — the ladder */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">Your level</p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
              One number, and the rung you&apos;re on.
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-gray-600">
              Alongside the 0–100 score, every scan places your site on a readiness level — L1 through L3 today, with L4 signals detected in the advanced panel — so you always know the next thing to fix.
            </p>
          </div>
          <ol className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {levels.map((l) => (
              <li key={l.n} className="relative border-t-2 border-accent-500 pt-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[22px] font-bold leading-none tabular-nums text-accent-600">L{l.n}</span>
                  <h3 className="text-lg font-semibold tracking-tight text-gray-900">{l.name}</h3>
                </div>
                {"note" in l && l.note ? (
                  <p className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-400">{l.note}</p>
                ) : null}
                <p className="mt-2 text-[14px] leading-relaxed text-gray-600">{l.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Act, don't just monitor — the exact fix */}
      <ActVsMonitorWedge
        body="Agent Readiness doesn't just score you. When an access or standards check fails, it comes with the source line (the robots.txt rule, the X-Robots-Tag header, the firewall rule) and the one-line fix."
        example="See ClaudeBot blocked? The report shows the exact robots.txt line doing it and what to change — so you unblock it and the next scan flips it to allowed."
        link={{ label: "Then grade the page itself with Content Analyzer", href: "/features/content-analyzer" }}
      />

      {/* Outcomes */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">What makes it different</p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
              The access path, not just the page.
            </h2>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {outcomes.map((o, i) => (
              <div key={o.tag} className="relative pl-12">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 font-mono text-[22px] font-bold leading-none tabular-nums text-accent-500"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
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
