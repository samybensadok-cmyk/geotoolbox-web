import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Features",
  description:
    "Seven connected tools for generative engine optimization (GEO) and AI search visibility. Scan, analyze, brief, and monitor your brand across ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews, and Bing Copilot.",
}

const groups = [
  {
    label: "Scanning",
    features: [
      {
        slug: "geo-scan",
        name: "GEO Scan",
        blurb: "Run a single prompt across 6 AI engines and see who gets cited. Your domain, competitors, and every mention, in minutes.",
        highlights: ["6 AI engines", "8 countries", "Competitor comparison"],
        deepLink: true,
      },
    ],
  },
  {
    label: "Analysis",
    features: [
      {
        slug: "content-analyzer",
        name: "Content Analyzer",
        blurb: "Grade any page from A to F for AI citability. Checks 19 signals across schema, bot access, freshness, structure, and entity clarity, and tells you what to fix.",
        highlights: ["19 signals", "Multi-bot access check", "A–F score"],
        deepLink: true,
      },
      {
        slug: "content-brief",
        name: "Content Brief & Draft",
        blurb: "Brief any keyword, draft the article, grade the result. Dual scoring (structure + AI readiness), entity checklist, facts coverage, and SERP gap analysis.",
        highlights: ["Brief + inline draft", "Dual scoring", "PDF / XLSX export"],
        deepLink: true,
      },
    ],
  },
  {
    label: "Intelligence",
    features: [
      {
        slug: "domain-overview",
        name: "Domain Overview",
        blurb: "A command-center view of everything AI says about your domain. Top cited pages, AI competitors, co-cited domains, and topical authority, all on one screen.",
        highlights: ["Cross-scan aggregation", "Co-cited domains", "GSC-enhanced"],
        deepLink: true,
      },
      {
        slug: "competitor-intel",
        name: "Competitor Intel",
        blurb: "Track how competitors gain or lose AI citations over time. Content gap matrix, SERP feature ownership, and AI threat alerts when they start outranking you.",
        highlights: ["Content gap matrix", "SERP ownership", "Threat alerts"],
        deepLink: true,
      },
      {
        slug: "community",
        name: "Community",
        blurb: "See which Reddit and forum threads AI engines cite when answering queries in your space. Catch misinformation, find subreddits worth engaging.",
        highlights: ["Reddit + forums", "Misinformation risks", "Action plan"],
        deepLink: true,
      },
    ],
  },
  {
    label: "Reporting",
    features: [
      {
        slug: "analytics",
        name: "Analytics (GSC + GA4)",
        blurb: "Connect Google Search Console and GA4. See AI-driven traffic, which pages get AI citations, and whether your AI visibility is converting to sessions.",
        highlights: ["GSC + GA4 connect", "13 sub-dashboards", "AI traffic attribution"],
        deepLink: true,
      },
    ],
  },
]

export default function FeaturesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white px-6 pt-20 pb-16 sm:pt-28 sm:pb-20">
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
        </div>
      </section>

      {/* Feature groups */}
      <section className="bg-white px-6 pb-24 sm:pb-32">
        {/* Mobile sticky jump-nav */}
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
            const groupColor = {
              Scanning: { dot: "bg-accent-500", border: "border-l-accent-500", eyebrow: "text-accent-700", highlight: "bg-accent-500", pillHover: "hover:border-accent-400 hover:text-accent-800" },
              Analysis: { dot: "bg-emerald-500", border: "border-l-emerald-500", eyebrow: "text-emerald-700", highlight: "bg-emerald-500", pillHover: "hover:border-emerald-400 hover:text-emerald-800" },
              Intelligence: { dot: "bg-indigo-500", border: "border-l-indigo-500", eyebrow: "text-indigo-700", highlight: "bg-indigo-500", pillHover: "hover:border-indigo-400 hover:text-indigo-800" },
              Reporting: { dot: "bg-amber-500", border: "border-l-amber-500", eyebrow: "text-amber-700", highlight: "bg-amber-500", pillHover: "hover:border-amber-400 hover:text-amber-800" },
            }[group.label] || { dot: "bg-gray-400", border: "border-l-gray-400", eyebrow: "text-gray-700", highlight: "bg-gray-400", pillHover: "hover:border-gray-400 hover:text-gray-900" }

            return (
              <div
                key={group.label}
                id={`group-${group.label.toLowerCase()}`}
                className="scroll-mt-28 grid grid-cols-1 gap-8 py-12 lg:grid-cols-[4fr_8fr] lg:gap-16 lg:py-16"
              >
                {/* Group label */}
                <div className="lg:sticky lg:top-20 lg:h-fit">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${groupColor.dot}`} />
                    <p className={`font-mono text-[11px] font-semibold uppercase tracking-widest ${groupColor.eyebrow}`}>
                      {group.label}
                    </p>
                  </div>
                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900">
                    {group.label === "Scanning" && "See who's cited"}
                    {group.label === "Analysis" && "Grade what you own"}
                    {group.label === "Intelligence" && "Know the field"}
                    {group.label === "Reporting" && "Measure the outcome"}
                  </h2>
                </div>

              {/* Features in group */}
              <div className="flex flex-col gap-10">
                {group.features.map((f) => (
                  <div key={f.name} className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto] md:items-start md:gap-8">
                    <div>
                      <h3 className="text-lg font-semibold tracking-tight text-gray-900">
                        {f.name}
                      </h3>
                      <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-gray-600">
                        {f.blurb}
                      </p>
                      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                        {f.highlights.map((h) => (
                          <li key={h} className="flex items-center gap-2 text-[13px] text-gray-700">
                            <span className={`h-1.5 w-1.5 rounded-full ${groupColor.highlight}`} />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="md:pt-1">
                      {f.deepLink && f.slug ? (
                        <Link
                          href={`/features/${f.slug}`}
                          className={`group/pill inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-[13px] font-semibold text-gray-900 transition-colors ${groupColor.pillHover}`}
                        >
                          Learn more
                          <svg className="h-3.5 w-3.5 transition-transform group-hover/pill:translate-x-0.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </Link>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 font-mono text-[11px] text-gray-600">
                          In your scan
                        </span>
                      )}
                    </div>
                  </div>
                ))}
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
                One scan unlocks all seven.
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
                Start free trial
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
