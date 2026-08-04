import { defineRouting } from "next-intl/routing"

// Locale routing config — single source of truth for the locale set.
// `as-needed` keeps the default locale (en) at the root with NO prefix
// (so existing EN URLs like /blog/x are byte-identical), and prefixes
// every other locale: /fr/blog/x.
//
// P0 ships with `en` + `fr` defined but only the content routes
// (blog, glossary) live under app/[locale]/. Marketing/feature/tool
// pages stay at root (EN-only) until they're translated (spec §10 P3).
export const routing = defineRouting({
  locales: ["en", "fr", "es"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  // Crawler-safe + deep-link-safe: never auto-redirect on Accept-Language.
  // A user on /blog stays on /blog; FR is reached only via an explicit
  // /fr/ URL or a language switcher (spec §6). Revisit for a P3 opt-in.
  localeDetection: false,
  // We own hreflang via per-page metadata + the sitemap, driven by the
  // donor-slug sibling map (FR slugs differ from EN, e.g. comment-fonctionne-
  // chatgpt). next-intl's automatic Link-header alternates assume SAME-path
  // slugs, so they'd advertise wrong/nonexistent URLs AND add headers to EN
  // responses (breaking byte-identical output). Disable them.
  alternateLinks: false,
})

export type Locale = (typeof routing.locales)[number]

// BCP-47 forms for <html lang> + hreflang (spec §0: one locked form each).
// es is deliberately language-only (neutral international Spanish targeting
// Spain + LatAm together), unlike fr-FR which targets France specifically.
export const bcp47: Record<Locale, string> = {
  en: "en-US",
  fr: "fr-FR",
  es: "es",
}

// Locales whose BLOG content tree is wired under content/{locale}/blog.
// Marketing pages under app/[locale]/ serve ALL routing.locales; the blog
// serves these — AND additionally self-gates on posts actually existing
// (a wired locale with zero posts still 404s its index and stays out of the
// sitemap/feed), so /es/blog goes live automatically with the first ES
// article, with no flag to flip at ship time. KEEP IN SYNC with content/.
export const contentLocales: readonly Locale[] = ["en", "fr", "es"]

// The glossary is a separate, narrower policy: en is live, fr deliberately
// renders a "definitions on the way" placeholder (operator call 2026-07-18),
// and every other locale 404s. Do NOT fold this into contentLocales — adding
// es there must not resurrect an English placeholder at /es/glossary.
export const glossaryLocales: readonly Locale[] = ["en", "fr"]
