export function Problem() {
  const tracked = [
    "Google organic",
    "Search Console clicks",
    "GA4 sessions",
    "Ahrefs rankings",
    "Bing results",
  ]

  const untracked = [
    "ChatGPT recommendations",
    "Perplexity citations",
    "Gemini answers",
    "Claude mentions",
    "Google AI Overviews",
    "Bing Copilot responses",
  ]

  return (
    <section className="bg-gray-950 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Editorial header */}
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent-400">
            The problem
          </p>
          <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-tight tracking-tight text-white">
            AI search is your biggest blind spot.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-gray-300">
            Millions of brand queries answered by AI every day. None of it shows up in the tools you use today.
          </p>
        </div>

        {/* Flipped asymmetric split — left minimal, right dominant */}
        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-[3fr_9fr] lg:gap-20">
          {/* Left — sidebar, tiny, muted. "You already have this covered." */}
          <aside className="lg:pt-2">
            <div className="flex items-baseline gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-600">
                What you track today
              </p>
              <span className="font-mono text-[11px] font-semibold tabular-nums text-gray-500">
                &middot;{tracked.length}
              </span>
            </div>
            <ul className="mt-5 space-y-2">
              {tracked.map((item) => (
                <li
                  key={item}
                  className="text-sm text-gray-500"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs italic text-gray-600">
              Already measured.
            </p>
          </aside>

          {/* Right — hero column, the alarm */}
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-400">
                What you miss
              </span>
              <span className="font-mono text-[11px] font-bold tabular-nums text-accent-300">
                &middot;{untracked.length}
              </span>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent-100/80">
                &middot; 0 visibility today
              </span>
              <span className="h-px flex-1 bg-accent-800/60" />
            </div>

            <ul className="mt-8 divide-y divide-accent-900/40">
              {untracked.map((item, i) => (
                <li
                  key={item}
                  className="flex items-center gap-5 py-5"
                >
                  <span className="relative inline-flex h-3 w-3 shrink-0" aria-hidden="true">
                    {i === 0 && (
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-60" />
                    )}
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-accent-500" />
                  </span>
                  <span className="text-xl font-semibold text-white md:text-2xl">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bigger editorial pull-quote — now actually reads as a pull quote */}
        <p className="mt-20 max-w-4xl text-[clamp(1.25rem,2.2vw,1.75rem)] font-semibold leading-snug tracking-tight text-gray-300">
          The fastest-growing search channel is the one you don&apos;t measure.{" "}
          <span className="text-accent-300">
            AI visibility is already the metric your competitors track.
          </span>{" "}
          <span className="text-white">What about you?</span>
        </p>
      </div>
    </section>
  )
}
