import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { RelatedFeatures } from "@/components/features/related-features"
import { FeatureFaq } from "@/components/features/feature-faq"
import { ScreenshotFrame } from "@/components/features/screenshot-frame"
import { PainScenarioSection } from "@/components/features/pain-scenario"
import { ScoreLegend } from "@/components/features/score-legend"
import { HowItWorks3Step, type Step } from "@/components/features/how-it-works"
import { ActVsMonitorWedge } from "@/components/features/act-vs-monitor"
import { SocialProofBlock } from "@/components/features/social-proof"
import { FeatureComparisonTable } from "@/components/features/feature-comparison-table"
import { DualCTA } from "@/components/features/dual-cta"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { softwareApplicationSchema, howToSchema } from "@/lib/seo-schema"

export const metadata: Metadata = {
  title: "AI Visibility Tool for AI Search",
  description:
    "See whether ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews, Bing Copilot, and Grok cite you — or your competitors. One prompt, seven engines, a 0–100 visibility score, in minutes.",
  openGraph: {
    title: "AI Visibility Tool for AI Search",
    description:
      "See whether the seven major AI engines cite you or your competitors. One prompt, seven engines, a 0–100 visibility score, in minutes.",
  },
  alternates: { canonical: `${siteConfig.url}/features/geo-scan` },
}

const steps: Step[] = [
  {
    verb: "Ask",
    title: "Enter a real query",
    body: "Type the keyword or question your customers would ask an AI — a short keyword or a natural question, both work.",
  },
  {
    verb: "Run",
    title: "Seven engines, in parallel",
    body: "GEO Scan queries ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews, Bing Copilot, and Grok with the same prompt, in your chosen market.",
  },
  {
    verb: "See",
    title: "Your full citation map",
    body: "Each engine's verbatim answer, whether your domain was cited, which competitors showed up instead, and a 0–100 visibility score you can defend to your CMO.",
  },
]

const comparisonRows = [
  { label: "AI engines per run", cells: ["1 at a time", "Varies", "7 in parallel"] },
  { label: "Cited vs. mentioned vs. recommended", cells: [false, "Partial", true] },
  { label: "Competitor citations in the same scan", cells: [false, true, "Up to 4 domains"] },
  { label: "Live search, not training data", cells: ["Sometimes", "Varies", true] },
  { label: "Routes the gap to a page-level fix", cells: [false, false, true] },
  { label: "Free export (CSV / PDF / XLSX)", cells: [false, "Varies", true] },
]

const outcomes = [
  {
    tag: "Live search",
    title: "You see what your customers see today",
    body: "Every engine is queried in real time with live web search — never a six-month-old answer the model memorized.",
  },
  {
    tag: "Competitor deltas",
    title: "Know the prompts a rival owns",
    body: "Add up to four competitor domains and see exactly which prompts they win — before it shows up in your traffic report.",
  },
  {
    tag: "8 markets, localized",
    title: "Catch a gap that's country-specific",
    body: "US, GB, AU, CA, IE, FR, ES, DE. Spot a citation gap in the UK that doesn't exist in the US.",
  },
  {
    tag: "History + trends",
    title: "See drift before it costs you",
    body: "Every scan is stored. Weekly score trend and per-engine trajectory feed Domain Overview, so you catch decline before it compounds into lost pipeline.",
  },
]

const faqs = [
  {
    question: "What AI engines does GEO Scan check?",
    answer:
      "Seven engines today: ChatGPT, Perplexity, Claude, Gemini, Google AI Overviews, Bing Copilot, and Grok. Every scan queries all seven in parallel, so you get the full picture in one pass.",
  },
  {
    question: "What's the difference between cited, mentioned, and recommended?",
    answer:
      "Cited means your domain is the linked source in the answer — the strongest signal. Recommended means you're named as a top pick. Mentioned means your brand appears without a link — your highest-leverage upgrade. Not found is the gap to close first. GEO Scan labels each engine so you know exactly where you stand.",
  },
  {
    question: "How does GEO Scan determine if my brand is cited?",
    answer:
      "We submit your keyword as a real user query, then parse each AI response for explicit domain mentions and direct citations. You get a per-engine status plus the verbatim snippet where your brand appears.",
  },
  {
    question: "Can I scan keywords for markets outside the US?",
    answer:
      "Yes. GEO Scan supports eight markets: United States, United Kingdom, Australia, Canada, Ireland, France, Spain, and Germany. Engines with native locale support query in-country; the others receive localized prompt augmentation.",
  },
  {
    question: "How is this different from traditional rank tracking?",
    answer:
      "Rank trackers measure blue-link positions on a SERP. GEO Scan measures whether AI-generated answers cite your brand at all. There's no top 10 to climb — just whether your domain is in the response or isn't.",
  },
  {
    question: "Can I compare my domain against competitors in the same scan?",
    answer:
      "Yes. Add up to four competitor domains and the scan returns side-by-side citation status for each, across all seven engines — which prompts they win, which they lose, and the citations they earn that you don't.",
  },
  {
    question: "Can I export my scan results?",
    answer:
      "Yes. CSV, PDF, and XLSX exports are free. Use them to brief writers, update leadership, or feed citation data into your own dashboards.",
  },
]

export default function GeoScanPage() {
  return (
    <>
      {/* Hero — pain-led, with the real scan result as the proof */}
      <section className="relative overflow-hidden bg-[var(--surface-mint)] px-6 pt-16 pb-16 sm:pt-20 sm:pb-20">
        <JsonLd
          data={[
            softwareApplicationSchema({
              name: "GEO Scan",
              description:
                "An AI visibility tool that scans ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews, Bing Copilot, and Grok to show whether they cite your brand or your competitors.",
              url: `${siteConfig.url}/features/geo-scan`,
            }),
            howToSchema({
              name: "How to run a GEO Scan",
              steps: steps.map((s) => ({ name: s.title, text: s.body })),
            }),
          ]}
        />

        <div className="mx-auto max-w-5xl">
          <Breadcrumbs featureName="GEO Scan" />
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
              AI Visibility Tool
            </p>
            <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
              See if AI is recommending you — or your competitors.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
              ChatGPT, Perplexity, Gemini, and Google AI Overviews already answer your customers&apos;
              buying questions. Most brands have no idea whether they&apos;re in the answer or invisible.
              GEO Scan queries seven engines with one prompt and shows you exactly who gets cited, who
              gets recommended instead, and a 0–100 visibility score — in minutes, from live search.
            </p>
            <div className="mt-8">
              <DualCTA
                primaryLabel="Run a free scan"
                secondaryLabel="See how it works"
                secondaryHref="#how"
                microcopy="Free plan · no credit card · results in minutes"
              />
            </div>
          </div>

          {/* Real scan result, anonymized — domain-free metrics strip (brand kept unnamed) */}
          <div className="mx-auto mt-12 max-w-4xl">
            <ScreenshotFrame
              src="/screenshots/geo-scan/ai-citation-lawyers-result.png"
              alt="GEO Scan result for 'how to run google ads for lawyers': all 7 AI engines cite the brand, ranked the #1 cited source above google.com, with 63 total citations."
              width={1999}
              height={1602}
              priority
              caption="Real GEO Scan — for “how to run google ads for lawyers,” all 7 AI engines cite the brand, which ranks the #1 cited source — above google.com, Reddit, and Clio."
            />
          </div>
        </div>
      </section>

      {/* The cost of being invisible */}
      <PainScenarioSection
        eyebrow="The blind spot"
        scenario="A buyer asks ChatGPT &ldquo;best agency for [your service].&rdquo; It names three companies. None of them are you. You never see the query, never see the lost deal — you just watch a competitor grow and can&apos;t explain why."
        bridge="GEO Scan turns that blind spot into a number you can act on: run the prompts your customers actually ask, and see exactly where you&apos;re in the answer and where you&apos;re missing."
      />

      {/* What a scan gives you back — anchor the score + cited vs mentioned */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
            What you get back
          </p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            A visibility score that actually means something.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-600">
            Every scan returns a 0–100 AI visibility score, the verbatim answer from each engine, and a
            clear status for your domain on every one. The score isn&apos;t arbitrary — here&apos;s how to read it:
          </p>
          <div className="mt-6">
            <ScoreLegend variant="0-100" />
          </div>
          <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              ["Cited", "Your domain is the linked source — defend it."],
              ["Recommended", "Named as a top pick — protect the position."],
              ["Mentioned", "Named without a link — your highest-leverage upgrade."],
              ["Not found", "The gap to close first."],
            ].map(([term, def]) => (
              <div key={term} className="rounded-xl border border-gray-200 bg-white p-4">
                <dt className="text-[14px] font-bold text-gray-900">{term}</dt>
                <dd className="mt-1 text-[13px] leading-relaxed text-gray-600">{def}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-[13px] leading-relaxed text-gray-500">
            In a recent scan, a legal-marketing agency we run GEO for scored 7/7 — cited by every engine —
            with 63 total citations and the #1 influence rank in the result, ahead of google.com.
          </p>
        </div>
      </section>

      {/* How it works (HowTo schema source) */}
      <div id="how">
        <HowItWorks3Step
          heading="From prompt to citation map in three steps"
          steps={steps}
        />
      </div>

      {/* Act, don't just monitor */}
      <ActVsMonitorWedge
        body="GEO Scan finds the prompts where you're missing. From there, every Not-found and Mentioned status feeds straight into a fix — so the next scan flips them to Cited."
        example="See you're absent from ChatGPT for a key prompt? The flagged page routes into Content Analyzer, which tells you the exact signals to fix — blocked crawler, missing schema, thin entity coverage — so the gap closes instead of just being logged."
        link={{ label: "See how Content Analyzer closes the gap", href: "/features/content-analyzer" }}
      />

      {/* Proof — anonymized real-world case (a brand we run GEO for, kept unnamed) */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
            A real-world result
          </p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            Page one on Google. Near-zero clicks. #1 in the AI answer.
          </h2>
        </div>
        <div className="mt-10">
          <SocialProofBlock
            miniCase={{
              result:
                "A legal-marketing agency we run GEO for ranks its “Google Ads for lawyers” guide page 1 on Google at ~0.3% CTR — yet it's the #1 cited source across all 7 AI engines for that query, ahead of google.com.",
              attribution: "Measured with GEO Scan",
            }}
            provenanceLine="Every GEO Scan is a live query to each engine — real responses, parsed verbatim, not API-memorized summaries."
          />
        </div>
      </section>

      {/* Comparison */}
      <section className="border-t border-gray-100 bg-gray-50 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
            How it compares
          </p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            GEO Scan vs. the alternatives
          </h2>
          <div className="mt-8">
            <FeatureComparisonTable
              columns={["Manual ChatGPT checks", "Monitoring-only tools", "GEO Scan"]}
              rows={comparisonRows}
            />
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
              What makes it different
            </p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
              Built for the AI search reality.
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

      <FeatureFaq items={faqs} />

      <RelatedFeatures current="geo-scan" related={["domain-overview", "content-analyzer", "competitor-intel"]} />

      {/* Final CTA */}
      <section className="bg-gray-950 px-6 py-20 sm:py-24">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              Run your first GEO Scan.
            </h2>
            <p className="mt-2 text-base text-gray-300">Free plan, no credit card. Results in minutes.</p>
          </div>
          <Link
            href={siteConfig.appSignupUrl}
            prefetch={false}
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 active:translate-y-[1px]"
          >
            Try it for free
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  )
}
