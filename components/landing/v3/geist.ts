import localFont from "next/font/local"

// Geist (SIL OFL 1.1, see components/layout/fonts/GEIST-OFL.txt), self-hosted like the other
// site fonts: a Latin subset of the variable file (wght 100-900, 28 KB). Declared in this module
// so only the routes that import it (the homepage) preload it.
export const geist = localFont({
  src: [{ path: "../../layout/fonts/geist-latin-variable.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-display",
  display: "swap",
  adjustFontFallback: "Arial",
})
