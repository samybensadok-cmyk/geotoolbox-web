#!/usr/bin/env bash
#
# dev-capped.sh — memory-capped `next dev` for geotoolbox-web.
#
# WHY THIS EXISTS: bare `next dev` (Next 16 / Turbopack) on a 16 GB laptop,
# stacked on top of Claude + Chrome + ~11 MCP node processes (~4 GB resident
# before it even starts), balloons until the machine OOM-freezes. This happened
# 3x on 2026-06-08. The node heap cap alone is NOT enough — Turbopack's native
# (Rust) memory is not bounded by --max-old-space-size — so a watchdog hard-kills
# the whole dev process tree if its combined RSS crosses MEM_CAP_MB.
#
# USAGE:
#   bash scripts/dev-capped.sh          # or: npm run dev  (repointed to this)
#   MEM_CAP_MB=5000 bash scripts/dev-capped.sh   # raise the kill ceiling
#   npm run dev:raw                     # escape hatch: original uncapped next dev
#
set -euo pipefail

HEAP_MB="${HEAP_MB:-3072}"        # JS heap ceiling passed to node
MEM_CAP_MB="${MEM_CAP_MB:-5500}"  # hard-kill ceiling for the whole dev tree (RSS sum)
MIN_FREE_MB="${MIN_FREE_MB:-2500}" # refuse to start if less free+reclaimable than this
POLL_SECS="${POLL_SECS:-2}"
BREACH_LIMIT="${BREACH_LIMIT:-3}" # kill only after this many CONSECUTIVE over-ceiling polls
# Sizing for a 16 GB laptop: a cold Turbopack compile transiently spikes ~4.8 GB,
# so the ceiling sits at 5.5 GB (allows a real compile) and only fires on a
# SUSTAINED breach (~6s) — a transient spike survives, a monotonic runaway (the
# 10 GB+ growth that froze the laptop) gets killed. With Chrome+Claude+MCPs (~4 GB)
# already resident, 5.5 GB dev keeps total ~9.5 GB on a 16 GB box (safe headroom).

cd "$(dirname "$0")/.."

# --- free-memory helper (free + inactive + speculative pages are reclaimable) ---
free_mb() {
  local psize pfree pinact pspec
  psize=$(vm_stat | awk '/page size of/{print $8}')
  pfree=$(vm_stat  | awk '/Pages free/{gsub("\\.","",$3); print $3}')
  pinact=$(vm_stat | awk '/Pages inactive/{gsub("\\.","",$3); print $3}')
  pspec=$(vm_stat  | awk '/Pages speculative/{gsub("\\.","",$3); print $3}')
  echo $(( (pfree + pinact + pspec) * psize / 1024 / 1024 ))
}

# --- sum RSS (MB) of a pid and every descendant ---
tree_rss_mb() {
  local root=$1
  # build pid->ppid table once, then BFS from root
  ps -axo pid=,ppid=,rss= | awk -v root="$root" '
    { pid[$1]=1; ppid[$1]=$2; rss[$1]=$3 }
    END {
      n=0; q[n++]=root; seen[root]=1; total=0
      for (i=0; i<n; i++) {
        p=q[i]; total+=rss[p]
        for (c in ppid) if (ppid[c]==p && !seen[c]) { seen[c]=1; q[n++]=c }
      }
      printf "%d", total/1024
    }'
}

avail=$(free_mb)
if [ "$avail" -lt "$MIN_FREE_MB" ]; then
  echo "⛔ Only ${avail} MB reclaimable RAM free (need ${MIN_FREE_MB}+). Close Chrome tabs / apps first, then retry." >&2
  echo "   Override with: MIN_FREE_MB=0 bash scripts/dev-capped.sh   (NOT recommended)" >&2
  exit 1
fi

echo "▶  next dev — heap cap ${HEAP_MB}MB, tree kill-ceiling ${MEM_CAP_MB}MB, ${avail}MB free"

export NODE_OPTIONS="--max-old-space-size=${HEAP_MB}"
# Start in its own background job so we own the whole tree.
next dev &
DEV_PID=$!

cleanup() {
  # kill the whole descendant tree, not just the parent
  pkill -9 -P "$DEV_PID" 2>/dev/null || true
  kill -9 "$DEV_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

breaches=0
while kill -0 "$DEV_PID" 2>/dev/null; do
  rss=$(tree_rss_mb "$DEV_PID")
  if [ "${rss:-0}" -gt "$MEM_CAP_MB" ]; then
    breaches=$((breaches + 1))
    echo "⚠  dev tree RSS ${rss}MB over ${MEM_CAP_MB}MB ceiling (${breaches}/${BREACH_LIMIT})" >&2
    if [ "$breaches" -ge "$BREACH_LIMIT" ]; then
      echo "" >&2
      echo "🛑 sustained over-ceiling (${rss}MB) — killing the dev tree to protect the laptop." >&2
      echo "   Restart: npm run dev   (raise ceiling for a heavy compile: MEM_CAP_MB=7000 npm run dev)" >&2
      cleanup
      exit 137
    fi
  else
    breaches=0  # dropped back under — transient spike, not a runaway
  fi
  sleep "$POLL_SECS"
done
