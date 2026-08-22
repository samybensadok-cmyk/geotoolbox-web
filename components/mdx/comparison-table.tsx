/**
 * ComparisonTable — the designed, responsive, clickable "at a glance" table for
 * listicles. Replaces the static by-job PNG: crisp on every screen, encodes the
 * decisive column as status chips (Included / Add-on / None / Built in), puts a
 * CTA pill only on rows we monetize, highlights our own tool, and collapses to
 * cards on mobile. The PNG can't do any of that.
 *
 * Like AffiliatePicks and VerdictBox, this sets rel="sponsored nofollow noopener
 * noreferrer" + builds ?ref itself on affiliate rows, so a glance table can't
 * ship an untagged link or a missing rel.
 *
 * IMPORTANT — plain STRING props only in MDX. next-mdx-remote/rsc strips JSX
 * *expression* attributes ({...}) before render, so `rows` is a quoted string.
 * Rows are separated by `;;` (survives MDX attribute parsing) or newlines;
 * fields within a row are pipe-delimited, in this order (8 fields):
 *
 *   name | job | price | priceSub | status | statusNote | goSlug | ctaLabel?
 *
 * - status ∈ ok | addon | none | ours  → chip color + auto label (localized).
 *   `ours` also highlights the row, accents the name, and adds an "Our tool" tag.
 * - statusNote: the small grey detail under the chip ("$99/mo per domain"); "" = none.
 * - goSlug: affiliate `/go/<slug>` slug → href `/go/<slug>?ref=<refBase>-<slug>`,
 *   opened in a new tab with the sponsored rel. A value starting with "/" is used
 *   verbatim as an internal link (e.g. `/pricing` for our own tool, no ?ref, same
 *   tab, no sponsored rel). Empty goSlug → no button (renders a muted "—").
 * - ctaLabel: button text; empty → "<Visit> <name>" in the row's locale.
 * - priceSub: small second line under the price ("$117.33 annual"); "" = none.
 *
 *   <ComparisonTable
 *     refBase="ahrefs-alternatives-glance"
 *     rows="Semrush | Broadest all-in-one | $139/mo | $117.33 annual | addon | $99/mo per domain | semrush-seo ;; geotoolbox | AI / GEO visibility | $99/mo | $79 annual | ours | + checks crawler access | /pricing | Try geotoolbox ;; Majestic | Backlinks on a budget | $49.99/mo | | none | | |"
 *   />
 *
 * Registered (locale-bound) in components/mdx/index.tsx so chip labels, the CTA
 * verb, the "Our tool" tag, and the footer note render in the article's language.
 */

const CHROME = {
  en: {
    tool: "Tool", job: "Best job", price: "Entry price", vis: "AI-search visibility",
    ok: "Included", addon: "Add-on", none: "None", builtin: "Built in",
    visit: "Visit", ours: "Our tool",
    note: "Affiliate links may earn us a commission at no cost to you — it never changes the picks. Our own tool is labelled.",
  },
  es: {
    tool: "Herramienta", job: "Mejor trabajo", price: "Precio de entrada", vis: "Visibilidad en IA",
    ok: "Incluida", addon: "Módulo", none: "Ninguna", builtin: "Integrada",
    visit: "Ver", ours: "Nuestra",
    note: "Los enlaces de afiliado pueden darnos una comisión sin coste para ti; nunca cambian la selección. Nuestra herramienta está señalada.",
  },
  fr: {
    tool: "Outil", job: "Idéal pour", price: "Prix d'entrée", vis: "Visibilité IA",
    ok: "Incluse", addon: "Module", none: "Aucune", builtin: "Intégrée",
    visit: "Voir", ours: "Le nôtre",
    note: "Les liens affiliés peuvent nous rémunérer sans surcoût pour vous — cela ne change jamais la sélection. Notre outil est signalé.",
  },
} as const

type ComparisonTableProps = {
  /** Affiliate ref prefix; affiliate rows link to /go/<slug>?ref=<refBase>-<slug>. */
  refBase: string
  /** One row per `;;` (or newline): name|job|price|priceSub|status|statusNote|goSlug|ctaLabel? */
  rows: string
  /** Optional footer note; defaults to the locale disclosure. Pass "" to omit. */
  note?: string
  /** Optional header for the status column; defaults to the locale "AI-search
   *  visibility". Override for pages whose last column is a different axis
   *  (e.g. "AI-citation tracking" on content-optimization roundups). */
  visLabel?: string
  /** Bound by getMdxComponents(locale). */
  locale?: string
}

type Status = "ok" | "addon" | "none" | "ours"
type Row = {
  name: string; job: string; price: string; priceSub: string
  status: Status; statusNote: string; goSlug: string; ctaLabel: string
}

function parseRows(rows: string): Row[] {
  return rows
    .split(/\r?\n|;;/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const f = line.split("|").map((s) => s.trim())
      const status = (["ok", "addon", "none", "ours"].includes(f[4]) ? f[4] : "none") as Status
      return {
        name: f[0] ?? "", job: f[1] ?? "", price: f[2] ?? "", priceSub: f[3] ?? "",
        status, statusNote: f[5] ?? "", goSlug: f[6] ?? "", ctaLabel: f[7] ?? "",
      }
    })
    .filter((r) => r.name)
}

const Arrow = () => (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="h-3 w-3">
    <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function chipClasses(status: Status): string {
  switch (status) {
    case "ok": return "bg-emerald-50 text-emerald-800"
    case "addon": return "bg-amber-50 text-amber-800"
    case "ours": return "bg-accent-900 text-white"
    default: return "bg-gray-100 text-gray-600"
  }
}

export function ComparisonTable({ refBase, rows, note, visLabel, locale }: ComparisonTableProps) {
  const t = CHROME[locale as keyof typeof CHROME] ?? CHROME.en
  const data = parseRows(rows)
  if (data.length === 0) return null
  const footer = note === undefined ? t.note : note
  const visHeader = visLabel || t.vis
  const chipLabel = (s: Status) => (s === "ok" ? t.ok : s === "addon" ? t.addon : s === "ours" ? t.builtin : t.none)

  const Chip = ({ r }: { r: Row }) => (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12.5px] font-semibold leading-tight ${chipClasses(r.status)}`}>
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {chipLabel(r.status)}
    </span>
  )

  const Cta = ({ r }: { r: Row }) => {
    if (!r.goSlug) return <span className="text-[12.5px] text-gray-500">—</span>
    const affiliate = !r.goSlug.startsWith("/")
    const href = affiliate ? `/go/${r.goSlug}?ref=${refBase}-${r.goSlug}` : r.goSlug
    const label = r.ctaLabel || `${t.visit} ${r.name}`
    return (
      <a
        href={href}
        {...(affiliate ? { target: "_blank", rel: "sponsored nofollow noopener noreferrer" } : {})}
        className="inline-flex items-center gap-1.5 rounded-full bg-accent-900 px-4 py-2 text-[13px] font-semibold text-white transition-all duration-200 hover:bg-accent-800 hover:shadow-lg hover:shadow-accent-900/25 active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
      >
        {label}
        <Arrow />
      </a>
    )
  }

  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-[var(--surface-warm-border)] bg-white shadow-sm">
      {/* Desktop / tablet */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full border-collapse text-left align-middle">
          <thead>
            <tr className="bg-[var(--surface-warm)]">
              <th scope="col" className="px-5 py-3.5 text-[11.5px] font-semibold uppercase tracking-wider text-gray-500">{t.tool}</th>
              <th scope="col" className="px-5 py-3.5 text-[11.5px] font-semibold uppercase tracking-wider text-gray-500">{t.job}</th>
              <th scope="col" className="px-5 py-3.5 text-[11.5px] font-semibold uppercase tracking-wider text-gray-500">{t.price}</th>
              <th scope="col" className="px-5 py-3.5 text-[11.5px] font-semibold uppercase tracking-wider text-gray-500">{visHeader}</th>
              <th className="px-5 py-3.5" aria-label={t.visit}></th>
            </tr>
          </thead>
          <tbody>
            {data.map((r, i) => (
              <tr
                key={`${r.name}-${i}`}
                className={`border-t border-[var(--surface-warm-border)] ${r.status === "ours" ? "bg-accent-50 shadow-[inset_3px_0_0_#134e4a]" : "hover:bg-gray-50"}`}
              >
                <td className="px-5 py-4 align-middle">
                  <span className={`text-[15px] font-semibold ${r.status === "ours" ? "text-accent-900" : "text-gray-900"}`}>{r.name}</span>
                  {r.status === "ours" && (
                    <span className="ml-2 inline-block rounded bg-accent-100 px-1.5 py-0.5 align-middle text-[10px] font-bold uppercase tracking-wide text-accent-900">{t.ours}</span>
                  )}
                </td>
                <td className="px-5 py-4 align-middle text-[14px] text-gray-600">{r.job}</td>
                <td className="px-5 py-4 align-middle text-[14px] text-gray-900 [font-variant-numeric:tabular-nums] whitespace-nowrap">
                  {r.price}
                  {r.priceSub && <span className="block text-[12px] text-gray-500">{r.priceSub}</span>}
                </td>
                <td className="px-5 py-4 align-middle">
                  <Chip r={r} />
                  {r.statusNote && <span className="mt-1 block text-[11.5px] text-gray-500">{r.statusNote}</span>}
                </td>
                <td className="px-5 py-4 align-middle text-right whitespace-nowrap"><Cta r={r} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden">
        {data.map((r, i) => (
          <div
            key={`m-${r.name}-${i}`}
            className={`border-t border-[var(--surface-warm-border)] px-4 py-4 first:border-t-0 ${r.status === "ours" ? "bg-accent-50 shadow-[inset_3px_0_0_#134e4a]" : ""}`}
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className={`text-[16px] font-bold ${r.status === "ours" ? "text-accent-900" : "text-gray-900"}`}>
                {r.name}
                {r.status === "ours" && <span className="ml-2 rounded bg-accent-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-900">{t.ours}</span>}
              </span>
              <span className="text-[14px] font-semibold text-gray-900 [font-variant-numeric:tabular-nums] whitespace-nowrap text-right">
                {r.price}
                {r.priceSub && <span className="block text-[11.5px] font-normal text-gray-500">{r.priceSub}</span>}
              </span>
            </div>
            <div className="mt-0.5 text-[13.5px] text-gray-600">{r.job}</div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <span className="flex flex-col gap-0.5">
                <Chip r={r} />
                {r.statusNote && <span className="text-[11.5px] text-gray-500">{r.statusNote}</span>}
              </span>
              <Cta r={r} />
            </div>
          </div>
        ))}
      </div>

      {footer ? <p className="border-t border-[var(--surface-warm-border)] bg-[var(--surface-warm)] px-5 py-3.5 text-[12.5px] text-gray-500">{footer}</p> : null}
    </div>
  )
}
