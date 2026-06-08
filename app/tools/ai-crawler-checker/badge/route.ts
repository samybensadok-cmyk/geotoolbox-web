import { siteConfig } from "@/lib/config"

/**
 * Embeddable AI-crawler-access badge (the link engine for /tools/ai-crawler-checker).
 *
 *   GET /tools/ai-crawler-checker/badge?host=example.com  ->  flat SVG "AI crawlers | N/34"
 *
 * Re-checks LIVE against the same endpoint the widget uses, so a badge on a
 * third-party site always reflects the host's current robots.txt — never a
 * spoofable client-supplied number. Heavily CDN-cached (s-maxage) so repeated
 * impressions don't hammer the backend. Any failure renders a neutral badge,
 * never a broken image.
 */

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

/** Flat shields-style two-segment badge. */
function badgeSvg(left: string, right: string, color: string): string {
  const lw = 6.6 * left.length + 16
  const rw = 6.6 * right.length + 16
  const w = Math.round(lw + rw)
  const lwR = Math.round(lw)
  const lx = (lwR / 2) * 10
  const rx = (lwR + rw / 2) * 10
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="20" role="img" aria-label="${esc(left)}: ${esc(right)}">
<linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient>
<clipPath id="r"><rect width="${w}" height="20" rx="3" fill="#fff"/></clipPath>
<g clip-path="url(#r)">
<rect width="${lwR}" height="20" fill="#444"/>
<rect x="${lwR}" width="${w - lwR}" height="20" fill="${color}"/>
<rect width="${w}" height="20" fill="url(#s)"/>
</g>
<g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="110" text-rendering="geometricPrecision">
<g transform="scale(.1)">
<text x="${lx}" y="150" fill="#010101" fill-opacity=".3">${esc(left)}</text>
<text x="${lx}" y="140">${esc(left)}</text>
<text x="${rx}" y="150" fill="#010101" fill-opacity=".3">${esc(right)}</text>
<text x="${rx}" y="140">${esc(right)}</text>
</g>
</g>
</svg>`
}

function svgResponse(svg: string, ok: boolean): Response {
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      // Successes cache for an hour at the edge; failures only briefly.
      "Cache-Control": ok
        ? "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400"
        : "public, max-age=0, s-maxage=60",
    },
  })
}

/** Strip scheme/path/userinfo to a bare hostname. */
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
    return svgResponse(badgeSvg("AI crawlers", "checked", "#9f9f9f"), true)
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 8000)
  try {
    const res = await fetch(`${siteConfig.url}/api/ai_crawler_check.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: `https://${host}` }),
      signal: controller.signal,
    })
    const data = await res.json()
    if (!data?.success || !data?.summary) {
      return svgResponse(badgeSvg("AI crawlers", "checked", "#9f9f9f"), false)
    }
    const allowed: number = data.summary.allowed
    const total: number = data.summary.total
    const color = allowed === total ? "#2ea44f" : allowed === 0 ? "#e05d44" : "#dfb317"
    return svgResponse(badgeSvg("AI crawlers", `${allowed}/${total}`, color), true)
  } catch {
    return svgResponse(badgeSvg("AI crawlers", "checked", "#9f9f9f"), false)
  } finally {
    clearTimeout(timer)
  }
}
