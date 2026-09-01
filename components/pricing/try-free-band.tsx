import Link from "next/link"

/**
 * SG_PRICING_TRYFREE_V1 (2026-09-01) — the no-card way in.
 *
 * The Free tier was retired in SG_PRICING_V2.1, so every self-serve path off
 * /pricing now asks for a card before the visitor has seen anything work. The
 * ten free tools are the one place a prospect experiences the product for real
 * — no signup, no email gate, no trial clock — and on this page they appeared
 * only in the footer (all 11 `/tools` links sat after `<footer>` in the
 * rendered HTML).
 *
 * This band sits between the cards and the credits explainer. It cannot
 * cannibalise a trial that isn't being started, and it feeds the same
 * "show value before the card" path the first-run scan is being built for.
 *
 * ⚠️ Hrefs are deliberately UNPREFIXED in every locale: the tools live under
 * app/(marketing)/tools, outside the next-intl `[locale]` tree, so
 * `/fr/tools/ai-readiness` 404s (verified live 2026-09-01). Same convention as
 * components/blog/inline-cta.tsx.
 *
 * Attribution: `?ref=` — deliberately NOT `utm_*`. `/tools/*` is the same site on
 * the same GA4 property, and a `utm_source` on an INTERNAL link makes GA4 start a
 * new session attributed to "pricing", overwriting the real acquisition source
 * (google / organic, a referral, the newsletter). `ref` is inert to GA4's
 * attribution model while still landing in `page_location`, so the band's
 * click-through is countable without corrupting the channel report.
 *
 * Never `sg_checkout`/`sg_billing` — js/auth.js fires a checkout resume on any
 * page carrying those.
 */

export type TryFreeCopy = {
  eyebrow: string
  h2: string
  sub: string
  all: string
  /** one line per tool, keyed by slug; the tool NAME is a product identifier and stays EN */
  tools: { slug: string; name: string; desc: string }[]
}

const REF = "ref=pricing-tryfree"

export function TryFreeBand({ copy }: { copy: TryFreeCopy }) {
  return (
    <section className="border-t border-gray-100 bg-white px-6 py-14">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
            {copy.eyebrow}
          </p>
          <h2 className="mt-2 text-[clamp(1.4rem,2.6vw,2rem)] font-bold tracking-tight text-gray-900">
            {copy.h2}
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-gray-700">{copy.sub}</p>
        </div>

        <ul className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {copy.tools.map((tool) => (
            <li key={tool.slug}>
              <Link
                href={`/tools/${tool.slug}?${REF}-${tool.slug}`}
                prefetch={false}
                className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 no-underline transition-all duration-200 hover:border-accent-300 hover:shadow-lg hover:shadow-accent-900/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
              >
                <h3 className="text-[15px] font-bold text-gray-900 group-hover:text-accent-800">
                  {tool.name}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-gray-600">{tool.desc}</p>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-7 text-center">
          <Link
            href={`/tools?${REF}-all`}
            prefetch={false}
            className="text-[14px] font-semibold text-accent-700 underline-offset-4 hover:text-accent-800 hover:underline"
          >
            {copy.all}
          </Link>
        </p>
      </div>
    </section>
  )
}
