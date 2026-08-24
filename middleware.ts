import createMiddleware from "next-intl/middleware"
import { NextResponse, type NextRequest } from "next/server"
import { routing } from "./i18n/routing"
import { isDefinitelyUnknownPath, prefersNonHtml } from "./lib/known-routes"

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

  // AGENT-FACING MARKDOWN 404.
  // A 404 whose body is real markdown is the difference between an agent that can
  // re-plan and one that hits a dead end, and it is what the strongest 404 contracts
  // serve. Browsers keep the designed HTML 404 page: this is Accept negotiation, not
  // user-agent sniffing — a client that never mentions text/html is not a browser.
  //
  // It fires ONLY on paths that are guaranteed 404s (an unowned first segment, no
  // file extension), because middleware runs before routing and cannot ask Next
  // whether a path resolves. See lib/known-routes.ts — being over-inclusive there is
  // safe, under-inclusive is not, and `npm run check:agents` enforces it.
  if (isDefinitelyUnknownPath(pathname) && prefersNonHtml(request.headers.get("accept"))) {
    const res = NextResponse.rewrite(new URL("/404.md", request.url))
    res.headers.set("Vary", "Accept")
    return res
  }

  // Static assets that live under a matched section (e.g. in-body article images at
  // /blog/<slug>/diagram.png) must NOT pass through next-intl locale routing, which
  // rewrites them into the locale tree and 404s the file. Anything with a file
  // extension falls through to normal static serving from /public.
  if (/\.[a-zA-Z0-9]+$/.test(request.nextUrl.pathname)) {
    return
  }

  // The matcher below now includes a catch-all so the markdown-404 rule above can
  // see every path. Everything OUTSIDE the original i18n route set must therefore
  // be handed back UNTOUCHED — running handleI18nRouting over the root marketing
  // pages would rewrite them into the locale tree and 404 them.
  if (!I18N_ROUTES.test(pathname)) {
    return
  }
  return handleI18nRouting(request)
}

// The exact path set that entered next-intl routing before the catch-all matcher
// was added. KEEP IN SYNC with the non-catch-all entries in `config.matcher`.
const I18N_ROUTES =
  /^\/(?:$|features(?:\/|$)|pricing$|blog(?:\/|$)|glossary(?:\/|$)|fr(?:\/|$)|es(?:\/|$))/

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
  matcher: [
    "/",
    "/features/:path*",
    "/pricing",
    "/blog/:path*",
    "/glossary/:path*",
    "/fr/:path*",
    "/es/:path*",
    // Catch-all, added ONLY so the agent-facing markdown-404 rule can see unowned
    // paths. Middleware hands every path outside the list above straight back
    // untouched (see the I18N_ROUTES guard), so routing behaviour is unchanged.
    // The exclusions are the paths that must never enter middleware at all:
    // framework internals and the Replit-proxied app.
    "/((?!_next/|_vercel/|api/|app/|index\\.php|router\\.php|assets\\.php).*)",
  ],
}
