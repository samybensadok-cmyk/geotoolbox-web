import { routing } from "@/i18n/routing"

// Relative, locale-aware path for an internal content link. Honors the
// `as-needed` prefix (default locale at the root, every other locale prefixed),
// so components rendered inside the [locale] tree link to /fr/blog/<slug>
// instead of the EN /blog/<slug> path — which 404s for an FR slug. Pure and
// client-safe: it depends only on the routing config (no fs/content imports),
// so both server and client components can use it. This is the link-building
// counterpart to makeLocalizer() (which rewrites authored MDX links); use this
// wherever a component constructs a content href from a slug + locale.
export function localePath(kind: "blog" | "glossary", slug: string, locale: string): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`
  return `${prefix}/${kind}/${slug}`
}
