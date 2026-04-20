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
      style={{ backgroundColor: "var(--surface-ink)" }}
    >
      <div className="mx-auto max-w-7xl">
        {/* Editorial header — mirrors Problem/HowItWorks pattern */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[5fr_7fr] lg:items-end lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-300">
              Live demo
            </p>
            <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-tight tracking-tight text-white">
              Here&apos;s what a scan actually looks like.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-gray-300">
            One prompt fanned out across nine engines. Green means cited, amber means mentioned, red means invisible. A new query runs every eight seconds &mdash; no replay, no pre-recorded demo.
          </p>
        </div>

        {/* Animation — spans full editorial width */}
        <div className="mt-12 sm:mt-16">
          <CitationSignal />
        </div>

        {/* Footer micro-copy — reinforces that this is real product behaviour */}
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-gray-500">
          Production scans use your real domain, real prompts, and real engine latency. This preview uses synthetic data for illustration.
        </p>
      </div>
    </section>
  )
}
