#!/usr/bin/env node
// German-specific lint for messages/de.json. Complements check:messages
// (structure) with the DE defect list from the glossary Part 2.
import { readFileSync } from "node:fs"
const file = process.argv[2]
const de = JSON.parse(readFileSync(file, "utf8"))

const rows = []
const walk = (n, p) => {
  if (typeof n === "string") rows.push([p, n])
  else if (n && typeof n === "object") for (const [k, v] of Object.entries(n)) walk(v, p ? `${p}.${k}` : k)
}
walk(de, "")

const findings = []
const add = (sev, path, rule, detail) => findings.push({ sev, path, rule, detail })

for (const [path, s] of rows) {
  // 1. Formal address — the highest-value check, and the one that needs care.
  //    German capitalizes "sie" (they) at the start of a sentence, so a bare
  //    sentence-initial "Sie" is AMBIGUOUS and must not be flagged: "Sie teilen
  //    sich einen Credit-Pool" (the 14 tools share one) is correct German and a
  //    naive /\bSie\b/ calls it a register violation. Three unambiguous signals:
  //      a) "Sie" NOT at the start of a sentence — formal-you,
  //      b) an imperative verb immediately followed by "Sie" (Starten Sie …),
  //      c) capitalized Ihre/Ihnen/Ihr NOT at the start of a sentence.
  const sentenceStart = /(?:^|[.!?:;–—]\s+|["„(]\s*)$/
  const flagged = []
  for (const m of s.matchAll(/\b(Sie|Ihnen|Ihre[rmsn]?|Ihr)\b/g)) {
    if (!sentenceStart.test(s.slice(0, m.index))) flagged.push(m[1])
  }
  if (/\b[A-ZÄÖÜ][a-zäöüß]+en Sie\b/.test(s)) flagged.push("imperative + Sie")
  if (flagged.length) add("ERROR", path, "formal-address", `${[...new Set(flagged)].join(", ")} — site register is du`)

  // 2. Straight quotes where German wants „ ".
  if (/(^|[\s(>])"[^"]/.test(s)) add("ERROR", path, "quotes", 'straight " — German uses „ …"')

  // 3. Currency order/spacing. Correct is `99 €` with U+00A0.
  if (/€\s*\d/.test(s)) add("ERROR", path, "currency-order", "€ before the amount")
  if (/\d ?€/.test(s) && !/\d €/.test(s)) add("WARN", path, "currency-space", "use a non-breaking space before €")

  // 4. English thousands separator (1,000 meaning one thousand).
  const th = s.match(/\b\d{1,3},\d{3}\b/g)
  if (th) add("ERROR", path, "thousands", `${th.join(", ")} — German writes 1.000`)

  // 5. Wrong prefix for the core concept.
  if (/\bAI-(Sichtbarkeit|Suche|Antwort|Engine|Crawler)/.test(s)) add("ERROR", path, "ai-prefix", "use KI-, not AI-, for German concepts")
  if (/Übersichten? mit KI/.test(s)) add("WARN", path, "ai-overviews", "keep the English product name AI Overviews")

  // 6. Title-tag budget. NOTE: unlike blog/glossary titles (gated by
  //    check-title-suffix.mjs), the MARKETING pages deliberately keep
  //    " | GEO Toolbox" in-string — en, fr and es all ship it, on the stated
  //    reasoning that these titles fit inside ~60 chars and take branded
  //    queries. So the suffix is not flagged; the LENGTH is, because that
  //    reasoning only holds while the title actually fits.
  if (/(^|\.)meta\.title$/.test(path)) {
    if (s.length > 60) add("WARN", path, "title-length", `${s.length} chars — over the ~60 SERP budget`)
  }

  // 7. Swiss ss where ß belongs, in the words that actually recur here.
  if (/\b(gross|groesser|heisst|ausser|schliessen|dass es|weiss)\b/.test(s)) {
    const m = s.match(/\b(gross|groesser|heisst|ausser|schliessen|weiss)\b/g)
    if (m) add("WARN", path, "eszett", `${m.join(", ")} — German (not Swiss) spelling uses ß`)
  }

  // 8. Percent spacing (DIN 5008).
  if (/\d%/.test(s)) add("WARN", path, "percent-space", "DIN 5008 wants a space: 30 %")

  // 9. Leftover English function words — a cheap untranslated-fragment detector.
  if (/\b(the|your|and|with|for every|without) \b/.test(s) && !/^[A-Z][a-z]+ [A-Z]/.test(s)) {
    add("WARN", path, "english-fragment", "possible untranslated English")
  }
}

const errors = findings.filter((f) => f.sev === "ERROR")
const warns = findings.filter((f) => f.sev === "WARN")
const byRule = (list) => {
  const m = new Map()
  for (const f of list) m.set(f.rule, (m.get(f.rule) ?? 0) + 1)
  return [...m].sort((a, b) => b[1] - a[1]).map(([r, n]) => `${r}=${n}`).join(" ")
}
for (const f of findings) console.log(`${f.sev.padEnd(5)} ${f.rule.padEnd(20)} ${f.path}\n      ${f.detail}`)
console.log(`\nde-lint: ${rows.length} strings · ${errors.length} ERROR · ${warns.length} WARN`)
if (errors.length) console.log(`ERROR rules: ${byRule(errors)}`)
if (warns.length) console.log(`WARN  rules: ${byRule(warns)}`)
process.exit(errors.length ? 1 : 0)
