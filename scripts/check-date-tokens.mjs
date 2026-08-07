/**
 * Gate: an auto-dated title must not contradict its own body.
 *
 *   npm run check:dates
 *
 * `$MONTH_YEAR` in a title (lib/seo-tokens.ts) makes the SERP snippet say
 * "August 2026". If the body still opens with "everything below is current to
 * July 2026", the page now claims a freshness its own prose denies — the exact
 * defect the freshness gate exists to prevent, just relocated. That mismatch is
 * invisible in review because the two halves live 40 lines apart and only one
 * of them is rendered at build time.
 *
 * So: for every post carrying a token, resolve it for today and for a year out,
 * then scan the body for BLANKET CURRENCY CLAIMS naming a different month.
 *
 * A blanket currency claim is prose asserting the whole article's freshness —
 * "as of July 2026", "current to July 2026", "à jour en juillet 2026",
 * "verificado en agosto de 2026". A DATED FACT is not — "GPT-5.6 shipped on
 * July 9, 2026", "the July 30 price cut" — and must never be rewritten to
 * follow the clock. The two are told apart by the phrase that introduces them,
 * which is why this matches lead-ins rather than bare month names.
 *
 * KNOWN BLIND SPOT, measured not guessed: this only reads prose lead-ins, so it
 * does NOT see hard-coded months in H2 headings, `<th>` cells or figcaptions —
 * "## Claude vs ChatGPT at a Glance (July 2026)", "<th>Top models (July 2026)".
 * A sweep on 2026-08-07 found 16 such stamps across 8 tokened posts. They were
 * left alone deliberately: a month on a table header dates THAT TABLE's data,
 * which is honest, and the articles carrying them have not been re-verified, so
 * silently advancing them to match the title would be the very lie this gate
 * exists to stop. Fix them by re-verifying the article, not by editing the
 * stamp. If that class ever needs gating, match headings and `<th>` separately
 * — do not widen the prose rule, or source-dating starts failing again.
 */
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { resolveDateTokens, effectiveTokenDate } from "../lib/seo-tokens.ts"

const ROOT = path.join(process.cwd(), "content")
const LOCALE_DIRS = [
  ["en", path.join(ROOT, "blog")],
  ["fr", path.join(ROOT, "fr", "blog")],
  ["es", path.join(ROOT, "es", "blog")],
]

const MONTHS = {
  en: ["January","February","March","April","May","June","July","August","September","October","November","December"],
  fr: ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"],
  es: ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"],
}

/**
 * Lead-ins that make the following month a claim about THE ARTICLE, not about
 * an event. Deliberately narrow: adding a bare month name here would flag every
 * legitimate "launched on July 9" and the gate would be turned off within a week.
 */
const CURRENCY_LEADINS = {
  en: ["current to", "dated to", "reconciled and dated", "up to date as of", "this guide is current"],
  fr: ["à jour en", "arrêté à", "arrêtée à", "daté de", "datée de"],
  es: ["actualizado a", "actualizada a", "vigente en", "este artículo está comprobado"],
}

/**
 * A paragraph OPENING with "As of <Month> <Year>" is scoping the whole passage,
 * not dating a datum — "As of July 2026 the two assistants are close enough…".
 * Mid-sentence "as of" is the opposite: "at US prices from OpenAI, as of July
 * 2026" is source-dating and exactly what we want people to write. Hence the
 * distinction by position rather than by phrase.
 *
 * This gate was deliberately narrowed after a first run flagged 82 sites, ~50 of
 * them correct source-dating. A gate that cries wolf on good prose gets switched
 * off, and then it protects nothing.
 */
const OPENERS = {
  en: /^\s*(?:\*\*)?As of\s+/i,
  fr: /^\s*(?:\*\*)?(?:Au|En)\s+/i,
  es: /^\s*(?:\*\*)?A fecha de\s+/i,
}

function stripFences(body) {
  return body.replace(/```[\s\S]*?```/g, "")
}

/** Blanket currency claims in `body`, as {month, line, quote}. */
function currencyClaims(body, locale) {
  const months = MONTHS[locale] ?? MONTHS.en
  const leadins = CURRENCY_LEADINS[locale] ?? CURRENCY_LEADINS.en
  const monthAlt = months.map((m) => m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")
  const leadAlt = leadins.map((l) => l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")
  // lead-in, then up to ~24 chars of filler (articles, "the", "de", **bold**),
  // then a month, then a 4-digit year.
  const re = new RegExp(`(${leadAlt})[^.\\n]{0,24}?(${monthAlt})\\s+(?:de\\s+)?(\\d{4})`, "gi")
  // Same shape, but anchored to the start of a paragraph.
  const opener = OPENERS[locale] ?? OPENERS.en
  const openerRe = new RegExp(
    `^\\s*(?:\\*\\*)?${opener.source.replace(/^\^\\s\*\(\?:\\\*\\\*\)\?/, "").replace(/\\s\+$/, "")}\\s+(?:the\\s+)?(${monthAlt})\\s+(?:de\\s+)?(\\d{4})`,
    "i"
  )
  const out = []
  const lines = stripFences(body).split("\n")
  lines.forEach((line, i) => {
    for (const m of line.matchAll(re)) {
      out.push({ month: m[2].toLowerCase(), year: m[3], line: i + 1, quote: m[0].trim(), full: line.trim().slice(0, 230) })
    }
    const o = openerRe.exec(line)
    if (o) out.push({ month: o[1].toLowerCase(), year: o[2], line: i + 1, quote: o[0].trim(), full: line.trim().slice(0, 230) })
  })
  return out
}

const failures = []
const warnings = []
const acknowledged = []
let tokened = 0
let scanned = 0

const NOW = new Date()
// A year out: catches bodies that only agree with the token by coincidence this
// month. If the post is inside its freshness window the token tracks the clock,
// so a hard-coded body month is a latent conflict even when it matches today.
const LATER = new Date(NOW.getTime() + 365 * 86_400_000)

for (const [locale, dir] of LOCALE_DIRS) {
  if (!fs.existsSync(dir)) continue
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"))) {
    const full = path.join(dir, file)
    const { data, content } = matter(fs.readFileSync(full, "utf-8"))
    scanned++
    const meta = `${data.title ?? ""} ${data.description ?? ""}`
    if (!/\$MONTH_YEAR|\$MONTH|\$YEAR/.test(meta)) continue
    tokened++

    const signals = { date: data.date, updated: data.updated, recheckBy: data.recheckBy }
    const rel = path.relative(ROOT, full)

    // What month will the title actually claim, now and a year from now?
    const claimNow = effectiveTokenDate(signals, NOW)
    const claimLater = effectiveTokenDate(signals, LATER)
    const monthName = (d) =>
      new Intl.DateTimeFormat(locale === "en" ? "en-US" : locale === "fr" ? "fr-FR" : "es-ES", {
        month: "long", timeZone: "UTC",
      }).format(d).toLowerCase()

    const bodyLines = stripFences(content).split("\n")
    const claims = currencyClaims(content, locale)
    for (const c of claims) {
      // Deliberate exception: `{/* date-ok: reason */}` on the line, or the one
      // above it. Some "as of <month>" phrases date a SOURCE rather than the
      // article — "at US prices from OpenAI, as of July 2026" is exactly the
      // source-dating discipline we want, not a staleness claim. Overrides are
      // allowed, never silent: each one is printed with its reason on every run,
      // so an unexplained pile-up is visible rather than buried.
      const near = `${bodyLines[c.line - 2] ?? ""}\n${bodyLines[c.line - 1] ?? ""}`
      const ok = /\{\/\*\s*date-ok:\s*([^*]*?)\s*\*\/\}/.exec(near)
      if (ok) {
        acknowledged.push({ file: rel, line: c.line, quote: c.quote, reason: ok[1] || "(no reason given)" })
        continue
      }
      const bodyStamp = `${c.month} ${c.year}`
      const titleNow = `${monthName(claimNow)} ${claimNow.getUTCFullYear()}`
      const titleLater = `${monthName(claimLater)} ${claimLater.getUTCFullYear()}`
      if (bodyStamp === titleNow && bodyStamp === titleLater) continue // pinned and agreeing
      const drifts = bodyStamp !== titleLater
      const record = {
        file: rel, line: c.line, quote: c.quote, full: c.full,
        title: titleNow, body: bodyStamp, drifts,
      }
      if (bodyStamp !== titleNow) failures.push(record)
      else if (drifts) warnings.push(record)
    }
  }
}

const say = (r) =>
  `  ${r.file}:${r.line}\n     title will read "${r.title}" · body says "${r.body}"\n     matched ${JSON.stringify(r.quote)}\n     in: ${r.full}`

if (failures.length) {
  console.error(`\n✗ date-token gate: ${failures.length} title/body month conflict(s)\n`)
  failures.forEach((r) => console.error(say(r) + "\n"))
}
if (warnings.length) {
  console.warn(`⚠ ${warnings.length} body stamp(s) agree today but will drift as the token advances:\n`)
  warnings.forEach((r) => console.warn(say(r) + "\n"))
}
if (acknowledged.length) {
  console.log(`\nℹ ${acknowledged.length} acknowledged exception(s) via {/* date-ok: ... */}:`)
  acknowledged.forEach((a) => console.log(`  ${a.file}:${a.line} — ${a.reason}\n     ${JSON.stringify(a.quote)}`))
  console.log("")
}
if (failures.length) {
  console.error("Fix the BODY (drop the blanket currency claim, or point it at the rendered")
  console.error("updated stamp) — never rewrite a dated fact to follow the clock. If an")
  console.error("article is too anchored to reconcile, remove its token instead.\n")
  process.exit(1)
}
console.log(`✓ date-token gate: ${tokened} tokened post(s) of ${scanned} scanned, no title/body month conflicts`)
