import { AiEngineLogoGrid } from "@/components/features/ai-engine-logo-grid"
import type { EngineId } from "@/components/landing/engine-marks"
import s from "./fx.module.css"

/**
 * Social-proof primitives with a strict REAL-OR-OMIT contract: every value is
 * optional and the component renders NOTHING for missing data rather than
 * fabricating a number. Never pass an invented figure. The house rule is
 * "real figure or omit, never invent."
 */

export function StatCounter({ value, label }: { value?: string | null; label: string }) {
  if (!value) return null
  return (
    <div className={s.statItem}>
      <div className={s.statValue}>{value}</div>
      <div className={s.statLabel}>{label}</div>
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
  engineGridLabel,
}: {
  stats?: Array<{ value?: string | null; label: string }>
  miniCase?: MiniCase
  engines?: EngineId[]
  provenanceLine?: string
  showEngineGrid?: boolean
  /** localized label for the internal engine grid; EN default preserved when omitted */
  engineGridLabel?: string
}) {
  const realStats = stats.filter((st) => !!st.value)
  const hasContent = realStats.length > 0 || !!miniCase || showEngineGrid || !!provenanceLine
  if (!hasContent) return null

  return (
    <div className={s.proofWrap}>
      {realStats.length > 0 && (
        <div className={s.stats}>
          {realStats.map((st, i) => (
            <StatCounter key={i} value={st.value} label={st.label} />
          ))}
        </div>
      )}
      {miniCase && (
        <figure className={s.mini}>
          <blockquote className={s.miniQuote}>{miniCase.result}</blockquote>
          {miniCase.attribution && <figcaption className={s.miniBy}>{miniCase.attribution}</figcaption>}
        </figure>
      )}
      {showEngineGrid && (
        <AiEngineLogoGrid engines={engines} {...(engineGridLabel ? { label: engineGridLabel } : {})} />
      )}
      {provenanceLine && <p className={s.provenance}>{provenanceLine}</p>}
    </div>
  )
}
