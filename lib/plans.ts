// Single source of truth for pricing. Mirrors the backend plan config in
// inc/plan_limits.php (SG_PLAN_DEFAULTS) + SG_PLAN_PRICES_USD on the Replit app.
// If the backend plan limits change, update this file too.
// Annual = clean per-month rate billed yearly (~17-20% off monthly). Free was lowered to 1,000 credits +
// 5 prompts on 2026-06-06 for public-launch abuse control.

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
const SALES = "mailto:samy@geotoolbox.ai?subject=Enterprise%20inquiry"

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
      engines: "3 engines",
      scans: "Monthly scans",
    },
    inheritsFrom: null,
    highlights: [
      "GEO Scan (3 engines)",
      "AI visibility tracker",
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
    tagline: "Solo SEOs tracking a brand or two.",
    quotas: {
      credits: "3,000 credits/mo",
      domains: "2 brands",
      prompts: "10 prompts/brand",
      engines: "5 engines",
      scans: "Weekly scans",
    },
    inheritsFrom: "Free",
    highlights: [
      "Content Analyzer (grade any page)",
      "GEO Scan: 5 engines",
      "Weekly automated scans",
    ],
    cta: { label: "Get started", href: SIGNUP },
  },
  {
    id: "consultant",
    name: "Consultant",
    priceMonthly: 179,
    priceYearly: 1788,
    tagline: "Consultants and small teams running client work.",
    quotas: {
      credits: "25,000 credits/mo",
      domains: "5 brands",
      prompts: "15 prompts/brand",
      engines: "All 7 engines",
      scans: "Weekly scans",
    },
    inheritsFrom: "Starter",
    highlights: [
      "All 7 AI engines",
      "Content Studio",
      "Domain Overview + Opportunities",
      "AI advisor",
      "3 team seats",
    ],
    cta: { label: "Get started", href: SIGNUP },
    featured: true,
    badge: "Most popular",
  },
  {
    id: "agency",
    name: "Agency",
    priceMonthly: 349,
    priceYearly: 3468,
    tagline: "Agencies managing many brands.",
    quotas: {
      credits: "75,000 credits/mo",
      domains: "15 brands",
      prompts: "25 prompts/brand",
      engines: "All 7 engines",
      scans: "Weekly scans",
    },
    inheritsFrom: "Consultant",
    highlights: [
      "Article writing + 5-stage copywriter",
      "White-label reports",
      "Knowledge base",
      "Alerts",
      "5 team seats",
    ],
    cta: { label: "Get started", href: SIGNUP },
  },
  {
    id: "scale",
    name: "Scale",
    priceMonthly: 679,
    priceYearly: 6588,
    tagline: "High-volume teams and large portfolios.",
    quotas: {
      credits: "200,000 credits/mo",
      domains: "50 brands",
      prompts: "50 prompts/brand",
      engines: "All 7 engines",
      scans: "Daily scans",
    },
    inheritsFrom: "Agency",
    highlights: [
      "Daily automated scans",
      "API access",
      "Google Business Profile audit",
      "Priority support",
      "15 team seats",
    ],
    cta: { label: "Get started", href: SIGNUP },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceMonthly: null,
    priceYearly: null,
    tagline: "Custom contract, SLA, and security for large orgs.",
    quotas: {
      credits: "Custom credits",
      domains: "Unlimited brands",
      prompts: "Unlimited prompts",
      engines: "All 7 engines",
      scans: "Daily scans",
    },
    inheritsFrom: "Scale",
    highlights: [
      "Premium models",
      "SSO",
      "Dedicated CSM + 4h SLA",
      "Custom contract",
    ],
    cta: { label: "Talk to sales", href: SALES },
  },
]

// ---- Comparison table -------------------------------------------------------
// Columns are the 5 self-serve tiers; Enterprise is handled as a strip, not a
// column (per pricing-page best practice). Values map by PlanId order:
// [free, starter, consultant, agency, scale].
// Comparison columns = paid self-serve tiers only (Free is a standalone strip,
// Ahrefs-style). NOTE: each COMPARE_GROUPS row.values still has 5 entries in
// PlanId order [free, starter, consultant, agency, scale]; the table slices off
// the free value (index 0) at render so these stay in sync.
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
      { label: "Monthly credits", values: ["1,000", "3,000", "25,000", "75,000", "200,000"] },
      { label: "Brands / domains", values: ["1", "2", "5", "15", "50"] },
      { label: "Prompts per brand", values: ["5", "10", "15", "25", "50"] },
      { label: "Scan frequency", values: ["Monthly", "Weekly", "Weekly", "Weekly", "Daily"] },
      { label: "History retention", values: ["90 days", "180 days", "1 year", "Unlimited", "Unlimited"] },
      { label: "Team seats", values: ["1", "1", "3", "5", "15"] },
    ],
  },
  {
    group: "AI engines",
    rows: [
      { label: "ChatGPT", values: [Y, Y, Y, Y, Y] },
      { label: "Perplexity", values: [Y, Y, Y, Y, Y] },
      { label: "Google AI Overviews", values: [Y, Y, Y, Y, Y] },
      { label: "Gemini", values: [N, Y, Y, Y, Y] },
      { label: "Bing Copilot", values: [N, Y, Y, Y, Y] },
      { label: "Claude", values: [N, N, Y, Y, Y] },
      { label: "Grok", values: [N, N, Y, Y, Y] },
    ],
  },
  {
    group: "Tracking & analysis",
    rows: [
      { label: "Visibility tracker & share of voice", values: [Y, Y, Y, Y, Y] },
      { label: "Agent readiness scan", values: [Y, Y, Y, Y, Y] },
      { label: "Content Analyzer", values: [N, Y, Y, Y, Y] },
      { label: "GEO Scan", values: [Y, Y, Y, Y, Y] },
      { label: "Domain Overview + Opportunities", values: [N, N, Y, Y, Y] },
      { label: "Competitor intel", values: [N, N, Y, Y, Y] },
    ],
  },
  {
    group: "Content & reporting",
    rows: [
      { label: "Content Studio", values: [N, N, Y, Y, Y] },
      { label: "Article writing + 5-stage copywriter", values: [N, N, N, Y, Y] },
      { label: "White-label reports", values: [N, N, N, Y, Y] },
      { label: "Alerts", values: [N, N, N, Y, Y] },
    ],
  },
  {
    group: "Integrations & support",
    rows: [
      { label: "API access", values: [N, N, N, N, Y] },
      { label: "Google Business Profile audit", values: [N, N, N, N, Y] },
      { label: "Support", values: ["Email", "Email", "Email", "Email", "Priority"] },
    ],
  },
]
