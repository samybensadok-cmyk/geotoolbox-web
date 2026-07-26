import { proofStats } from "@/lib/proof-stats"

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
 * never dressed up as ChatGPT / Perplexity / Google data.
 */
export function ProofResults() {
  const { google, aiCitations, weeksToResult, asOf } = proofStats
  const fmt = (n: number) => n.toLocaleString("en-US")

  const stats: Array<{ value: string; label: string; source: string; tag?: string }> = [
    { value: fmt(google.rankedKeywords), label: "Keywords ranked in Google", source: "Google Search Console" },
    { value: fmt(google.top10), label: "On Google's first page (top 10)", source: "Google Search Console" },
    {
      value: `~${fmt(aiCitations.total)}`,
      label: "AI-citation appearances",
      source: `Bing WMT · ${aiCitations.source} · ${aiCitations.windowDays}-day sample`,
      tag: `${aiCitations.windowDays}-day sample`,
    },
    { value: `~${fmt(google.dailyImpressions)}`, label: "Impressions per day", source: "Google + Bing (combined)", tag: "combined" },
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
            The Google figures came from about {weeksToResult} weeks of publishing on a domain that drove
            near-zero traffic before; the AI-citation count is a separate {aiCitations.windowDays}-day
            Bing sample.
          </p>
        </div>

        {/* Stat grid — big mono numbers, divider-anchored, source under each.
            Valid <dl> semantics: each group is <dt> (label) then <dd>s; CSS
            `order` keeps the number visually first while <dt> precedes <dd> in
            the DOM. The Bing stat carries its own "N-day sample" tag so it
            reads separately from the Google figures. */}
        <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col border-l border-white/10 pl-5">
              <dt className="order-2 mt-3 text-sm font-medium leading-snug text-gray-200">{s.label}</dt>
              <dd className="order-1 font-mono text-[clamp(2rem,5vw,3.25rem)] font-bold leading-none tracking-tight tabular-nums text-white">
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

        {/* Provenance footnotes */}
        <div className="mt-14 max-w-3xl border-t border-white/10 pt-6">
          <p className="text-[13px] font-medium text-gray-400">
            As of {asOf}. The keyword and first-page figures are from Google Search Console —
            deduplicated and verifiable in Search Console. Impressions per day is a combined Google
            Search Console + Bing Webmaster Tools daily figure.
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-gray-400">
            The ~{fmt(aiCitations.total)} AI-citation figure is a {aiCitations.windowDays}-day sample
            from Bing Webmaster Tools&apos; AI Performance report ({aiCitations.source}) — a count of citation
            appearances, not unique citations, and not attributable to ChatGPT, Perplexity, or Google.
          </p>
        </div>
      </div>
    </section>
  )
}
