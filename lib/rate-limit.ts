/**
 * Best-effort in-process rate limiting for the free tool endpoints.
 *
 * Fluid Compute reuses instances, so this catches the common case, but limits
 * are per-instance and this is a courtesy throttle rather than a security
 * control. It matters most on endpoints that make OUTBOUND requests on a
 * caller's behalf — those are the ones that could otherwise be pointed at a
 * third party as an amplifier.
 */

interface Bucket {
  hits: number[]
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
  const bucket = BUCKETS.get(key) ?? { hits: [] }
  bucket.hits = bucket.hits.filter((t) => now - t < opts.windowMs)
  bucket.hits.push(now)
  BUCKETS.set(key, bucket)

  // Bound the map. Sweeping only on overflow keeps the common path O(1); the
  // previous version scanned the whole map on every request once it was full,
  // which turned the limiter itself into the bottleneck.
  if (BUCKETS.size > MAX_KEYS) {
    for (const [k, v] of BUCKETS) {
      if (v.hits.every((t) => now - t >= opts.windowMs)) BUCKETS.delete(k)
      if (BUCKETS.size <= MAX_KEYS) break
    }
    // Still full of live entries: drop the oldest insertions rather than grow.
    if (BUCKETS.size > MAX_KEYS) {
      const excess = BUCKETS.size - MAX_KEYS
      let i = 0
      for (const k of BUCKETS.keys()) {
        if (i++ >= excess) break
        BUCKETS.delete(k)
      }
    }
  }

  return bucket.hits.length > opts.max
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
