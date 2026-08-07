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
 * IMPORTANT — string props only in MDX. next-mdx-remote/rsc strips JSX
 * expression attributes (`rating={4.25}`, `pros={[...]}`) off MDX components
 * before render (same pipeline constraint that gives BlogImage its string
 * w/h props), so `rating` is a numeric STRING and `pros`/`cons` are
 * pipe-delimited STRINGS: pros="First win|Second win|Third win".
 *
 * Registered in components/mdx/index.tsx so MDX can use it directly.
 */

/**
 * Card chrome, per locale. These are the box's own labels — NOT article content —
 * so they live here rather than in the MDX. `getMdxComponents(locale)` binds the
 * `locale` prop; MDX authors never pass it (next-mdx-remote would strip a JSX
 * expression attribute anyway, and a review post shouldn't have to restate its
 * own furniture).
 *
 * A locale missing from this map falls back to `en`, so adding a new content
 * locale degrades to English chrome rather than crashing — but a localized
 * review article shipping English chrome is a defect, so add the locale here at
 * the same time you add it to `contentLocales`.
 */
const CHROME = {
  en: {
    verdict: "Our verdict",
    bestFor: "Best for:",
    from: "From:",
    trial: "Trial:",
    pros: "What earns the rating",
    cons: "What costs it",
    note: "Affiliate link — we may earn a commission. It never changes the verdict.",
    rated: (r: number) => `Rated ${r} out of 5`,
    summary: (n: string) => `${n} verdict summary`,
  },
  es: {
    verdict: "Nuestro veredicto",
    bestFor: "Ideal para:",
    from: "Desde:",
    trial: "Prueba:",
    pros: "Lo que le da la nota",
    cons: "Lo que se la baja",
    note: "Enlace de afiliado: podemos llevarnos una comisión. Nunca cambia el veredicto.",
    rated: (r: number) => `Puntuación de ${r} sobre 5`,
    summary: (n: string) => `Resumen del veredicto sobre ${n}`,
  },
  fr: {
    verdict: "Notre verdict",
    bestFor: "Idéal pour :",
    from: "À partir de :",
    trial: "Essai :",
    pros: "Ce qui justifie la note",
    cons: "Ce qui la fait baisser",
    note: "Lien affilié : nous pouvons toucher une commission. Cela ne change jamais le verdict.",
    rated: (r: number) => `Note de ${r} sur 5`,
    summary: (n: string) => `Résumé du verdict sur ${n}`,
  },
} as const

type VerdictBoxProps = {
  /** Product name, e.g. "Semrush" */
  name: string
  /** Rating on a 1–5 scale as a string, e.g. "4.25" — rendered as fractional stars */
  rating: string | number
  /** One-line "best for" audience */
  bestFor: string
  /** Price-from line, e.g. "$117.33/mo billed annually" */
  priceFrom: string
  /** Trial line, e.g. "7-day free trial (card required)" */
  trial?: string
  /** Pipe-delimited list: "First win|Second win" (arrays also accepted) */
  pros: string | string[]
  /** Pipe-delimited list: "First cost|Second cost" (arrays also accepted) */
  cons: string | string[]
  /** Affiliate CTA — must be a /go/ redirect */
  ctaHref: string
  ctaLabel: string
  /** Small line under the CTA, defaults to the affiliate note. Pass "" to omit
   *  (e.g. when the article's own disclosure sits directly above the box). */
  ctaNote?: string
  /** Bound by getMdxComponents(locale); selects the card's chrome language. */
  locale?: string
}

function toList(v: string | string[] | undefined): string[] {
  if (Array.isArray(v)) return v
  if (typeof v === "string") return v.split("|").map((s) => s.trim()).filter(Boolean)
  return []
}

function Stars({ rating, ratedLabel }: { rating: number; ratedLabel: string }) {
  const pct = Number.isFinite(rating) ? Math.max(0, Math.min(100, (rating / 5) * 100)) : 0
  const row = "★★★★★"
  return (
    <span
      className="relative inline-block align-middle text-[22px] leading-none tracking-[2px]"
      role="img"
      aria-label={ratedLabel}
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
  rating: ratingProp,
  bestFor,
  priceFrom,
  trial,
  pros: prosProp,
  cons: consProp,
  ctaHref,
  ctaLabel,
  ctaNote,
  locale,
}: VerdictBoxProps) {
  const rating = typeof ratingProp === "number" ? ratingProp : Number.parseFloat(ratingProp)
  const pros = toList(prosProp)
  const cons = toList(consProp)
  const t = CHROME[locale as keyof typeof CHROME] ?? CHROME.en
  // `undefined` takes the locale default; an explicit "" still omits the note.
  const note = ctaNote === undefined ? t.note : ctaNote
  return (
    <aside
      className="not-prose my-8 rounded-2xl border border-[var(--surface-warm-border)] bg-[var(--surface-warm)] p-6 sm:p-7"
      aria-label={t.summary(name)}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-amber-800">
          {t.verdict}
        </p>
        <div className="flex items-center gap-2.5">
          <Stars rating={rating} ratedLabel={t.rated(rating)} />
          <span className="text-[15px] font-bold text-gray-900">{rating}/5</span>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 text-[14.5px] sm:grid-cols-2">
        <div className="flex gap-2">
          <dt className="shrink-0 font-semibold text-gray-900">{t.bestFor}</dt>
          <dd className="text-gray-700">{bestFor}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0 font-semibold text-gray-900">{t.from}</dt>
          <dd className="text-gray-700">{priceFrom}</dd>
        </div>
        {trial && (
          <div className="flex gap-2 sm:col-span-2">
            <dt className="shrink-0 font-semibold text-gray-900">{t.trial}</dt>
            <dd className="text-gray-700">{trial}</dd>
          </div>
        )}
      </dl>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-green-700">
            {t.pros}
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
            {t.cons}
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
        {note ? <p className="mt-2 text-[12px] text-gray-500">{note}</p> : null}
      </div>
    </aside>
  )
}
