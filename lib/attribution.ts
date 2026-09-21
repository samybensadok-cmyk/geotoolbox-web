/**
 * SG_SIGNUP_PROVENANCE_V1 (2026-09-21) — first-touch attribution for signups.
 *
 * Master-plan item 3. Layer 1 of three; the PHP half is inc/signup_provenance.php and the full
 * spec, success queries and power analysis are in geotoolbox-main/SIGNUP-PROVENANCE-2026-09-21.md.
 *
 * WHY A CLIENT-SIDE COOKIE AND NOT MIDDLEWARE. middleware.ts returns early for every /app, /api
 * and .php path, and — measured on this repo on 2026-08-24 — response headers set in middleware
 * do NOT reach a statically prerendered page (`Vary: Accept` on `/` was tried twice and was absent
 * from the live response). lib/consent.ts already writes first-party cookies from the client on
 * this origin and they already arrive in PHP's $_COOKIE, because the app is served under
 * geotoolbox.ai/app via the Vercel rewrite. Use the mechanism that is proven here.
 *
 * WHY THE SNAPSHOT IS SPLIT FROM THE WRITE. Reading document.referrer into a variable is not
 * storage on the visitor's device; writing a non-essential cookie is. So the snapshot is taken at
 * mount — before consent has resolved — and persisted only once analytics are allowed. Without
 * that split, an EEA visitor who accepts on their third page would have their true entry referrer
 * already lost, and would be recorded as "direct".
 *
 * FIRST TOUCH WINS: an existing cookie is never overwritten, so a campaign click keeps its
 * attribution for 30 days even if the visitor returns via search before signing up.
 */

const ATTR_COOKIE = "sg_attr"
const MAX_AGE = 60 * 60 * 24 * 30 // 30 days
const CAMPAIGN_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "msclkid",
] as const

/**
 * `d: 1` asserts that document.referrer was OBSERVED EMPTY — a genuine direct arrival. It is
 * deliberately separate from "no `r`", because `r` is also absent when a referrer existed but was
 * internal or unparseable. The PHP reader may only infer `channel: direct` from `d`, never from a
 * missing `r`: an EEA visitor who arrived from Google, hard-reloaded, then accepted consent has a
 * re-taken snapshot whose referrer is our own page, and would otherwise be recorded as "direct"
 * when the truth is "we did not see". (Codex QA, 2026-09-21.)
 */
type Snapshot = { v: 1; t: number; l?: string; d?: 1; r?: string; u?: Record<string, string> }

// Module scope: taken once, on the first mount of the session, which is the entry page.
let snapshot: Snapshot | null = null

function hasCookie(name: string): boolean {
  try {
    return new RegExp("(?:^|;\\s*)" + name + "=").test(document.cookie)
  } catch {
    return false
  }
}

function isOwnHost(host: string): boolean {
  return /(^|\.)geotoolbox\.ai$/.test(host) || host === window.location.hostname
}

/**
 * Pure read, no storage. Safe to call before consent resolves, and safe to call repeatedly —
 * only the first call is kept, which is what makes this first-touch.
 */
export function snapshotAttribution(): void {
  if (snapshot) return
  try {
    const url = new URL(window.location.href)
    const s: Snapshot = { v: 1, t: Math.floor(Date.now() / 1000), l: url.pathname.slice(0, 200) }

    // Referrer is kept only when EXTERNAL. An internal one carries no acquisition information,
    // and storing it would classify the visitor as having come from ourselves.
    const ref = document.referrer || ""
    if (!ref) {
      s.d = 1 // witnessed: there was no referrer at all
    } else {
      try {
        const r = new URL(ref)
        if (!isOwnHost(r.hostname)) s.r = (r.origin + r.pathname).slice(0, 300)
        // Own-host referrer: neither `r` nor `d`. We saw a referrer but it tells us nothing about
        // acquisition, and claiming `d` here would invent a direct arrival.
      } catch {
        /* unparseable referrer: no `r`, and no `d` either — absence of evidence, not evidence */
      }
    }

    const u: Record<string, string> = {}
    for (const k of CAMPAIGN_KEYS) {
      const v = url.searchParams.get(k)
      if (v) u[k] = v.slice(0, 100)
    }
    if (Object.keys(u).length > 0) s.u = u

    snapshot = s
  } catch {
    /* never break a page render for attribution */
  }
}

/**
 * Write the snapshot. Call ONLY where analytics are allowed (outside the consent zone, or after
 * an explicit grant) — this cookie is not strictly necessary.
 *
 * Host-only (no Domain=) on purpose, exactly like sg_consent: geotoolbox.ai cookies reach /app
 * through the Vercel rewrite, so host-only is both sufficient and tighter. SameSite=Lax so it is
 * still sent on the top-level GET that returns from Google OAuth — the majority signup path.
 */
export function persistAttribution(): void {
  try {
    if (hasCookie(ATTR_COOKIE)) return // first touch wins
    snapshotAttribution()
    if (!snapshot) return
    // 🔴 Budget the bytes that actually travel, not JS string length (Codex QA, 2026-09-21).
    // `value.length` counts UTF-16 code units: 841 chars of CJK campaign values measured 2,241
    // UTF-8 bytes — past PHP's 2048-byte read cap — and 6,567 percent-encoded bytes, past the
    // browser's ~4KB per-cookie limit. Both silently discard the attribution. So drop optional
    // fields until BOTH the decoded UTF-8 size and the encoded cookie fit, and give up rather
    // than write something the reader will throw away.
    const droppable = ["u", "r", "l"] as const
    // Work on a COPY: trimming must not mutate the module-scope first-touch snapshot.
    const payload: Snapshot = { ...snapshot }
    let encoded = ""
    for (let i = 0; ; i++) {
      const value = JSON.stringify(payload)
      encoded = encodeURIComponent(value)
      if (new Blob([value]).size <= 1800 && encoded.length + ATTR_COOKIE.length <= 3500) break
      if (i >= droppable.length) return // even the bare timestamp did not fit: write nothing
      delete payload[droppable[i]]
    }
    const secure = window.location.protocol === "https:" ? "; Secure" : ""
    document.cookie = `${ATTR_COOKIE}=${encoded}; path=/; max-age=${MAX_AGE}; SameSite=Lax${secure}`
  } catch {
    /* non-fatal */
  }
}

/** CNIL hygiene: drop it on refuse, alongside the tracker cookies. */
export function clearAttribution(): void {
  try {
    document.cookie = `${ATTR_COOKIE}=; path=/; max-age=0`
  } catch {
    /* non-fatal */
  }
}
