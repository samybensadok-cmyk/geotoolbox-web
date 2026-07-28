/**
 * SG_CONSENT_V1 (2026-07-28) — cookie-consent state for the tracking gate.
 *
 * GDPR/ePrivacy: GA4 + Microsoft Clarity (and PostHog in the app) may only run
 * for EEA/UK/CH visitors AFTER opt-in. Non-EEA visitors are untouched (no
 * banner, trackers load as before). Unknown country FAILS CLOSED (treated as
 * EEA) — legally safe; in practice "unknown" is localhost/dev and header-less
 * edge cases.
 *
 * State lives in two first-party, host-only cookies (path=/), so the PHP app
 * served under geotoolbox.ai/app (Vercel rewrite → Replit) reads the SAME
 * consent server-side:
 *   sg_consent = "granted" | "denied"   (12mo / 6mo — CNIL guidance caps a
 *                                        remembered refusal at 6 months)
 *   sg_cc      = ISO country from /consent/geo (24h probe cache)
 *
 * All reads/writes are client-only (document.cookie); every export is safe to
 * import from a server component but must be CALLED in the browser.
 */

// EU-27 + EEA (IS, LI, NO) + UK + CH. Keep in lockstep with the PHP twin in
// the Replit app: inc/consent_gate.php.
export const CONSENT_COUNTRIES = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
  "SI", "ES", "SE", // EU-27
  "IS", "LI", "NO", // EEA
  "GB", "CH",       // UK + Switzerland (UK GDPR / revFADP)
])

export type ConsentValue = "granted" | "denied"

const CONSENT_COOKIE = "sg_consent"
const COUNTRY_COOKIE = "sg_cc"
const GRANTED_MAX_AGE = 60 * 60 * 24 * 365 // 12 months
const DENIED_MAX_AGE = 60 * 60 * 24 * 180  // 6 months (CNIL: don't re-ask sooner, don't remember refusal longer)
const COUNTRY_MAX_AGE = 60 * 60 * 24       // 24h

function readCookie(name: string): string {
  if (typeof document === "undefined") return ""
  const m = document.cookie.match(new RegExp("(?:^|;\\s*)" + name + "=([^;]*)"))
  if (!m) return ""
  // Codex QA C2: a malformed value (e.g. a manually-set "%") must fail closed
  // to "no value", never throw out of the consent effect.
  try {
    return decodeURIComponent(m[1])
  } catch {
    return ""
  }
}

// Secure is required in production but silently kills the cookie on plain-HTTP
// dev origins (Codex QA C4) — attach it only where it can actually be stored.
function secureSuffix(): string {
  return typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : ""
}

export function getConsent(): ConsentValue | null {
  const v = readCookie(CONSENT_COOKIE)
  return v === "granted" || v === "denied" ? v : null
}

export function setConsent(value: ConsentValue): void {
  if (typeof document === "undefined") return
  const maxAge = value === "granted" ? GRANTED_MAX_AGE : DENIED_MAX_AGE
  // Host-only (no Domain=) on purpose: geotoolbox.ai cookies reach /app via the
  // rewrite; a Domain=.geotoolbox.ai widening buys nothing and leaks to any
  // future subdomain.
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${maxAge}; SameSite=Lax${secureSuffix()}`
}

export function getCachedCountry(): string {
  return readCookie(COUNTRY_COOKIE).toUpperCase()
}

export function cacheCountry(country: string): void {
  if (typeof document === "undefined") return
  // Codex QA C1: an empty value would read back as "not cached" and re-probe
  // every page load — unknown is cached as an explicit sentinel instead. The
  // sentinel fails the ISO shape check in requiresConsent, so it stays closed.
  const v = country || "unknown"
  document.cookie = `${COUNTRY_COOKIE}=${encodeURIComponent(v)}; path=/; max-age=${COUNTRY_MAX_AGE}; SameSite=Lax${secureSuffix()}`
}

/**
 * Fail CLOSED unless the value is a well-formed ISO country code that is
 * verifiably outside the consent zone. Catches "", the "unknown" sentinel,
 * garbage, and the anonymizer sentinels some stacks emit (XX/ZZ; Cloudflare's
 * T1 already fails the two-letter shape).
 */
export function requiresConsent(country: string): boolean {
  const c = country.toUpperCase()
  if (!/^[A-Z]{2}$/.test(c)) return true
  if (c === "XX" || c === "ZZ") return true
  return CONSENT_COUNTRIES.has(c)
}

/** Name of the window event that re-opens the banner ("Cookie settings"). */
export const CONSENT_OPEN_EVENT = "sg:consent-open"
