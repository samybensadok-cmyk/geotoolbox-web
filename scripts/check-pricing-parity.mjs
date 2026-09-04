#!/usr/bin/env node
/**
 * Pricing catalog ↔ plans.ts parity guard.
 *
 * The pricing page renders its numbers from lib/plans.ts, EXCEPT the per-card
 * quota lines and the comparison-table string cells, which are duplicated as
 * display copy in messages/{locale}.json so they can be translated. Those
 * duplicates are what can silently go stale: bump a credit allowance in
 * plans.ts and nothing breaks the build, but the FR (or EN) card keeps quoting
 * the old figure.
 *
 * This asserts, for every locale:
 *   1. every DIGIT SEQUENCE in a card's quota strings matches the same card's
 *      quotas in plans.ts (locale-agnostic: separators/words are ignored, only
 *      the numbers must agree);
 *   2. the compare catalog has the same group count, row counts, and null/string
 *      cell positions as COMPARE_GROUPS — so an index-merged label can never
 *      drift onto another feature's row;
 *   3. every locale has the same pricing key set as the EN reference.
 *
 * Run: npm run check:pricing
 */
import { readFileSync, readdirSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const plansSrc = readFileSync(join(root, "lib/plans.ts"), "utf8")
const errors = []

// --- parse the bits of plans.ts we need (it's a static literal file) --------
function parseQuotas() {
  const out = {}
  const planRe = /id:\s*"([a-z]+)"[\s\S]*?quotas:\s*\{([\s\S]*?)\}/g
  let m
  while ((m = planRe.exec(plansSrc))) {
    const [, id, body] = m
    const q = {}
    for (const [, k, v] of body.matchAll(/(\w+):\s*"([^"]*)"/g)) q[k] = v
    out[id] = q
  }
  return out
}

function parseCompareShape() {
  const start = plansSrc.indexOf("export const COMPARE_GROUPS")
  const src = plansSrc.slice(start)
  const groups = []
  for (const [, groupName, groupBody] of src.matchAll(
    /group:\s*"([^"]*)",\s*rows:\s*\[([\s\S]*?)\n\s{4}\],/g,
  )) {
    const rows = []
    for (const [, label, values] of groupBody.matchAll(/label:\s*"([^"]*)",\s*values:\s*\[([^\]]*)\]/g)) {
      // A cell is either a translatable STRING or a Y/N boolean. Tokenize on
      // quoted-string / bare-identifier boundaries — NOT on commas, because a
      // value like "1,000" contains one. Keep the STRING VALUE, not just its
      // type: type-only checking would pass a real drift (plans.ts "15/mo" →
      // "20/mo" while both catalogs still say "15/mo").
      const cells = [...values.matchAll(/"((?:[^"\\]|\\.)*)"|\b(?:Y|N|true|false)\b/g)].map((t) =>
        t[0].startsWith('"') ? t[1] : null,
      )
      rows.push({ label, cells })
    }
    groups.push({ group: groupName, rows })
  }
  return groups
}

// EXPECTED SHAPE — asserted so a refactor of plans.ts that defeats the regexes
// above fails loudly instead of silently parsing a subset and reporting "OK".
// SG_PRICING_V2.1 2026-07-28: Free is retired (5 plans), and "Usage & limits"
// gained a "Free trial" row (7). NOTE: yesterday's stale-table incident happened
// BECAUSE this self-check failed (free removed, script not updated) and the
// session shipped anyway — if this guard exits non-zero, fixing it is part of
// the change, not optional.
const EXPECTED_PLAN_IDS = ["starter", "consultant", "pro", "agency", "scale", "enterprise"]
const EXPECTED_ROW_COUNTS = [7, 9, 12, 6, 2, 1]

const PLAN_QUOTAS = parseQuotas()
const COMPARE_SHAPE = parseCompareShape()

// Self-check: prove the parse recovered EXACTLY what we expect before trusting
// any downstream "OK". A partial parse must fail, not pass quietly.
{
  const got = Object.keys(PLAN_QUOTAS).sort().join(",")
  const want = [...EXPECTED_PLAN_IDS].sort().join(",")
  if (got !== want) {
    console.error(`✗ guard self-check: parsed plan ids [${got}] ≠ expected [${want}] — plans.ts shape changed, fix this script`)
    process.exit(1)
  }
  const counts = COMPARE_SHAPE.map((g) => g.rows.length)
  if (counts.join(",") !== EXPECTED_ROW_COUNTS.join(",")) {
    console.error(
      `✗ guard self-check: compare row counts [${counts}] ≠ expected [${EXPECTED_ROW_COUNTS}].\n` +
        `  If you intentionally added/removed a comparison row, update EXPECTED_ROW_COUNTS in this script.`,
    )
    process.exit(1)
  }
}

const digits = (s) => (s.match(/\d+/g) ?? []).join(",")

const locales = readdirSync(join(root, "messages"))
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(/\.json$/, ""))

const reference = JSON.parse(readFileSync(join(root, "messages/en.json"), "utf8")).pricing
const keyPaths = (o, p = "") =>
  o && typeof o === "object"
    ? Object.entries(o).flatMap(([k, v]) => keyPaths(v, `${p}.${k}`))
    : [p]

for (const locale of locales) {
  const msg = JSON.parse(readFileSync(join(root, `messages/${locale}.json`), "utf8"))
  const pricing = msg.pricing
  if (!pricing) {
    errors.push(`[${locale}] no "pricing" namespace`)
    continue
  }

  // 0. the money template must not smuggle in a currency or a digit of its own
  const money = pricing.cards.money
  if (!money.includes("{amount}")) {
    errors.push(`[${locale}] cards.money "${money}" is missing the {amount} placeholder`)
  }
  if (/\d/.test(money)) {
    errors.push(`[${locale}] cards.money "${money}" contains a literal digit — it would alter every displayed price`)
  }
  // SG_EUR_CHECKOUT_V1 2026-07-27: euro locales quote EUR at IDENTICAL numeric
  // amounts ($299 = 299 €) and the Stripe Prices carry currency_options[eur] to
  // match, so "€" is correct for them. Any other symbol is still a mistake.
  // The euro set is EUR_LOCALES in lib/i18n/currency.ts (fr, de, nl as of 2026-09);
  // read from there rather than re-listing, so display can't drift from billing.
  // NOTE this checks WHICH symbol a locale renders, never WHERE it sits. Dutch puts
  // the euro first ("€ 99") where fr/de put it last — placement lives in
  // EUR_PREFIX_LOCALES and is gated outside this repo (nl-lint.mjs).
  const symbols = money.replace("{amount}", "").replace(/[\s  ]/g, "")
  const eurLocales = new Set(
    [...readFileSync(join(root, "lib/i18n/currency.ts"), "utf8")
      .match(/EUR_LOCALES: ReadonlySet<string> = new Set\(\[([^\]]+)\]\)/)[1]
      .matchAll(/"([^"]+)"/g)].map((m) => m[1]),
  )
  const expectedSymbol = eurLocales.has(locale) ? "€" : "$"
  if (symbols !== expectedSymbol) {
    errors.push(
      `[${locale}] cards.money "${money}" renders currency "${symbols}", expected "${expectedSymbol}" — ` +
        `a wrong symbol would misstate the price (EUR is only valid for fr, at identical amounts)`,
    )
  }

  // 1. card quota numbers must match plans.ts.
  //    EN is the SOURCE language, so it must match plans.ts VERBATIM (that
  //    catches wording drift like "Unlimited brands" → "Limited brands", which
  //    a digits-only check sails past). Other locales are checked on digits,
  //    since their wording is legitimately different.
  for (const planId of EXPECTED_PLAN_IDS) {
    const copy = pricing.cards.plans[planId]
    const truth = PLAN_QUOTAS[planId]
    if (!copy) {
      // Every plan renders as a card on at least one tab (SG_PRICING_V2.1).
      errors.push(`[${locale}] cards.plans.${planId} is missing — the card would crash at render`)
      continue
    }
    for (const [field, str] of Object.entries(copy.quotas)) {
      const truthStr = truth[field] ?? ""
      if (locale === "en") {
        if (str !== truthStr) {
          errors.push(
            `[${locale}] cards.plans.${planId}.quotas.${field}: "${str}" ≠ plans.ts "${truthStr}" ` +
              `(EN is the source language and must match plans.ts verbatim)`,
          )
        }
      } else if (digits(str) !== digits(truthStr)) {
        errors.push(
          `[${locale}] cards.plans.${planId}.quotas.${field}: numbers ${digits(str) || "(none)"} ` +
            `≠ plans.ts ${digits(truthStr) || "(none)"}  — copy: "${str}"  plans.ts: "${truthStr}"`,
        )
      }
    }
  }

  // 2. compare matrix shape must match COMPARE_GROUPS exactly
  const cg = pricing.compare.groups
  if (cg.length !== COMPARE_SHAPE.length) {
    errors.push(`[${locale}] compare.groups: ${cg.length} groups, plans.ts has ${COMPARE_SHAPE.length}`)
  } else {
    COMPARE_SHAPE.forEach((group, gi) => {
      const cgg = cg[gi]
      if (cgg.rows.length !== group.rows.length) {
        errors.push(`[${locale}] compare.groups[${gi}]: ${cgg.rows.length} rows, plans.ts has ${group.rows.length}`)
        return
      }
      // EN is the source language: its group title and row labels must match
      // plans.ts VERBATIM. That pins catalog ORDER to plans.ts order, which is
      // what stops a positional merge from silently attaching a label to the
      // wrong feature's values (every all-boolean row has an identical
      // null-shape, so shape alone cannot detect a reordering).
      if (locale === "en" && cgg.group !== group.group) {
        errors.push(`[en] compare.groups[${gi}].group: "${cgg.group}" ≠ plans.ts "${group.group}" (order/label must match)`)
      }
      group.rows.forEach((row, ri) => {
        const got = cgg.rows[ri]
        if (locale === "en" && got.label !== row.label) {
          errors.push(
            `[en] compare.groups[${gi}].rows[${ri}].label: "${got.label}" ≠ plans.ts "${row.label}" ` +
              `— rows are merged BY INDEX, so a mismatch here means labels and values have drifted apart`,
          )
        }
        if (got.values.length !== row.cells.length) {
          errors.push(`[${locale}] compare.groups[${gi}].rows[${ri}]: ${got.values.length} cells, plans.ts has ${row.cells.length}`)
          return
        }
        row.cells.forEach((cell, ci) => {
          const override = got.values[ci]
          const isStr = typeof override === "string"
          if (isStr !== (cell !== null)) {
            errors.push(
              `[${locale}] compare.groups[${gi}].rows[${ri}].values[${ci}] ("${row.label}"): catalog has ` +
                `${isStr ? "a string" : "null"} but plans.ts has ${cell !== null ? "a string" : "a boolean"} ` +
                `— a null must line up with every boolean cell, or a label lands on the wrong row`,
            )
            return
          }
          if (!isStr) return
          // VALUE check, not just type: EN verbatim, others on digits.
          if (locale === "en") {
            if (override !== cell) {
              errors.push(
                `[en] compare.groups[${gi}].rows[${ri}].values[${ci}] ("${row.label}"): "${override}" ≠ plans.ts "${cell}"`,
              )
            }
          } else if (digits(override) !== digits(cell)) {
            errors.push(
              `[${locale}] compare.groups[${gi}].rows[${ri}].values[${ci}] ("${row.label}"): numbers ` +
                `${digits(override) || "(none)"} ≠ plans.ts ${digits(cell) || "(none)"} ` +
                `— copy: "${override}"  plans.ts: "${cell}"`,
            )
          }
        })
      })
    })
  }

  // 3. key-set parity with EN
  if (locale !== "en") {
    const ref = new Set(keyPaths(reference))
    const mine = new Set(keyPaths(pricing))
    for (const k of ref) if (!mine.has(k)) errors.push(`[${locale}] missing key pricing${k}`)
    for (const k of mine) if (!ref.has(k)) errors.push(`[${locale}] extra key pricing${k}`)
  }
}

if (errors.length) {
  console.error(`✗ pricing parity: ${errors.length} problem(s)\n`)
  for (const e of errors) console.error("  " + e)
  process.exit(1)
}
console.log(
  `✓ pricing parity OK — ${locales.length} locale(s), ` +
    `${Object.keys(PLAN_QUOTAS).length} plans, ` +
    `${COMPARE_SHAPE.reduce((n, g) => n + g.rows.length, 0)} compare rows`,
)
