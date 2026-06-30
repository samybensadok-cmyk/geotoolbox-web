import createMiddleware from "next-intl/middleware"
import type { NextRequest } from "next/server"
import { routing } from "./i18n/routing"

const handleI18nRouting = createMiddleware(routing)

export default function middleware(request: NextRequest) {
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
  matcher: ["/blog/:path*", "/glossary/:path*", "/fr/:path*"],
}
