export function Features() {
  return (
    <section id="features" className="px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-lg">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Full-spectrum AI visibility
          </h2>
          <p className="mt-3 text-base text-gray-500 leading-relaxed">
            From scanning to strategy — everything you need to own your AI search presence.
          </p>
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-2">
          {[
            {
              title: "7-engine brand scan",
              body: "ChatGPT, Perplexity, Gemini, Claude, Copilot, Meta AI, Grok. One scan shows exactly what each engine says about you.",
              tag: "Scan",
            },
            {
              title: "Visibility score 0–100",
              body: "A single number that quantifies your AI presence. Track weekly, benchmark competitors, catch drops early.",
              tag: "Score",
            },
            {
              title: "19-signal content analysis",
              body: "Citability scoring per page — structure, authority, entity clarity, freshness. See what helps AI cite you and what holds you back.",
              tag: "Analyze",
            },
            {
              title: "Competitor intelligence",
              body: "See who AI recommends instead of you. Content gaps, co-cited domains, and real-time alerts when competitors gain visibility.",
              tag: "Intel",
            },
          ].map((feature) => (
            <div key={feature.tag} className="border-t border-gray-100 pt-6 transition-colors hover:border-accent-200">
              <span className="text-xs font-semibold tracking-wider text-accent-600 uppercase">
                {feature.tag}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-[15px] text-gray-500 leading-relaxed">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
