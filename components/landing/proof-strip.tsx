import { getTranslations } from "next-intl/server"

/**
 * ProofStrip — honest-proof band directly under the dark hero.
 *
 * We are pre-customer, so there are no logos, review badges, or user counts
 * to show (and we never invent them). What we do have is verifiable product
 * fact: engine coverage, tool count, free tools, scan speed, public pricing.
 * Rendered as a quiet mono ledger line — the credibility is in the facts
 * being checkable, not in decoration.
 */
export async function ProofStrip() {
  const t = await getTranslations("home.proofStrip")
  const items = t.raw("items") as string[]
  return (
    <section
      aria-label={t("ariaLabel")}
      className="border-y border-gray-800 bg-gray-950 px-6 py-5"
    >
      <ul className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-2">
        {items.map((item, i) => (
          <li key={item} className="flex items-center gap-x-3">
            {i > 0 && (
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent-700" />
            )}
            <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-400">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
