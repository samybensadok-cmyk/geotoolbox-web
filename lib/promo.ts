/**
 * SG_PROMO_V2 (2026-08-15) — single source of truth for the sitewide founding
 * offer + the banner experiment.
 *
 * Why one file: the banner, the pricing cards and the signup deep-link all have
 * to describe the SAME offer (same code, same %, same duration, same deadline,
 * same seat count) or the visitor is promised something checkout won't honour.
 * Every number here is mirrored in Stripe on the promotion code `FOUNDING30`
 * (coupon sKGeUpvV: 30% off, repeating 12 months; promotion code
 * max_redemptions=20, expires_at = DEADLINE below). If you change a value here,
 * change Stripe first — the copy must never promise more than Stripe enforces.
 *
 * Deadline discipline: the banner HIDES ITSELF after DEADLINE (see isPromoLive)
 * so a stale deploy can never advertise an expired offer. Do NOT "extend" the
 * deadline in place — a moved deadline is a fake deadline. If the offer is
 * re-run, that's a NEW campaign with a new code and a new dismiss key.
 */

export const PROMO = {
  code: "FOUNDING30",
  percentOff: 30,
  months: 12,
  seats: 20,
  /** ISO date (UTC, end of day) — mirrors the Stripe promotion code expires_at. */
  deadline: "2026-09-15",
} as const

export type PromoLocale = "en" | "fr" | "es"

/**
 * Discounted price, exact to the cent ($199 → 139.3, $948 → 663.6). Never round
 * to whole dollars: Stripe charges the exact percentage ($139.30), and an
 * advertised price below the charged one is the direction that gets disputed.
 */
export function promoPrice(price: number): number {
  return Math.round(price * (100 - PROMO.percentOff)) / 100
}

/** "139.30" / "139,30" — 2 decimals only when there are cents. */
export function fmtPromoAmount(n: number, locale: string): string {
  const loc = locale === "fr" ? "fr-FR" : locale === "es" ? "es-ES" : "en-US"
  const cents = Math.round(n * 100) % 100 !== 0
  return n.toLocaleString(loc, { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: 2 })
}

/** True until 23:59:59 UTC on the deadline day. */
export function isPromoLive(now: Date = new Date()): boolean {
  const end = Date.parse(`${PROMO.deadline}T23:59:59Z`)
  return now.getTime() <= end
}

/** Days left, floored at 0 — used for "ends in N days" copy. */
export function promoDaysLeft(now: Date = new Date()): number {
  const end = Date.parse(`${PROMO.deadline}T23:59:59Z`)
  return Math.max(0, Math.ceil((end - now.getTime()) / 86_400_000))
}

/** "Sep 15" / "15 sept." / "15 sept" — short, locale-aware deadline label. */
export function promoDeadlineLabel(locale: string): string {
  const d = new Date(`${PROMO.deadline}T12:00:00Z`)
  const loc = locale === "fr" ? "fr-FR" : locale === "es" ? "es-ES" : "en-US"
  // Strip the abbreviation dot ("15 sept." → "15 sept") so sentence-final
  // punctuation in banner copy never doubles up.
  return new Intl.DateTimeFormat(loc, { month: "short", day: "numeric", timeZone: "UTC" }).format(d).replace(/\.$/, "")
}

/**
 * Accept the sitewide code OR a personal reservation code (`FOUND-XXXXXX`, see
 * reservePromo). Anything else is dropped — this string is echoed into URLs.
 */
export const RESERVATION_CODE_RE = /^FOUND-[A-Z0-9]{6}$/
export function normalizePromoCode(raw: string | null | undefined): string | null {
  if (!raw) return null
  const v = raw.trim().toUpperCase()
  if (v === PROMO.code) return v
  return RESERVATION_CODE_RE.test(v) ? v : null
}

/* ------------------------------------------------------------------------ */
/* SG_PROMO_RESERVE_V1 — per-visitor 48-hour seat reservation                 */
/*                                                                            */
/* The aggressive countdown pattern, done honestly: on first view of the      */
/* `reserve` banner variant we ask the backend (?action=promo_reserve) to     */
/* mint ONE single-use Stripe promotion code that expires in 48 h. The timer  */
/* counts down to that real Stripe expiry, the code dies at zero, and we NEVER */
/* re-mint for the same visitor (a reset timer is the fake-urgency pattern).  */
/* After expiry the visitor simply sees the standard sitewide offer.          */
/* ------------------------------------------------------------------------ */

export const RESERVATION_KEY = "sg_promo_res"
export const RESERVATION_HOURS = 48

export type Reservation = { code: string; expiresAt: number; variant: string; campaign: string }
type StoredReservation = Reservation | { expired: true; at: number }

export function getReservation(): Reservation | null {
  try {
    const raw = localStorage.getItem(RESERVATION_KEY)
    if (!raw) return null
    const v = JSON.parse(raw) as Partial<Reservation> & { expired?: boolean }
    if (v.expired) return null
    if (typeof v.code !== "string" || !RESERVATION_CODE_RE.test(v.code) || typeof v.expiresAt !== "number") return null
    if (v.expiresAt * 1000 <= Date.now()) {
      // Expired: remember that so we never mint again for this visitor, and drop
      // the dead personal code from the checkout carrier so it is never sent.
      localStorage.setItem(RESERVATION_KEY, JSON.stringify({ expired: true, at: Date.now() } satisfies StoredReservation))
      try {
        const carried = JSON.parse(localStorage.getItem(PROMO_STORAGE_KEY) ?? "null") as { code?: string } | null
        if (carried?.code && RESERVATION_CODE_RE.test(carried.code)) localStorage.removeItem(PROMO_STORAGE_KEY)
      } catch {
        /* ignore */
      }
      return null
    }
    return { code: v.code, expiresAt: v.expiresAt, variant: v.variant ?? "", campaign: v.campaign ?? PROMO.code }
  } catch {
    return null
  }
}

/** True once a reservation has expired for this visitor (do not mint again). */
export function reservationSpent(): boolean {
  try {
    const raw = localStorage.getItem(RESERVATION_KEY)
    if (!raw) return false
    const v = JSON.parse(raw) as { expired?: boolean; expiresAt?: number }
    return !!v.expired || (typeof v.expiresAt === "number" && v.expiresAt * 1000 <= Date.now())
  } catch {
    return false
  }
}

/**
 * Mint a reservation (once per visitor). Returns the reservation, or null when
 * the backend refuses (rate limit, sold out, closed) — callers fall back to the
 * standard offer. Marks the visitor "spent" on sold_out/closed so we stop asking.
 */
let reserveInFlight: Promise<Reservation | null> | null = null
export function reservePromo(variant: string): Promise<Reservation | null> {
  const existing = getReservation()
  if (existing) return Promise.resolve(existing)
  if (reservationSpent()) return Promise.resolve(null)
  if (reserveInFlight) return reserveInFlight
  reserveInFlight = (async () => {
    try {
      const r = await fetch("/app/?action=promo_reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaign: PROMO.code, bv: variant }),
        credentials: "omit",
        cache: "no-store",
      })
      const j = (await r.json()) as { ok?: boolean; code?: string; expires_at?: number; error?: string }
      if (j.ok && typeof j.code === "string" && RESERVATION_CODE_RE.test(j.code) && typeof j.expires_at === "number") {
        const res: Reservation = { code: j.code, expiresAt: j.expires_at, variant, campaign: PROMO.code }
        localStorage.setItem(RESERVATION_KEY, JSON.stringify(res))
        return res
      }
      if (j.error === "sold_out" || j.error === "closed") {
        localStorage.setItem(RESERVATION_KEY, JSON.stringify({ expired: true, at: Date.now() } satisfies StoredReservation))
      }
      return null
    } catch {
      return null
    } finally {
      reserveInFlight = null
    }
  })()
  return reserveInFlight
}

/** "47:59:12" — hours can exceed 24 (48-h window). */
export function formatCountdown(msLeft: number): string {
  const s = Math.max(0, Math.floor(msLeft / 1000))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${pad(h)}:${pad(m)}:${pad(sec)}`
}

/** localStorage key the banner writes on click and the pricing page reads. */
export const PROMO_STORAGE_KEY = "sg_promo"

/**
 * Persist {code, variant} so the offer survives the banner → pricing → signup
 * hop even when a visitor navigates by menu instead of the banner CTA. Best
 * effort; storage may be blocked.
 */
export function rememberPromo(code: string, variant: string): void {
  try {
    localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify({ code, variant, at: Date.now() }))
  } catch {
    /* ignore */
  }
}

export function recallPromo(): { code: string; variant: string } | null {
  try {
    const raw = localStorage.getItem(PROMO_STORAGE_KEY)
    if (!raw) return null
    const v = JSON.parse(raw) as { code?: string; variant?: string }
    const code = normalizePromoCode(v.code)
    if (!code) return null
    return { code, variant: typeof v.variant === "string" ? v.variant.slice(0, 16) : "" }
  } catch {
    return null
  }
}

/**
 * SG_PROMO_ORGANIC_V1 (2026-09-01): drop the stored offer carrier.
 *
 * Needed because a personal `FOUND-` code can reach a browser that holds no
 * matching reservation — someone shares their `?promo=FOUND-XXXXXX` link, or
 * the reservation was minted on another device. `recallPromo()` accepts the
 * code on shape alone, so without a purge that visitor's `sg_promo` stays
 * poisoned forever: the pricing page withdraws the personal offer on every
 * visit and never falls through to the public one, leaving list-price cards
 * under a "30% off" banner — the exact mismatch the organic fallback exists to
 * remove. `getReservation()`'s own cleanup cannot cover this: it only runs when
 * RESERVATION_KEY is present AND expired.
 */
export function forgetPromo(): void {
  try {
    localStorage.removeItem(PROMO_STORAGE_KEY)
  } catch {
    /* storage may be blocked; the page still falls back in memory */
  }
}
