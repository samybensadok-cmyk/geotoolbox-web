import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Domain Overview — AI visibility command center",
  description:
    "Every citation, competitor, and topical authority signal for your domain, aggregated across every scan. The dashboard agencies and brand teams keep open all day.",
}

const headlineStats = [
  { label: "AI visibility", value: "72", unit: "/100", trend: "+8", positive: true },
  { label: "Cited pages", value: "34", unit: "pages", trend: "+5", positive: true },
  { label: "AI competitors", value: "12", unit: "domains", trend: "+2", positive: false },
  { label: "Co-cited with", value: "47", unit: "domains", trend: "+12", positive: true },
]

const citedPages = [
  { url: "/blog/ai-seo-guide", cites: 18, engines: ["ChatGPT", "Perplexity", "Claude"] },
  { url: "/product/citability", cites: 12, engines: ["Gemini", "AI Overviews"] },
  { url: "/tools/scanner", cites: 9, engines: ["ChatGPT", "Perplexity"] },
  { url: "/blog/what-is-geo", cites: 7, engines: ["Claude", "Bing Copilot"] },
]

const aiCompetitors = [
  { domain: "ahrefs.com", share: 87, delta: "+4" },
  { domain: "semrush.com", share: 62, delta: "-3" },
  { domain: "moz.com", share: 48, delta: "+1" },
  { domain: "searchenginejournal.com", share: 41, delta: "+6" },
]

const sections = [
  {
    tag: "Top cited pages",
    title: "Which URLs AI actually recommends",
    body: "Ranked by citation count across all engines and scans. Each page shows which engines cite it, verbatim quoted phrases, and inbound AI traffic if GSC is connected.",
  },
  {
    tag: "AI competitors",
    title: "Who shows up when you don't",
    body: "Aggregated from every prompt you've scanned. Share-of-voice per competitor, week-over-week delta, and which prompts they win that you lose.",
  },
  {
    tag: "Co-cited domains",
    title: "Your AI citation neighborhood",
    body: "Domains frequently cited alongside yours. Useful for backlink targets, partnership ideas, and understanding what AI considers the authoritative cluster for your topics.",
  },
  {
    tag: "Topical authority",
    title: "What AI thinks you're about",
    body: "Entity extraction across all cited pages. Shows the topics AI associates with your brand, gaps where you should exist but don't, and drift over time.",
  },
  {
    tag: "GSC enhancement",
    title: "Citations + real traffic",
    body: "Connect Search Console and the overview cross-references AI-cited URLs with actual clicks and impressions. Spot pages that get AI love but no organic traffic (or vice versa).",
  },
  {
    tag: "Recommended actions",
    title: "What to do this week",
    body: "Prioritized action list based on the patterns in your data. 'These 3 pages should be cited but aren't — here's why.' Shows the specific Content Analyzer fixes that matter most.",
  },
]

export default function DomainOverviewPage() {
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
                Domain Overview
              </p>
              <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
                The command center for your AI visibility.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
                Every scan, every citation, every competitor — aggregated. The dashboard agencies and brand teams keep open all day to track how AI sees their domain.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/app" className="rounded-full bg-gray-900 px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-xl hover:shadow-gray-900/10 active:translate-y-[1px]">
                  See your first overview
                </Link>
                <Link href="#whats-inside" className="rounded-full border border-gray-200 px-6 py-3.5 text-[15px] font-medium text-gray-700 hover:border-gray-400 hover:text-gray-900">
                  What's inside
                </Link>
              </div>
            </div>

            {/* Dashboard visual */}
            <div className="lg:col-span-6" aria-hidden="true">
              <div className="relative rounded-[2rem] border border-gray-200 bg-white p-6 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.12)] sm:p-8">
                {/* Domain header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="relative inline-flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
                    </span>
                    <span className="font-mono text-[13px] font-semibold text-gray-900">stubgroup.com</span>
                  </div>
                  <span className="font-mono text-[11px] text-gray-500">updated 4m ago</span>
                </div>

                {/* Headline stats grid */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {headlineStats.map((s) => (
                    <div key={s.label} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600">{s.label}</p>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="font-mono text-xl font-bold tabular-nums text-gray-900">{s.value}</span>
                        <span className="font-mono text-[10px] text-gray-500">{s.unit}</span>
                      </div>
                      <p className={`mt-0.5 font-mono text-[10px] font-semibold ${s.positive ? "text-accent-700" : "text-red-600"}`}>
                        {s.trend} wk
                      </p>
                    </div>
                  ))}
                </div>

                {/* Cited pages */}
                <div className="mt-5">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-600 mb-2">Top cited pages</p>
                  <div className="divide-y divide-gray-100">
                    {citedPages.slice(0, 3).map((p) => (
                      <div key={p.url} className="flex items-center justify-between py-2">
                        <span className="truncate font-mono text-[12px] text-gray-700">{p.url}</span>
                        <span className="font-mono text-[11px] font-semibold text-accent-700 tabular-nums">
                          {p.cites} cites
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's inside */}
      <section id="whats-inside" className="bg-gray-50 px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[5fr_7fr] lg:items-end lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">What's inside</p>
              <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-gray-900">
                Six views of your AI footprint.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-gray-600">
              Every view updates automatically as you scan. No manual refresh, no scheduled cron to remember — the overview rebuilds itself on a 7-day rolling window.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
            {sections.map((s) => (
              <div key={s.tag}>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">{s.tag}</p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight text-gray-900">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI competitors visual */}
      <section className="bg-white px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">AI competitors</p>
              <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-gray-900">
                Who wins when you lose.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-gray-600">
                Share-of-voice across every prompt you've scanned. Ranked by how often AI recommends them instead of you, with week-over-week movement.
              </p>
              <Link href="/app" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-700">
                Run your first overview
                <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-[2rem] border border-gray-200 bg-white p-6 sm:p-8 shadow-[0_20px_40px_-20px_rgba(15,23,42,0.08)]">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-600">
                    Top 4 of 12 · share of voice
                  </span>
                  <span className="font-mono text-[11px] text-gray-500">30 days</span>
                </div>
                <div className="mt-4 divide-y divide-gray-100">
                  {aiCompetitors.map((c) => {
                    const positive = c.delta.startsWith("+")
                    return (
                      <div key={c.domain} className="py-4">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[13px] font-medium text-gray-900">{c.domain}</span>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-sm font-semibold tabular-nums text-gray-900">{c.share}%</span>
                            <span className={`font-mono text-[11px] font-semibold ${positive ? "text-accent-700" : "text-red-600"}`}>{c.delta}</span>
                          </div>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                          <div className="h-full rounded-full bg-accent-500" style={{ width: `${c.share}%` }} />
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

      {/* CTA */}
      <section className="bg-gray-950 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              Open your overview.
            </h2>
            <p className="mt-2 text-base text-gray-300">Runs on every scan you do. Free while in beta.</p>
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
