#!/usr/bin/env node
// Assemble messages/de.json from the 7 unit outputs, in EN key order.
// Order matters: it keeps the DE bundle diffable against en/fr/es.
import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { join } from "node:path"

const SP = process.argv[2]
const REPO = process.argv[3]
const UNITS = ["chrome", "home", "pricing", "fp-a", "fp-b", "fp-c", "fp-d"]

const en = JSON.parse(readFileSync(join(REPO, "messages/en.json"), "utf8"))

// Flatten every unit output into one lookup keyed by dotted path.
const flat = new Map()
const walk = (node, path) => {
  if (node !== null && typeof node === "object" && !Array.isArray(node)) {
    for (const [k, v] of Object.entries(node)) walk(v, path ? `${path}.${k}` : k)
  } else {
    flat.set(path, node)
  }
}
const missingUnits = []
for (const u of UNITS) {
  const f = join(SP, "out", `${u}.de.json`)
  if (!existsSync(f)) { missingUnits.push(u); continue }
  walk(JSON.parse(readFileSync(f, "utf8")), "")
}
if (missingUnits.length) {
  console.error(`merge ABORTED — missing unit output(s): ${missingUnits.join(", ")}`)
  process.exit(1)
}

// Rebuild in EN's exact key order, pulling each leaf from the flat map.
const missing = []
const build = (node, path) => {
  if (node !== null && typeof node === "object" && !Array.isArray(node)) {
    const out = {}
    for (const [k, v] of Object.entries(node)) out[k] = build(v, path ? `${path}.${k}` : k)
    return out
  }
  if (!flat.has(path)) { missing.push(path); return node }
  return flat.get(path)
}
const de = build(en, "")

// Anything the units produced that EN does not have is a stray key — report it,
// don't silently drop it, since it usually means a renamed/mistyped key.
const enPaths = new Set()
const collect = (node, path) => {
  if (node !== null && typeof node === "object" && !Array.isArray(node)) {
    for (const [k, v] of Object.entries(node)) collect(v, path ? `${path}.${k}` : k)
  } else enPaths.add(path)
}
collect(en, "")
const stray = [...flat.keys()].filter((p) => !enPaths.has(p))

if (missing.length) {
  console.error(`merge: ${missing.length} EN key(s) have NO German value (left as EN):`)
  for (const p of missing.slice(0, 40)) console.error(`  ${p}`)
  if (missing.length > 40) console.error(`  … and ${missing.length - 40} more`)
}
if (stray.length) {
  console.error(`merge: ${stray.length} stray key(s) produced by a unit but absent from EN:`)
  for (const p of stray.slice(0, 40)) console.error(`  ${p}`)
}
writeFileSync(join(REPO, "messages/de.json"), JSON.stringify(de, null, 2) + "\n")
console.log(`merged ${flat.size} values -> messages/de.json (${missing.length} missing, ${stray.length} stray)`)
process.exit(missing.length || stray.length ? 1 : 0)
