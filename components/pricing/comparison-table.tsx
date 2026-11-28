import { Fragment } from "react"
import Link from "next/link"
import { PromoSignupLink } from "@/components/pricing/promo-signup-link"
import { cn } from "@/lib/utils"
import { COMPARE_COLUMNS, COMPARE_GROUPS } from "@/lib/plans"
import { currencyParam } from "@/lib/i18n/currency"
import k from "@/components/brand/dark-kit.module.css"
import st from "./pricing-experience.module.css"

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
      <svg className={st.cellCheck} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" aria-label={copy.cellIncluded}>
        <path d="M3 8.5 6.5 12 13 4.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  if (value === false) return <span className={st.cellDash} aria-label={copy.cellNotIncluded}>—</span>
  return <span>{value}</span>
}

export function ComparisonTable({ copy, locale = "en", headingHidden = false }: { copy: ComparisonCopy; locale?: string; headingHidden?: boolean }) {
  // FR checkout bills EUR at identical amounts (SG_EUR_CHECKOUT_V1) — the
  // signup deep link carries the currency so js/auth.js needn't guess.
  const currency = currencyParam(locale)
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
    <section className={st.compareBody}>
      <div>
        {/* On /pricing the table sits inside a <details> whose <summary> already shows the title, so the page
            passes headingHidden: the eyebrow + h2 stay in the HTML (as before) but are not displayed. */}
        <div className={headingHidden ? st.compareHeadHidden : st.compareHead}>
          <p className={k.index}>{copy.eyebrow}</p>
          <h2 className={k.sectionTitle}>
            {copy.h2}
          </h2>
        </div>

        {/* One scroll container (phones scroll the table sideways inside it); the feature column sticks left. */}
        <div className={st.tableScroll}>
          <table className={st.ctable}>
            <thead>
              <tr>
                <th scope="col" aria-hidden="true" />
                {COMPARE_COLUMNS.map((col) => (
                  <th
                    key={col.id}
                    scope="col"
                    className={cn(col.id === FEATURED && st.colFeatured)}
                  >
                    <div className={st.colName}>{col.name}</div>
                    <PromoSignupLink
                      // SG_PROMO_ORGANIC_V1 (2026-09-01): carries whatever founding offer the
                      // visitor is entitled to. Without it this column sent a visitor who had
                      // just read $69.30 on a card to checkout at list price.
                      // Plan-aware deep link (SG_SIGNUP_V2). SG_SIGNUP_INTERVAL_DEFAULT
                      // (2026-08-20): this table has no billing toggle, and OMITTING the
                      // interval does not withhold an assertion — the server normalises a
                      // missing interval to ANNUAL, so a bare link opened Checkout at $948.
                      // Monthly is the honest default for a surface with no toggle; the
                      // buyer can still switch to annual on the pricing cards or in-app.
                      // (The old `col.id === "free"` bare-link branch was removed with the
                      // Free tier, SG_PRICING_V2.)
                      href={`${SIGNUP}&plan=${col.id}&interval=monthly${currency}`}
                      className={cn(st.choose, col.id === FEATURED && st.chooseLime)}
                    >
                      {copy.choose}
                    </PromoSignupLink>
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
                      className={st.groupCell}
                    >
                      <span className={st.groupLabel}>{g.group}</span>
                    </td>
                  </tr>
                  {g.rows.map((row) => (
                    <tr key={row.label}>
                      <th scope="row" className={st.rowLabel}>{row.label}</th>
                      {row.values.slice(1).map((v, i) => (
                        <td
                          key={i}
                          className={cn(
                            st.cell,
                            COMPARE_COLUMNS[i].id === FEATURED && st.colFeatured
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
        <p className={st.compareFoot}>
          {copy.footQuestion}{" "}
          <Link href={BOOK_CALL} data-cta-placement="pricing_comparison_foot" target="_blank" rel="noopener noreferrer">{copy.footLink}</Link>
          {copy.footTail}
        </p>
      </div>
    </section>
  )
}
