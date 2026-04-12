export function Problem() {
  return (
    <section className="bg-gray-950 px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1fr,1fr] lg:gap-16 lg:items-start">
          {/* Left — headline */}
          <div className="lg:sticky lg:top-24">
            <p className="text-xs font-semibold tracking-wider text-accent-400 uppercase">The problem</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-[1.75rem] leading-snug">
              Your biggest search channel has zero analytics
            </h2>
            <p className="mt-3 text-[15px] text-gray-400 leading-relaxed">
              AI engines answer millions of brand queries daily. None of it shows up in Google Analytics, Search Console, or any tool you use today.
            </p>
          </div>

          {/* Right — cards */}
          <div className="grid gap-4">
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
              <div key={item.num} className="rounded-lg border border-gray-800/60 bg-gray-900/50 p-5">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 font-mono text-xs font-medium text-accent-500">{item.num}</span>
                  <div>
                    <h3 className="text-[15px] font-semibold text-white leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">
                      {item.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
