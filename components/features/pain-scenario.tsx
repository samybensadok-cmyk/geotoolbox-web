/**
 * PainScenarioSection — the "cost of being invisible" move every strong
 * competitor page makes and our pages skip: name the visitor's blind spot as a
 * concrete scenario with a business cost, then bridge to the fix. Use once near
 * the top; keep restating the gap→fix rhythm at later section breaks.
 */

export function PainScenarioSection({
  eyebrow = "The blind spot",
  scenario,
  bridge,
}: {
  eyebrow?: string
  /** the concrete, second-person scenario paragraph */
  scenario: string
  /** the one-line gap→fix bridge */
  bridge: string
}) {
  return (
    <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
          {eyebrow}
        </p>
        <p className="mt-4 text-[clamp(1.15rem,2vw,1.4rem)] font-medium leading-relaxed tracking-tight text-gray-900">
          {scenario}
        </p>
        <p className="mt-5 text-[15px] leading-relaxed text-gray-600">{bridge}</p>
      </div>
    </section>
  )
}
