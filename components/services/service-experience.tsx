import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import { FeatureFaq } from "@/components/features/feature-faq"
import { StickyServiceCta } from "./sticky-cta"
import { ProofResults } from "./proof-results"
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

function OfferCard({ offer, index, callHref }: { offer: Offer; index: number; callHref: string }) {
  const href = offer.cta?.href ?? callHref
  return <article className={styles.offer}>
    <p className={styles.eyebrow}>{["01 / Find the opportunity", "02 / Ship the work", "03 / Keep improving"][index] ?? offer.chip}</p>
    <h3>{offer.name}</h3>
    <p className={styles.price}>{offer.pricePrefix && <small>{offer.pricePrefix} </small>}{offer.price}<small>{offer.cadence}</small></p>
    <p className={styles.billing}>{offer.billing}</p>
    <p className={styles.offerSummary}>{offer.summary}</p>
    <details className={styles.scope}><summary>What’s included</summary><p>{offer.detail}</p></details>
    <a href={href} className={index === 0 ? styles.primary : styles.secondary}
      {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {offer.cta?.label ?? "Book a call"}<span aria-hidden="true">↗</span>
    </a>
  </article>
}

export function ServiceExperience(p: Props) {
  const auto = p.automation
  const { google, asOf } = proofStats
  return <div className={styles.page}>
    {p.children}
    <section className={styles.hero}>
      <div className={styles.wrap}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/services/ai-seo-agency">Services</Link><span>/</span><span>{p.eyebrow}</span></nav>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{p.eyebrow} · Founder-led delivery</p>
          <h1>{p.title}<br /><span>{p.accent}</span></h1>
          <p className={styles.intro}>{p.description}</p>
          <div className={styles.actions}><a href={p.callHref} target="_blank" rel="noopener noreferrer" className={styles.primary}>Book an intro call <span aria-hidden="true">↗</span></a><a href="#pricing" className={styles.secondary}>{auto ? "Explore engagements" : "See services & pricing"}<span aria-hidden="true">↓</span></a></div>
          <p className={styles.micro}>Free intro call · {auto ? "Fixed project quotes" : "Report from $1,250"} · You own the work</p>
        </div>
        <div className={styles.heroFoot}>
          <div className={styles.founder}>{PRIMARY_AUTHOR.avatar && <Image src={PRIMARY_AUTHOR.avatar} width={40} height={40} alt="" />}<p><strong>{PRIMARY_AUTHOR.name}</strong><span>The founder who built GEO Toolbox leads your project.</span></p></div>
          <a href="#results" className={styles.proofLink}>{auto ? "See shipped client systems" : "See the evidence"} <span aria-hidden="true">↓</span></a>
        </div>
      </div>
    </section>

    <section id="results" className={styles.proof}>
      <div className={styles.wrap}>
        {auto ? <>
          <div className={styles.sectionHead}><div><p className={styles.eyebrow}>Built for real workflows</p><h2>Systems already in use.</h2></div><p>Examples of delivered client work. Each project starts with a specific workflow and a defined output.</p></div>
          <div className={styles.builds}>{p.builds?.map(b => <article key={b.system}><p className={styles.eyebrow}>{b.label}</p><h3>{b.system}</h3><p>{b.points[0]}</p><details><summary>Build details</summary><p>{b.points.slice(1).join(" ")}</p></details></article>)}</div>
        </> : <>
          <div className={styles.proofGrid}>
            <div><p className={styles.eyebrow}>Our own site · measured in Google</p><h2>Built with the process<br />we use for clients.</h2><p className={styles.note}>GeoToolbox’s own domain. Historical evidence, not a forecast for your site.</p></div>
            <div className={styles.stat}><strong>{google.rankedKeywords.toLocaleString("en-US")}</strong><span>Unique queries ranked in Google</span></div>
            <div className={styles.stat}><strong>{google.top10.toLocaleString("en-US")}</strong><span>Unique queries in Google’s top 10</span></div>
          </div>
          <p className={styles.source}>Source: Google Search Console API · trailing {google.windowDays} days · as of {asOf}.</p>
          <details className={styles.evidence}><summary>Explore the evidence, AI appearances & methodology <span aria-hidden="true">+</span></summary><div className={styles.clientProof}>
            <h3>Client work before GEO Toolbox</h3>
            <p>Two guides on one unnamed client’s site, led by Samy before GEO Toolbox. Historical public scans from an earlier seven-engine tracker; these are citation results for the specific prompts shown.</p>
            <div className={styles.advanced}>
              <figure><Image src="/services/track-record/legal-ai-scan.png" width={1999} height={1602} alt="Historical scan for how to run Google Ads for lawyers: the client guide was cited by 7 of 7 engines." sizes="(max-width: 640px) 100vw, 500px" /><figcaption>Legal guide · cited by 7 of 7 engines in this scan.</figcaption></figure>
              <figure><Image src="/services/track-record/crypto-ai-scan.png" width={2208} height={1742} alt="Historical scan for how to run crypto Google Ads without getting disapproved: the client guide was cited by 6 of 7 engines." sizes="(max-width: 640px) 100vw, 500px" /><figcaption>Crypto guide · cited by 6 of 7 engines in this scan.</figcaption></figure>
            </div>
          </div><ProofResults id="detailed-evidence" /></details>
        </>}
      </div>
    </section>

    <section id="pricing" className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}><div><p className={styles.eyebrow}>{auto ? "Choose your starting point" : "Services & pricing"}</p><h2>{auto ? "Start with one workflow." : "Start with clarity. Then build."}</h2></div><p>{auto ? "Map the opportunity, build a focused pilot, or get ongoing support for a system we built or audited." : "Buy a one-off diagnostic, scope a 30-day sprint, or work with us every month. Choose the level of help you need."}</p></div>
        <div className={styles.offers}>{p.offers.slice(0, 3).map((offer, i) => <OfferCard key={offer.name} offer={offer} index={i} callHref={p.callHref} />)}</div>
        {!auto && <div className={styles.terms}><p><strong>Report fee credited</strong> toward a Sprint or retainer when you continue within 14 days.</p><p>The Sprint counts as month one of a retainer if you continue within 30 days. Growth starts with a 90-day commitment, then runs month to month.</p></div>}
        {p.offers.length > 3 && <details className={styles.expand}><summary>Need more capacity? Priority Growth & Scale <span aria-hidden="true">+</span></summary><div className={styles.advanced}>{p.offers.slice(3).map((offer, i) => <OfferCard key={offer.name} offer={offer} index={i + 3} callHref={p.callHref} />)}</div></details>}
        {!!p.addons?.length && <details className={styles.expand}><summary>Content, authority & delivery add-ons <span aria-hidden="true">+</span></summary><div className={styles.addons}>{p.addons.map(a => <article key={a.name}><h3>{a.name}</h3><strong>{a.price} <small>{a.unit}</small></strong><p>{a.detail}</p>{a.cta && <a className={styles.textLink} href={a.cta.href}>{a.cta.label} ↗</a>}</article>)}</div><p className={styles.note}>Content offers exclude GEO, SEO and AI-visibility topics. Add-ons extend the agreed scope; they do not reprice the base engagement.</p></details>}
      </div>
    </section>

    <section className={styles.workflow}>
      <div className={styles.wrap}><p className={styles.eyebrow}>What gets delivered</p><h2>{auto ? "From your process to a working system." : "A clear output at every step."}</h2><ol className={styles.steps}>{p.steps.map((s, i) => <li key={s.title}><span className={styles.number}>0{i + 1}</span><h3>{s.title}</h3><p>{s.body}</p><span className={styles.output}>{s.output}</span></li>)}</ol></div>
    </section>

    <section className={styles.section}><div className={styles.wrap}>
      <div className={styles.fit}><div><p className={styles.eyebrow}>Is this a fit?</p><h2>{auto ? "A repeatable process. A clear owner." : "For teams ready to act on the findings."}</h2></div><div><p>{auto ? "Bring a recurring task, examples of its inputs and outputs, and access to the tools involved. We define the approval points before building." : "Your buyers research before purchasing. Your site has real expertise to share. Your team can provide access, review the work and ship changes."}</p><p className={styles.note}>{auto ? "You own the code, prompts, documentation and data. Ongoing support is scoped separately." : "You own every page and dataset. Rankings and AI citations are not guaranteed. The delivery guarantee refunds a missed milestone when access and feedback were supplied on time."}</p></div></div>
      {!!p.context?.length && <details className={styles.expand}><summary>{auto ? "Skills, agents or a custom tool?" : "Understand the service & its scope"}<span aria-hidden="true">+</span></summary><div className={styles.addons}>{p.context.map(c => <article key={c.title}><h3>{c.title}</h3><p>{c.body}</p></article>)}</div></details>}
    </div></section>
    <FeatureFaq items={p.faqs} heading={auto ? "Before we build" : "Before we work together"} defaultOpenIndex={-1} />
    <section className={styles.closing}><div className={styles.wrap}><p className={styles.eyebrow}>Your next step</p><h2>{auto ? "What would you stop doing manually?" : "Find your next AI visibility opportunity."}</h2><p>{auto ? "Bring one workflow. We’ll discuss the scope, risks and whether it is worth automating." : "Tell us your domain and goals. We’ll discuss where a report, sprint or ongoing engagement fits."}</p><div className={styles.actions}><a href={p.callHref} className={styles.primary} target="_blank" rel="noopener noreferrer">Book an intro call ↗</a></div><nav aria-label="Related services" className={styles.related}><Link href="/services/ai-seo-agency">AI SEO</Link><Link href="/services/generative-engine-optimization">GEO services</Link><Link href="/services/answer-engine-optimization">AEO services</Link><Link href="/services/ai-automation-agency">AI automation</Link></nav></div></section>
    <StickyServiceCta callHref={p.callHref} pricingHref="#pricing" pricingLabel={auto ? "Engagements" : "See pricing"} message={auto ? "Founder-led AI systems. Built for your workflow." : undefined} />
  </div>
}
