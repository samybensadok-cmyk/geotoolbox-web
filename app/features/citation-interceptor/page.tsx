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
import { FeatureComparisonTable } from "@/components/features/feature-comparison-table"
import { TrustSecurityBlock } from "@/components/features/trust-security"
import { DualCTA } from "@/components/features/dual-cta"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { softwareApplicationSchema, howToSchema } from "@/lib/seo-schema"

export const metadata: Metadata = {
  title: "AI Citation Gap — Where AI Cites Others, Not You",
  description:
    "Citation Interceptor shows which Reddit threads, forums, editorial, and competitor pages AI engines cite for your topics — where your brand is absent — and turns it into an evidence-graded worklist of real opportunities. No astroturf.",
  openGraph: {
    title: "AI Citation Gap — Where AI Cites Others, Not You | Citation Interceptor",
    description:
      "See the offsite sources AI engines cite for your topics where your brand is absent — Reddit, forums, editorial, competitors — as an evidence-graded worklist of real opportunities.",
  },
  alternates: { canonical: `${siteConfig.url}/features/citation-interceptor` },
}

const steps: Step[] = [
  {
    verb: "Scan",
    title: "Your prompts, across the engines",
    body: "Citation Interceptor reads the AI answers for the prompts your buyers actually ask and pulls every offsite source the engines cite — across ChatGPT, Perplexity, Gemini, Claude, AI Overviews, Bing Copilot, and Grok.",
  },
  {
    verb: "See",
    title: "Where you're absent — by source family",
    body: "Reddit and forums, editorial, competitor pages, institutional sites — grouped by family, each with the share of answers where your brand is missing and the actual cited URLs behind it.",
  },
  {
    verb: "Act",
    title: "An evidence-graded worklist",
    body: "Every source is graded Observed, Hypothesis, or Risky-Unproven, with the real cited threads to review — so you work a list of genuine opportunities, not guesses, and mark each done as you go.",
  },
]

const comparisonRows = [
  { label: "Shows the offsite sources AI actually cites", cells: [false, false, true] },
  { label: "Pinpoints where YOUR brand is absent", cells: [false, "Partial", true] },
  { label: "The actual cited Reddit / forum threads", cells: [false, false, true] },
  { label: "Evidence grading (Observed / Hypothesis / Risky)", cells: [false, false, true] },
  { label: "Real opportunities — no fake reviews / astroturf", cells: ["Often the opposite", "—", true] },
  { label: "Triage worklist (acknowledge / done / dismiss)", cells: [false, false, true] },
]

const faqs = [
  {
    question: "What does Citation Interceptor actually show?",
    answer:
      "For your tracked prompts, it surfaces the offsite sources AI engines cite — Reddit threads, forums, editorial, competitor pages, institutional sites — and flags where your brand is absent from those answers. You get the source families, the share of answers you're missing from, and the real cited URLs behind each.",
  },
  {
    question: "Is this the “spam Reddit” hack?",
    answer:
      "No — the opposite. It surfaces legitimate participation opportunities (a genuinely useful answer in a thread AI already cites) with explicit evidence grading. It does not generate fake reviews, astroturf, or contact anyone for you. Fake activity is a credibility risk, not a strategy.",
  },
  {
    question: "What do the evidence grades mean?",
    answer:
      "Observed means the citation was directly seen in AI answers. Hypothesis means it's inferred and unconfirmed. Risky-Unproven flags low-confidence or risky moves. Advice is gated by the grade, so you only act on what's actually supported.",
  },
  {
    question: "How is this different from the Community feature?",
    answer:
      "Community focuses specifically on Reddit and forum citations. Citation Interceptor covers every offsite source family (community/UGC, editorial, competitor, institutional, reference), adds the prioritized opportunity worklist, the evidence grading, and per-source triage. Use them together.",
  },
  {
    question: "Which AI engines does it cover?",
    answer:
      "The same seven GEO Scan covers: ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews, Bing Copilot, and Grok.",
  },
  {
    question: "Can I track what I've actioned?",
    answer:
      "Yes. Each source has triage controls (acknowledge, done, dismiss, plus context tags), and a baseline is captured when you flag a source — so you can see whether your participation moved the citation picture over time.",
  },
]

export default function CitationInterceptorPage() {
  return (
    <>
      {/* Hero — pain-led, with the real worklist as proof */}
      <section className="relative overflow-hidden bg-[var(--surface-lilac)] px-6 pt-16 pb-16 sm:pt-20 sm:pb-20">
        <JsonLd
          data={[
            softwareApplicationSchema({
              name: "Citation Interceptor",
              description:
                "Offsite citation intelligence: shows which Reddit threads, forums, editorial, and competitor pages AI engines cite for your topics where your brand is absent, as an evidence-graded opportunity worklist.",
              url: `${siteConfig.url}/features/citation-interceptor`,
            }),
            howToSchema({
              name: "How to find your AI citation gaps with Citation Interceptor",
              steps: steps.map((s) => ({ name: s.title, text: s.body })),
            }),
          ]}
        />

        <div className="mx-auto max-w-5xl">
          <Breadcrumbs featureName="Citation Interceptor" />
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-indigo-700">
              AI Citation Gap
            </p>
            <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
              AI cites Reddit threads about your category. You&apos;re not in them.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
              When buyers ask AI about your space, the engines cite a Reddit thread, a forum answer, a
              competitor&apos;s page — the places opinions actually form. Citation Interceptor finds every
              offsite source AI cites where your brand is <em>absent</em>, grades the evidence, and hands you a
              worklist of real opportunities — without a single fake review.
            </p>
            <div className="mt-8">
              <DualCTA
                primaryLabel="Find your citation gaps"
                secondaryLabel="See how it works"
                secondaryHref="#how"
                microcopy="Free plan · no credit card"
              />
            </div>
          </div>

          {/* Real worklist — anonymized (host table + evidence grades; no brand named) */}
          <div className="mx-auto mt-12 max-w-4xl">
            <ScreenshotFrame
              src="/screenshots/citation-interceptor/citation-worklist.png"
              alt="Citation Interceptor worklist: offsite sources AI cites where a brand is absent — grouped by family (community, editorial, competitor), each with a brand-absent percentage, an Observed evidence grade, and triage controls."
              width={1698}
              height={890}
              priority
              caption="The worklist: offsite sources AI cites where the brand is absent — by family, with brand-absent %, evidence grades, and the actual cited threads to review."
            />
          </div>
        </div>
      </section>

      {/* The blind spot */}
      <PainScenarioSection
        eyebrow="The blind spot"
        scenario="Ask ChatGPT or Perplexity about your category and watch what it cites: a years-old Reddit thread, a forum debate, a competitor&apos;s comparison post. Those sources are where buyers form their shortlist — and your brand isn&apos;t in any of them."
        bridge="Citation Interceptor turns that into a list you can work: the exact offsite sources AI leans on where you&apos;re missing, ranked by opportunity and backed by evidence."
      />

      {/* How it works (HowTo schema source) */}
      <div id="how">
        <HowItWorks3Step heading="From citation gap to worklist in three steps" steps={steps} />
      </div>

      {/* The wedge — evidence-first, anti-astroturf */}
      <TrustSecurityBlock
        heading="Evidence-first, anti-astroturf by design"
        items={[
          {
            title: "Evidence grading on every source",
            body: "Observed / Hypothesis / Risky-Unproven. Advice is gated by what's actually supported in the AI answers — not vibes or volume.",
          },
          {
            title: "Real opportunities, not fake reviews",
            body: "We surface legitimate participation — a useful answer in a thread AI already cites. We never generate fake reviews or astroturf. That's a credibility risk, not a strategy.",
          },
          {
            title: "We surface, you decide",
            body: "Geotoolbox shows the evidence and the opportunity. It doesn't post, contact anyone, or promise a citation will change.",
          },
          {
            title: "Triage + baseline",
            body: "Mark sources done or dismissed, tag them, and capture a baseline — so you can tell whether genuine participation moved the citation picture.",
          },
        ]}
        note="Source-family composition (community, editorial, competitor, institutional) is computed from real AI citations, so the worklist reflects where your category's conversation actually lives."
      />

      {/* Act, don't just monitor */}
      <ActVsMonitorWedge
        body="Everyone now says &ldquo;Reddit matters for AI.&rdquo; Citation Interceptor tells you which threads, with what evidence, and whether they're worth your time — then lets you work the list and track it."
        example="AI cites an r/PPC thread about your category where you're absent, evidence graded Observed? It lands on your worklist with the thread linked. Leave a genuinely useful answer, mark it done, and watch the baseline — instead of guessing whether &ldquo;doing Reddit&rdquo; is working."
        link={{ label: "Pair it with Community for forum-level detail", href: "/features/community" }}
      />

      {/* Comparison */}
      <section className="border-t border-gray-100 bg-gray-50 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-indigo-700">
            How it compares
          </p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            Citation Interceptor vs. the alternatives
          </h2>
          <div className="mt-8">
            <FeatureComparisonTable
              columns={["Generic GEO advice", "Onsite citation trackers", "Citation Interceptor"]}
              rows={comparisonRows}
            />
          </div>
        </div>
      </section>

      {/* Light proof — engines + provenance (no fabricated numbers) */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-indigo-700">
            Built on real citations
          </p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            Every source comes from an answer an engine actually gave.
          </h2>
        </div>
        <div className="mt-10">
          <SocialProofBlock provenanceLine="Source families and the worklist are computed from real, live AI citations across all seven engines — never scraped guesses or invented numbers." />
        </div>
      </section>

      <FeatureFaq items={faqs} />

      <RelatedFeatures
        current="citation-interceptor"
        related={["community", "competitor-intel", "domain-overview"]}
      />

      {/* Final CTA */}
      <section className="bg-gray-950 px-6 py-20 sm:py-24">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              Find the citations you&apos;re missing.
            </h2>
            <p className="mt-2 text-base text-gray-300">Free plan, no credit card. See your gaps in minutes.</p>
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
