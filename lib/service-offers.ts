// Done-for-you GEO service prices (USD). Single source for the /services/generative-engine-optimization
// tiers and the homepage "Done for you" strip, so the two can't drift apart. The Sprint and the
// retainer are "from" prices set on a call; the Report is a fixed one-off (direct checkout).
export const GEO_SERVICE_PRICES = {
  report: 1250,
  sprintFrom: 6500,
  retainerFromMonthly: 5000,
} as const

/** "$1,250": the services pages are English-only and priced in USD. */
export const usd = (n: number) => `$${n.toLocaleString("en-US")}`
