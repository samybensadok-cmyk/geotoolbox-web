export function Features() {
  return (
    <section id="features" className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl">
          <p className="text-sm font-medium tracking-widest text-accent-600 uppercase">
            What you get
          </p>
          <h2 className="mt-4 font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.15] text-slate-900">
            Full-spectrum AI visibility
          </h2>
        </div>

        <div className="mt-16 grid gap-y-16 sm:grid-cols-2 sm:gap-x-12 lg:gap-x-20">
          {[
            {
              label: "Scan",
              title: "7-engine brand scan",
              body: "ChatGPT, Perplexity, Gemini, Claude, Copilot, Meta AI, Grok. One scan, every major AI engine. See exactly what each one says about you.",
            },
            {
              label: "Score",
              title: "Visibility score 0–100",
              body: "A single number that quantifies your AI presence. Track it weekly, benchmark against competitors, spot drops before they cost you traffic.",
            },
            {
              label: "Analyze",
              title: "19-signal content analysis",
              body: "Citability scoring per page. Understand what makes AI cite your content — structure, authority signals, entity clarity, freshness — and what's holding it back.",
            },
            {
              label: "Intel",
              title: "Competitor intelligence",
              body: "See who AI recommends instead of you. Content gap analysis, co-cited domain mapping, and real-time threat alerts when competitors gain AI visibility.",
            },
          ].map((feature) => (
            <div key={feature.label} className="group">
              <span className="inline-block font-mono text-xs font-medium text-accent-600 uppercase tracking-wider">
                {feature.label}
              </span>
              <h3 className="mt-3 text-xl font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-3 text-slate-500 leading-relaxed">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
