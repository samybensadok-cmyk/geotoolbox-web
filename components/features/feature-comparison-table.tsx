/**
 * FeatureComparisonTable — generic N-column comparison for feature pages
 * (us vs named alternatives / manual checks / monitoring-only tools). Distinct
 * from components/pricing/comparison-table.tsx, which is hardwired to plan data.
 *
 * Cells: `true` → check, `false` → dash, string → literal text. The column at
 * `highlightCol` (our column) is visually emphasized. Every "doesn't support X"
 * cell must be source-verified before publishing.
 */

import s from "./fx.module.css"

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
        <span className={emphasized ? s.cmpYesOurs : s.cmpYes} aria-label={yesLabel}>
          <svg className={s.cmpIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 8.5 6.5 12 13 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )
    if (c === false)
      return (
        <span className={s.cmpNo} aria-label={noLabel}>
          <svg className={s.cmpIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M3.5 8h9" strokeLinecap="round" />
          </svg>
        </span>
      )
    return <span className={emphasized ? s.cmpTextOurs : s.cmpText}>{c}</span>
  }

  // Dark kit table: mono header, hairline rows, our column lit in lime; scrolls inside its own box.
  return (
    <div>
      <div className={s.cmpWrap}>
        <table className={s.cmp}>
          <thead>
            <tr>
              <td />
              {columns.map((col, i) => (
                <th key={col} scope="col" className={i === highlightCol ? s.cmpOurs : undefined}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                <th scope="row">{row.label}</th>
                {row.cells.map((c, ci) => (
                  <td key={ci} className={ci === highlightCol ? s.cmpOurs : undefined}>
                    {renderCell(c, ci === highlightCol)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && <p className={s.cmpCaption}>{caption}</p>}
    </div>
  )
}
