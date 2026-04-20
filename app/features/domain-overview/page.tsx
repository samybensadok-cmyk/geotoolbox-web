import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { RelatedFeatures } from "@/components/features/related-features"
import { FeatureFaq } from "@/components/features/feature-faq"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { softwareApplicationSchema, breadcrumbsSchema } from "@/lib/seo-schema"

export const metadata: Metadata = {
  title: "Domain Overview: AI brand monitoring dashboard",
  description:
    "Every citation, AI competitor, co-cited domain, and topical authority signal for your domain, aggregated across every scan. AI brand monitoring for ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews, and Bing Copilot. The dashboard agencies keep open all day.",
  openGraph: {
    title: "Domain Overview: AI brand monitoring dashboard",
    description:
      "Every citation, AI competitor, co-cited domain, and topical authority signal for your domain, aggregated across every scan. AI brand monitoring for six engines in one dashboard.",
  },
  alternates: { canonical: `${siteConfig.url}/features/domain-overview` },
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

const faqs = [
  {
    question: "What data does Domain Overview pull together?",
    answer:
      "Your entire AI visibility footprint in one view: top cited pages, AI competitors, co-cited domains, topical authority, keyword volume, and a prioritized action list. Scan history feeds it automatically; the search APIs layered on top keep the picture current even before you've built up scan depth.",
  },
  {
    question: "What are co-cited domains?",
    answer:
      "Domains that AI engines consistently mention alongside yours when answering questions in your space. These are your peers in the AI knowledge graph. Use them as backlink targets, partnership leads, or signals for where to expand your content.",
  },
  {
    question: "Do I need to run scans first before using Domain Overview?",
    answer:
      "The overview is richer with scan history, since that's where AI competitors and cited pages come from. But it also pulls fresh data from search APIs independently, so the snapshot is useful even on day one.",
  },
  {
    question: "Can I see which of my pages get cited most?",
    answer:
      "Yes. The Top Cited Pages section ranks your URLs by how frequently AI engines reference them, with the verbatim snippets they use. If Google Search Console is connected, each page also shows its organic clicks and impressions side-by-side.",
  },
  {
    question: "What is the Topical Authority section?",
    answer:
      "It maps the topic clusters where AI engines consider your domain an authority versus where competitors dominate. Built from entity extraction across every cited page, so you can see AI visibility by topic, not just by URL.",
  },
  {
    question: "Can I connect Google Search Console to enrich the overview?",
    answer:
      "Yes. One-click GSC integration overlays organic traffic data on your AI citation data. You see where AI citations drive real sessions, and where pages get clicks but no citations (or vice versa).",
  },
]

const sections = [
  {
    num: "01",
    tag: "Top cited pages",
    title: "Which URLs AI actually recommends",
    body: "Ranked by citation count across all engines and scans. Each page shows which engines cite it, verbatim quoted phrases, and inbound AI traffic if GSC is connected.",
  },
  {
    num: "02",
    tag: "AI competitors",
    title: "Who shows up when you don't",
    body: "Aggregated from every prompt you've scanned. Share-of-voice per competitor, week-over-week delta, and which prompts they win that you lose.",
  },
  {
    num: "03",
    tag: "Co-cited domains",
    title: "Your AI citation neighborhood",
    body: "Domains frequently cited alongside yours. Useful for backlink targets, partnership ideas, and understanding what AI considers the authoritative cluster for your topics.",
  },
  {
    num: "04",
    tag: "Topical authority",
    title: "What AI thinks you're about",
    body: "Entity extraction across all cited pages. Shows the topics AI associates with your brand, gaps where you should exist but don't, and drift over time.",
  },
  {
    num: "05",
    tag: "GSC enhancement",
    title: "Citations + real traffic",
    body: "Connect Search Console and the overview cross-references AI-cited URLs with actual clicks and impressions. Spot pages that get AI love but no organic traffic (or vice versa).",
  },
  {
    num: "06",
    tag: "Recommended actions",
    title: "What to do this week",
    body: "Prioritized action list based on the patterns in your data. 'These 3 pages should be cited but aren't. Here's why.' Shows the specific Content Analyzer fixes that matter most.",
  },
]

export default function DomainOverviewPage() {
  return (
    <>
      {/* Hero — steel atmosphere (command-center / dashboard feel) */}
      <section className="relative overflow-hidden bg-[var(--surface-steel)] px-6 pt-20 pb-16 sm:pt-24 sm:pb-20">
      <JsonLd data={[
        softwareApplicationSchema({
          name: "Domain Overview",
          description: "Your AI visibility command center. Track citation share, co-cited domains, cited pages, and AI competitors for any domain over time.",
          url: `${siteConfig.url}/features/domain-overview`,
        }),
        breadcrumbsSchema([
          { name: "Home", url: "/" },
          { name: "Features", url: "/features" },
          { name: "Domain Overview", url: "/features/domain-overview" },
        ]),
      ]} />

        <div className="mx-auto max-w-7xl">
          <Breadcrumbs featureName="Domain Overview" />

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="lg:col-span-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">
                Domain Overview
              </p>
              <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
                The command center for your AI visibility.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
                Every scan, every citation, every competitor, aggregated. The dashboard agencies and brand teams keep open all day to track how AI sees their domain.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/app" prefetch={false} className="rounded-full bg-accent-900 px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-accent-800 hover:shadow-xl hover:shadow-accent-900/25 active:translate-y-[1px]">
                  See your first overview
                </Link>
                <Link href="#whats-inside" className="rounded-full border border-gray-200 px-6 py-3.5 text-[15px] font-medium text-gray-700 hover:border-gray-400 hover:text-gray-900">
                  What's inside
                </Link>
              </div>
            </div>

            {/* Dashboard visual — dark command-center treatment */}
            <div className="lg:col-span-6" aria-hidden="true">
              <div className="relative rounded-[2rem] border border-gray-800 bg-[var(--surface-ink)] p-6 shadow-[0_30px_80px_-20px_rgba(11,18,32,0.45)] sm:p-8">
                {/* Subtle grid overlay */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-[2rem] opacity-[0.05]"
                  style={{
                    backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />
                <div className="relative">
                  {/* Domain header */}
                  <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="relative inline-flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-400" />
                      </span>
                      <span className="font-mono text-[13px] font-semibold text-white">acme.co</span>
                    </div>
                    <span className="font-mono text-[11px] text-gray-500">updated 4m ago</span>
                  </div>

                  {/* Headline stats grid */}
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {headlineStats.map((s) => (
                      <div key={s.label} className="rounded-xl border border-gray-800 bg-gray-900/40 p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">{s.label}</p>
                        <div className="mt-1 flex items-baseline gap-1.5">
                          <span className="font-mono text-xl font-bold tabular-nums text-white">{s.value}</span>
                          <span className="font-mono text-[10px] text-gray-500">{s.unit}</span>
                        </div>
                        <p className={`mt-0.5 font-mono text-[10px] font-semibold ${s.positive ? "text-accent-400" : "text-red-400"}`}>
                          {s.trend} wk
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Cited pages */}
                  <div className="mt-5">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-2">Top cited pages</p>
                    <div className="divide-y divide-gray-800">
                      {citedPages.slice(0, 3).map((p) => (
                        <div key={p.url} className="flex items-center justify-between py-2">
                          <span className="truncate font-mono text-[12px] text-gray-300">{p.url}</span>
                          <span className="font-mono text-[11px] font-semibold text-accent-400 tabular-nums">
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
              Every view updates automatically as you scan. No manual refresh, no scheduled cron to remember. The overview rebuilds itself on a 7-day rolling window.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
            {sections.map((s) => (
              <div key={s.tag} className="relative pl-12">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 font-mono text-[22px] font-bold tabular-nums leading-none text-gray-300"
                >
                  {s.num}
                </span>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                  {s.tag}
                </p>
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
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">Share-of-voice tracker</p>
              <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-gray-900">
                Track share-of-voice over time.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-gray-600">
                Every competitor that shows up in your AI results, ranked by how often they get recommended instead of you. Week-over-week movement makes it obvious the day a new rival starts winning your prompts.
              </p>
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
                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-[13px] text-gray-500">Example data &mdash; your chart updates automatically.</span>
                  <Link
                    href="/app"
                    prefetch={false}
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent-700 hover:text-accent-900"
                  >
                    Scan your domain to see yours
                    <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeatureFaq items={faqs} />

      <RelatedFeatures current="domain-overview" related={["geo-scan", "competitor-intel", "analytics"]} />

      {/* CTA */}
      <section className="bg-gray-950 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              Open your overview.
            </h2>
            <p className="mt-2 text-base text-gray-300">Builds on every scan you run. Free while in beta &middot; 1,000 credits/month included.</p>
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
