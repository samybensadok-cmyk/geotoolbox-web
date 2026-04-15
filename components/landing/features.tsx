import Link from "next/link"

export function Features() {
  const features = [
    {
      tag: "Scan",
      title: "7-engine brand scan",
      body: "ChatGPT, Perplexity, Gemini, Claude, Copilot, Meta AI, Grok. One scan shows what each engine says about you — mentions, citations, recommendations, and sentiment.",
      stat: "7 engines",
      color: "bg-accent-500",
    },
    {
      tag: "Score",
      title: "Visibility score 0–100",
      body: "A single number that quantifies your AI presence. Track weekly, benchmark against competitors, set alerts for drops. The number your CMO actually understands.",
      stat: "0–100",
      color: "bg-accent-600",
    },
    {
      tag: "Analyze",
      title: "19-signal citability analysis",
      body: "Structure, authority, entity clarity, freshness, schema markup — see exactly what helps AI cite your content and what holds it back. Per-page scoring.",
      stat: "19 signals",
      color: "bg-accent-700",
    },
    {
      tag: "Intel",
      title: "Competitor intelligence",
      body: "Who AI recommends instead of you. Content gaps, co-cited domains, real-time alerts when competitors gain visibility. Know before they outrank you in AI.",
      stat: "Real-time",
      color: "bg-accent-400",
    },
  ]

  return (
    <section id="features" className="px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-wider text-accent-600 uppercase">Capabilities</p>
          <h2 className="mt-3 text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold tracking-tight text-gray-900">
            Full-spectrum AI visibility
          </h2>
          <p className="mt-3 text-base text-gray-500">
            From scanning to strategy — everything you need to own your presence in AI search.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.tag}
              className="group relative rounded-xl border border-gray-100 bg-white p-6 transition-all hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100/60 sm:p-7"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className={`h-2 w-2 rounded-full ${feature.color}`} />
                  <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                    {feature.tag}
                  </span>
                </div>
                <span className="rounded-full bg-gray-50 px-2.5 py-0.5 text-[10px] font-semibold text-gray-500">
                  {feature.stat}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                {feature.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/app"
            className="rounded-full bg-gray-900 px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/10"
          >
            Try it free
          </Link>
        </div>
      </div>
    </section>
  )
}
