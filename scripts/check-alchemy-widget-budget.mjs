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
import { readFileSync, existsSync } from 'node:fs';

const WIDGET = 'public/alchemy-preview/index.html';
// Measured worst case is ~25 s warm; cold boot has been observed to push past 20 s on its own.
// 45 s is the floor, not the target — the shipped value is 60 s.
const MIN_FAST_BUDGET_MS = 45000;

const fail = [];

if (!existsSync(WIDGET)) {
  console.error(`FAIL  ${WIDGET} not found — this gate protects that file; if it moved, update this script.`);
  process.exit(1);
}
const src = readFileSync(WIDGET, 'utf8');

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
// otherwise the gate flags the very wrapper it is trying to protect.
const fastStart = src.indexOf('async function fetchFast(');
const fastEnd = fastStart === -1 ? -1 : src.indexOf('\n}', fastStart);
const outsideWrapper = fastStart === -1 ? src : src.slice(0, fastStart) + src.slice(fastEnd + 2);
const directFastCalls = [...outsideWrapper.matchAll(/fetchReal\s*\([^;]*?only\s*:\s*'fast'/g)].length;
if (directFastCalls > 0) {
  fail.push(`(B) ${directFastCalls} call(s) pass only:'fast' straight to fetchReal() — the fast tier must go through fetchFast() so it retries a cold-boot abort.`);
}

// (C) the retry must not amplify a decision
if (!/e\.status\s*===\s*429/.test(src) || !/e\.status\s*===\s*403/.test(src)) {
  fail.push("(C) fetchFast() no longer excludes 429/403 from its retry — retrying a rate limit or a disabled feature deepens the failure instead of recovering from it.");
}

// (D) the long-wait progress note
if (!/id="gak-load-note"/.test(src) || !/function loadNote\(/.test(src)) {
  fail.push('(D) the loading-stage progress note is gone. The step animation covers ~7s; without the note a 60s budget leaves the visitor staring at a finished checklist.');
}

if (fail.length) {
  console.error('\nAlchemy widget budget gate FAILED:\n');
  for (const f of fail) console.error('  ✗ ' + f);
  console.error('\nContext: leadgen-diagnosis-2026-09-09/alchemy-build/DIAGNOSIS-2026-09-18-could-not-run.md\n');
  process.exit(1);
}
console.log(`✓ alchemy widget budget gate: fast abort ${abort[1]}ms (floor ${MIN_FAST_BUDGET_MS}ms), fetchFast retry + 429/403 exclusion + progress note all present`);
