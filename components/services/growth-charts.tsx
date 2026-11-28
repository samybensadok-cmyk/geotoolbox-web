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
 * Colors: the "dark"/"light" variants use the validated categorical pair
 * (teal-600 #0d9488 / amber-600 #d97706, passes the six palette checks on the
 * gray-950 band and on white). The "kit" variant (dark design kit) uses a
 * one-hue ordinal ramp read from the kit tokens: var(--accent) for positions
 * 1–3 and a 55% oklab mix of the accent into var(--surface) for 4–10 (for the
 * #cdff00 accent that is #6e8825: monotone lightness, single hue, 4.77:1
 * against the #0d0f0e chart surface). Fills are set through `style` so the
 * CSS variables resolve. The two panels share row tracks (subgrid from md up),
 * so their plot areas and x-axes sit on one baseline.
 * Text never wears series colors; identity comes from the legend + swatches.
 */

const TEAL = "#0d9488"
const AMBER = "#d97706"

type Variant = "dark" | "light" | "kit"

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
    bar: TEAL,
    top3: AMBER,
    rest: TEAL,
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
    bar: TEAL,
    top3: AMBER,
    rest: TEAL,
  },
  kit: {
    card: "rounded-lg border border-[#2d332d] bg-[#0d0f0e] p-4 pb-3 sm:p-6 sm:pb-4",
    title: "text-[15px] font-semibold text-white",
    src: "mt-1 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#b5bbb0]",
    legend: "font-mono text-[#b5bbb0]",
    tick: "#b5bbb0",
    xlab: "#b5bbb0",
    val: "#ffffff",
    segval: "#f4f6f2",
    grid: "rgba(255,255,255,.07)",
    axis: "rgba(255,255,255,.28)",
    tip: "border-[#2d332d] bg-[#131614] text-[#f4f6f2]",
    bar: "var(--accent)",
    top3: "var(--accent)",
    rest: "color-mix(in oklab, var(--accent) 55%, var(--surface))",
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

// Side-by-side panels (lg and up) share 4 row tracks (title, source, legend, plot) so both plots start on one line.
const SUBGRID = "lg:grid lg:row-span-4 lg:grid-rows-subgrid"

/**
 * Two drawing geometries for the same data. WIDE renders from 640px up (single column below 1024px, two columns
 * above); NARROW renders below 640px, with a smaller viewBox so the text stays >= 10px on a phone and compact
 * values (43k). Only one SVG per panel is displayed (the other is display:none, so screen
 * readers meet one img). Both use two-line month labels (month / year) so they never collide as months are added.
 */
type Geo = {
  W: number; H: number; M: { t: number; r: number; b: number; l: number }
  fTick: number; fX: number; fVal: number; fSeg: number; compact: boolean; twoLine: boolean; cls: string
}
const WIDE: Geo = { W: 520, H: 312, M: { t: 26, r: 44, b: 46, l: 46 }, fTick: 12.5, fX: 13, fVal: 13.5, fSeg: 12.5, compact: false, twoLine: true, cls: "hidden sm:block" }
const NARROW: Geo = { W: 320, H: 268, M: { t: 24, r: 30, b: 44, l: 36 }, fTick: 11, fX: 11.5, fVal: 12, fSeg: 11, compact: true, twoLine: true, cls: "block sm:hidden" }
const MONO = "var(--font-mono, ui-monospace)"

/** 43014 → "43k", 8664 → "8.7k", 3014 → "3k", 27 → "27" (narrow plot labels only; exact values stay in the tooltip, aria-label and table). */
const cFmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "")}k` : String(n))

export function GrowthCharts({
  variant = "dark",
  panels = "both",
  frameless = false,
  headingLevel = 3,
}: {
  variant?: Variant
  panels?: "both" | "queries"
  /** Drop the card border/background — for embedding inside an existing frame (e.g. the browser mockup). */
  frameless?: boolean
  /**
   * Heading level for the panel titles. Defaults to 3, which is right when the
   * charts sit under a section <h2>. Pass 2 when they are rendered directly
   * under a page <h1> (the /services/ai-automation-agency hero does this) —
   * otherwise the panel titles are an h1 → h3 level skip, which is the exact
   * "flat / malformed heading structure" signal agent-readiness scanners flag.
   * Visual size comes from `t.title`, so the level is semantics only.
   */
  headingLevel?: 2 | 3
}) {
  const t = frameless ? { ...theme[variant], card: "p-4 pb-2" } : theme[variant]
  const PanelTitle = (headingLevel === 2 ? "h2" : "h3") as "h2" | "h3"
  // Cap at the last 8 months so bars stay readable as the series grows.
  const months = proofStats.monthly.slice(-8)
  const [tip, setTip] = useState<TipState>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  const show = useCallback((e: React.MouseEvent, title: string, rows: Array<[string, string, number]>) => {
    const box = wrapRef.current?.getBoundingClientRect()
    if (!box) return
    setTip({ x: e.clientX - box.left + 14, y: e.clientY - box.top + 14, title, rows })
  }, [])

  const xLabel = (m: (typeof months)[number]) => m.label + (m.partial ? "*" : "")

  const queriesMax = niceMax(Math.max(...months.map((m) => m.queries)))
  const top10Max = niceMax(Math.max(...months.map((m) => m.top10)))
  // Quarter ticks when they land on clean values, half ticks otherwise.
  const ticksFor = (max: number) =>
    max < 1000 || (max / 4) % 500 === 0 ? [0, max / 4, max / 2, (3 * max) / 4, max] : [0, max / 2, max]

  const partialNote = months.some((m) => m.partial) ? " · *month to date" : ""

  const plot = (g: Geo, kind: "queries" | "split", margin: string) => {
    const IW = g.W - g.M.l - g.M.r
    const IH = g.H - g.M.t - g.M.b
    const step = IW / months.length
    const bw = Math.min(86, step * 0.55)
    const bx = (i: number) => g.M.l + step * i + (step - bw) / 2
    const val = (n: number) => (g.compact ? cFmt(n) : fmt(n))
    const yMax = kind === "queries" ? queriesMax : top10Max
    const ariaLabel = kind === "queries"
      ? `Unique queries geotoolbox.ai ranks for in Google, by month: ${months.map((m) => `${m.label} ${fmt(m.queries)}`).join(", ")}.`
      : `First-page queries by month, split by position: ${months.map((m) => `${m.label} ${fmt(m.top10)} (${fmt(m.top3)} in the top 3)`).join(", ")}.`
    return (
      <svg
        viewBox={`0 0 ${g.W} ${g.H}`}
        className={`${margin} ${g.cls} w-full overflow-visible`}
        role="img"
        aria-label={ariaLabel}
      >
        {ticksFor(yMax).map((v) => {
          const y = g.M.t + IH - (v / yMax) * IH
          return (
            <g key={v}>
              <line x1={g.M.l} x2={g.W - g.M.r} y1={y} y2={y} stroke={v === 0 ? t.axis : t.grid} />
              <text x={g.M.l - 7} y={y + 4} textAnchor="end" fontSize={g.fTick} fill={t.tick} fontFamily={MONO}>
                {kFmt(v)}
              </text>
            </g>
          )
        })}
        {months.map((m, i) => {
          const cx = g.M.l + step * i + step / 2
          const sp = m.label.lastIndexOf(" ")
          return g.twoLine && sp > 0 ? (
            <text key={m.month} x={cx} y={g.H - 24} textAnchor="middle" fontSize={g.fX} fill={t.xlab} fontFamily={MONO}>
              <tspan x={cx}>{m.label.slice(0, sp) + (m.partial ? "*" : "")}</tspan>
              <tspan x={cx} dy={g.fX + 3}>{m.label.slice(sp + 1)}</tspan>
            </text>
          ) : (
            <text key={m.month} x={cx} y={g.H - 10} textAnchor="middle" fontSize={g.fX} fill={t.xlab} fontFamily={MONO}>
              {xLabel(m)}
            </text>
          )
        })}
        {kind === "queries"
          ? months.map((m, i) => {
              const h = Math.max((m.queries / queriesMax) * IH, 2)
              const y = g.M.t + IH - h
              return (
                <g
                  key={m.month}
                  className="cursor-pointer transition hover:brightness-125"
                  onMouseMove={(e) => show(e, xLabel(m), [[t.bar, "Queries", m.queries]])}
                >
                  <path d={roundedTop(bx(i), y, bw, h, 4)} style={{ fill: t.bar }} />
                  <text x={bx(i) + bw / 2} y={y - 8} textAnchor="middle" fontSize={g.fVal} fontWeight={700} fill={t.val} fontFamily={MONO}>
                    {val(m.queries)}
                  </text>
                </g>
              )
            })
          : months.map((m, i) => {
              const h410 = (m.top4to10 / top10Max) * IH
              const h13 = (m.top3 / top10Max) * IH
              const y410 = g.M.t + IH - h410
              const y13 = y410 - 2 - h13 // 2px surface gap between segments
              const last = i === months.length - 1
              return (
                <g
                  key={m.month}
                  className="cursor-pointer transition hover:brightness-125"
                  onMouseMove={(e) =>
                    show(e, xLabel(m), [
                      [t.top3, "Pos 1–3", m.top3],
                      [t.rest, "Pos 4–10", m.top4to10],
                      ["", "Total", m.top10],
                    ])
                  }
                >
                  <rect x={bx(i)} y={y410} width={bw} height={Math.max(h410, 1.5)} style={{ fill: t.rest }} />
                  <path d={roundedTop(bx(i), y13, bw, Math.max(h13, 1.5), 4)} style={{ fill: t.top3 }} />
                  <text x={bx(i) + bw / 2} y={y13 - 8} textAnchor="middle" fontSize={g.fVal} fontWeight={700} fill={t.val} fontFamily={MONO}>
                    {val(m.top10)}
                  </text>
                  {last && (
                    <>
                      <text x={bx(i) + bw + 6} y={y13 + h13 / 2 + 4} fontSize={g.fSeg} fontWeight={600} fill={t.segval} fontFamily={MONO}>
                        {val(m.top3)}
                      </text>
                      <text x={bx(i) + bw + 6} y={y410 + h410 / 2 + 4} fontSize={g.fSeg} fontWeight={600} fill={t.segval} fontFamily={MONO}>
                        {val(m.top4to10)}
                      </text>
                    </>
                  )}
                </g>
              )
            })}
      </svg>
    )
  }

  return (
    <div ref={wrapRef} className="relative" onMouseLeave={() => setTip(null)}>
      <div className={panels === "both" ? "grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-y-0" : ""}>
        {/* Panel 1 — total unique queries */}
        <div className={panels === "both" ? `${t.card} ${SUBGRID}` : t.card}>
          <PanelTitle className={t.title}>Queries ranked in Google</PanelTitle>
          <p className={t.src}>Search Console API · unique queries / month{partialNote}</p>
          {/* Empty legend slot: keeps this plot on the same row track as panel 2's (which has a legend). */}
          {panels === "both" && <div aria-hidden="true" />}
          {plot(WIDE, "queries", panels === "both" ? "mt-1" : "mt-3")}
          {plot(NARROW, "queries", "mt-3")}
        </div>

        {/* Panel 2 — first-page split */}
        {panels === "both" && (
          <div className={`${t.card} ${SUBGRID}`}>
            <PanelTitle className={t.title}>Queries on Google&apos;s first page</PanelTitle>
            <p className={t.src}>Search Console API · avg. position ≤ 10{partialNote}</p>
            <div className={`mt-2 flex gap-4 text-xs ${t.legend}`}>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: t.top3 }} />
                Position 1–3
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: t.rest }} />
                Position 4–10
              </span>
            </div>
            {plot(WIDE, "split", "mt-1")}
            {plot(NARROW, "split", "mt-1")}
          </div>
        )}
      </div>

      {/* Screen-reader table view of the same data. The sr-only class lives on a
          WRAPPER, not the <table>: under automatic table layout a table's used
          width is max(specified, min-content), so `width:1px` never shrinks it —
          the table stayed ~577px wide and only escaped the page's scroll box
          because the parent section happens to be overflow-hidden. */}
      <div className="sr-only">
        <table>
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
      </div>

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
