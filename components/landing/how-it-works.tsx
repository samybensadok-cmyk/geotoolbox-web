export function HowItWorks() {
  const steps = [
    {
      num: "01",
      verb: "Enter",
      title: "Your domain",
      body: "Paste a URL. Add competitors if you want a side-by-side.",
      output: "acme-corp.com + 2 competitors",
    },
    {
      num: "02",
      verb: "Scan",
      title: "Six AI engines in parallel",
      body: "We query ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews, and Bing Copilot with your prompts.",
      output: "847 responses analyzed",
    },
    {
      num: "03",
      verb: "Read",
      title: "Your visibility report",
      body: "Score, engine-by-engine breakdown, citability analysis, competitor deltas.",
      output: "72/100  ·  +8 this week",
    },
  ]

  return (
    <section id="how-it-works" className="scroll-mt-24 bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Editorial header — asymmetric, left-aligned */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[5fr_7fr] lg:items-end lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">
              How it works
            </p>
            <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-tight tracking-tight text-gray-900">
              From URL to insights in minutes.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-gray-600">
            No integrations, no tagging, no waiting. The scan runs in parallel and returns an AI visibility score you can defend to your CMO. One run powers your ChatGPT rank tracker, AI Overviews check, and Perplexity citation monitor.
          </p>
        </div>

        {/* Editorial 3-step trace — no cards, no connector lines, just typography + data */}
        <ol className="mt-16 divide-y divide-gray-200">
          {steps.map((s) => (
            <li key={s.num} className="grid grid-cols-1 gap-6 py-8 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-10 md:py-10">
              {/* Step number — large mono, teal accent */}
              <div className="flex items-center gap-4 md:block">
                <span className="font-mono text-4xl font-bold tabular-nums text-accent-700 md:text-5xl">
                  {s.num}
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 md:hidden">
                  {s.verb}
                </span>
              </div>

              {/* Content — verb + title + body */}
              <div>
                <p className="hidden text-xs font-semibold uppercase tracking-widest text-gray-500 md:block">
                  {s.verb}
                </p>
                <h3 className="mt-1 text-xl font-semibold tracking-tight text-gray-900">
                  {s.title}
                </h3>
                <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-gray-600">
                  {s.body}
                </p>
              </div>

              {/* Output — the "trace" line, mono, right-aligned on desktop */}
              <div className="md:text-right">
                <p className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 font-mono text-[12px] text-gray-700">
                  <svg className="h-3 w-3 text-accent-600" viewBox="0 0 12 12" fill="none">
                    <path d="M3 6h6m0 0L6 3m3 3L6 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="truncate">{s.output}</span>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
