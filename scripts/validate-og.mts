/**
 * Offline validation of the blog OG-card pipeline — uses the REAL content
 * loader, card builder, and fonts (no dev server). Run: npx tsx scripts/validate-og.tsx
 */
import { ImageResponse } from "next/og"
import fs from "node:fs"
import * as contentNs from "../lib/content.ts"
import * as cardNs from "../lib/og/blog-card.tsx"
import * as fontsNs from "../lib/og/og-fonts.ts"

// Under tsx the .ts/.tsx libs compile to CJS, so unwrap `.default`. The real
// Next build imports these as ESM named exports (the route works as written).
const { getPostBySlug, getAllPosts, extractHeadings } = (contentNs as any).default ?? contentNs
const { deriveCardData, buildBlogCard, classifyCluster } = (cardNs as any).default ?? cardNs
const { loadOgFonts } = (fontsNs as any).default ?? fontsNs

const out = process.env.OUT || "/tmp/og-validate"
fs.mkdirSync(out, { recursive: true })
const fonts = loadOgFonts()

// 1) classifier sanity across the whole blog
const tally: Record<string, number> = {}
const examples: Record<string, string[]> = { comparison: [], concept: [], commercial: [], default: [] }
for (const p of getAllPosts()) {
  const c = classifyCluster(p)
  tally[c] = (tally[c] || 0) + 1
  if (examples[c].length < 4) examples[c].push(p.slug)
}
console.log("=== cluster tally (all posts) ===", tally)
for (const k of Object.keys(examples)) console.log(`  ${k.padEnd(11)} e.g. ${examples[k].join(", ")}`)

// 2) render 4 representative cards through the real pipeline
const slugs = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["gemini-vs-chatgpt", "what-is-geo", "best-content-optimization-tools", "content-chunking"]

console.log("\n=== render ===")
for (const slug of slugs) {
  const post = getPostBySlug(slug)
  if (!post) { console.log(`${slug}  NOT FOUND`); continue }
  const h2s = extractHeadings(post.content).filter((h: any) => h.level === 2).map((h: any) => h.text)
  const data = deriveCardData(post, h2s)
  const img = new ImageResponse(buildBlogCard(data), { width: 1200, height: 630, fonts })
  fs.writeFileSync(`${out}/${slug}.png`, Buffer.from(await img.arrayBuffer()))
  console.log(`${slug.padEnd(34)} cluster=${data.cluster.padEnd(11)} items=${data.items.length}  hl="${data.headline}"`)
}
console.log(`\nPNGs -> ${out}`)
