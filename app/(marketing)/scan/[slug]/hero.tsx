import { EngineMark } from "@/components/landing/engine-marks"
import { ScoreLegend } from "@/components/features/score-legend"
import { ExcerptText } from "./excerpt"
import {
  clampPct,
  fmtDate,
  fmtPoints,
  partialReasonText,
  scoreBand,
  COMPONENT_LABEL,
  COMPONENT_ORDER,
  ENGINE_META,
  ENGINE_ORDER,
  SCORE_TIERS,
  type LgsPublicV1,
  type ScoreTone,
} from "@/lib/lgs-public"

/**
 * Section 1 of the snapshot: the number, what it is made of, which engines were
 * asked, and the one answer that costs the prospect a deal. Everything here is
 * a projection field formatted for reading; the only computed values are the
 * gauge arc and the bar widths, both clamped to 0-100.
 */

/* Closed tone maps — no class name is ever built from data. */
const GAUGE_STROKE: Record<ScoreTone, string> = {
  bad: "#e11d48",
  mid: "#d97706",
  good: "#0d9488",
}

const BAND_CHIP: Record<ScoreTone, string> = {
  bad: "border-rose-200 bg-rose-50 text-rose-700",
  mid: "border-amber-200 bg-amber-50 text-amber-800",
  good: "border-accent-200 bg-accent-50 text-accent-800",
}

const BAR_FILL: Record<ScoreTone, string> = {
  bad: "bg-rose-400",
  mid: "bg-amber-400",
  good: "bg-accent-500",
}

/* Two concentric circles, no canvas. Circumference of r=64 is 402.12. */
const RADIUS = 64
const CIRCUMFERENCE = 402.12

function Gauge({ score }: { score: number }) {
  const pct = clampPct(score)
  const band = scoreBand(pct)
  const offset = CIRCUMFERENCE - (CIRCUMFERENCE * pct) / 100

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-[148px] w-[148px]">
        <svg viewBox="0 0 148 148" className="h-[148px] w-[148px] -rotate-90" aria-hidden="true">
          <circle cx="74" cy="74" r={RADIUS} fill="none" stroke="#e6ecea" strokeWidth="14" />
          <circle
            cx="74"
            cy="74"
            r={RADIUS}
            fill="none"
            stroke={GAUGE_STROKE[band.tone]}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[44px] font-bold leading-none tracking-tight tabular-nums text-gray-900">
            {pct}
          </span>
          <span className="mt-1 font-mono text-[11px] text-gray-400">/100</span>
        </div>
      </div>
      <span
        className={`rounded-full border px-3 py-1 text-[12px] font-semibold ${BAND_CHIP[band.tone]}`}
      >
        {band.label}
      </span>
    </div>
  )
}

function WithheldScore({ reasons }: { reasons: string[] }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-amber-700">
        Composite score withheld
      </p>
      <p className="mt-2 text-[14px] leading-relaxed text-amber-900">
        This scan did not return enough successful measurements to publish a single number. We
        would rather show you nothing than show you a score that is really a gap in the data.
      </p>
      {reasons.length > 0 && (
        <ul className="mt-3 space-y-1.5 text-[13px] leading-relaxed text-amber-900">
          {reasons.map((r) => (
            <li key={r} className="flex gap-2">
              <span aria-hidden="true">·</span>
              <span>{partialReasonText(r)}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-[13px] text-amber-800">
        Every measurement that did complete is shown below.
      </p>
    </div>
  )
}

export function Hero({ data }: { data: LgsPublicV1 }) {
  const { scores, engines, lost_deal } = data
  const captured = fmtDate(data.meta.generated_at)
  /* Contract rule: the composite exists only in the complete state. A partial
     scan withholds it; it is never rendered as a zero. */
  const composite = scores.state === "complete" ? scores.composite : null

  return (
    <section className="border-b border-[var(--surface-mint-border)] bg-[var(--surface-mint)] px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl">
        {/* Report lockup */}
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-600">
            <span className="text-xs font-bold leading-none text-white">G</span>
          </div>
          <span className="text-[15px] font-bold tracking-tight text-gray-900">GEO Toolbox</span>
        </div>

        <p className="mt-8 font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          AI visibility snapshot
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {data.brand || data.domain}
        </h1>
        <p className="mt-2 font-mono text-[13px] text-gray-500">{data.domain}</p>
        {captured && (
          <p className="mt-1 text-[13px] text-gray-500">Data captured {captured}</p>
        )}

        {/* Score + components */}
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 sm:p-7">
          {composite != null ? (
            <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
              <div className="sm:w-[200px] sm:shrink-0">
                <Gauge score={composite} />
              </div>
              <div className="min-w-0 flex-1">
                <ComponentBars data={data} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <WithheldScore reasons={scores.partial_reasons} />
              <ComponentBars data={data} />
            </div>
          )}

          {composite != null && (
            <div className="mt-7 border-t border-gray-100 pt-5">
              <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                What the bands mean
              </p>
              <ScoreLegend tiers={SCORE_TIERS} />
            </div>
          )}
        </div>

        {/* Engines asked */}
        <div className="mt-6">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-400">
            Engines asked
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {ENGINE_ORDER.map((key) => {
              const meta = ENGINE_META[key]
              const bucket = engines[key]
              const measured = bucket != null && bucket.mention_rate != null
              const value = measured
                ? `${bucket.mentions} of ${bucket.succeeded_calls} answers`
                : "not measured"
              const dot = !measured
                ? "bg-gray-300"
                : bucket.mentions > 0
                  ? "bg-accent-500"
                  : "bg-rose-400"
              return (
                <li
                  key={key}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[13px] text-gray-700"
                >
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} aria-hidden="true" />
                  <EngineMark engine={meta.mark} className="h-3.5 w-3.5 text-gray-500" />
                  <span className="font-semibold text-gray-900">{meta.name}</span>
                  <span className="font-mono text-[12px] tabular-nums text-gray-500">{value}</span>
                  {!meta.scored && (
                    <span className="font-mono text-[10px] uppercase tracking-wide text-gray-400">
                      measured, unscored
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        </div>

        {/* The one answer that costs a deal */}
        {lost_deal && lost_deal.excerpt.trim().length > 0 && <LostDeal row={lost_deal} />}
      </div>
    </section>
  )
}

function ComponentBars({ data }: { data: LgsPublicV1 }) {
  const { components, weights_note } = data.scores
  return (
    <div>
      <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-400">
        What the score is made of
      </p>
      <ul className="mt-4 space-y-3">
        {COMPONENT_ORDER.map((key) => {
          const c = components[key]
          if (!c) return null
          const has = c.points != null
          const width = has && c.max > 0 ? clampPct(((c.points as number) / c.max) * 100) : 0
          const tone = scoreBand(width).tone
          return (
            <li key={key}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[13px] font-medium text-gray-800">
                  {COMPONENT_LABEL[key]}
                </span>
                <span className="font-mono text-[12px] tabular-nums text-gray-500">
                  {has ? `${fmtPoints(c.points)} / ${c.max}` : `not scored / ${c.max}`}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                {has && (
                  <div
                    className={`h-full rounded-full ${BAR_FILL[tone]}`}
                    style={{ width: `${width}%` }}
                  />
                )}
              </div>
            </li>
          )
        })}
      </ul>
      {weights_note && (
        <p className="mt-4 font-mono text-[11px] leading-relaxed text-gray-400">{weights_note}</p>
      )}
    </div>
  )
}

function LostDeal({ row }: { row: NonNullable<LgsPublicV1["lost_deal"]> }) {
  /* engine on this row is the bucket key "lost_deal", not a display name. The
     library dispatches it through Perplexity Sonar, so the label is fixed. */
  const win = row.mentioned
  const rail = win ? "bg-accent-600" : "bg-red-500"

  return (
    <div className="relative mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 pl-7 sm:p-7 sm:pl-8">
      <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-[3px] ${rail}`} />
      <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-400">
        {win ? "The buying question" : "The answer that costs you the deal"}
      </p>
      <p className="mt-3 text-[14px] leading-relaxed text-gray-600">
        Someone in your market asked an AI engine this, and here is what came back.
      </p>
      <blockquote className="mt-4 whitespace-pre-line rounded-xl border border-gray-100 bg-gray-50 p-4 text-[15px] italic leading-relaxed text-gray-800">
        <ExcerptText text={row.excerpt} />
      </blockquote>
      <p className="mt-3 font-mono text-[11px] leading-relaxed text-gray-500">
        — Perplexity, answering &ldquo;{row.prompt}&rdquo;
      </p>
      {!win && row.competitors.length > 0 && (
        <p className="mt-3 text-[13px] leading-relaxed text-gray-700">
          Named instead:{" "}
          <span className="font-semibold text-red-700">{row.competitors.join(", ")}</span>
        </p>
      )}
      {win && (
        <p className="mt-3 text-[13px] leading-relaxed text-accent-800">
          Your brand was named in this answer.
        </p>
      )}
    </div>
  )
}
