#!/usr/bin/env bash
# Mutation suite for scripts/check-alchemy-widget-budget.mjs.
#
# WHY: the first version of that gate was "negative-tested" only against the mutations it was
# written to catch — a tautology, not a test. An adversarial review then broke it three ways and
# found one false positive. Every one of those is a case below. Run this after ANY edit to the gate
# or to the widget's fetchFast/loading-note code.
#
#   bash scripts/tests/test-alchemy-widget-budget.sh
#
# Each case mutates a COPY of the tree, runs the gate, and asserts the expected verdict. The real
# files are restored from a byte-checked backup at the end.
set -uo pipefail
cd "$(dirname "$0")/../.." || exit 2

WIDGET=public/alchemy-preview/index.html
CANARY=.github/workflows/alchemy-canary.yml
GATE=scripts/check-alchemy-widget-budget.mjs
TMP=$(mktemp -d)
trap 'cp "$TMP/widget.bak" "$WIDGET"; cp "$TMP/canary.bak" "$CANARY"; rm -rf "$TMP"' EXIT

cp "$WIDGET" "$TMP/widget.bak"
cp "$CANARY" "$TMP/canary.bak"
W_MD5=$(md5 -q "$WIDGET" 2>/dev/null || md5sum "$WIDGET" | cut -d' ' -f1)

pass=0; fail=0
restore(){ cp "$TMP/widget.bak" "$WIDGET"; cp "$TMP/canary.bak" "$CANARY"; }
# $1 = case name, $2 = expected ("FAIL" = gate must reject, "PASS" = gate must accept)
check(){
  local name=$1 want=$2 got
  if node "$GATE" >/dev/null 2>&1; then got=PASS; else got=FAIL; fi
  if [ "$got" = "$want" ]; then printf '  ok   %-52s gate=%s\n' "$name" "$got"; pass=$((pass+1));
  else printf '  FAIL %-52s gate=%s want=%s\n' "$name" "$got" "$want"; fail=$((fail+1)); fi
  restore
}

echo "mutation suite: check-alchemy-widget-budget.mjs"
check "baseline, unmutated" PASS

perl -pi -e 's/: 60000\);/: 20000);/' "$WIDGET"
check "(a) budget lowered below the floor" FAIL

perl -pi -e "s/await fetchFast\(domain, \{brand, industry, country\}\)/await fetchReal(domain, {brand, industry, country, only:'fast'})/" "$WIDGET"
check "(b1) direct fetchReal, single-quoted" FAIL

perl -pi -e 's/await fetchFast\(domain, \{brand, industry, country\}\)/await fetchReal(domain, {brand, industry, country, only:"fast"})/' "$WIDGET"
check "(b2) direct fetchReal, DOUBLE-quoted" FAIL

perl -0pi -e 's/if\(hardFail \|\| attempt===1\) throw e;//' "$WIDGET"
check "(c1) hard-fail throw deleted" FAIL

perl -0pi -e 's/const hardFail = \(e && \(e\.status===429 \|\| e\.status===403\)\);/const hardFail = false;/' "$WIDGET"
check "(c2) hardFail computation gutted" FAIL

perl -0pi -e 's/  loadNoteTimers\.push\(setTimeout\([^\n]*\n  loadNoteTimers\.push\(setTimeout\([^\n]*\n//' "$WIDGET"
check "(d1) both note timers deleted" FAIL

perl -0pi -e "s/armLoadNotes\('Taking longer than expected — retrying once\.'\)/void 0/" "$WIDGET"
check "(d2) retry no longer re-arms the notes" FAIL

perl -pi -e "s{^\Q/* ---------- backend ---------- */\E}{// old: fetchReal(domain, {only:'fast'})\n/* ---------- backend ---------- */}" "$WIDGET"
check "(e) a COMMENT mentioning the pattern (false-positive guard)" PASS

perl -pi -e 's/BUDGET_MS: "60000"/BUDGET_MS: "45000"/' "$CANARY"
check "(f) canary budget drifts from the widget" FAIL

mv "$CANARY" "$TMP/moved.yml"; check "(g) canary workflow missing" FAIL; mv "$TMP/moved.yml" "$CANARY"

mv "$WIDGET" "$TMP/moved.html"; check "(h) widget missing" FAIL; mv "$TMP/moved.html" "$WIDGET"

restore
W_NOW=$(md5 -q "$WIDGET" 2>/dev/null || md5sum "$WIDGET" | cut -d' ' -f1)
[ "$W_MD5" = "$W_NOW" ] && echo "  ok   widget restored byte-identical" && pass=$((pass+1)) || { echo "  FAIL widget NOT restored"; fail=$((fail+1)); }

echo
if [ "$fail" -eq 0 ]; then echo "ALL $pass CASES PASS"; else echo "$fail FAILURE(S), $pass passed"; fi
exit $(( fail > 0 ))
