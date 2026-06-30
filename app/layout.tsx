import type { Metadata } from "next"
import { DM_Sans, DM_Mono } from "next/font/google"
import { getLocale, getMessages } from "next-intl/server"
import { bcp47, type Locale } from "@/i18n/routing"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ClarityAnalytics } from "@/components/analytics/clarity"
import { GoogleAnalytics } from "@/components/analytics/google-analytics"
import { siteConfig } from "@/lib/config"
import "./globals.css"

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // <html lang> is locale-aware. FR content graduated to indexed (2026-06-30),
  // so the lang attribute must match the page language (en-US vs fr-FR) or an
  // indexed /fr/ page wrongly declares English. Reading getLocale() opts the
  // shared layout into dynamic rendering — a deliberate tradeoff now that FR is
  // indexed (small marketing site, Vercel CDN-caches responses; 1-line revert).
  // The perf-preserving alternative is multiple root layouts via route groups.
  const locale = await getLocale()
  const lang = bcp47[locale as Locale] ?? "en-US"
  // Chrome (nav/footer) labels resolved server-side from messages/{locale}.json
  // and passed as plain-string props to the client Header/Footer. Each label
  // falls back to its English literal in the component, so a missing key never
  // crashes or blanks the global nav.
  const messages = (await getMessages()) as Record<string, Record<string, string>>
  const nav = messages.nav
  const common = messages.common
  const footer = messages.footer
  return (
    <html
      lang={lang}
      className={`${dmSans.variable} ${dmMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <a href="#main-content" className="skip-link">{common?.skipToContent ?? "Skip to main content"}</a>
        <Header nav={nav} />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer nav={nav} footer={footer} />
        <ClarityAnalytics />
        <GoogleAnalytics />
      </body>
    </html>
  )
}
