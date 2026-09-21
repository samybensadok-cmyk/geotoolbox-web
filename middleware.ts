import createMiddleware from "next-intl/middleware"
import { NextResponse, type NextRequest } from "next/server"
import { routing } from "./i18n/routing"
import { isDefinitelyUnknownPath, prefersNonHtml } from "./lib/known-routes"
import { GLOSSARY_REDIRECTS } from "./lib/glossary-redirects"

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

// RETIRED GLOSSARY (2026-09-19). Every /glossary and /fr/glossary URL 301s to
// the broader article that covers the term, or returns a real 410 where no
// same-locale article exists (lib/glossary-redirects.ts, generated from the
// migration CSV). This runs BEFORE the markdown-twin rewrite on purpose: a
// `.md` glossary request would otherwise be rewritten to the internal /md/
// route and never reach the table. The .md twin of a retired URL 301s to the
// .md twin of its target, so an agent that asked for markdown still gets
// markdown at the end of the hop. Trailing slashes are stripped before the
// lookup as a safety net; in practice Next 308-normalises /glossary/x/ to
// /glossary/x BEFORE middleware runs (same as every route on the site), so a
// slashed retired URL is 308 → 301 → 200 — accepted, none are linked anywhere.
// These rules stay live indefinitely — Google needs to crawl the 301/410 to
// process it, so never disallow /glossary in robots.txt either.
const RETIRED_GLOSSARY = /^\/(?:fr\/)?glossary(?:\/|$)/

function retiredGlossaryResponse(request: NextRequest): NextResponse | undefined {
  const { pathname } = request.nextUrl
  if (!RETIRED_GLOSSARY.test(pathname)) return
  const isMd = pathname.endsWith(".md")
  const key = pathname.replace(/\.md$/, "").replace(/\/+$/, "")
  const rule = GLOSSARY_REDIRECTS[key]
  if (!rule) return // unknown term: fall through to the normal 404
  if (rule.status === 301) {
    // Only term pages have markdown twins; the hubs (/glossary → /blog) do not.
    const to = isMd && key.includes("/glossary/") ? `${rule.to}.md` : rule.to
    const url = new URL(to, request.url)
    url.search = request.nextUrl.search // keep ?utm_* etc. — a campaign link to a term keeps its attribution
    return NextResponse.redirect(url, 301)
  }
  const localePrefix = key.startsWith("/fr/") ? "/fr" : ""
  const blog = new URL(`${localePrefix}/blog`, request.url).toString()
  const wantsHtml = !isMd && (request.headers.get("accept") ?? "").includes("text/html")
  if (wantsHtml) {
    const html = `<!doctype html><html lang="${localePrefix ? "fr" : "en"}"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>410 Gone</title><style>body{font-family:system-ui,sans-serif;max-width:40rem;margin:4rem auto;padding:0 1rem;color:#111}a{color:#1d4ed8}</style></head><body><h1>410 — ${localePrefix ? "Cette page a été retirée" : "This page has been retired"}</h1><p>${localePrefix ? `Le glossaire a été fusionné dans le blog. <a href="${blog}">Parcourir les articles</a>.` : `The glossary was folded into the blog. <a href="${blog}">Browse the articles</a>.`}</p></body></html>`
    return new NextResponse(html, { status: 410, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=3600", vary: "Accept" } })
  }
  const md = [
    "# 410 Gone",
    "",
    `\`${key}\` was a glossary entry. The glossary was retired on 2026-09-19 and this term has no same-locale replacement, so the URL is permanently gone — do not retry it.`,
    "",
    `- Articles: ${blog}`,
    `- Site index: ${new URL("/llms.txt", request.url)}`,
    `- Sitemap: ${new URL("/sitemap.xml", request.url)}`,
    "",
  ].join("\n")
  return new NextResponse(md, { status: 410, headers: { "content-type": "text/markdown; charset=utf-8", "cache-control": "public, max-age=3600", vary: "Accept" } })
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // SG_GEO_HEADER_V1 (2026-09-21): forward the visitor's country to the Replit-proxied app.
  // Vercel strips the reserved `x-vercel-*` request headers on an EXTERNAL rewrite, so
  // inc/consent_gate.php never sees x-vercel-ip-country and fails CLOSED for a direct-to-/app
  // visitor: no GA4 on that first pageview, and the sign_up / begin_checkout events fired there
  // are lost, because the banner's geo self-heal only resolves the country and reloads AFTER
  // them. Re-emitting it under a non-reserved name lets PHP classify the visitor on their FIRST
  // request. This runs before every other rule and returns immediately, so /app keeps its
  // exemption from i18n routing and from the markdown-404 rule (it is excluded from the
  // catch-all matcher entry for exactly that reason; the explicit /app entries below opt it
  // into header forwarding ONLY). NextResponse.next() hands the request straight on to the
  // next.config.ts rewrite — /app is not served by this app.
  if (pathname === "/app" || pathname.startsWith("/app/")) {
    const country = request.headers.get("x-vercel-ip-country") ?? ""
    const headers = new Headers(request.headers)
    // Always strip an inbound copy before setting our own. Verified against production
    // 2026-09-21: a custom header supplied by the CLIENT does survive the external rewrite
    // and PHP honours it, so returning early when Vercel's geo is absent would leave the
    // visitor in control of their own consent classification. Deleting first means that
    // wherever this middleware runs, the value PHP sees is the edge's or nothing.
    // (A request sent straight to the Replit origin bypasses this entirely — the same
    // accepted threat model consent_gate.php already documents for sg_cc: self-spoofing
    // only defeats the spoofer's own gate.)
    headers.delete("x-sg-ip-country")
    if (/^[A-Z]{2}$/.test(country)) headers.set("x-sg-ip-country", country)
    return NextResponse.next({ request: { headers } })
  }

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

  const retired = retiredGlossaryResponse(request)
  if (retired) return retired

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
    // SG_GEO_HEADER_V1: header forwarding only — the handler returns before any routing rule.
    "/app",
    "/app/:path*",
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
