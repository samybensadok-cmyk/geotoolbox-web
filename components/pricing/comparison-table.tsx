import { Fragment } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { COMPARE_COLUMNS, COMPARE_GROUPS } from "@/lib/plans"

const SIGNUP = "/app/?page=signup"
// Growth is the featured column — matches the "Most popular" badge on the
// Agencies tab (the cards feature Pro on the Brands tab; one table, one anchor).
const FEATURED = "agency"
const BOOK_CALL = "https://calendly.com/samy-bensadok/30min-call"

// Localized labels for the comparison matrix, merged with COMPARE_GROUPS by
// index. Included/not-included is ALWAYS the boolean from lib/plans.ts — the
// catalog only supplies a string where the plan data itself is a string (e.g.
// "15/mo", "Unlimited", "Priority"), and `null` everywhere else. So a
// translation can add or drop a checkmark only by editing plans.ts.
export type ComparisonCopy = {
  eyebrow: string
  h2: string
  choose: string
  footQuestion: string
  footLink: string
  footTail: string
  cellIncluded: string
  cellNotIncluded: string
  groups: { group: string; rows: { label: string; values: (string | null)[] }[] }[]
}

function Cell({ value, copy }: { value: string | boolean; copy: ComparisonCopy }) {
  if (value === true)
    return (
      <svg className="mx-auto h-4 w-4 text-accent-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" aria-label={copy.cellIncluded}>
        <path d="M3 8.5 6.5 12 13 4.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  if (value === false) return <span className="text-gray-300" aria-label={copy.cellNotIncluded}>—</span>
  return <span className="text-gray-800">{value}</span>
}

export function ComparisonTable({ copy, locale = "en" }: { copy: ComparisonCopy; locale?: string }) {
  // FR checkout bills EUR at identical amounts (SG_EUR_CHECKOUT_V1) — the
  // signup deep link carries the currency so js/auth.js needn't guess.
  const currencyParam = locale === "fr" ? "&currency=eur" : ""
  // Merge structural truth (plans.ts) with localized labels (catalog). If the
  // catalog ever falls out of shape, we fall back to the plans.ts value rather
  // than rendering a hole.
  const groups = COMPARE_GROUPS.map((g, gi) => {
    const cg = copy.groups[gi]
    return {
      group: cg?.group ?? g.group,
      rows: g.rows.map((row, ri) => {
        const cr = cg?.rows[ri]
        return {
          label: cr?.label ?? row.label,
          values: row.values.map((v, vi) => {
            const override = cr?.values[vi]
            // A localized override is honored ONLY where plans.ts itself holds a
            // string. If plans.ts says boolean, the boolean wins unconditionally
            // — otherwise a catalog string like "Inclus" dropped into a `false`
            // cell would visibly reverse the cell's commercial meaning (it would
            // render as text rather than a dash). Guarding on `v` here is what
            // makes "a translation cannot flip an included/excluded state"
            // structurally true rather than merely true-if-you-ran-the-linter.
            return typeof v === "string" && typeof override === "string" ? override : v
          }),
        }
      }),
    }
  })

  return (
    <section className="border-t border-gray-100 bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">{copy.eyebrow}</p>
          <h2 className="mt-2 text-[clamp(1.5rem,3vw,2.25rem)] font-bold tracking-tight text-gray-900">
            {copy.h2}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead className="sticky top-14 z-10">
              <tr>
                <th scope="col" aria-hidden="true" className="w-[30%] bg-white py-3 text-left align-bottom" />
                {COMPARE_COLUMNS.map((col) => (
                  <th
                    key={col.id}
                    scope="col"
                    className={cn(
                      "bg-white px-3 py-3 text-center align-bottom",
                      col.id === FEATURED && "rounded-t-xl bg-accent-50"
                    )}
                  >
                    <div className="text-[14px] font-bold text-gray-900">{col.name}</div>
                    <Link
                      // Plan-aware deep link (SG_SIGNUP_V2). No interval — this table
                      // has no billing toggle, so asserting one on the signup chip
                      // would be wrong half the time. (The old `col.id === "free"`
                      // bare-link branch was removed with the Free tier, SG_PRICING_V2.)
                      href={`${SIGNUP}&plan=${col.id}${currencyParam}`}
                      prefetch={false}
                      className={cn(
                        "mt-2 inline-flex items-center justify-center rounded-full px-3 py-1 text-[12px] font-semibold transition-colors",
                        col.id === FEATURED
                          ? "bg-accent-900 text-white hover:bg-accent-800"
                          : "border border-gray-300 text-gray-700 hover:border-gray-400"
                      )}
                    >
                      {copy.choose}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <Fragment key={g.group}>
                  <tr>
                    <td
                      colSpan={COMPARE_COLUMNS.length + 1}
                      className="border-b border-gray-200 pt-8 pb-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-500"
                    >
                      {g.group}
                    </td>
                  </tr>
                  {g.rows.map((row) => (
                    <tr key={row.label} className="border-b border-gray-100">
                      <th scope="row" className="py-3 pr-4 text-left text-[13px] font-normal text-gray-700">{row.label}</th>
                      {row.values.slice(1).map((v, i) => (
                        <td
                          key={i}
                          className={cn(
                            "px-3 py-3 text-center text-[13px] tabular-nums",
                            COMPARE_COLUMNS[i].id === FEATURED && "bg-accent-50/60"
                          )}
                        >
                          <Cell value={v} copy={copy} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-center text-[13px] text-gray-500">
          {copy.footQuestion}{" "}
          <Link href={BOOK_CALL} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent-700 hover:text-accent-800">{copy.footLink}</Link>
          {copy.footTail}
        </p>
      </div>
    </section>
  )
}
