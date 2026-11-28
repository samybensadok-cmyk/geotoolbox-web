import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { PLANS, BOOK_CALL, doneWithYouMonthly } from "@/lib/plans"
import { isEuroLocale } from "@/lib/i18n/currency"
import { GEO_SERVICE_PRICES as GSP, usd } from "@/lib/service-offers"
import { localizeNavHref } from "@/lib/i18n/nav"
import { Arrow, Check, kit as k } from "@/components/brand/dark-kit"
import st from "./pricing-experience.module.css"

/**
 * "Three ways to work" (2026-11-28 operator decision, same offer as the homepage pricing block):
 * do it yourself (the plan cards above), done with you (plan + a monthly founder session, sold on a
 * call) and done for you (the services). Copy is the homepage's translated `home.v3.pricing.*`;
 * done-with-you prices come from lib/plans.ts, done-for-you prices from lib/service-offers.ts.
 */

/** Grouped money in the visitor's billing currency (same rule as the homepage block). The euro
 *  form keeps a no-break space so the amount never wraps away from its symbol. */
function money(n: number, locale: string) {
  return isEuroLocale(locale) ? `${n.toLocaleString(locale)} €` : `$${n.toLocaleString("en-US")}`
}

export async function ThreeWays({ locale, plansAnchor }: { locale: string; plansAnchor: string }) {
  const t = await getTranslations({ locale, namespace: "home.v3" })
  const ext = { target: "_blank", rel: "noopener noreferrer" } as const
  const dwyBrand = doneWithYouMonthly("brand")
  const dwyAgency = doneWithYouMonthly("agency")

  return (
    <section className={`${k.section} ${k.sectionBorder}`} aria-labelledby="pricing-ways-title">
      <div className={k.wrap}>
        <div className={k.sectionHead}>
          <div>
            <h2 id="pricing-ways-title" className={k.sectionTitle}>{t("pricing.title")}</h2>
          </div>
          <p className={k.sectionLead}>{t("pricing.lead")}</p>
        </div>

        <ol className={st.ways}>
          {/* 01 Do it yourself = the plans on this page */}
          <li className={`${st.way} ${k.sweep}`}>
            <span className={st.wayIdx} aria-hidden="true">01</span>
            <div className={st.wayText}>
              <div className={st.wayHead}>
                <h3 className={st.wayKicker}>{t("pricing.diyKicker")}</h3>
              </div>
            </div>
            <ul className={`${k.tags} ${st.planTags}`}>
              {PLANS.map((p) => <li key={p.id}>{p.name}</li>)}
            </ul>
            <div className={st.wayActions}>
              <a href={`#${plansAnchor}`} className={k.btnOutline}>
                {t("pricing.compare")}<span className={st.upArrow}><Arrow /></span>
              </a>
            </div>
          </li>

          {/* 02 Done with you */}
          <li className={`${st.way} ${st.wayLime} ${k.sweep}`}>
            <span className={st.wayIdx} aria-hidden="true">02</span>
            <div className={st.wayText}>
              <div className={st.wayHead}>
                <h3 className={st.wayKicker}>{t("pricing.dwyKicker")}</h3>
                <span className={k.badge}>{t("pricing.dwyBadge")}</span>
              </div>
              <p className={st.wayDesc}>{t("pricing.dwyDesc")}</p>
              <ul className={`${k.checklist} ${st.wayList}`}>
                {(t.raw("pricing.dwyItems") as string[]).map((x) => <li key={x}><Check />{x}</li>)}
              </ul>
            </div>
            <div className={st.dwyPrices}>
              <div>
                <p className={st.dwyVal}>{money(dwyBrand, locale)}<span>{t("pricing.perMonth")}</span></p>
                <p className={st.dwyWho}>{t("pricing.dwyBrands")}</p>
              </div>
              <div>
                <p className={st.dwyVal}>{money(dwyAgency, locale)}<span>{t("pricing.perMonth")}</span></p>
                <p className={st.dwyWho}>{t("pricing.dwyAgencies")}</p>
              </div>
            </div>
            <div className={st.wayActions}>
              <a href={BOOK_CALL} data-cta-placement="pricing_dwy" className={k.btnLime} {...ext}>
                {t("bookCall")}<Arrow />
              </a>
            </div>
          </li>

          {/* 03 Done for you (services are English-only and priced in USD) */}
          <li className={`${st.way} ${st.wayDfy} ${k.sweep}`}>
            <span className={st.wayIdx} aria-hidden="true">03</span>
            <div className={st.wayText}>
              <div className={st.wayHead}>
                <h3 className={st.wayKicker}>{t("pricing.dfyKicker")}</h3>
              </div>
              <p className={st.wayTitle}>{t("pricing.dfyTitle")}</p>
              <p className={st.wayDesc}>{t("pricing.dfyNote")}</p>
            </div>
            {/* Same rows in every column (label, price, name, term) so the prices share one baseline. */}
            <ul className={st.dfyPrices}>
              <li>
                <p className={st.dfyTop}>{t("pricing.dfyOneOff")}</p>
                <p className={st.dfyVal}>{usd(GSP.report)}</p>
                <p className={st.dfyName}>{t("pricing.dfyReportName")}</p>
              </li>
              <li>
                <p className={st.dfyTop}>{t("pricing.from")}</p>
                <p className={st.dfyVal}>{usd(GSP.sprintFrom)}</p>
                <p className={st.dfyName}>{t("pricing.dfySprint")}</p>
              </li>
              <li>
                <p className={st.dfyTop}>{t("pricing.from")}</p>
                <p className={st.dfyVal}>{usd(GSP.retainerFromMonthly)}<span>{t("pricing.perMonth")}</span></p>
                <p className={st.dfyName}>{t("pricing.dfyRetainerName")}</p>
                <p className={st.dfyTerm}>{t("pricing.dfyRetainerTerm")}</p>
              </li>
            </ul>
            <div className={st.wayActions}>
              <Link href={localizeNavHref("/services/generative-engine-optimization", locale)} className={k.btnOutline}>
                {t("pricing.dfyCta")}<Arrow />
              </Link>
              <a href={BOOK_CALL} data-cta-placement="pricing_dfy" className={k.textLink} {...ext}>
                {t("bookCall")}<Arrow />
              </a>
            </div>
          </li>
        </ol>
      </div>
    </section>
  )
}
