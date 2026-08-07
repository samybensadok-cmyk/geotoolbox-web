/**
 * Tests for lib/seo-tokens.ts — the $MONTH/$YEAR title tokens.
 *
 *   node --experimental-strip-types scripts/test-seo-tokens.mjs
 *
 * Date logic rots silently, and the whole point of the freshness gate is that a
 * lapsed post must NOT claim the current month. That failure is invisible in
 * review, so it gets a fixture instead.
 */
import { resolveDateTokens, isWithinFreshnessWindow, effectiveTokenDate } from "../lib/seo-tokens.ts"

let pass = 0
const failures = []

function eq(actual, expected, label) {
  if (actual === expected) { pass++; return }
  failures.push(`${label}\n    expected: ${JSON.stringify(expected)}\n    actual:   ${JSON.stringify(actual)}`)
}

const AUG10 = new Date(Date.UTC(2026, 7, 10))
const SEP02 = new Date(Date.UTC(2026, 8, 2))
const MAR2027 = new Date(Date.UTC(2027, 2, 2))

// ---------------------------------------------------------------- locale forms
const fresh = { updated: "2026-08-07", recheckBy: "2026-08-14" }
eq(resolveDateTokens("ChatGPT Pricing $MONTH_YEAR: Plans", "en", fresh, AUG10),
   "ChatGPT Pricing August 2026: Plans", "en $MONTH_YEAR")
eq(resolveDateTokens("Prix ChatGPT en $MONTH_YEAR", "fr", fresh, AUG10),
   "Prix ChatGPT en août 2026", "fr keeps month lowercase mid-sentence")
eq(resolveDateTokens("Precio de ChatGPT en $MONTH_YEAR", "es", fresh, AUG10),
   "Precio de ChatGPT en agosto de 2026", "es inserts its own 'de'")
eq(resolveDateTokens("$MONTH_YEAR : le guide", "fr", fresh, AUG10),
   "Août 2026 : le guide", "token at offset 0 is capitalised")
eq(resolveDateTokens("Guide $MONTH $YEAR", "en", fresh, AUG10),
   "Guide August 2026", "$MONTH and $YEAR separately")

// ------------------------------------------------------- the freshness gate
// recheckBy in the future -> current month
eq(resolveDateTokens("X $MONTH_YEAR", "en", fresh, AUG10), "X August 2026",
   "inside recheckBy window -> current month")
// recheckBy passed -> pin to `updated`, NOT today
eq(resolveDateTokens("X $MONTH_YEAR", "en", fresh, SEP02), "X August 2026",
   "recheckBy lapsed -> pinned to updated month, not September")
eq(resolveDateTokens("X $MONTH_YEAR", "en", fresh, MAR2027), "X August 2026",
   "long-abandoned post never promotes itself to March 2027")
// refreshing the post moves it forward again
eq(resolveDateTokens("X $MONTH_YEAR", "en", { updated: "2026-09-01", recheckBy: "2026-09-30" }, SEP02),
   "X September 2026", "bumping updated/recheckBy moves the title forward")

// no recheckBy -> updated + grace window
eq(resolveDateTokens("X $MONTH_YEAR", "en", { updated: "2026-08-01" }, AUG10), "X August 2026",
   "no recheckBy, inside grace -> current month")
eq(resolveDateTokens("X $MONTH_YEAR", "en", { updated: "2026-06-01" }, SEP02), "X June 2026",
   "no recheckBy, past 60d grace -> pinned to updated")
eq(resolveDateTokens("X $MONTH_YEAR", "en", { updated: "2026-08-01" }, SEP02), "X September 2026",
   "no recheckBy, still inside 60d grace on Sep 2 -> current month")
// falls back to `date` when there is no `updated`
eq(resolveDateTokens("X $MONTH_YEAR", "en", { date: "2026-01-05" }, SEP02), "X January 2026",
   "no updated -> pins to date")
// no signals at all -> plain Yoast behaviour
eq(resolveDateTokens("X $MONTH_YEAR", "en", {}, SEP02), "X September 2026",
   "no date signals -> always current")

// recheckBy boundary: due today is not yet overdue
eq(isWithinFreshnessWindow({ recheckBy: "2026-08-10" }, AUG10), true, "recheckBy === today is still fresh")
eq(isWithinFreshnessWindow({ recheckBy: "2026-08-09" }, AUG10), false, "recheckBy yesterday is stale")

// ------------------------------------------------------------------ no-ops
eq(resolveDateTokens("Plain title, no tokens", "en", fresh, AUG10),
   "Plain title, no tokens", "untouched when no token present")
eq(resolveDateTokens("Costs $20/mo", "en", fresh, AUG10),
   "Costs $20/mo", "a bare $ is not a token")
eq(resolveDateTokens("", "en", fresh, AUG10), "", "empty string")

// gray-matter can hand back Date objects for unquoted YAML dates
eq(resolveDateTokens("X $MONTH_YEAR", "en", { updated: new Date(Date.UTC(2026, 5, 1)) }, SEP02),
   "X June 2026", "accepts Date objects, not just YYYY-MM-DD strings")

// effectiveTokenDate is the seam the above rides on
eq(effectiveTokenDate(fresh, AUG10).toISOString().slice(0, 10), "2026-08-10", "fresh -> today")
eq(effectiveTokenDate(fresh, SEP02).toISOString().slice(0, 10), "2026-08-07", "stale -> updated")

// ------------------------------------------------------------------- report
if (failures.length) {
  console.error(`\n${failures.length} FAILED, ${pass} passed:\n`)
  for (const f of failures) console.error("  ✗ " + f + "\n")
  process.exit(1)
}
console.log(`seo-tokens: ${pass} assertions passed`)
