type FAQItem = { question: string; answer: string }

export function FeatureFaq({ items, heading = "Frequently asked" }: { items: FAQItem[]; heading?: string }) {
  if (items.length === 0) return null

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }

  return (
    <section className="border-t border-gray-100 bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
            FAQ
          </p>
          <h2 className="mt-2 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            {heading}
          </h2>
        </div>

        <ul className="space-y-3">
          {items.map((item, i) => (
            <li key={i}>
              <details className="group rounded-2xl border border-gray-200 bg-white p-6 transition-colors open:border-gray-300">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 [&::-webkit-details-marker]:hidden">
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700 mt-1 tabular-nums shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[17px] font-semibold leading-snug tracking-tight text-gray-900">
                      {item.question}
                    </span>
                  </div>
                  <span
                    aria-hidden="true"
                    className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-transform group-open:rotate-45"
                  >
                    <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 2v8M2 6h8" strokeLinecap="round" />
                    </svg>
                  </span>
                </summary>
                <div className="mt-4 pl-10 text-[15px] leading-relaxed text-gray-700">
                  {item.answer}
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  )
}
