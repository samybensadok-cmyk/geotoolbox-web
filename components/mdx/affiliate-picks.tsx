/**
 * AffiliatePicks — a clickable "quick picks" table for listicles. Drop it near
 * the top of a roundup so a skimming reader can compare the tools worth clicking
 * and reach the right `/go/<slug>` in one tap, instead of scrolling to the first
 * in-body affiliate link at 24–52% depth. Pair it WITH the existing "by job" PNG
 * (keep the PNG as the citable/OG asset; this adds the clickable layer the image
 * can't carry).
 *
 * Why a component and not a hand-written <table>: raw `<a>` inside an MDX table
 * must hand-set `rel` (bcot forgot noopener/noreferrer) and hand-append `?ref`
 * (31 links across three posts shipped untagged, so their clicks bucket as
 * "blog" with no per-placement EPC). This component sets
 * `rel="sponsored nofollow noopener noreferrer"` and builds the `?ref` itself, so
 * a picks table is a few lines of data instead of error-prone markup.
 *
 * IMPORTANT — plain STRING props only in MDX. next-mdx-remote/rsc strips JSX
 * *expression* attributes (`rows={[...]}`, `rows={`...`}`) off MDX components
 * before render (same constraint that gives BlogImage its string w/h props and
 * VerdictBox its pipe-delimited pros/cons), so `rows` must be a quoted string,
 * NOT a `{...}` expression. Rows are separated by `;;` (which survives MDX
 * attribute parsing regardless of how newlines are handled) OR by literal
 * newlines; fields within a row are pipe-delimited. Blank rows are ignored.
 *
 *   <AffiliatePicks
 *     refBase="ahrefs-alternatives-picks"
 *     rows="Semrush | Broadest all-in-one | $139/mo | 7-day trial | semrush-seo ;; SE Ranking | Cheaper all-in-one | $129/mo | 14-day, no card | seranking ;; Mangools | Keyword research | $29/mo | 48-h refund | mangools"
 *   />
 *
 * Row fields, in order (5 required, 1 optional):
 *   name | bestFor | priceFrom | trial | goSlug | ctaLabel?
 * - goSlug is the `/go/<slug>` affiliate slug. The href is built as
 *   `/go/<goSlug>?ref=<refBase>-<goSlug>` for per-placement attribution.
 * - trial may be empty ("") — the cell renders a dash.
 * - ctaLabel defaults to the locale's "Visit" verb; pass it to override per row.
 *
 * Registered (locale-bound) in components/mdx/index.tsx so the chrome — column
 * headers, the CTA verb, and the affiliate note — render in the article's
 * language. A locale missing from CHROME falls back to `en`.
 */

const CHROME = {
  en: {
    tool: "Tool",
    bestFor: "Best for",
    from: "From",
    trial: "Trial",
    visit: "Visit",
    note: "Affiliate links — we may earn a commission at no cost to you. It never changes which tool we recommend.",
    label: "Quick picks",
  },
  es: {
    tool: "Herramienta",
    bestFor: "Ideal para",
    from: "Desde",
    trial: "Prueba",
    visit: "Ver",
    note: "Enlaces de afiliado: podemos llevarnos una comisión sin coste para ti. Nunca cambia qué herramienta recomendamos.",
    label: "Selección rápida",
  },
  fr: {
    tool: "Outil",
    bestFor: "Idéal pour",
    from: "À partir de",
    trial: "Essai",
    visit: "Voir",
    note: "Liens affiliés : nous pouvons toucher une commission sans surcoût pour vous. Cela ne change jamais l'outil que nous recommandons.",
    label: "Sélection rapide",
  },
} as const

type AffiliatePicksProps = {
  /** Affiliate ref prefix, e.g. "ahrefs-alternatives-picks"; each row's href
   *  becomes /go/<goSlug>?ref=<refBase>-<goSlug>. */
  refBase: string
  /** One tool per line: name | bestFor | priceFrom | trial | goSlug | ctaLabel? */
  rows: string
  /** Optional heading; defaults to the locale's "Quick picks". Pass "" to omit. */
  title?: string
  /** Bound by getMdxComponents(locale); selects the table's chrome language. */
  locale?: string
}

type Pick = {
  name: string
  bestFor: string
  priceFrom: string
  trial: string
  goSlug: string
  ctaLabel?: string
}

function parseRows(rows: string): Pick[] {
  return rows
    .split(/\r?\n|;;/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const f = line.split("|").map((s) => s.trim())
      return {
        name: f[0] ?? "",
        bestFor: f[1] ?? "",
        priceFrom: f[2] ?? "",
        trial: f[3] ?? "",
        goSlug: f[4] ?? "",
        ctaLabel: f[5] || undefined,
      }
    })
    .filter((p) => p.name && p.goSlug)
}

export function AffiliatePicks({ refBase, rows, title, locale }: AffiliatePicksProps) {
  const t = CHROME[locale as keyof typeof CHROME] ?? CHROME.en
  const picks = parseRows(rows)
  if (picks.length === 0) return null
  const heading = title === undefined ? t.label : title

  return (
    <div className="not-prose my-8">
      {heading ? (
        <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-amber-800">
          {heading}
        </p>
      ) : null}
      <div className="overflow-x-auto rounded-2xl border border-[var(--surface-warm-border)]">
        <table className="w-full border-collapse text-[14px]">
          <thead>
            <tr className="bg-[var(--surface-warm)] text-left">
              <th className="px-4 py-3 font-semibold text-gray-900">{t.tool}</th>
              <th className="px-4 py-3 font-semibold text-gray-900">{t.bestFor}</th>
              <th className="px-4 py-3 font-semibold text-gray-900">{t.from}</th>
              <th className="px-4 py-3 font-semibold text-gray-900">{t.trial}</th>
              <th className="px-4 py-3">
                <span className="sr-only">{t.visit}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {picks.map((p, i) => {
              const href = `/go/${p.goSlug}?ref=${refBase}-${p.goSlug}`
              return (
                <tr
                  key={`${p.goSlug}-${i}`}
                  className="border-t border-[var(--surface-warm-border)] align-middle"
                >
                  <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{p.name}</td>
                  <td className="px-4 py-3 text-gray-700">{p.bestFor}</td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{p.priceFrom}</td>
                  <td className="px-4 py-3 text-gray-700">{p.trial || "—"}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <a
                      href={href}
                      target="_blank"
                      rel="sponsored nofollow noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-accent-900 px-4 py-2 text-[13px] font-semibold text-white transition-all duration-200 hover:bg-accent-800 hover:shadow-lg hover:shadow-accent-900/25 active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
                    >
                      {p.ctaLabel ?? `${t.visit} ${p.name}`}
                      <svg
                        className="h-3 w-3"
                        viewBox="0 0 14 14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[12px] text-gray-500">{t.note}</p>
    </div>
  )
}
