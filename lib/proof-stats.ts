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
 *    citation APPEARANCES over a trailing 30-day window across Microsoft Copilot
 *    and partner AI assistants — a SAMPLE, NOT unique citations. NEVER attribute
 *    this number to ChatGPT / Perplexity / Google. MANUAL: that report has no
 *    public API (confirmed 2026-07-31; on Microsoft's backlog) — bump it by hand
 *    and update `aiCitations.asOf` at the same time.
 *  - `weeksToResult` → TIME TO FIRST MEANINGFUL AI CITATION only. It is NOT a
 *    label for the Bing appearance total, and the Google totals were produced by
 *    about 7 weeks of active content publishing (domain indexed since April 2026,
 *    near-zero traffic until publishing began).
 */
import generated from "./proof-stats.generated.json"

export const proofStats = {
  // Automated — regenerated every 48h from the Search Console API.
  asOf: generated.asOf,
  google: {
    rankedKeywords: generated.google.rankedKeywords,
    top10: generated.google.top10,
    top3: generated.google.top3,
    dailyImpressions: generated.impressions.perDay,
    windowDays: generated.google.windowDays,
  },
  impressions: {
    perDay: generated.impressions.perDay,
    source: generated.impressions.source as "google" | "google+bing",
  },
  monthly: generated.monthly,

  // Manual — Bing WMT "AI Performance" has no public API; bump by hand and
  // update `asOf` here in the same edit.
  aiCitations: {
    total: 14000,
    avgCitedPages: 25,
    windowDays: 30,
    source: "Microsoft Copilot and partners",
    sampled: true,
    asOf: "27 Jul 2026",
  },
  // Top buying-intent grounding query from Bing WMT "AI Performance" — an
  // appearance count in Bing's AI Performance report, NOT unique citations.
  topGroundingQuery: {
    query: "best tools for Search Generative Experience",
    appearances: 1200,
    source: "Bing WMT AI Performance",
  },
  // TIME TO FIRST MEANINGFUL AI CITATION only — NOT a label for the Bing total.
  weeksToResult: 7,
} as const

export type ProofStats = typeof proofStats

// Published content counts — counted on disk (content/blog, content/fr/blog,
// content/glossary). Shared by /services/ai-automation-agency (page + OG image)
// so the figures can't drift between surfaces. Re-count when bumping.
export const contentCounts = { en: 121, fr: 50, glossary: 57, asOf: "27 Jul 2026" } as const
