const problems = [
  {
    icon: "💬",
    title: "ChatGPT recommends your competitor",
    description:
      "When users ask AI for product recommendations, your competitor shows up — not you. And you have no idea it's happening.",
  },
  {
    icon: "🔍",
    title: "Perplexity cites outdated info",
    description:
      "AI search engines pull from cached, outdated content about your brand. Wrong pricing, old features, missing context.",
  },
  {
    icon: "🚫",
    title: "You have no visibility into AI search",
    description:
      "Google Analytics doesn't track AI citations. You're flying blind in the fastest-growing search channel.",
  },
]

export function Problem() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-surface-border bg-surface-secondary p-6"
            >
              <span className="text-2xl">{item.icon}</span>
              <h3 className="mt-4 text-lg font-semibold text-text-primary">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-lg font-medium text-text-primary">
          <span className="bg-gradient-to-r from-brand-500 to-purple-500 bg-clip-text text-transparent font-semibold">
            GEO Toolbox
          </span>{" "}
          shows you exactly where you stand.
        </p>
      </div>
    </section>
  )
}
