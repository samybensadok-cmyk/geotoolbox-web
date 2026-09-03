#!/usr/bin/env node
// Restore " | GEO Toolbox" on DE marketing + feature meta.titles.
//
// Why: the brand-suffix BAN is scoped to blog + glossary titles (that is all
// check-title-suffix.mjs gates). The marketing surface deliberately keeps the
// brand in-string — all 42 shipped en/fr/es marketing+feature meta.titles carry
// it — on the reasoning that these titles fit inside ~60 chars and take branded
// queries. DE must match its siblings, not diverge.
//
// Reports, but does not auto-trim, any title that lands over 60: the fix is a
// better German title, not a mechanical truncation.
import { readFileSync, writeFileSync } from "node:fs"

const SUFFIX = " | GEO Toolbox"
const file = process.argv[2]
const apply = process.argv[3] === "--apply"
const de = JSON.parse(readFileSync(file, "utf8"))

const targets = []
if (de.home?.meta?.title) targets.push([de.home.meta, "home"])
if (de.features?.meta?.title) targets.push([de.features.meta, "features"])
if (de.pricing?.meta?.title) targets.push([de.pricing.meta, "pricing"])
for (const [slug, o] of Object.entries(de.featurePages ?? {})) {
  if (o?.meta?.title) targets.push([o.meta, `featurePages.${slug}`])
}

const over = []
for (const [meta, path] of targets) {
  if (!/GEO Toolbox\s*$/.test(meta.title)) meta.title += SUFFIX
  const n = meta.title.length
  const row = `${String(n).padStart(3)}  ${path.padEnd(34)} ${meta.title}`
  if (n > 60) { over.push(row); console.log("OVER " + row) } else console.log("ok   " + row)
}

if (apply) {
  writeFileSync(file, JSON.stringify(de, null, 2) + "\n")
  console.log(`\nwritten: ${file}`)
}
console.log(`\n${targets.length} marketing/feature titles · ${over.length} over the 60-char budget`)
if (over.length) {
  console.log("Each needs a SHORTER GERMAN TITLE — do not truncate mechanically.")
  process.exit(1)
}
