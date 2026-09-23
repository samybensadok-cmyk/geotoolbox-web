import { createHmac } from "node:crypto"
import { siteConfig } from "@/lib/config"
import { badgeColor, badgeSvg } from "@/lib/ai-readiness-badge"

/**
 * Embeddable AI-Readiness badge (the link engine for /tools/ai-readiness).
 *
 *   GET /tools/ai-readiness/badge?host=example.com  ->  flat SVG "AI-Readiness | 80%"
 *
 * Re-scores LIVE against the same endpoint the widget uses, so a badge on a
 * third-party site always reflects the host's current score — never a spoofable
 * client-supplied number. CDN-cached (s-maxage). Any failure renders a neutral
 * badge, never a broken image.
 */

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function svgResponse(svg: string, ok: boolean): Response {
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": ok
        ? "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400"
        : "public, max-age=0, s-maxage=60",
    },
  })
}

function cleanHost(raw: string): string {
  let h = raw.trim().toLowerCase()
  h = h.replace(/^[a-z][a-z0-9+.-]*:\/\//, "")
  h = h.split("/")[0].split("?")[0].split("#")[0].split("@").pop() ?? ""
  h = h.split(":")[0]
  return h
}

/**
 * SG_AIR_LIMITS_V2 (2026-09-23): tell the endpoint this is a badge render, not a visitor.
 * `x-sg-air-purpose: badge` keeps the scan out of the benchmark dataset (it used to double
 * every widget run). The token earns the badge's own rate-limit buckets: these calls arrive
 * from Vercel egress IPs, so per-client limits would lump every badge viewer together.
 * Derived from SG_EDGE_SECRET, never the secret itself; without it the purpose header still
 * suppresses recording and the call is limited like a widget run.
 */
function badgeHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json", "x-sg-air-purpose": "badge" }
  const secret = process.env.SG_EDGE_SECRET ?? ""
  if (secret !== "") headers["x-sg-air-badge"] = createHmac("sha256", secret).update("air-badge-v1").digest("hex")
  return headers
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const host = cleanHost(searchParams.get("host") ?? "")

  if (!host || !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(host)) {
    return svgResponse(badgeSvg("AI-Readiness", "checked", "#9f9f9f"), true)
  }

  // One cache entry per host (Codex review 2026-09-23): every other spelling of the same host
  // (case, extra params, encoded variants) is a distinct CDN key, so each would be a fresh miss and
  // a fresh scan against the host's badge budget. Redirect them all to the canonical URL instead.
  const canonical = `?host=${encodeURIComponent(host)}`
  if (new URL(request.url).search !== canonical) {
    return new Response(null, {
      status: 308,
      headers: {
        Location: `${siteConfig.url}/tools/ai-readiness/badge${canonical}`,
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    })
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 12000)
  try {
    const res = await fetch(`${siteConfig.url}/api/ai_readiness.php`, {
      method: "POST",
      headers: badgeHeaders(),
      body: JSON.stringify({ url: `https://${host}` }),
      signal: controller.signal,
    })
    const data = await res.json()
    if (!data?.success || !data?.composite) {
      return svgResponse(badgeSvg("AI-Readiness", "checked", "#9f9f9f"), false)
    }
    const pct: number = data.composite.pct
    return svgResponse(badgeSvg("AI-Readiness", `${pct}%`, badgeColor(pct)), true)
  } catch {
    return svgResponse(badgeSvg("AI-Readiness", "checked", "#9f9f9f"), false)
  } finally {
    clearTimeout(timer)
  }
}
