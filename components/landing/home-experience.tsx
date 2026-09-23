import Image from "next/image"
import Link from "next/link"
import { getLocale, getTranslations } from "next-intl/server"
import { PLANS, type PlanId } from "@/lib/plans"
import { formatPrice, currencyParam } from "@/lib/i18n/currency"
import { siteConfig } from "@/lib/config"
import { tools } from "@/lib/tools"
import { localizeNavHref } from "@/lib/i18n/nav"
import { EngineMark, type EngineId } from "./engine-marks"
import { ReportPreview, type ReportCopy } from "./report-preview"
import { HomeAction } from "./home-action"
import { RotatingHeadline } from "./rotating-headline"
import { Playbook } from "./playbook"
import { LatestPosts } from "./latest-posts"
import { ProofStrip } from "./proof-strip"
import s from "./homepage.module.css"

const engines: { id: EngineId; name: string }[] = [
  { id: "chatgpt", name: "ChatGPT" }, { id: "gemini", name: "Gemini" },
  { id: "perplexity", name: "Perplexity" }, { id: "claude", name: "Claude" },
  { id: "aio", name: "AI Overviews" }, { id: "aimode", name: "AI Mode" },
  { id: "copilot", name: "Bing Copilot" }, { id: "grok", name: "Grok" },
]
const planIds: PlanId[] = ["starter", "consultant", "agency"]
const featuredTools = [
  { slug: "agent-readiness-scanner", icon: "◎" },
  { slug: "ai-crawler-checker", icon: "</>" },
  { slug: "keyword-to-prompts", icon: "↗" },
]
// `card` indexes home.features.cards; keyed here so a reordered locale file can't
// pair one feature's copy with another feature's link.
const workflowFeatures = [
  { card: 0, slug: "geo-scan", name: "GEO Scan" },
  { card: 2, slug: "content-analyzer", name: "Content Analyzer" },
  { card: 3, slug: "competitor-intel", name: "Competitor Intel" },
]

function Arrow() {
  return <svg className={s.arrow} aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 10h12m-5-5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

export async function HomeExperience() {
  const locale = await getLocale()
  const t = await getTranslations("home")
  const base = locale === "en" ? "" : `/${locale}`
  const cards = t.raw("features.cards") as { tag: string; title: string; body: string }[]
  const steps = t.raw("howItWorks.steps") as { title: string; body: string }[]
  // SG_CTA_FREE_V1: the primary action is the free-scan door (no card). The trial
  // checkout is the secondary path, and each pricing card starts its own plan's trial.
  const freeScan = (ref: string) => `${siteConfig.appFreeScanUrl}&ref=${ref}`
  const trialHref = (id: PlanId) => `${siteConfig.appSignupUrl}&plan=${id}${currencyParam(locale)}`
  const trialPlans = new Intl.ListFormat(locale, { style: "long", type: "conjunction" })
    .format(PLANS.filter(p => p.trialDays).map(p => p.name))
  const freeMicro = (placement: string) => <p className={s.micro}>{t("redesign.freeTerms")} · <HomeAction href={trialHref("starter")} placement={placement} locale={locale} className={s.microLink}>{t("redesign.trialLink")}</HomeAction></p>
  return <div className={s.home}>
    <section className={s.hero} aria-labelledby="home-title">
      <div className={s.container}>
        <div className={s.heroIntro}>
          <p className={s.eyebrow}>{t("hero.trust")}</p>
          <RotatingHeadline lead={t("hero.h1Lead")} accessible={t("hero.h1Sr")} pause={t("redesign.pause")} resume={t("redesign.resume")} />
          <p className={s.heroDescription}>{t("redesign.subhead")}</p>
          <div className={s.actions}>
            <HomeAction href={freeScan("home-hero")} placement="home_hero" locale={locale} className={s.primary}>{t("redesign.freeCta")}<Arrow /></HomeAction>
            <Link href="#how-it-works" className={s.secondary}>{t("hero.ctaSecondary")}</Link>
          </div>
          {freeMicro("home_hero_trial")}
        </div>
        <ReportPreview copy={t.raw("redesign.report") as ReportCopy} locale={locale} />
        <div className={s.engineStrip}>
          <p>{t("redesign.engineNote")}</p>
          <ul>{engines.map(engine => <li key={engine.id}><EngineMark engine={engine.id} />{engine.name}</li>)}</ul>
        </div>
      </div>
    </section>
    <ProofStrip />

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
            {workflowFeatures.map(f => <li key={f.slug}>
              <h3>{cards[f.card].title}</h3><p>{cards[f.card].body}</p>
              <Link className={s.textLink} href={`${base}/features/${f.slug}`}>{f.name}<Arrow /></Link>
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
            {plan.trialDays ? <HomeAction href={trialHref(id)} placement={`home_pricing_${id}`} locale={locale} className={id === "starter" ? s.primary : s.secondary}>{t("redesign.trial")}<Arrow /></HomeAction> : <Link href={`${base}/pricing`} className={s.secondary}>{t("redesign.compare")}<Arrow /></Link>}
          </article>
        })}</div>
        <div className={s.priceFoot}><p>{t("redesign.planTerms", { plans: trialPlans })}</p><Link href={`${base}/pricing`} className={s.textLink}>{t("pricingTeaser.seeAll")}<Arrow /></Link></div>
      </div>
    </section>

    <section className={`${s.section} ${s.toolsSection}`} aria-labelledby="home-tools-title">
      <div className={s.container}>
        <div className={s.sectionHead}>
          <div><p className={s.eyebrow}>{t("freeTools.eyebrow")}</p><h2 id="home-tools-title" className={s.sectionTitle}>{t("redesign.toolsTitle")}</h2></div>
          <p className={s.sectionIntro}>{t("redesign.toolsIntro")}</p>
        </div>
        <div className={s.toolGrid}>{featuredTools.map(({ slug, icon }) => {
          const tool = tools.find(tool => tool.slug === slug)!
          return <Link href={localizeNavHref(`/tools/${slug}`, locale)} key={slug} className={s.toolCard}><span aria-hidden="true" className={s.toolIcon}>{icon}</span><h3>{tool.name}</h3><p>{t(`freeTools.descs.${slug}`)}</p><span>{t("redesign.openTool")}<Arrow /></span></Link>
        })}</div>
        <Link href={localizeNavHref("/tools", locale)} className={s.textLink} style={{marginTop:26}}>{t("freeTools.exploreAll")}<Arrow /></Link>
      </div>
    </section>
    <div className={s.retained}><Playbook /><LatestPosts /></div>
    <section className={s.closing} aria-labelledby="home-close-title">
      <div className={s.container}><h2 id="home-close-title" className={s.sectionTitle}>{t("redesign.closeTitle")}</h2><p className={s.sectionIntro}>{t("redesign.closeBody")}</p>
        <div className={s.actions}><HomeAction href={freeScan("home-close")} placement="home_footer" locale={locale} className={s.primary}>{t("redesign.freeCta")}<Arrow /></HomeAction><Link href={`${base}/pricing`} className={s.secondary}>{t("pricingTeaser.seeAll")}</Link></div>
        {freeMicro("home_footer_trial")}
      </div>
    </section>
  </div>
}
