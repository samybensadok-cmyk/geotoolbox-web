import type { Metadata } from "next"
import Link from "next/link"

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
  { tag: "Clusters", desc: "Semantic grouping of queries", cat: "Deep dive" },
]

const aiTraffic = [
  { source: "ChatGPT", sessions: 487, delta: "+23%" },
  { source: "Perplexity", sessions: 342, delta: "+41%" },
  { source: "Gemini", sessions: 128, delta: "+8%" },
  { source: "Claude", sessions: 94, delta: "+12%" },
]

const outcomes = [
  {
    tag: "AI traffic attribution",
    title: "Cited AND clicked",
    body: "Every AI-cited URL cross-referenced with GA4 session data. See which citations actually drive traffic, which don't, and which pages have the inverse problem — clicks without citations.",
  },
  {
    tag: "12 sub-dashboards",
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
      {/* Hero */}
      <section className="bg-white px-6 pt-20 pb-16 sm:pt-24 sm:pb-20">
        <div className="mx-auto max-w-7xl">
          <Link href="/features" className="mb-8 inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-600 hover:text-accent-700">
            <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 7H4m0 0 3-3m-3 3 3 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            All features
          </Link>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="lg:col-span-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">
                Analytics (GSC + GA4)
              </p>
              <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
                AI citations, attributed to real traffic.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
                Connect Search Console and GA4. See AI-driven sessions, cited-vs-clicked pages, and 12 sub-dashboards built for the AI-search era — not a generic GSC rewrapper.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/app" className="rounded-full bg-gray-900 px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-xl hover:shadow-gray-900/10 active:translate-y-[1px]">
                  Connect your data
                </Link>
                <Link href="#dashboards" className="rounded-full border border-gray-200 px-6 py-3.5 text-[15px] font-medium text-gray-700 hover:border-gray-400 hover:text-gray-900">
                  See all 12 views
                </Link>
              </div>
              <p className="mt-4 text-xs text-gray-600">
                Beta: Google OAuth verification in progress. Email{" "}
                <a href="mailto:hello@geotoolbox.ai" className="font-semibold text-accent-700 hover:underline">
                  hello@geotoolbox.ai
                </a>{" "}
                to be added to the test user list.
              </p>
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
                  <p className="text-4xl font-bold tabular-nums text-gray-900">1,051</p>
                  <p className="pb-1 text-sm text-gray-600">sessions</p>
                  <p className="pb-1 ml-auto text-sm font-semibold text-accent-700">+27%</p>
                </div>
                <div className="mt-5 divide-y divide-gray-100">
                  {aiTraffic.map((t) => {
                    const pct = Math.round((t.sessions / 1051) * 100)
                    return (
                      <div key={t.source} className="py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{t.source}</span>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-sm font-semibold tabular-nums text-gray-900">{t.sessions}</span>
                            <span className="font-mono text-[11px] font-semibold text-accent-700">{t.delta}</span>
                          </div>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
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

      {/* 12 sub-dashboards */}
      <section id="dashboards" className="bg-gray-50 px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[5fr_7fr] lg:items-end lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">12 sub-dashboards</p>
              <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-gray-900">
                Every question has its own view.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-gray-600">
              Most analytics tools dump GSC into a single dashboard and call it a feature. We split GSC + GA4 into 12 answer-shaped views, grouped by what you're actually trying to figure out.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subDashboards.map((d) => (
              <div key={d.tag} className="rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-[0_12px_24px_-12px_rgba(15,23,42,0.12)]">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">{d.cat}</p>
                <h3 className="mt-2 text-base font-semibold tracking-tight text-gray-900">{d.tag}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-gray-600">{d.desc}</p>
              </div>
            ))}
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
          <Link href="/app" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 active:translate-y-[1px]">
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
