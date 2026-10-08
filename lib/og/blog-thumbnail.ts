import type { Post } from "@/lib/content"
import { primaryTopic, TOPICS } from "@/lib/blog-topics"

// Text-free card art, drawn as SVG (about 1 KB, sharp at any pixel density). The
// card already prints the topic, title and date in the reader's language, so the
// image carries colour and shape only. Colour follows the primary topic; the
// arrangement is a deterministic function of the slug, so each article is
// distinct inside its topic and rebuilds are stable.
const PALETTES = [
  ["#0f766e", "#5eead4"], // teal
  ["#1d4ed8", "#93c5fd"], // blue
  ["#7c3aed", "#c4b5fd"], // violet
  ["#c2410c", "#fdba74"], // amber
  ["#be185d", "#f9a8d4"], // rose
  ["#15803d", "#86efac"], // green
] as const

function hash(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) h = Math.imul(h ^ input.charCodeAt(i), 16777619)
  return h >>> 0
}

const W = 800
const H = 450

export function buildBlogThumbnailSvg(post: Pick<Post, "slug" | "tags" | "title" | "description" | "date" | "locale" | "content" | "readingTime" | "author" | "draft" | "noindex">): string {
  const topicIndex = Math.max(0, TOPICS.findIndex((topic) => topic.slug === primaryTopic(post as Post).slug))
  const base = PALETTES[topicIndex % PALETTES.length]
  const h = hash(post.slug)
  const pick = (shift: number, mod: number) => (h >>> shift) % mod
  // Inside a topic, vary the palette direction and the composition.
  const flip = pick(0, 2) === 1
  const [dark, light] = flip ? [base[0], base[1]] : [base[0], base[1]]
  const angle = [0, 45, 90, 135, 180, 225][pick(2, 6)]
  const orbA = 150 + pick(5, 170)
  const orbB = 110 + pick(9, 130)
  const ax = 520 + pick(13, 260)
  const ay = pick(17, 160)
  const bx = pick(21, 260)
  const by = 300 + pick(25, 150)
  const cardX = 90 + pick(3, 340)
  const cardY = 60 + pick(7, 70)
  const bars = [0.62 + pick(11, 30) / 100, 0.78 + pick(15, 18) / 100, 0.46 + pick(19, 34) / 100]
  const mark = pick(23, 3) // 0 circle, 1 rounded square, 2 diamond
  const dots = pick(27, 2) === 1
  const accent = pick(29, 2) === 1 ? light : dark
  const cardW = 320
  const cardH = 330 - (cardY - 60) * 0.6
  const markShape = mark === 0
    ? `<circle cx="${cardX + 54}" cy="${cardY + 54}" r="26" fill="${accent}"/>`
    : mark === 1
      ? `<rect x="${cardX + 28}" y="${cardY + 28}" width="52" height="52" rx="12" fill="${accent}"/>`
      : `<rect x="${cardX + 28}" y="${cardY + 28}" width="48" height="48" rx="8" fill="${accent}" transform="rotate(45 ${cardX + 52} ${cardY + 52})"/>`
  const rows = bars.map((fraction, i) =>
    `<rect x="${cardX + 28}" y="${cardY + 120 + i * 40}" width="${Math.round((cardW - 56) * fraction)}" height="16" rx="8" fill="${i === 1 ? light : "#e5e7eb"}"/>`).join("")
  const dotGrid = dots
    ? Array.from({ length: 5 }, (_, r) => Array.from({ length: 7 }, (_, c) =>
      `<circle cx="${60 + c * 22}" cy="${340 + r * 22}" r="3" fill="#fff" fill-opacity=".35"/>`).join("")).join("")
    : ""
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-hidden="true">`
    + `<defs><linearGradient id="g" gradientTransform="rotate(${angle} .5 .5)"><stop offset="0" stop-color="${dark}"/><stop offset="1" stop-color="${light}"/></linearGradient>`
    + `<filter id="s" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#000" flood-opacity=".22"/></filter></defs>`
    + `<rect width="${W}" height="${H}" fill="url(#g)"/>`
    + `<circle cx="${ax}" cy="${ay}" r="${orbA / 2}" fill="#fff" fill-opacity=".16"/>`
    + `<circle cx="${bx}" cy="${by}" r="${orbB / 2}" fill="#fff" fill-opacity=".12"/>`
    + dotGrid
    + `<rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="24" fill="#fff" fill-opacity=".95" filter="url(#s)"/>`
    + markShape + rows
    + `</svg>`
}

export function renderBlogThumbnail(post: Parameters<typeof buildBlogThumbnailSvg>[0]): Response {
  return new Response(buildBlogThumbnailSvg(post), {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  })
}
