import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { kit, Arrow } from "@/components/brand/dark-kit"
import { ToolsPage, ToolIndex, toolsKit as tk } from "@/components/tools/tool-page"
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
    <ToolsPage>
      {/* Hero + the tool */}
      <section className={`${tk.hero} ${kit.heroGlow}`}>
        <JsonLd
          data={[
            softwareApplicationSchema({
              // Must match the page title, the breadcrumb below, and the name in
              // lib/tools.ts. This node told engines the product was called
              // "AI Crawler Access Checker" while every human-visible surface said
              // "AI Crawler Checker" — a second name for one product is exactly the
              // kind of thing that splits an entity in an AI engine's index.
              name: "AI Crawler Checker",
              description:
                "A free server-side tool that checks any domain's robots.txt against 34 AI crawler user-agents and reports which are allowed or blocked for the homepage, with the exact blocking rule.",
              url: `${siteConfig.url}/tools/ai-crawler-checker`,
              // Deliberately NOT "robots.txt checker": /tools/robots-txt-tester owns that
              // term now, and this tool's job is the 34-crawler batch audit, not
              // single-URL rule resolution. Keeps the two out of each other's way.
              applicationSubCategory: "AI crawler access checker",
            }),
            howToSchema({
              name: "How to check which AI crawlers your site allows",
              steps: steps.map((s) => ({ name: s.title, text: s.body })),
            }),
          ]}
        />

        <div className={kit.wrap}>
          <Breadcrumbs
            tone="dark"
            trail={[
              { name: "Home", href: "/" },
              { name: "Tools", href: "/tools" },
              { name: "AI Crawler Checker", href: "" },
            ]}
          />
          <div className={tk.heroHead}>
            <p className={tk.heroLabel}>
              Free AI crawler tool
            </p>
            <h1 className={tk.heroTitle}>
              Can AI crawlers reach your site?
            </h1>
            <div className={tk.heroRule} aria-hidden="true" />
            <p className={tk.heroLead}>
              Paste a domain and see which of 34 AI crawlers your robots.txt allows or blocks. GPTBot, ClaudeBot,
              PerplexityBot, Google-Extended and the rest, each with the exact Disallow line doing the blocking.
              Server-side, so it works where browser checkers fail. Free, no sign-up.
            </p>
          </div>

          <div className={`${tk.heroTool} ${tk.mount}`}>
            <AiCrawlerCheckerWidget />
          </div>
        </div>
      </section>

      {/* Honest evidence panel — the credibility wedge */}
      <section className={`${kit.section} ${kit.sectionBorder}`}>
        <div className={`${kit.wrap} ${tk.split}`}>
          <div className={tk.splitHead}>
            <ToolIndex>Straight answer</ToolIndex>
            <h2 className={tk.title2}>
              What this checks, and what it can&apos;t.
            </h2>
          </div>
          <div className={tk.prose}>
            <div className={tk.stack}>
              <p>
                <strong>It checks permission, not visibility.</strong>{" "}robots.txt tells crawlers what
                they may fetch. Allowing GPTBot or ClaudeBot does not mean ChatGPT or Claude will cite you; that depends on
                your content and each engine&apos;s own ranking, which no robots file controls. Anyone selling &quot;unblock
                the bots and get cited&quot; is overstating it.
              </p>
              <p>
                <strong>But the opposite failure is real and common.</strong> Plenty of sites block the
                exact AI crawlers they want to reach them, often by an old <code>Disallow: /</code> rule
                or a CMS default. This catches that in one paste, and shows the precise line to change.
              </p>
              <p>
                <strong>And robots.txt isn&apos;t the whole story.</strong> A bot that robots.txt allows
                can still be blocked by a WAF or Cloudflare, and some bots ignore robots.txt entirely. We flag those caveats
                honestly, and our Agent Readiness scan verifies what crawlers actually receive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works (HowTo schema source) */}
      <HowItWorks3Step heading="From a domain to a crawler-access report in three steps" steps={steps} />

      {/* Short explainer */}
      <section className={`${kit.section} ${kit.sectionBorder} ${kit.band}`}>
        <div className={`${kit.wrap} ${tk.split}`}>
          <div className={tk.splitHead}>
            <ToolIndex>The crawlers, briefly</ToolIndex>
            <h2 className={tk.title2}>
              Not all AI crawlers do the same job
            </h2>
          </div>
          <div className={tk.prose}>
            <p>
              We group the 34 crawlers by purpose so a block is a deliberate choice, not an accident.
              <strong> AI-search bots</strong> (like OAI-SearchBot and PerplexityBot) feed live AI answers and citations.
              <strong> Training bots</strong> (like GPTBot and Google-Extended) collect data to train models, and some sites block
              these on purpose. <strong>User-prompted fetchers</strong> (like ChatGPT-User and Claude-User) retrieve a page only
              when a person asks about it. Blocking the wrong group can quietly remove you from AI answers while doing nothing for
              the privacy goal you actually had.
            </p>
            <p>
              For the bigger picture on getting found by AI, read our guide:{" "}
              <Link href="/blog/what-is-geo">
                what generative engine optimization actually is
              </Link>.
            </p>
          </div>
        </div>
      </section>

      <FeatureFaq items={faqs} heading="AI crawlers, answered honestly" />

      {/* Funnel CTA → Agent Readiness */}
      <section className={tk.close}>
        <div className={kit.wrap}>
          <div className={tk.closeCard}>
            <div>
              <h2 className={tk.closeTitle}>
                robots.txt is permission. Agent Readiness checks what crawlers actually receive.
              </h2>
              <p className={tk.closeBody}>
                Live-fetch your site as six AI crawlers, render it like a headless agent, and see what&apos;s really
                blocking you: WAF rules, 403s, JavaScript walls. Free.
              </p>
            </div>
            <Link
              href="/features/agent-readiness?ref=ai-crawler-checker"
              prefetch={false}
              className={kit.btnLime}
            >
              Run a free Agent Readiness scan
              <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </ToolsPage>
  )
}
