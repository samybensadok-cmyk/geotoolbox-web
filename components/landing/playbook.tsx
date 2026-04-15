import Link from "next/link"

const steps = [
  {
    num: "01",
    q: "How do I see where AI cites my brand?",
    short: "Measure AI visibility",
    body:
      "Run a GEO scan and get a visibility score from 0 to 100, verbatim citation snippets, and a side-by-side competitor read-out across all six engines. That baseline is where every answer engine optimization (AEO) program starts.",
    tag: "GEO Scan",
    slug: "geo-scan",
    cta: "Scan your domain",
  },
  {
    num: "02",
    q: "Why isn't AI citing my pages?",
    short: "Audit for citability",
    body:
      "Grade any URL from A to F on 19 signals: schema markup, llms.txt, AI bot access, entity clarity, and freshness. AI crawlers can't cite what they can't read. The audit maps every signal to a specific fix.",
    tag: "Content Analyzer",
    slug: "content-analyzer",
    cta: "Audit a URL",
  },
  {
    num: "03",
    q: "What do I change to get cited?",
    short: "Ship answer-first content",
    body:
      "Brief and draft content AI will actually quote. You get a framework-aware outline (pillar, cluster, comparison, or FAQ), an entity checklist, competitor facts coverage, and dual Structure and AI Readiness scoring. Answer-first content, built to earn citations.",
    tag: "Content Brief & Draft",
    slug: "content-brief",
    cta: "Generate a brief",
  },
]

export function Playbook() {
  return (
    <section className="bg-white px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl">
        {/* Editorial header */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[5fr_7fr] lg:items-end lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">
              The playbook
            </p>
            <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-tight tracking-tight text-gray-900">
              How to rank in AI search in three steps.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-gray-600">
            Whether the search happens in ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews, or Bing Copilot, the generative engine optimization workflow is the same: measure, audit, optimize. Each step maps to a GEO Toolbox feature built for the job.
          </p>
        </div>

        {/* 3-step Q&A trace — mirrors HowItWorks pattern but keyword-richer */}
        <ol className="mt-16 divide-y divide-gray-200">
          {steps.map((s) => (
            <li
              key={s.num}
              className="grid grid-cols-1 gap-6 py-10 md:grid-cols-[auto_1fr_auto] md:items-start md:gap-10 md:py-12"
            >
              {/* Step number */}
              <div className="flex items-center gap-4 md:block">
                <span className="font-mono text-4xl font-bold tabular-nums text-accent-700 md:text-5xl">
                  {s.num}
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 md:hidden">
                  {s.short}
                </span>
              </div>

              {/* Content: Question as H3, short description, body */}
              <div>
                <p className="hidden text-xs font-semibold uppercase tracking-widest text-gray-500 md:block">
                  {s.short}
                </p>
                <h3 className="mt-1 text-xl font-semibold tracking-tight text-gray-900 md:text-2xl">
                  {s.q}
                </h3>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-gray-600">
                  {s.body}
                </p>
              </div>

              {/* Link to feature */}
              <div className="md:pt-1 md:text-right">
                <Link
                  href={`/features/${s.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 font-mono text-[12px] font-semibold uppercase tracking-widest text-gray-700 transition-colors hover:border-accent-400 hover:text-accent-800"
                >
                  {s.cta}
                  <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h6m0 0L6 3m3 3L6 9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </li>
          ))}
        </ol>

        {/* Closing line + link to deeper explainer */}
        <div className="mt-10 flex flex-col items-start gap-4 border-t border-gray-100 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-[15px] leading-relaxed text-gray-600">
            GEO, AEO, LLM SEO. Different names for the same job: being the source AI engines cite when your customer asks a question.
          </p>
          <Link
            href="/blog/what-is-geo"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-accent-700 hover:text-accent-800"
          >
            Read the full GEO guide
            <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
