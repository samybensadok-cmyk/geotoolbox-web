import Link from "next/link"

const faqs = [
  {
    q: "How do I see where AI cites my brand?",
    a: "Run a GEO scan and get a visibility score from 0 to 100, verbatim citation snippets, and a side-by-side competitor read-out across all six engines. That baseline is where every answer engine optimization (AEO) program starts.",
  },
  {
    q: "Why isn't AI citing my pages?",
    a: "Grade any URL from A to F on 19 signals: schema markup, AI bot access, entity clarity, freshness, and answer-first formatting. AI crawlers can't cite what they can't read. The audit maps every signal to a specific fix.",
  },
  {
    q: "What do I change to get cited?",
    a: "Brief and draft content AI will actually quote. You get a framework-aware outline (pillar, cluster, comparison, or FAQ), an entity checklist, competitor facts coverage, and dual Structure and AI Readiness scoring. Answer-first content, built to earn citations.",
  },
  {
    q: "How do I know my changes are working?",
    a: "Run a baseline scan, ship your changes, re-scan. GEO Toolbox keeps scan history so you can see the before/after visibility score, new citation snippets you picked up, and which engines moved. Schedule weekly or monthly auto-scans to watch the trend line in Domain Overview. Indexing speed varies by engine, but every scan cycle makes progress observable.",
  },
  {
    q: "What's the difference between GEO, AEO, and LLM SEO?",
    a: "Three names for the same job: being the source AI engines cite when your customer asks a question. Generative engine optimization (GEO) covers the full workflow across ChatGPT, Perplexity, Claude, Gemini, Google AI Overviews, and Bing Copilot. Answer engine optimization (AEO) focuses on earning citations in answer engines specifically. LLM SEO is the crawler-facing work: robots.txt, schema markup, entity clarity, and bot access. GEO Toolbox covers all three.",
  },
]

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.a,
    },
  })),
}

export function Playbook() {
  return (
    <section className="bg-[var(--surface-warm)] px-6 py-24 sm:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="mx-auto max-w-7xl">
        {/* Editorial header — asymmetric, matches marketing voice */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[5fr_7fr] lg:items-end lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">
              The playbook
            </p>
            <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-tight tracking-tight text-gray-900">
              The five questions AI searchers keep asking.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-gray-600">
            Short answers to the things visitors ask about generative engine optimization, AI visibility, LLM SEO, and AI citation tracking. Tap any question to expand.
          </p>
        </div>

        {/* FAQ accordion — native <details>, no JS, progressive disclosure */}
        <dl className="mt-16 divide-y divide-[var(--surface-warm-border)]">
          {faqs.map((f, i) => (
            <details
              key={f.q}
              {...(i === 0 ? { open: true } : {})}
              className="group py-6 md:py-7"
            >
              <summary className="flex cursor-pointer items-start justify-between gap-6 list-none [&::-webkit-details-marker]:hidden">
                <dt className="text-lg font-semibold tracking-tight text-gray-900 md:text-xl">
                  {f.q}
                </dt>
                <span
                  aria-hidden="true"
                  className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--surface-warm-border)] bg-white/60 text-accent-700 transition-transform duration-200 group-open:rotate-45"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 2v10M2 7h10" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <dd className="mt-4 max-w-3xl text-[15px] leading-relaxed text-gray-600 md:text-base">
                {f.a}
              </dd>
            </details>
          ))}
        </dl>

        {/* Single outbound link for readers who want the full guide */}
        <div className="mt-12 border-t border-[var(--surface-warm-border)] pt-8">
          <Link
            href="/blog/what-is-geo"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-700 hover:text-accent-800"
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
