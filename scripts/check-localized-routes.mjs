#!/usr/bin/env node
// Gate: lib/i18n/localized-routes.ts must list exactly the marketing routes that
// are mounted under app/[locale]/ (/pricing, /features, /features/<slug>).
//
//   npm run check:localized-routes          (also part of `prebuild`)
//   node scripts/check-localized-routes.mjs --write   regenerate the list
//
// A route missing from the list keeps an English body link inside a localized
// article; a route listed but not mounted would send a reader to a 404.
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const FILE = join(ROOT, "lib", "i18n", "localized-routes.ts")
const LOCALE_APP = join(ROOT, "app", "[locale]")

const routes = []
if (existsSync(join(LOCALE_APP, "pricing", "page.tsx"))) routes.push("/pricing")
if (existsSync(join(LOCALE_APP, "features", "page.tsx"))) routes.push("/features")
const featuresDir = join(LOCALE_APP, "features")
if (existsSync(featuresDir)) {
  for (const e of readdirSync(featuresDir, { withFileTypes: true })) {
    // dynamic segments ([x]) and groups are not literal link targets
    if (e.isDirectory() && /^[a-z0-9-]+$/.test(e.name) && existsSync(join(featuresDir, e.name, "page.tsx"))) {
      routes.push(`/features/${e.name}`)
    }
  }
}
routes.sort()

const body = routes.map((r) => `  ${JSON.stringify(r)},`).join("\n")
const src = readFileSync(FILE, "utf8")
const re = /(\/\/ BEGIN GENERATED\n)([\s\S]*?)(  \/\/ END GENERATED)/
if (!re.test(src)) { console.error("  ✗ markers missing in lib/i18n/localized-routes.ts"); process.exit(1) }
const next = src.replace(re, (_, a, _b, c) => `${a}${body}\n${c}`)

if (process.argv.includes("--write")) {
  writeFileSync(FILE, next)
  console.log(`  ✓ wrote ${routes.length} routes`)
  process.exit(0)
}
if (next !== src) {
  console.error("  ✗ lib/i18n/localized-routes.ts is out of sync with app/[locale]. Run: node scripts/check-localized-routes.mjs --write")
  process.exit(1)
}
if (routes.length < 3) { console.error("  ✗ suspiciously few localized routes found"); process.exit(1) }
console.log(`  ✓ lib/i18n/localized-routes.ts matches the route tree (${routes.length} routes)`)
