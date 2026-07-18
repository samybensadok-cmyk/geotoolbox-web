/**
 * POST /tools/llms-txt-generator/generate
 *
 * Colocated under /tools because next.config.ts rewrites /api/:path* to the
 * Replit PHP origin — a route handler there would never be reached.
 */

import { NextResponse } from "next/server"
import { generateLlmsTxt, GEN_LIMITS } from "@/lib/llms-txt-generate"
import { rateLimited, clientIp } from "@/lib/rate-limit"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// MUST exceed GEN_LIMITS.totalBudgetMs, or the platform kills the function
// before the generator can return its partial result and the client sees an
// HTML 504 that fails res.json().
export const maxDuration = 60

export async function POST(req: Request) {
  // Tighter than the sitemap extractor: one call here fans out to up to 50 page
  // fetches against a third-party origin.
  // Deliberately strict: one call fans out to up to 50 page fetches of up to
  // 400KB each against a third-party origin — roughly a 20,000x request-size
  // amplification, sourced from our egress IPs and carrying our user agent. An
  // abuse report for that traffic lands on us, so the throttle is tighter than
  // the user experience alone would justify.
  if (rateLimited(clientIp(req), { scope: "llms-generate", windowMs: 60_000, max: 2 })) {
    return NextResponse.json(
      { ok: false, error: "Too many generations in the last minute. Give it a moment." },
      { status: 429 },
    )
  }

  let url: unknown
  let full: unknown
  try {
    const body = await req.json()
    url = body?.url
    full = body?.includeFullText
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 })
  }

  if (typeof url !== "string" || url.trim().length === 0) {
    return NextResponse.json({ ok: false, error: "Enter a domain." }, { status: 400 })
  }
  if (url.length > 2048) {
    return NextResponse.json({ ok: false, error: "That URL is too long." }, { status: 400 })
  }

  const result = await generateLlmsTxt(url, { includeFullText: full === true })

  // Strip per-page body text before serializing: in full-text mode it's already
  // present in llmsFullTxt, and shipping both roughly doubles the response for
  // a field the client never reads.
  const pages = result.pages.map(({ text: _text, ...rest }) => rest)

  return NextResponse.json(
    {
      ...result,
      pages,
      limits: { maxPages: GEN_LIMITS.maxPages, maxFullPages: GEN_LIMITS.maxFullPages },
    },
    { status: result.ok ? 200 : 422, headers: { "Cache-Control": "no-store" } },
  )
}
