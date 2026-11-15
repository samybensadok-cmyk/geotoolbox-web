import { LOCALIZED_MARKETING_ROUTES } from "./localized-routes"

// Pure link-rewrite logic behind makeLocalizer (lib/i18n/siblings.ts). Kept free
// of content/fs imports so scripts/test-localize-href.mjs can load it directly.

export type SiblingLookup = (kind: "blog" | "glossary", slug: string) => string | undefined

const MARKETING = new Set<string>(LOCALIZED_MARKETING_ROUTES)

// Optional origin, then /blog|/glossary, the slug, then an optional /#? suffix.
// Start-anchored: does NOT match /fr/blog/..., so already-localized links pass
// through untouched.
const CONTENT_RE = /^(https?:\/\/(?:www\.)?geotoolbox\.ai)?\/(blog|glossary)\/([a-z0-9-]+)([/#?].*)?$/i

// Optional origin, then /pricing | /features | /features/<slug>, an optional
// single trailing slash, then an optional #/? suffix. Deeper paths
// (/features/x/y) do not match. Start-anchored for the same reason as above.
const MARKETING_RE =
  /^(https?:\/\/(?:www\.)?geotoolbox\.ai)?(\/(?:pricing|features(?:\/[a-z0-9-]+)?))(\/?)([#?].*)?$/

export function createHrefLocalizer(
  locale: string,
  defaultLocale: string,
  lookup: SiblingLookup,
): (href: string) => string {
  if (locale === defaultLocale) return (href) => href
  return (href: string): string => {
    if (!href) return href
    const c = href.match(CONTENT_RE)
    if (c) {
      const [, origin, rawKind, slug, suffix = ""] = c
      const kind = rawKind.toLowerCase() as "blog" | "glossary"
      const target = lookup(kind, slug)
      if (!target) return href // no sibling in this locale -> keep the EN link
      const path = `/${locale}/${kind}/${target}${suffix}`
      return origin ? `${origin}${path}` : path
    }
    const m = href.match(MARKETING_RE)
    if (m) {
      const [, origin, route, slash = "", suffix = ""] = m
      if (!MARKETING.has(route)) return href // EN-only route (redirect / not mounted per locale)
      const path = `/${locale}${route}${slash}${suffix}`
      return origin ? `${origin}${path}` : path
    }
    return href
  }
}
