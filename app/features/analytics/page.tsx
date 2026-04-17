import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { RelatedFeatures } from "@/components/features/related-features"
import { FeatureFaq } from "@/components/features/feature-faq"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { softwareApplicationSchema, breadcrumbsSchema } from "@/lib/seo-schema"

export const metadata: Metadata = {
  title: "Analytics: GSC + GA4 for AI search tracking",
  description:
    "Connect Google Search Console and GA4 for AI search tracking. See AI-driven traffic, cited-vs-clicked pages, and attribute real sessions to your AI visibility, not just impressions. 13 sub-dashboards built for generative engine optimization reporting.",
  openGraph: {
    title: "Analytics: GSC + GA4 for AI search tracking",
    description:
      "Connect Google Search Console and GA4 for AI search tracking. See AI-driven traffic, cited-vs-clicked pages, and attribute real sessions to your AI visibility, not just impressions.",
  },
  alternates: { canonical: `${siteConfig.url}/features/analytics` },
}

type Viz = "bars" | "sparkDown" | "sparkUp" | "gauge" | "rows" | "dots" | "scatter" | "cloud" | "clusters" | "grid" | "compare"

const subDashboards: { tag: string; desc: string; cat: string; viz: Viz }[] = [
  { tag: "Overview",       desc: "Headline metrics + weekly trend",      cat: "Core",        viz: "grid" },
  { tag: "Compare",        desc: "Two periods, side by side",             cat: "Core",        viz: "compare" },
  { tag: "Quick Wins",     desc: "Ranked pages with fixable issues",      cat: "Opportunity", viz: "gauge" },
  { tag: "Content Decay",  desc: "Pages losing impressions over time",    cat: "Opportunity", viz: "sparkDown" },
  { tag: "Click Potential",desc: "High-impression, low-CTR pages",        cat: "Opportunity", viz: "sparkUp" },
  { tag: "Cannibalization",desc: "Pages competing for same keywords",     cat: "Diagnostic",  viz: "scatter" },
  { tag: "Health",         desc: "Indexation, coverage, crawl errors",    cat: "Diagnostic",  viz: "dots" },
  { tag: "Trajectory",     desc: "12-month history per query",            cat: "Diagnostic",  viz: "sparkUp" },
  { tag: "Pages",          desc: "Every URL, click-share %",              cat: "Deep dive",   viz: "rows" },
  { tag: "Sections",       desc: "By URL path segment",                   cat: "Deep dive",   viz: "bars" },
  { tag: "Keywords",       desc: "Query-level view, intent-classified",   cat: "Deep dive",   viz: "rows" },
  { tag: "Keyword Cloud",  desc: "Visual weight by click share",          cat: "Deep dive",   viz: "cloud" },
  { tag: "Clusters",       desc: "Semantic grouping of queries",          cat: "Deep dive",   viz: "clusters" },
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
    question: "What does the Analytics tab show?",
    answer:
      "Your Google Search Console and GA4 data, layered with AI citation data from GEO Toolbox. You can see whether AI-cited pages actually drive traffic. That's the missing attribution layer in most AI visibility tools.",
  },
  {
    question: "How do I connect Google Search Console?",
    answer:
      "One-click OAuth: authorize access, select your property, and your GSC data is live in the dashboard. No API keys, no CSV imports. (Google OAuth verification is still in progress, so email samy@geotoolbox.ai to be added to the test user list for early access.)",
  },
  {
    question: "Does it support Google Analytics 4 (GA4)?",
    answer:
      "Yes. GA4 integration shows AI-driven traffic metrics alongside your GSC data, using the same OAuth flow and the same one-screen view.",
  },
  {
    question: "What is AI traffic in the Analytics view?",
    answer:
      "Traffic arriving from AI-powered search surfaces like Google AI Overviews, ChatGPT with browsing, Perplexity, and Bing Copilot, segmented from traditional organic traffic. If it's a session that came via an AI citation, you'll see it here.",
  },
  {
    question: "Can I see which keywords bring AI traffic vs. traditional traffic?",
    answer:
      "Yes. The view overlays AI citation status on your keyword performance data. You see which queries earn AI citations, which drive organic traffic, and where they overlap. That overlap is where your fastest ROI lives.",
  },
  {
    question: "Is my Search Console data stored on your servers?",
    answer:
      "Connection credentials are stored securely. Query data is fetched on-demand from the Google API and cached locally in your browser per property and period for performance. Only OAuth tokens and scan results live server-side.",
  },
]

const outcomes = [
  {
    tag: "AI traffic attribution",
    title: "Cited AND clicked",
    body: "Every AI-cited URL cross-referenced with GA4 session data. See which citations actually drive traffic, which don't, and which pages have the inverse problem (clicks without citations).",
  },
  {
    tag: "13 sub-dashboards",
    title: "Not just another GSC wrapper",
    body: "Overview, Compare, Quick Wins, Content Decay, Click Potential, Cannibalization, Health, Trajectory, Pages, Sections, Keywords, Clusters. Every view answers a different question.",
  },
  {
    tag: "Intent classification",
    title: "What queries actually mean",
    body: "Every query auto-tagged informational, commercial, navigational, or transactional. Filter any view by intent to know whether your AI citations convert or just look good.",
  },
  {
    tag: "Cluster view",
    title: "Topical authority, measured",
    body: "Queries grouped by semantic similarity. See which topic clusters you own, which you're losing, and where a handful of related queries share the same underlying opportunity.",
  },
]

/**
 * Pictogram — tiny 56x32 SVG that hints at the shape of each dashboard view.
 * Stroke color is passed in (matches the card's group accent) so the whole
 * zone reads as visually consistent. Each picto is decorative (aria-hidden).
 */
function Pictogram({ kind, color }: { kind: Viz; color: string }) {
  const stroke = color
  const base = { width: 56, height: 32, viewBox: "0 0 56 32", fill: "none", "aria-hidden": true, className: "shrink-0" }

  switch (kind) {
    case "bars":
      return (
        <svg {...base}>
          <rect x="4"  y="18" width="6" height="10" rx="1" fill={stroke} opacity="0.35" />
          <rect x="14" y="10" width="6" height="18" rx="1" fill={stroke} opacity="0.55" />
          <rect x="24" y="6"  width="6" height="22" rx="1" fill={stroke} opacity="0.75" />
          <rect x="34" y="14" width="6" height="14" rx="1" fill={stroke} opacity="0.5" />
          <rect x="44" y="4"  width="6" height="24" rx="1" fill={stroke} />
        </svg>
      )
    case "sparkDown":
      return (
        <svg {...base}>
          <polyline
            points="4,6 14,11 22,9 30,16 38,21 46,24 52,28"
            stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
          />
          <circle cx="52" cy="28" r="2" fill={stroke} />
        </svg>
      )
    case "sparkUp":
      return (
        <svg {...base}>
          <polyline
            points="4,26 14,22 22,24 30,16 38,12 46,8 52,4"
            stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
          />
          <circle cx="52" cy="4" r="2" fill={stroke} />
        </svg>
      )
    case "gauge":
      return (
        <svg {...base}>
          <path d="M6 26 A 22 22 0 0 1 50 26" stroke={stroke} strokeWidth="2" opacity="0.25" fill="none" strokeLinecap="round" />
          <path d="M6 26 A 22 22 0 0 1 38 7"  stroke={stroke} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="38" cy="7" r="2.5" fill={stroke} />
        </svg>
      )
    case "rows":
      return (
        <svg {...base}>
          <rect x="4"  y="6"  width="44" height="3" rx="1.5" fill={stroke} opacity="0.85" />
          <rect x="4"  y="14" width="32" height="3" rx="1.5" fill={stroke} opacity="0.55" />
          <rect x="4"  y="22" width="38" height="3" rx="1.5" fill={stroke} opacity="0.35" />
        </svg>
      )
    case "dots":
      return (
        <svg {...base}>
          <circle cx="8"  cy="10" r="3" fill={stroke} />
          <circle cx="20" cy="10" r="3" fill={stroke} />
          <circle cx="32" cy="10" r="3" fill={stroke} opacity="0.35" />
          <circle cx="8"  cy="22" r="3" fill={stroke} opacity="0.35" />
          <circle cx="20" cy="22" r="3" fill={stroke} />
          <circle cx="32" cy="22" r="3" fill={stroke} />
          <circle cx="44" cy="16" r="3" fill={stroke} opacity="0.55" />
        </svg>
      )
    case "scatter":
      // two overlapping circles — cannibalization
      return (
        <svg {...base}>
          <circle cx="20" cy="16" r="10" stroke={stroke} strokeWidth="2" fill={stroke} fillOpacity="0.12" />
          <circle cx="34" cy="16" r="10" stroke={stroke} strokeWidth="2" fill={stroke} fillOpacity="0.12" />
        </svg>
      )
    case "cloud":
      // keyword cloud — varied-size tokens
      return (
        <svg {...base}>
          <rect x="4"  y="10" width="14" height="6" rx="2" fill={stroke} opacity="0.85" />
          <rect x="22" y="6"  width="18" height="8" rx="2" fill={stroke} />
          <rect x="44" y="11" width="10" height="5" rx="1.5" fill={stroke} opacity="0.5" />
          <rect x="8"  y="20" width="8"  height="4" rx="1.5" fill={stroke} opacity="0.35" />
          <rect x="20" y="18" width="12" height="6" rx="2" fill={stroke} opacity="0.65" />
          <rect x="36" y="20" width="16" height="5" rx="1.5" fill={stroke} opacity="0.85" />
        </svg>
      )
    case "clusters":
      // three grouped dot clusters
      return (
        <svg {...base}>
          <circle cx="9"  cy="10" r="2" fill={stroke} />
          <circle cx="14" cy="14" r="2" fill={stroke} />
          <circle cx="10" cy="18" r="2" fill={stroke} />
          <circle cx="28" cy="8"  r="2" fill={stroke} />
          <circle cx="32" cy="13" r="2" fill={stroke} />
          <circle cx="26" cy="16" r="2" fill={stroke} />
          <circle cx="44" cy="12" r="2" fill={stroke} />
          <circle cx="48" cy="18" r="2" fill={stroke} />
          <circle cx="43" cy="22" r="2" fill={stroke} />
        </svg>
      )
    case "grid":
      // KPI grid — 2x2 rounded tiles
      return (
        <svg {...base}>
          <rect x="6"  y="4"  width="20" height="11" rx="2" fill={stroke} opacity="0.65" />
          <rect x="30" y="4"  width="20" height="11" rx="2" fill={stroke} opacity="0.35" />
          <rect x="6"  y="19" width="20" height="11" rx="2" fill={stroke} opacity="0.5" />
          <rect x="30" y="19" width="20" height="11" rx="2" fill={stroke} opacity="0.85" />
        </svg>
      )
    case "compare":
      // side-by-side bar clusters, 2 periods
      return (
        <svg {...base}>
          <rect x="6"  y="14" width="4" height="14" rx="1" fill={stroke} opacity="0.35" />
          <rect x="12" y="8"  width="4" height="20" rx="1" fill={stroke} opacity="0.55" />
          <rect x="18" y="4"  width="4" height="24" rx="1" fill={stroke} opacity="0.75" />
          <rect x="32" y="10" width="4" height="18" rx="1" fill={stroke} opacity="0.55" />
          <rect x="38" y="16" width="4" height="12" rx="1" fill={stroke} opacity="0.75" />
          <rect x="44" y="6"  width="4" height="22" rx="1" fill={stroke} />
          <path d="M26 6 v20" stroke={stroke} strokeWidth="1" opacity="0.25" strokeDasharray="2 2" />
        </svg>
      )
    default:
      return null
  }
}

export default function AnalyticsPage() {
  return (
    <>
      {/* Hero — cool clinical atmosphere */}
      <section className="bg-[var(--surface-cool)] px-6 pt-20 pb-16 sm:pt-24 sm:pb-20">
      <JsonLd data={[
        softwareApplicationSchema({
          name: "Analytics",
          description: "GSC and GA4 rebuilt around AI citations. Quick wins, content decay, click share, and cannibalization detection across 12 sub-tabs.",
          url: `${siteConfig.url}/features/analytics`,
        }),
        breadcrumbsSchema([
          { name: "Home", url: "/" },
          { name: "Features", url: "/features" },
          { name: "Analytics", url: "/features/analytics" },
        ]),
      ]} />

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
                Connect Search Console and GA4. See AI-driven sessions, cited-vs-clicked pages, and 13 sub-dashboards built for the AI-search era, not a generic GSC rewrapper.
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
                  <a href="mailto:samy@geotoolbox.ai" className="font-semibold text-amber-900 underline underline-offset-2 hover:no-underline">
                    samy@geotoolbox.ai
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

          {/* Grouped by intent as 4 bento zones. Each zone has its own tinted
              panel + dot accent + subtitle, making the category coding
              genuinely visual instead of a 3px left border. Cards inside use
              white tiles with per-card mini-pictograms that hint at what the
              view actually looks like (bars/sparkline/gauge/dots/etc). */}
          <div className="mt-14 space-y-6">
            {(["Core", "Opportunity", "Diagnostic", "Deep dive"] as const).map((cat) => {
              const items = subDashboards.filter((d) => d.cat === cat)
              const zone = {
                Core:         { bg: "bg-accent-50/50",   border: "border-accent-100",   dot: "bg-accent-500",   text: "text-accent-700",   pictoHex: "#0f766e" },
                Opportunity:  { bg: "bg-emerald-50/50",  border: "border-emerald-100",  dot: "bg-emerald-500",  text: "text-emerald-700",  pictoHex: "#059669" },
                Diagnostic:   { bg: "bg-amber-50/60",    border: "border-amber-100",    dot: "bg-amber-500",    text: "text-amber-700",    pictoHex: "#b45309" },
                "Deep dive":  { bg: "bg-slate-100/50",   border: "border-slate-200",    dot: "bg-slate-500",    text: "text-slate-700",    pictoHex: "#475569" },
              }[cat]
              const gridCols = {
                Core:        "sm:grid-cols-2",
                Opportunity: "sm:grid-cols-2 lg:grid-cols-3",
                Diagnostic:  "sm:grid-cols-2 lg:grid-cols-3",
                "Deep dive": "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
              }[cat]
              const subtitle = {
                Core:        "Start here. Headline metrics + period comparison.",
                Opportunity: "Three places to move the needle fastest.",
                Diagnostic:  "What's broken, what's slipping, what's competing.",
                "Deep dive": "Per-URL, per-query, per-intent drill-downs.",
              }[cat]
              return (
                <div
                  key={cat}
                  className={`rounded-3xl border ${zone.border} ${zone.bg} p-5 sm:p-7`}
                >
                  {/* Zone header */}
                  <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block h-2 w-2 rounded-full ${zone.dot}`} aria-hidden="true" />
                      <p className={`font-mono text-[11px] font-semibold uppercase tracking-widest ${zone.text}`}>
                        {cat}
                      </p>
                      <span className="font-mono text-[11px] text-gray-500">
                        &middot; {items.length} {items.length === 1 ? "view" : "views"}
                      </span>
                    </div>
                    <span className="text-[13px] text-gray-600">{subtitle}</span>
                  </div>

                  {/* Tile grid */}
                  <div className={`grid grid-cols-1 gap-3 ${gridCols}`}>
                    {items.map((d) => (
                      <div
                        key={d.tag}
                        className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-[0_12px_24px_-12px_rgba(15,23,42,0.14)]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="text-[15px] font-semibold tracking-tight text-gray-900">
                              {d.tag}
                            </h3>
                            <p className="mt-1 text-[13px] leading-relaxed text-gray-600">
                              {d.desc}
                            </p>
                          </div>
                          <Pictogram kind={d.viz} color={zone.pictoHex} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Inline CTA at peak intent — echoes the hero CTA with OAuth context */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-6">
            <p className="text-[13px] text-gray-500">
              Example views &mdash; yours populate once GSC + GA4 are connected.
            </p>
            <Link
              href="/app"
              prefetch={false}
              className="inline-flex items-center gap-1.5 rounded-sm text-[13px] font-semibold text-accent-700 transition-colors duration-200 hover:text-accent-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
            >
              Connect Search Console to see these for your site
              <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
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
              Free while in beta. Google OAuth verification in progress; email{" "}
              <a href="mailto:samy@geotoolbox.ai" className="font-semibold text-white underline underline-offset-2 hover:text-accent-400">
                samy@geotoolbox.ai
              </a>{" "}
              to be whitelisted.
            </p>
          </div>
          <Link href="/app" prefetch={false} className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 active:translate-y-[1px]">
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
