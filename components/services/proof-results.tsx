import { proofStats } from "@/lib/proof-stats"
import { GrowthCharts } from "@/components/services/growth-charts"

/**
 * ProofResults — the hard-numbers proof band for the Done-For-You service page.
 * Reads EVERY figure from lib/proof-stats.ts (single source of truth) so a daily
 * bump is one edit and the "as of" stamp never drifts from the numbers.
 *
 * Rendered as a dark (gray-950) band for contrast + impact, matching the site's
 * dark anchor sections (Problem / CTA on the homepage). Big mono numbers, tight
 * labels, an explicit source line under each stat, no gradient text.
 *
 * Provenance is stated plainly: the Google numbers are real + unique (GSC) and
 * came from about `weeksToResult` weeks of publishing; the AI-citation number is
 * a sampled, non-unique appearance count from a SEPARATE `windowDays`-day
 * Bing Webmaster Tools window — never umbrella'd under the Google timeframe, and
 * never dressed up as ChatGPT / Perplexity / Google data. The AI-answer figures
 * are TWO separate stats from TWO engines — Google's "Generative AI features"
 * impressions (AI Overviews + AI Mode) and the Bing sample — each labelled with
 * its own engine and window, never summed and never blended.
 */
export function ProofResults() {
  const { google, aiCitations, googleAiFeatures, impressions, weeksToResult, asOf } = proofStats
  const fmt = (n: number) => n.toLocaleString("en-US")
  const blended = impressions.source === "google+bing"
  // Derived from the report's own Compare view — never hardcoded.
  const aiGrowth = Math.round(googleAiFeatures.impressions / googleAiFeatures.prevImpressions)

  const stats: Array<{ value: string; label: string; source: string; tag?: string }> = [
    {
      value: fmt(google.rankedKeywords),
      label: "Keywords ranked in Google",
      source: `Google Search Console · ${google.windowDays}-day window`,
    },
    {
      value: fmt(google.top10),
      label: "On Google's first page (top 10)",
      source: `Google Search Console · ${google.windowDays}-day window`,
    },
    {
      value: fmt(googleAiFeatures.impressions),
      label: "Appearances inside Google's AI answers",
      source: `Google Search Console · ${googleAiFeatures.surfaces} · ${googleAiFeatures.windowDays}-day window`,
      tag: `${aiGrowth}× in ${googleAiFeatures.windowDays} days`,
    },
    {
      value: `~${fmt(aiCitations.total)}`,
      label: "AI-citation appearances in Bing",
      source: `Bing WMT · ${aiCitations.source} · ${aiCitations.windowDays}-day sample`,
      tag: `${aiCitations.windowDays}-day sample`,
    },
    {
      value: `~${fmt(impressions.perDay)}`,
      label: blended ? "Impressions per day" : "Google impressions per day",
      source: blended ? "Google + Bing (combined)" : `Google Search Console · ${google.windowDays}-day avg`,
      ...(blended ? { tag: "combined" } : {}),
    },
  ]

  return (
    <section id="results" className="scroll-mt-24 relative overflow-hidden bg-gray-950 px-6 py-20 sm:py-24">
      {/* Subtle grid bleed — anchors the dark panel without a gradient blob */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Editorial header — asymmetric, left-aligned. NOTE: the "~N weeks of
            publishing" claim scopes ONLY to the Google figures; the Bing sample
            is decoupled in the subhead and tagged per-stat below. */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[5fr_7fr] lg:items-end lg:gap-16">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-400">
              The proof, from our own test domain
            </p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              One fresh, zero-authority domain.{" "}
              <span className="text-accent-400">The receipts, by source.</span>
            </h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-gray-300">
            These are the numbers, not a promise — the exact figures, stamped, and updated as they move.
            The Google ranking figures came from about {weeksToResult}{" "}
            weeks of publishing on a domain
            that drove near-zero traffic before. The two AI-answer figures are kept apart on purpose:
            one is Google&apos;s own count of our links inside AI Overviews and AI Mode, the other a
            separate {aiCitations.windowDays}-day Bing sample.
          </p>
        </div>

        {/* Stat grid — big mono numbers, divider-anchored, source under each.
            Valid <dl> semantics: each group is <dt> (label) then <dd>s; CSS
            `order` keeps the number visually first while <dt> precedes <dd> in
            the DOM. The Bing stat carries its own "N-day sample" tag so it
            reads separately from the Google figures. */}
        <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-3 lg:grid-cols-5">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col border-l border-white/10 pl-5">
              <dt className="order-2 mt-3 text-sm font-medium leading-snug text-gray-200">{s.label}</dt>
              <dd className="order-1 font-mono text-[clamp(1.625rem,2.9vw,2.5rem)] font-bold leading-none tracking-tight tabular-nums text-white">
                {s.value}
              </dd>
              <dd className="order-3 mt-2 flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  {s.source}
                </span>
                {s.tag && (
                  <span className="rounded-full border border-accent-400/40 px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-accent-400">
                    {s.tag}
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>

        {/* Monthly growth — same generated data as the tiles, so they can't drift */}
        <div className="mt-14">
          <GrowthCharts variant="dark" />
        </div>

        {/* Provenance footnotes */}
        <div className="mt-10 max-w-3xl border-t border-white/10 pt-6">
          <p className="text-[13px] font-medium text-gray-400">
            As of {asOf}. The keyword, first-page, and monthly-chart figures are exact unique-query
            counts from the Google Search Console API, refreshed automatically every 48 hours
            (keywords over a trailing {google.windowDays}-day window, chart by calendar month).{" "}
            {blended
              ? "Impressions per day is a combined Google Search Console + Bing Webmaster Tools daily figure."
              : `Impressions per day is a Google-only ${google.windowDays}-day average from Search Console.`}
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-gray-400">
            The {fmt(googleAiFeatures.impressions)}{" "}
            figure is Google&apos;s own — impressions from the
            Search Console &ldquo;Generative AI features&rdquo; report ({googleAiFeatures.surfaces}),
            trailing {googleAiFeatures.windowDays} days to {googleAiFeatures.asOf}, up from{" "}
            {fmt(googleAiFeatures.prevImpressions)} in the previous {googleAiFeatures.windowDays} days.
            It counts times a geotoolbox.ai link was shown inside an AI answer, not clicks and not
            unique citations. That report is still in beta and has no API, so it is read by hand.
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-gray-400">
            The ~{fmt(aiCitations.total)} AI-citation figure is a {aiCitations.windowDays}-day sample
            from Bing Webmaster Tools&apos; AI Performance report ({aiCitations.source}), as of{" "}
            {aiCitations.asOf} — a count of citation appearances, not unique citations, and not
            attributable to ChatGPT, Perplexity, or Google.
          </p>
        </div>
      </div>
    </section>
  )
}
