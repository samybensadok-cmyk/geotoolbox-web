import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { RelatedFeatures } from "@/components/features/related-features"
import { FeatureFaq } from "@/components/features/feature-faq"
import { ScreenshotFrame } from "@/components/features/screenshot-frame"
import { PainScenarioSection } from "@/components/features/pain-scenario"
import { HowItWorks3Step, type Step } from "@/components/features/how-it-works"
import { ActVsMonitorWedge } from "@/components/features/act-vs-monitor"
import { FeatureComparisonTable } from "@/components/features/feature-comparison-table"
import { TrustSecurityBlock } from "@/components/features/trust-security"
import { DualCTA } from "@/components/features/dual-cta"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { softwareApplicationSchema, howToSchema } from "@/lib/seo-schema"

export const metadata: Metadata = {
  title: "Ask GeoToolBox — AI Analyst Chat for Your AI Visibility Data",
  description:
    "Ask plain-language questions about your brand's AI search visibility and get answers pulled live from your own tracked data — pointing back to the report each answer came from. Available on Growth plans and up.",
  openGraph: {
    title: "Ask GeoToolBox — AI Analyst Chat for Your AI Visibility Data | GEO Toolbox",
    description:
      "A built-in AI analyst that answers questions about your brand's citation rate, cited domains, gaps, and week-over-week movers — grounded only in your own tracked data.",
  },
  alternates: { canonical: `${siteConfig.url}/features/ask-geotoolbox` },
}

const steps: Step[] = [
  {
    verb: "Ask",
    title: "A plain-language question",
    body: "Type it like you'd ask a colleague: “why did our citation rate drop last week,” “which domains cite our competitor but not us,” “what should I fix first.” No filters, no dashboard to learn.",
  },
  {
    verb: "Query",
    title: "Your own tracked data, live",
    body: "The analyst calls the same reports your Tracker and Domain Overview are built on — brand visibility, cited domains and URLs, citation gaps, week-over-week movers, and your prioritized action cards — scoped strictly to your account.",
  },
  {
    verb: "Answer",
    title: "With the report behind each answer",
    body: "It answers in plain language and shows which report backs each number, so you can verify instead of just trusting a black box. If the data doesn't support a claim, it says so instead of guessing.",
  },
]

const comparisonRows = [
  { label: "Answers in plain language, no dashboard filters", cells: [false, true, true] },
  { label: "Reads your actual tracked visibility data", cells: [false, false, true] },
  { label: "Points back to the report behind its answers", cells: ["—", false, true] },
  { label: "Scoped only to your own account's data", cells: ["—", false, true] },
  { label: "Knows your citation gaps & week-over-week movers", cells: [false, false, true] },
  { label: "No copy-pasting exports into a separate chatbot", cells: [true, false, true] },
]

const faqs = [
  {
    question: "What is Ask GeoToolBox?",
    answer:
      "It's an AI analyst built into the app. Ask it a question in plain language about your brand's AI search visibility, and it answers using your own tracked data — not a generic model guessing from training data.",
  },
  {
    question: "What data can it actually see?",
    answer:
      "Only your account's own tracked data: brand visibility (mention rate, citation rate, average position), which domains and URLs AI engines cite for your prompts, citation gaps (where competitors are cited and you're not), week-over-week movers, and your prioritized action cards. It never has access to another customer's data.",
  },
  {
    question: "Does it make things up?",
    answer:
      "It's instructed to answer only from what your reports actually return, citing the report behind each number — and if the data doesn't support an answer, to say so rather than inventing one.",
  },
  {
    question: "Is this the same as pasting my data into ChatGPT?",
    answer:
      "No. It runs inside your account, calls your live tracked reports directly — no exporting, no copy-pasting, no risk of pasting client data into a third-party chat window — and every answer is scoped to your own tenant only.",
  },
  {
    question: "Which plans include Ask GeoToolBox?",
    answer:
      "Growth and every plan above it — Scale and Enterprise. It's not available on Free, Starter, or Consultant.",
  },
  {
    question: "Is there a limit to how much I can ask?",
    answer:
      "Usage is capped to a daily allowance that resets at midnight UTC, so cost stays predictable. You'll see a clear message if you hit the daily limit for the day.",
  },
]

export default function AskGeoToolBoxPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[var(--surface-warm)] px-6 pt-16 pb-16 sm:pt-20 sm:pb-20">
        <JsonLd
          data={[
            softwareApplicationSchema({
              name: "Ask GeoToolBox",
              description:
                "An in-app AI analyst that answers plain-language questions about a brand's AI search visibility using only that account's own tracked data, pointing back to the report behind each answer.",
              url: `${siteConfig.url}/features/ask-geotoolbox`,
            }),
            howToSchema({
              name: "How to ask GeoToolBox a question about your AI visibility",
              steps: steps.map((s) => ({ name: s.title, text: s.body })),
            }),
          ]}
        />

        <div className="mx-auto max-w-7xl">
          <Breadcrumbs featureName="Ask GeoToolBox" />
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="animate-fade-up lg:col-span-6">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                AI analyst chat
              </p>
              <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
                Stop digging through dashboards. <span className="text-accent-700">Just ask.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
                “Why did our citation rate drop last week?” “Which domains cite our competitor but not us?”
                Ask GeoToolBox answers in plain language, pulling only from your own tracked visibility
                data — and points back to the report behind its answers.
              </p>
              <div className="mt-8">
                <DualCTA
                  primaryLabel="See Growth plans"
                  primaryHref="/pricing"
                  secondaryLabel="How it works"
                  secondaryHref="#how"
                  microcopy="On Growth plans and up"
                />
              </div>
            </div>

            <div className="animate-fade-up stagger-2 lg:col-span-6">
              <ScreenshotFrame
                src="/screenshots/ask-geotoolbox/chat.png"
                alt="Ask GeoToolBox chat interface showing the question 'Which domains get cited most in my space over the last 30 days?' answered with a ranked table of cited domains (rank, domain, type, citations, citation share) and three bulleted key takeaways, with a trace line showing the domain_report tool call behind the answer."
                width={1750}
                height={1360}
                priority
                caption="Ask a question in plain language — the analyst answers from your own tracked data and points to the report behind the claim."
              />
            </div>
          </div>
        </div>
      </section>

      <PainScenarioSection
        eyebrow="The dashboard problem"
        scenario="Your citation rate moved and you don't know why. So you open the Tracker, then Domain Overview, then Competitor Intel, cross-referencing three screens to answer one question — and by the time you have an answer, the client call already happened."
        bridge="Ask GeoToolBox skips the cross-referencing. Ask the question directly and get an answer built from the same reports, in the time it takes to type a sentence."
      />

      <div id="how">
        <HowItWorks3Step heading="From a question to a sourced answer" steps={steps} />
      </div>

      <TrustSecurityBlock
        heading="Grounded in your data, not a guess"
        items={[
          {
            title: "Your account's data only",
            body: "Every answer is scoped to your own tracked brands. A brand ID from your own account is validated before any report call runs — nothing ever crosses between accounts.",
          },
          {
            title: "Answers point back to their source",
            body: "Answers reference the specific report behind each number — brand visibility, cited domains and URLs, citation gaps, movers, or action cards — so you can verify instead of trusting a black box.",
          },
          {
            title: "No hallucinated numbers",
            body: "The analyst answers from what your reports actually return. If the data doesn't support a claim, it says so rather than inventing a figure.",
          },
          {
            title: "Predictable, capped usage",
            body: "Daily usage is capped and resets at midnight UTC, so a busy day of questions can't produce a surprise bill.",
          },
        ]}
      />

      <ActVsMonitorWedge
        body="A dashboard shows you the numbers and leaves the interpretation to you. Ask GeoToolBox does the cross-referencing — pulling from the Tracker, Domain Overview, and Opportunities data at once — so you get the interpretation, not just the raw report."
        example="Ask “what should I fix first for this brand” and it pulls your prioritized action cards directly, with the rationale and suggested fix already attached — instead of you opening Opportunities and reading down the list yourself."
        link={{ label: "See how Opportunities builds those action cards", href: "/features/domain-overview" }}
      />

      <section className="border-t border-[var(--surface-warm-border)] bg-[var(--surface-warm)] px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
            How it compares
          </p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            Ask GeoToolBox vs. digging it out yourself
          </h2>
          <div className="mt-8">
            <FeatureComparisonTable
              columns={["Manual dashboard digging", "Generic AI chatbot", "Ask GeoToolBox"]}
              rows={comparisonRows}
            />
          </div>
        </div>
      </section>

      <FeatureFaq items={faqs} />

      <RelatedFeatures
        current="ask-geotoolbox"
        related={["domain-overview", "competitor-intel", "analytics"]}
      />

      <section className="bg-gray-950 px-6 py-20 sm:py-24">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              Ask, don&apos;t dig.
            </h2>
            <p className="mt-2 text-base text-gray-300">Available on Growth and up. See which plan fits.</p>
          </div>
          <Link
            href="/pricing"
            prefetch={false}
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 active:translate-y-[1px]"
          >
            View plans
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  )
}
