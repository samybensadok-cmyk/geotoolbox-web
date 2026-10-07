import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import { FeatureFaq } from "@/components/features/feature-faq"
import { StickyServiceCta } from "./sticky-cta"
import { GrowthCharts } from "./growth-charts"
import { PRIMARY_AUTHOR } from "@/lib/authors"
import { proofStats } from "@/lib/proof-stats"
import styles from "./service-experience.module.css"

type Offer = {
  name: string; price: string; pricePrefix?: string; cadence?: string
  billing: string; summary: string; detail: string; chip: string
  cta?: { href: string; label: string }; kind?: string; featured?: boolean
}
type Addon = { name: string; price: string; unit: string; detail: string; cta?: { href: string; label: string } }
type Step = { title: string; body: string; output: string }
type Props = {
  eyebrow: string; title: string; accent: string; description: string; callHref: string
  offers: Offer[]; steps: Step[]; faqs: { question: string; answer: string }[]
  addons?: Addon[]; automation?: boolean; children?: ReactNode
  context?: { title: string; body: string }[]
  builds?: { label: string; system: string; points: string[] }[]
}

const fmt = (n: number) => n.toLocaleString("en-US")
// 270800 → "270.8K", 597000 → "597K", 41912 → "41.9K"
const compact = (n: number) => n >= 1000 ? `${(Math.round(n / 100) / 10).toLocaleString("en-US")}K` : fmt(n)

const ext = (href: string) => href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {}

// The three entry offers map 1:1 onto the delivery steps (report → baseline,
// sprint/pilot → shipped work, retainer → ongoing log), so each card carries
// its step's deliverable instead of repeating the steps in a separate band.
function OfferCard({ offer, step, index, callHref, lead }: { offer: Offer; step?: Step; index: number; callHref: string; lead?: boolean }) {
  const href = offer.cta?.href ?? callHref
  return <article className={lead ? `${styles.offer} ${styles.lead}` : styles.offer}>
    <div className={styles.offerTop}>
      <p className={styles.eyebrow}>{step ? `${String(index + 1).padStart(2, "0")} · ${step.title}` : offer.chip}</p>
      {lead && <span className={styles.badge}>Start here</span>}
    </div>
    <h3>{offer.name}</h3>
    <p className={styles.price}>{offer.pricePrefix && <small>{offer.pricePrefix} </small>}{offer.price}{offer.cadence && <small>{offer.cadence}</small>}</p>
    <p className={styles.billing}>{offer.billing}</p>
    <p className={styles.offerSummary}>{offer.summary}</p>
    {step && <p className={styles.deliverable}><span aria-hidden="true">→</span> You get: <strong>{step.output}</strong></p>}
    <details className={styles.scope}><summary>What’s included <span aria-hidden="true">+</span></summary><p>{offer.detail}</p></details>
    <a href={href} className={lead ? styles.primary : styles.secondary} {...ext(href)}>
      {offer.cta?.label ?? "Book a call"}<span aria-hidden="true">{href.startsWith("http") ? "↗" : href.startsWith("#") ? "↓" : "→"}</span>
    </a>
  </article>
}

export function ServiceExperience(p: Props) {
  const auto = p.automation
  const { google, asOf, aiCitations, googleAiFeatures, weeksToResult } = proofStats
  return <div className={styles.page}>
    {p.children}
    <section className={styles.hero}>
      <div className={styles.wrap}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/services/ai-seo-agency">Services</Link><span>/</span><span>{p.eyebrow}</span></nav>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{p.eyebrow} · Founder-led delivery</p>
          <h1>{p.title}<br /><span>{p.accent}</span></h1>
          <p className={styles.intro}>{p.description}</p>
          <div className={styles.actions}><a href={p.callHref} target="_blank" rel="noopener noreferrer" className={styles.primary}>Book an intro call <span aria-hidden="true">↗</span></a><a href="#pricing" className={styles.secondary}>{auto ? "See engagements" : "See pricing"}<span aria-hidden="true">↓</span></a></div>
          <p className={styles.micro}>Free 30-min call · {auto ? "Fixed project quotes" : "Report from $1,250"} · You own the work</p>
        </div>
        <div className={styles.heroFoot}>
          <div className={styles.founder}>{PRIMARY_AUTHOR.avatar && <Image src={PRIMARY_AUTHOR.avatar} width={40} height={40} alt="" />}<p><strong>{PRIMARY_AUTHOR.name}</strong><span>Built GEO Toolbox. Leads your project.</span></p></div>
          {auto
            ? <a href="#results" className={styles.proofLink}>See shipped client systems <span aria-hidden="true">↓</span></a>
            : <a href="#results" className={styles.heroProof} aria-label={`Our own site: ${compact(aiCitations.total)} Bing AI appearances and ${compact(googleAiFeatures.impressions)} Google AI-answer impressions in 3 months, ${compact(google.rankedKeywords)} Google queries ranked in ${google.windowDays} days. See the evidence.`}>
                <span><strong>{compact(aiCitations.total)}</strong>Bing AI appearances · 3 mo</span>
                <span><strong>{compact(googleAiFeatures.impressions)}</strong>Google AI-answer impressions · 3 mo</span>
                <span><strong>{compact(google.rankedKeywords)}</strong>Google queries ranked · {google.windowDays} days</span>
                <em>Our own site · see the evidence ↓</em>
              </a>}
        </div>
      </div>
    </section>

    <section id="results" className={styles.proof}>
      <div className={styles.wrap}>
        {auto ? <>
          <div className={styles.sectionHead}><div><p className={styles.eyebrow}>Built for real workflows</p><h2>Systems already in use.</h2></div><p>Delivered client work. Each project starts with one workflow and a defined output.</p></div>
          <div className={styles.builds}>{p.builds?.map(b => <article key={b.system}><p className={styles.eyebrow}>{b.label}</p><h3>{b.system}</h3><p>{b.points[0]}</p><details><summary>Build details <span aria-hidden="true">+</span></summary><p>{b.points.slice(1).join(" ")}</p></details></article>)}</div>
        </> : <>
          <div className={styles.sectionHead}>
            <div><p className={styles.eyebrow}>The results · GEO Toolbox’s own site</p><h2>We ran the playbook<br />on ourselves first.</h2></div>
            <p>First meaningful AI citations in about {weeksToResult} weeks. Here is what the same work produced since. Our own site, not a forecast for yours.</p>
          </div>
          <dl className={styles.resultMetrics}>
            <div className={styles.aiMetric}>
              <dt>Appearances in Copilot & partner AI answers</dt><dd className={styles.metricValue}>~{fmt(aiCitations.total)}</dd>
              <dd>Bing Webmaster Tools · AI Performance · {aiCitations.windowLabel}</dd>
              <dd className={styles.metricNote}>Sampled appearances, not unique citations.</dd>
            </div>
            <div className={styles.aiMetric}>
              <dt>Appearances in Google’s AI answers</dt><dd className={styles.metricValue}>~{fmt(googleAiFeatures.impressions)}</dd>
              <dd>Search Console · {googleAiFeatures.surfaces} · {googleAiFeatures.windowLabel}</dd>
              <dd className={styles.metricNote}>Link impressions, not clicks or unique citations.</dd>
            </div>
            <div>
              <dt>Queries ranked in Google</dt><dd className={styles.metricValue}>{fmt(google.rankedKeywords)}</dd>
              <dd>Search Console API · {google.windowDays} days to {google.windowEnd}</dd>
            </div>
            <div>
              <dt>Queries on Google’s first page</dt><dd className={styles.metricValue}>{fmt(google.top10)}</dd>
              <dd>Search Console API · {google.windowDays} days to {google.windowEnd}</dd>
            </div>
          </dl>
          <div className={styles.growthCharts}><GrowthCharts variant="light" /></div>
          <p className={styles.source}>Charts: unique Google queries per calendar month (Search Console API, as of {asOf}). The two AI figures come from different reports and windows and are never added together.</p>
          <details className={styles.evidence}><summary>Client results & measurement notes <span aria-hidden="true">+</span></summary><div className={styles.clientProof}>
            <h3>Client work before GEO Toolbox</h3>
            <p>Two guides on one unnamed client’s site, led by Samy before GEO Toolbox. Historical public scans from an earlier seven-engine tracker; these are citation results for the specific prompts shown.</p>
            <div className={styles.advanced}>
              <figure><Image src="/services/track-record/legal-ai-scan.png" width={1999} height={1602} alt="Historical scan for how to run Google Ads for lawyers: the client guide was cited by 7 of 7 engines." sizes="(max-width: 640px) 100vw, 500px" /><figcaption>Legal guide · cited by 7 of 7 engines in this scan.</figcaption></figure>
              <figure><Image src="/services/track-record/crypto-ai-scan.png" width={2208} height={1742} alt="Historical scan for how to run crypto Google Ads without getting disapproved: the client guide was cited by 6 of 7 engines." sizes="(max-width: 640px) 100vw, 500px" /><figcaption>Crypto guide · cited by 6 of 7 engines in this scan.</figcaption></figure>
            </div>
          </div><div className={styles.measurementNotes}>
            <p>The Copilot figure is the total in Bing Webmaster Tools’ AI Performance report (Microsoft Copilot and partners), {aiCitations.windowLabel}, read {aiCitations.asOf}. It is not attributed to ChatGPT, Perplexity or Google.</p>
            <p>Google’s figure comes from the Search Console “Generative AI features” report and counts appearances of a geotoolbox.ai link in AI Overviews and AI Mode, {googleAiFeatures.windowLabel}, read {googleAiFeatures.asOf}. Both AI figures are recorded by hand; neither report has an API.</p>
            <p>Google ranking totals use a trailing {google.windowDays}-day window. The charts use calendar months, so their totals can differ from the tiles. They show Google ranking growth, not an AI citation time series.</p>
          </div></details>
        </>}
      </div>
    </section>

    <section id="pricing" className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}><div><p className={styles.eyebrow}>{auto ? "Engagements" : "Services & pricing"}</p><h2>{auto ? "Start with one workflow." : "Start small. Scale what works."}</h2></div><p>{auto ? "Map the opportunity, build a focused pilot, or get ongoing support for a system we built or audited." : "A one-off diagnostic, a 30-day sprint, or a monthly retainer. Each step builds on the last."}</p></div>
        <div className={styles.offers}>{p.offers.slice(0, 3).map((offer, i) => <OfferCard key={offer.name} offer={offer} step={p.steps[i]} index={i} callHref={p.callHref} lead={i === 0} />)}</div>
        {!auto && <ul className={styles.terms}>
          <li><strong>Report fee credited</strong> to a Sprint or retainer within 14 days.</li>
          <li><strong>Sprint counts as month one</strong> of a retainer within 30 days.</li>
          <li><strong>Growth:</strong> 90-day commitment, then month to month.</li>
        </ul>}
        {p.offers.length > 3 && <details className={styles.expand}><summary>Need more capacity? Priority Growth & Scale <span aria-hidden="true">+</span></summary><div className={styles.advanced}>{p.offers.slice(3).map((offer, i) => <OfferCard key={offer.name} offer={offer} index={i + 3} callHref={p.callHref} />)}</div></details>}
        {!!p.addons?.length && <details className={styles.expand}><summary>Content, authority & delivery add-ons <span aria-hidden="true">+</span></summary><div className={styles.addons}>{p.addons.map(a => <article key={a.name}><h3>{a.name}</h3><strong>{a.price} <small>{a.unit}</small></strong><p>{a.detail}</p>{a.cta && <a className={styles.textLink} href={a.cta.href}>{a.cta.label} ↗</a>}</article>)}</div><p className={styles.note}>Content offers exclude GEO, SEO and AI-visibility topics. Add-ons extend the agreed scope; they do not reprice the base engagement.</p></details>}
        {!!p.context?.length && <details className={styles.expand}><summary>{auto ? "Skills, agents or a custom tool?" : "What the service covers, and what it doesn’t"} <span aria-hidden="true">+</span></summary><div className={styles.addons}>{p.context.map(c => <article key={c.title}><h3>{c.title}</h3><p>{c.body}</p></article>)}</div></details>}
      </div>
    </section>

    <FeatureFaq items={p.faqs} heading={auto ? "Before we build" : "Before we work together"} defaultOpenIndex={-1} compact />

    <section className={styles.closing}><div className={styles.wrap}>
      <div className={styles.closingGrid}>
        <div>
          <p className={styles.eyebrow}>Is this a fit?</p>
          <h2>{auto ? "What would you stop doing manually?" : "Find your next AI visibility win."}</h2>
          <p>{auto ? "Bring one recurring task, examples of its inputs and outputs, and access to the tools involved. We define approval points before building." : "Your buyers research before they buy, your site has real expertise, and your team can review and ship changes. Bring your domain and goals."}</p>
          <div className={styles.actions}><a href={p.callHref} className={styles.primary} target="_blank" rel="noopener noreferrer">Book an intro call <span aria-hidden="true">↗</span></a></div>
        </div>
        <ul className={styles.promises}>
          {(auto
            ? ["You own the code, prompts, documentation and data.", "Fixed fee for the blueprint, fixed quote for the build.", "The blueprint is yours, even if it says don’t build."]
            : ["You own every page and dataset.", "A missed milestone is refunded when access and feedback arrive on time.", "Rankings and AI citations are not guaranteed."]
          ).map(t => <li key={t}>{t}</li>)}
        </ul>
      </div>
      <nav aria-label="Related services" className={styles.related}><span>Other services</span><Link href="/services/ai-seo-agency">AI SEO</Link><Link href="/services/generative-engine-optimization">GEO</Link><Link href="/services/answer-engine-optimization">AEO</Link><Link href="/services/ai-automation-agency">AI automation</Link></nav>
    </div></section>
    <StickyServiceCta callHref={p.callHref} pricingHref="#pricing" pricingLabel={auto ? "Engagements" : "See pricing"} message={auto ? "Founder-led AI systems. Built for your workflow." : undefined} />
  </div>
}
