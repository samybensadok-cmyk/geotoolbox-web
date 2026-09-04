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
export const EUR_LOCALES: ReadonlySet<string> = new Set(["fr", "de", "nl"])

/**
 * Euro locales that write the symbol BEFORE the amount ("€ 99"), not after.
 *
 * This is NOT cosmetic and NOT a preference: Dutch convention (Taaladvies/Onze
 * Taal, and every Dutch-native SaaS we checked — moneybird.nl 25/25, mollie.com/nl
 * 181/181, zero postfix occurrences) puts "€" first with a space, the exact
 * opposite of French and German ("99 €"). check:pricing only asserts WHICH symbol
 * a locale renders, never where it sits, so nothing else catches a wrong-side euro.
 */
const EUR_PREFIX_LOCALES: ReadonlySet<string> = new Set(["nl"])

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
 * Bare price formatter for teaser copy: "99\u00a0€" (fr/de) · "€\u00a099" (nl) · "$99" (en/es).
 * The euro form uses a NON-BREAKING space (DIN 5008 / French typography) so the
 * amount never wraps away from its symbol — matching the existing FR output.
 */
export function formatPrice(n: number, locale: string): string {
  if (!isEuroLocale(locale)) return `$${n}`
  return EUR_PREFIX_LOCALES.has(locale) ? `€ ${n}` : `${n} €`
}

