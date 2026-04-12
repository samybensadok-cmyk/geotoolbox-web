import Link from "next/link"

export function Hero() {
  return (
    <section className="px-6 pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          {/* Pill badge */}
          <div className="animate-fade-up mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-200 bg-accent-50 px-3 py-1 text-xs font-medium text-accent-700">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
              Now in beta
            </span>
          </div>

          {/* Headline */}
          <h1 className="stagger-1 text-[clamp(2.25rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight text-gray-900">
            AI search analytics{" "}
            <span className="text-gray-400">for brands that want to be found</span>
          </h1>

          {/* Subhead */}
          <p className="stagger-2 mt-5 max-w-lg text-base leading-relaxed text-gray-500">
            Track what ChatGPT, Perplexity, Gemini, and 4 more AI engines say about your brand. Get a visibility score, citability analysis, and competitor benchmarks.
          </p>

          {/* CTAs — matches Peec/Scrunch pattern */}
          <div className="stagger-3 mt-8 flex items-center gap-3">
            <Link
              href="/app"
              className="rounded-full bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              Start free trial
            </Link>
            <Link
              href="/#features"
              className="rounded-full border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900"
            >
              See features
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="stagger-3 mt-16 flex flex-wrap gap-8 border-t border-gray-100 pt-8">
          {[
            { value: "7", label: "AI engines" },
            { value: "830+", label: "scans run" },
            { value: "0–100", label: "visibility score" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-gray-900">{stat.value}</span>
              <span className="text-sm text-gray-400">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
