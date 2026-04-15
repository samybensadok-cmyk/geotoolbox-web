import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { RelatedFeatures } from "@/components/features/related-features"
import { FeatureFaq } from "@/components/features/feature-faq"

export const metadata: Metadata = {
  title: "GEO Scan: AI visibility tool + ChatGPT rank tracker",
  description:
    "Run generative engine optimization (GEO) scans across ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews, and Bing Copilot. The AI search tracking tool that shows who's cited, who isn't, and how you compare to competitors, in minutes.",
  openGraph: {
    title: "GEO Scan: AI visibility tool + ChatGPT rank tracker",
    description:
      "Run generative engine optimization scans across six AI engines. The AI search tracking tool that shows who's cited, who isn't, and how you compare to competitors, in minutes.",
  },
}

const engines = [
  { name: "ChatGPT", status: "Cited", variant: "cited", delay: 0 },
  { name: "Perplexity", status: "Cited", variant: "cited", delay: 120 },
  { name: "Gemini", status: "Not found", variant: "missing", delay: 0 },
  { name: "Claude", status: "Mentioned", variant: "cited", delay: 240 },
  { name: "AI Overviews", status: "Recommended", variant: "cited", delay: 360 },
  { name: "Bing Copilot", status: "Not found", variant: "missing", delay: 0 },
]

const steps = [
  {
    num: "01",
    verb: "Ask",
    title: "A real query",
    body: "Enter the keyword or question your customers would ask an AI. Short keywords or natural questions both work.",
    output: "best CRM software for small business",
  },
  {
    num: "02",
    verb: "Run",
    title: "Six engines in parallel",
    body: "We query ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews, and Bing Copilot with identical prompts in your chosen country.",
    output: "8 countries · 6 live engines",
  },
  {
    num: "03",
    verb: "See",
    title: "The full citation map",
    body: "Each engine's verbatim response, whether your domain was cited, which competitors appeared, and a 0–100 visibility score.",
    output: "72/100 visibility · 4 competitors",
  },
]

const faqs = [
  {
    question: "What AI engines does GEO Scan check?",
    answer:
      "Six today: ChatGPT, Perplexity, Claude, Gemini, Google AI Overviews, and Bing Copilot. Every generative engine optimization (GEO) scan queries all six in parallel so you see your full AI search visibility picture in one pass.",
  },
  {
    question: "How does GEO Scan determine if my brand is cited?",
    answer:
      "We submit your keyword as a real user query, then parse each AI response for explicit domain mentions and direct citations. You get a per-engine status (cited, mentioned, or missing) plus the verbatim snippet where your brand appears.",
  },
  {
    question: "Can I scan keywords for markets outside the US?",
    answer:
      "Yes. GEO Scan supports eight markets: United States, United Kingdom, Australia, Canada, Ireland, France, Spain, and Germany. Engines with native locale support (Google AI Overviews, Gemini) query in-country; the others receive localized prompt augmentation so the response reflects the chosen market.",
  },
  {
    question: "How is this different from traditional rank tracking?",
    answer:
      "Traditional rank trackers measure blue-link positions on a SERP. GEO Scan measures a different signal altogether: whether AI-generated answers cite your brand at all. It's answer engine optimization (AEO), not ranking. There's no top 10 to climb, just whether your domain is or isn't in the generated response.",
  },
  {
    question: "Can I compare my domain against competitors in the same scan?",
    answer:
      "Yes. Add up to four competitor domains and the scan returns side-by-side citation status for each, across all six engines. You'll see which prompts they win, which they lose, and the citations they earn that you don't.",
  },
  {
    question: "How often should I run scans for the same keyword?",
    answer:
      "AI responses are non-deterministic, so weekly is the sweet spot for tracking AI visibility trends. Every scan is stored; the trajectory feeds Domain Overview automatically so you can spot citation drift before it compounds.",
  },
  {
    question: "Can I export my scan results?",
    answer:
      "Yes. CSV, PDF, and XLSX exports are free and available without an account. Use them to brief writers, update leadership, or feed citation data into your own LLM SEO dashboards.",
  },
]

const outcomes = [
  {
    tag: "Live search",
    title: "Not training data",
    body: "Every engine is queried in real time with live web search. You see what your customers see today, not what the model memorized six months ago.",
  },
  {
    tag: "Competitor deltas",
    title: "Know who beats you",
    body: "Add up to four competitor domains. We show which prompts they win, which they lose, and the citations they earn that you don't.",
  },
  {
    tag: "Country-aware",
    title: "8 markets, localized",
    body: "US, GB, AU, CA, IE, FR, ES, DE. Engines that support locale (AI Overviews, Gemini) run natively; the others get prompt augmentation.",
  },
  {
    tag: "History + trends",
    title: "Track over time",
    body: "Every scan is stored. Weekly score trend, per-engine trajectory, and competitor movement all appear on Domain Overview.",
  },
]

export default function GeoScanPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white px-6 pt-20 pb-16 sm:pt-24 sm:pb-20">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs featureName="GEO Scan" />

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="lg:col-span-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">
                GEO Scan
              </p>
              <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
                See who AI cites for your keywords.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
                One prompt, six engines, every citation. Your domain, competitors, and a visibility score from 0 to 100, in minutes, without training-data guesses.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/app" prefetch={false}
                  className="rounded-full bg-accent-900 px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-accent-800 hover:shadow-xl hover:shadow-accent-900/25 active:translate-y-[1px]"
                >
                  Run a scan
                </Link>
                <Link
                  href="#how"
                  className="rounded-full border border-gray-200 px-6 py-3.5 text-[15px] font-medium text-gray-700 hover:border-gray-400 hover:text-gray-900"
                >
                  How it works
                </Link>
              </div>
              <p className="mt-4 text-xs text-gray-600">
                No credit card &middot; Free while in beta
              </p>
            </div>

            {/* Scan result visual */}
            <div className="lg:col-span-6" aria-hidden="true">
              <div className="relative rounded-[2rem] border border-gray-200 bg-white p-6 sm:p-8 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.12)]">
                <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 font-mono text-[13px] text-gray-700">
                  <svg className="h-4 w-4 shrink-0 text-accent-600" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="9" r="6" />
                    <path d="m14 14 3.5 3.5" strokeLinecap="round" />
                  </svg>
                  <span className="truncate">best CRM software for small business</span>
                </div>
                <div className="mt-5 divide-y divide-gray-100">
                  {engines.map((e) => {
                    const isMentioned = e.status === "Mentioned"
                    const dotClass = e.variant === "cited"
                      ? (isMentioned ? "bg-amber-500" : "bg-accent-500")
                      : "border border-gray-300"
                    const pingClass = e.variant === "cited"
                      ? (isMentioned ? "bg-amber-400" : "bg-accent-400")
                      : ""
                    const textClass = e.variant === "cited"
                      ? (isMentioned ? "text-amber-700" : "text-accent-700")
                      : "text-gray-500"
                    return (
                      <div key={e.name} className="flex items-center justify-between py-2.5">
                        <span className="text-sm font-medium text-gray-800">{e.name}</span>
                        <div className="flex items-center gap-2.5">
                          {e.variant === "cited" ? (
                            <span className="relative inline-flex h-2 w-2">
                              <span
                                className={`absolute inline-flex h-full w-full animate-ping rounded-full ${pingClass} opacity-60`}
                                style={{ animationDelay: `${e.delay}ms` }}
                              />
                              <span className={`relative inline-flex h-2 w-2 rounded-full ${dotClass}`} />
                            </span>
                          ) : (
                            <span className={`h-2 w-2 rounded-full ${dotClass}`} />
                          )}
                          <span className={`text-xs font-semibold tabular-nums ${textClass}`}>
                            {e.status}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-5 flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-600">Visibility</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-mono text-xl font-bold tabular-nums text-gray-900">57</span>
                    <span className="font-mono text-xs text-gray-500">/100</span>
                    <span className="ml-2 text-xs font-semibold text-accent-700">+8 wk</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-white px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[5fr_7fr] lg:items-end lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">How it works</p>
              <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-gray-900">
                From prompt to citation map in three steps.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-gray-600">
              No integrations. No tagging. No waiting. The scan runs in parallel across every supported engine and returns a visibility score you can defend to your CMO.
            </p>
          </div>

          <ol className="mt-14 divide-y divide-gray-200">
            {steps.map((s) => (
              <li key={s.num} className="grid grid-cols-1 gap-6 py-8 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-10 md:py-10">
                <div className="flex items-center gap-4 md:block">
                  <span className="font-mono text-4xl font-bold tabular-nums text-accent-700 md:text-5xl">
                    {s.num}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 md:hidden">
                    {s.verb}
                  </span>
                </div>
                <div>
                  <p className="hidden text-xs font-semibold uppercase tracking-widest text-gray-500 md:block">
                    {s.verb}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight text-gray-900">{s.title}</h3>
                  <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-gray-600">{s.body}</p>
                </div>
                <div className="md:text-right">
                  <p className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 font-mono text-[12px] text-gray-700">
                    <svg className="h-3 w-3 text-accent-600" viewBox="0 0 12 12" fill="none">
                      <path d="M3 6h6m0 0L6 3m3 3L6 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="truncate">{s.output}</span>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Outcomes */}
      <section className="bg-gray-50 px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">What makes it different</p>
            <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-gray-900">
              Built for the AI search reality.
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
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

      {/* CTA */}
      <section className="bg-gray-950 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              Run your first GEO Scan.
            </h2>
            <p className="mt-2 text-base text-gray-300">
              Free while in beta. No credit card. Results in minutes.
            </p>
          </div>
          <Link
            href="/app" prefetch={false}
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 active:translate-y-[1px]"
          >
            Start free trial
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  )
}
