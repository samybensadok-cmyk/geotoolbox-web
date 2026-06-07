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
import { FeatureComparisonTable } from "@/components/features/feature-comparison-table"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { softwareApplicationSchema, howToSchema, breadcrumbsSchema } from "@/lib/seo-schema"

export const metadata: Metadata = {
  title: "AI Content Brief & Article Writer | GEO Toolbox Content Studio",
  description:
    "Your article is well-written — AI still won't cite it. Content Studio reverse-engineers what ChatGPT, Perplexity and AI Overviews actually extract from the pages they cite, builds a citation-ready brief (strategy, outline, entity targets, AI-extractability checklist), then writes the full draft.",
  openGraph: {
    title: "AI Content Brief & Article Writer | GEO Toolbox Content Studio",
    description:
      "From a keyword to a citation-ready article: a brief built on what AI engines extract from the pages they cite — strategy, outline, entity targets, an AI-extractability checklist — then the draft, written for you.",
  },
  alternates: { canonical: `${siteConfig.url}/features/content-studio` },
}

const steps: Step[] = [
  {
    verb: "Brief",
    title: "A keyword, reverse-engineered",
    body: "Paste a keyword or a URL to optimize. Content Studio reads the live SERP and the pages AI actually cites, then builds a framework-aware strategy, a recommended outline, entity and statistic targets, and an AI-extractability checklist.",
  },
  {
    verb: "Write",
    title: "The full draft, against the brief",
    body: "Hit Write Article and the 5-stage copywriter drafts the piece to the outline — answer-first, the right entities, question-format headings — or paste your own draft to work against the checklist.",
  },
  {
    verb: "Ship",
    title: "Grade it, then export",
    body: "Work the extractability checklist, grade the draft for citability in Content Analyzer, then export to PDF, DOCX or Markdown, or share a link — ready to publish.",
  },
]

// The real modules a Content Studio brief produces — shown in full, lead with the
// two that differentiate it from keyword/structure brief tools.
const briefModules = [
  { name: "AI extractability checklist", gloss: "The REQUIRED and RECOMMENDED moves AI engines reward: answer-first opening, PAA-matching H2s, inline-cited stats, self-contained FAQ, schema." },
  { name: "AI vs SERP gap analysis", gloss: "Where the AI answer and the organic SERP diverge — the sub-topics no one covers that you can own." },
  { name: "Strategy", gloss: "A read of the SERP and the pages AI cites — what's dominating, the content gap, and the angle that earns citations." },
  { name: "Content framework", gloss: "Word target benchmarked against competitors, format, reading grade, and tone — the spec the draft is written to." },
  { name: "Recommended outline", gloss: "A framework-aware H2/H3 outline (pillar, cluster, comparison, or FAQ) the writer fills in." },
  { name: "Entities & frequency targets", gloss: "The named entities the cited pages cover — and how often — so AI sees the topic fully addressed." },
  { name: "Statistics & evidence", gloss: "The specific, sourced facts competitors cite that you'd lose a citation without." },
  { name: "Community insights", gloss: "The Reddit and forum threads AI pulls from for this topic, so the brief reflects how people actually ask." },
]

const outcomes = [
  {
    tag: "Citability, not just structure",
    title: "Built on what AI extracts",
    body: "Most brief tools grade you against keyword and heading coverage for the ten blue links. Content Studio reads what ChatGPT, Perplexity and AI Overviews actually lift from the pages they cite — answer capsules, entities, sourced stats — and briefs to that.",
  },
  {
    tag: "Write, don't just brief",
    title: "The draft, written for you",
    body: "Brief tools hand you an outline and stop. Content Studio writes the full first draft against the brief with a 5-stage copywriter — answer-first, correctly structured, the entities already in — so you start editing, not from a blank page.",
  },
  {
    tag: "Facts you'd have missed",
    title: "The stat the cited pages all include",
    body: "It surfaces the exact entities and statistics competitors cite that your draft omits — the pricing table 7 of 9 top pages include, the data point AI expects — so you never lose a citation to a missing fact.",
  },
  {
    tag: "Own the gap",
    title: "The sub-topic everyone skipped",
    body: "The AI-vs-SERP gap analysis finds the question all ten top results miss — a differentiated angle AI has nothing else to cite for, and the fastest path into the answer.",
  },
  {
    tag: "Ship anywhere",
    title: "Export for the way you work",
    body: "PDF for the freelancer brief, DOCX for the editorial pipeline, Markdown to paste into your CMS, or a share link for the client — the graded draft, ready to hand off.",
  },
  {
    tag: "One loop",
    title: "Brief → write → grade → repeat",
    body: "When the draft is done, hand it to Content Analyzer to grade for citability — a one-click hand-off from the brief — apply the fixes, and re-brief. The whole loop, research to ship, lives in one place.",
  },
]

const faqs = [
  {
    question: "How is this different from Surfer, Clearscope or MarketMuse?",
    answer:
      "Those tools grade your content for traditional keyword and structure coverage — optimizing for the ten blue links. Content Studio optimizes for AI citation: it reads what ChatGPT, Perplexity and Google AI Overviews actually extract from the pages they cite, then briefs and writes to that — an answer-first opening, the named entities AI expects, sourced statistics, and an AI-extractability checklist no keyword tool produces. It's built on live SERPs and real AI engine responses, not a generic LLM prompt.",
  },
  {
    question: "Will this actually help me get cited by ChatGPT and AI Overviews?",
    answer:
      "It builds the page toward what those engines demonstrably cite. The brief is reverse-engineered from the pages AI already cites for your keyword — their entities, their facts, their structure — so closing those gaps moves you toward what's winning. It's not a guarantee (AI citation is probabilistic), but you can grade the finished draft for citability in Content Analyzer and re-check, instead of guessing.",
  },
  {
    question: "Does it write the whole article, or just the brief?",
    answer:
      "Both. The brief comes first — strategy, outline, entity and statistic targets, and the extractability checklist. Then Write Article runs a 5-stage copywriter that drafts the full piece against that brief: answer-first, question-format headings, the right entities already in place. You can also paste an existing draft and work it against the checklist instead.",
  },
  {
    question: "What's the AI-extractability checklist?",
    answer:
      "A prioritized list of the moves AI engines reward, split into REQUIRED and RECOMMENDED: a direct answer in the first 100 words, question-format H2s that match People-Also-Ask queries, specific statistics with inline citations, a self-contained FAQ, an author byline, a dateModified freshness signal, HowTo schema, and a comparison table with structured data. Each one is a reason an engine does or doesn't lift your page.",
  },
  {
    question: "Can I export the brief and the draft?",
    answer:
      "Yes — PDF, DOCX, or Markdown, plus a shareable link. Export the brief for a freelancer, the draft for your editorial pipeline, or the Markdown straight into your CMS.",
  },
  {
    question: "Do I need to connect Google Search Console?",
    answer:
      "No — it's optional. Content Studio builds the brief from the live SERP and real AI responses without it. If you do connect GSC, it uses your existing impressions to prioritize which briefs are worth writing first; it never needs GSC to generate a brief.",
  },
  {
    question: "What does Content Studio cost?",
    answer:
      "Content Studio briefs are included from the Consultant plan up; full article writing with the 5-stage copywriter is on the Agency and Scale plans. A free account covers the AI visibility tracker and Agent Readiness so you can start without a card — see the pricing page for current tiers.",
  },
]

const citedEngines = ["chatgpt", "perplexity", "gemini", "claude", "aio", "grok"] as const

export default function ContentStudioPage() {
  return (
    <>
      {/* Hero — pain-led, with the real brief as proof */}
      <section className="relative overflow-hidden bg-[var(--surface-warm)] px-6 pt-16 pb-16 sm:pt-20 sm:pb-20">
        <JsonLd
          data={[
            softwareApplicationSchema({
              name: "Content Studio",
              description:
                "An AI content brief and article writer: it reverse-engineers what AI engines extract from the pages they cite, builds a citation-ready brief (strategy, outline, entity targets, AI-extractability checklist), then writes the full draft.",
              url: `${siteConfig.url}/features/content-studio`,
              applicationSubCategory: "AI content brief and writer",
            }),
            howToSchema({
              name: "How to write an article AI will cite",
              steps: steps.map((s) => ({ name: s.title, text: s.body })),
            }),
            breadcrumbsSchema([
              { name: "Home", url: "/" },
              { name: "Features", url: "/features" },
              { name: "Content Studio", url: "/features/content-studio" },
            ]),
          ]}
        />

        <div className="mx-auto max-w-5xl">
          <Breadcrumbs featureName="Content Studio" />
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
              Content Studio
            </p>
            <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
              Your article is well-written. AI still won&apos;t cite it.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
              Content Studio is an AI content brief and article writer. A clean, readable post can be invisible to
              ChatGPT, Perplexity and Google AI Overviews &mdash; because it&apos;s missing the entities, facts and
              structure the engines actually extract. It reverse-engineers what gets cited, builds the brief, and
              writes the draft against it.
            </p>
            <div className="mt-8">
              <DualCTA
                primaryLabel="Generate a brief"
                primaryHref="/app"
                secondaryLabel="See what's in a brief"
                secondaryHref="#brief"
                microcopy="Built on live SERPs + real AI engine responses · see plans"
              />
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-4xl">
            <ScreenshotFrame
              src="/screenshots/content-studio/brief-studio.png"
              alt="A real Content Studio brief for the keyword 'LLM SEO': a tabbed brief (Strategy, Content Framework, AI Extractability Checklist, Recommended Outline, Statistics & Evidence, Entities & Topics, Article), a Write Article button, PDF/DOCX/Markdown export, and a strategy read of the SERP and the pages AI cites."
              width={2136}
              height={1090}
              priority
              caption="A real brief for ‘LLM SEO’: a strategy read of what AI cites, a framework-aware outline, and — one click away — the written article. Export to PDF, DOCX or Markdown. No fabricated mockup."
            />
          </div>
        </div>
      </section>

      {/* The cost of a well-written, uncited page */}
      <PainScenarioSection
        eyebrow="The blind spot"
        scenario="You spend a day on a 2,000-word guide. It reads beautifully and ranks page one. Three weeks later a competitor's thinner page is the one ChatGPT quotes &mdash; because it names the six entities the engine expects and answers the three sub-questions yours skipped. You never find out why; you just see the traffic that never came."
        bridge="Readability is table stakes. Citability is the new ranking &mdash; and almost no brief tool measures it. Content Studio reads what AI engines extract from the pages they cite, briefs your draft to match, and writes it for you."
      />

      {/* How it works (HowTo schema source) */}
      <HowItWorks3Step heading="From keyword to citation-ready article" steps={steps} />

      {/* What's in a brief — the real modules */}
      <section id="brief" className="border-t border-gray-100 bg-gray-50 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
              What&apos;s in a brief
            </p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
              Not an outline. A citation blueprint.
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-gray-600">
              Every brief is built from the live SERP and real AI engine responses &mdash; the same{" "}
              <Link href="/features/content-analyzer" className="font-semibold text-accent-700 hover:text-accent-800">
                signals Content Analyzer grades
              </Link>
              , turned into a plan you can write to. Each module below is in the brief.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-2">
            {briefModules.map((m) => (
              <div key={m.name} className="flex items-start gap-2.5">
                <svg className="mt-1 h-3.5 w-3.5 shrink-0 text-accent-600" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M3 7.5l2.5 2.5L11 4.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[14px] leading-snug text-gray-700">
                  <span className="font-semibold text-gray-900">{m.name}</span>
                  <span className="text-gray-500"> &mdash; {m.gloss}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-3xl">
            <ScreenshotFrame
              src="/screenshots/content-studio/extractability-checklist.png"
              alt="The AI Extractability Checklist from a real brief: REQUIRED items (direct answer in first 100 words, question-format H2 headings matching PAA queries, specific statistics with inline citations, self-contained FAQ answers, author byline, dateModified freshness signal, comparison table with structured data) and RECOMMENDED items (HowTo schema on the workflow section), each with the why."
              width={2136}
              height={1660}
              caption="The AI-extractability checklist: the exact REQUIRED and RECOMMENDED moves AI engines reward, with the reason for each — the part no keyword tool produces."
            />
          </div>
        </div>
      </section>

      {/* Act, don't just monitor */}
      <ActVsMonitorWedge
        headline="Most brief tools score structure and stop."
        emphasis="Content Studio tells you the fix — then writes it."
        body="A keyword tool flags that you're light on a term. Content Studio names the exact entities and sourced facts AI expects, hands you the extractability checklist, and drafts the article against it — so the gap closes instead of just getting measured."
        example="See &lsquo;answer-first opening — REQUIRED&rsquo; and &lsquo;statistics with inline citations — REQUIRED&rsquo;? The draft is written with both already in place, then you hand it to Content Analyzer to grade for citability and re-check."
        link={{ label: "Hand off to Content Analyzer to grade citability", href: "/features/content-analyzer" }}
      />

      {/* Outcomes */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">What makes it different</p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
              Briefs that earn the citation.
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

      {/* CTA repeat at the section break */}
      <section className="border-t border-gray-100 bg-white px-6 py-10">
        <div className="mx-auto max-w-3xl">
          <DualCTA
            primaryLabel="Generate a brief"
            primaryHref="/app"
            microcopy="Built on live SERPs + real AI engine responses · see plans"
          />
        </div>
      </section>

      {/* Comparison */}
      <section className="border-t border-gray-100 bg-gray-50 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">Where it fits</p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
              Surfer grades you for the ten blue links. We grade you for the answer.
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-gray-600">
              Surfer, Clearscope and MarketMuse are real, capable content-optimization tools &mdash; built for
              keyword and structure coverage. Content Studio is built for the answer ChatGPT, Perplexity and
              AI Overviews give.
            </p>
          </div>
          <div className="mt-10">
            <FeatureComparisonTable
              columns={["Surfer / Clearscope", "MarketMuse", "Content Studio"]}
              rows={[
                { label: "Primary optimization target", cells: ["Keyword / SERP", "Topic model", "AI citation"] },
                { label: "Briefs from live AI-engine answers", cells: [false, false, true] },
                { label: "AI-extractability checklist (answer-first, PAA H2s, schema)", cells: [false, false, true] },
                { label: "Entity + competitor-facts targets from the cited pages", cells: ["Keyword terms", "Topic model", true] },
                { label: "AI-vs-SERP gap analysis", cells: [false, false, true] },
                { label: "Writes the draft from the brief + exports PDF / DOCX / Markdown", cells: ["AI writer add-on", "Drafts", true] },
              ]}
              caption="These are established ranking-era tools, built for keyword and topic coverage. Content Studio adds the AI-citability layer — the extractability checklist and the AI-vs-SERP gap — and writes the draft against it."
            />
          </div>
        </div>
      </section>

      {/* Light proof — real run, real provenance, no fabricated counters */}
      <section className="border-t border-gray-100 bg-white px-6 py-12">
        <SocialProofBlock
          miniCase={{
            result:
              "A real brief for ‘LLM SEO’ read the SERP (a Reddit thread, a Vercel engineering blog, two thin guides), set a 3,200-word target — against the 2,339-word competitor average — and flagged eight AI-extractability requirements before a word was written.",
            attribution: "A real Content Studio brief · keyword ‘LLM SEO’",
          }}
          engines={[...citedEngines]}
          provenanceLine="Every brief is built from a live SERP pull and real AI engine responses — the entities, facts and structure the pages AI cites actually use. Not a generic LLM prompt, not a cached guess."
        />
      </section>

      <FeatureFaq items={faqs} />

      <RelatedFeatures current="content-studio" related={["content-analyzer", "geo-scan", "domain-overview"]} />

      {/* CTA */}
      <section className="bg-gray-950 px-6 py-20 sm:py-24">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              Brief your next article.
            </h2>
            <p className="mt-2 text-base text-gray-300">From keyword to draft in one place.</p>
          </div>
          <Link href="/app" prefetch={false} className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 active:translate-y-[1px]">
            Generate a brief
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  )
}
