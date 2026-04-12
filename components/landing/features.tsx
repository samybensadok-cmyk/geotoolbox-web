export function Features() {
  const features = [
    {
      tag: "Scan",
      title: "7-engine brand scan",
      body: "ChatGPT, Perplexity, Gemini, Claude, Copilot, Meta AI, Grok. One scan shows what each engine says about you.",
      stat: "7 engines",
    },
    {
      tag: "Score",
      title: "Visibility score 0–100",
      body: "A single number that quantifies your AI presence. Track weekly, benchmark competitors, catch drops early.",
      stat: "0–100",
    },
    {
      tag: "Analyze",
      title: "19-signal citability analysis",
      body: "Structure, authority, entity clarity, freshness — see what helps AI cite your content and what holds it back.",
      stat: "19 signals",
    },
    {
      tag: "Intel",
      title: "Competitor intelligence",
      body: "Who AI recommends instead of you. Content gaps, co-cited domains, real-time alerts when competitors gain visibility.",
      stat: "Real-time",
    },
  ]

  return (
    <section id="features" className="px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="max-w-lg">
            <p className="text-xs font-semibold tracking-wider text-accent-600 uppercase">Capabilities</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-[1.75rem]">
              Full-spectrum AI visibility
            </h2>
          </div>
          <p className="text-[15px] text-gray-500 max-w-sm">
            From scanning to strategy — everything you need to own your presence in AI search.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.tag}
              className="group rounded-xl border border-gray-100 bg-gray-50/50 p-6 transition-all hover:border-accent-200 hover:bg-white hover:shadow-sm"
            >
              <div className="flex items-start justify-between">
                <span className="inline-flex rounded-md bg-accent-50 px-2 py-0.5 text-[10px] font-bold tracking-wider text-accent-700 uppercase">
                  {feature.tag}
                </span>
                <span className="text-xs font-medium text-gray-400">{feature.stat}</span>
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
