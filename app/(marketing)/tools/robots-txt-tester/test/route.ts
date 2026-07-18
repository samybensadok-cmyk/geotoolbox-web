/**
 * POST /tools/robots-txt-tester/test
 *
 * Fetches a site's robots.txt (or accepts pasted content), lints it, and tests
 * URLs against it per user-agent — the job Google's Search Console robots.txt
 * tester used to do before it was retired. Colocated under /tools because
 * next.config.ts rewrites /api/:path* to the Replit origin.
 */

import { NextResponse } from "next/server"
import { assertPublicUrl, fetchRobotsTxt } from "@/lib/sitemap-extract"
import { parseRobots, isAllowed, groupFor } from "@/lib/robots-match"
import { lintRobotsTxt, type LintFinding } from "@/lib/robots-generate"
import { rateLimited, clientIp } from "@/lib/rate-limit"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 30

/** Bound the work: parsing is linear but the response shouldn't be unbounded. */
const MAX_URLS = 100
const MAX_AGENTS = 12
/**
 * Cap the VERDICT GRID, not just its inputs. 100 URLs x 12 agents is 1,200
 * matcher runs; on a rule-saturated file that measured 12.7s of CPU for a single
 * request, which one caller could sustain within the rate limit. Capping the
 * product bounds the work regardless of how the inputs are split.
 */
const MAX_VERDICTS = 300
const MAX_BODY_BYTES = 1024 * 1024
/**
 * Google processes at most the first 500 KiB of a robots.txt and ignores the
 * rest. Truncating to the same point is a CORRECTNESS fix — verdicts on a larger
 * file would otherwise disagree with Googlebot — and it also bounds the matcher,
 * which is O(rules x URLs) and was measured at 2.65s per verdict on a
 * rule-saturated 1MB file.
 */
const GOOGLE_PROCESS_LIMIT = 500 * 1024
/** Cap what we echo and how many findings we return. */
const MAX_ECHO_BYTES = 500 * 1024
const MAX_FINDINGS = 50

export interface UrlVerdict {
  url: string
  agent: string
  allowed: boolean
  /** The winning rule, when one matched. */
  rule?: { type: "allow" | "disallow"; path: string }
}

/** Stream the request body, aborting once it exceeds `cap` bytes. */
async function readBodyCapped(req: Request, cap: number): Promise<string> {
  if (!req.body) return ""
  const reader = req.body.getReader()
  const chunks: Buffer[] = []
  let total = 0
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      total += value.byteLength
      if (total > cap) {
        await reader.cancel().catch(() => {})
        throw new Error("too large")
      }
      chunks.push(Buffer.from(value))
    }
  } finally {
    reader.releaseLock?.()
  }
  return Buffer.concat(chunks, total).toString("utf8")
}

export async function POST(req: Request) {
  if (rateLimited(clientIp(req), { scope: "robots-test", windowMs: 60_000, max: 20 })) {
    return NextResponse.json(
      { ok: false, error: "Too many checks in the last minute. Give it a moment." },
      { status: 429 },
    )
  }

  // Read the body with a hard cap rather than trusting Content-Length: a chunked
  // request omits it entirely, so a header check alone lets req.json() buffer and
  // parse an arbitrarily large payload before any limit applies.
  let raw: string
  try {
    raw = await readBodyCapped(req, MAX_BODY_BYTES)
  } catch {
    return NextResponse.json({ ok: false, error: "Request body is too large (1MB max)." }, { status: 413 })
  }

  let body: { site?: unknown; content?: unknown; urls?: unknown; agents?: unknown }
  try {
    body = JSON.parse(raw)
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 })
  }

  const agents = Array.isArray(body.agents)
    ? [...new Set(body.agents.filter((a): a is string => typeof a === "string" && a.length > 0 && a.length < 200))].slice(0, MAX_AGENTS)
    : ["Googlebot"]
  const urls = Array.isArray(body.urls)
    ? [...new Set(body.urls.filter((u): u is string => typeof u === "string" && u.length > 0 && u.length < 2048))].slice(0, MAX_URLS)
    : []

  let text: string
  let origin: string | undefined
  let source: "fetched" | "pasted"

  if (typeof body.content === "string" && body.content.trim().length > 0) {
    if (Buffer.byteLength(body.content, "utf8") > MAX_BODY_BYTES) {
      return NextResponse.json({ ok: false, error: "That robots.txt is too large (1MB max)." }, { status: 413 })
    }
    text = body.content
    source = "pasted"
    // A pasted file can still be tested against a site for origin-aware lints.
    if (typeof body.site === "string" && body.site.trim()) {
      try {
        origin = new URL(/^https?:\/\//i.test(body.site) ? body.site : `https://${body.site}`).origin
      } catch {
        /* origin is optional */
      }
    }
  } else if (typeof body.site === "string" && body.site.trim().length > 0) {
    let raw = body.site.trim()
    if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`
    let parsedUrl: URL
    try {
      parsedUrl = new URL(raw)
    } catch {
      return NextResponse.json({ ok: false, error: "That doesn't look like a valid domain." }, { status: 400 })
    }
    origin = parsedUrl.origin

    const guard = await assertPublicUrl(origin)
    if (guard) return NextResponse.json({ ok: false, error: guard }, { status: 422 })

    try {
      const fetched = await fetchRobotsTxt(origin)
      if (fetched === null) {
        return NextResponse.json(
          {
            ok: true,
            source: "fetched",
            origin,
            exists: false,
            content: "",
            groups: [],
            sitemaps: [],
            findings: [
              {
                severity: "info",
                title: "No robots.txt found",
                detail:
                  "This site has no robots.txt, which is valid and means everything is allowed. Crawlers treat a 404 as permission to crawl.",
              },
            ] satisfies LintFinding[],
            verdicts: urls.flatMap((url) => agents.map((agent) => ({ url, agent, allowed: true }))),
          },
          { headers: { "Cache-Control": "no-store" } },
        )
      }
      text = fetched
      source = "fetched"
    } catch (e) {
      return NextResponse.json(
        { ok: false, error: e instanceof Error ? e.message : "Couldn't fetch that robots.txt." },
        { status: 422 },
      )
    }
  } else {
    return NextResponse.json({ ok: false, error: "Enter a domain, or paste a robots.txt." }, { status: 400 })
  }

  // Truncate to Google's processing limit before parsing.
  let truncated = false
  if (Buffer.byteLength(text, "utf8") > GOOGLE_PROCESS_LIMIT) {
    text = Buffer.from(text, "utf8").subarray(0, GOOGLE_PROCESS_LIMIT).toString("utf8")
    truncated = true
  }

  const parsed = parseRobots(text)

  // Resolve test URLs against the origin so a user can type "/admin/" instead of
  // a full URL — that's how the retired GSC tester worked.
  const resolved = urls.map((u) => {
    if (/^https?:\/\//i.test(u)) return u
    try {
      return new URL(u, origin ?? "https://example.com").toString()
    } catch {
      return u
    }
  })

  const verdicts: UrlVerdict[] = []
  let verdictCapHit = false
  outer: for (const url of resolved) {
    for (const agent of agents) {
      if (verdicts.length >= MAX_VERDICTS) {
        verdictCapHit = true
        break outer
      }
      const v = isAllowed(parsed, url, agent)
      verdicts.push({ url, agent, allowed: v.allowed, rule: v.rule })
    }
  }

  const groups = parsed.groups.map((g) => ({
    agents: g.agents,
    ruleCount: g.rules.length,
    crawlDelay: g.crawlDelay,
  }))

  // Per-agent effective rule count, so the UI can show that a named group
  // REPLACES the "*" group rather than adding to it — the single most
  // misunderstood part of robots.txt.
  const effective = agents.map((agent) => {
    const g = groupFor(parsed, agent)
    return {
      agent,
      matchedAgents: g?.agents ?? [],
      ruleCount: g?.rules.length ?? 0,
      crawlDelay: g?.crawlDelay,
    }
  })

  return NextResponse.json(
    {
      ok: true,
      source,
      origin,
      exists: true,
      content: text.length > MAX_ECHO_BYTES ? `${text.slice(0, MAX_ECHO_BYTES)}\n… truncated` : text,
      groups,
      effective,
      sitemaps: parsed.sitemaps,
      unknownDirectives: parsed.unknownDirectives,
      truncated,
      verdictCapHit,
      findings: [
        ...(verdictCapHit
          ? [
              {
                severity: "info" as const,
                title: `Showing the first ${MAX_VERDICTS} results`,
                detail:
                  "That combination of URLs and crawlers exceeds what one check returns. Test fewer crawlers at a time, or split the URL list — every result shown is complete and accurate, there are just more combinations than we run per request.",
              },
            ]
          : []),
        ...(truncated
          ? [
              {
                severity: "warning" as const,
                title: "File is larger than 500KB and was truncated",
                detail:
                  "Google processes at most the first 500KB of a robots.txt and ignores everything after it, so we do the same. Rules below that point are not being applied by Googlebot either — which is worth fixing rather than working around.",
              },
            ]
          : []),
        ...lintRobotsTxt(text, { origin }),
      ].slice(0, MAX_FINDINGS),
      verdicts,
    },
    { headers: { "Cache-Control": "no-store" } },
  )
}
