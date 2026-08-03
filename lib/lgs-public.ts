import { siteConfig } from "@/lib/config"
import type { EngineId } from "@/components/landing/engine-marks"

/**
 * `lgs-public-v1` — the frozen public projection served by the Replit handler
 * `?action=leadgen_snapshot_get`. Typed field-for-field against
 * leadgen-campaign/phase2/CONTRACT-public-json.md so that `next build` fails
 * loudly if the projection ever drifts from what this page renders.
 *
 * Contract rule 3 is the reason this file has almost no logic: a renderer
 * formats projection fields and does nothing else. No figure may appear on the
 * prospect-facing page unless the backend already published it. The only
 * derived values below are presentational (a clamped bar width, a band label,
 * a date format) and never a number the reader could mistake for a measurement.
 *
 * Keys the projection guarantees are still typed as optional on the read side
 * (`Partial<Record<...>>`). A prospect-facing page must degrade rather than
 * throw if a bucket is ever missing.
 */

/* ─────────────────────────── types ─────────────────────────── */

export type LgsEngineKey = "chatgpt" | "gemini" | "aio" | "perplexity"
export type LgsBucketKey = LgsEngineKey | "lost_deal"
export type LgsStatus = "complete" | "partial"
export type LgsComponentKey = "chatgpt" | "aio" | "accessibility" | "technical" | "authority"
export type LgsReportState = "normal" | "low_confidence" | "access_blocked"

export interface LgsComponent {
  max: number
  points: number | null
}

export interface LgsScores {
  state: LgsStatus
  composite: number | null
  components: Partial<Record<LgsComponentKey, LgsComponent>>
  partial_reasons: string[]
  rates: Partial<Record<LgsEngineKey, number | null>>
  weights_note: string
}

export interface LgsEngineBucket {
  dispatched_calls: number
  succeeded_calls: number
  failed_calls: number
  mentions: number
  competitors: string[]
  mention_rate: number | null
}

export interface LgsResult {
  key: string
  engine: string
  prompt_idx: number | null
  prompt: string
  mentioned: boolean
  citations: string[]
  competitors: string[]
  excerpt: string
  /** AIO rows only. */
  aio_present?: boolean
  /** AIO rows only. `"no_inline_content"` = present but sources not retrievable. */
  degraded?: null | "no_inline_content"
}

export interface LgsPillar {
  id: string
  label: string
  max: number
  score: number | null
}

/**
 * Seven states. `blocked` is the one that carries the report: dropping it would
 * mis-render exactly the access-blocked sites the whole snapshot leads with, so
 * it is selected into the weaknesses column alongside fail and warn.
 */
export type LgsCheckState =
  | "pass"
  | "warn"
  | "fail"
  | "blocked"
  | "info"
  | "not_applicable"
  | "unverifiable"

export interface LgsCheck {
  id: string
  label: string
  pillar: string
  state: LgsCheckState
  /** The results contract does not pin the type; the engine has used both. */
  priority: string | number | null
  weight: number
  evidence: string
  fix: string
}

export interface LgsReadiness {
  available: boolean
  overall_score: number | null
  grade: string | null
  level: number | null
  report_state: LgsReportState | null
  confidence: string | null
  coverage_ratio: number | null
  site_type: string | null
  engine: string | null
  pillars: LgsPillar[]
  checks: LgsCheck[]
}

export interface LgsBot {
  label: string
  platform: string
  bot_type: string
  allowed: boolean
  /** Decomposed server-side from the stored `blocked_by` string. */
  rule: string | null
  line: number | null
}

export type LgsBotType = "search" | "training" | "userQuery" | "other"

export interface LgsCrawlers {
  available: boolean
  summary: {
    /* All three are nullable: null means not measured, never "0 of 0". */
    total: number | null
    allowed: number | null
    blocked: number | null
    by_type: Partial<Record<LgsBotType, { allowed: number | null; blocked: number | null }>>
  }
  robots: { present: boolean }
  bots: LgsBot[]
  sub_score: { label: string; value: number | null; max: number | null }
  /** Hardcoded `"not_proven"` — an honesty constraint, not a data field. */
  ai_impact: string
}

export interface LgsLlmsIssue {
  severity: string
  title: string
  fix: string
}

export interface LgsLlmsTxt {
  available: boolean
  validity: string | null
  /** Quality score. `null` means N/A (no file), never 0. */
  score: number | null
  grade: string | null
  issues: LgsLlmsIssue[]
  links_summary: { total: number; ok: number; dead: number; unverified: number } | null
  ai_impact: string
}

export interface LgsMeta {
  market: string
  engine_version: string
  generated_at: string
}

export interface LgsPublicV1 {
  schema: "lgs-public-v1"
  slug: string
  domain: string
  brand: string
  status: LgsStatus
  market: string
  created_at: string
  prompts: string[]
  scores: LgsScores
  engines: Partial<Record<LgsBucketKey, LgsEngineBucket>>
  results: LgsResult[]
  lost_deal: LgsResult | null
  readiness: LgsReadiness
  crawlers: LgsCrawlers
  llmstxt: LgsLlmsTxt
  meta: LgsMeta
}

/* ─────────────────────────── fetch ─────────────────────────── */

/** Slug shape is checked before any network call, mirroring the handler gate. */
export function isValidSlug(slug: string): boolean {
  return /^[a-f0-9]{32}$/.test(slug)
}

function looksLikeSnapshot(d: unknown): d is LgsPublicV1 {
  if (!d || typeof d !== "object") return false
  const o = d as Record<string, unknown>
  return (
    o.schema === "lgs-public-v1" &&
    typeof o.slug === "string" &&
    typeof o.domain === "string" &&
    typeof o.brand === "string" &&
    Array.isArray(o.prompts) &&
    Array.isArray(o.results) &&
    !!o.scores &&
    typeof o.scores === "object" &&
    !!o.engines &&
    typeof o.engines === "object" &&
    !!o.readiness &&
    typeof o.readiness === "object" &&
    !!o.crawlers &&
    typeof o.crawlers === "object" &&
    !!o.llmstxt &&
    typeof o.llmstxt === "object" &&
    !!o.meta &&
    typeof o.meta === "object"
  )
}

/**
 * Reads the public projection through the existing Vercel hairpin: the request
 * goes to geotoolbox.ai/index.php, which next.config.ts rewrites to the Replit
 * app. There is no env var for the backend base URL; siteConfig.url is the
 * repo-wide convention (same as /r/<id>). Any failure returns null so callers
 * can render a 404 rather than an error page.
 */
export async function getSnapshot(slug: string): Promise<LgsPublicV1 | null> {
  if (!isValidSlug(slug)) return null
  try {
    const res = await fetch(
      `${siteConfig.url}/index.php?action=leadgen_snapshot_get&slug=${encodeURIComponent(slug)}`,
      { cache: "no-store" }
    )
    if (!res.ok) return null
    const data: unknown = await res.json()
    if (!looksLikeSnapshot(data)) return null
    return data
  } catch {
    return null
  }
}

/* ───────────────────── safety helpers ───────────────────── */

/**
 * The only gate between a scanned site's strings and an `href`. Citation and
 * competitor values come from third-party AI answers, so nothing becomes a
 * link until it parses as an absolute http(s) URL.
 */
export function safeUrl(u: string): string | null {
  if (typeof u !== "string" || u.length === 0 || u.length > 2048) return null
  try {
    const parsed = new URL(u)
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null
    return parsed.toString()
  } catch {
    return null
  }
}

/** Display label for a validated URL. Returns null when the URL is unsafe. */
export function urlHost(u: string): string | null {
  const safe = safeUrl(u)
  if (!safe) return null
  try {
    return new URL(safe).hostname.replace(/^www\./, "")
  } catch {
    return null
  }
}

/** Every numeric style value on the page passes through this. */
export function clampPct(n: number): number {
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(100, Math.round(n)))
}

/* ───────────────────── formatting ───────────────────── */

export function fmtDate(iso?: string | null): string {
  if (!iso) return ""
  const d = new Date(iso.replace(" ", "T") + (iso.includes("Z") || iso.includes("+") ? "" : "Z"))
  if (isNaN(d.getTime())) return ""
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

/** Points render at one decimal at most, with a written state for null. */
export function fmtPoints(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return "not scored"
  return String(Math.round(n * 10) / 10)
}

/** Collapses newlines so a brand name can never break a <title> or a heading. */
export function oneLine(s: string, max = 120): string {
  const flat = s.replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ").trim()
  return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat
}

/* ───────────────────── score bands ───────────────────── */

export type ScoreTone = "bad" | "mid" | "good"

/**
 * Bands are the product-wide ones from components/features/score-legend.tsx.
 * They are deliberately NOT the GrowthAck 85/70/50 thresholds.
 */
export function scoreBand(score: number): { tone: ScoreTone; label: string } {
  const s = clampPct(score)
  if (s <= 40) return { tone: "bad", label: "Mostly invisible to AI" }
  if (s <= 70) return { tone: "mid", label: "Inconsistent" }
  return { tone: "good", label: "Dominant in AI answers" }
}

/** Legend tiers, restated here without the em dash the house style forbids. */
export const SCORE_TIERS: { band: string; label: string; tone: ScoreTone }[] = [
  { band: "0–40", label: "Mostly invisible to AI", tone: "bad" },
  { band: "41–70", label: "Inconsistent: cited for some prompts, missing for others", tone: "mid" },
  { band: "71–100", label: "Dominant in AI answers", tone: "good" },
]

/* ───────────────────── engine roster ───────────────────── */

/** Scored engines first, then the measured-but-unscored pair. */
export const ENGINE_ORDER: LgsEngineKey[] = ["chatgpt", "aio", "gemini", "perplexity"]

export const ENGINE_META: Record<LgsEngineKey, { name: string; mark: EngineId; scored: boolean }> = {
  chatgpt: { name: "ChatGPT", mark: "chatgpt", scored: true },
  aio: { name: "Google AI Overviews", mark: "aio", scored: true },
  gemini: { name: "Gemini", mark: "gemini", scored: false },
  perplexity: { name: "Perplexity", mark: "perplexity", scored: false },
}

export const COMPONENT_ORDER: LgsComponentKey[] = [
  "chatgpt",
  "aio",
  "accessibility",
  "technical",
  "authority",
]

export const COMPONENT_LABEL: Record<LgsComponentKey, string> = {
  chatgpt: "ChatGPT",
  aio: "Google AI Overviews",
  accessibility: "AI Accessibility",
  technical: "Technical",
  authority: "Authority",
}

/* ───────────────────── readiness helpers ───────────────────── */

const PRIORITY_RANK: Record<string, number> = {
  critical: 0,
  p0: 0,
  blocker: 0,
  high: 1,
  p1: 1,
  medium: 2,
  moderate: 2,
  p2: 2,
  low: 3,
  p3: 3,
  info: 4,
}

/** Lower sorts first. Tolerates both the string and integer forms. */
export function priorityRank(p: string | number | null | undefined): number {
  if (typeof p === "number" && Number.isFinite(p)) return p
  if (typeof p === "string") {
    const key = p.trim().toLowerCase()
    if (key in PRIORITY_RANK) return PRIORITY_RANK[key]
    const n = Number(key)
    if (Number.isFinite(n)) return n
  }
  return 99
}

/** Top passing checks, heaviest first. */
export function strengths(checks: LgsCheck[], limit = 5): LgsCheck[] {
  return checks
    .filter((c) => c.state === "pass")
    .slice()
    .sort((a, b) => b.weight - a.weight)
    .slice(0, limit)
}

/** States that belong in the weaknesses column. `blocked` is the receipt an
 *  access-blocked site is paying for, so it ranks with the failures. */
const WEAK_STATES: LgsCheckState[] = ["blocked", "fail", "warn"]

/** Blocked, failing, and warning checks, by priority then weight. */
export function weaknesses(checks: LgsCheck[], limit = 5): LgsCheck[] {
  return checks
    .filter((c) => WEAK_STATES.includes(c.state))
    .slice()
    .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority) || b.weight - a.weight)
    .slice(0, limit)
}

/* ───────────────────── partial-state copy ───────────────────── */

const PARTIAL_REASON_TEXT: Record<string, string> = {
  chatgpt_calls_below_3:
    "Fewer than three ChatGPT answers came back, so the ChatGPT component was left unscored.",
  aio_calls_below_3:
    "Fewer than three Google AI Overview results came back, so the AI Overviews component was left unscored.",
  readiness_unavailable:
    "The site readiness scan did not complete, so the accessibility, technical, and authority components were left unscored.",
}

/** Falls back to the raw reason code, rendered as text, never interpolated. */
export function partialReasonText(code: string): string {
  return PARTIAL_REASON_TEXT[code] ?? `Reason reported by the scan: ${code}`
}

/* ───────────────────── result-grid inference ───────────────────── */

export type CellState = "hit" | "miss" | "degraded" | "no_aio" | "unmeasured"

export const CELL_TEXT: Record<CellState, string> = {
  hit: "mentioned",
  miss: "absent",
  degraded: "present, cited sources not retrievable",
  no_aio: "no AI Overview",
  unmeasured: "couldn't measure",
}

/**
 * Contract rule 4: a missing results row means the call failed, so it renders
 * as "couldn't measure" and never as "not mentioned". An absent AI Overview
 * still produces a row (`aio_present: false`), which keeps the two cases apart.
 */
export function cellState(row: LgsResult | undefined, engine: LgsEngineKey): CellState {
  if (!row) return "unmeasured"
  if (engine === "aio") {
    if (row.aio_present === false) return "no_aio"
    if (row.degraded === "no_inline_content") return "degraded"
  }
  return row.mentioned ? "hit" : "miss"
}

/** Index results by engine and prompt so the grid is a lookup, not a scan. */
export function indexResults(
  results: LgsResult[],
  prompts: string[]
): Map<string, LgsResult> {
  const byKey = new Map<string, LgsResult>()
  for (const r of results) {
    const idx = r.prompt_idx != null ? r.prompt_idx : prompts.indexOf(r.prompt)
    if (idx < 0) continue
    const key = `${r.engine}#${idx}`
    if (!byKey.has(key)) byKey.set(key, r)
  }
  return byKey
}

/* ───────────────────── competitor union ───────────────────── */

const ALL_BUCKETS: LgsBucketKey[] = ["chatgpt", "aio", "gemini", "perplexity", "lost_deal"]

function isOwnHost(host: string, domain: string): boolean {
  const h = host.toLowerCase().replace(/^www\./, "").replace(/\/+$/, "")
  const d = domain.toLowerCase().replace(/^www\./, "").replace(/\/+$/, "")
  if (!h || !d) return false
  return h === d || h.endsWith(`.${d}`) || d.endsWith(`.${h}`)
}

/** Every host the engines cited on these prompts, minus the scanned domain. */
export function competitorHosts(
  engines: LgsPublicV1["engines"],
  domain: string,
  limit = 8
): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const bucket of ALL_BUCKETS) {
    for (const host of engines[bucket]?.competitors ?? []) {
      const key = host.toLowerCase().trim()
      if (!key || seen.has(key) || isOwnHost(key, domain)) continue
      seen.add(key)
      out.push(host)
      if (out.length >= limit) return out
    }
  }
  return out
}

/**
 * The two most useful verbatim excerpts: an answer that skipped the brand and
 * named someone else is the one a prospect actually reads.
 */
export function pullQuotes(results: LgsResult[], limit = 2): LgsResult[] {
  const displayable = results.filter(
    (r) => (ENGINE_ORDER as string[]).includes(r.engine) && r.excerpt.trim().length > 0
  )
  const ranked = [
    ...displayable.filter((r) => !r.mentioned && r.competitors.length > 0),
    ...displayable.filter((r) => !r.mentioned && r.competitors.length === 0),
    ...displayable.filter((r) => r.mentioned),
  ]
  const out: LgsResult[] = []
  const usedEngines = new Set<string>()
  for (const r of ranked) {
    if (out.length >= limit) break
    if (usedEngines.has(r.engine)) continue
    usedEngines.add(r.engine)
    out.push(r)
  }
  for (const r of ranked) {
    if (out.length >= limit) break
    if (!out.includes(r)) out.push(r)
  }
  return out
}

/* ───────────────────── llms.txt copy ───────────────────── */

const VALIDITY_TEXT: Record<string, string> = {
  valid: "Spec valid",
  invalid: "Spec invalid",
  not_found: "No llms.txt found",
  missing: "No llms.txt found",
  error: "Could not be checked",
}

export function validityText(v: string | null): string {
  if (!v) return "not measured"
  return VALIDITY_TEXT[v.toLowerCase()] ?? v
}
