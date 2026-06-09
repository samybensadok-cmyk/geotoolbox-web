// Single source of truth for pricing. Mirrors the backend plan config in
// inc/plan_limits.php (SG_PLAN_DEFAULTS) + SG_PLAN_PRICES_USD on the Replit app.
// If the backend plan limits change, update this file too.
//
// 2026-06-09 rewrite — aligned to the real backend after the per-tier engine
// model + competitive repricing:
//  - Per-tier engine model: free=ChatGPT only; starter=3 fixed; consultant=pick
//    3 of 5; agency=pick 5 of 7; scale/enterprise=all 7.
//  - Credits right-sized: 1k / 12k / 50k / 150k / 300k / 500k+.
//  - Starter is single-brand (depth, not breadth). Brands unlimited at Agency+.
//  - Team seats: 1 on Free/Starter/Consultant, unlimited on Agency+ (live 2026-06-09).
//  - Annual rates: Agency $299/mo, Scale $499/mo (monthly unchanged).
//  - Vaporware removed (white-label reports, KB, alerts, API, GBP audit, SSO,
//    CSM are NOT shipped yet) — see the roadmap; they return here as they ship.

export type PlanId = "free" | "starter" | "consultant" | "agency" | "scale" | "enterprise"

export type Plan = {
  id: PlanId
  name: string
  /** monthly price in USD; null = custom/contact */
  priceMonthly: number | null
  /** annual price in USD (per year); null = custom/contact */
  priceYearly: number | null
  /** who it's for, one line */
  tagline: string
  /** the five aligned quota rows shown on every card, in fixed order */
  quotas: {
    credits: string
    domains: string
    prompts: string
    engines: string
    scans: string
  }
  /** "Everything in {prev}, plus:" bullets (3-5) */
  highlights: string[]
  /** carry-over line shown above highlights (null for Free) */
  inheritsFrom: string | null
  cta: { label: string; href: string }
  featured?: boolean
  badge?: string
}

const SIGNUP = "/app/?page=signup"
const SALES = "/contact?topic=enterprise"

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    priceMonthly: 0,
    priceYearly: 0,
    tagline: "Kick the tires on AI visibility, no card required.",
    quotas: {
      credits: "1,000 credits/mo",
      domains: "1 brand",
      prompts: "5 prompts/brand",
      engines: "ChatGPT",
      scans: "Monthly scans",
    },
    inheritsFrom: null,
    highlights: [
      "Track ChatGPT visibility",
      "AI visibility tracker + share of voice",
      "Agent readiness scan",
      "AI-ready export",
    ],
    cta: { label: "Start free", href: SIGNUP },
  },
  {
    id: "starter",
    name: "Starter",
    priceMonthly: 49,
    priceYearly: 468,
    tagline: "Solo SEOs going deep on one brand.",
    quotas: {
      credits: "12,000 credits/mo",
      domains: "1 brand",
      prompts: "10 prompts/brand",
      engines: "3 engines",
      scans: "Weekly scans",
    },
    inheritsFrom: "Free",
    highlights: [
      "3 engines: ChatGPT, Perplexity, Google AI Overviews",
      "Content Analyzer (grade any page)",
      "Weekly automated scans",
      "180-day history",
    ],
    cta: { label: "Get started", href: SIGNUP },
  },
  {
    id: "consultant",
    name: "Consultant",
    priceMonthly: 179,
    priceYearly: 1788,
    tagline: "Solo consultants running multiple clients.",
    quotas: {
      credits: "50,000 credits/mo",
      domains: "5 brands",
      prompts: "15 prompts/brand",
      engines: "Pick 3 of 5 engines",
      scans: "Weekly scans",
    },
    inheritsFrom: "Starter",
    highlights: [
      "Choose your 3 engines (+ Bing, Grok)",
      "Content Studio",
      "Domain Overview + Opportunities",
      "Citation Intelligence",
      "Track 5 brands / clients",
    ],
    cta: { label: "Get started", href: SIGNUP },
    featured: true,
    badge: "Most popular",
  },
  {
    id: "agency",
    name: "Agency",
    priceMonthly: 349,
    priceYearly: 3588,
    tagline: "Agencies managing many brands.",
    quotas: {
      credits: "150,000 credits/mo",
      domains: "50 brands",
      prompts: "25 prompts/brand",
      engines: "Pick 5 of 7 engines",
      scans: "Weekly scans",
    },
    inheritsFrom: "Consultant",
    highlights: [
      "50 brands",
      "Choose 5 of all 7 engines (+ Gemini, Claude)",
      "Article writing + 5-stage copywriter",
      "Citation Intelligence",
      "Unlimited team seats",
    ],
    cta: { label: "Get started", href: SIGNUP },
  },
  {
    id: "scale",
    name: "Scale",
    priceMonthly: 679,
    priceYearly: 5988,
    tagline: "High-volume teams and large portfolios.",
    quotas: {
      credits: "300,000 credits/mo",
      domains: "Unlimited brands",
      prompts: "50 prompts/brand",
      engines: "All 7 engines",
      scans: "Daily scans",
    },
    inheritsFrom: "Agency",
    highlights: [
      "All 7 AI engines",
      "Daily automated scans",
      "One-off GEO audit & strategy session",
      "Priority support",
      "Unlimited brands & seats",
    ],
    cta: { label: "Get started", href: SIGNUP },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceMonthly: null,
    priceYearly: null,
    tagline: "From $999/mo — custom contract, SLA, and security for large orgs.",
    quotas: {
      credits: "Custom credits",
      domains: "Unlimited brands",
      prompts: "Unlimited prompts",
      engines: "All 7 engines",
      scans: "Daily scans",
    },
    inheritsFrom: "Scale",
    highlights: [
      "Quarterly GEO audit & strategy + QBR",
      "Dedicated customer success manager",
      "SSO, security review & SLA",
      "Custom contract & invoicing",
    ],
    cta: { label: "Talk to sales", href: SALES },
  },
]

// ---- Comparison table -------------------------------------------------------
// Columns are the 4 paid self-serve tiers; Free is a standalone strip and
// Enterprise a separate strip (per pricing-page best practice). NOTE: each
// COMPARE_GROUPS row.values has 5 entries in PlanId order
// [free, starter, consultant, agency, scale]; the table slices off the free
// value (index 0) at render, so these stay in sync.
export const COMPARE_COLUMNS: { id: PlanId; name: string }[] = [
  { id: "starter", name: "Starter" },
  { id: "consultant", name: "Consultant" },
  { id: "agency", name: "Agency" },
  { id: "scale", name: "Scale" },
]

type Row = { label: string; values: (string | boolean)[] }
export type CompareGroup = { group: string; rows: Row[] }

const Y = true
const N = false

export const COMPARE_GROUPS: CompareGroup[] = [
  {
    group: "Usage & limits",
    rows: [
      { label: "Monthly credits", values: ["1,000", "12,000", "50,000", "150,000", "300,000"] },
      { label: "Brands / domains", values: ["1", "1", "5", "50", "Unlimited"] },
      { label: "Prompts per brand", values: ["5", "10", "15", "25", "50"] },
      { label: "Scan frequency", values: ["Monthly", "Weekly", "Weekly", "Weekly", "Daily"] },
      { label: "History retention", values: ["90 days", "180 days", "1 year", "Unlimited", "Unlimited"] },
      { label: "Team seats", values: ["1", "1", "1", "Unlimited", "Unlimited"] },
    ],
  },
  {
    group: "AI engines",
    rows: [
      { label: "Engines you can run", values: ["ChatGPT only", "3", "Pick 3 of 5", "Pick 5 of 7", "All 7"] },
      { label: "ChatGPT", values: [Y, Y, Y, Y, Y] },
      { label: "Perplexity", values: [N, Y, Y, Y, Y] },
      { label: "Google AI Overviews", values: [N, Y, Y, Y, Y] },
      { label: "Bing Copilot", values: [N, N, Y, Y, Y] },
      { label: "Grok", values: [N, N, Y, Y, Y] },
      { label: "Gemini", values: [N, N, N, Y, Y] },
      { label: "Claude", values: [N, N, N, Y, Y] },
    ],
  },
  {
    group: "Tracking & analysis",
    rows: [
      { label: "Visibility tracker & share of voice", values: [Y, Y, Y, Y, Y] },
      { label: "Agent readiness scan", values: [Y, Y, Y, Y, Y] },
      { label: "GEO Scan", values: [Y, Y, Y, Y, Y] },
      { label: "Content Analyzer", values: [N, Y, Y, Y, Y] },
      { label: "Domain Overview + Opportunities", values: [N, N, Y, Y, Y] },
      { label: "Citation Intelligence", values: [N, N, Y, Y, Y] },
    ],
  },
  {
    group: "Content & strategy",
    rows: [
      { label: "Content Studio", values: [N, N, Y, Y, Y] },
      { label: "Article writing + 5-stage copywriter", values: [N, N, N, Y, Y] },
      { label: "One-off GEO audit & strategy", values: [N, N, N, N, Y] },
    ],
  },
  {
    group: "Support",
    rows: [
      { label: "Support", values: ["Community", "Email", "Email", "Email", "Priority"] },
    ],
  },
]
