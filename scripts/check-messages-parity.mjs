#!/usr/bin/env node
/**
 * Locale message-bundle parity guard.
 *
 * `messages/<locale>.json` drives every marketing/feature/pricing string. Nothing
 * in the build fails when a locale is missing a key, has a stray one, drops an
 * ICU placeholder, or ships an untranslated English string — the page just
 * renders wrong (or throws at runtime on a missing key). Across ~1,900 keys per
 * locale that is not reviewable by eye, which is exactly why this is mechanical.
 *
 * Asserts, for every non-default locale in i18n/routing.ts, against EN:
 *   1. IDENTICAL key set (no missing, no extra) and identical value SHAPE
 *      (string vs object vs array, and equal array length).
 *   2. IDENTICAL ICU placeholder set per key — {amount}, {count}, {brand}…
 *      German/French word order makes it easy to rewrite a sentence and lose one.
 *   3. IDENTICAL rich-text tag set per key — <b>, <link>, <br/>… A dropped tag
 *      makes next-intl throw at render time, not at build time.
 *   4. No UNTRANSLATED leftovers: a value byte-identical to EN and longer than
 *      MIN_SUSPECT chars, unless it is a known proper noun / brand / plan name
 *      (ALLOWED_IDENTICAL) or the key is in an exempt namespace path.
 *
 * Run: npm run check:messages
 */
import { readFileSync, existsSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const routingSrc = readFileSync(join(root, "i18n/routing.ts"), "utf8")

const localesMatch = /locales:\s*\[([^\]]+)\]/.exec(routingSrc)
const defaultMatch = /defaultLocale:\s*"([^"]+)"/.exec(routingSrc)
if (!localesMatch || !defaultMatch) {
  console.error("check:messages — could not parse locales/defaultLocale from i18n/routing.ts")
  process.exit(1)
}
const locales = [...localesMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
const defaultLocale = defaultMatch[1]

const load = (l) => JSON.parse(readFileSync(join(root, `messages/${l}.json`), "utf8"))
const en = load(defaultLocale)

// A value identical to EN is only OK when it is genuinely the same in every
// language: brand names, engine names, plan names, units, bare numbers.
const ALLOWED_IDENTICAL = new Set([
  "GEO Toolbox", "ChatGPT", "Gemini", "Perplexity", "Claude", "Grok", "Copilot",
  "Bing", "Google", "Google AI Mode", "AI Overviews", "LLM", "Blog", "SEO", "GEO",
  "AEO", "API", "Starter", "Growth", "Pro", "Scale", "Enterprise", "Kontakt",
  "Contact", "Dashboard", "Sentiment", "Share of Voice", "Prompt", "Prompts",
  "Credits", "Workflow", "White-Label", "Community", "Analytics",
  // Competitor product names rendered as a single comparison-column label.
  "Profound / Otterly / Peec",
])
// Namespaces where an EN-identical value is expected and not a defect.
const EXEMPT_PREFIXES = ["featurePages.common.engines"]
const MIN_SUSPECT = 25

const errors = []
const warnings = []

const placeholders = (s) => new Set([...s.matchAll(/\{([a-zA-Z0-9_]+)[^}]*\}/g)].map((m) => m[1]))
const tags = (s) => new Set([...s.matchAll(/<\/?([a-zA-Z][a-zA-Z0-9]*)\s*\/?>/g)].map((m) => m[1]))
const setEq = (a, b) => a.size === b.size && [...a].every((x) => b.has(x))
const fmt = (s) => [...s].sort().join(",") || "(none)"

function walk(refNode, locNode, path, locale) {
  if (typeof refNode === "string") {
    if (typeof locNode !== "string") {
      errors.push(`[${locale}] ${path}: expected a string, got ${locNode === undefined ? "MISSING" : typeof locNode}`)
      return
    }
    const rp = placeholders(refNode), lp = placeholders(locNode)
    if (!setEq(rp, lp)) errors.push(`[${locale}] ${path}: placeholder mismatch — ${defaultLocale}={${fmt(rp)}} vs ${locale}={${fmt(lp)}}`)
    const rt = tags(refNode), lt = tags(locNode)
    if (!setEq(rt, lt)) errors.push(`[${locale}] ${path}: rich-text tag mismatch — ${defaultLocale}=<${fmt(rt)}> vs ${locale}=<${fmt(lt)}>`)
    if (
      refNode === locNode &&
      refNode.length >= MIN_SUSPECT &&
      !ALLOWED_IDENTICAL.has(refNode.trim()) &&
      !EXEMPT_PREFIXES.some((p) => path.startsWith(p))
    ) {
      errors.push(`[${locale}] ${path}: value is byte-identical to ${defaultLocale} — untranslated? ${JSON.stringify(refNode.slice(0, 70))}`)
    }
    return
  }
  if (Array.isArray(refNode)) {
    if (!Array.isArray(locNode)) {
      errors.push(`[${locale}] ${path}: expected an array, got ${locNode === undefined ? "MISSING" : typeof locNode}`)
      return
    }
    if (refNode.length !== locNode.length) {
      errors.push(`[${locale}] ${path}: array length ${locNode.length} != ${defaultLocale} ${refNode.length}`)
      return
    }
    refNode.forEach((v, i) => walk(v, locNode[i], `${path}[${i}]`, locale))
    return
  }
  if (refNode && typeof refNode === "object") {
    if (!locNode || typeof locNode !== "object" || Array.isArray(locNode)) {
      errors.push(`[${locale}] ${path}: expected an object, got ${locNode === undefined ? "MISSING" : typeof locNode}`)
      return
    }
    for (const k of Object.keys(refNode)) walk(refNode[k], locNode[k], path ? `${path}.${k}` : k, locale)
    for (const k of Object.keys(locNode)) {
      if (!(k in refNode)) errors.push(`[${locale}] ${path ? `${path}.${k}` : k}: key not present in ${defaultLocale} (stray)`)
    }
  }
}

for (const locale of locales) {
  if (locale === defaultLocale) continue
  const file = join(root, `messages/${locale}.json`)
  if (!existsSync(file)) {
    errors.push(`[${locale}] messages/${locale}.json is MISSING but ${locale} is in routing.locales`)
    continue
  }
  walk(en, load(locale), "", locale)
}

// Length pressure. Comparing a locale to EN is low-signal — FR and ES chrome
// legitimately runs 150-200% of EN and ships fine. What actually predicts an
// overflow is a string longer than every ALREADY-SHIPPED locale for the same
// key, since those are known to render. So each locale is measured against the
// longest of its siblings, and only short slots (nav/buttons/labels) are checked.
const CHROME_NS = ["nav", "common", "footer"]
const loaded = Object.fromEntries(
  locales.filter((l) => existsSync(join(root, `messages/${l}.json`))).map((l) => [l, load(l)]),
)
for (const locale of locales) {
  if (locale === defaultLocale || !loaded[locale]) continue
  const siblings = locales.filter((l) => l !== locale && loaded[l])
  for (const ns of CHROME_NS) {
    for (const k of Object.keys(en[ns] ?? {})) {
      const v = loaded[locale][ns]?.[k]
      if (typeof v !== "string" || v.length < 12) continue
      const longestSibling = Math.max(
        ...siblings.map((l) => (typeof loaded[l][ns]?.[k] === "string" ? loaded[l][ns][k].length : 0)),
      )
      if (v.length > longestSibling * 1.2 + 3) {
        warnings.push(
          `[${locale}] ${ns}.${k}: ${v.length} chars, longer than every shipped locale (max ${longestSibling}) — "${v}"`,
        )
      }
    }
  }
}

for (const w of warnings) console.warn(`WARN  ${w}`)
if (errors.length) {
  console.error(`\ncheck:messages FAILED — ${errors.length} error(s):\n`)
  for (const e of errors.slice(0, 200)) console.error(`  ${e}`)
  if (errors.length > 200) console.error(`  … and ${errors.length - 200} more`)
  process.exit(1)
}
console.log(`check:messages OK — ${locales.filter((l) => l !== defaultLocale).join(", ")} match ${defaultLocale} (${warnings.length} warning(s))`)
