/**
 * POST /tools/sitemap-extractor/status
 *
 * Live HTTP status check for extracted sitemap URLs. No competing free sitemap
 * extractor does this, and it is the obvious next question after extraction:
 * "fine, but do these URLs still work?"
 *
 * Deliberately batched and capped rather than "check all 50,000": a sitemap can
 * hold far more URLs than any serverless request can responsibly fetch, so the
 * client sends slices and we are honest on the page about it being a sample
 * unless the user keeps going.
 */

import { NextResponse } from "next/server"
import { assertPublicUrl } from "@/lib/sitemap-extract"
import { rateLimited, clientIp } from "@/lib/rate-limit"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

/** Per-request URL ceiling. The client pages through larger sets. */
const MAX_BATCH = 50
/** Distinct hostnames allowed per batch — a sitemap's URLs share a host. */
const MAX_HOSTS = 5
const CONCURRENCY = 8
const PER_REQUEST_TIMEOUT_MS = 8_000

const UA = "GeoToolboxSitemapExtractor/1.0 (+https://geotoolbox.ai/tools/sitemap-extractor)"

export interface UrlStatus {
  url: string
  status: number | null
  /** Final URL after redirects, when it differs. */
  redirectedTo?: string
  /** Number of redirect hops. */
  hops: number
  error?: string
  ms: number
}

async function checkOne(url: string): Promise<UrlStatus> {
  const started = Date.now()
  const guard = await assertPublicUrl(url)
  if (guard) return { url, status: null, hops: 0, error: guard, ms: Date.now() - started }

  const ctl = new AbortController()
  const timer = setTimeout(() => ctl.abort(), PER_REQUEST_TIMEOUT_MS)
  try {
    let current = url
    let hops = 0
    for (;;) {
      // HEAD first: cheaper, and enough for a status code. Some servers reject
      // HEAD with 405, so fall back to a ranged GET rather than reporting a
      // false failure.
      let res = await fetch(current, {
        method: "HEAD",
        redirect: "manual",
        signal: ctl.signal,
        headers: { "User-Agent": UA },
      })
      if (res.status === 405 || res.status === 501) {
        await res.body?.cancel().catch(() => {})
        // Re-validate before the fallback GET: DNS can change between the two
        // requests, so a hostname approved for the HEAD is not automatically
        // approved for this one.
        const stillSafe = await assertPublicUrl(current)
        if (stillSafe) {
          return { url, status: null, hops, error: stillSafe, ms: Date.now() - started }
        }
        res = await fetch(current, {
          method: "GET",
          redirect: "manual",
          signal: ctl.signal,
          headers: { "User-Agent": UA, Range: "bytes=0-0" },
        })
      }
      // We only ever want the status line. Many servers ignore the Range header
      // and start streaming the full body; without cancelling, undici holds the
      // socket open — 50 per request, 8 concurrent.
      await res.body?.cancel().catch(() => {})

      if (res.status >= 300 && res.status < 400 && hops < 5) {
        const loc = res.headers.get("location")
        if (!loc) {
          return { url, status: res.status, hops, ms: Date.now() - started }
        }
        const nextUrl = new URL(loc, current).toString()
        const unsafe = await assertPublicUrl(nextUrl)
        if (unsafe) {
          return { url, status: res.status, hops, error: `Redirects to a blocked address.`, ms: Date.now() - started }
        }
        current = nextUrl
        hops++
        continue
      }

      return {
        url,
        status: res.status,
        hops,
        redirectedTo: hops > 0 ? current : undefined,
        ms: Date.now() - started,
      }
    }
  } catch (e) {
    const aborted = e instanceof Error && e.name === "AbortError"
    return {
      url,
      status: null,
      hops: 0,
      error: aborted ? "Timed out" : e instanceof Error ? e.message : "Request failed",
      ms: Date.now() - started,
    }
  } finally {
    clearTimeout(timer)
  }
}

/** Fixed-size worker pool — keeps concurrency bounded without a dependency. */
async function pool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length)
  let cursor = 0
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    for (;;) {
      const i = cursor++
      if (i >= items.length) return
      out[i] = await fn(items[i])
    }
  })
  await Promise.all(workers)
  return out
}

export async function POST(req: Request) {
  // Throttled harder than /extract: one call here fans out to 50 outbound
  // requests, which makes it the more attractive amplifier of the two.
  if (rateLimited(clientIp(req), { scope: "sitemap-status", windowMs: 60_000, max: 8 })) {
    return NextResponse.json(
      { ok: false, error: "Too many status checks in the last minute. Give it a moment." },
      { status: 429 },
    )
  }

  let urls: unknown
  try {
    urls = (await req.json())?.urls
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 })
  }

  if (!Array.isArray(urls) || urls.length === 0) {
    return NextResponse.json({ ok: false, error: "No URLs supplied." }, { status: 400 })
  }
  // De-duplicate before slicing: 50 copies of one URL would otherwise become 50
  // requests at a single target, which is the amplifier shape.
  const batch = [...new Set(urls.filter((u): u is string => typeof u === "string"))].slice(0, MAX_BATCH)
  if (batch.length === 0) {
    return NextResponse.json({ ok: false, error: "No valid URLs supplied." }, { status: 400 })
  }

  // Cap distinct hosts per batch. Legitimate use is one sitemap's URLs, which
  // share a host; a caller aiming this at many third parties is not that.
  const hosts = new Set<string>()
  for (const u of batch) {
    try {
      hosts.add(new URL(u).hostname)
    } catch {
      /* invalid URLs are reported per-item by checkOne */
    }
  }
  if (hosts.size > MAX_HOSTS) {
    return NextResponse.json(
      { ok: false, error: `Too many different domains in one batch (max ${MAX_HOSTS}).` },
      { status: 400 },
    )
  }

  const results = await pool(batch, CONCURRENCY, checkOne)

  return NextResponse.json(
    { ok: true, results, checked: results.length },
    { headers: { "Cache-Control": "no-store" } },
  )
}
