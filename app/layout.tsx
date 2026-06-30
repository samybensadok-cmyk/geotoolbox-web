import type { Metadata } from "next"
import { DM_Sans, DM_Mono } from "next/font/google"
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // NOTE: <html lang> is static "en" here. FR content pages (under [locale])
  // therefore inherit lang="en" — an accepted P0 limitation since those pages
  // are noindex until graduation. The correct per-locale <html lang> requires
  // moving <html> into app/[locale]/layout.tsx, which lands with the full
  // marketing-route migration (spec §10 P3). Reading getLocale() here instead
  // was tested and rejected: it forces the ENTIRE app into dynamic rendering
  // (all static/SSG pages → ƒ SSR), a major perf regression. hreflang — the
  // load-bearing SEO signal — is emitted correctly per page regardless.
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${dmMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
        <ClarityAnalytics />
        <GoogleAnalytics />
      </body>
    </html>
  )
}
