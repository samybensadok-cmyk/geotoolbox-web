import Link from "next/link"

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-gray-950 px-6 py-24 sm:py-32">
      {/* Subtle grid bleed anchors the dark panel without being a gradient blob */}
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
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[7fr_5fr] lg:items-end lg:gap-16">
          {/* Left: editorial question */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent-800/60 bg-accent-950/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-accent-300">
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-400" />
              </span>
              Ready when you are
            </div>
            <h2 className="mt-6 text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.05] tracking-tight text-white">
              Your competitors already know.
              <br />
              <span className="text-accent-400">Do you?</span>
            </h2>
          </div>

          {/* Right: action block */}
          <div className="flex flex-col gap-4 lg:items-start">
            <p className="max-w-md text-base leading-relaxed text-gray-300">
              Run your first scan in minutes. Visibility score, engine-by-engine citations, and competitor benchmarks — free while in beta.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/app" prefetch={false}
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 hover:shadow-xl hover:shadow-black/30 active:translate-y-[1px]"
              >
                Start free trial
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="/blog"
                className="text-sm font-semibold text-gray-300 transition-colors hover:text-white"
              >
                Read the research &rarr;
              </Link>
            </div>
            <p className="mt-1 text-xs text-gray-400">
              No credit card &middot; Results in minutes
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
