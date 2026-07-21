import { StatCounter } from "@/components/features/social-proof"
import { proofStats } from "@/lib/proof-stats"

/**
 * ProofResults — the hard-numbers proof bar for the Done-For-You service page.
 * Reads EVERY figure from lib/proof-stats.ts (single source of truth) so a daily
 * bump is one edit and the "as of" stamp never drifts from the numbers above it.
 *
 * Leads with the hardest results first (223 in Google's top 3, then the ~10,300
 * AI citations). The Google numbers are real + unique (GSC); the AI-citation
 * number is a sampled, non-unique appearance count from Bing Webmaster Tools —
 * stated plainly in the footnote, never dressed up as ChatGPT/Perplexity data.
 */
export function ProofResults() {
  const { google, aiCitations, asOf } = proofStats
  const fmt = (n: number) => n.toLocaleString("en-US")

  const stats: Array<{ value: string; label: string }> = [
    { value: fmt(google.top3), label: "In Google's top 3" },
    { value: `~${fmt(aiCitations.total)}`, label: "AI citations (Bing WMT)" },
    { value: fmt(google.top10), label: "In Google's top 10" },
    { value: fmt(google.rankedKeywords), label: "Keywords ranked in Google" },
  ]

  return (
    <section className="border-t border-[var(--surface-mint-border)] bg-[var(--surface-mint)] px-6 py-14 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
            The proof, from my own test domain
          </p>
          <p className="max-w-2xl text-[15px] leading-relaxed text-gray-600">
            One fresh, zero-authority domain — about seven weeks of content publishing behind the Google
            numbers below. These are the numbers, not a promise — the exact figures, stamped, and updated
            as they move.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-start justify-center gap-x-12 gap-y-6">
          {stats.map((s) => (
            <StatCounter key={s.label} value={s.value} label={s.label} />
          ))}
        </div>

        <p className="mt-8 text-center text-[13px] font-medium text-gray-500">
          As of {asOf}. Google figures are from Google Search Console (deduplicated, verifiable in Search Console).
        </p>
        <p className="mx-auto mt-2 max-w-2xl text-center text-[13px] leading-relaxed text-gray-500">
          The ~{fmt(aiCitations.total)} AI-citation figure is a {aiCitations.windowMonths}-month sample from
          Bing Webmaster Tools&apos; AI Performance report ({aiCitations.source}) — a count of citation
          appearances, not unique citations, and not attributable to ChatGPT, Perplexity, or Google.
        </p>
      </div>
    </section>
  )
}
