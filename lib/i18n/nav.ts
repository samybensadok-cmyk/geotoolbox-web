import { routing } from "@/i18n/routing"

/**
 * Locale-aware href rewriting for SITE CHROME (header, footer).
 *
 * Why not next-intl's <Link>: it prefixes EVERY path with the active locale.
 * Most of this site is still EN-only — only the paths below are mounted under
 * app/[locale]/ — so blanket prefixing would send /fr/tools, /fr/about,
 * /fr/features/geo-scan etc. straight to a 404. This rewrites the paths that
 * genuinely have a localized route and leaves every other link pointing at its
 * working EN page.
 *
 * This function is PURE (no filesystem/content access) so it is safe inside the
 * client-side Header. Content deep links (/blog/<slug>, /glossary/<slug>) are
 * deliberately NOT handled here: their slugs differ per locale via the
 * donor-slug map, so they must go through makeLocalizer() from
 * lib/i18n/siblings.ts, which is server-only. See localizeChromeHref() below.
 *
 * KEEP IN SYNC with the routes under app/[locale]/ and the middleware matcher.
 *
 * A route belongs here only once it has REAL localized content. /fr/glossary
 * resolves (200) but has zero FR terms — it renders an English "Definitions are
 * on the way" placeholder — so /glossary is deliberately NOT listed: sending a
 * French visitor to an empty page is worse than sending them to the populated
 * EN glossary. Add it here the moment content/fr/glossary/ is populated.
 */
// Marketing routes are 1:1 same-path across ALL routing.locales (en/fr/es/de/nl).
const MARKETING_ROOTS = new Set([
  "/",
  "/features",
  "/pricing",
  // All 14 feature detail pages migrated under app/[locale]/features (2026-07-22).
  "/features/ai-visibility-tracker",
  "/features/geo-scan",
  "/features/agent-readiness",
  "/features/query-fanout",
  "/features/content-analyzer",
  "/features/content-studio",
  "/features/domain-overview",
  "/features/competitor-intel",
  "/features/community",
  "/features/citation-interceptor",
  "/features/ask-geotoolbox",
  "/features/analytics",
  "/features/pr-coverage-tracker",
  "/features/white-label-reports",
])

// Routes whose localized version exists only for SOME locales. /blog is live
// for fr but es has no articles yet (an empty /es/blog would be worse than the
// populated EN blog — same logic that keeps /glossary out entirely). /privacy
// is an FR-only page (CNIL: consent info in the visitor's language, shipped
// 2026-07-28); [locale]/privacy 404s every other non-en locale by design.
const PARTIAL_ROOTS: Record<string, ReadonlySet<string>> = {
  // ⚠️ ADD "es" to /blog the day the first ES article ships — the blog route,
  // sitemap and feed self-gate on posts existing, but this nav map is static
  // (client Header can't check content), so it's the one manual flip.
  "/blog": new Set(["fr", "es", "de", "nl"]),
  "/privacy": new Set(["fr"]),
}

function isLocalizedFor(path: string, locale: string): boolean {
  if (MARKETING_ROOTS.has(path)) return true
  return PARTIAL_ROOTS[path]?.has(locale) ?? false
}

export function localizeNavHref(href: string, locale: string): string {
  // The default locale has no prefix, so EN output stays byte-identical and
  // this is a guaranteed no-op there.
  if (locale === routing.defaultLocale) return href
  // Leave external links, anchors, mailto:, and the /app + /api rewrites alone.
  if (!href.startsWith("/") || href.startsWith("/app") || href.startsWith("/api")) return href

  const match = /^([^?#]*)(.*)$/.exec(href)
  if (!match) return href
  const [, path, suffix] = match
  // Trailing-slash tolerant: "/blog/" and "/blog" are the same route.
  const clean = path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path
  if (!isLocalizedFor(clean, locale)) return href
  return `/${locale}${clean === "/" ? "" : clean}${suffix}`
}
