import { notFound } from "next/navigation"
import { setRequestLocale, getMessages } from "next-intl/server"
import { hasLocale } from "next-intl"
import { routing, bcp47, type Locale } from "@/i18n/routing"
import { RootShell } from "@/components/layout/root-shell"
import { rootMetadata } from "@/lib/root-metadata"

export const metadata = rootMetadata

// Pre-render both locales of the content routes. The nested [slug]
// generateStaticParams further restrict to slugs that exist per locale.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

// ROOT LAYOUT #2 — the per-locale content tree (blog, glossary; EN via
// `as-needed` at /blog, FR at /fr/blog). It renders its OWN <html> so the
// lang attribute is correct per locale (en-US, and bare `fr`/`es` per the
// language-only rule in i18n/routing.ts) — the load-bearing SEO signal for
// indexed /fr/ and /es/ pages. setRequestLocale(locale) + generateStaticParams
// keep everything below STATIC (getMessages resolves from the param, not the
// request). Splitting this from the EN marketing root is what lets the marketing
// tree be request-free/static while /fr and /es still get their own <html lang>.
export default async function LocaleRootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const messages = (await getMessages()) as Record<string, Record<string, string>>
  return (
    <RootShell
      lang={bcp47[locale as Locale] ?? "en-US"}
      locale={locale}
      nav={messages.nav}
      common={messages.common}
      footer={messages.footer}
    >
      {children}
    </RootShell>
  )
}
