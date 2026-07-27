// Single source of truth for pricing. Mirrors the backend plan config in
// inc/plan_limits.php (SG_PLAN_DEFAULTS) + SG_PLAN_PRICES_USD on the Replit app.
// If the backend plan limits change, update this file too.
//
// 2026-06-09 rewrite — aligned to the real backend after the per-tier engine
// model + competitive repricing:
//  - Per-tier engine model: free=ChatGPT only; starter=3 fixed; consultant=pick
//    3 of 5; agency=pick 5 of 8; scale/enterprise=all 8 (AI Mode added as 8th engine).
//  - Credits right-sized: 1k / 12k / 50k / 150k / 300k / 500k+.
//  - Starter is single-brand (depth, not breadth). Brands unlimited at Agency+.
//  - Team seats: 1 on Free/Starter/Consultant, unlimited on Agency+ (live 2026-06-09).
//  - Annual rates: Agency $299/mo, Scale $499/mo (monthly unchanged).
//  - Vaporware removed (white-label reports, KB, alerts, GBP audit, SSO,
//    CSM are NOT shipped yet) — see the roadmap; they return here as they ship.
//
// 2026-06-10 additions:
//  - API & MCP access shown on Scale/Enterprise as "coming soon" (explicit
//    operator call — sells the roadmap on the top tiers).
//  - Daily automated scans are NO LONGER included free on Scale/Enterprise —
//    they're a paid add-on available on those two tiers only. Backend
//    scan_frequency for scale/enterprise must follow when the add-on ships.
//
// 2026-07-17: White-Label Reports + Ask GeoToolBox are now SHIPPED (Growth+).
//   The 2026-06-09 "vaporware removed … NOT shipped yet" note above is
//   historical — both are live and reflected in the PLANS highlights +
//   COMPARE_GROUPS below.

// 2026-07-27 SG_PRICING_V2 — operator decisions + measured-cost repricing.
//  - Entry price $49 -> $99. Free plan RETIRED from sale (the backend
//    SG_PLAN_DEFAULTS['free'] entry is deliberately kept as the fallback for
//    anonymous/unknown accounts — it is no longer a sellable tier).
//  - Prices: Starter $99/$948 · Consultant $199/$1908 · Growth $399/$3828 ·
//    Scale $699/$6708. Annual ~20% off.
//  - Credit grants re-derived off MEASURED per-credit COGS after the engine
//    repricing (8-engine perkw fell 205cr -> 70cr). Grants hold ~70-81% margin
//    at full burn: 12,000 / 30,000 / 80,000 / 130,000.
//  - Prompts per brand raised to 50 (100 on Scale), matching Peec (50 @ EUR85)
//    and Profound (50 @ $99) at the same price point.
//  - `segment` drives the Brands / Agencies tabs on the pricing page. Tiers
//    marked "both" appear under either tab with tab-appropriate framing.

export type PlanId = "starter" | "consultant" | "agency" | "scale" | "enterprise"

/** Which pricing tab a plan appears under. "both" renders in each. */
export type PlanSegment = "brand" | "agency" | "both"

export type Plan = {
  id: PlanId
  segment: PlanSegment
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
const BOOK_CALL = "https://calendly.com/samy-bensadok/30min-call"

export const PLANS: Plan[] = [
  {
    id: "starter",
    segment: "brand",
    name: "Starter",
    priceMonthly: 99,
    priceYearly: 948,
    tagline: "One brand, tracked properly.",
    quotas: {
      credits: "12,000 credits/mo",
      domains: "1 brand",
      prompts: "50 prompts/brand",
      engines: "3 engines",
      scans: "Weekly scans",
    },
    inheritsFrom: null,
    highlights: [
      "3 engines: ChatGPT, Perplexity, Google AI Overviews",
      "50 tracked prompts",
      "Weekly automated scans",
      "GEO Scan, Agent Readiness & Content Analyzer",
      "180-day history",
    ],
    cta: { label: "Get started", href: SIGNUP },
  },
  {
    id: "consultant",
    segment: "both",
    name: "Consultant",
    priceMonthly: 199,
    priceYearly: 1908,
    tagline: "Solo consultants running multiple clients.",
    quotas: {
      credits: "30,000 credits/mo",
      domains: "5 brands",
      prompts: "50 prompts/brand",
      engines: "Pick 3 of 5 engines",
      scans: "Weekly scans",
    },
    // null, not "Starter" — Starter (like Free) is filtered out of CARD_TIERS and only
    // appears as a one-line strip below the cards, so "Everything in Starter, plus:"
    // would reference a card the visitor never saw. Consultant is the first full card.
    inheritsFrom: null,
    highlights: [
      "Choose your 3 engines (+ Bing, Grok)",
      "Content Studio — 15 SEO briefs/mo",
      "Domain Overview + Opportunities",
      "Citation Interceptor — offsite citation gaps",
      "Community: Reddit & forum AI citations",
      "Actions: weekly prioritized to-do list",
    ],
    cta: { label: "Get started", href: SIGNUP },
  },
  {
    id: "agency",
    segment: "agency",
    name: "Growth",
    priceMonthly: 399,
    priceYearly: 3828,
    tagline: "Agencies scaling across a client roster.",
    quotas: {
      credits: "80,000 credits/mo",
      domains: "20 client brands",
      prompts: "50 prompts/brand",
      engines: "Pick 5 of 8 engines",
      scans: "Weekly scans",
    },
    inheritsFrom: "Consultant",
    highlights: [
      "Ask GeoToolBox — AI analyst chat over your own data",
      "Choose 5 of all 8 engines (+ Gemini, Claude, AI Mode)",
      "Article writing — ~30 articles/mo from your credits (5-stage copywriter)",
      "White-label client reports",
      "Unlimited history retention",
      "Unlimited team seats",
    ],
    cta: { label: "Get started", href: SIGNUP },
    featured: true,
    badge: "Most popular",
  },
  {
    id: "scale",
    segment: "both",
    name: "Scale",
    priceMonthly: 699,
    priceYearly: 6708,
    tagline: "High-volume teams and large portfolios.",
    quotas: {
      credits: "130,000 credits/mo",
      domains: "Unlimited brands",
      prompts: "100 prompts/brand",
      engines: "All 8 engines",
      scans: "Weekly scans · daily add-on",
    },
    inheritsFrom: "Growth",
    highlights: [
      "Article writing — ~60 articles/mo from your credits",
      "PR Coverage Tracker — see which earned placements AI engines cite",
      "All 8 AI engines",
      "API & MCP access (coming soon)",
      "One-off GEO audit & strategy session (annual plans only)",
      "Priority support",
      "Unlimited brands & seats",
    ],
    cta: { label: "Get started", href: SIGNUP },
  },
  {
    id: "enterprise",
    segment: "both",
    name: "Enterprise",
    priceMonthly: null,
    priceYearly: null,
    tagline: "Custom contract, premium models, SSO and SLA for large orgs.",
    quotas: {
      credits: "Custom credit volume",
      domains: "Unlimited brands",
      prompts: "Unlimited prompts",
      engines: "All 8 + premium models",
      scans: "Weekly scans · daily add-on",
    },
    inheritsFrom: "Scale",
    highlights: [
      "Premium frontier models (top-tier GPT, Claude & Gemini)",
      "Unlimited article generation",
      "Custom features & integrations built for your team",
      "Dedicated CSM + quarterly GEO strategy & QBR",
      "SSO / SAML, security review, DPA & 4-hour SLA",
      "Audit log, GDPR data export/erasure, per-tenant rate limits",
      "Priority API & MCP access",
      "White-glove onboarding & team training",
      "Custom contract, invoicing, PO & net terms",
    ],
    cta: { label: "Book a call", href: BOOK_CALL },
  },
]

// ---- Comparison table -------------------------------------------------------
// Columns are the 4 paid self-serve tiers; Enterprise is a separate strip.
//
// ⚠️ Each COMPARE_GROUPS row.values still has 5 entries and index 0 is a RETIRED
// placeholder (formerly Free). The table slices index 0 off at render, and
// components/pricing/comparison-table.tsx merges localized labels with these rows
// BY INDEX — so the row count and order must not change without updating
// messages/en.json + messages/fr.json in lockstep. Index 0 is kept as "—" rather
// than removed precisely to avoid that desync. (SG_PRICING_V2 2026-07-27)
export const COMPARE_COLUMNS: { id: PlanId; name: string }[] = [
  { id: "starter", name: "Starter" },
  { id: "consultant", name: "Consultant" },
  { id: "agency", name: "Growth" },
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
      { label: "Monthly credits", values: ["—", "12,000", "30,000", "80,000", "130,000"] },
      { label: "Brands / domains", values: ["—", "1", "5", "20", "Unlimited"] },
      { label: "Prompts per brand", values: ["—", "50", "50", "50", "100"] },
      { label: "Scan frequency", values: ["Monthly", "Weekly", "Weekly", "Weekly", "Weekly + daily add-on"] },
      { label: "History retention", values: ["90 days", "180 days", "1 year", "Unlimited", "Unlimited"] },
      { label: "Team seats", values: ["1", "1", "1", "Unlimited", "Unlimited"] },
    ],
  },
  {
    group: "AI engines",
    rows: [
      { label: "Engines you can run", values: ["—", "3", "Pick 3 of 5", "Pick 5 of 8", "All 8"] },
      { label: "ChatGPT", values: [Y, Y, Y, Y, Y] },
      { label: "Perplexity", values: [N, Y, Y, Y, Y] },
      { label: "Google AI Overviews", values: [N, Y, Y, Y, Y] },
      { label: "Google AI Mode", values: [N, N, N, Y, Y] },
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
      { label: "GEO Scan", values: [Y, Y, Y, Y, Y] },
      { label: "Query Fan-Out analysis", values: [Y, Y, Y, Y, Y] },
      { label: "Agent Readiness scan", values: [Y, Y, Y, Y, Y] },
      { label: "Content Analyzer", values: [Y, Y, Y, Y, Y] },
      { label: "Competitor Intel", values: [Y, Y, Y, Y, Y] },
      { label: "Analytics (GSC + GA4 + AI traffic)", values: [Y, Y, Y, Y, Y] },
      { label: "Domain Overview + Opportunities", values: [N, N, Y, Y, Y] },
      { label: "Citation Interceptor", values: [N, N, Y, Y, Y] },
      { label: "Community (Reddit & forum citations)", values: [N, N, Y, Y, Y] },
      { label: "Ask GeoToolBox (AI analyst chat)", values: [N, N, N, Y, Y] },
      { label: "PR Coverage Tracker", values: [N, N, N, N, Y] },
    ],
  },
  {
    group: "Content & strategy",
    rows: [
      { label: "Content Studio — SEO briefs", values: [N, N, "15/mo", Y, Y] },
      // SG_ARTICLE_REPRICE_V1 2026-07-27: articles now cost 250cr (was 1,000cr), so
      // these volumes sit at ~9-13% of each grant instead of 38-77%. Consultant gains
      // article access at 15/mo. Beyond these, articles simply draw on credits — extra
      // volume is a credit top-up, not a separate cap (no cap is enforced in code).
      { label: "AI article writing (5-stage)", values: [N, N, "15/mo", "30/mo", "60/mo"] },
      { label: "Actions: weekly prioritized to-do list", values: [N, N, Y, Y, Y] },
      { label: "AI prompt suggestions", values: [N, N, Y, Y, Y] },
      { label: "White-label client reports", values: [N, N, N, Y, Y] },
      { label: "One-off GEO audit & strategy", values: [N, N, N, N, Y] },
    ],
  },
  {
    group: "API & add-ons",
    rows: [
      { label: "API & MCP access", values: [N, N, N, N, "Coming soon"] },
      { label: "Daily automated scans", values: [N, N, N, N, "Add-on"] },
    ],
  },
  {
    group: "Support",
    rows: [
      { label: "Support", values: ["Community", "Email", "Email", "Email", "Priority"] },
    ],
  },
]
