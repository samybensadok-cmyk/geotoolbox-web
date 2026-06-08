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
  title: "Free AI Crawler Checker — Can GPTBot, ClaudeBot & 32 More Reach You?",
  description:
    "Paste any domain and see which of 34 AI crawlers — GPTBot, ClaudeBot, PerplexityBot, Googlebot and more — your robots.txt allows or blocks, with the exact line to fix. Server-side, free, no sign-up. Honest about what it does and doesn't prove.",
  openGraph: {
    title: "Free AI Crawler Checker — Can GPTBot, ClaudeBot & 32 More Reach You?",
    description:
      "See which of 34 AI crawlers your robots.txt allows or blocks, with the exact blocking line. Free, server-side, honest about what it proves.",
  },
  alternates: { canonical: `${siteConfig.url}/tools/ai-crawler-checker` },
}

const steps: Step[] = [
  {
    verb: "Give",
    title: "A domain or URL",
    body: "Enter any site. We fetch its /robots.txt server-side — so it works even on sites that block browser requests.",
  },
  {
    verb: "Evaluate",
    title: "34 AI crawler rules",
    body: "We parse robots.txt against 34 known AI crawler user-agents — OpenAI, Anthropic, Google, Perplexity, Meta and more — for the homepage path.",
  },
  {
    verb: "Fix",
    title: "The exact blocking line",
    body: "You see every allowed and blocked crawler, grouped by purpose, and the precise Disallow line and number to change for each block.",
  },
]

const faqs = [
  {
    question: "Does allowing AI crawlers help my site get cited by ChatGPT or Perplexity?",
    answer:
      "Not on its own. Allowing a crawler in robots.txt is permission to fetch your pages — nothing more. Whether an AI engine actually cites you depends on your content, your authority, and each engine's own ranking, none of which robots.txt controls. This tool checks reachability, not visibility, and never claims that unblocking a bot earns you citations. What it does prevent is the opposite failure: accidentally blocking the crawlers you want to reach you.",
  },
  {
    question: "What's the difference between this and a robots.txt tester?",
    answer:
      "A generic robots.txt tester checks one user-agent and one path at a time. This checks the homepage against all 34 AI-specific crawlers at once — GPTBot, ChatGPT-User, ClaudeBot, Google-Extended, PerplexityBot, Bytespider and the rest — and groups them by purpose (AI search, model training, user-prompted fetches). It's built for the question \"can AI systems reach me?\", not \"is this one URL crawlable?\".",
  },
  {
    question: "Which AI crawlers does it check?",
    answer:
      "34 documented AI crawler user-agents from OpenAI, Anthropic, Google, Perplexity, Meta, Apple, Microsoft, Amazon, ByteDance, Common Crawl, Cohere, Mistral, xAI and others. The list is maintained against official provider docs and the ai.robots.txt project. A few bots (for example Bytespider) are known to ignore robots.txt — we flag those, because for them an \"allowed\" verdict isn't a guarantee they'll respect a block.",
  },
  {
    question: "Why does my robots.txt allow a bot that still can't reach my site?",
    answer:
      "robots.txt only states a policy. A WAF, Cloudflare bot-fight mode, rate limiting, or a 403 can still block a crawler that robots.txt permits — and some bots ignore robots.txt altogether. That gap between \"permitted\" and \"actually served\" is exactly what our Agent Readiness scan measures by live-fetching your site as each crawler. This free checker covers the robots.txt layer only.",
  },
  {
    question: "Should I block AI crawlers?",
    answer:
      "It depends on your goals, and this tool doesn't push you either way. If you want visibility in AI answers, blocking the crawlers that feed them is usually counterproductive. If you're protecting proprietary content from model training, you may deliberately block training bots (like Google-Extended or GPTBot) while allowing AI-search bots (like OAI-SearchBot). Grouping crawlers by purpose helps you make that call deliberately rather than by accident.",
  },
  {
    question: "Is it free?",
    answer:
      "Yes — single-domain checks are completely free and need no sign-up. There's no LLM or paid API behind a check, so there's nothing to meter.",
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
              Paste a domain and see which of 34 AI crawlers — GPTBot, ClaudeBot, PerplexityBot, Googlebot and more — your
              robots.txt allows or blocks, with the exact line to fix. Server-side, so it works where browser checkers fail.
              Free, no sign-up.
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
            What this checks — and what it can&apos;t.
          </h2>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-gray-700">
            <p>
              <strong className="text-gray-900">It checks permission, not visibility.</strong> robots.txt tells crawlers what
              they may fetch. Allowing GPTBot or ClaudeBot doesn&apos;t mean ChatGPT or Claude will cite you — that depends on
              your content and each engine&apos;s own ranking, which no robots file controls. Anyone selling &ldquo;unblock
              the bots and get cited&rdquo; is overstating it.
            </p>
            <p>
              <strong className="text-gray-900">But the opposite failure is real and common.</strong> Plenty of sites block the
              exact AI crawlers they want to reach them — often by an old <code className="rounded bg-gray-200 px-1 text-gray-700">Disallow: /</code> rule
              or a CMS default. This catches that in one paste, and shows the precise line to change.
            </p>
            <p>
              <strong className="text-gray-900">And robots.txt isn&apos;t the whole story.</strong> A bot that robots.txt allows
              can still be blocked by a WAF or Cloudflare, and some bots ignore robots.txt entirely. We flag those caveats
              honestly — and our Agent Readiness scan verifies what crawlers actually receive.
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
            <strong> Training bots</strong> (like GPTBot and Google-Extended) collect data to train models — some sites block
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
              blocking you — WAF rules, 403s, JavaScript walls. Free.
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
