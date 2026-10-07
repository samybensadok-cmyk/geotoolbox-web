/**
 * proof-stats.ts — single source of truth for the live proof numbers shown on
 * the service pages. Every surface (ProofResults band, GrowthCharts, hero
 * phrasing, case study, FAQ, OG images) reads from here so no number can drift.
 *
 * AS OF 2026-07-31 the Google figures are AUTOMATED: a 48h GitHub Action
 * (`.github/workflows/update-proof-stats.yml` → `scripts/update-proof-stats.mjs`)
 * regenerates `proof-stats.generated.json` from the Search Console API and the
 * push redeploys the site. DO NOT hand-edit the Google numbers here — they come
 * from the JSON. Manual fields (Bing AI-citations, weeksToResult) remain below
 * with their own "as of" stamp.
 *
 * PROVENANCE — read before editing:
 *  - `google.*` → Google Search Console API for the geotoolbox.ai test domain.
 *    Real, unique, verifiable, EXACT counts (25k-row pagination, no Looker 1M-row
 *    cap). rankedKeywords/top10/top3 are unique queries over a TRAILING 28 full
 *    days ending 3 days back (never calendar month-to-date, which would reset to
 *    ~0 every 1st). Always framed as "in Google" / "ranked in Google".
 *  - `impressions` → `perDay` is Google-only while `source === "google"`; it
 *    becomes a Google+Bing blend automatically when the BING_WMT_API_KEY secret
 *    is configured (`source === "google+bing"`). Surfaces MUST label the figure
 *    from `source` — never hardcode "Google + Bing (combined)".
 *  - `aiCitations.total` → Bing Webmaster Tools "AI Performance" report. Total
 *    citation APPEARANCES over the report's 3-month view across Microsoft Copilot
 *    and partner AI assistants — a SAMPLE, NOT unique citations. NEVER attribute
 *    this number to ChatGPT / Perplexity / Google. MANUAL: that report has no
 *    public API (confirmed 2026-07-31; on Microsoft's backlog) — bump it by hand
 *    and update `aiCitations.asOf` at the same time.
 *  - `googleAiFeatures.impressions` → Google Search Console "Generative AI
 *    features" (Beta) report: appearances of our links INSIDE AI Overviews /
 *    AI Mode over the report's 3-month view. Google-side, Google-labelled — never
 *    blended with the Bing sample and never called "citations". MANUAL: not
 *    exposed by the Search Console API (searchAppearance returns no AI rows,
 *    verified 2026-08-28).
 *  - `weeksToResult` → TIME TO FIRST MEANINGFUL AI CITATION only. It is NOT a
 *    label for the Bing appearance total, and the Google totals were produced by
 *    about 7 weeks of active content publishing (domain indexed since April 2026,
 *    near-zero traffic until publishing began).
 */
import generated from "./proof-stats.generated.json"
import contentGenerated from "./content-counts.generated.json"

// The API window ends 3 days before the run (GSC lag) — see
// scripts/update-proof-stats.mjs. `asOf` is the RUN date, so surfaces that
// state the window end must use this, not `asOf`.
const windowEnd = new Date(Date.parse(generated.generatedAt) - 3 * 86400e3)
  .toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })

export const proofStats = {
  // Automated — regenerated every 48h from the Search Console API.
  asOf: generated.asOf,
  google: {
    rankedKeywords: generated.google.rankedKeywords,
    top10: generated.google.top10,
    top3: generated.google.top3,
    dailyImpressions: generated.impressions.perDay,
    windowDays: generated.google.windowDays,
    windowEnd,
  },
  impressions: {
    perDay: generated.impressions.perDay,
    source: generated.impressions.source as "google" | "google+bing",
  },
  monthly: generated.monthly,

  // Manual — Bing WMT "AI Performance" has no public API; bump by hand and
  // update `asOf` here in the same edit. Since 2026-10-07 this is the report's
  // "3 M" view (operator call: the 3-month total, not the 30 D view). The
  // window is stated on every surface via `windowLabel`; never call it trailing
  // 30 days. 30 D on the same read was 92.4K (7 Sep – 4 Oct), avg 73 pages.
  aiCitations: {
    total: 270800,
    avgCitedPages: 48,
    windowDays: 90,
    windowLabel: "3 months (7 Jul – 4 Oct 2026)",
    source: "Microsoft Copilot and partners",
    sampled: true,
    asOf: "7 Oct 2026",
  },
  // Manual — Google Search Console "Generative AI features" (Beta) report:
  // impressions where a geotoolbox.ai link appeared INSIDE a Google AI answer
  // (AI Overviews + AI Mode). This is the Google-side counterpart to the Bing
  // figure above and must never be merged with it or with `impressions.perDay`
  // (which is all-of-Search, AI features included).
  //   - An impression = the link was shown in the AI answer; for AI Overviews
  //     Google only counts it once the link is actually visible (i.e. after the
  //     user expands, when expansion is required). It is an APPEARANCE, not a
  //     click, and not "unique citations".
  //   - NOT available from the Search Console API: the `searchAppearance`
  //     dimension returns no AI-feature rows for this property (verified
  //     2026-08-28), so the automation script cannot pick it up. Hand-read from
  //     the GSC UI; bump `asOf` in the same edit, like the Bing field.
  //   - Since 2026-10-07 this is the report's "3 months" view (5 Jul – 4 Oct
  //     2026). The report gives no comparable preceding 3-month figure, so no
  //     growth multiple is published (the old 28-day `prevImpressions` is gone).
  googleAiFeatures: {
    impressions: 597000,
    windowDays: 92,
    windowLabel: "3 months (5 Jul – 4 Oct 2026)",
    surfaces: "AI Overviews + AI Mode",
    source: "Google Search Console · Generative AI features (Beta)",
    asOf: "7 Oct 2026",
  },
  // Top buying-intent grounding query from Bing WMT "AI Performance" — an
  // appearance count in Bing's AI Performance report, NOT unique citations.
  topGroundingQuery: {
    query: "evaluate AI visibility tracking platforms",
    appearances: 13400,
    windowLabel: "3 months (7 Jul – 4 Oct 2026)",
    source: "Bing WMT AI Performance",
  },
  // Manual — Google Analytics 4 Home card for geotoolbox.ai, "Last 30 days"
  // against the preceding 30 days (the comparison GA4 itself renders). SITE
  // ANALYTICS, not Search Console: `activeUsers` is all traffic sources, so it
  // is never presented as organic, as Google-only, or next to the GSC figures
  // as if it were the same funnel. Read by hand off the dashboard with the
  // receipt screenshot; bump `asOf` and swap the PNG in the same edit.
  ga4: {
    activeUsers: "5.4k",
    activeUsersChangePct: 114.3,
    events: "24k",
    keyEvents: 17,
    windowDays: 30,
    asOf: "28 Aug 2026",
  },
  // TIME TO FIRST MEANINGFUL AI CITATION only — NOT a label for the Bing total.
  weeksToResult: 7,
} as const

export type ProofStats = typeof proofStats

// Published content counts — AUTOMATED as of 2026-08-28: `scripts/count-content
// .mjs` runs on npm `prebuild` (so every Vercel build recounts) and writes
// `content-counts.generated.json`. Counting rule mirrors `getAllPosts()`:
// .mdx minus draft minus noindex — what a visitor can actually reach.
// DO NOT hand-edit these numbers; fix the script if a count looks wrong.
// `totalArticles` is the blog total across the three counted locales.
export const contentCounts = {
  en: contentGenerated.en,
  fr: contentGenerated.fr,
  es: contentGenerated.es,
  totalArticles: contentGenerated.en + contentGenerated.fr + contentGenerated.es,
  asOf: contentGenerated.asOf,
} as const
