"use client"

import { useCallback, useRef, useState } from "react"
import { proofStats } from "@/lib/proof-stats"

/**
 * GrowthCharts — native SVG replacement for the Looker screenshot: monthly
 * unique-query growth from the Search Console API, drawn from
 * proof-stats.generated.json (the same 48h-refreshed data as the stat tiles,
 * so bars and numbers can never disagree). Months append automatically as the
 * series grows; the current month is flagged "to date" while partial.
 *
 * Colors are the validated chart pair (teal-600 #0d9488 / amber-600 #d97706 —
 * passes the six palette checks on both the gray-950 band and white). Text
 * never wears series colors; identity comes from the legend + swatches.
 */

const TEAL = "#0d9488"
const AMBER = "#d97706"

type Variant = "dark" | "light"

const theme = {
  dark: {
    card: "rounded-xl border border-white/10 bg-white/[0.03] p-6 pb-4",
    title: "text-sm font-semibold text-white",
    src: "mt-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500",
    legend: "text-gray-400",
    tick: "#6b7280",
    xlab: "#9ca3af",
    val: "#ffffff",
    segval: "#e5e7eb",
    grid: "rgba(255,255,255,.07)",
    axis: "rgba(255,255,255,.25)",
    tip: "border-white/10 bg-gray-900 text-gray-200",
  },
  light: {
    card: "rounded-xl border border-gray-200 bg-white p-6 pb-4",
    title: "text-sm font-semibold text-gray-900",
    src: "mt-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-400",
    legend: "text-gray-500",
    tick: "#9ca3af",
    xlab: "#6b7280",
    val: "#111827",
    segval: "#374151",
    grid: "rgba(17,24,39,.08)",
    axis: "rgba(17,24,39,.3)",
    tip: "border-gray-200 bg-white text-gray-700 shadow-lg",
  },
} as const

const fmt = (n: number) => n.toLocaleString("en-US")
const kFmt = (n: number) => (n >= 1000 ? `${n / 1000}k` : String(n))

/** Smallest "nice" axis max (1/2/2.5/5 × 10^k) at or above v. */
function niceMax(v: number): number {
  const pow = 10 ** Math.floor(Math.log10(Math.max(v, 1)))
  for (const m of [1, 2, 2.5, 5, 10]) if (m * pow >= v) return m * pow
  return 10 * pow
}

/** Path for a bar with only the top corners rounded, anchored to y+h. */
function roundedTop(x: number, y: number, w: number, h: number, r: number): string {
  const rr = Math.min(r, h)
  return `M${x},${y + h} L${x},${y + rr} Q${x},${y} ${x + rr},${y} L${x + w - rr},${y} Q${x + w},${y} ${x + w},${y + rr} L${x + w},${y + h} Z`
}

type TipState = { x: number; y: number; title: string; rows: Array<[string, string, number]> } | null

const W = 520
const H = 300
const M = { t: 26, r: 8, b: 34, l: 46 }
const IW = W - M.l - M.r
const IH = H - M.t - M.b

export function GrowthCharts({
  variant = "dark",
  panels = "both",
  frameless = false,
}: {
  variant?: Variant
  panels?: "both" | "queries"
  /** Drop the card border/background — for embedding inside an existing frame (e.g. the browser mockup). */
  frameless?: boolean
}) {
  const t = frameless ? { ...theme[variant], card: "p-4 pb-2" } : theme[variant]
  // Cap at the last 8 months so bars stay readable as the series grows.
  const months = proofStats.monthly.slice(-8)
  const [tip, setTip] = useState<TipState>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  const show = useCallback((e: React.MouseEvent, title: string, rows: Array<[string, string, number]>) => {
    const box = wrapRef.current?.getBoundingClientRect()
    if (!box) return
    setTip({ x: e.clientX - box.left + 14, y: e.clientY - box.top + 14, title, rows })
  }, [])

  const step = IW / months.length
  const bw = Math.min(86, step * 0.55)
  const bx = (i: number) => M.l + step * i + (step - bw) / 2
  const xLabel = (m: (typeof months)[number]) => m.label + (m.partial ? "*" : "")

  const frame = (yMax: number, ticks: number[]) => (
    <>
      {ticks.map((v) => {
        const y = M.t + IH - (v / yMax) * IH
        return (
          <g key={v}>
            <line x1={M.l} x2={W - M.r} y1={y} y2={y} stroke={v === 0 ? t.axis : t.grid} />
            <text x={M.l - 8} y={y + 4} textAnchor="end" fontSize={11} fill={t.tick} fontFamily="var(--font-mono, ui-monospace)">
              {kFmt(v)}
            </text>
          </g>
        )
      })}
      {months.map((m, i) => (
        <text
          key={m.month}
          x={M.l + step * i + step / 2}
          y={H - 10}
          textAnchor="middle"
          fontSize={12}
          fill={t.xlab}
          fontFamily="var(--font-mono, ui-monospace)"
        >
          {xLabel(m)}
        </text>
      ))}
    </>
  )

  const queriesMax = niceMax(Math.max(...months.map((m) => m.queries)))
  const top10Max = niceMax(Math.max(...months.map((m) => m.top10)))
  // Quarter ticks when they land on clean values, half ticks otherwise.
  const ticksFor = (max: number) =>
    max < 1000 || (max / 4) % 500 === 0 ? [0, max / 4, max / 2, (3 * max) / 4, max] : [0, max / 2, max]

  const partialNote = months.some((m) => m.partial) ? " · *month to date" : ""

  return (
    <div ref={wrapRef} className="relative" onMouseLeave={() => setTip(null)}>
      <div className={panels === "both" ? "grid grid-cols-1 gap-5 md:grid-cols-2" : ""}>
        {/* Panel 1 — total unique queries */}
        <div className={t.card}>
          <h3 className={t.title}>Queries ranked in Google</h3>
          <p className={t.src}>Search Console API · unique queries / month{partialNote}</p>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="mt-3 block w-full overflow-visible"
            role="img"
            aria-label={`Unique queries geotoolbox.ai ranks for in Google, by month: ${months
              .map((m) => `${m.label} ${fmt(m.queries)}`)
              .join(", ")}.`}
          >
            {frame(queriesMax, ticksFor(queriesMax))}
            {months.map((m, i) => {
              const h = Math.max((m.queries / queriesMax) * IH, 2)
              const y = M.t + IH - h
              return (
                <g
                  key={m.month}
                  className="cursor-pointer transition hover:brightness-125"
                  onMouseMove={(e) => show(e, xLabel(m), [[TEAL, "Queries", m.queries]])}
                >
                  <path d={roundedTop(bx(i), y, bw, h, 4)} fill={TEAL} />
                  <text
                    x={bx(i) + bw / 2}
                    y={y - 8}
                    textAnchor="middle"
                    fontSize={13}
                    fontWeight={700}
                    fill={t.val}
                    fontFamily="var(--font-mono, ui-monospace)"
                  >
                    {fmt(m.queries)}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Panel 2 — first-page split */}
        {panels === "both" && (
          <div className={t.card}>
            <h3 className={t.title}>Queries on Google&apos;s first page</h3>
            <p className={t.src}>Search Console API · avg. position ≤ 10{partialNote}</p>
            <div className={`mt-2 flex gap-4 text-xs ${t.legend}`}>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: AMBER }} />
                Position 1–3
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: TEAL }} />
                Position 4–10
              </span>
            </div>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="mt-1 block w-full overflow-visible"
              role="img"
              aria-label={`First-page queries by month, split by position: ${months
                .map((m) => `${m.label} ${fmt(m.top10)} (${fmt(m.top3)} in the top 3)`)
                .join(", ")}.`}
            >
              {frame(top10Max, ticksFor(top10Max))}
              {months.map((m, i) => {
                const h410 = (m.top4to10 / top10Max) * IH
                const h13 = (m.top3 / top10Max) * IH
                const y410 = M.t + IH - h410
                const y13 = y410 - 2 - h13 // 2px surface gap between segments
                const last = i === months.length - 1
                return (
                  <g
                    key={m.month}
                    className="cursor-pointer transition hover:brightness-125"
                    onMouseMove={(e) =>
                      show(e, xLabel(m), [
                        [AMBER, "Pos 1–3", m.top3],
                        [TEAL, "Pos 4–10", m.top4to10],
                        ["", "Total", m.top10],
                      ])
                    }
                  >
                    <rect x={bx(i)} y={y410} width={bw} height={Math.max(h410, 1.5)} fill={TEAL} />
                    <path d={roundedTop(bx(i), y13, bw, Math.max(h13, 1.5), 4)} fill={AMBER} />
                    <text
                      x={bx(i) + bw / 2}
                      y={y13 - 8}
                      textAnchor="middle"
                      fontSize={13}
                      fontWeight={700}
                      fill={t.val}
                      fontFamily="var(--font-mono, ui-monospace)"
                    >
                      {fmt(m.top10)}
                    </text>
                    {last && (
                      <>
                        <text x={bx(i) + bw + 8} y={y13 + h13 / 2 + 4} fontSize={11} fontWeight={600} fill={t.segval} fontFamily="var(--font-mono, ui-monospace)">
                          {fmt(m.top3)}
                        </text>
                        <text x={bx(i) + bw + 8} y={y410 + h410 / 2 + 4} fontSize={11} fontWeight={600} fill={t.segval} fontFamily="var(--font-mono, ui-monospace)">
                          {fmt(m.top4to10)}
                        </text>
                      </>
                    )}
                  </g>
                )
              })}
            </svg>
          </div>
        )}
      </div>

      {/* Screen-reader table view of the same data */}
      <table className="sr-only">
        <caption>Monthly unique Google queries for geotoolbox.ai, from the Search Console API</caption>
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">Queries ranked</th>
            <th scope="col">Top 10</th>
            <th scope="col">Top 3</th>
          </tr>
        </thead>
        <tbody>
          {months.map((m) => (
            <tr key={m.month}>
              <th scope="row">{m.label + (m.partial ? " (month to date)" : "")}</th>
              <td>{fmt(m.queries)}</td>
              <td>{fmt(m.top10)}</td>
              <td>{fmt(m.top3)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {tip && (
        <div
          className={`pointer-events-none absolute z-10 rounded-lg border px-2.5 py-2 text-xs ${t.tip}`}
          style={{
            left: Math.min(tip.x, (wrapRef.current?.clientWidth ?? 400) - 170),
            top: Math.min(tip.y, (wrapRef.current?.clientHeight ?? 400) - 100),
          }}
        >
          <div className="mb-1 font-mono text-[10px] uppercase tracking-widest opacity-60">{tip.title}</div>
          {tip.rows.map(([color, label, value]) => (
            <div key={label} className="flex items-center gap-1.5 font-mono">
              {color ? <span className="h-2 w-2 rounded-[2px]" style={{ background: color }} /> : <span className="h-2 w-2" />}
              <span>{label}</span>
              <b className="ml-auto pl-3">{fmt(value)}</b>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
