/**
 * FeatureComparisonTable — generic N-column comparison for feature pages
 * (us vs named alternatives / manual checks / monitoring-only tools). Distinct
 * from components/pricing/comparison-table.tsx, which is hardwired to plan data.
 *
 * Cells: `true` → check, `false` → dash, string → literal text. The column at
 * `highlightCol` (our column) is visually emphasized. Every "doesn't support X"
 * cell must be source-verified before publishing.
 */

type Cell = boolean | string

export function FeatureComparisonTable({
  columns,
  rows,
  highlightCol = columns.length - 1,
  caption,
  yesLabel = "yes",
  noLabel = "no",
}: {
  columns: string[]
  rows: Array<{ label: string; cells: Cell[] }>
  highlightCol?: number
  caption?: string
  /** localized a11y labels for the check/dash cells */
  yesLabel?: string
  noLabel?: string
}) {
  const renderCell = (c: Cell, emphasized: boolean) => {
    if (c === true)
      return (
        <span className={emphasized ? "text-accent-700" : "text-gray-500"} aria-label={yesLabel}>
          <svg className="mx-auto h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 8.5 6.5 12 13 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )
    if (c === false)
      return (
        <span className="text-gray-400" aria-label={noLabel}>
          <svg className="mx-auto h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M3.5 8h9" strokeLinecap="round" />
          </svg>
        </span>
      )
    return <span className={`text-[13px] ${emphasized ? "font-semibold text-gray-900" : "text-gray-600"}`}>{c}</span>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-gray-200">
            <td className="py-3 pr-4 text-[13px] font-medium text-gray-500" />
            {columns.map((col, i) => (
              <th
                key={col}
                scope="col"
                className={`px-4 py-3 text-center text-[13px] font-bold ${
                  i === highlightCol ? "rounded-t-xl bg-accent-50 text-accent-900" : "text-gray-700"
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-gray-100">
              <th scope="row" className="py-3 pr-4 text-left text-[13px] font-medium text-gray-700">{row.label}</th>
              {row.cells.map((c, ci) => (
                <td
                  key={ci}
                  className={`px-4 py-3 text-center align-middle ${ci === highlightCol ? "bg-accent-50/60" : ""}`}
                >
                  {renderCell(c, ci === highlightCol)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {caption && <p className="mt-3 text-[12px] text-gray-500">{caption}</p>}
    </div>
  )
}
