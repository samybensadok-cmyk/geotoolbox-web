import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { RelatedFeatures } from "@/components/features/related-features"
import { FeatureFaq } from "@/components/features/feature-faq"

export const metadata: Metadata = {
  title: "Analytics — GSC + GA4 for AI search attribution",
  description:
    "Connect Google Search Console and GA4. See AI-driven traffic, cited-vs-clicked pages, and attribute real sessions to your AI visibility — not just impressions.",
}

const subDashboards = [
  { tag: "Overview", desc: "Headline metrics + weekly trend", cat: "Core" },
  { tag: "Compare", desc: "Two periods, side by side", cat: "Core" },
  { tag: "Quick Wins", desc: "Ranked pages with fixable issues", cat: "Opportunity" },
  { tag: "Content Decay", desc: "Pages losing impressions over time", cat: "Opportunity" },
  { tag: "Click Potential", desc: "High-impression, low-CTR pages", cat: "Opportunity" },
  { tag: "Cannibalization", desc: "Pages competing for same keywords", cat: "Diagnostic" },
  { tag: "Health", desc: "Indexation, coverage, crawl errors", cat: "Diagnostic" },
  { tag: "Trajectory", desc: "12-month history per query", cat: "Diagnostic" },
  { tag: "Pages", desc: "Every URL, click-share %", cat: "Deep dive" },
  { tag: "Sections", desc: "By URL path segment", cat: "Deep dive" },
  { tag: "Keywords", desc: "Query-level view, intent-classified", cat: "Deep dive" },
  { tag: "Keyword Cloud", desc: "Visual weight by click share", cat: "Deep dive" },
  { tag: "Clusters", desc: "Semantic grouping of queries", cat: "Deep dive" },
]

const aiTraffic = [
  { source: "ChatGPT", sessions: 487, delta: "+23%" },
  { source: "Perplexity", sessions: 342, delta: "+41%" },
  { source: "AI Overviews", sessions: 203, delta: "+18%" },
  { source: "Gemini", sessions: 128, delta: "+8%" },
  { source: "Claude", sessions: 94, delta: "+12%" },
  { source: "Bing Copilot", sessions: 67, delta: "+4%" },
]

const faqs = [
  {
    question: "Are GSC and GA4 both required?",
    answer:
      "GSC is required — it's the source for query and page performance data. GA4 is optional but recommended, because it unlocks attribution: which AI-cited pages actually drove sessions.",
  },
  {
    question: "Is Analytics available to everyone yet?",
    answer:
      "Not quite. Google OAuth verification is in progress; access is currently on the test-user list. Email hello@geotoolbox.ai to be added.",
  },
  {
    question: "What are the 13 sub-dashboards?",
    answer:
      "Overview, Compare, Quick Wins, Content Decay, Click Potential, Cannibalization, Health, Trajectory, Pages, Sections, Keywords, Keyword Cloud, and Clusters. Each answers a different question.",
  },
  {
    question: "What does intent classification do?",
    answer:
      "Every query is auto-tagged as informational, commercial, navigational, or transactional. Filter any view by intent to see whether your AI citations convert or just look good.",
  },
  {
    question: "Is my GSC data stored on your servers?",
    answer:
      "GSC data is cached in your browser via localStorage, scoped per property and period. Only OAuth tokens and scan results live server-side.",
  },
]

const outcomes = [
  {
    tag: "AI traffic attribution",
    title: "Cited AND clicked",
    body: "Every AI-cited URL cross-referenced with GA4 session data. See which citations actually drive traffic, which don't, and which pages have the inverse problem — clicks without citations.",
  },
  {
    tag: "13 sub-dashboards",
    title: "Not just another GSC wrapper",
    body: "Overview, Compare, Quick Wins, Content Decay, Click Potential, Cannibalization, Health, Trajectory, Pages, Sections, Keywords, Clusters. Every view answers a different question.",
  },
  {
    tag: "Intent classification",
    title: "What queries actually mean",
    body: "Every query auto-tagged informational / commercial / navigational / transactional. Filter any view by intent — know whether your AI citations convert or just look good.",
  },
  {
    tag: "Cluster view",
    title: "Topical authority, measured",
    body: "Queries grouped by semantic similarity. See which topic clusters you own, which you're losing, and where a handful of related queries share the same underlying opportunity.",
  },
]

export default function AnalyticsPage() {
  return (
    <>
      {/* Hero — cool clinical atmosphere */}
      <section className="bg-[var(--surface-cool)] px-6 pt-20 pb-16 sm:pt-24 sm:pb-20">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs featureName="Analytics" />

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="lg:col-span-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">
                Analytics (GSC + GA4)
              </p>
              <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
                AI citations, attributed to real traffic.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
                Connect Search Console and GA4. See AI-driven sessions, cited-vs-clicked pages, and 13 sub-dashboards built for the AI-search era — not a generic GSC rewrapper.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/app" prefetch={false} className="rounded-full bg-accent-900 px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-accent-800 hover:shadow-xl hover:shadow-accent-900/25 active:translate-y-[1px]">
                  Connect GSC + GA4
                </Link>
                <Link href="#dashboards" className="rounded-full border border-gray-200 px-6 py-3.5 text-[15px] font-medium text-gray-700 hover:border-gray-400 hover:text-gray-900">
                  See all 13 views
                </Link>
              </div>
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="8" cy="8" r="6.5" />
                  <path d="M8 5v3.5M8 11.25v.01" strokeLinecap="round" />
                </svg>
                <p className="text-[13px] leading-relaxed text-amber-900">
                  <span className="font-semibold">Beta access:</span> Google OAuth verification is in progress. Email{" "}
                  <a href="mailto:hello@geotoolbox.ai" className="font-semibold text-amber-900 underline underline-offset-2 hover:no-underline">
                    hello@geotoolbox.ai
                  </a>{" "}
                  to be added to the test user list.
                </p>
              </div>
            </div>

            {/* AI traffic visual */}
            <div className="lg:col-span-6" aria-hidden="true">
              <div className="relative rounded-[2rem] border border-gray-200 bg-white p-6 sm:p-8 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.12)]">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-600">
                    AI traffic · last 30 days
                  </span>
                  <span className="rounded-full bg-accent-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-accent-700">
                    GA4 connected
                  </span>
                </div>
                <div className="mt-4 flex items-end gap-3 font-mono">
                  <p className="text-4xl font-bold tabular-nums text-gray-900">1,321</p>
                  <p className="pb-1 text-sm text-gray-600">AI-attributed sessions</p>
                  <p className="pb-1 ml-auto text-sm font-semibold text-accent-700">+27%</p>
                </div>
                <div className="mt-5 divide-y divide-gray-100">
                  {aiTraffic.map((t) => {
                    const pct = Math.round((t.sessions / 1321) * 100)
                    return (
                      <div key={t.source} className="py-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] font-medium text-gray-900">{t.source}</span>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[13px] font-semibold tabular-nums text-gray-900">{t.sessions}</span>
                            <span className="font-mono text-[11px] font-semibold text-accent-700">{t.delta}</span>
                          </div>
                        </div>
                        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-gray-100">
                          <div className="h-full rounded-full bg-accent-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13 sub-dashboards */}
      <section id="dashboards" className="bg-gray-50 px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[5fr_7fr] lg:items-end lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">13 sub-dashboards</p>
              <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-gray-900">
                Every question has its own view.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-gray-600">
              Most analytics tools dump GSC into a single dashboard and call it a feature. We split GSC + GA4 into 13 answer-shaped views, grouped by what you're actually trying to figure out.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subDashboards.map((d) => {
              const tint = {
                Core: "border-l-accent-500 bg-accent-50/40",
                Opportunity: "border-l-emerald-500 bg-emerald-50/40",
                Diagnostic: "border-l-amber-500 bg-amber-50/40",
                "Deep dive": "border-l-slate-500 bg-slate-50/60",
              }[d.cat] || "border-l-gray-400"
              const catTextTint = {
                Core: "text-accent-700",
                Opportunity: "text-emerald-700",
                Diagnostic: "text-amber-700",
                "Deep dive": "text-slate-600",
              }[d.cat] || "text-gray-500"
              return (
                <div
                  key={d.tag}
                  className={`rounded-2xl border border-gray-200 border-l-[3px] ${tint} bg-white p-5 transition-shadow hover:shadow-[0_12px_24px_-12px_rgba(15,23,42,0.12)]`}
                >
                  <p className={`font-mono text-[10px] font-semibold uppercase tracking-widest ${catTextTint}`}>
                    {d.cat}
                  </p>
                  <h3 className="mt-2 text-base font-semibold tracking-tight text-gray-900">{d.tag}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-gray-600">{d.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="bg-white px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">What makes it different</p>
            <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-gray-900">
              Analytics built for AI-era search.
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

      <RelatedFeatures current="analytics" related={["domain-overview", "geo-scan", "content-analyzer"]} />

      {/* CTA */}
      <section className="bg-gray-950 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              Connect your analytics.
            </h2>
            <p className="mt-2 text-base text-gray-300">
              Free while in beta. Google OAuth verification in progress — email{" "}
              <a href="mailto:hello@geotoolbox.ai" className="font-semibold text-white underline underline-offset-2 hover:text-accent-400">
                hello@geotoolbox.ai
              </a>{" "}
              to be whitelisted.
            </p>
          </div>
          <Link href="/app" prefetch={false} className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 active:translate-y-[1px]">
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
