import type { Metadata } from "next"
import Link from "next/link"

import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { FeatureFaq } from "@/components/features/feature-faq"
import { HowItWorks3Step, type Step } from "@/components/features/how-it-works"
import { ScoreLegend } from "@/components/features/score-legend"
import { JsonLd } from "@/components/seo/json-ld"
import { AgentReadinessScannerWidget } from "@/components/tools/agent-readiness-scanner-widget"
import { siteConfig } from "@/lib/config"
import { howToSchema, softwareApplicationSchema } from "@/lib/seo-schema"

/**
 * Public Agent Readiness Scanner. This is the FULL v2 scan, the same engine the
 * paid product runs, exposed with no sign-up as a link magnet. Indexable on
 * purpose (unlike the gated /scan surface).
 *
 * Static prose never hard-codes the number of checks: the rubric's scored count
 * ships from the backend and the widget renders it from `scored_check_count`.
 */

export const metadata: Metadata = {
  title: "Agent Readiness Scanner: Free Full AI Readiness Scan",
  description:
    "Run the full Agent Readiness scan on any domain, free and with no sign-up. Live-fetches your site as AI crawlers, renders it like a headless agent, and returns a 0-100 score plus your agent readiness level.",
  openGraph: {
    title: "Agent Readiness Scanner: The Full Scan, Free",
    description:
      "The complete Agent Readiness scan: live crawler probes, headless render, structured data, and a Level 0 to 4 verdict on how ready your site is for AI agents.",
  },
  alternates: { canonical: `${siteConfig.url}/tools/agent-readiness-scanner` },
}

const steps: Step[] = [
  {
    verb: "Enter",
    title: "Any domain",
    body: "One URL, no account. Everything runs server-side, so it works on sites that block browser-originated requests.",
  },
  {
    verb: "Probe",
    title: "Your site, as the agents see it",
    body: "We fetch your page as six AI crawler user agents, render it in a real browser, read robots against 34 known AI bots, and parse your schema, feeds and markdown surfaces.",
  },
  {
    verb: "Read",
    title: "A level, a score, and the three things to fix",
    body: "An agent readiness level from 0 to 4, a 0-100 score across five pillars, and the highest-weight failures with the exact fix for each.",
  },
]

const faqs = [
  {
    question: "What do the readiness levels 0 to 4 actually mean?",
    answer:
      "They are a ladder, not a rating. Level 0 means AI crawlers cannot reach your site at all, usually a robots block or a WAF returning 403 to non-browser user agents. Level 1 means they can fetch it. Level 2 means the content survives the fetch, so a non-JavaScript crawler still gets real text. Level 3, Agent-Readable, means the content is also structured well enough for an agent to extract and quote it accurately. Level 4, Agent-Operable, means you expose live capability surfaces an agent can call, such as an MCP server or a documented API. Most good sites land at Level 3, and this scan does not assess Level 4 surfaces yet, so it tells you when it has stopped short instead of guessing.",
  },
  {
    question: "How is this different from your 5-check AI-Readiness Score?",
    answer:
      "The AI-Readiness Score is a deliberately small, instant check: five foundational signals read from a single request. This scanner runs every scored check in our Agent Readiness rubric, which is why it takes 30 to 90 seconds instead of a few. The extra time buys live crawler probes from our server, a real browser render, entity and schema analysis, and the agent-surface detection that a robots.txt reading cannot give you. Both are free. Use the small one to sanity-check a domain in seconds, this one when you want the real report.",
  },
  {
    question: "Does a high score mean AI will cite me?",
    answer:
      "No, and we will not dress it up. Nothing a robots file, a sitemap or a schema block controls can earn you a citation. What a bad score does is silently cost you every citation you would otherwise have earned, because the engine never got readable content in the first place. That asymmetry is the whole point: this scan rules out the self-inflicted failure so you know the rest is a content and authority problem, not a plumbing one.",
  },
  {
    question: "Why does the scan take up to 90 seconds?",
    answer:
      "Because it is doing real work rather than reading one file. It sends separate live requests as each AI crawler user agent, waits for a headless browser to load and paint your page, follows your sitemap and feed, and fetches the agent-surface paths. Every one of those is a network round trip against your server, at your server's speed. The crawler access result appears first, while the deep scan is still running, so you are not staring at a blank screen.",
  },
  {
    question: "Are there limits on how often I can run it?",
    answer:
      "Yes. Scans are rate limited per IP, a burst per hour and a cap per day, so one visitor cannot monopolise the scanner or point it at someone else's site repeatedly. If you hit the limit the tool tells you how long to wait and keeps your URL in the box. It never silently retries in the background, because that is how a rate limit turns into a longer one.",
  },
  {
    question: "Is it free, and what happens to my results?",
    answer:
      "Free, with no sign-up and no email wall. The scan is the same engine our paid product runs, so there is no watered-down public version. Results are shown to you in the browser; we keep aggregate scan telemetry to improve the rubric, and nothing about your site is published unless you deliberately create a share link elsewhere in the product.",
  },
]

export default function AgentReadinessScannerPage() {
  return (
    <>
      {/* Hero + the tool */}
      <section className="relative overflow-hidden bg-[var(--surface-steel)] px-6 pt-16 pb-16 sm:pt-20 sm:pb-20">
        <JsonLd
          data={[
            softwareApplicationSchema({
              name: "Agent Readiness Scanner",
              description:
                "A free server-side scanner that runs the full Agent Readiness rubric on any domain: live AI-crawler probes, a headless browser render, robots checked against 34 AI bots, structured data and agent-surface detection, returning a 0-100 score and an agent readiness level from 0 to 4.",
              url: `${siteConfig.url}/tools/agent-readiness-scanner`,
              applicationSubCategory: "Agent readiness and AI crawler scanner",
            }),
            howToSchema({
              name: "How to scan a site for AI agent readiness",
              steps: steps.map((s) => ({ name: s.title, text: s.body })),
            }),
          ]}
        />

        <div className="mx-auto max-w-5xl">
          <Breadcrumbs
            trail={[
              { name: "Home", href: "/" },
              { name: "Tools", href: "/tools" },
              { name: "Agent Readiness Scanner", href: "" },
            ]}
          />
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
              Free full scan · no sign-up
            </p>
            <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
              Agent Readiness Scanner
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
              The full scan, not a teaser. We fetch your site as six AI crawlers, render it in a real browser, check robots
              against 34 known AI bots, and score every scored check in our Agent Readiness rubric. You get a 0-100 score, the
              five pillar breakdown, and where you sit on the Level 0 to 4 agent readiness ladder.
            </p>
          </div>

          <div className="mt-10">
            <AgentReadinessScannerWidget />
          </div>

          <div className="mx-auto mt-10 max-w-3xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-400">How to read the score</p>
            <div className="mt-3">
              <ScoreLegend variant="0-100" />
            </div>
          </div>
        </div>
      </section>

      {/* Honest evidence panel */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">Straight answer</p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            What the scan proves, and what it cannot.
          </h2>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-gray-700">
            <p>
              <strong className="text-gray-900">It proves readability, not popularity.</strong> Every check answers one
              question: can an AI agent reach, load, parse and quote this page. Pass them all and you have removed the
              self-inflicted failures. You have not bought a mention.
            </p>
            <p>
              <strong className="text-gray-900">The probes are real requests.</strong> We do not infer crawler access from your
              robots file alone. We send live fetches with each bot user agent, which is how a WAF rule or a 403 that robots.txt
              knows nothing about gets caught.
            </p>
            <p>
              <strong className="text-gray-900">It is the same engine we sell.</strong> There is no cut-down public rubric. When
              the scan cannot verify enough of a site it says so and refuses to publish a score, rather than printing a zero and
              calling it a grade.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <HowItWorks3Step heading="From a domain to an agent readiness verdict" steps={steps} />

      {/* Related free tools */}
      <section className="border-t border-gray-100 bg-gray-50 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">Narrower free tools</p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            Want one layer instead of the whole report?
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
            The{" "}
            <Link href="/tools/ai-crawler-checker" className="font-semibold text-accent-700 underline-offset-2 hover:underline">
              AI Crawler Checker
            </Link>{" "}
            shows which of 34 AI crawlers your robots.txt blocks, line by line, in seconds. The{" "}
            <Link href="/tools/llms-txt-checker" className="font-semibold text-accent-700 underline-offset-2 hover:underline">
              llms.txt Checker
            </Link>{" "}
            validates and scores an existing llms.txt against the spec. The{" "}
            <Link href="/tools/ai-readiness" className="font-semibold text-accent-700 underline-offset-2 hover:underline">
              AI-Readiness Score
            </Link>{" "}
            is the instant five-check version of this page, useful when you want a number in a couple of seconds rather than a
            minute. All free, all server-side.
          </p>
        </div>
      </section>

      <FeatureFaq items={faqs} heading="The scanner, answered honestly" />

      {/* Campaign CTA */}
      <section className="bg-gray-950 px-6 py-20 sm:py-24">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-8 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              Readable is the floor. Cited is the goal.
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-gray-300">
              This scan tells you whether AI can read you. It cannot tell you what ChatGPT, Perplexity, Gemini, Claude, AI
              Overviews and Bing say when a buyer asks about your category. That takes running the prompts and reading the
              answers.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3">
            <Link
              href="/services/ai-seo-agency?utm_source=agent-readiness-scanner"
              prefetch={false}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 active:translate-y-[1px]"
            >
              Get your AI Visibility Snapshot
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/app/"
              prefetch={false}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-700 px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:border-gray-500"
            >
              Try the tracker free
            </Link>
            <p className="text-center text-[12px] text-gray-400">
              Your prompts, tracked across the major AI engines · 7-day free trial on Starter and Growth
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
