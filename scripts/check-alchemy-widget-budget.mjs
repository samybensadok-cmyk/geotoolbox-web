#!/usr/bin/env node
// Alchemy AI-Visibility widget: client timeout-budget gate.
//
// Incident 2026-09-18 — "Could not run the check right now. Please try again in a moment."
// The widget's free `only=fast` tier had a 20 000 ms AbortController budget and NO retry, while
// the tier's real server-side cost is 12.5-25.1 s warm (it fetches the target site as six
// different AI crawler UAs, so a slow/WAF-heavy target costs more) PLUS Replit Autoscale cold
// boot when the instance has scaled to zero. Forensics: the failing click opened a fresh hourly
// rate-limit window at 12:09:10Z — nothing had kept the instance warm for an hour — and the
// operator's error screenshot is stamped 12:09:39Z, i.e. the 20 s abort fired while the server
// was still working and returned 200 to nobody. Diagnosis:
//   seo-audits/leadgen-diagnosis-2026-09-09/alchemy-build/DIAGNOSIS-2026-09-18-could-not-run.md
//
// This gate is the mechanical half of "never again". It is deliberately STATIC (no network) so a
// build never flakes; the alchemy-canary cron covers the dynamic half by measuring the server's
// real duration and alerting before it creeps back toward the budget.
//
// Gated regression vectors:
//   (A) the fast budget is lowered again (or made non-numeric)      -> FAIL
//   (B) the fast call bypasses fetchFast()'s single retry           -> FAIL
//   (C) the retry starts retrying 429/403 and amplifies a rate limit-> FAIL
//   (D) the long-wait progress note is removed, so a 60 s budget    -> FAIL
//       becomes a silent stall on a dead checklist
//   (E) the widget file moves/renames                               -> FAIL (a guard that cannot
//       find its target has failed, it has not passed)
//
// Run: node scripts/check-alchemy-widget-budget.mjs   (exit 1 on any violation)
// A NOTE ON THIS GATE'S OWN STRENGTH (2026-09-18, after an adversarial mutation review).
// The first version of this file was mutation-tested only against the mutations it was written to
// catch, which is not a test — it is a tautology. An independent review then broke it three ways
// (double-quoted `only:"fast"`, deleting the retry's hard-fail throw, deleting the note timers)
// and produced one false positive (a code COMMENT mentioning the pattern). All four are fixed
// below and are now in the mutation suite. Two limits remain, stated rather than hidden:
//   - a call that assembles its opts in a variable (`const o={only:'fast'}; fetchReal(d,o)`) is
//     not detectable by regex; and
//   - a SECOND abort source (`AbortSignal.timeout`, `Promise.race`) would not be seen at all.
// Both would be caught by the canary, not here. This gate is the cheap half, not the whole story.
import { readFileSync, existsSync } from 'node:fs';

const WIDGET = 'public/alchemy-preview/index.html';
const CANARY = '.github/workflows/alchemy-canary.yml';

/** Strip JS comments so a comment mentioning a banned pattern is not a violation — quote-aware,
 *  so a `//` inside a string literal (e.g. 'https://…') never truncates real code after it. */
function stripComments(src) {
  let out = '', i = 0, q = null;
  while (i < src.length) {
    const c = src[i], n = src[i + 1];
    if (q) {
      if (c === '\\') { out += c + (n ?? ''); i += 2; continue; }
      if (c === q) q = null;
      out += c; i++; continue;
    }
    if (c === '"' || c === "'" || c === '`') { q = c; out += c; i++; continue; }
    if (c === '/' && n === '/') { while (i < src.length && src[i] !== '\n') i++; continue; }
    if (c === '/' && n === '*') { i += 2; while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) i++; i += 2; out += ' '; continue; }
    out += c; i++;
  }
  return out;
}
// Measured worst case is ~25 s warm; cold boot has been observed to push past 20 s on its own.
// 45 s is the floor, not the target — the shipped value is 60 s.
const MIN_FAST_BUDGET_MS = 45000;

const fail = [];

if (!existsSync(WIDGET)) {
  console.error(`FAIL  ${WIDGET} not found — this gate protects that file; if it moved, update this script.`);
  process.exit(1);
}
const raw = readFileSync(WIDGET, 'utf8');
const src = stripComments(raw);

// (A) the fast-tier abort budget
const abort = src.match(/setTimeout\(\(\)=>ctrl\.abort\(\),\s*longCall\s*\?\s*\([^)]*\)\s*:\s*(\d+)\s*\)/);
if (!abort) {
  fail.push('(A) could not locate the fetchReal() abort budget — the timeout expression changed shape; re-read this gate before editing it away.');
} else if (Number(abort[1]) < MIN_FAST_BUDGET_MS) {
  fail.push(`(A) fast-tier abort budget is ${abort[1]}ms, below the ${MIN_FAST_BUDGET_MS}ms floor. The tier measures 12.5-25.1s warm plus cold boot; a smaller budget aborts real scans and shows the visitor a generic error.`);
}

// (B) the fast call must go through the retrying wrapper
if (!/async function fetchFast\(/.test(src)) {
  fail.push('(B) fetchFast() is gone — the free tier lost its single retry, so one cold boot again fails the whole check.');
}
// fetchFast's OWN body legitimately calls fetchReal with only:'fast' — cut it out before counting,
// otherwise the gate flags the very wrapper it is trying to protect. `indexOf('\n}')` relies on the
// wrapper's closing brace being at column 0 while nested braces are indented; a reformat makes the
// slice wrong and the gate FAILS rather than passes, which is the safe direction.
const fastStart = src.indexOf('async function fetchFast(');
const fastEnd = fastStart === -1 ? -1 : src.indexOf('\n}', fastStart);
const outsideWrapper = fastStart === -1 ? src : src.slice(0, fastStart) + src.slice(fastEnd + 2);
// Quote-agnostic: `only:"fast"` bypassed the single-quote-only version of this check.
const directFastCalls = [...outsideWrapper.matchAll(/fetchReal\s*\([^;]*?only\s*:\s*['"]fast['"]/g)].length;
if (directFastCalls > 0) {
  fail.push(`(B) ${directFastCalls} call(s) pass only:'fast' straight to fetchReal() — the fast tier must go through fetchFast() so it retries a cold-boot abort.`);
}

// (C) the retry must not amplify a decision. Checks the whole GUARD STATEMENT, not just that the
// numbers 429/403 appear somewhere: deleting `if(hardFail || attempt===1) throw e;` left both
// comparisons in place and sailed through the presence-only version of this check.
const guard = /hardFail\s*=\s*\(?\s*e\s*&&\s*\(\s*e\.status\s*===\s*429\s*\|\|\s*e\.status\s*===\s*403\s*\)/.test(src)
           && /if\s*\(\s*hardFail\s*\|\|\s*attempt\s*===\s*1\s*\)\s*throw\s+e\s*;/.test(src);
if (!guard) {
  fail.push("(C) fetchFast()'s hard-fail guard is missing or altered — it must compute `hardFail` from status 429/403 AND `if(hardFail || attempt===1) throw e;`. Without the throw, the retry amplifies a rate limit instead of recovering from a transient.");
}

// (D) the long-wait progress note must EXIST and actually be ARMED. Checking only that the element
// and function exist let a mutation delete both timers and still pass, restoring the silent stall.
const armed = [...src.matchAll(/loadNoteTimers\.push\(\s*setTimeout\(/g)].length;
if (!/id="gak-load-note"/.test(raw) || !/function loadNote\(/.test(src) || !/function armLoadNotes\(/.test(src) || armed < 2) {
  fail.push(`(D) the loading-stage progress note is gone or never armed (found ${armed} timer(s), need >=2). The step animation covers ~7s; without it a 60s budget leaves the visitor staring at a finished checklist.`);
}
if (!/armLoadNotes\(\s*['"]/.test(src)) {
  fail.push('(D2) fetchFast no longer re-arms the notes on retry — attempt 2 would inherit one stale line for up to another 60s (worst case ~121s).');
}

// (E) the canary's budget must match the widget's, or the monitor goes blind to a real regression:
// the floor here is 45000 but the canary hardcodes its own threshold, so a widget at 45-59s would
// pass this gate while the canary still scored a 50s response as healthy.
if (!existsSync(CANARY)) {
  fail.push(`(E) ${CANARY} not found — the canary is the runtime half of this contract; if it moved, update this gate.`);
} else {
  const ym = readFileSync(CANARY, 'utf8').match(/BUDGET_MS:\s*"(\d+)"/);
  if (!ym) fail.push('(E) could not read BUDGET_MS from the canary workflow.');
  else if (abort && ym[1] !== abort[1]) {
    fail.push(`(E) budget drift: widget aborts at ${abort[1]}ms but the canary checks against ${ym[1]}ms. They must be equal or the canary cannot see the failure the widget will produce.`);
  }
}

if (fail.length) {
  console.error('\nAlchemy widget budget gate FAILED:\n');
  for (const f of fail) console.error('  ✗ ' + f);
  console.error('\nContext: leadgen-diagnosis-2026-09-09/alchemy-build/DIAGNOSIS-2026-09-18-could-not-run.md\n');
  process.exit(1);
}
console.log(`✓ alchemy widget budget gate: fast abort ${abort[1]}ms (floor ${MIN_FAST_BUDGET_MS}ms), fetchFast retry + 429/403 exclusion + progress note all present`);
