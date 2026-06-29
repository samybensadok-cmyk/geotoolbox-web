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
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-2xl text-[clamp(1.4rem,2.6vw,2rem)] font-bold tracking-tight text-gray-900">
          {heading}
        </h2>
        {/* Numbered connector rail — not boxed cards (anti-slop, design-system v2) */}
        <ol className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-3">
          {steps.map((s, i) => (
            <li key={i} className="relative">
              {i < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-12 right-0 top-[18px] hidden h-px bg-gradient-to-r from-gray-300 to-transparent sm:block"
                />
              )}
              <div className="flex items-center gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent-200 bg-white font-mono text-[13px] font-bold tabular-nums text-accent-700">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                  {s.verb}
                </span>
              </div>
              <h3 className="mt-5 text-[17px] font-bold leading-snug tracking-tight text-gray-900">
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
