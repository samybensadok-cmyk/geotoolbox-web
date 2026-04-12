export function Problem() {
  return (
    <section className="bg-slate-900 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-medium tracking-widest text-accent-400 uppercase">
          The problem
        </p>
        <h2 className="mt-4 max-w-2xl font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.15] text-cream">
          Google Analytics can&apos;t track what AI says about you
        </h2>

        <div className="mt-16 grid gap-px bg-slate-800 sm:grid-cols-3">
          {[
            {
              number: "01",
              title: "Your competitor gets recommended",
              body: "When users ask AI for solutions in your space, someone else shows up. You don't even know it's happening.",
            },
            {
              number: "02",
              title: "Your info is outdated or wrong",
              body: "AI engines cite cached content — wrong pricing, old features, missing context. Correcting it requires knowing it's there.",
            },
            {
              number: "03",
              title: "You're flying completely blind",
              body: "No analytics tool tracks AI citations. The fastest-growing search channel is invisible to your current stack.",
            },
          ].map((item) => (
            <div key={item.number} className="bg-slate-900 p-8 sm:p-10">
              <span className="font-mono text-xs text-accent-500">{item.number}</span>
              <h3 className="mt-4 text-lg font-medium text-cream">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
