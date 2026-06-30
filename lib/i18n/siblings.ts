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
