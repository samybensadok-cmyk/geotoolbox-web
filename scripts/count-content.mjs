/**
 * count-content.mjs — recounts published content on disk and writes
 * lib/content-counts.generated.json. Wired to npm `prebuild`, so every Vercel
 * build recounts and the figures on /services/ai-automation-agency can never go
 * stale between hand-edits (they already had: FR sat at 59 for a week, ES and
 * the FR glossary were never counted at all).
 *
 * Counting rule mirrors `getAllPosts()` in lib/content.ts exactly: .mdx files,
 * minus `draft: true`, minus `noindex: true` — i.e. what a visitor can actually
 * reach from the listing. Anything else would overstate the claim.
 *
 * Why a generated JSON and not fs at import time: lib/proof-stats.ts is imported
 * by components/services/growth-charts.tsx, which is a CLIENT component — an
 * `fs` import there breaks the client bundle. Same reason proof-stats.generated
 * .json exists.
 *
 * Zero npm deps beyond gray-matter, already a dependency.
 */
import { readdirSync, readFileSync, existsSync, writeFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import matter from "gray-matter"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const OUT = join(ROOT, "lib", "content-counts.generated.json")

function countPublished(relDir) {
  const dir = join(ROOT, relDir)
  if (!existsSync(dir)) return 0
  return readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .filter((f) => {
      const { data } = matter(readFileSync(join(dir, f), "utf8"))
      return !(data.draft ?? false) && !(data.noindex ?? false)
    }).length
}

const counts = {
  en: countPublished("content/blog"),
  fr: countPublished("content/fr/blog"),
  es: countPublished("content/es/blog"),
  glossary: countPublished("content/glossary"),
  glossaryFr: countPublished("content/fr/glossary"),
}

// Build date, en-GB short — matches the "21 Aug 2026" stamp style used by
// proof-stats.generated.json so the two "as of" lines read the same.
const asOf = new Date().toLocaleDateString("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
})

const payload = { generatedAt: new Date().toISOString().slice(0, 10), asOf, ...counts }
writeFileSync(OUT, JSON.stringify(payload, null, 2) + "\n")
console.log(
  `content counts → ${OUT}\n  EN ${counts.en} · FR ${counts.fr} · ES ${counts.es} · glossary ${counts.glossary} EN + ${counts.glossaryFr} FR · as of ${asOf}`,
)
