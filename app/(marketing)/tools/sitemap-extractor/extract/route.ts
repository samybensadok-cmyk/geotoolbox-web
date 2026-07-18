/**
 * POST /tools/sitemap-extractor/extract
 *
 * Colocated under /tools rather than /api because next.config.ts rewrites
 * /api/:path* wholesale to the Replit PHP origin — a route handler there would
 * never be reached. Keeping it here also means this tool ships on `git push`
 * with no Replit redeploy in the loop.
 */

import { NextResponse } from "next/server"
import { extractSitemap, extractFromText, fetchRobotsTxt } from "@/lib/sitemap-extract"
import { auditSitemap } from "@/lib/sitemap-audit"
import { rateLimited, clientIp } from "@/lib/rate-limit"

// Node runtime: the extractor needs zlib (gzip .xml.gz) and dns (SSRF guard).
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// MUST stay above LIMITS.totalBudgetMs. The extractor's internal budget returns
// partial results gracefully at 45s; without a maxDuration above that, the
// platform kills the function first and the client gets an HTML 504 that fails
// res.json() and surfaces as a bogus "Network error" — precisely on the big
// multi-file index this tool exists to handle.
export const maxDuration = 60

/** Vercel's serverless request-body ceiling is 4.5MB; stay under it. */
const MAX_BODY_BYTES = 4 * 1024 * 1024

export async function POST(req: Request) {
  const ip = clientIp(req)

  if (rateLimited(ip, { scope: "sitemap-extract", windowMs: 60_000, max: 12 })) {
    return NextResponse.json(
      { ok: false, error: "Too many extractions in the last minute. Give it a moment." },
      { status: 429 },
    )
  }

  // Vercel caps a serverless request body at 4.5MB, so check before req.json()
  // materializes it — and advertise a limit that's actually true. A 20MB paste
  // would die at the platform with an opaque error, hitting precisely the users
  // the paste path exists for (a big site whose origin blocks our fetcher).
  const declaredLen = Number(req.headers.get("content-length") ?? "0")
  if (declaredLen > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, error: `That's larger than the ${MAX_BODY_BYTES / 1024 / 1024}MB paste limit. Use the URL field so we can fetch and stream it instead.` },
      { status: 413 },
    )
  }

  let input: unknown
  let pasted: unknown
  try {
    const body = await req.json()
    input = body?.url
    pasted = body?.xml
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 })
  }

  // Paste/upload path: for sites whose bot protection refuses our fetcher (a real
  // and common case — nytimes.com returns 403), the user can supply the file.
  if (typeof pasted === "string" && pasted.trim().length > 0) {
    if (Buffer.byteLength(pasted, "utf8") > MAX_BODY_BYTES) {
      return NextResponse.json(
        { ok: false, error: `That's larger than the ${MAX_BODY_BYTES / 1024 / 1024}MB paste limit. Use the URL field so we can fetch and stream it instead.` },
        { status: 413 },
      )
    }
    const fromText = extractFromText(pasted, typeof input === "string" ? input : "")
    // Same guarantee as the fetched path: a failing audit must never sink the
    // extraction the user actually asked for.
    let audit = null
    if (fromText.ok) {
      try {
        audit = await auditSitemap(fromText, safeRobots)
      } catch {
        audit = null
      }
    }
    return NextResponse.json({ ...fromText, audit }, {
      status: fromText.ok ? 200 : 422,
      headers: { "Cache-Control": "no-store" },
    })
  }

  if (typeof input !== "string" || input.trim().length === 0) {
    return NextResponse.json({ ok: false, error: "Enter a sitemap URL or a domain." }, { status: 400 })
  }
  if (input.length > 2048) {
    return NextResponse.json({ ok: false, error: "That URL is too long." }, { status: 400 })
  }

  const result = await extractSitemap(input)
  // The audit is the differentiator, but it must never sink the extraction: if it
  // throws, the user still gets their URLs.
  let audit = null
  if (result.ok) {
    try {
      audit = await auditSitemap(result, safeRobots)
    } catch {
      audit = null
    }
  }

  return NextResponse.json({ ...result, audit }, {
    status: result.ok ? 200 : 422,
    headers: { "Cache-Control": "no-store" },
  })
}

/** robots.txt fetch that degrades to "no robots.txt" instead of throwing. */
async function safeRobots(origin: string): Promise<string | null> {
  try {
    return await fetchRobotsTxt(origin)
  } catch {
    return null
  }
}
