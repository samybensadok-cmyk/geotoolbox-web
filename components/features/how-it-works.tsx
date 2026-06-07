/**
 * HowItWorks3Step — the numbered "How it works" section. The SAME `steps` array
 * should be passed to `howToSchema({ name, steps })` in lib/seo-schema.ts so the
 * visible steps and the HowTo JSON-LD never drift (single source of truth).
 *
 * Note: `howToSchema` expects `{ name, text }`; this component renders
 * `{ verb, title, body }`. Map at the page level, e.g.
 *   const steps = [{ verb: "Ask", title: "...", body: "..." }, ...]
 *   <HowItWorks3Step steps={steps} />
 *   howToSchema({ name, steps: steps.map(s => ({ name: s.title, text: s.body })) })
 */

export type Step = {
  verb: string
  title: string
  body: string
}

export function HowItWorks3Step({
  heading = "How it works",
  steps,
}: {
  heading?: string
  steps: Step[]
}) {
  return (
    <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-[clamp(1.4rem,2.6vw,2rem)] font-bold tracking-tight text-gray-900">
          {heading}
        </h2>
        <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {steps.map((s, i) => (
            <li key={i} className="rounded-2xl border border-gray-200 bg-white p-6">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700 tabular-nums">
                {String(i + 1).padStart(2, "0")} · {s.verb}
              </span>
              <h3 className="mt-3 text-[17px] font-bold leading-snug tracking-tight text-gray-900">
                {s.title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-gray-600">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
