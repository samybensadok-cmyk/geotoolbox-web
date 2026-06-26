import { NextResponse, type NextRequest } from "next/server"
import { getAffiliateLink } from "@/lib/affiliate-links"

/**
 * Affiliate redirect handler — `/go/<slug>` → 302 to the partner's tracking URL.
 *
 * Why a redirect layer (not raw links in MDX): swap a partner / fix a dead
 * deep-link in one file (`lib/affiliate-links.ts`), measure clicks, and keep the
 * registry as the single source of truth. Links in articles are written as
 * `/go/<slug>` and rendered `rel="sponsored nofollow"` + new tab by the MDX `<a>`
 * override.
 *
 * SEO/spam hygiene: emits `X-Robots-Tag: noindex` and `/go/` is Disallow-ed in
 * robots.ts, so redirects never enter the index. A clean server 302 (no JS/meta
 * cloaking) keeps this clearly legitimate under Google's sneaky-redirect policy.
 */

export const dynamic = "force-dynamic"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const link = getAffiliateLink(slug)

  if (!link) {
    return new NextResponse("Unknown link", {
      status: 404,
      headers: { "X-Robots-Tag": "noindex, nofollow" },
    })
  }

  let dest = link.url
  if (!link.noUtm) {
    try {
      const u = new URL(dest)
      // `?ref=<post-slug>` lets a post tag its own clicks for per-page EPC.
      const campaign = req.nextUrl.searchParams.get("ref") || "blog"
      if (!u.searchParams.has("utm_source")) u.searchParams.set("utm_source", "geotoolbox")
      if (!u.searchParams.has("utm_medium")) u.searchParams.set("utm_medium", "affiliate")
      if (!u.searchParams.has("utm_campaign")) u.searchParams.set("utm_campaign", campaign)
      dest = u.toString()
    } catch {
      // Malformed URL in the registry — fall back to the raw value rather than 500.
    }
  }

  // TODO(click-logging): optionally POST { slug, ref, ts } to the Neon-backed
  // PHP endpoint here for per-post EPC, once an `affiliate_clicks` table exists.

  const res = NextResponse.redirect(dest, 302)
  res.headers.set("X-Robots-Tag", "noindex, nofollow")
  res.headers.set("Cache-Control", "no-store")
  return res
}
