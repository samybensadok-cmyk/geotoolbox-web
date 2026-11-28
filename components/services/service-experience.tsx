import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import { DarkPage, Index, SectionHead, Check, kit } from "@/components/brand/dark-kit"
import { StickyServiceCta } from "./sticky-cta"
import { GrowthCharts } from "./growth-charts"
import { PRIMARY_AUTHOR } from "@/lib/authors"
import { proofStats } from "@/lib/proof-stats"
import s from "./service-experience.module.css"
import { BfRetainerNote, BfServiceLabel, BfServicePrice, BfServicesBand } from "./black-friday-services"

type Offer = {
  name: string; price: string; pricePrefix?: string; cadence?: string
  billing: string; summary: string; chip: string
  // `deliverables` is the visible list; `detail` is whatever scope/terms text is left once the list is split out
  // of it (an empty string means nothing is left and no disclosure is rendered).
  detail: string; deliverables?: string[]
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
// 325100 → "325.1K", 1290000 → "1.29M", 41912 → "41.9K"
const compact = (n: number) =>
  n >= 1e6 ? `${(Math.round(n / 1e4) / 100).toLocaleString("en-US")}M`
  : n >= 1000 ? `${(Math.round(n / 100) / 10).toLocaleString("en-US")}K` : fmt(n)

const ext = (href: string) => href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {}

/** The H1's second line with its last word marked (words unchanged; trailing punctuation stays outside the mark). */
function Accent({ text }: { text: string }) {
  const m = /^([\s\S]*?)(\S+?)([.!?]*)$/.exec(text)
  if (!m || !m[2]) return <>{text}</>
  return <>{m[1]}<span className={kit.hl}>{m[2]}</span>{m[3]}</>
}

// The three entry offers map 1:1 onto the delivery steps (report → baseline,
// sprint/pilot → shipped work, retainer → ongoing log), so each card carries
// its step's deliverable instead of repeating the steps in a separate band.
// Every card renders the same 10 row slots (optional ones as empty wrappers) and
// side-by-side cards share row tracks (CSS subgrid), so names, prices, billing
// lines, lists and CTAs sit on one line across the row.
function OfferCard({ offer, step, index, callHref, lead, auto }: { offer: Offer; step?: Step; index: number; callHref: string; lead?: boolean; auto?: boolean }) {
  const href = offer.cta?.href ?? callHref
  const hasList = !!offer.deliverables?.length
  return <article className={`${lead ? `${kit.cardLime} ${s.leadCard}` : kit.card} ${s.offer}`}>
    <div className={s.offerTop}>
      <p className={s.offerEyebrow}>{step ? `${String(index + 1).padStart(2, "0")} · ${step.title}` : offer.chip}</p>
      {lead && <span className={kit.badge}>Start here</span>}
    </div>
    <h3 className={s.offerName}>{offer.name}</h3>
    <p className={s.price}>{offer.pricePrefix && <small>{offer.pricePrefix} </small>}<BfServicePrice price={offer.price} href={offer.cta?.href} size="lg" />{offer.cadence && <small>{offer.cadence}</small>}</p>
    <div className={s.slot}>{!auto && <BfRetainerNote href={href} />}</div>
    <p className={s.billing}>{offer.billing}</p>
    <p className={s.offerSummary}>{offer.summary}</p>
    <div className={s.slot}>{step && <p className={s.deliverable}><span aria-hidden="true">→</span> You get: <strong>{step.output}</strong></p>}</div>
    <div className={s.slot}>{hasList && <ul className={`${kit.checklist} ${s.includes}`} aria-label="What’s included">{offer.deliverables!.map(d => <li key={d}><Check />{d}</li>)}</ul>}</div>
    <div className={s.slot}>{offer.detail && <details className={`${s.disclosure} ${s.scope}`}><summary>{hasList ? "Scope & terms" : "What’s included"} <span aria-hidden="true">+</span></summary><p>{offer.detail}</p></details>}</div>
    <a href={href} data-cta-placement={`offer_card_${index + 1}`} className={`${lead ? kit.btnLime : kit.btnOutline} ${s.offerCta}`} {...ext(href)}>
      {offer.cta?.label ? <BfServiceLabel label={offer.cta.label} href={offer.cta.href} /> : "Book a call"}<span aria-hidden="true">{href.startsWith("http") ? "↗" : href.startsWith("#") ? "↓" : "→"}</span>
    </a>
  </article>
}

/** FAQ in the kit's look. The FAQPage JSON-LD object is the same one the shared FAQ component emits. */
function ServiceFaq({ items, heading, n }: { items: { question: string; answer: string }[]; heading: string; n: string }) {
  if (items.length === 0) return null

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }

  return (
    <section className={`${kit.section} ${kit.sectionBorder} ${s.faqSection}`}>
      <div className={`${kit.wrap} ${s.faqGrid}`}>
        <div>
          <Index n={n} label="FAQ" />
          <h2 className={s.faqTitle}>{heading}</h2>
        </div>
        <ul className={`${kit.faq} ${s.faqList}`}>
          {items.map((item, i) => (
            <li key={i}>
              <details>
                <summary>
                  <span className={s.faqQ}>
                    <span className={s.faqNum}>{String(i + 1).padStart(2, "0")}</span>
                    <span>{item.question}</span>
                  </span>
                </summary>
                <div>{item.answer}</div>
              </details>
            </li>
          ))}
        </ul>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  )
}

export function ServiceExperience(p: Props) {
  const auto = p.automation
  const { google, asOf, aiCitations, googleAiFeatures, weeksToResult } = proofStats
  return <DarkPage className={s.page}>
    {p.children}
    {!auto && <BfServicesBand />}
    <section className={`${s.hero} ${kit.heroGlow}`}>
      <div className={kit.wrap}>
        <nav className={s.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/services/ai-seo-agency">Services</Link><span>/</span><span>{p.eyebrow}</span></nav>
        <div className={s.heroCopy}>
          <Index label={`${p.eyebrow} · Founder-led delivery`} />
          <h1 className={`${kit.heroTitle} ${s.h1}`}>{p.title}<br /><span><Accent text={p.accent} /></span></h1>
        </div>
        <div className={s.heroSplit}>
          <div>
            <p className={`${kit.heroLead} ${s.intro}`}>{p.description}</p>
            <div className={kit.ctaRow}><a href={p.callHref} data-cta-placement="hero" target="_blank" rel="noopener noreferrer" className={kit.btnLime}>Book an intro call <span aria-hidden="true">↗</span></a><a href="#pricing" className={kit.btnOutline}>{auto ? "See engagements" : "See pricing"}<span aria-hidden="true">↓</span></a></div>
            <p className={s.micro}>Free 30-min call · {auto ? "Fixed project quotes" : <BfServiceLabel label="Report from $1,250" href="/app/?action=service_checkout&item=report" />}{auto ? " · You own the work" : ""}</p>
            {!auto && <ul className={`${kit.checklist} ${s.trust}`} aria-label="Terms in short"><li><Check />Report fee credited to a Sprint or retainer within 14 days</li><li><Check />You own every page and dataset</li></ul>}
          </div>
          <div className={s.heroAside}>
            <div className={s.founder}>{PRIMARY_AUTHOR.avatar && <Image src={PRIMARY_AUTHOR.avatar} width={40} height={40} alt="" />}<p><strong>{PRIMARY_AUTHOR.name}</strong><span>Built GEO Toolbox. Leads your project.</span></p></div>
            {auto
              ? <a href="#results" className={`${kit.textLink} ${s.proofLink}`}>See shipped client systems <span aria-hidden="true">↓</span></a>
              : <a href="#results" className={s.heroProof} aria-label={`Our own site: ${compact(aiCitations.total)} Bing AI appearances and ${compact(googleAiFeatures.impressions)} Google AI-answer impressions in 3 months, ${compact(google.rankedKeywords)} Google queries ranked in ${google.windowDays} days. See the evidence.`}>
                  <span><strong>{compact(aiCitations.total)}</strong>Bing AI appearances · 3 mo</span>
                  <span><strong>{compact(googleAiFeatures.impressions)}</strong>Google AI-answer impressions · 3 mo</span>
                  <span><strong>{compact(google.rankedKeywords)}</strong>Google queries ranked · {google.windowDays} days</span>
                  <em>Our own site · see the evidence ↓</em>
                </a>}
          </div>
        </div>
      </div>
    </section>

    <section id="results" className={`${kit.band} ${s.results}`}>
      <div className={kit.wrap}>
        {auto ? <>
          <SectionHead n="01" label="Built for real workflows" title="Systems already in use." lead="Delivered client work. Each project starts with one workflow and a defined output." />
          <div className={s.builds}>{p.builds?.map(b => <article key={b.system} className={kit.card}><p className={s.buildLabel}>{b.label}</p><h3 className={s.buildTitle}>{b.system}</h3><p className={s.buildBody}>{b.points[0]}</p><details className={s.disclosure}><summary>Build details <span aria-hidden="true">+</span></summary><p>{b.points.slice(1).join(" ")}</p></details></article>)}</div>
        </> : <>
          <SectionHead
            n="01" label="The results · GEO Toolbox’s own site"
            title={<>We ran the playbook<br />on ourselves first.</>}
            lead={<>First meaningful AI citations in about {weeksToResult} weeks. Here is what the same work produced since. Our own site, not a forecast for yours.</>}
          />
          <dl className={s.ledger}>
            <div className={`${s.cell} ${s.cellAi}`}>
              <dt className={s.cellTag}>Appearances in Copilot & partner AI answers</dt><dd className={s.cellNum}>~{fmt(aiCitations.total)}</dd>
              <dd className={s.cellSrc}>Bing Webmaster Tools · AI Performance · {aiCitations.windowLabel}</dd>
              <dd className={s.cellNote}>Sampled appearances, not unique citations.</dd>
            </div>
            <div className={`${s.cell} ${s.cellAi}`}>
              <dt className={s.cellTag}>Appearances in Google’s AI answers</dt><dd className={s.cellNum}>~{fmt(googleAiFeatures.impressions)}</dd>
              <dd className={s.cellSrc}>Search Console · {googleAiFeatures.surfaces} · {googleAiFeatures.windowLabel}</dd>
              <dd className={s.cellNote}>Link impressions, not clicks or unique citations.</dd>
            </div>
            <div className={s.cell}>
              <dt className={s.cellTag}>Queries ranked in Google</dt><dd className={s.cellNum}>{fmt(google.rankedKeywords)}</dd>
              <dd className={s.cellSrc}>Search Console API · {google.windowDays} days to {google.windowEnd}</dd>
            </div>
            <div className={s.cell}>
              <dt className={s.cellTag}>Queries on Google’s first page</dt><dd className={s.cellNum}>{fmt(google.top10)}</dd>
              <dd className={s.cellSrc}>Search Console API · {google.windowDays} days to {google.windowEnd}</dd>
            </div>
          </dl>
          <div className={s.charts}><GrowthCharts variant="kit" /></div>
          <p className={s.source}>Charts: unique Google queries per calendar month (Search Console API, as of {asOf}). The two AI figures come from different reports and windows and are never added together.</p>
          <section className={s.evidence} aria-label="Client results and measurement notes"><div className={s.clientProof}>
            <h3 className={s.clientTitle}>Client work before GEO Toolbox</h3>
            <p className={s.clientLead}>Two guides on one unnamed client’s site, led by Samy before GEO Toolbox. Historical public scans from an earlier seven-engine version of GEO Scan; these are citation results for the specific prompts shown.</p>
            <div className={s.figures}>
              <figure className={`${kit.frame} ${s.figure}`}><Image src="/services/track-record/legal-ai-scan-v2.png" width={1999} height={1602} alt="Historical scan for how to run Google Ads for lawyers: the client guide was cited by 7 of 7 engines." sizes="(max-width: 640px) 100vw, 500px" /><figcaption>Legal guide · cited by 7 of 7 engines in this scan.</figcaption></figure>
              <figure className={`${kit.frame} ${s.figure}`}><Image src="/services/track-record/crypto-ai-scan-v2.png" width={2208} height={1742} alt="Historical scan for how to run crypto Google Ads without getting disapproved: the client guide was cited by 6 of 7 engines." sizes="(max-width: 640px) 100vw, 500px" /><figcaption>Crypto guide · cited by 6 of 7 engines in this scan.</figcaption></figure>
            </div>
          </div><div className={s.notes}>
            <p className={s.notesLabel}>Measurement notes</p>
            <p>The Copilot figure is the total in Bing Webmaster Tools’ AI Performance report (Microsoft Copilot and partners), {aiCitations.windowLabel}, read {aiCitations.asOf}. It is not attributed to ChatGPT, Perplexity or Google.</p>
            <p>Google’s figure comes from the Search Console “Generative AI features” report and counts appearances of a geotoolbox.ai link in AI Overviews and AI Mode, {googleAiFeatures.windowLabel}, read {googleAiFeatures.asOf}. Both AI figures are recorded by hand; neither report has an API.</p>
            <p>Google ranking totals use a trailing {google.windowDays}-day window. The charts use calendar months, so their totals can differ from the tiles. They show Google ranking growth, not an AI citation time series.</p>
          </div></section>
        </>}
      </div>
    </section>

    <section id="pricing" className={`${kit.section} ${s.pricing}`}>
      <div className={kit.wrap}>
        <SectionHead
          n="02" label={auto ? "Engagements" : "Services & pricing"}
          title={auto ? "Start with one workflow." : "Start small. Scale what works."}
          lead={auto ? "Map the opportunity, build a focused pilot, or get ongoing support for a system we built or audited." : "A one-off diagnostic, a 30-day sprint, or a monthly retainer. Each step builds on the last."}
        />
        <div className={s.offers}>{p.offers.slice(0, 3).map((offer, i) => <OfferCard key={offer.name} offer={offer} step={p.steps[i]} index={i} callHref={p.callHref} lead={i === 0} auto={auto} />)}</div>
        {!auto && <ul className={s.terms}>
          <li><Check /><span><strong>Report fee credited</strong> to a Sprint or retainer within 14 days.</span></li>
          <li><Check /><span><strong>Sprint counts as month one</strong> of a retainer within 30 days.</span></li>
          <li><Check /><span><strong>Growth:</strong> 90-day commitment, then month to month.</span></li>
        </ul>}
        {p.offers.length > 3 && <details className={s.expand}><summary>Need more capacity? Priority Growth & Scale <span aria-hidden="true">+</span></summary><div className={s.expandGrid}>{p.offers.slice(3).map((offer, i) => <OfferCard key={offer.name} offer={offer} index={i + 3} callHref={p.callHref} auto={auto} />)}</div></details>}
        {!!p.addons?.length && <div className={s.addonsBlock}><h3 className={s.blockHead}>Content, authority & delivery add-ons</h3><div className={s.addons}>{p.addons.map(a => <article key={a.name} className={s.addon}><h3 className={s.addonName}>{a.name}</h3><strong className={s.addonPrice}><BfServicePrice price={a.price} href={a.cta?.href} /> <small>{a.unit}</small></strong><p className={s.addonBody}>{a.detail}</p>{a.cta && <a className={`${kit.textLink} ${s.addonLink}`} data-cta-placement="addon_card" href={a.cta.href}><BfServiceLabel label={a.cta.label} href={a.cta.href} /> ↗</a>}</article>)}</div><p className={s.note}>Content offers exclude GEO, SEO and AI-visibility topics. Add-ons extend the agreed scope; they do not reprice the base engagement.</p></div>}
        {!!p.context?.length && <details className={s.expand}><summary>{auto ? "Skills, agents or a custom tool?" : "What the service covers, and what it doesn’t"} <span aria-hidden="true">+</span></summary><div className={s.context}>{p.context.map(c => <article key={c.title}><h3>{c.title}</h3><p>{c.body}</p></article>)}</div></details>}
      </div>
    </section>

    <ServiceFaq items={p.faqs} heading={auto ? "Before we build" : "Before we work together"} n="03" />

    <section className={s.closing}><div className={kit.wrap}>
      <div className={s.closeCard}>
        <div>
          <Index n="04" label="Is this a fit?" />
          <h2 className={s.closeTitle}>{auto ? "What would you stop doing manually?" : "Find your next AI visibility win."}</h2>
          <p className={s.closeBody}>{auto ? "Bring one recurring task, examples of its inputs and outputs, and access to the tools involved. We define approval points before building." : "Your buyers research before they buy, your site has real expertise, and your team can review and ship changes. Bring your domain and goals."}</p>
          <div className={`${kit.ctaRow} ${s.closeCta}`}><a href={p.callHref} data-cta-placement="closing" className={kit.btnLime} target="_blank" rel="noopener noreferrer">Book an intro call <span aria-hidden="true">↗</span></a></div>
        </div>
        <ul className={`${kit.rows} ${s.promises}`}>
          {(auto
            ? ["You own the code, prompts, documentation and data.", "Fixed fee for the blueprint, fixed quote for the build.", "The blueprint is yours, even if it says don’t build."]
            : ["You own every page and dataset.", "Rankings and AI citations are not guaranteed."]
          ).map(t => <li key={t}><Check />{t}</li>)}
        </ul>
      </div>
      <nav aria-label="Related services" className={s.related}><span>Other services</span><Link href="/services/ai-seo-agency">AI SEO</Link><Link href="/services/generative-engine-optimization">GEO</Link><Link href="/services/answer-engine-optimization">AEO</Link><Link href="/services/ai-automation-agency">AI automation</Link></nav>
    </div></section>
    <StickyServiceCta callHref={p.callHref} pricingHref="#pricing" pricingLabel={auto ? "Engagements" : "See pricing"} message={auto ? "Founder-led AI systems. Built for your workflow." : undefined} />
  </DarkPage>
}
