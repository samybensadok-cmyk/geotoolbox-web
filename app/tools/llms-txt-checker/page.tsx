import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { HowItWorks3Step, type Step } from "@/components/features/how-it-works"
import { FeatureFaq } from "@/components/features/feature-faq"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { softwareApplicationSchema, howToSchema } from "@/lib/seo-schema"
import { LlmsTxtCheckerWidget } from "@/components/tools/llms-txt-checker-widget"
import { LlmsTxtGenerator } from "@/components/tools/llms-txt-generator"

export const metadata: Metadata = {
  title: "Free llms.txt Checker, Validator & Generator",
  description:
    "Validate any site's llms.txt against the spec — server-side, with every linked URL resolved, a transparent 0-100 score, and copy-paste fixes. Plus a free generator. Honest about what llms.txt does and doesn't do.",
  openGraph: {
    title: "Free llms.txt Checker, Validator & Generator",
    description:
      "Validate any llms.txt against the spec, resolve every link, score it, and generate a clean one — free. Honest about what llms.txt actually does.",
  },
  alternates: { canonical: `${siteConfig.url}/tools/llms-txt-checker` },
}

const steps: Step[] = [
  {
    verb: "Give",
    title: "A domain or URL",
    body: "Enter any site. We look for /llms.txt at its root and fetch it server-side — so it works even on sites that block browser requests.",
  },
  {
    verb: "Validate",
    title: "Spec, links, and robots",
    body: "We parse the file against the llms.txt spec, resolve every linked URL to confirm it actually loads, and cross-check robots.txt.",
  },
  {
    verb: "Fix",
    title: "A score and the exact fixes",
    body: "You get spec validity, a 0-100 quality score with a published rubric, and a copy-paste fix for every issue we find.",
  },
]

const faqs = [
  {
    question: "Does llms.txt actually help my site get cited by AI?",
    answer:
      "There's no evidence that it does. Google has said llms.txt is not used for Search or AI Overviews, and no major AI provider — OpenAI, Anthropic, or Google — confirms using it as a citation or ranking signal. Google's John Mueller put it plainly: \"no AI system currently uses llms.txt.\" Treat it as low-cost technical hygiene — a clean, curated index for the agents that do read it (some IDE assistants and custom tools) — not as a visibility lever. This checker grades that hygiene honestly and never claims it lifts rankings.",
  },
  {
    question: "Is the summary blockquote required?",
    answer:
      "No. Per the official spec, the only required element is the H1 (your site name). The \"> summary\" line, the sections, and llms-full.txt are all optional. Some validators wrongly fail a file for a missing blockquote — ours flags it as a minor suggestion, not an error, because Stripe's and Anthropic's own llms.txt files don't have one.",
  },
  {
    question: "How is llms.txt different from robots.txt?",
    answer:
      "They do opposite jobs. robots.txt tells crawlers what they may not access. llms.txt is an optional, curated index that points agents toward your most useful content. A good setup makes sure robots.txt doesn't accidentally block the llms.txt or the pages it links — which this checker verifies.",
  },
  {
    question: "What does the 0-100 quality score measure?",
    answer:
      "Implementation quality, not AI visibility. It is a transparent, published rubric: core validity (30), link health — how many linked URLs actually resolve (30), summary and sections (15), curation and size (15), and companion files and polish (10). Any spec error caps the score at 40. A missing file scores N/A, not zero. We show the full breakdown so the number is never a black box.",
  },
  {
    question: "Where do I put the file, and what should it contain?",
    answer:
      "At your site root, served as plain text: https://yourdomain.com/llms.txt. Inside: one H1 with your site name, an optional one-line summary, then \"## Section\" headers listing curated links in the form - [Page](https://url): note. Keep it a lean, curated index — not a dump of every URL. Our generator builds a spec-correct file for you.",
  },
  {
    question: "Is it free?",
    answer:
      "Yes — single-URL checks and the generator are completely free and need no sign-up. There's no LLM or paid API behind a basic check, so there's nothing to meter.",
  },
]

export default function LlmsTxtCheckerPage() {
  return (
    <>
      {/* Hero + the tool */}
      <section className="relative overflow-hidden bg-[var(--surface-steel)] px-6 pt-16 pb-16 sm:pt-20 sm:pb-20">
        <JsonLd
          data={[
            softwareApplicationSchema({
              name: "llms.txt Checker & Validator",
              description:
                "A free server-side llms.txt validator: checks a site's /llms.txt against the spec, resolves every linked URL, scores implementation quality 0-100, and generates a spec-correct file.",
              url: `${siteConfig.url}/tools/llms-txt-checker`,
              applicationSubCategory: "llms.txt validator and generator",
            }),
            howToSchema({
              name: "How to check and validate an llms.txt file",
              steps: steps.map((s) => ({ name: s.title, text: s.body })),
            }),
          ]}
        />

        <div className="mx-auto max-w-5xl">
          <Breadcrumbs
            trail={[
              { name: "Home", href: "/" },
              { name: "Tools", href: "/tools" },
              { name: "llms.txt Checker", href: "" },
            ]}
          />
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
              Free llms.txt tool
            </p>
            <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
              Free llms.txt Checker, Validator &amp; Generator
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
              Validate any site&apos;s llms.txt against the spec — every linked URL resolved, scored, and explained —
              then generate a clean one. Server-side, so it works where browser-based checkers fail. Free, no sign-up.
            </p>
          </div>

          <div className="mt-10">
            <LlmsTxtCheckerWidget />
          </div>
        </div>
      </section>

      {/* Honest evidence panel — the credibility wedge */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">Straight answer</p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            What llms.txt actually does — and what it doesn&apos;t.
          </h2>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-gray-700">
            <p>
              <strong className="text-gray-900">It is not a ranking or citation signal.</strong> Google has stated llms.txt
              is not used for Search or AI Overviews, and no major AI provider confirms using it. Google&apos;s John Mueller:
              <em> &ldquo;no AI system currently uses llms.txt.&rdquo;</em> Anyone selling it as a ranking or citation shortcut is guessing.
            </p>
            <p>
              <strong className="text-gray-900">It is a recognized convention.</strong> Google&apos;s Chrome Lighthouse (v13.3)
              added an &ldquo;Agentic browsing&rdquo; audit that checks your llms.txt loads without a server error. Some IDE
              assistants and custom agents read it when pointed at your docs.
            </p>
            <p>
              <strong className="text-gray-900">So treat it as cheap hygiene, not a growth lever.</strong> A clean, curated
              llms.txt with working links costs little and can&apos;t hurt. This checker grades exactly that — technical hygiene —
              and is built to never overstate the payoff.
            </p>
          </div>
        </div>
      </section>

      {/* How it works (HowTo schema source) */}
      <HowItWorks3Step heading="From a URL to a scored report in three steps" steps={steps} />

      {/* What goes in an llms.txt — short explainer, links out to the article */}
      <section className="border-t border-gray-100 bg-gray-50 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">The format, briefly</p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            What goes in an llms.txt file
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
            It&apos;s a plain-markdown file at your site root. The spec is small: <strong>one H1</strong> with your site name
            (the only required part), an optional <code className="rounded bg-gray-200 px-1 text-gray-700">&gt; summary</code> line,
            then <code className="rounded bg-gray-200 px-1 text-gray-700">## Section</code> headers listing curated links as
            <code className="rounded bg-gray-200 px-1 text-gray-700"> - [Page](https://url): note</code> — pointing to the pages
            most useful to an LLM. A companion <code className="rounded bg-gray-200 px-1 text-gray-700">/llms-full.txt</code> can
            hold the full text. Keep it a lean index, not a sitemap dump.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
            For the full background — adoption data, real examples, and whether it&apos;s worth your time — read our guide:{" "}
            <Link href="/blog/llms-txt" className="font-semibold text-accent-700 underline-offset-2 hover:underline">
              llms.txt: what it is and whether it&apos;s actually worth it
            </Link>.
          </p>
        </div>
      </section>

      {/* Generator */}
      <section id="generator" className="scroll-mt-20 border-t border-gray-100 bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">Generator</p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
              Generate a spec-correct llms.txt
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-gray-600">
              Name your site, add a summary, and list your key sections and links. It builds a valid file you can copy or
              download — then check it above. No crawl, no AI, nothing metered.
            </p>
          </div>
          <div className="mt-10">
            <LlmsTxtGenerator />
          </div>
        </div>
      </section>

      <FeatureFaq items={faqs} heading="llms.txt, answered honestly" />

      {/* Funnel CTA → Agent Readiness */}
      <section className="bg-gray-950 px-6 py-20 sm:py-24">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              llms.txt is one optional file. Can AI agents reach the rest of your site?
            </h2>
            <p className="mt-2 max-w-xl text-base text-gray-300">
              Agent Readiness scans any URL across 34 AI crawlers, renders the page like a headless agent, and shows what&apos;s
              actually blocking you. Free.
            </p>
          </div>
          <Link
            href="/features/agent-readiness?utm_source=llms-checker"
            prefetch={false}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 active:translate-y-[1px]"
          >
            Run an Agent Readiness scan
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  )
}
