import { getAllPosts, getAllGlossaryTerms } from "@/lib/content"
import { routing, bcp47, type Locale } from "@/i18n/routing"
import { siteConfig } from "@/lib/config"

type Kind = "blog" | "glossary"

// Absolute URL for a content page, honoring localePrefix 'as-needed'
// (en at root, every other locale under /{locale}).
export function urlFor(kind: Kind, slug: string, locale: string): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`
  return `${siteConfig.url}${prefix}/${kind}/${slug}`
}

// enSlug -> { [locale]: localizedSlug } for one content kind. EN is the hub;
// localized siblings attach via their frontmatter `donorSlug`. This is the
// ONE place the cross-locale relationship is derived (spec §3) — hreflang,
// canonical, and sitemap alternates all read from it, so they can't drift.
function siblingIndex(kind: Kind): Map<string, Record<string, string>> {
  const idx = new Map<string, Record<string, string>>()
  const all = kind === "blog" ? getAllPosts : getAllGlossaryTerms
  for (const item of all(routing.defaultLocale)) {
    idx.set(item.slug, { [routing.defaultLocale]: item.slug })
  }
  for (const locale of routing.locales) {
    if (locale === routing.defaultLocale) continue
    for (const item of all(locale)) {
      const en = item.donorSlug
      if (!en) continue
      const rec = idx.get(en) ?? { [routing.defaultLocale]: en }
      rec[locale] = item.slug
      idx.set(en, rec)
    }
  }
  return idx
}

// The EN (hub) slug for any locale's slug, via donorSlug.
function enSlugOf(kind: Kind, slug: string, locale: string): string | undefined {
  if (locale === routing.defaultLocale) return slug
  const all = kind === "blog" ? getAllPosts : getAllGlossaryTerms
  return all(locale).find((i) => i.slug === slug)?.donorSlug
}

// Metadata.alternates payload: self-canonical + reciprocal hreflang
// (+ x-default -> EN) ONLY when a cross-locale sibling actually exists.
// Pre-FR (no siblings), returns just the canonical, so existing EN page
// output is unchanged — this is what keeps P0 a zero-regression landing.
export function alternatesFor(
  kind: Kind,
  slug: string,
  locale: string,
): { canonical: string; languages?: Record<string, string> } {
  const canonical = urlFor(kind, slug, locale)
  const en = enSlugOf(kind, slug, locale)
  if (!en) return { canonical }
  const rec = siblingIndex(kind).get(en)
  if (!rec || Object.keys(rec).length < 2) return { canonical }
  const languages: Record<string, string> = {}
  for (const [loc, s] of Object.entries(rec)) {
    languages[bcp47[loc as Locale]] = urlFor(kind, s, loc)
  }
  languages["x-default"] = urlFor(kind, rec[routing.defaultLocale] ?? en, routing.defaultLocale)
  return { canonical, languages }
}

// Fixed hreflang map for the localized MARKETING pages (home, features,
// pricing). Unlike content, these have a 1:1 SAME-PATH relationship across
// locales (/ ⇄ /fr, /features ⇄ /fr/features), so the sibling set is the full
// locale list — no donor-slug lookup. `path` is the marketing path WITHOUT the
// locale prefix ("" for home, "/features", "/pricing"). Keep the caller list in
// sync with the marketing routes actually mounted under app/[locale]/.
export function marketingAlternatesFor(path: string, locale: string) {
  const url = (loc: string) =>
    `${siteConfig.url}${loc === routing.defaultLocale ? "" : `/${loc}`}${path}`
  const canonical = url(locale)
  const languages: Record<string, string> = {}
  for (const loc of routing.locales) languages[bcp47[loc as Locale]] = url(loc)
  languages["x-default"] = url(routing.defaultLocale)
  return { canonical, languages }
}

// Per-locale internal-link localizer for MDX body links. Given an href, it
// rewrites an internal /blog/<en-slug> or /glossary/<en-slug> (relative OR
// absolute geotoolbox.ai/...) to the localized sibling for `locale` when one
// exists, preserving the origin style and any trailing /#? suffix. Links whose
// EN slug has no sibling in this locale (EN-only pages), already-localized
// links (/fr/blog/...), and non-content/external links are returned unchanged.
// Built from the SAME donor-slug sibling map that drives hreflang, so an
// in-body link and the page's hreflang can never point at different siblings.
// For the default locale (en, the hub) it's a no-op — no index build, no cost.
export function makeLocalizer(locale: string): (href: string) => string {
  if (locale === routing.defaultLocale) return (href) => href
  const idx: Record<Kind, Map<string, Record<string, string>>> = {
    blog: siblingIndex("blog"),
    glossary: siblingIndex("glossary"),
  }
  // Optional origin, then /blog|/glossary, the slug, then an optional
  // /#? suffix. Note this does NOT match /fr/blog/... (path must START with
  // /blog or /glossary), so already-localized links pass through untouched.
  const re = /^(https?:\/\/(?:www\.)?geotoolbox\.ai)?\/(blog|glossary)\/([a-z0-9-]+)([/#?].*)?$/i
  return (href: string): string => {
    if (!href) return href
    const m = href.match(re)
    if (!m) return href
    const [, origin, kind, slug, suffix = ""] = m
    const target = idx[kind as Kind].get(slug)?.[locale]
    if (!target) return href // no sibling in this locale -> keep the EN link
    const path = `/${locale}/${kind}/${target}${suffix}`
    return origin ? `${origin}${path}` : path
  }
}

// All indexable content URLs across locales, for the sitemap (spec §5).
export function allContentEntries(): Array<{
  kind: Kind
  slug: string
  locale: string
  url: string
  languages?: Record<string, string>
}> {
  const out: ReturnType<typeof allContentEntries> = []
  for (const kind of ["blog", "glossary"] as const) {
    for (const locale of routing.locales) {
      const all = kind === "blog" ? getAllPosts : getAllGlossaryTerms
      for (const item of all(locale)) {
        const { canonical, languages } = alternatesFor(kind, item.slug, locale)
        out.push({ kind, slug: item.slug, locale, url: canonical, languages })
      }
    }
  }
  return out
}
