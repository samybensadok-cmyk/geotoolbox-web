export function Problem() {
  return (
    <section className="bg-gray-950 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-sm font-semibold tracking-wider text-accent-400 uppercase">The problem</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl leading-tight">
            Your biggest search channel has zero analytics
          </h2>
          <p className="mt-4 text-lg text-gray-400 leading-relaxed">
            AI engines answer millions of brand queries daily. None of it shows up in Google Analytics, Search Console, or any tool you use today.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {[
            {
              num: "01",
              title: "Competitors get recommended instead of you",
              body: "When users ask AI about your category, someone else shows up. You don't know it's happening — there's no alert, no report, no metric.",
            },
            {
              num: "02",
              title: "Your brand info is outdated or wrong",
              body: "AI engines cite cached content — wrong pricing, old features, missing context. You can't correct what you can't see.",
            },
            {
              num: "03",
              title: "No existing tool tracks AI citations",
              body: "Google Analytics, Ahrefs, SEMrush — none of them track what AI says about you. The fastest-growing search channel is a total blind spot.",
            },
          ].map((item) => (
            <div key={item.num} className="rounded-xl border border-gray-800/60 bg-gray-900/50 p-6 sm:p-8">
              <span className="font-mono text-sm font-medium text-accent-500">{item.num}</span>
              <h3 className="mt-3 text-lg font-semibold text-white leading-snug">
                {item.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-gray-400">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
