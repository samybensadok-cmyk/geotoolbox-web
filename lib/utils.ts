import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string, locale: string = "en"): string {
  const intlLocale =
    locale === "fr" ? "fr-FR" : locale === "es" ? "es" : locale === "de" ? "de-DE"
    : locale === "nl" ? "nl-NL" : "en-US"
  const hasTime = /[T:]/.test(dateString)
  if (hasTime) {
    const d = new Date(dateString)
    const date = d.toLocaleDateString(intlLocale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    const hh = String(d.getUTCHours()).padStart(2, "0")
    const mm = String(d.getUTCMinutes()).padStart(2, "0")
    return `${date} · ${hh}:${mm} UTC`
  }
  return new Date(dateString).toLocaleDateString(intlLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function calculateReadingTime(content: string): number {
  const words = content.split(/\s+/).length
  return Math.max(1, Math.ceil(words / 238))
}

/**
 * URL-safe anchor slug derived from heading text. Used to link the
 * table-of-contents sidebar to the MDX headings (which get matching
 * `id` attributes via the mdxComponents h2/h3 overrides).
 * Accents are folded to plain letters first (« visibilité » → `visibilite`,
 * « Übersicht » → `ubersicht`, ß → ss, œ → oe, æ → ae): `\w` is ASCII-only,
 * so without the fold French/Spanish/German headings lost their accented
 * letters and hand-written in-page anchors (`#...-visibilite-...`) broke.
 */
export function slugify(text: string): string {
  return String(text)
    .replace(/ß/g, "ss")
    .replace(/[Œœ]/g, "oe")
    .replace(/[Ææ]/g, "ae")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
