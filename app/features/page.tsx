import type { Metadata } from "next"
import Link from "next/link"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { breadcrumbsSchema } from "@/lib/seo-schema"

export const metadata: Metadata = {
  title: "Features",
  description:
    "Seven connected tools for generative engine optimization (GEO) and AI search visibility. Scan, analyze, brief, and monitor your brand across ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews, and Bing Copilot.",
  alternates: { canonical: `${siteConfig.url}/features` },
}

// Per-feature atmospheric tint — matches each feature page's assigned
// --surface-* token in globals.css. The index page becomes a visual
// preview of the 7 moods instead of a flat text list.
const tintMap = {
  mint:  { bg: "bg-[var(--surface-mint)]",  border: "border-[var(--surface-mint-border)]",  accent: "text-accent-700",   dot: "bg-accent-500" },
  lilac: { bg: "bg-[var(--surface-lilac)]", border: "border-[var(--surface-lilac-border)]", accent: "text-indigo-700",   dot: "bg-indigo-500" },
  warm:  { bg: "bg-[var(--surface-warm)]",  border: "border-[var(--surface-warm-border)]",  accent: "text-amber-800",    dot: "bg-amber-600" },
  steel: { bg: "bg-[var(--surface-steel)]", border: "border-[var(--surface-steel-border)]", accent: "text-slate-700",    dot: "bg-slate-500" },
  blush: { bg: "bg-[var(--surface-blush)]", border: "border-[var(--surface-blush-border)]", accent: "text-rose-700",     dot: "bg-rose-500" },
  peach: { bg: "bg-[var(--surface-peach)]", border: "border-[var(--surface-peach-border)]", accent: "text-orange-700",   dot: "bg-orange-500" },
  cool:  { bg: "bg-[var(--surface-cool)]",  border: "border-[var(--surface-cool-border)]",  accent: "text-sky-700",      dot: "bg-sky-500" },
} as const

type TintKey = keyof typeof tintMap

type Feature = {
  slug: string
  name: string
  blurb: string
  highlights: string[]
  tint: TintKey
}

type Group = {
  label: string
  headline: string
  eyebrow: string
  features: Feature[]
}

const groups: Group[] = [
  {
    label: "Scanning",
    eyebrow: "text-accent-700",
    headline: "See who's cited",
    features: [
      {
        slug: "geo-scan",
        name: "GEO Scan",
        blurb: "Run a single prompt across 6 AI engines and see who gets cited. Your domain, competitors, and every mention, in minutes.",
        highlights: ["6 AI engines", "8 countries", "Competitor comparison"],
        tint: "mint",
      },
    ],
  },
  {
    label: "Analysis",
    eyebrow: "text-emerald-700",
    headline: "Grade what you own",
    features: [
      {
        slug: "content-analyzer",
        name: "Content Analyzer",
        blurb: "Grade any page from A to F for AI citability. Checks 19 signals across schema, bot access, freshness, structure, and entity clarity, and tells you what to fix.",
        highlights: ["19 signals", "Multi-bot access check", "A–F score"],
        tint: "lilac",
      },
      {
        slug: "content-brief",
        name: "Content Brief & Draft",
        blurb: "Brief any keyword, draft the article, grade the result. Dual scoring (structure + AI readiness), entity checklist, facts coverage, and SERP gap analysis.",
        highlights: ["Brief + inline draft", "Dual scoring", "PDF / XLSX export"],
        tint: "warm",
      },
    ],
  },
  {
    label: "Intelligence",
    eyebrow: "text-indigo-700",
    headline: "Know the field",
    features: [
      {
        slug: "domain-overview",
        name: "Domain Overview",
        blurb: "A command-center view of everything AI says about your domain. Top cited pages, AI competitors, co-cited domains, and topical authority, all on one screen.",
        highlights: ["Cross-scan aggregation", "Co-cited domains", "GSC-enhanced"],
        tint: "steel",
      },
      {
        slug: "competitor-intel",
        name: "Competitor Intel",
        blurb: "Track how competitors gain or lose AI citations over time. Content gap matrix, SERP feature ownership, and AI threat alerts when they start outranking you.",
        highlights: ["Content gap matrix", "SERP ownership", "Threat alerts"],
        tint: "blush",
      },
      {
        slug: "community",
        name: "Community",
        blurb: "See which Reddit and forum threads AI engines cite when answering queries in your space. Catch misinformation, find subreddits worth engaging.",
        highlights: ["Reddit + forums", "Misinformation risks", "Action plan"],
        tint: "peach",
      },
    ],
  },
  {
    label: "Reporting",
    eyebrow: "text-amber-700",
    headline: "Measure the outcome",
    features: [
      {
        slug: "analytics",
        name: "Analytics (GSC + GA4)",
        blurb: "Connect Google Search Console and GA4. See AI-driven traffic, which pages get AI citations, and whether your AI visibility is converting to sessions.",
        highlights: ["GSC + GA4 connect", "13 sub-dashboards", "AI traffic attribution"],
        tint: "cool",
      },
    ],
  },
]

// Grid column count per group — matches card count so no group has an orphan.
const gridColsByGroup: Record<string, string> = {
  Scanning: "grid-cols-1",                      // 1 card, full-bleed feature
  Analysis: "grid-cols-1 md:grid-cols-2",       // 2 cards
  Intelligence: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3", // 3 cards
  Reporting: "grid-cols-1",                     // 1 card, full-bleed
}

export default function FeaturesPage() {
  return (
    <>
      {/* Hero — plain white with a 7-tint teaser ornament */}
      <section className="bg-white px-6 pt-20 pb-12 sm:pt-28 sm:pb-16">
      <JsonLd data={breadcrumbsSchema([{ name: "Home", url: "/" }, { name: "Features", url: "/features" }])} />

        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[6fr_6fr] lg:items-end lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">
                Features
              </p>
              <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
                Seven tools.
                <br />
                <span className="text-accent-600">One AI visibility stack.</span>
              </h1>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-gray-600">
              Everything you need to measure and own your presence in AI search: running the first scan, grading your pages, tracking competitors, and attributing AI-driven traffic.
            </p>
          </div>

          {/* Atmospheric preview strip — each tool has a distinct mood below.
              Hover pill scrolls to its group. Decorative but telegraphs the
              palette visitors will see when they scroll. */}
          <ul className="mt-10 flex flex-wrap items-center gap-2">
            {groups.flatMap((g) => g.features).map((f) => {
              const t = tintMap[f.tint]
              return (
                <li key={f.slug}>
                  <Link
                    href={`#feature-${f.slug}`}
                    className={`inline-flex items-center gap-2 rounded-full border ${t.border} ${t.bg} px-3 py-1.5 text-[12px] font-semibold text-gray-800 transition-shadow hover:shadow-[0_4px_12px_-4px_rgba(15,23,42,0.12)]`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} aria-hidden="true" />
                    {f.name.replace(" (GSC + GA4)", "")}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* Feature gallery — each card renders in its atmospheric color */}
      <section className="bg-white px-6 pb-24 sm:pb-32">
        {/* Mobile sticky jump-nav — group-level */}
        <nav
          aria-label="Feature groups"
          className="sticky top-14 z-20 -mx-6 mb-10 overflow-x-auto border-b border-gray-200 bg-white/90 px-6 py-3 backdrop-blur-md lg:hidden"
        >
          <ul className="mx-auto flex max-w-7xl gap-2 whitespace-nowrap">
            {groups.map((g) => (
              <li key={g.label}>
                <a
                  href={`#group-${g.label.toLowerCase()}`}
                  className="inline-block rounded-full bg-gray-100 px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-900"
                >
                  {g.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mx-auto max-w-7xl divide-y divide-gray-200">
          {groups.map((group) => {
            const gridCols = gridColsByGroup[group.label] || "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

            return (
              <div
                key={group.label}
                id={`group-${group.label.toLowerCase()}`}
                className="scroll-mt-28 grid grid-cols-1 gap-8 py-12 lg:grid-cols-[4fr_8fr] lg:gap-16 lg:py-16"
              >
                {/* Group label — sticky sidebar on desktop */}
                <div className="lg:sticky lg:top-20 lg:h-fit">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full bg-gray-400`} aria-hidden="true" />
                    <p className={`font-mono text-[11px] font-semibold uppercase tracking-widest ${group.eyebrow}`}>
                      {group.label}
                    </p>
                  </div>
                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900">
                    {group.headline}
                  </h2>
                  <p className="mt-2 text-[13px] text-gray-500">
                    {group.features.length}{" "}
                    {group.features.length === 1 ? "tool" : "tools"}
                  </p>
                </div>

                {/* Feature tinted cards */}
                <div className={`grid gap-5 ${gridCols}`}>
                  {group.features.map((f) => {
                    const t = tintMap[f.tint]
                    return (
                      <Link
                        key={f.slug}
                        href={`/features/${f.slug}`}
                        id={`feature-${f.slug}`}
                        className={`group/card scroll-mt-28 block rounded-2xl border ${t.border} ${t.bg} p-6 transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-16px_rgba(15,23,42,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 sm:p-7`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-lg font-semibold tracking-tight text-gray-900">
                            {f.name}
                          </h3>
                          <span
                            aria-hidden="true"
                            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${t.border} bg-white ${t.accent} transition-transform group-hover/card:translate-x-0.5`}
                          >
                            <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </div>
                        <p className="mt-3 text-[14.5px] leading-relaxed text-gray-700">
                          {f.blurb}
                        </p>
                        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                          {f.highlights.map((h) => (
                            <li key={h} className="flex items-center gap-2 text-[13px] text-gray-700">
                              <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} aria-hidden="true" />
                              {h}
                            </li>
                          ))}
                        </ul>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA — features-index variant with capability pills */}
      <section className="relative overflow-hidden bg-gray-950 px-6 py-20 sm:py-24">
        {/* subtle grid backdrop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[7fr_5fr] lg:items-end lg:gap-16">
            <div>
              <h2 className="text-[clamp(1.5rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-white">
                One scan, all seven tools.
              </h2>
              <p className="mt-3 max-w-xl text-base text-gray-300">
                Run a GEO Scan once and every other capability activates for that domain: Domain Overview, Competitor Intel, Community, and the rest.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-1.5">
                {["GEO Scan", "Domain Overview", "Content Analyzer", "Content Brief", "Competitor Intel", "Analytics", "Community"].map((f) => (
                  <span
                    key={f}
                    className="rounded-full border border-gray-800 bg-gray-900/50 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-400"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-start gap-3 lg:items-end">
              <Link
                href="/app" prefetch={false}
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 active:translate-y-[1px]"
              >
                Try it for free
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <p className="font-mono text-[11px] text-gray-500">
                Free while in beta &middot; No credit card
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
