/**
 * proof-stats.ts — single source of truth for the live proof numbers shown on
 * the Done-For-You service page (/services/ai-seo-agency). A daily bump is ONE
 * edit here; every surface (ProofResults table, hero rounded phrasing, case
 * study, FAQ) reads from this file so no number can drift.
 *
 * PROVENANCE — read before editing:
 *  - `google.*`  → Google Search Console for the geotoolbox.ai test domain.
 *    Real, unique, verifiable. A fresh zero-authority domain, ~7 weeks of
 *    publishing. Always framed as "in Google" / "ranked in Google". The public
 *    proof surfaces lead with `top10` (keywords on Google's first page).
 *  - `aiCitations.total` → Bing Webmaster Tools "AI Performance" report. This is
 *    total citation APPEARANCES over a trailing 30-day window across Microsoft
 *    Copilot and partner AI assistants — a SAMPLE, NOT unique citations. NEVER
 *    attribute this number to ChatGPT / Perplexity / Google. Always footnote the
 *    source and the "sampled, non-unique appearance count" caveat.
 *  - `weeksToResult` → TIME TO FIRST MEANINGFUL AI CITATION only. It is NOT a
 *    label for the Bing appearance total. The Google totals were produced by
 *    about 7 weeks of active CONTENT (blog) publishing (the domain was indexed
 *    since April 2026 but drove near-zero traffic until publishing began), so
 *    "about 7 weeks of content publishing" is the correct anchor for the Google
 *    figures (rankedKeywords, top10). The Bing `aiCitations.total` is a SEPARATE
 *    trailing 30-day report window (a recent-activity snapshot that refreshes
 *    daily) — keep it decoupled from the 7-week build story; describe it as a
 *    trailing 30-day sample, never as citations earned "in 7 weeks".
 */

export const proofStats = {
  asOf: "26 Jul 2026",
  // Google Search Console — verifiable, unique. Fresh zero-authority domain
  // (indexed since April 2026, near-zero traffic until publishing began);
  // about 7 weeks of active content publishing produced these Google figures.
  // NOTE: `dailyImpressions` is a Google + Bing BLENDED daily figure — do NOT
  // recompute it from GSC alone (GSC-only is materially lower). Bump only from
  // the combined dashboard.
  google: { rankedKeywords: 6416, top10: 2274, top3: 332, dailyImpressions: 9400 },
  // Bing Webmaster Tools "AI Performance" — Microsoft Copilot + partner AI assistants.
  // NOTE: total citation APPEARANCES over a trailing 30 days, a SAMPLE, NOT unique citations.
  aiCitations: {
    total: 13400,
    avgCitedPages: 24,
    windowDays: 30,
    source: "Microsoft Copilot and partners",
    sampled: true,
  },
  // Top buying-intent grounding query from Bing WMT "AI Performance" — an
  // appearance count in Bing's AI Performance report, NOT unique citations.
  topGroundingQuery: {
    query: "best tools for Search Generative Experience",
    appearances: 1200,
    source: "Bing WMT AI Performance",
  },
  // TIME TO FIRST MEANINGFUL AI CITATION only — NOT a label for the Bing total.
  // The Bing appearance total is a separate trailing 30-day report window.
  weeksToResult: 7,
} as const

export type ProofStats = typeof proofStats

// Published content counts — counted on disk (content/blog, content/fr/blog,
// content/glossary). Shared by /services/ai-automation-agency (page + OG image)
// so the figures can't drift between surfaces. Re-count when bumping.
export const contentCounts = { en: 120, fr: 50, glossary: 57, asOf: "26 Jul 2026" } as const
