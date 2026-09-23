#!/usr/bin/env node
// Static gate for the retired-glossary redirect table (lib/glossary-redirects.ts).
//
//   npm run check:redirects   (also part of `prebuild`, so a Vercel build fails on a broken table)
//
// Asserts, against the files on disk:
//   1. the table is exactly what the CSV generates (no hand edits)
//   2. every 301 target exists as a published article in the RIGHT locale dir
//   3. no chains: no target is itself a key, none collides with next.config redirects
//   4. no key carries a trailing slash or .md (middleware normalises those first)
//   5. every FR 301 target's donorSlug is itself an EN target (locale alignment),
//      except the documented asymmetry below
//   6. content/ carries zero INTERNAL /glossary/ links (the repoint is complete). External glossaries
//      (ahrefs.com/seo/glossary/…, moz.com/learn/seo/glossary, …) are legitimate citations and ignored.
import { readFileSync, existsSync, readdirSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { execFileSync } from "node:child_process"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
let failures = 0
const fail = (m) => { console.error(`  ✗ ${m}`); failures++ }
const pass = (m) => console.log(`  ✓ ${m}`)

// 1. generated file is byte-identical to a fresh generation (compared in memory — the gate never writes)
const genPath = join(ROOT, "lib", "glossary-redirects.ts")
const after = readFileSync(genPath, "utf8")
const fresh = execFileSync("node", [join(ROOT, "scripts", "gen-glossary-redirects.mjs"), "--stdout"], { encoding: "utf8" })
if (fresh !== after) fail("lib/glossary-redirects.ts was hand-edited — it no longer matches the CSV. Run: node scripts/gen-glossary-redirects.mjs")
else pass("lib/glossary-redirects.ts matches scripts/data/glossary-redirects.csv")

// Parse the table (regex over the generated file; the format is ours)
const rules = new Map()
for (const m of after.matchAll(/^\s+"([^"]+)":\s*\{\s*status:\s*(301|410)(?:,\s*to:\s*"([^"]+)")?\s*\},?$/gm)) {
  rules.set(m[1], { status: Number(m[2]), to: m[3] })
}
const expectedKeys = 77 + 2
if (rules.size !== expectedKeys) fail(`table has ${rules.size} keys, expected ${expectedKeys} (77 terms + 2 index hubs)`)
else pass(`${rules.size} keys (77 terms + 2 index hubs)`)

// 4. key hygiene
for (const k of rules.keys()) {
  if (k.endsWith("/") || k.endsWith(".md")) fail(`key ${k} carries a trailing slash or .md — keys must be the bare HTML path`)
  if (!/^\/(?:fr\/)?glossary(?:\/[a-z0-9-]+)?$/.test(k)) fail(`key ${k} is not a glossary path`)
}

// 2. targets exist, in the right locale dir, and are published
const frontmatter = (p) => readFileSync(p, "utf8").slice(0, 3000)
const enTargets = new Set()
for (const [k, r] of rules) {
  if (r.status !== 301) continue
  if (k === "/glossary" || k === "/fr/glossary") {
    if (r.to !== (k === "/glossary" ? "/blog" : "/fr/blog")) fail(`${k} must 301 to its blog hub, got ${r.to}`)
    continue
  }
  const m = /^(\/fr)?\/blog\/([a-z0-9-]+)$/.exec(r.to)
  if (!m) { fail(`${k} → ${r.to} is not a /blog or /fr/blog path`); continue }
  const keyLocale = k.startsWith("/fr/") ? "fr" : "en"
  const toLocale = m[1] ? "fr" : "en"
  if (keyLocale !== toLocale) fail(`${k} → ${r.to} crosses locales (never 301 an FR URL to an EN page)`)
  const file = join(ROOT, "content", ...(toLocale === "fr" ? ["fr", "blog"] : ["blog"]), `${m[2]}.mdx`)
  if (!existsSync(file)) { fail(`${k} → ${r.to}: target file missing (${file})`); continue }
  const fm = frontmatter(file)
  if (/^draft:\s*true/m.test(fm) || /^noindex:\s*true/m.test(fm)) fail(`${k} → ${r.to}: target is draft/noindex`)
  if (toLocale === "en") enTargets.add(m[2])
}
pass("all 301 targets exist in the matching locale dir and are published")

// 3. no chains
const cfg = readFileSync(join(ROOT, "next.config.ts"), "utf8")
const cfgSources = new Set([...cfg.matchAll(/source:\s*"([^"]+)"/g)].map((m) => m[1]))
for (const [k, r] of rules) {
  if (r.status !== 301) continue
  if (rules.has(r.to)) fail(`chain: ${k} → ${r.to} is itself a redirect key`)
  if (cfgSources.has(r.to)) fail(`chain: ${k} → ${r.to} collides with a next.config redirect source`)
}
pass("no chains (targets are not keys, no next.config collisions)")

// 5. FR target alignment: the FR article's donorSlug must be an EN target too.
// Documented asymmetry (accepted 2026-09-19, ledger): /fr/glossary/modele-de-raisonnement
// → comment-fonctionne-claude (donor how-does-claude-work) while EN reasoning-model →
// how-ai-models-think, which has no FR twin. Same-locale relevance beats symmetry.
const ALLOWED_ASYMMETRY = new Set(["/fr/glossary/modele-de-raisonnement"])
for (const [k, r] of rules) {
  if (r.status !== 301 || !k.startsWith("/fr/glossary/")) continue
  const slug = r.to.replace("/fr/blog/", "")
  const fm = frontmatter(join(ROOT, "content", "fr", "blog", `${slug}.mdx`))
  const d = /^donorSlug:\s*"?([a-z0-9-]+)"?\s*$/m.exec(fm)?.[1]
  if (!d) { fail(`${k} → ${r.to}: FR target has no donorSlug (native article) — verify the mapping by hand`); continue }
  if (!enTargets.has(d) && !ALLOWED_ASYMMETRY.has(k)) fail(`${k} → ${r.to}: donorSlug ${d} is not an EN redirect target — FR and EN would land on unrelated pages`)
}
pass("FR 301 targets align with EN targets via donorSlug (1 documented asymmetry)")

// 6. repoint complete: zero glossary links left in content/
const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(join(d, e.name)) : e.name.endsWith(".mdx") ? [join(d, e.name)] : [])
const leftovers = []
for (const f of walk(join(ROOT, "content"))) {
  const n = (readFileSync(f, "utf8").match(/geotoolbox\.ai\/glossary\/|\]\(\/glossary\/|href="\/glossary\//g) ?? []).length
  if (n) leftovers.push(`${f.replace(ROOT + "/", "")} (${n})`)
}
if (leftovers.length) fail(`content/ still links the glossary in ${leftovers.length} file(s):\n    ${leftovers.slice(0, 20).join("\n    ")}`)
else pass("content/ carries zero internal /glossary/ links")
for (const d of ["content/glossary", "content/fr/glossary", "app/[locale]/glossary", "app/llms-glossary.txt"]) {
  if (existsSync(join(ROOT, d))) fail(`${d} still exists — the retired section must be deleted in the same commit as the redirects`)
}

console.log("")
if (failures) { console.error(`glossary-redirect gate FAILED — ${failures} problem(s)\n`); process.exit(1) }
console.log("glossary-redirect gate passed\n")
