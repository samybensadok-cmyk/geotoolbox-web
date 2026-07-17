import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { HowItWorks3Step, type Step } from "@/components/features/how-it-works"
import { FeatureFaq } from "@/components/features/feature-faq"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { softwareApplicationSchema, howToSchema } from "@/lib/seo-schema"
import { AiCrawlerCheckerWidget } from "@/components/tools/ai-crawler-checker-widget"

export const metadata: Metadata = {
  title: "AI Crawler Checker: Free robots.txt Test",
  description:
    "Check which of 34 AI crawlers your robots.txt allows or blocks, GPTBot to PerplexityBot, with the exact line to fix. Free, server-side, no sign-up.",
  openGraph: {
    title: "AI Crawler Checker: See Which AI Crawlers Reach You (Free)",
    description:
      "See which of 34 AI crawlers your robots.txt allows or blocks, with the exact blocking line. Free, server-side, honest about what it proves.",
  },
  alternates: { canonical: `${siteConfig.url}/tools/ai-crawler-checker` },
}

const steps: Step[] = [
  {
    verb: "Give",
    title: "A domain or URL",
    body: "Enter any site. We fetch its /robots.txt server-side, so the check works even on sites that reject browser requests.",
  },
  {
    verb: "Evaluate",
    title: "34 AI crawler rules",
    body: "We parse the file against 34 documented AI user-agents from OpenAI, Anthropic, Google, Perplexity, Meta, Apple, Microsoft, Amazon, ByteDance and others, for the homepage path.",
  },
  {
    verb: "Fix",
    title: "The exact blocking line",
    body: "Every crawler comes back allowed or blocked, grouped by purpose, with the precise Disallow line and line number to change. No detective work.",
  },
]

const faqs = [
  {
    question: "Does allowing AI crawlers get me cited by ChatGPT or Perplexity?",
    answer:
      "Not on its own. robots.txt access is permission to fetch, nothing more. Citation depends on content, authority, and each engine's own ranking. What allowing does prevent is the opposite failure: being invisible to AI because a stale rule blocks the crawlers you wanted. That failure is common, silent, and fixable in one line.",
  },
  {
    question: "Which AI crawlers does it check?",
    answer:
      "34 documented user-agents, maintained against official provider docs and the ai.robots.txt project: OpenAI (GPTBot, OAI-SearchBot, ChatGPT-User), Anthropic (ClaudeBot, Claude-User), Google (Google-Extended), Perplexity, Meta, Apple, Microsoft, Amazon, ByteDance, Common Crawl, Cohere, Mistral, xAI and more. Bots known to ignore robots.txt are flagged as such.",
  },
  {
    question: "Should I block AI crawlers?",
    answer:
      "Depends on your goals, and this tool won't push you either way. Want AI visibility? Blocking the bots that feed AI answers is counterproductive. Protecting proprietary content? Block the training bots and keep the AI-search bots. The grouping exists so you can split that decision instead of making it wholesale.",
  },
  {
    question: "What's the difference between this and a robots.txt tester?",
    answer:
      "A generic tester answers \"is this one URL crawlable by this one bot?\" This answers the question you actually have: can AI systems reach me at all, for every bot that matters, in one paste.",
  },
  {
    question: "Why does my robots.txt allow a bot that still can't reach my site?",
    answer:
      "robots.txt only states a policy. A WAF, Cloudflare bot-fight mode, rate limiting, or a 403 can still block a crawler that robots.txt permits, and some bots ignore robots.txt altogether. That gap between \"permitted\" and \"actually served\" is exactly what our Agent Readiness scan measures by live-fetching your site as each crawler. This free checker covers the robots.txt layer only.",
  },
  {
    question: "Is it free?",
    answer:
      "Yes. Single-domain checks are free with no sign-up. There's no LLM or paid API behind a check, so there's nothing for us to meter.",
  },
]

export default function AiCrawlerCheckerPage() {
  return (
    <>
      {/* Hero + the tool */}
      <section className="relative overflow-hidden bg-[var(--surface-steel)] px-6 pt-16 pb-16 sm:pt-20 sm:pb-20">
        <JsonLd
          data={[
            softwareApplicationSchema({
              name: "AI Crawler Access Checker",
              description:
                "A free server-side tool that checks any domain's robots.txt against 34 AI crawler user-agents and reports which are allowed or blocked for the homepage, with the exact blocking rule.",
              url: `${siteConfig.url}/tools/ai-crawler-checker`,
              applicationSubCategory: "AI crawler and robots.txt checker",
            }),
            howToSchema({
              name: "How to check which AI crawlers your site allows",
              steps: steps.map((s) => ({ name: s.title, text: s.body })),
            }),
          ]}
        />

        <div className="mx-auto max-w-5xl">
          <Breadcrumbs
            trail={[
              { name: "Home", href: "/" },
              { name: "Tools", href: "/tools" },
              { name: "AI Crawler Checker", href: "" },
            ]}
          />
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
              Free AI crawler tool
            </p>
            <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
              Can AI crawlers reach your site?
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
              Paste a domain and see which of 34 AI crawlers your robots.txt allows or blocks. GPTBot, ClaudeBot,
              PerplexityBot, Google-Extended and the rest, each with the exact Disallow line doing the blocking.
              Server-side, so it works where browser checkers fail. Free, no sign-up.
            </p>
          </div>

          <div className="mt-10">
            <AiCrawlerCheckerWidget />
          </div>
        </div>
      </section>

      {/* Honest evidence panel — the credibility wedge */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">Straight answer</p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            What this checks, and what it can&apos;t.
          </h2>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-gray-700">
            <p>
              <strong className="text-gray-900">It checks permission, not visibility.</strong> robots.txt tells crawlers what
              they may fetch. Allowing GPTBot or ClaudeBot does not mean ChatGPT or Claude will cite you; that depends on
              your content and each engine&apos;s own ranking, which no robots file controls. Anyone selling &quot;unblock
              the bots and get cited&quot; is overstating it.
            </p>
            <p>
              <strong className="text-gray-900">But the opposite failure is real and common.</strong> Plenty of sites block the
              exact AI crawlers they want to reach them, often by an old <code className="rounded bg-gray-200 px-1 text-gray-700">Disallow: /</code> rule
              or a CMS default. This catches that in one paste, and shows the precise line to change.
            </p>
            <p>
              <strong className="text-gray-900">And robots.txt isn&apos;t the whole story.</strong> A bot that robots.txt allows
              can still be blocked by a WAF or Cloudflare, and some bots ignore robots.txt entirely. We flag those caveats
              honestly, and our Agent Readiness scan verifies what crawlers actually receive.
            </p>
          </div>
        </div>
      </section>

      {/* How it works (HowTo schema source) */}
      <HowItWorks3Step heading="From a domain to a crawler-access report in three steps" steps={steps} />

      {/* Short explainer */}
      <section className="border-t border-gray-100 bg-gray-50 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">The crawlers, briefly</p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            Not all AI crawlers do the same job
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
            We group the 34 crawlers by purpose so a block is a deliberate choice, not an accident.
            <strong> AI-search bots</strong> (like OAI-SearchBot and PerplexityBot) feed live AI answers and citations.
            <strong> Training bots</strong> (like GPTBot and Google-Extended) collect data to train models, and some sites block
            these on purpose. <strong>User-prompted fetchers</strong> (like ChatGPT-User and Claude-User) retrieve a page only
            when a person asks about it. Blocking the wrong group can quietly remove you from AI answers while doing nothing for
            the privacy goal you actually had.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
            For the bigger picture on getting found by AI, read our guide:{" "}
            <Link href="/blog/what-is-geo" className="font-semibold text-accent-700 underline-offset-2 hover:underline">
              what generative engine optimization actually is
            </Link>.
          </p>
        </div>
      </section>

      <FeatureFaq items={faqs} heading="AI crawlers, answered honestly" />

      {/* Funnel CTA → Agent Readiness */}
      <section className="bg-gray-950 px-6 py-20 sm:py-24">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              robots.txt is permission. Agent Readiness checks what crawlers actually receive.
            </h2>
            <p className="mt-2 max-w-xl text-base text-gray-300">
              Live-fetch your site as each of 34 AI crawlers, render it like a headless agent, and see what&apos;s really
              blocking you: WAF rules, 403s, JavaScript walls. Free.
            </p>
          </div>
          <Link
            href="/features/agent-readiness?utm_source=ai-crawler-checker"
            prefetch={false}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 active:translate-y-[1px]"
          >
            Run a free Agent Readiness scan
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  )
}
