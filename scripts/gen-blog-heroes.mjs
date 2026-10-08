/**
 * gen-blog-heroes.mjs - picks each blog post's archive-card image at build time and
 * writes lib/blog-heroes.generated.json (wired into npm `prebuild`).
 *
 * Why a generated JSON and not fs at request time: the archive pages are ISR, so a
 * runtime read of /public would drag the whole 100+ MB directory into the serverless
 * bundle, and a function without those files would silently fall back to the
 * generated thumbnail. The manifest keeps the pages free of any filesystem read.
 *
 * Choice rule per post: candidates are the `image:` frontmatter, then every in-body
 * image that exists under /public, in order. Take the first one whose shape suits a
 * 16:9 card (ratio 1.3-2.3); otherwise the first one up to ratio 3.2; otherwise none
 * (the card falls back to the generated thumbnail). Ratios outside 1.65-1.92 are
 * flagged `contain` so the whole picture shows on a cream mat instead of being
 * cropped (cropping cut headline letters off many diagrams).
 */
import { readdirSync, readFileSync, existsSync, writeFileSync, openSync, readSync, closeSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import matter from "gray-matter"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const PUBLIC = join(ROOT, "public")
const OUT = join(ROOT, "lib", "blog-heroes.generated.json")
const LOCALES = [["en", "content/blog"], ["fr", "content/fr/blog"], ["es", "content/es/blog"], ["de", "content/de/blog"], ["nl", "content/nl/blog"]]
const IMAGE_REF = /!\[[^\]]*\]\((\/[^)\s]+\.(?:png|jpe?g|webp))|src=["'](\/[^"']+\.(?:png|jpe?g|webp))["']/g

function dimensions(file) {
  const fd = openSync(file, "r")
  try {
    const head = Buffer.alloc(24)
    readSync(fd, head, 0, 24, 0)
    if (head.readUInt32BE(0) === 0x89504e47) return [head.readUInt32BE(16), head.readUInt32BE(20)]
    if (head[0] === 0xff && head[1] === 0xd8) {
      const buffer = readFileSync(file)
      for (let i = 2; i < buffer.length - 9;) {
        if (buffer[i] !== 0xff) { i++; continue }
        const marker = buffer[i + 1]
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return [buffer.readUInt16BE(i + 7), buffer.readUInt16BE(i + 5)]
        i += 2 + buffer.readUInt16BE(i + 2)
      }
    }
    return undefined
  } finally {
    closeSync(fd)
  }
}

function describe(src) {
  const file = join(PUBLIC, src)
  if (!file.startsWith(PUBLIC) || !existsSync(file)) return undefined
  const size = dimensions(file)
  if (!size) return undefined
  const [width, height] = size
  return { src, width, height, ratio: width / height }
}

const heroes = {}
let missing = 0
for (const [locale, relDir] of LOCALES) {
  const dir = join(ROOT, relDir)
  if (!existsSync(dir)) continue
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".mdx")).sort()) {
    const { data, content } = matter(readFileSync(join(dir, file), "utf-8"))
    const refs = [data.image, ...Array.from(content.matchAll(IMAGE_REF), (m) => m[1] ?? m[2])]
    const seen = new Set()
    const found = refs.filter((r) => typeof r === "string" && r.startsWith("/") && !seen.has(r) && seen.add(r)).map(describe).filter(Boolean)
    const pick = found.find((i) => i.ratio >= 1.3 && i.ratio <= 2.3) ?? found.find((i) => i.ratio <= 3.2)
    if (!pick) { missing++; continue }
    heroes[`${locale}/${file.replace(/\.mdx$/, "")}`] = { src: pick.src, width: pick.width, height: pick.height, contain: pick.ratio < 1.65 || pick.ratio > 1.92 }
  }
}
writeFileSync(OUT, JSON.stringify(heroes, null, 1) + "\n")
console.log(`blog-heroes: ${Object.keys(heroes).length} posts with a card image, ${missing} fall back to the generated thumbnail`)
