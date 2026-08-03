/**
 * Response contracts + runtime validators for the two endpoints behind the
 * public Agent Readiness Scanner (components/tools/agent-readiness-scanner-widget.tsx).
 *
 *   /index.php?action=agent_readiness_scan_v2   the scored v2 report
 *   /api/ai_crawler_check.php                   the 34-bot robots view
 *
 * TypeScript interfaces describe what the backend is SUPPOSED to send. These
 * guards check what it actually sent: every consumed field is typeof-checked and
 * anything unexpected collapses to null so the widget renders an error state
 * instead of throwing inside a render.
 *
 * Kept out of the widget file (and free of React) so it can be exercised
 * directly against the pinned prod fixtures.
 */

/**
 * Six states, per the v2 results contract. `unverifiable` is distinct from
 * `not_applicable`: the check applies to this site, we just could not confirm it
 * on this run. Collapsing the two would turn "we do not know" into "does not
 * apply", which is the exact dishonesty the report states exist to prevent.
 *
 * `blocked` is NOT part of this endpoint's contract (it belongs to the snapshot
 * pipeline in lib/lgs-public.ts) and is deliberately absent here.
 */
export type CheckState = "pass" | "warn" | "fail" | "info" | "not_applicable" | "unverifiable"
export type BotType = "search" | "training" | "userQuery" | "other"
export type ReportState = "normal" | "low_confidence" | "access_blocked"
export type Tone = "bad" | "mid" | "good"

export interface Pillar {
  id: string
  label: string
  score: number
  max: number
}

export interface Check {
  id: string
  label: string
  state: CheckState
  /** The results contract does not pin the type; the engine has used both. */
  priority: string | number | null
  weight: number
  evidence: string
  fix: string
  why: string
}

export interface Advanced {
  id: string
  label: string
  state: CheckState
  evidence: string
}

export interface ScanData {
  overallScore: number
  grade: string
  reportState: ReportState
  confidence: string
  coverageRatio: number
  scoredCheckCount: number
  pillars: Pillar[]
  checks: Check[]
  advanced: Advanced[]
  readinessLevel: number | null
  readinessLevelName: string | null
  readinessLevelCapped: boolean
  readinessLevelReliable: boolean
  nextLevelLines: string[]
}

export interface Bot {
  ua: string
  platform: string
  botType: BotType
  label: string
  allowed: boolean
  blockedBy: string | null
  note: string | null
}

export interface CrawlerData {
  total: number
  allowed: number
  blocked: number
  byType: Partial<Record<BotType, { allowed: number; blocked: number }>>
  bots: Bot[]
  robotsPresent: boolean | null
}

/* ─────────────────────────── primitives ─────────────────────────── */

export function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v)
}

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback
}

export function num(v: unknown, fallback = 0): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback
}

/** Every numeric style value on the scanner page passes through here. */
export function clampPct(n: number): number {
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(100, Math.round(n)))
}

export const CHECK_STATES: readonly CheckState[] = [
  "pass",
  "warn",
  "fail",
  "info",
  "not_applicable",
  "unverifiable",
]

function checkState(v: unknown): CheckState {
  const s = str(v)
  return (CHECK_STATES as readonly string[]).includes(s) ? (s as CheckState) : "info"
}

export const BOT_TYPES: readonly BotType[] = ["search", "training", "userQuery", "other"]

function botType(v: unknown): BotType {
  const s = str(v)
  return (BOT_TYPES as readonly string[]).includes(s) ? (s as BotType) : "other"
}

/** Keeps a numeric priority numeric. Anything else becomes null, never "info". */
function priorityValue(v: unknown): string | number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v
  if (typeof v === "string" && v.trim().length > 0) return v
  return null
}

function reportState(v: unknown): ReportState {
  const s = str(v)
  return s === "low_confidence" || s === "access_blocked" ? s : "normal"
}

/* ─────────────────────────── next_level ─────────────────────────── */

const NEXT_LEVEL_KEYS = ["summary", "label", "name", "text", "why", "fix", "requirement"]

/**
 * The pinned prod fixture sends an array of sentences. Tolerate a bare string or
 * an object too, and keep strings only, so a backend change degrades to "no
 * next-level panel" rather than rendering "[object Object]".
 */
export function nextLevelLines(v: unknown): string[] {
  if (typeof v === "string") return v.trim() ? [v] : []
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string" && x.trim().length > 0)
  if (isObj(v)) {
    const out: string[] = []
    for (const k of NEXT_LEVEL_KEYS) {
      const val = v[k]
      if (typeof val === "string" && val.trim()) out.push(val)
    }
    const reqs = v.requirements
    if (Array.isArray(reqs)) {
      for (const r of reqs) if (typeof r === "string" && r.trim()) out.push(r)
    }
    return out
  }
  return []
}

/* ─────────────────────────── validators ─────────────────────────── */

/** Narrow runtime guard for the v2 envelope. Null on anything unexpected. */
export function validateScan(raw: unknown): ScanData | null {
  if (!isObj(raw) || raw.success !== true || !isObj(raw.data)) return null
  const d = raw.data
  if (typeof d.overall_score !== "number" || !Number.isFinite(d.overall_score)) return null

  const pillars: Pillar[] = Array.isArray(d.pillars)
    ? d.pillars
        .filter(isObj)
        .filter((p) => typeof p.id === "string" && typeof p.label === "string" && typeof p.max === "number")
        .map((p) => ({ id: str(p.id), label: str(p.label), score: num(p.score), max: num(p.max) }))
    : []

  const checks: Check[] = Array.isArray(d.checks)
    ? d.checks
        .filter(isObj)
        .filter((c) => typeof c.id === "string" && typeof c.label === "string")
        .map((c) => ({
          id: str(c.id),
          label: str(c.label),
          state: checkState(c.state),
          priority: priorityValue(c.priority),
          weight: num(c.weight),
          evidence: str(c.evidence),
          fix: str(c.fix),
          why: str(c.why),
        }))
    : []

  const advanced: Advanced[] = Array.isArray(d.advanced)
    ? d.advanced
        .filter(isObj)
        .filter((a) => typeof a.id === "string" && typeof a.label === "string")
        .map((a) => ({ id: str(a.id), label: str(a.label), state: checkState(a.state), evidence: str(a.evidence) }))
    : []

  const rawLevel = d.readiness_level
  const readinessLevel =
    typeof rawLevel === "number" && Number.isInteger(rawLevel) && rawLevel >= 0 && rawLevel <= 4 ? rawLevel : null
  const rawLevelName =
    typeof d.readiness_level_name === "string" && d.readiness_level_name.trim() ? d.readiness_level_name : null

  return {
    overallScore: clampPct(d.overall_score),
    grade: str(d.grade, "NR"),
    reportState: reportState(d.report_state),
    confidence: str(d.confidence),
    coverageRatio: num(d.coverage_ratio, 1),
    scoredCheckCount: num(d.scored_check_count),
    pillars,
    checks,
    advanced,
    readinessLevel,
    readinessLevelName: rawLevelName,
    readinessLevelCapped: d.readiness_level_capped === true,
    readinessLevelReliable: d.readiness_level_reliable !== false,
    nextLevelLines: nextLevelLines(d.next_level),
  }
}

/** Narrow runtime guard for the 34-bot envelope. Null on anything unexpected. */
export function validateCrawlers(raw: unknown): CrawlerData | null {
  if (!isObj(raw) || raw.success !== true || !isObj(raw.summary) || !Array.isArray(raw.bots)) return null
  const s = raw.summary
  if (typeof s.total !== "number" || typeof s.allowed !== "number" || typeof s.blocked !== "number") return null

  const byType: Partial<Record<BotType, { allowed: number; blocked: number }>> = {}
  if (isObj(s.by_type)) {
    for (const t of BOT_TYPES) {
      const row = s.by_type[t]
      if (isObj(row)) byType[t] = { allowed: num(row.allowed), blocked: num(row.blocked) }
    }
  }

  const bots: Bot[] = raw.bots
    .filter(isObj)
    .filter((b) => typeof b.ua === "string" && typeof b.allowed === "boolean")
    .map((b) => ({
      ua: str(b.ua),
      platform: str(b.platform),
      botType: botType(b.bot_type),
      label: str(b.label) || str(b.ua),
      allowed: b.allowed === true,
      blockedBy: typeof b.blocked_by === "string" && b.blocked_by.trim() ? b.blocked_by : null,
      note: typeof b.note === "string" && b.note.trim() ? b.note : null,
    }))

  return {
    total: num(s.total, bots.length),
    allowed: num(s.allowed),
    blocked: num(s.blocked),
    byType,
    bots,
    robotsPresent: isObj(raw.robots) && typeof raw.robots.present === "boolean" ? raw.robots.present : null,
  }
}

/* ─────────────────────────── derived views ─────────────────────────── */

/** Mirrors the map in lib/lgs-public.ts so both surfaces rank identically. */
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

/**
 * Lower sorts first. Tolerates both the string and the integer form: the engine
 * has emitted each, and coercing a numeric priority through a string lookup
 * would silently rank every check as "info" and scramble the top-3 fix list.
 * Unknown values sink below every known one.
 */
export function priorityRank(p: string | number | null | undefined): number {
  if (typeof p === "number" && Number.isFinite(p)) return p
  if (typeof p === "string") {
    const key = p.trim().toLowerCase()
    if (key in PRIORITY_RANK) return PRIORITY_RANK[key]
    const n = Number(key)
    if (key.length > 0 && Number.isFinite(n)) return n
  }
  return 99
}

/** Fails and warns that carry an actionable fix, by priority then weight. */
export function topFixes(checks: Check[], limit = 3): Check[] {
  return checks
    .filter((c) => (c.state === "fail" || c.state === "warn") && c.fix.trim().length > 0)
    .slice()
    .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority) || b.weight - a.weight)
    .slice(0, limit)
}

/** Product-wide bands, matching components/features/score-legend.tsx. */
export function scoreBand(score: number): { tone: Tone; label: string } {
  const s = clampPct(score)
  if (s <= 40) return { tone: "bad", label: "Mostly invisible to AI" }
  if (s <= 70) return { tone: "mid", label: "Inconsistent" }
  return { tone: "good", label: "Dominant in AI answers" }
}
