import Image from "next/image"
import Link from "next/link"
import { getLocale, getTranslations } from "next-intl/server"
import { PLANS, type PlanId } from "@/lib/plans"
import { formatPrice, currencyParam } from "@/lib/i18n/currency"
import { siteConfig } from "@/lib/config"
import { tools } from "@/lib/tools"
import { EngineMark, type EngineId } from "./engine-marks"
import { ReportPreview, type ReportCopy } from "./report-preview"
import { HomeAction } from "./home-action"
import { RotatingHeadline } from "./rotating-headline"
import { Playbook } from "./playbook"
import { LatestPosts } from "./latest-posts"
import s from "./homepage.module.css"

const engines: { id: EngineId; name: string }[] = [
  { id: "chatgpt", name: "ChatGPT" }, { id: "gemini", name: "Gemini" },
  { id: "perplexity", name: "Perplexity" }, { id: "claude", name: "Claude" },
  { id: "aio", name: "AI Overviews" }, { id: "aimode", name: "AI Mode" },
  { id: "copilot", name: "Bing Copilot" }, { id: "grok", name: "Grok" },
]
const planIds: PlanId[] = ["starter", "consultant", "agency"]
const featuredTools = ["agent-readiness-scanner", "ai-crawler-checker", "keyword-to-prompts"]

function Arrow() {
  return <svg className={s.arrow} aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 10h12m-5-5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

export async function HomeExperience() {
  const locale = await getLocale()
  const t = await getTranslations("home")
  const base = locale === "en" ? "" : `/${locale}`
  const cards = t.raw("features.cards") as { tag: string; title: string; body: string }[]
  const steps = t.raw("howItWorks.steps") as { title: string; body: string }[]
  const signup = `${siteConfig.appSignupUrl}&plan=starter${currencyParam(locale)}`
  return <div className={s.home}>
    <section className={s.hero} aria-labelledby="home-title">
      <div className={s.container}>
        <div className={s.heroIntro}>
          <p className={s.eyebrow}>{t("hero.trust")}</p>
          <RotatingHeadline lead={t("hero.h1Lead")} accessible={t("hero.h1Sr")} pause={t("redesign.pause")} resume={t("redesign.resume")} />
          <p className={s.heroDescription}>{t("redesign.subhead")}</p>
          <div className={s.actions}>
            <HomeAction href={signup} placement="home_hero" locale={locale} className={s.primary}>{t("redesign.trial")}<Arrow /></HomeAction>
            <Link href="#how-it-works" className={s.secondary}>{t("hero.ctaSecondary")}</Link>
          </div>
          <p className={s.micro}>{t("redesign.trialTerms")}</p>
        </div>
        <ReportPreview copy={t.raw("redesign.report") as ReportCopy} locale={locale} />
        <div className={s.engineStrip}>
          <p>{t("redesign.engineNote")}</p>
          <ul>{engines.map(engine => <li key={engine.id}><EngineMark engine={engine.id} />{engine.name}</li>)}</ul>
        </div>
      </div>
    </section>

    <section id="features" className={s.section} aria-labelledby="workflow-title">
      <div className={s.container}>
        <div className={s.sectionHead}>
          <div><p className={s.eyebrow}>{t("features.eyebrow")}</p><h2 id="workflow-title" className={s.sectionTitle}>{t("redesign.workflowTitle")}</h2></div>
          <p className={s.sectionIntro}>{t("redesign.workflowIntro")}</p>
        </div>
        <div className={s.workflowGrid}>
          <figure className={s.productShot}>
            <span className={s.smallLabel}>GEO Toolbox / Content Analyzer</span>
            <a href="/screenshots/content-analyzer/citability-result.png" target="_blank" rel="noreferrer"><Image src="/screenshots/content-analyzer/citability-result.png" alt={t("redesign.screenshotAlt")} width={2048} height={1104} sizes="(max-width: 640px) 90vw, 550px" /></a>
            <figcaption>{t("redesign.screenshotNote")}</figcaption>
          </figure>
          <ol className={s.benefits}>
            {[0, 2, 3].map((index, i) => <li key={index}>
              <h3>{cards[index].title}</h3><p>{cards[index].body}</p>
              <Link className={s.textLink} href={`${base}/features/${["geo-scan", "content-analyzer", "competitor-intel"][i]}`}>{["GEO Scan", "Content Analyzer", "Competitor Intel"][i]}<Arrow /></Link>
            </li>)}
          </ol>
        </div>
        <Link href={`${base}/features`} className={s.textLink}>{t("features.exploreAll")}<Arrow /></Link>
      </div>
    </section>

    <section id="how-it-works" className={s.stepsSection} style={{scrollMarginTop:80}} aria-labelledby="steps-title">
      <div className={s.container}>
        <p className={s.eyebrow}>{t("howItWorks.eyebrow")}</p>
        <h2 id="steps-title" className={s.sectionTitle}>{t("howItWorks.h2")}</h2>
        <ol className={s.steps}>{steps.map((step,i) => <li key={step.title}><span className={s.stepNum}>0{i+1}</span><h3>{step.title}</h3><p>{step.body}</p></li>)}</ol>
      </div>
    </section>

    <section className={s.section} aria-labelledby="home-pricing-title">
      <div className={s.container}>
        <div className={s.sectionHead}>
          <div><p className={s.eyebrow}>{t("pricingTeaser.eyebrow")}</p><h2 id="home-pricing-title" className={s.sectionTitle}>{t("redesign.pricingTitle")}</h2></div>
          <p className={s.sectionIntro}>{t("redesign.pricingIntro")}</p>
        </div>
        <div className={s.priceGrid}>{planIds.map(id => {
          const plan = PLANS.find(p => p.id === id)!
          return <article key={id} className={s.priceCard}>
            <h3>{plan.name}</h3><p className={s.tagline}>{t(`pricingTeaser.tiles.${id}.tagline`)}</p>
            <p className={s.price}>{formatPrice(plan.priceMonthly!,locale)}<small>{t("pricingTeaser.perMonth")}</small></p>
            <p className={s.priceNote}>{t("redesign.monthly")}<br />{t("redesign.annual", { price: formatPrice(Math.round(plan.priceYearly!/12),locale) })}</p>
            <ul>{["engines","capacity","scans"].map(key => <li key={key}>{t(`pricingTeaser.tiles.${id}.${key}`)}</li>)}</ul>
            {plan.trialDays ? <HomeAction href={`${siteConfig.appSignupUrl}&plan=${id}${currencyParam(locale)}`} placement={`home_pricing_${id}`} locale={locale} className={id === "starter" ? s.primary : s.secondary}>{t("redesign.trial")}<Arrow /></HomeAction> : <Link href={`${base}/pricing`} className={s.secondary}>{t("redesign.compare")}<Arrow /></Link>}
          </article>
        })}</div>
        <div className={s.priceFoot}><p>{t("redesign.planTerms")}</p><Link href={`${base}/pricing`} className={s.textLink}>{t("pricingTeaser.seeAll")}<Arrow /></Link></div>
      </div>
    </section>

    <section className={`${s.section} ${s.toolsSection}`} aria-labelledby="home-tools-title">
      <div className={s.container}>
        <div className={s.sectionHead}>
          <div><p className={s.eyebrow}>{t("freeTools.eyebrow")}</p><h2 id="home-tools-title" className={s.sectionTitle}>{t("redesign.toolsTitle")}</h2></div>
          <p className={s.sectionIntro}>{t("redesign.toolsIntro")}</p>
        </div>
        <div className={s.toolGrid}>{featuredTools.map((slug,i) => {
          const tool = tools.find(tool => tool.slug === slug)!
          return <Link href={`/tools/${slug}`} key={slug} className={s.toolCard}><span aria-hidden="true" className={s.toolIcon}>{["◎","</>","↗"][i]}</span><h3>{tool.name}</h3><p>{t(`freeTools.descs.${slug}`)}</p><span>{t("redesign.openTool")}<Arrow /></span></Link>
        })}</div>
        <Link href="/tools" className={s.textLink} style={{marginTop:26}}>{t("freeTools.exploreAll")}<Arrow /></Link>
      </div>
    </section>
    <div className={s.retained}><Playbook /><LatestPosts /></div>
    <section className={s.closing} aria-labelledby="home-close-title">
      <div className={s.container}><p className={s.eyebrow}>{t("hero.trust")}</p><h2 id="home-close-title" className={s.sectionTitle}>{t("redesign.closeTitle")}</h2><p className={s.sectionIntro}>{t("redesign.closeBody")}</p>
        <div className={s.actions}><HomeAction href={signup} placement="home_footer" locale={locale} className={s.primary}>{t("redesign.trial")}<Arrow /></HomeAction><Link href={`${base}/pricing`} className={s.secondary}>{t("pricingTeaser.seeAll")}</Link></div>
        <p className={s.micro}>{t("redesign.trialTerms")}</p>
      </div>
    </section>
  </div>
}
