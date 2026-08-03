/**
 * VerdictBox — review-summary card for product-review posts. Drop it right
 * after the "short answer" section: rating with visible stars, best-for line,
 * price/trial facts, pros/cons columns, and a single affiliate CTA.
 *
 * The CTA href must be a `/go/<slug>` affiliate redirect; the box renders the
 * link with the sponsored rel set itself (raw JSX <a> in components bypasses
 * the MDX anchor override). Pair the post with a `review:` frontmatter block
 * so the matching Review schema is emitted (lib/seo-schema.ts reviewSchema).
 *
 * Registered in components/mdx/index.tsx so MDX can use it directly.
 */

type VerdictBoxProps = {
  /** Product name, e.g. "Semrush" */
  name: string
  /** Rating on a 1–5 scale, e.g. 4.25 — rendered as fractional stars */
  rating: number
  /** One-line "best for" audience */
  bestFor: string
  /** Price-from line, e.g. "$117.33/mo billed annually" */
  priceFrom: string
  /** Trial line, e.g. "7-day free trial (card required)" */
  trial?: string
  pros: string[]
  cons: string[]
  /** Affiliate CTA — must be a /go/ redirect */
  ctaHref: string
  ctaLabel: string
  /** Small line under the CTA, defaults to the affiliate note */
  ctaNote?: string
}

function Stars({ rating }: { rating: number }) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100))
  const row = "★★★★★"
  return (
    <span
      className="relative inline-block align-middle text-[22px] leading-none tracking-[2px]"
      role="img"
      aria-label={`Rated ${rating} out of 5`}
    >
      <span aria-hidden="true" className="text-gray-300">
        {row}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap text-amber-500"
        style={{ width: `${pct}%` }}
      >
        {row}
      </span>
    </span>
  )
}

export function VerdictBox({
  name,
  rating,
  bestFor,
  priceFrom,
  trial,
  pros,
  cons,
  ctaHref,
  ctaLabel,
  ctaNote = "Affiliate link — we may earn a commission. It never changes the verdict.",
}: VerdictBoxProps) {
  return (
    <aside
      className="not-prose my-8 rounded-2xl border border-[var(--surface-warm-border)] bg-[var(--surface-warm)] p-6 sm:p-7"
      aria-label={`${name} verdict summary`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-amber-800">
          Our verdict
        </p>
        <div className="flex items-center gap-2.5">
          <Stars rating={rating} />
          <span className="text-[15px] font-bold text-gray-900">{rating}/5</span>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 text-[14.5px] sm:grid-cols-2">
        <div className="flex gap-2">
          <dt className="shrink-0 font-semibold text-gray-900">Best for:</dt>
          <dd className="text-gray-700">{bestFor}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0 font-semibold text-gray-900">From:</dt>
          <dd className="text-gray-700">{priceFrom}</dd>
        </div>
        {trial && (
          <div className="flex gap-2 sm:col-span-2">
            <dt className="shrink-0 font-semibold text-gray-900">Trial:</dt>
            <dd className="text-gray-700">{trial}</dd>
          </div>
        )}
      </dl>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-green-700">
            What earns the rating
          </p>
          <ul className="space-y-1.5 text-[13.5px] leading-snug text-gray-700">
            {pros.map((p) => (
              <li key={p} className="flex gap-2">
                <span aria-hidden="true" className="mt-px shrink-0 font-semibold text-green-600">
                  +
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-red-700">
            What costs it
          </p>
          <ul className="space-y-1.5 text-[13.5px] leading-snug text-gray-700">
            {cons.map((c) => (
              <li key={c} className="flex gap-2">
                <span aria-hidden="true" className="mt-px shrink-0 font-semibold text-red-500">
                  –
                </span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6">
        <a
          href={ctaHref}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-accent-900 px-6 py-3 text-[14.5px] font-semibold text-white transition-all duration-200 hover:bg-accent-800 hover:shadow-xl hover:shadow-accent-900/25 active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
        >
          {ctaLabel}
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        <p className="mt-2 text-[12px] text-gray-500">{ctaNote}</p>
      </div>
    </aside>
  )
}
