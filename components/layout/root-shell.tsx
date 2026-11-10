import localFont from "next/font/local"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { PromoBanner } from "@/components/layout/promo-banner"
import { ExitIntentPopup } from "@/components/layout/exit-intent-popup"
import { SaleBanner } from "@/components/layout/sale-banner"
import { AnnualBonusBanner } from "@/components/layout/annual-bonus-banner"
import { ReportExitPopup } from "@/components/layout/report-exit-popup"
import { ConsentManager } from "@/components/consent/consent-manager"
import { ImageLightbox } from "@/components/ui/image-lightbox"
import "@/app/globals.css"

// Font instances live here (module scope, as next/font requires) so BOTH root
// layouts — (marketing) [EN, static] and [locale] [per-locale] — share the exact
// same font objects and CSS variables. Keeping the <html>/<body>/chrome shell in
// one component is what lets us have two root layouts without the two <html>
// trees drifting apart.
// Fonts are SELF-HOSTED (next/font/local, files in ./fonts). They used to come from
// next/font/google, which downloads them from Google at build time: when that fetch
// failed the whole production build failed ("next/font/google queries have exactly one
// entry"). The files are the same latin + latin-ext woff2 subsets Google serves, with
// the same unicode ranges, so rendering is unchanged and the build needs no network.
// Each family is two instances because next/font/local takes one unicode-range per
// instance; globals.css joins them into --font-body / --font-mono. The loader only
// accepts literal values, so the two unicode ranges are written out in full.
const dmSans = localFont({
  src: [{ path: "./fonts/dm-sans-latin-variable.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-body-latin",
  display: "swap",
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }],
})

const dmSansExt = localFont({
  src: [{ path: "./fonts/dm-sans-latin-ext-variable.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-body-ext",
  display: "swap",
  preload: false,
  declarations: [{ prop: "unicode-range", value: "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF" }],
})

const dmMono = localFont({
  src: [
    { path: "./fonts/dm-mono-latin-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/dm-mono-latin-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-mono-latin",
  display: "swap",
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" }],
})

const dmMonoExt = localFont({
  src: [
    { path: "./fonts/dm-mono-latin-ext-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/dm-mono-latin-ext-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-mono-ext",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF" }],
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
      className={`${dmSans.variable} ${dmSansExt.variable} ${dmMono.variable} ${dmMonoExt.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <a href="#main-content" className="skip-link">{common?.skipToContent ?? "Skip to main content"}</a>
        <PromoBanner locale={locale} />
        {/* SG_SALE_OCT30_V1 (2026-10-24): October sale banner, hides itself after 2026-10-31. Replaces the free-scan
            banner (components/layout/scan-banner.tsx, LIVE=false, no longer mounted). */}
        <SaleBanner locale={locale} />
        {/* SG_ANNUAL_BONUS_NOV15_V1 (2026-11-09): free audit + 30-min call with annual plans, hides itself after Sun Nov 15 midnight PT. */}
        <AnnualBonusBanner locale={locale} />
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
        {/* SG_PROMO_EXIT_V1: last-chance founding-offer popup, desktop-only
            exit-intent trigger. See components/layout/exit-intent-popup.tsx. */}
        <ExitIntentPopup locale={locale} />
        {/* SG_REPORT_EXIT_V1: EN-only, desktop-only; stands down while a discount campaign is live. */}
        <ReportExitPopup locale={locale} />
      </body>
    </html>
  )
}
