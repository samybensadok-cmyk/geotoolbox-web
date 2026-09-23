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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const host = cleanHost(searchParams.get("host") ?? "")

  if (!host || !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(host)) {
    return svgResponse(badgeSvg("AI-Readiness", "checked", "#9f9f9f"), true)
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 12000)
  try {
    const res = await fetch(`${siteConfig.url}/api/ai_readiness.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
