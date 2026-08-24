import createMiddleware from "next-intl/middleware"
import { NextResponse, type NextRequest } from "next/server"
import { routing } from "./i18n/routing"

const handleI18nRouting = createMiddleware(routing)

// Markdown mirrors for AI agents/crawlers (which don't render JS and pay per
// token): /blog/<slug>.md and /glossary/<slug>.md serve the article as plain
// markdown, as does requesting the canonical URL with `Accept: text/markdown`.
// Both rewrite to the internal /md/<locale>/<section>/<slug> route handler.
const MD_TWIN = /^\/(?:(fr|es)\/)?(blog|glossary)\/([^/]+)\.md$/
const ARTICLE_PATH = /^\/(?:(fr|es)\/)?(blog|glossary)\/([^/]+)$/

function markdownRewrite(request: NextRequest, locale: string, section: string, slug: string) {
  const res = NextResponse.rewrite(new URL(`/md/${locale}/${section}/${slug}`, request.url))
  res.headers.set("Vary", "Accept")
  return res
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Homepage content negotiation: `Accept: text/markdown` on / serves the
  // markdown twin at /home.md (same contract as articles). Any OTHER request for
  // / now falls through to next-intl routing below — the home page moved under
  // app/[locale]/ (to let /fr resolve), so `/` must enter locale routing to be
  // served as the `en` segment. (It stays STATIC via setRequestLocale there.)
  if (pathname === "/") {
    if (request.headers.get("accept")?.includes("text/markdown")) {
      const res = NextResponse.rewrite(new URL("/home.md", request.url))
      res.headers.set("Vary", "Accept")
      return res
    }
    // KNOWN LIMITATION, do not retry without changing the rendering mode.
    // The HTML variant of `/` does NOT carry `Vary: Accept`; only the markdown
    // variant does (set on the rewrite above). So a shared cache that stored the
    // HTML for a browser can in principle hand it to an agent that asked for
    // markdown. Two fixes were tried and BOTH are inert, measured on the live
    // deploy 2026-08-24:
    //   - `Vary: Accept` in next.config.ts `headers()` for source "/" — present
    //     in config, absent from the response.
    //   - appending it here via handleI18nRouting()'s response — same.
    // Cause: `/` is a STATICALLY PRERENDERED page, so Vercel serves it from the
    // static cache with its own headers (`vary: rsc, next-router-*`,
    // `x-vercel-cache: HIT` even on a cache-busted URL) and neither middleware
    // nor the config header reaches it. The only real fix is making `/` dynamic,
    // which trades every visitor's TTFB for an edge case — not worth it.
    // Left as a fallthrough into next-intl routing, which is what `/` needs.
  }

  const twin = MD_TWIN.exec(pathname)
  if (twin) {
    return markdownRewrite(request, twin[1] ?? "en", twin[2], twin[3])
  }

  // Content negotiation: only when the client explicitly asks for markdown
  // (browsers never send text/markdown, so human traffic is unaffected).
  if (request.headers.get("accept")?.includes("text/markdown")) {
    const article = ARTICLE_PATH.exec(pathname)
    if (article) {
      return markdownRewrite(request, article[1] ?? "en", article[2], article[3])
    }
  }

  // Static assets that live under a matched section (e.g. in-body article images at
  // /blog/<slug>/diagram.png) must NOT pass through next-intl locale routing, which
  // rewrites them into the locale tree and 404s the file. Anything with a file
  // extension falls through to normal static serving from /public.
  if (/\.[a-zA-Z0-9]+$/.test(request.nextUrl.pathname)) {
    return
  }
  return handleI18nRouting(request)
}

// SCOPE: only the localized content routes pass through locale middleware.
// Deliberately NOT matched (served untouched at root):
//   - root marketing/feature/tool/legal pages (EN-only until P3)
//   - /app, /api, /index.php, /router.php, /assets.php  → Replit rewrites (next.config.ts)
//   - /go, /r                                            → redirect infra
//   - /_next, /sitemap.xml, /robots.txt, /feed.xml, static assets, icons
// As content sections are localized, add their base path here.
// NOTE: the matcher still catches /blog/<slug>/<file>.png, so the file-extension
// guard above is what actually lets those in-body images through.
export const config = {
  // NOTE "/features/:path*" (was exact "/features"): as of the FR feature-page
  // migration, the hub AND all 14 /features/<slug> detail pages live under
  // app/[locale]/features, so the whole subtree enters next-intl routing.
  // ⚠️ Every slug must have an app/[locale]/features/<slug>/page.tsx — a
  // detail page left under (marketing) will 404 the moment it's matched here.
  // "/pricing" stays EXACT — it has no localized child routes; a localized
  // marketing page's base path enters next-intl, nothing below it does unless
  // the children are migrated too.
  matcher: ["/", "/features/:path*", "/pricing", "/blog/:path*", "/glossary/:path*", "/fr/:path*", "/es/:path*"],
}
