import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"
import { hasLocale } from "next-intl"
import { routing } from "@/i18n/routing"

// Pre-render both locales of the content routes. The nested [slug]
// generateStaticParams further restrict to slugs that exist per locale.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

// Locale segment for content routes (blog, glossary). Validates the locale,
// enables static rendering for everything below via setRequestLocale, and
// passes through. <html>/<body>/chrome stay in the root layout (P0 keeps
// marketing pages at root); per-locale <html lang> lands with the full
// marketing migration (spec §10 P3). hreflang — the load-bearing SEO signal —
// is emitted correctly per page via lib/i18n/siblings.ts regardless.
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  return children
}
