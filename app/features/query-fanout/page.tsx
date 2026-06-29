import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { RelatedFeatures } from "@/components/features/related-features"
import { FeatureFaq } from "@/components/features/feature-faq"
import { FeatureComparisonTable } from "@/components/features/feature-comparison-table"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { softwareApplicationSchema, howToSchema } from "@/lib/seo-schema"

export const metadata: Metadata = {
  title: "AI Query Fan-Out — See the real questions AI asks about your topic",
  description:
    "AI engines don't answer your keyword — they fan it into a dozen sub-questions, then answer those. Query Fan-Out captures the real queries ChatGPT, Gemini, Perplexity, and Grok fire for a seed topic (validated, never guessed), maps where the engines diverge, and ranks the content that closes each gap.",
  openGraph: {
    title: "AI Query Fan-Out — the real questions AI asks about your topic | GEO Toolbox",
    description:
      "Capture the actual sub-queries ChatGPT, Gemini, Perplexity, and Grok fan out for a topic — validated, not guessed — with a cross-engine divergence map and ranked content actions.",
  },
  alternates: { canonical: `${siteConfig.url}/features/query-fanout` },
}

// ——— Example hero-device data (clearly labelled "Example data" in the UI) ———
const fanRows: { q: string; engines: string[]; kind: "fired" | "related"; vol: string }[] = [
  { q: "best AI SEO tools compared 2026", engines: ["ChatGPT", "Gemini", "Grok"], kind: "fired", vol: "2.4K/mo" },
  { q: "how to measure AI search visibility", engines: ["Gemini", "Grok"], kind: "fired", vol: "880/mo" },
  { q: "GEO tools built for agencies", engines: ["Gemini"], kind: "fired", vol: "parent reach" },
  { q: "do AI SEO tools actually work", engines: ["Perplexity"], kind: "related", vol: "no volume" },
]

// ——— Divergence matrix: intents × engines (filled = that engine fired a query for it) ———
type EngineKey = "chatgpt" | "gemini" | "perplexity" | "grok"
// ChatGPT's API returns a single web-search call per request, so it fires for at
// most one intent here — Gemini/Grok carry the depth, Perplexity surfaces related.
const divergence: { intent: string; type: "shared" | "whitespace"; on: Record<EngineKey, boolean> }[] = [
  { intent: "Compare the leading tools", type: "shared", on: { chatgpt: true, gemini: true, perplexity: true, grok: true } },
  { intent: "How to measure AI visibility", type: "shared", on: { chatgpt: false, gemini: true, perplexity: true, grok: true } },
  { intent: "Pricing & plans for teams", type: "shared", on: { chatgpt: false, gemini: true, perplexity: true, grok: false } },
  { intent: "GEO tools for agencies", type: "whitespace", on: { chatgpt: false, gemini: true, perplexity: false, grok: false } },
  { intent: "Are these tools worth it?", type: "whitespace", on: { chatgpt: false, gemini: false, perplexity: true, grok: false } },
  { intent: "Free AI visibility checker", type: "whitespace", on: { chatgpt: false, gemini: false, perplexity: false, grok: true } },
]

const steps = [
  {
    verb: "Seed",
    title: "One topic or URL",
    body: "Drop in a seed keyword or a page. Optionally point it at your own URL to score coverage, or a competitor's to see what they already answer.",
  },
  {
    verb: "Fan out",
    title: "Capture the real queries — across four engines",
    body: "We read the actual sub-queries each engine fires while answering: Gemini's grounded searches and Grok's many web-search calls carry the depth, ChatGPT contributes its single search call, and Perplexity surfaces its related questions. Real engine output, not an LLM guessing what people might ask.",
  },
  {
    verb: "Rank",
    title: "Cluster, score, and route to a fix",
    body: "Queries are clustered into intents, scored by reach and coverage, and turned into a ranked worklist — “write a comparison table answering X,” with the engines that want it and whether you cover it yet.",
  },
]

const inside = [
  {
    num: "01",
    tag: "Validated queries",
    title: "The questions AI actually fired",
    body: "Every query is one an engine really searched, tagged FIRED (a real search call) or RELATED (Perplexity's surfaced follow-ups). No “here's what people probably ask” — the honesty is the product.",
  },
  {
    num: "02",
    tag: "Divergence map",
    title: "Where the engines disagree",
    body: "The signature view: intents shared across multiple engines versus the whitespace only one engine explores. Shared intents are table stakes; single-engine intents are uncontested ground to claim first.",
  },
  {
    num: "03",
    tag: "Real volume",
    title: "Reach, labelled honestly",
    body: "Each cluster carries true search volume where it exists, parent-term reach for the zero-volume long-tail, and a plain “no volume data” when there's nothing — never an invented number.",
  },
  {
    num: "04",
    tag: "Page coverage",
    title: "What your URL already answers",
    body: "Point it at a page and every intent is checked against the live content — evidence-verified against the actual text, so a “covered” is a real substring match, not a hopeful guess. WAF-blocked pages are marked unverifiable, never falsely covered.",
  },
  {
    num: "05",
    tag: "Citation landscape",
    title: "Who AI cites on these queries",
    body: "The sources each engine cites for the fanned queries — you versus the competitors and publishers winning the answer — pulled from the engines' own answer citations, matched at the registrable-domain level.",
  },
  {
    num: "06",
    tag: "Ranked actions",
    title: "A worklist, not a word cloud",
    body: "Every gap becomes a prioritized action: the format to publish, the intent it answers, the engines that want it, and why it ranks where it does. Start at the top and work down.",
  },
]

const comparisonRows = [
  { label: "Surfaces the sub-queries AI actually fans out", cells: [false, "Guessed", true] },
  { label: "Queries are real engine output, not LLM-imagined", cells: ["Search data", "Guessed", true] },
  { label: "Covers four AI engines in one run", cells: [false, "1 engine", true] },
  { label: "Cross-engine divergence map", cells: [false, false, true] },
  { label: "Real search volume (honestly labelled)", cells: [true, false, true] },
  { label: "Checks your page's coverage of each intent", cells: [false, false, true] },
  { label: "Shows who AI cites for the queries", cells: [false, false, true] },
  { label: "Outputs a ranked content worklist", cells: [false, "Partial", true] },
]

const faqs = [
  {
    question: "What does “query fan-out” actually mean?",
    answer:
      "When you ask an AI engine a question, it rarely answers your exact words. It silently expands your query into a set of more specific sub-questions, searches those, and synthesizes the result. Those hidden sub-questions are the fan-out — and they, not your original keyword, are what decide whether you get cited.",
  },
  {
    question: "How is this different from a prompt or keyword generator?",
    answer:
      "Keyword tools and “AI prompt” generators ask a model to imagine what people might type. Query Fan-Out reads the queries the engines genuinely fired while answering — Gemini's grounded searches, Grok's web-search calls, ChatGPT's single search call, and Perplexity's related questions. Real engine output beats a plausible guess, especially when you're deciding what to write.",
  },
  {
    question: "Which engines does it read, and are they all equal?",
    answer:
      "Four: ChatGPT, Gemini, Perplexity, and Grok. We're honest about the differences. Gemini and Grok expose the richest fan-out; Perplexity surfaces related questions (tagged RELATED, not FIRED); ChatGPT's API returns a single search call, so it contributes a baseline rather than depth. Every query shows which engine produced it, so you're never guessing about provenance.",
  },
  {
    question: "What is the divergence map and why does it matter?",
    answer:
      "It's the grid of intents against engines, showing which questions multiple engines share and which only one explores. Shared intents are the table stakes you must cover to compete at all. Single-engine “whitespace” intents are uncontested — the cheapest citations to win, because most competitors haven't noticed the engine is asking.",
  },
  {
    question: "Can I run it on a competitor instead of myself?",
    answer:
      "Yes. Seed it with a competitor's brand or point coverage at their URL and you'll see the intents they already answer and the ones they've left open. It doubles as a content-gap map against any domain in your space.",
  },
  {
    question: "How accurate is the search volume?",
    answer:
      "As accurate as the data allows, and labelled so you always know which you're looking at. Real exact volume when it exists; parent-term reach for the long-tail queries keyword tools score at zero; and an explicit “no volume data” when there's none. We never fabricate a number to fill a cell.",
  },
  {
    question: "What does it cost to run?",
    answer:
      "A full multi-engine scan is metered at 150 credits ($1.50) in the app, with the cost shown before you run it. Or run the demo free using your own API keys — your keys stay in your browser and we never pay for, see, or store them.",
  },
]

export default function QueryFanoutPage() {
  return (
    <>
      {/* ——— Hero: asymmetric split, iris surface, custom fan-out instrument ——— */}
      <section className="relative overflow-hidden bg-[var(--surface-iris)] px-6 pt-16 pb-16 sm:pt-20 sm:pb-24">
        <JsonLd
          data={[
            softwareApplicationSchema({
              name: "AI Query Fan-Out",
              description:
                "Capture the real sub-queries AI engines fan out for a seed topic across ChatGPT, Gemini, Perplexity, and Grok, with a cross-engine divergence map, honest search volume, page coverage, citation landscape, and ranked content actions.",
              url: `${siteConfig.url}/features/query-fanout`,
            }),
            howToSchema({
              name: "How to capture AI query fan-out with GEO Toolbox",
              steps: steps.map((s) => ({ name: s.title, text: s.body })),
            }),
          ]}
        />

        <div className="mx-auto max-w-7xl">
          <Breadcrumbs featureName="Query Fan-Out" />

          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Left — message */}
            <div className="animate-fade-up lg:col-span-6 xl:col-span-5">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                Query Fan-Out · 4 engines
              </p>
              <h1 className="mt-3 text-[clamp(2rem,4.2vw,3.25rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
                AI doesn&apos;t answer your keyword.
                <span className="block">It answers <span className="text-accent-700">the dozen questions</span> behind it.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
                Every engine quietly fans one topic into a spray of sub-questions, then answers those. Query Fan-Out
                captures the real ones — across four engines — maps where the engines diverge, and ranks the content
                that wins each gap. Real engine output, never guessed.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/tools/query-fanout"
                  className="inline-flex items-center gap-2 rounded-full bg-accent-900 px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-accent-800 hover:shadow-xl hover:shadow-accent-900/25 active:translate-y-[1px]"
                >
                  Try the free demo
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link
                  href="#how"
                  className="rounded-full border border-gray-300 px-6 py-3.5 text-[15px] font-medium text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900"
                >
                  How it works
                </Link>
              </div>
              <p className="mt-4 font-mono text-[12px] text-gray-500">
                Free with your own API key · full multi-engine scan from 150 credits in-app
              </p>
            </div>

            {/* Right — the signature device */}
            <div className="animate-fade-up stagger-2 lg:col-span-6 xl:col-span-7">
              <FanOutDevice />
            </div>
          </div>
        </div>
      </section>

      {/* ——— Pain scenario ——— */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
            The hidden layer
          </p>
          <p className="mt-4 text-[clamp(1.15rem,2vw,1.4rem)] font-medium leading-relaxed tracking-tight text-gray-900">
            You rank for the keyword and still aren&apos;t cited. The reason is invisible in every keyword tool you own:
            the engine never searched your keyword — it fanned it into ten sharper questions and answered those, citing
            whoever covered them best.
          </p>
          <p className="mt-5 text-[15px] leading-relaxed text-gray-600">
            Query Fan-Out makes that hidden layer visible. It pulls the real questions out of four engines, shows you
            which ones they all ask and which only one does, and hands you the exact pages that would close the gap.
          </p>
        </div>
      </section>

      {/* ——— How it works: numbered rail (not cards) ——— */}
      <section id="how" className="scroll-mt-20 border-t border-gray-100 bg-gray-50 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">How it works</p>
            <h2 className="mt-3 text-[clamp(1.6rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
              From one seed to a ranked worklist.
            </h2>
          </div>

          <ol className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.verb} className="relative">
                {/* connector line on desktop */}
                {i < steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-12 right-0 top-[18px] hidden h-px bg-gradient-to-r from-gray-300 to-transparent md:block"
                  />
                )}
                <div className="flex items-center gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent-200 bg-white font-mono text-[13px] font-bold tabular-nums text-accent-700">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                    {s.verb}
                  </span>
                </div>
                <h3 className="mt-5 text-[17px] font-bold leading-snug tracking-tight text-gray-900">{s.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-gray-600">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ——— The divergence map: the signature artifact ——— */}
      <section className="border-t border-gray-100 bg-white px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                The divergence map
              </p>
              <h2 className="mt-3 text-[clamp(1.6rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
                Where the engines agree — and where only one is looking.
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-gray-600">
                Cluster every fanned query into intents, then lay the four engines side by side. The pattern that
                emerges is the whole strategy on one screen.
              </p>
              <dl className="mt-8 space-y-5">
                <div className="flex gap-4">
                  <dt className="mt-1 shrink-0">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-500">
                      <span className="h-2 w-2 rounded-full bg-white" />
                    </span>
                  </dt>
                  <dd className="text-[14px] leading-relaxed text-gray-600">
                    <span className="font-semibold text-gray-900">Shared intents</span> — questions multiple engines fan
                    out. Table stakes: miss one and you&apos;re invisible on a query the whole market answers.
                  </dd>
                </div>
                <div className="flex gap-4">
                  <dt className="mt-1 shrink-0">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-dashed border-amber-400 bg-amber-50">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                    </span>
                  </dt>
                  <dd className="text-[14px] leading-relaxed text-gray-600">
                    <span className="font-semibold text-gray-900">Whitespace</span> — intents only one engine explores.
                    Uncontested: the cheapest citations to win, because nobody&apos;s optimizing for a question they
                    can&apos;t see.
                  </dd>
                </div>
              </dl>
            </div>

            <div className="lg:col-span-7">
              <DivergenceMatrix />
            </div>
          </div>
        </div>
      </section>

      {/* ——— What's inside: numbered editorial grid (anti-card) ——— */}
      <section className="border-t border-gray-100 bg-gray-50 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[5fr_7fr] lg:items-end lg:gap-16">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                What&apos;s in a scan
              </p>
              <h2 className="mt-3 text-[clamp(1.6rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
                Six layers, one run.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-gray-600">
              The fan-out is the start. Each query is enriched into the full picture you need to decide what to write —
              and every number is real or honestly labelled, never invented to fill a column.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {inside.map((s) => (
              <div key={s.num} className="relative pl-12">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 font-mono text-[22px] font-bold leading-none tabular-nums text-gray-300"
                >
                  {s.num}
                </span>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">{s.tag}</p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight text-gray-900">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Comparison ——— */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">How it compares</p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
              Validated beats guessed.
            </h2>
            <div className="mt-8 rounded-[2rem] border border-gray-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.16)] sm:p-8">
              <FeatureComparisonTable
                columns={["Keyword tools", "Prompt generators", "Query Fan-Out"]}
                rows={comparisonRows}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ——— Honest data + BYOK demo teaser ——— */}
      <section className="border-t border-gray-100 bg-accent-50/40 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
            Run it on your own keys
          </p>
          <h2 className="mt-3 text-[clamp(1.4rem,2.6vw,2rem)] font-bold leading-tight tracking-tight text-gray-900">
            Don&apos;t take our word for it. Watch an engine fan out, live.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
            The free demo runs a real fan-out in your browser using your own API key. Your key never leaves the page —
            we don&apos;t pay for, proxy, see, or store it. It&apos;s the actual engine output, not a recording.
          </p>
          <p className="mt-4 rounded-xl border border-accent-200 bg-white p-4 text-[14px] leading-relaxed text-gray-700">
            The in-app version adds the engines that can&apos;t be called from a browser, real search volume, page
            coverage, the citation landscape, and saved history — metered at 150 credits a scan, cost shown up front.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/tools/query-fanout"
              className="inline-flex items-center gap-2 rounded-full bg-accent-900 px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-accent-800 active:translate-y-[1px]"
            >
              Run the free demo
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent-700 hover:text-accent-800"
            >
              See plans &amp; credits
              <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
          </div>
        </div>
      </section>

      <FeatureFaq items={faqs} />

      <RelatedFeatures current="query-fanout" related={["geo-scan", "content-studio", "competitor-intel"]} />

      {/* ——— Final CTA ——— */}
      <section className="bg-gray-950 px-6 py-20 sm:py-24">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              See the questions you&apos;re not answering.
            </h2>
            <p className="mt-2 text-base text-gray-300">
              Run a fan-out on your topic and start at the top of the worklist.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Link
              href="/tools/query-fanout"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 active:translate-y-[1px]"
            >
              Try the free demo
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/pricing"
              className="text-[14px] font-semibold text-gray-300 transition-colors hover:text-white"
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

/* ————————————————————————————————————————————————————————————————
   Signature device — the fan-out instrument. Custom-coded, honest
   ("Example data"), mono tabular numbers, one live pulse dot.
———————————————————————————————————————————————————————————————— */
function FanOutDevice() {
  return (
    <figure
      aria-label="Illustrative example of a Query Fan-Out scan with sample data"
      className="relative m-0 rounded-[2rem] border border-[var(--surface-iris-border)] bg-white p-5 shadow-[0_30px_80px_-28px_rgba(15,23,42,0.30)] sm:p-7"
    >
      <span className="sr-only">Example, illustrative data:</span>
      {/* Header: the seed */}
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="relative inline-flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
          </span>
          <span className="truncate font-mono text-[13px] font-semibold text-gray-900">
            seed: best ai seo tool
          </span>
        </div>
        <span className="shrink-0 font-mono text-[10px] text-gray-500">fan-out · 12s</span>
      </div>

      {/* Stat strip — borderless, divided by lines */}
      <div className="mt-4 grid grid-cols-3 divide-x divide-gray-100 text-center">
        {[
          { v: "25", l: "queries" },
          { v: "19", l: "clusters" },
          { v: "4", l: "engines" },
        ].map((s) => (
          <div key={s.l} className="px-2">
            <div className="font-mono text-2xl font-bold tabular-nums text-gray-900">{s.v}</div>
            <div className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-gray-500">{s.l}</div>
          </div>
        ))}
      </div>

      {/* The fan — query rows */}
      <div className="mt-5">
        <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
          Real fan-out queries
        </p>
        <ul className="divide-y divide-gray-100">
          {fanRows.map((r) => (
            <li key={r.q} className="flex items-center justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate font-mono text-[12.5px] text-gray-800">{r.q}</p>
                <p className="mt-1 truncate font-mono text-[10px] text-gray-500">{r.engines.join(" · ")}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={`rounded-full px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider ${
                    r.kind === "fired"
                      ? "bg-accent-50 text-accent-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {r.kind === "fired" ? "Fired" : "Related"}
                </span>
                <span className="w-20 text-right font-mono text-[10px] tabular-nums text-gray-600">{r.vol}</span>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-2 font-mono text-[11px] text-accent-700">+ 21 more queries</p>
      </div>

      {/* Divergence footnote */}
      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">Divergence</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-accent-700">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-500" /> 11 shared
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-amber-400 bg-amber-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-700">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-600" /> 8 whitespace
        </span>
        <span className="ml-auto font-mono text-[10px] text-gray-500">Example data</span>
      </div>
    </figure>
  )
}

/* ————————————————————————————————————————————————————————————————
   Divergence matrix — intents × engines presence grid.
———————————————————————————————————————————————————————————————— */
function DivergenceMatrix() {
  const engineKeys: { key: EngineKey; label: string }[] = [
    { key: "chatgpt", label: "ChatGPT" },
    { key: "gemini", label: "Gemini" },
    { key: "perplexity", label: "Perplexity" },
    { key: "grok", label: "Grok" },
  ]
  return (
    <figure
      aria-label="Illustrative example of the cross-engine divergence map with sample data"
      className="m-0 overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-[0_24px_60px_-28px_rgba(15,23,42,0.18)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-gray-100 bg-gray-50 px-5 py-3 sm:px-7">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-600">
          Intents × engines
        </span>
        <div className="flex items-center gap-3 font-mono text-[10px] text-gray-500">
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent-700" /> fired
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-accent-700" /> related
          </span>
          <span className="text-gray-500">Example data</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-left">
          <caption className="sr-only">
            Sample cross-engine divergence: which AI engines fan out a query for each intent. A filled dot is a fired
            search; a ring is a related question (Perplexity).
          </caption>
          <thead>
            <tr className="border-b border-gray-100">
              <th scope="col" className="px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500 sm:px-7">
                Intent
              </th>
              {engineKeys.map((e) => (
                <th
                  key={e.key}
                  scope="col"
                  className="px-2 py-3 text-center font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500"
                >
                  {e.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {divergence.map((row) => {
              const isWhitespace = row.type === "whitespace"
              return (
                <tr key={row.intent} className={isWhitespace ? "bg-amber-50/50" : ""}>
                  <th scope="row" className="px-5 py-3.5 text-left font-normal sm:px-7">
                    <span className="text-[13px] font-medium text-gray-900">{row.intent}</span>
                    {isWhitespace && (
                      <span className="ml-2 rounded-full border border-dashed border-amber-400 px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-amber-700">
                        Whitespace
                      </span>
                    )}
                  </th>
                  {engineKeys.map((e) => {
                    const on = row.on[e.key]
                    if (!on) {
                      return (
                        <td key={e.key} className="px-2 py-3.5 text-center">
                          <span
                            className="inline-block h-2.5 w-2.5 rounded-full border border-gray-300 bg-white"
                            aria-label={`${row.intent} — ${e.label}: not fired`}
                          />
                        </td>
                      )
                    }
                    // Perplexity exposes related questions, not fired searches — render a ring.
                    if (e.key === "perplexity") {
                      return (
                        <td key={e.key} className="px-2 py-3.5 text-center">
                          <span
                            className={`inline-block h-4 w-4 rounded-full border-2 ${isWhitespace ? "border-amber-600" : "border-accent-700"}`}
                            aria-label={`${row.intent} — Perplexity: related question`}
                          />
                        </td>
                      )
                    }
                    return (
                      <td key={e.key} className="px-2 py-3.5 text-center">
                        <span
                          className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${
                            isWhitespace ? "bg-amber-600" : "bg-accent-700"
                          }`}
                          aria-label={`${row.intent} — ${e.label}: fired`}
                        >
                          <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 12 12" fill="none">
                            <path d="M2.5 6.2 5 8.5 9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <figcaption className="flex items-center justify-between border-t border-gray-100 px-5 py-3 sm:px-7">
        <span className="font-mono text-[11px] text-gray-500">3 shared · 3 whitespace shown</span>
        <Link
          href="/tools/query-fanout"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-accent-700 hover:text-accent-800"
        >
          Run your own
          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h6m0 0L6 3m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </figcaption>
    </figure>
  )
}
