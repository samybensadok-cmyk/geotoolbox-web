/**
 * Gate: heading hierarchy and no-JS content in the ACTUALLY RENDERED HTML.
 *
 *   npm run build && npm run check:headings
 *
 * WHY RENDERED, NOT SOURCE: heading level is a property of the composed page,
 * not of any one component. A shared component that is correct under a section
 * <h2> becomes a level SKIP the moment a page drops it under the <h1> — which is
 * exactly what happened twice here: the footer's column headings were <h4> under
 * a page <h2>, and GrowthCharts' panel titles were <h3> directly under the
 * services <h1>. Neither is visible by reading either file alone. Scanning
 * .next/server/app/**\/*.html is the only way to see what an agent sees.
 *
 * WHAT IT ENFORCES, and why an agent cares:
 *   - exactly one <h1>            — the document's subject. Zero or many is
 *                                   ambiguous; extractors pick arbitrarily.
 *   - first heading is the <h1>   — anything else means content precedes the
 *                                   subject line.
 *   - no level skip > 1           — h1 → h3 gives no way to tell whether the h3
 *                                   is a subsection of the h1 or a sibling. This
 *                                   is what a scanner reports as a "flat" or
 *                                   malformed heading structure.
 *   - the homepage carries real   — an AI crawler that does not run JS must
 *     text and ≥3 heading levels    still get a structured document.
 *
 * A page is only CHECKED if it has a <main> with >= MIN_CONTENT_CHARS of text.
 * Next prerenders 404/redirect shells into this tree too (e.g. en/privacy.html
 * for a locale prefix that 404s live) and those legitimately have no headings.
 * The skipped set is COUNTED AND PRINTED — a gate that quietly checks nothing is
 * worse than no gate.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"

const BUILD_DIR = ".next/server/app"
const MIN_CONTENT_CHARS = 500
const HOME_MIN_CHARS = 2000
const HOME_MIN_LEVELS = 3
const HOMEPAGES = ["en.html", "fr.html", "es.html"]

/**
 * Pages exempt from the h1 rule, each with the reason. Keep this list SHORT and
 * justified — an exemption is a promise that an agent losing this page's
 * structure is acceptable.
 */
const EXEMPT = {
  "services/intake.html":
    "client-rendered order-status page (renders 'Loading your order…' server-side); it is a post-checkout transactional view, not content an agent should be reading",
}

if (!existsSync(BUILD_DIR)) {
  console.error(
    `\n✗ ${BUILD_DIR} not found. This gate reads the real build output — run \`npm run build\` first.\n` +
      `  (Exiting 1 rather than passing: a gate that cannot check must never report success.)\n`
  )
  process.exit(1)
}

function walk(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) out.push(...walk(p))
    else if (name.endsWith(".html")) out.push(p)
  }
  return out
}

function mainText(html) {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/)
  if (!m) return null
  return m[1]
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

const files = walk(BUILD_DIR)
let checked = 0
let skipped = 0
const problems = []

for (const file of files) {
  const rel = file.slice(BUILD_DIR.length + 1)
  const html = readFileSync(file, "utf8")
  const text = mainText(html)
  if (text === null || text.length < MIN_CONTENT_CHARS) {
    skipped++
    continue
  }
  checked++

  const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]))
  const h1s = levels.filter((l) => l === 1).length
  const exemptReason = EXEMPT[rel]

  if (h1s !== 1 && !exemptReason) {
    problems.push(`${rel}: has ${h1s} <h1> elements, expected exactly 1`)
  }
  if (levels.length && levels[0] !== 1 && !exemptReason) {
    problems.push(`${rel}: first heading is h${levels[0]}, not h1`)
  }
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] - levels[i - 1] > 1) {
      problems.push(
        `${rel}: heading level skip h${levels[i - 1]} → h${levels[i]} (a scanner reads this as a flat/malformed structure). Fix the LEVEL, keep the classes — visual size is styling, not semantics.`
      )
      break
    }
  }

  if (HOMEPAGES.includes(rel)) {
    if (text.length < HOME_MIN_CHARS) {
      problems.push(`${rel}: only ${text.length} chars of <main> text without JS (need ${HOME_MIN_CHARS}+)`)
    }
    const distinct = new Set(levels).size
    if (distinct < HOME_MIN_LEVELS) {
      problems.push(`${rel}: only ${distinct} distinct heading levels (need ${HOME_MIN_LEVELS}+ for a non-flat structure)`)
    }
  }
}

console.log(`\nrendered-heading gate\n`)
console.log(`  ${checked} content pages checked · ${skipped} shells/stubs skipped (<main> absent or <${MIN_CONTENT_CHARS} chars)`)
for (const [p, why] of Object.entries(EXEMPT)) {
  console.log(`  · exempt: ${p} — ${why}`)
}
for (const h of HOMEPAGES) {
  const f = join(BUILD_DIR, h)
  if (!existsSync(f)) {
    problems.push(`${h}: expected homepage prerender is missing from the build output`)
  }
}

if (problems.length) {
  console.error("")
  for (const p of problems) console.error(`  ✗ ${p}`)
  console.error(`\nrendered-heading gate FAILED — ${problems.length} problem(s)\n`)
  process.exit(1)
}
console.log(`  ✓ every checked page: exactly one h1, h1 first, no level skips`)
console.log(`  ✓ homepages carry ${HOME_MIN_CHARS}+ chars of no-JS text across ${HOME_MIN_LEVELS}+ heading levels`)
console.log(`\nrendered-heading gate passed\n`)
