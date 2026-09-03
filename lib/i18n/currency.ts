/**
 * Which locales are priced, displayed AND billed in euros.
 *
 * This was previously an inline `locale === "fr"` repeated in seven places
 * (Offer schema, three signup-CTA query strings, the pricing-teaser formatter,
 * the comparison table, the parity gate). Adding a second euro market (de,
 * 2026-09) meant editing all seven — and missing one ships the worst possible
 * defect: a page that SHOWS "99 €" and sends the visitor to a USD checkout.
 * One set, one helper, so display and billing can never disagree.
 *
 * KEEP IN SYNC with the currencies the Replit billing app accepts
 * (`?currency=eur`) and with the `money` template in messages/<locale>.json —
 * a locale listed here must render "{amount} €", not "${amount}".
 */
export const EUR_LOCALES: ReadonlySet<string> = new Set(["fr", "de"])

export function isEuroLocale(locale: string): boolean {
  return EUR_LOCALES.has(locale)
}

/** ISO 4217 code for Offer/PriceSpecification schema. */
export function priceCurrency(locale: string): "EUR" | "USD" {
  return isEuroLocale(locale) ? "EUR" : "USD"
}

/** Query-string fragment appended to every signup/checkout CTA. Empty for USD. */
export function currencyParam(locale: string): string {
  return isEuroLocale(locale) ? "&currency=eur" : ""
}

/**
 * Bare price formatter for teaser copy: "99\u00a0€" vs "$99".
 * The euro form uses a NON-BREAKING space (DIN 5008 / French typography) so the
 * amount never wraps away from its symbol — matching the existing FR output.
 */
export function formatPrice(n: number, locale: string): string {
  return isEuroLocale(locale) ? `${n} €` : `$${n}`
}
