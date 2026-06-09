import { Fragment } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { COMPARE_COLUMNS, COMPARE_GROUPS } from "@/lib/plans"

const SIGNUP = "/app/?page=signup"
const FEATURED = "consultant"

function Cell({ value }: { value: string | boolean }) {
  if (value === true)
    return (
      <svg className="mx-auto h-4 w-4 text-accent-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" aria-label="Included">
        <path d="M3 8.5 6.5 12 13 4.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  if (value === false) return <span className="text-gray-300" aria-label="Not included">—</span>
  return <span className="text-gray-800">{value}</span>
}

export function ComparisonTable() {
  return (
    <section className="border-t border-gray-100 bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">Compare plans</p>
          <h2 className="mt-2 text-[clamp(1.5rem,3vw,2.25rem)] font-bold tracking-tight text-gray-900">
            Every plan, side by side
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
                      href={SIGNUP}
                      prefetch={false}
                      className={cn(
                        "mt-2 inline-flex items-center justify-center rounded-full px-3 py-1 text-[12px] font-semibold transition-colors",
                        col.id === FEATURED
                          ? "bg-accent-900 text-white hover:bg-accent-800"
                          : "border border-gray-300 text-gray-700 hover:border-gray-400"
                      )}
                    >
                      {col.id === "free" ? "Start free" : "Choose"}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE_GROUPS.map((g) => (
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
                          <Cell value={v} />
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
          Need more than Scale? <Link href="/contact?topic=enterprise" className="font-semibold text-accent-700 hover:text-accent-800">Talk to sales</Link> about Enterprise — unlimited brands, SSO, and a dedicated CSM.
        </p>
      </div>
    </section>
  )
}
