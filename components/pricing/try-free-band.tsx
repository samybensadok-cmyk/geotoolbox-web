import Link from "next/link"
import k from "@/components/brand/dark-kit.module.css"
import st from "./pricing-experience.module.css"

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
    <section className={`${k.section} ${st.tryFree}`}>
      <div className={`${k.wrap} ${st.split}`}>
        <div>
          <p className={k.index}>
            {copy.eyebrow}
          </p>
          <h2 className={st.splitTitle}>
            {copy.h2}
          </h2>
          <p className={st.splitLead}>{copy.sub}</p>
          <Link
            href={`/tools?${REF}-all`}
            prefetch={false}
            className={k.textLink}
          >
            {copy.all} →
          </Link>
        </div>

        <ul className={st.toolIndex}>
          {copy.tools.map((tool, i) => (
            <li key={tool.slug}>
              <Link
                href={`/tools/${tool.slug}?${REF}-${tool.slug}`}
                prefetch={false}
                className={st.toolRow}
              >
                <span aria-hidden="true" className={st.toolNum}>{String(i + 1).padStart(2, "0")}</span>
                <span className={st.toolText}>
                  <span className={st.toolName}>
                    {tool.name}
                  </span>
                  <span className={st.toolDesc}>{tool.desc}</span>
                </span>
                <span aria-hidden="true" className={st.toolArrow}>→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
