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
        {/* Left-aligned editorial header */}
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

        {/* Asymmetric split: what you see vs what you miss */}
        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
          {/* Left: tracked */}
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                What you see
              </span>
              <span className="h-px flex-1 bg-gray-800" />
            </div>
            <ul className="mt-5 divide-y divide-gray-900">
              {tracked.map((item) => (
                <li key={item} className="flex items-center gap-3 py-3">
                  <svg className="h-3.5 w-3.5 shrink-0 text-gray-500" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[15px] text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: untracked — emphasized with accent */}
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-400">
                What you miss
              </span>
              <span className="h-px flex-1 bg-accent-800/60" />
            </div>
            <ul className="mt-5 divide-y divide-accent-900/40">
              {untracked.map((item, i) => (
                <li key={item} className="flex items-center gap-3 py-3">
                  <span className="relative inline-flex h-2.5 w-2.5 shrink-0">
                    <span
                      className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-60"
                      style={{ animationDelay: `${i * 160}ms` }}
                    />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-500" />
                  </span>
                  <span className="text-[15px] font-medium text-white">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom editorial pull-quote */}
        <p className="mt-16 max-w-3xl text-lg leading-relaxed text-gray-400">
          The fastest-growing search channel is the one you don&apos;t measure.
          Your competitors already know what AI says about them.
          <span className="text-white"> Do you?</span>
        </p>
      </div>
    </section>
  )
}
