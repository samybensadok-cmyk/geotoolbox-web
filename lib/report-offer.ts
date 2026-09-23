/**
 * SG_REPORT_PUSH_V1 (2026-09-22) — single source for how the site describes the $1,250 AI + SEO
 * Visibility Report outside its own service pages (exit popup, article card, tools card).
 *
 * The wording is lifted from the Report tier on /services/generative-engine-optimization (the page
 * that sells it) so a visitor is never promised more here than the page they land on describes. If
 * that tier's summary/detail changes, change this file in the same commit.
 *
 * Destination is the service page's pricing section, NOT the bare checkout URL: a $1,250 one-off
 * bought cold from a popup is a refund request waiting to happen; the page answers "what exactly do
 * I get" first and carries the real buy button.
 *
 * EN only: /services/* is not localized. Every surface checks `locale === "en"` before rendering.
 */
export const REPORT_OFFER = {
  campaign: "report-2026-09",
  name: "AI + SEO Visibility Report",
  price: "$1,250",
  billing: "one-off",
  summary:
    "A one-off diagnostic that maps the buying-intent prompts in your market, who gets cited today across the AI engines, and the specific pages to build.",
  points: [
    "The buying-intent prompts in your market",
    "Who gets cited today across the AI engines",
    "The specific pages worth building next",
  ],
  href: "/services/generative-engine-optimization#pricing",
} as const
