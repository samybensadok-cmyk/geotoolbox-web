const features = [
  {
    title: "AI Engine Scanning",
    description:
      "Scan your brand across 7 AI engines — ChatGPT, Perplexity, Gemini, Claude, Copilot, Meta AI, and Grok. See exactly what each engine says about you.",
    icon: "📡",
  },
  {
    title: "Visibility Score",
    description:
      "Get a 0-100 score that quantifies your brand's presence in AI-generated answers. Track it over time and benchmark against competitors.",
    icon: "📊",
  },
  {
    title: "Content Analyzer",
    description:
      "19 citability signals scored per page. Understand what makes your content get cited by AI — and what's holding it back.",
    icon: "🔬",
  },
  {
    title: "Competitor Intel",
    description:
      "See who AI recommends instead of you. Content gap analysis, AI threat alerts, and co-cited domain mapping.",
    icon: "🎯",
  },
]

export function Features() {
  return (
    <section id="features" className="bg-surface-secondary py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Everything you need to own AI search
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            From scanning to strategy — one platform for your AI visibility.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-surface-border bg-surface p-8 transition-all duration-200 hover:shadow-md hover:border-brand-200"
            >
              <span className="text-3xl">{feature.icon}</span>
              <h3 className="mt-4 text-xl font-semibold text-text-primary">
                {feature.title}
              </h3>
              <p className="mt-3 text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
