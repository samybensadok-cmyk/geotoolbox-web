import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { HowItWorks3Step, type Step } from "@/components/features/how-it-works"
import { FeatureFaq } from "@/components/features/feature-faq"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { softwareApplicationSchema, howToSchema } from "@/lib/seo-schema"
import { AiReadinessWidget } from "@/components/tools/ai-readiness-widget"

export const metadata: Metadata = {
  title: "Free AI-Readiness Score — Is Your Site Ready for AI Agents?",
  description:
    "Score any domain on the foundations AI agents need: robots.txt, AI-crawler access, content signals, sitemap and markdown negotiation. 5 free checks from our 28-point Agent Readiness rubric. Server-side, free, honest about what it proves.",
  openGraph: {
    title: "Free AI-Readiness Score — Is Your Site Ready for AI Agents?",
    description:
      "Score your site on 5 of 28 AI-readiness checks — robots, crawler access, content signals, sitemap, markdown. Free, server-side, honest.",
  },
  alternates: { canonical: `${siteConfig.url}/tools/ai-readiness` },
}

const steps: Step[] = [
  {
    verb: "Give",
    title: "A domain or URL",
    body: "Enter any site. We fetch its robots.txt and sitemap server-side — so it works even on sites that block browser requests.",
  },
  {
    verb: "Score",
    title: "5 foundational checks",
    body: "We score robots.txt validity, AI-crawler access, content signals, sitemap, and markdown negotiation — a fixed subset of our 28-check Agent Readiness rubric.",
  },
  {
    verb: "Fix",
    title: "A score + what's holding you back",
    body: "You get a clear score, a per-check breakdown with the evidence, and a path to the other 23 checks in the full scan.",
  },
]

const faqs = [
  {
    question: "Does a high AI-Readiness score mean AI will cite me?",
    answer:
      "No, and we won't pretend otherwise. This score measures infrastructure — whether AI agents can reach, crawl, and parse your site. That's table stakes: if you fail these, you can be invisible to AI by accident. But actually getting cited depends on your content, authority, and each engine's ranking — none of which a robots.txt or sitemap controls. Think of this as fixing the plumbing, not buying visibility.",
  },
  {
    question: "What are the 5 free checks?",
    answer:
      "robots.txt valid format, AI bot discoverability (whether your robots.txt blocks AI crawlers), Content-Signal directive, sitemap present + valid XML, and markdown content negotiation. They're a fixed subset of the 28 checks our full Agent Readiness scan runs, chosen because they're the foundational ones we can verify safely and instantly from a single URL.",
  },
  {
    question: "Why only 5 of 28 checks?",
    answer:
      "The other 23 need things a single public request can't do: live-fetching your pages as 34 different AI crawlers, rendering JavaScript like a headless agent, and inspecting structured data, MCP endpoints, commerce feeds, and visual layout. Those run in the full Agent Readiness scan. The 5 here are the foundations — get them right first, because they gate everything else.",
  },
  {
    question: "How is the score calculated?",
    answer:
      "Your headline score is the three core foundations — robots.txt validity, AI-crawler access, and a valid sitemap (30 points). Each is scored exactly the way the full Agent Readiness scan scores it, so your free result is a genuine partial, not a different number. Two further checks — the Content-Signal directive and markdown content negotiation — are shown separately as emerging signals: almost no site implements them yet, so we don't let them drag your score down, but adopting them is cheap future-proofing. We show the points and evidence for every check, core and emerging, so nothing is a black box.",
  },
  {
    question: "Is it free?",
    answer:
      "Yes — single-domain scores are completely free and need no sign-up. There's no LLM or paid API behind a check, so there's nothing to meter.",
  },
]

export default function AiReadinessPage() {
  return (
    <>
      {/* Hero + the tool */}
      <section className="relative overflow-hidden bg-[var(--surface-steel)] px-6 pt-16 pb-16 sm:pt-20 sm:pb-20">
        <JsonLd
          data={[
            softwareApplicationSchema({
              name: "AI-Readiness Score",
              description:
                "A free server-side tool that scores any domain on 5 foundational AI-readiness checks (robots.txt, AI-crawler access, content signals, sitemap, markdown negotiation) — a subset of a 28-check Agent Readiness rubric.",
              url: `${siteConfig.url}/tools/ai-readiness`,
              applicationSubCategory: "AI readiness and agent-readiness checker",
            }),
            howToSchema({
              name: "How to check if your site is ready for AI agents",
              steps: steps.map((s) => ({ name: s.title, text: s.body })),
            }),
          ]}
        />

        <div className="mx-auto max-w-5xl">
          <Breadcrumbs
            trail={[
              { name: "Home", href: "/" },
              { name: "Tools", href: "/tools" },
              { name: "AI-Readiness Score", href: "" },
            ]}
          />
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">Free AI-readiness tool</p>
            <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
              Is your site ready for AI agents?
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
              Score any domain on the foundations AI agents need — robots, crawler access, content signals, sitemap, markdown.
              5 free checks from our 28-point readiness rubric. Server-side, no sign-up.
            </p>
          </div>

          <div className="mt-10">
            <AiReadinessWidget />
          </div>
        </div>
      </section>

      {/* Honest evidence panel */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">Straight answer</p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            What this score measures — and what it doesn&apos;t.
          </h2>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-gray-700">
            <p>
              <strong className="text-gray-900">It measures infrastructure, not visibility.</strong> Whether AI agents can
              reach, crawl, and parse your site. Fail these and you can be invisible to AI by accident — but passing them is
              the floor, not a guarantee of citations. Anyone selling a &ldquo;readiness score&rdquo; as a ranking shortcut is overstating it.
            </p>
            <p>
              <strong className="text-gray-900">It&apos;s an honest partial.</strong> 5 of our 28 checks. We show you exactly
              which 5, score them the same way the full scan does, and never dress the number up as the complete picture.
            </p>
            <p>
              <strong className="text-gray-900">It&apos;s the plumbing.</strong> Get these foundations right first — they gate
              the other 23 checks (rendering, structured data, MCP, commerce, visual) that the full Agent Readiness scan covers.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <HowItWorks3Step heading="From a domain to a readiness score in three steps" steps={steps} />

      {/* Related free tools */}
      <section className="border-t border-gray-100 bg-gray-50 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">Go deeper for free</p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            Two checks in this score have their own free tools
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
            Want the detail behind the score? The{" "}
            <Link href="/tools/ai-crawler-checker" className="font-semibold text-accent-700 underline-offset-2 hover:underline">AI Crawler Checker</Link>{" "}
            shows which of 34 AI crawlers your robots.txt blocks, line by line. The{" "}
            <Link href="/tools/llms-txt-checker" className="font-semibold text-accent-700 underline-offset-2 hover:underline">llms.txt Checker</Link>{" "}
            validates and scores your llms.txt. Both are free and server-side.
          </p>
        </div>
      </section>

      <FeatureFaq items={faqs} heading="AI-readiness, answered honestly" />

      {/* Funnel CTA */}
      <section className="bg-gray-950 px-6 py-20 sm:py-24">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              5 checks is the foundation. The full scan runs all 28.
            </h2>
            <p className="mt-2 max-w-xl text-base text-gray-300">
              Agent Readiness live-fetches your site as 34 AI crawlers, renders it like a headless agent, and adds structured
              data, MCP, commerce and visual checks. Free.
            </p>
          </div>
          <Link
            href="/features/agent-readiness?utm_source=ai-readiness"
            prefetch={false}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 active:translate-y-[1px]"
          >
            Run the full Agent Readiness scan
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  )
}
