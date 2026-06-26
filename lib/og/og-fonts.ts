import fs from "node:fs"
import path from "node:path"

/**
 * Brand fonts for `next/og` (satori) renders, loaded from local TTFs in
 * /public/fonts so OG cards never depend on render-time network. Instrument
 * Serif is the display face; DM Sans is body; DM Mono is for kickers/labels.
 * The TTFs are the latin gstatic subsets (small) — see scripts that fetched them.
 */
const FONT_DIR = path.join(process.cwd(), "public", "fonts")
const read = (f: string) => fs.readFileSync(path.join(FONT_DIR, f))

export type OgFont = { name: string; data: Buffer; weight: 400 | 500 | 700; style: "normal" }

export function loadOgFonts(): OgFont[] {
  return [
    { name: "Instrument Serif", data: read("InstrumentSerif-Regular.ttf"), weight: 400, style: "normal" },
    { name: "DM Sans", data: read("DMSans-Regular.ttf"), weight: 400, style: "normal" },
    { name: "DM Sans", data: read("DMSans-Medium.ttf"), weight: 500, style: "normal" },
    { name: "DM Sans", data: read("DMSans-Bold.ttf"), weight: 700, style: "normal" },
    { name: "DM Mono", data: read("DMMono-Medium.ttf"), weight: 500, style: "normal" },
  ]
}
