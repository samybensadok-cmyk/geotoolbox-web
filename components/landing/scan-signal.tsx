import { CitationSignal } from "./citation-signal"

/**
 * ScanSignal — mid-page dark section that answers Problem's question with a
 * visual demonstration. Matches the editorial tone of Problem / HowItWorks.
 *
 * Tonal differentiation from Problem:
 *  - Problem uses bg-gray-950 with warning energy (accent-400 alarm)
 *  - ScanSignal uses surface-ink (cooler, slightly bluer dark) with scanning
 *    energy (accent-300 cyan live data)
 */
export function ScanSignal() {
  return (
    <section
      id="live-scan"
      className="scroll-mt-24 px-6 py-24 sm:py-32"
      style={{
        backgroundColor: "var(--surface-ink)",
        /* Hairline teal divider marks the hand-off from Problem's "What about you?"
           without breaking the continuous-dark composition. */
        borderTop: "1px solid rgba(15, 118, 110, 0.35)",
      }}
    >
      <div className="mx-auto max-w-7xl">
        {/* Editorial header — mirrors Problem/HowItWorks pattern.
            Eyebrow "The answer" directly echoes Problem's closing "What about you?" */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[5fr_7fr] lg:items-end lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-300">
              The answer
            </p>
            <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-tight tracking-tight text-white">
              One prompt. Every AI. Every citation.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-gray-300">
            A single prompt runs through six AI engines in parallel. Green means you were cited. Amber means you were mentioned without a link. Red means you were left out entirely.
          </p>
        </div>

        {/* Animation — spans full editorial width */}
        <div className="mt-12 sm:mt-16">
          <CitationSignal />
        </div>

        {/* Footer micro-copy — makes it clear this is an illustrative demo, not live customer data */}
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-gray-500">
          Demo shown with sample queries and responses. Production scans run against your real domain and return real engine responses in under two minutes.
        </p>
      </div>
    </section>
  )
}
