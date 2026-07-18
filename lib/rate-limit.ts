/**
 * Best-effort in-process rate limiting for the free tool endpoints.
 *
 * PER-INSTANCE by design, and that is now fine: Vercel WAF rate-limit rules sit
 * in front of these routes as the DISTRIBUTED layer (live in log mode since
 * 2026-07-18 — see free-tools-SEO/WAF-RATE-LIMIT-RUNBOOK.md). WAF also rejects
 * before the function invokes, so blocked traffic costs no compute and isn't
 * billed.
 *
 * This stays as the inner backstop: it's cheap, it catches the single-instance
 * case, and WAF counters are per-region so the outer ceiling is approximate.
 * Do not treat either layer alone as a security control.
 *
 * Implementation is a FIXED-WINDOW COUNTER rather than a timestamp list. The
 * earlier version appended a timestamp for every request including rejected
 * ones, then filtered the whole array on each call — so a caller flooding
 * within one window grew the array without bound and made each check O(n),
 * i.e. O(n²) total. A counter cannot degrade that way.
 */

interface Bucket {
  /** Requests counted in the current window. */
  count: number
  /** When the current window ends (ms epoch). */
  resetAt: number
}

const BUCKETS = new Map<string, Bucket>()
const MAX_KEYS = 5_000

export interface RateLimitOptions {
  /** Distinct name per endpoint so their budgets don't share a counter. */
  scope: string
  windowMs: number
  max: number
}

export function rateLimited(ip: string, opts: RateLimitOptions): boolean {
  const now = Date.now()
  const key = `${opts.scope}:${ip}`

  let bucket = BUCKETS.get(key)
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + opts.windowMs }
    // Bound the map. Map preserves insertion order, so the oldest keys are at
    // the front — evicting from the front is O(evicted) rather than a full scan
    // of every live entry on each new key.
    if (BUCKETS.size >= MAX_KEYS) {
      let toDrop = Math.max(1, Math.floor(MAX_KEYS * 0.1))
      for (const k of BUCKETS.keys()) {
        BUCKETS.delete(k)
        if (--toDrop <= 0) break
      }
    }
    BUCKETS.set(key, bucket)
  }

  // Stop incrementing once over the limit: the verdict can't change within the
  // window, and an unbounded counter is just a place for a flood to accumulate.
  if (bucket.count > opts.max) return true
  bucket.count++
  return bucket.count > opts.max
}

/**
 * Client IP for throttling. The leftmost x-forwarded-for value is
 * client-appendable, so keying on it lets a caller rotate a spoofed IP per
 * request and bypass the limit entirely. Prefer the platform header, then the
 * RIGHTMOST XFF entry — the one our own edge appended.
 */
export function clientIp(req: Request): string {
  const xff = req.headers
    .get("x-forwarded-for")
    ?.split(",")
    .map((s) => s.trim())
    .filter(Boolean)
  return (
    req.headers.get("x-vercel-forwarded-for")?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    xff?.[xff.length - 1] ||
    "unknown"
  )
}
