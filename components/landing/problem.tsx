export function Problem() {
  return (
    <section className="bg-gray-950 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-lg text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Your biggest search channel has zero analytics
        </h2>
        <p className="mt-4 max-w-lg text-base text-gray-400 leading-relaxed">
          AI engines answer millions of brand queries daily. None of it shows up in your existing tools.
        </p>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {[
            {
              title: "Competitors get recommended",
              body: "When users ask AI about your category, someone else shows up. You don't even know it's happening.",
            },
            {
              title: "Your info is outdated",
              body: "AI engines cite cached content — wrong pricing, old features, missing context. You can't fix what you can't see.",
            },
            {
              title: "No tool tracks this",
              body: "Google Analytics, Search Console, Ahrefs — none of them track AI citations. It's a total blind spot.",
            },
          ].map((item, i) => (
            <div key={i} className="border-t border-accent-900/40 pt-6">
              <h3 className="text-[15px] font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
