// Every in-page anchor link in content/**/*.mdx (`](#some-id)`) must match the id
// that components/mdx gives an h2/h3 of the same file, computed with the REAL slugify
// from lib/utils.ts (no copy of the logic here). Also asserts the accent folding, so a
// regression to the ASCII-only version (which turned « visibilité » into `visibilit`) fails.
// Run: npm run check:anchors   (needs Node >= 22.6 for --experimental-strip-types)
import fs from "node:fs"
import path from "node:path"
import { slugify } from "../lib/utils.ts"

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..")
const fails = []

const cases = [
  ["Les outils de visibilité IA sont-ils vraiment fiables ?", "les-outils-de-visibilite-ia-sont-ils-vraiment-fiables"],
  ["Qu’est-ce que le GEO ?", "quest-ce-que-le-geo"],
  ["Übersicht: Größe & Straße", "ubersicht-grosse-strasse"],
  ["¿Cómo funciona la publicación?", "como-funciona-la-publicacion"],
  ["Cœur et æther", "coeur-et-aether"],
  ["What ChatGPT Ads Mean for Your Organic Visibility", "what-chatgpt-ads-mean-for-your-organic-visibility"],
]
for (const [input, want] of cases) {
  const got = slugify(input)
  if (got !== want) fails.push(`slugify(${JSON.stringify(input)}) = ${got}, expected ${want}`)
}

const files = []
const walk = (d) => {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f)
    if (fs.statSync(p).isDirectory()) walk(p)
    else if (p.endsWith(".mdx")) files.push(p)
  }
}
walk(path.join(ROOT, "content"))

const plain = (h) => h.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[*_`]/g, "")
let links = 0
for (const f of files) {
  const text = fs.readFileSync(f, "utf8")
  const ids = new Set([...text.matchAll(/^#{2,3} (.+)$/gm)].map((m) => slugify(plain(m[1]))))
  for (const m of text.matchAll(/\]\(#([^)\s]+)\)/g)) {
    links++
    const id = decodeURIComponent(m[1])
    if (!ids.has(id)) fails.push(`${path.relative(ROOT, f)}: #${id} matches no h2/h3 id in the file`)
  }
}

if (fails.length) {
  console.error(`✗ heading-anchor gate: ${fails.length} problem(s)`)
  for (const x of fails) console.error("  " + x)
  process.exit(1)
}
console.log(`✓ heading-anchor gate: ${cases.length} slugify cases, ${links} in-page anchors across ${files.length} files resolve.`)
