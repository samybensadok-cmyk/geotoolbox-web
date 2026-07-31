import { DM_Sans, DM_Mono } from "next/font/google"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { PromoBanner } from "@/components/layout/promo-banner"
import { ConsentManager } from "@/components/consent/consent-manager"
import { ImageLightbox } from "@/components/ui/image-lightbox"
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
  locale = "en",
  nav,
  common,
  footer,
  children,
}: {
  lang: string
  /** Routing locale ("en" | "fr") — distinct from `lang`, the BCP-47 form
   *  ("en-US" | "fr-FR"). Chrome links are localized from this so a visitor
   *  inside /fr doesn't get dropped onto the EN site by the nav. */
  locale?: string
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
        <PromoBanner locale={locale} />
        <Header nav={nav} locale={locale} />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer nav={nav} footer={footer} locale={locale} />
        {/* SG_CONSENT_V1: GA4 + Clarity now mount through the consent gate —
            EEA/UK/CH visitors (and unknown-country, fail-closed) see a banner and
            nothing loads until Accept; everyone else is unchanged. */}
        <ConsentManager locale={locale} />
        {/* Site-wide click-to-zoom for content images (blog figures, service/
            feature screenshots). Delegated — no per-page wiring needed. */}
        <ImageLightbox />
      </body>
    </html>
  )
}
