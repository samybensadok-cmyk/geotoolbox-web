import { AiEngineLogoGrid } from "@/components/features/ai-engine-logo-grid"
import type { EngineId } from "@/components/landing/engine-marks"

/**
 * Social-proof primitives with a strict REAL-OR-OMIT contract: every value is
 * optional and the component renders NOTHING for missing data rather than
 * fabricating a number. Never pass an invented figure. The house rule is
 * "real figure or omit, never invent."
 */

export function StatCounter({ value, label }: { value?: string | null; label: string }) {
  if (!value) return null
  return (
    <div className="text-center">
      <div className="text-2xl font-bold tracking-tight text-gray-900 tabular-nums">{value}</div>
      <div className="mt-1 text-[12px] font-medium uppercase tracking-wide text-gray-500">{label}</div>
    </div>
  )
}

export type MiniCase = {
  /** the business result, real data only, e.g. "Not found → cited in Perplexity in 2 weeks" */
  result: string
  /** who/what, optional; anonymize only if real */
  attribution?: string
}

/**
 * SocialProofBlock — composes real stat counters, an optional real before/after
 * mini-case, the AI-engine source grid, and a data-provenance line. Renders the
 * section only if at least one real element is supplied.
 */
export function SocialProofBlock({
  stats = [],
  miniCase,
  engines,
  provenanceLine,
  showEngineGrid = true,
}: {
  stats?: Array<{ value?: string | null; label: string }>
  miniCase?: MiniCase
  engines?: EngineId[]
  provenanceLine?: string
  showEngineGrid?: boolean
}) {
  const realStats = stats.filter((s) => !!s.value)
  const hasContent = realStats.length > 0 || !!miniCase || showEngineGrid || !!provenanceLine
  if (!hasContent) return null

  return (
    <div className="mx-auto max-w-4xl">
      {realStats.length > 0 && (
        <div className="flex flex-wrap items-start justify-center gap-x-12 gap-y-6">
          {realStats.map((s, i) => (
            <StatCounter key={i} value={s.value} label={s.label} />
          ))}
        </div>
      )}
      {miniCase && (
        <figure className="mx-auto mt-8 max-w-2xl rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center">
          <blockquote className="text-[17px] font-semibold leading-snug tracking-tight text-gray-900">
            {miniCase.result}
          </blockquote>
          {miniCase.attribution && (
            <figcaption className="mt-2 text-[13px] text-gray-500">{miniCase.attribution}</figcaption>
          )}
        </figure>
      )}
      {showEngineGrid && (
        <div className="mt-10">
          <AiEngineLogoGrid engines={engines} />
        </div>
      )}
      {provenanceLine && (
        <p className="mx-auto mt-6 max-w-2xl text-center text-[13px] leading-relaxed text-gray-500">
          {provenanceLine}
        </p>
      )}
    </div>
  )
}
