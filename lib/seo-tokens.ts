/**
 * Date tokens for post titles and descriptions — the Yoast `%%currentmonth%%`
 * idea, with one deliberate difference.
 *
 * Yoast always stamps today's month. That is fine on a page you actually
 * maintain and a quiet lie on one you don't: the title claims a freshness the
 * body no longer has. Since this corpus already declares its own shelf life via
 * `recheckBy:` (and `updated:`), we use it. A post inside its window resolves to
 * the CURRENT month; once it lapses, the token pins to the month the post was
 * last actually updated. So an abandoned guide keeps saying "July 2026" instead
 * of silently promoting itself to "March 2027", and refreshing it — bumping
 * `updated:` / `recheckBy:` — is what moves the title forward again.
 *
 * Tokens (use in `title:` / `description:` frontmatter):
 *   $MONTH_YEAR          → "August 2026" · "août 2026" · "agosto de 2026"
 *   $MONTH               → "August"      · "août"      · "agosto"
 *   $YEAR                → "2026"
 *   $UPDATED_MONTH_YEAR  → ALWAYS the `updated:` month. Never the clock.
 *
 * Use `$UPDATED_MONTH_YEAR` for any phrase that asserts a specific verification
 * month — "current to X", "verified in X", "à jour en X", "datos verificados en
 * X". Those are claims about when a human actually checked something, and the
 * freshness window is a tolerance, not a re-verification: a post updated on
 * 2026-07-15 is still "fresh" on 2026-09-01 under the 60-day grace, so a
 * clock-following "current to September 2026" would assert a check that never
 * happened. `$MONTH_YEAR` is a soft maintenance signal and belongs in titles;
 * `$UPDATED_MONTH_YEAR` is a hard factual claim and belongs in these phrases.
 *
 * Month names and the month/year join are produced by Intl for the post's own
 * locale, so Spanish gets its "de" and French stays lowercase without a lookup
 * table. A token that lands at the very start of the string is capitalised, so
 * `"$MONTH_YEAR : le guide"` renders "Août 2026 : le guide" in French while an
 * inline `"... en $MONTH_YEAR"` stays lowercase.
 *
 * Resolution happens in the two loaders in lib/content.ts, so every consumer —
 * metadata, OG image, RSS, llms.txt, the .md twin, sitemap, search — sees the
 * same resolved string. Nothing rewrites the article BODY: prose claims stay
 * explicit and verified.
 *
 * Timezone is UTC so the rendered month never depends on the build host.
 */

/** Days a post stays "current" after `updated:` when it declares no `recheckBy:`. */
export const DEFAULT_GRACE_DAYS = 60

const TOKEN_RE = /\$UPDATED_MONTH_YEAR|\$MONTH_YEAR|\$MONTH|\$YEAR/g

/** BCP-47 tag used for month formatting. Falls back to the locale itself. */
const INTL_TAG: Record<string, string> = { en: "en-US", fr: "fr-FR", es: "es-ES" }

/** Accepts "YYYY-MM-DD" or a Date (gray-matter yields Date for unquoted YAML dates). */
function toUtcDate(value: string | Date | undefined): Date | undefined {
  if (!value) return undefined
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value
  }
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value).trim())
  if (!m) return undefined
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])))
  return Number.isNaN(d.getTime()) ? undefined : d
}

function addDays(d: Date, days: number): Date {
  return new Date(d.getTime() + days * 86_400_000)
}

export type PostDateSignals = {
  date?: string | Date
  updated?: string | Date
  recheckBy?: string | Date
}

/**
 * Is the post still inside the window where it may claim the current month?
 *
 * `recheckBy:` is an explicit operator declaration and wins outright when
 * present — that is the whole point of the field. Otherwise we fall back to
 * `updated:` (then `date:`) plus a grace window. A post carrying no date signal
 * at all has nothing to pin to, so it behaves like plain Yoast.
 */
export function isWithinFreshnessWindow(
  signals: PostDateSignals,
  now: Date,
  graceDays: number = DEFAULT_GRACE_DAYS
): boolean {
  // Both branches express the same rule: the window includes its last day in
  // full, and expires the instant the next day begins. Written as a single
  // `now < lastFreshDay + 1d` so the two cannot drift apart — an earlier
  // `<=` here made a recheckBy that lapsed YESTERDAY still read as fresh.
  const stillFresh = (lastFreshDay: Date) => now < addDays(lastFreshDay, 1)

  const recheckBy = toUtcDate(signals.recheckBy)
  if (recheckBy) return stillFresh(recheckBy)

  const base = toUtcDate(signals.updated) ?? toUtcDate(signals.date)
  if (!base) return true

  return stillFresh(addDays(base, graceDays))
}

/**
 * The date the tokens should render: today while the post is current, otherwise
 * the day it was last genuinely updated.
 */
export function effectiveTokenDate(
  signals: PostDateSignals,
  now: Date,
  graceDays: number = DEFAULT_GRACE_DAYS
): Date {
  if (isWithinFreshnessWindow(signals, now, graceDays)) return now
  return toUtcDate(signals.updated) ?? toUtcDate(signals.date) ?? now
}

function capitalizeFirst(s: string): string {
  return s ? s.charAt(0).toLocaleUpperCase() + s.slice(1) : s
}

/**
 * Replace $MONTH_YEAR / $MONTH / $YEAR in `text`.
 *
 * Returns the input untouched when it carries no token, so this is a no-op for
 * the ~99% of posts that never opt in.
 */
export function resolveDateTokens(
  text: string,
  locale: string,
  signals: PostDateSignals,
  now: Date = new Date(),
  graceDays: number = DEFAULT_GRACE_DAYS
): string {
  if (!text || !text.includes("$")) return text
  TOKEN_RE.lastIndex = 0
  if (!TOKEN_RE.test(text)) return text

  const when = effectiveTokenDate(signals, now, graceDays)
  // Never clock-following: the month a human last actually touched the post.
  const updatedWhen = toUtcDate(signals.updated) ?? toUtcDate(signals.date) ?? when
  const tag = INTL_TAG[locale] ?? locale
  const fmt = (opts: Intl.DateTimeFormatOptions, d: Date = when) =>
    new Intl.DateTimeFormat(tag, { ...opts, timeZone: "UTC" }).format(d)

  TOKEN_RE.lastIndex = 0
  return text.replace(TOKEN_RE, (token, offset: number) => {
    let out: string
    switch (token) {
      case "$UPDATED_MONTH_YEAR":
        out = fmt({ month: "long", year: "numeric" }, updatedWhen)
        break
      case "$MONTH_YEAR":
        out = fmt({ month: "long", year: "numeric" })
        break
      case "$MONTH":
        out = fmt({ month: "long" })
        break
      default:
        out = fmt({ year: "numeric" })
    }
    // Locales that lowercase month names (fr, es) still want a capital when the
    // token opens the title.
    return offset === 0 ? capitalizeFirst(out) : out
  })
}
