import { DM_Sans, DM_Mono } from "next/font/google"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ClarityAnalytics } from "@/components/analytics/clarity"
import { GoogleAnalytics } from "@/components/analytics/google-analytics"
import "@/app/globals.css"

// Font instances live here (module scope, as next/font requires) so BOTH root
// layouts — (marketing) [EN, static] and [locale] [per-locale] — share the exact
// same font objects and CSS variables. Keeping the <html>/<body>/chrome shell in
// one component is what lets us have two root layouts without the two <html>
// trees drifting apart.
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

export function RootShell({
  lang,
  nav,
  common,
  footer,
  children,
}: {
  lang: string
  nav?: Record<string, string>
  common?: Record<string, string>
  footer?: Record<string, string>
  children: React.ReactNode
}) {
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
