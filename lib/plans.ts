// Single source of truth for pricing. Mirrors the backend plan config in
// inc/plan_limits.php (SG_PLAN_DEFAULTS) + the Stripe/Neon stripe_price_map on
// the Replit app. If the backend plan limits change, update this file too.
//
// 2026-07-27 SG_PRICING_V2 — operator decisions + measured-cost repricing:
//  - Free plan RETIRED from sale (backend keeps SG_PLAN_DEFAULTS['free'] only
//    as the fallback for anonymous/unknown accounts — not a sellable tier).
//  - Entry price $49 -> $99. Credit grants re-derived off MEASURED per-credit
//    COGS after the engine repricing (8-engine perkw fell 205cr -> 70cr).
//    Grants hold ~70-81% margin at full burn: 12,000 / 30,000 / 80,000 / 130,000.
//  - Prompts per brand raised to 50 (100 on Scale), matching Peec (50 @ EUR85)
//    and Profound (50 @ $99) at the same price point.
//
// 2026-07-28 SG_PRICING_V2.1 — segment-pure ladders (operator-approved):
//  - Two tabs, three cards each, no tier appears where its story breaks:
//      Brands & consultants -> Starter · Consultant · Scale
//      Agencies             -> Growth · Scale · Enterprise
//  - Agency ladder repriced UP: Growth $499/mo ($4,788/yr), Scale $999/mo
//    ($9,588/yr). Rationale: $399 was ~$20/brand incl. white-label reports;
//    agencies bill clients $500-2k/mo for the same deliverable.
//  - Scale brand cap: 30 (was unlimited). 130k credits realistically support
//    ~25-40 brands at Scale-typical configs; "unlimited" was a promise the
//    credit pool couldn't keep, and it undercut the $1,500+ Enterprise floor.
//    Unlimited brands are now Enterprise-only.
//  - 7-day free trial (card required) on Starter and Growth: 25% of the
//    monthly credit grant + max 3 generated articles during trial, full grant
//    on first payment. T-24h renewal reminder email. No trial on Scale/Ent.
//  - `inheritsFrom` and `featured` are per-segment: a card must never
//    reference a tier the active tab doesn't show ("Everything in Growth,
//    plus:" on the Brands tab was the bug that forced this).

export type PlanId = "starter" | "consultant" | "pro" | "agency" | "scale" | "enterprise"

/** The two pricing-page tabs. Plans list every tab they appear under. */
export type PlanSegment = "brand" | "agency"

export type Plan = {
  id: PlanId
  /** which tabs render this plan as a card */
  segments: PlanSegment[]
  name: string
  /** monthly price in USD; null = custom/contact */
  priceMonthly: number | null
  /** annual price in USD (per year); null = custom/contact */
  priceYearly: number | null
  /** free-trial length in days (card required); undefined = no trial */
  trialDays?: number
  /** who it's for, one line (default; per-segment copy may override in messages) */
  tagline: string
  /** the five aligned quota rows shown on every card, in fixed order */
  quotas: {
    credits: string
    domains: string
    prompts: string
    engines: string
    scans: string
  }
  /** "Everything in {prev}, plus:" bullets (default; agency override in messages) */
  highlights: string[]
  /**
   * Carry-over line shown above highlights, PER SEGMENT — the named tier must
   * be a visible card on that tab, or the line reads as a broken reference.
   * null = base card of its ladder (self-contained highlights).
   */
  inheritsFrom: Record<PlanSegment, string | null>
  /** tabs on which this card is visually featured ("Most popular") */
  featured?: PlanSegment[]
  cta: { label: string; href: string }
}

const SIGNUP = "/app/?page=signup"
const BOOK_CALL = "https://calendly.com/samy-bensadok/30min-call"

export const PLANS: Plan[] = [
  {
    id: "starter",
    segments: ["brand"],
    name: "Starter",
    priceMonthly: 99,
    priceYearly: 948,
    trialDays: 7,
    tagline: "One brand, tracked properly.",
    quotas: {
      credits: "12,000 credits/mo",
      domains: "1 brand",
      prompts: "50 prompts/brand",
      engines: "3 engines",
      scans: "Weekly scans",
    },
    inheritsFrom: { brand: null, agency: null },
    highlights: [
      "3 engines: ChatGPT, Perplexity, Google AI Overviews",
      "50 tracked prompts",
      "Weekly automated scans",
      "GEO Scan, Agent Readiness & Content Analyzer",
      "180-day history",
    ],
    cta: { label: "Start 7-day free trial", href: SIGNUP },
  },
  {
    id: "consultant",
    segments: ["brand"],
    name: "Consultant",
    priceMonthly: 199,
    priceYearly: 1908,
    tagline: "Solo consultants running a handful of brands.",
    quotas: {
      credits: "30,000 credits/mo",
      domains: "5 brands",
      prompts: "50 prompts/brand",
      engines: "Pick 3 of 5 engines",
      scans: "Weekly scans",
    },
    inheritsFrom: { brand: "Starter", agency: null },
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
    id: "pro",
    segments: ["brand"],
    name: "Pro",
    priceMonthly: 399,
    priceYearly: 3828,
    trialDays: 7,
    // SG_PRO_TIER_V1 2026-07-28: brand-side depth tier filling the $199->$999
    // hole. All 8 engines on few brands; deliberately NO white-label or
    // unlimited seats so it cannot cannibalize Growth.
    tagline: "Every engine, full depth, for one team.",
    quotas: {
      credits: "50,000 credits/mo",
      domains: "5 brands",
      prompts: "100 prompts/brand",
      engines: "All 8 engines",
      scans: "Weekly scans",
    },
    inheritsFrom: { brand: "Consultant", agency: null },
    highlights: [
      "All 8 AI engines (+ Gemini, Claude, AI Mode)",
      "100 prompts/brand — double the tracking depth",
      "Ask GeoToolBox — AI analyst chat over your own data",
      "Article writing — ~30 articles/mo from your credits",
      "3 team seats",
    ],
    featured: ["brand"],
    cta: { label: "Start 7-day free trial", href: SIGNUP },
  },
  {
    id: "agency",
    segments: ["agency"],
    name: "Growth",
    priceMonthly: 499,
    priceYearly: 4788,
    trialDays: 7,
    tagline: "Agencies scaling across a client roster.",
    quotas: {
      credits: "80,000 credits/mo",
      domains: "20 client brands",
      prompts: "50 prompts/brand",
      engines: "Pick 5 of 8 engines",
      scans: "Weekly scans",
    },
    // Base card of the agency ladder — Consultant isn't on this tab, so the
    // highlights are self-contained (they fold in the Consultant-level tools).
    inheritsFrom: { brand: null, agency: null },
    highlights: [
      "Choose 5 of all 8 engines (+ Gemini, Claude, AI Mode)",
      "White-label client reports",
      "Ask GeoToolBox — AI analyst chat over your own data",
      "Content Studio, Citation Interceptor, Community & Actions",
      "Article writing — ~30 articles/mo from your credits",
      "Unlimited team seats · unlimited history",
    ],
    featured: ["agency"],
    cta: { label: "Start 7-day free trial", href: SIGNUP },
  },
  {
    id: "scale",
    segments: ["agency"],
    name: "Scale",
    priceMonthly: 999,
    priceYearly: 9588,
    tagline: "Every engine, every prompt, at full depth.",
    quotas: {
      credits: "130,000 credits/mo",
      domains: "30 brands",
      prompts: "100 prompts/brand",
      engines: "All 8 engines",
      scans: "Weekly scans · daily add-on",
    },
    inheritsFrom: { brand: null, agency: "Growth" },
    highlights: [
      "All 8 AI engines · 100 prompts/brand",
      "Article writing — ~60 articles/mo from your credits",
      "Ask GeoToolBox + white-label reports",
      "PR Coverage Tracker — which earned placements AI engines cite",
      "API & MCP access (coming soon)",
      "One-off GEO audit & strategy session (annual plans only)",
      "Priority support",
    ],
    cta: { label: "Get started", href: SIGNUP },
  },
  {
    id: "enterprise",
    segments: ["agency"],
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
    inheritsFrom: { brand: null, agency: "Scale" },
    highlights: [
      "Unlimited brands & prompts",
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
  { id: "pro", name: "Pro" },
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
      { label: "Monthly credits", values: ["—", "12,000", "30,000", "50,000", "80,000", "130,000"] },
      { label: "Brands / domains", values: ["—", "1", "5", "5", "20", "30"] },
      { label: "Prompts per brand", values: ["—", "50", "50", "100", "50", "100"] },
      { label: "Scan frequency", values: ["—", "Weekly", "Weekly", "Weekly", "Weekly", "Weekly + daily add-on"] },
      { label: "History retention", values: ["—", "180 days", "1 year", "1 year", "Unlimited", "Unlimited"] },
      { label: "Team seats", values: ["—", "1", "1", "3", "Unlimited", "Unlimited"] },
      { label: "Free trial", values: ["—", "7 days", "—", "7 days", "7 days", "—"] },
    ],
  },
  {
    group: "AI engines",
    rows: [
      { label: "Engines you can run", values: ["—", "3", "Pick 3 of 5", "All 8", "Pick 5 of 8", "All 8"] },
      { label: "ChatGPT", values: [Y, Y, Y, Y, Y, Y] },
      { label: "Perplexity", values: [N, Y, Y, Y, Y, Y] },
      { label: "Google AI Overviews", values: [N, Y, Y, Y, Y, Y] },
      { label: "Google AI Mode", values: [N, N, N, Y, Y, Y] },
      { label: "Bing Copilot", values: [N, N, Y, Y, Y, Y] },
      { label: "Grok", values: [N, N, Y, Y, Y, Y] },
      { label: "Gemini", values: [N, N, N, Y, Y, Y] },
      { label: "Claude", values: [N, N, N, Y, Y, Y] },
    ],
  },
  {
    group: "Tracking & analysis",
    rows: [
      { label: "Visibility tracker & share of voice", values: [Y, Y, Y, Y, Y, Y] },
      { label: "GEO Scan", values: [Y, Y, Y, Y, Y, Y] },
      { label: "Query Fan-Out analysis", values: [Y, Y, Y, Y, Y, Y] },
      { label: "Agent Readiness scan", values: [Y, Y, Y, Y, Y, Y] },
      { label: "Content Analyzer", values: [Y, Y, Y, Y, Y, Y] },
      { label: "Competitor Intel", values: [Y, Y, Y, Y, Y, Y] },
      { label: "Analytics (GSC + GA4 + AI traffic)", values: [Y, Y, Y, Y, Y, Y] },
      { label: "Domain Overview + Opportunities", values: [N, N, Y, Y, Y, Y] },
      { label: "Citation Interceptor", values: [N, N, Y, Y, Y, Y] },
      { label: "Community (Reddit & forum citations)", values: [N, N, Y, Y, Y, Y] },
      { label: "Ask GeoToolBox (AI analyst chat)", values: [N, N, N, Y, Y, Y] },
      { label: "PR Coverage Tracker", values: [N, N, N, N, N, Y] },
    ],
  },
  {
    group: "Content & strategy",
    rows: [
      { label: "Content Studio — SEO briefs", values: [N, N, "15/mo", "15/mo", Y, Y] },
      // SG_ARTICLE_REPRICE_V1 2026-07-27: articles now cost 250cr (was 1,000cr), so
      // these volumes sit at ~9-13% of each grant instead of 38-77%. Consultant gains
      // article access at 15/mo. Beyond these, articles simply draw on credits — extra
      // volume is a credit top-up, not a separate cap (no cap is enforced in code).
      { label: "AI article writing (5-stage)", values: [N, N, "15/mo", "30/mo", "30/mo", "60/mo"] },
      { label: "Actions: weekly prioritized to-do list", values: [N, N, Y, Y, Y, Y] },
      { label: "AI prompt suggestions", values: [N, N, Y, Y, Y, Y] },
      { label: "White-label client reports", values: [N, N, N, N, Y, Y] },
      { label: "One-off GEO audit & strategy", values: [N, N, N, N, N, Y] },
    ],
  },
  {
    group: "API & add-ons",
    rows: [
      { label: "API & MCP access", values: [N, N, N, N, N, "Coming soon"] },
      { label: "Daily automated scans", values: [N, N, N, N, N, "Add-on"] },
    ],
  },
  {
    group: "Support",
    rows: [
      { label: "Support", values: ["—", "Email", "Email", "Email", "Email", "Priority"] },
    ],
  },
]
