import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import enMessages from "@/messages/en.json"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { JsonLd } from "@/components/seo/json-ld"
import { DarkPage, Index, Arrow, kit as k } from "@/components/brand/dark-kit"
import { HomeAction } from "@/components/landing/home-action"
import { aboutPageSchema, authorProfileSchema, organizationSchema } from "@/lib/seo-schema"
import { PLANS, BOOK_CALL, doneWithYouMonthly } from "@/lib/plans"
import { PRIMARY_AUTHOR } from "@/lib/authors"
import { proofStats } from "@/lib/proof-stats"
import { siteConfig } from "@/lib/config"
import { tools } from "@/lib/tools"
import s from "./about.module.css"

// About (2026-11-28): the founder's page. Career facts come from the founder's own LinkedIn profile
// (roles, dates and the results he lists there, worded as he words them); product numbers are read
// from their sources at render time (plans, feature and tool registries, proof stats).

const PHOTO = "/authors/samy-ben-sadok-linkedin.jpg"
const LINKEDIN = PRIMARY_AUTHOR.links.find((l) => l.label === "LinkedIn")!.href

export const metadata: Metadata = {
  title: "About the founder, Samy Ben Sadok",
  description:
    "GEO Toolbox is built by Samy Ben Sadok, who has done SEO since 2016 for crypto, edtech and e-commerce brands. Why he built an AI visibility platform, and how he runs it.",
  alternates: { canonical: `${siteConfig.url}/about` },
  openGraph: {
    title: "About GEO Toolbox and its founder, Samy Ben Sadok",
    description: "Ten years of SEO, then the answers moved into AI. Why GEO Toolbox exists and how it works.",
    url: `${siteConfig.url}/about`,
    type: "profile",
  },
}

type Role = { years: string; role: string; org: string; where?: string; detail: string; now?: boolean }

const CAREER: Role[] = [
  { years: "Now", role: "Founder", org: "GEO Toolbox", detail: "Building the AI visibility platform, and running every playbook on geotoolbox.ai before it ships.", now: true },
  { years: "2024–2025", role: "Principal SEO Consultant", org: "RedotPay", where: "Hong Kong · remote", detail: "SEO audits for a crypto company." },
  { years: "2023–2024", role: "Senior Content Writer", org: "Semrush", where: "Remote", detail: "Wrote SEO and technical articles for Semrush’s blog." },
  { years: "2022–2023", role: "Senior SEO Manager", org: "KuCoin", where: "Remote", detail: "Top 3 in French and Spanish for money keywords like “BTC-USDT”, “Crypto Exchange” and “LUNC Price”. Ran a $400,000+ yearly budget and built 1,500+ backlinks across 3 languages." },
  { years: "2021–2022", role: "Senior SEO & Growth Specialist", org: "Teaching.com", where: "United States · remote", detail: "Led international SEO for Typing.com and Nitrotype.com: a 145% traffic increase, to 5 million organic visits a month for Typing.com." },
  { years: "2016–2021", role: "SEO & Growth Consultant", org: "Freelance", where: "Barcelona", detail: "78% year-over-year revenue growth for a tea shop, 36% more organic traffic for a subscription box, and 25% more organic traffic after a one-off SEO audit." },
  { years: "2017–2019", role: "Growth Marketer", org: "Harmony", where: "Barcelona", detail: "E-commerce and SEO: 400% more organic traffic and 300% more B2C revenue in 18 months." },
  { years: "2015–2017", role: "Co-founder", org: "P2B", where: "Paris", detail: "A marketplace for restored vintage French bicycles." },
]

const EDUCATION = [
  { school: "EMLV and IIM Digital School", what: "Master’s, digital marketing & data analytics (dual degree)", years: "2014–2017" },
  { school: "Vilnius University", what: "Marketing, Erasmus exchange", years: "2014–2015" },
  { school: "Epitech", what: "Computer science", years: "2010–2012" },
]

/** ISO timestamps and "3 Nov 2026"-style stamps, read as UTC dates. */
function dateOf(value: string) {
  const ms = /^\d{4}-\d{2}-\d{2}T/.test(value) ? Date.parse(value) : Date.parse(`${value} 00:00:00 UTC`)
  if (Number.isNaN(ms)) throw new Error(`About: unreadable date "${value}"`)
  return new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(ms))
}
const compact = (n: number) => new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: n >= 1e6 ? 2 : 1 }).format(n)
const usd = (n: number) => `$${n.toLocaleString("en-US")}`

export default function AboutPage() {
  const v3 = enMessages.home.v3
  const r = v3.results
  const how = v3.how
  const starter = PLANS.find((p) => p.id === "starter")!
  if (!starter.priceMonthly || !starter.priceYearly || !starter.trialDays) throw new Error("About: starter plan price or trial missing")
  const featureCount = siteConfig.featureGroups.flatMap((g) => g.features).length
  const toolCount = tools.length
  const dwyFrom = Math.min(doneWithYouMonthly("brand"), doneWithYouMonthly("agency"))
  const g = proofStats.googleAiFeatures, b = proofStats.aiCitations, q = proofStats.google
  const trial = `${siteConfig.appSignupUrl}&ref=about`
  const ext = { target: "_blank", rel: "noopener noreferrer" } as const
  const person = { "@context": "https://schema.org", ...authorProfileSchema(PRIMARY_AUTHOR).mainEntity }

  return (
    <DarkPage>
      <JsonLd data={[aboutPageSchema(), organizationSchema(), person]} />

      {/* ---------------- Hero ---------------- */}
      <section className={`${k.heroGlow} ${s.hero}`} aria-labelledby="about-title">
        <div className={k.wrap}>
          <Breadcrumbs tone="dark" trail={[{ name: "Home", href: "/" }, { name: "About", href: "" }]} />
          <div className={s.heroGrid}>
            <div className={s.heroText}>
              <Index label="About the founder" />
              <h1 id="about-title" className={s.heroTitle}>
                Ten years of SEO. Then the <span className={`${k.hl} ${s.mark}`}>answers moved.</span>
              </h1>
              <p className={k.heroLead}>
                I’m Samy Ben Sadok. I built GEO Toolbox after a decade of SEO for crypto companies, edtech and e-commerce brands,
                because none of my tools could tell me what ChatGPT, Gemini or Google’s AI Mode said about a brand, or which pages
                they cited to say it.
              </p>
              <div className={k.ctaRow}>
                <a href={BOOK_CALL} data-cta-placement="about_hero" className={k.btnLime} {...ext}>Book a call with me<Arrow /></a>
                <HomeAction href={trial} placement="about_hero" locale="en" className={k.btnOutline}>Start free trial</HomeAction>
              </div>
              <p className={s.heroMeta}>
                <a href={LINKEDIN} className={s.metaLink} target="_blank" rel="me noopener noreferrer">LinkedIn<span aria-hidden="true">↗</span></a>
                <span className={s.metaDot} aria-hidden="true" />
                <a href="mailto:samy@geotoolbox.ai" className={s.metaLink}>samy@geotoolbox.ai</a>
                <span className={s.metaDot} aria-hidden="true" />
                <Link href={`/author/${PRIMARY_AUTHOR.slug}`} className={s.metaLink}>My articles</Link>
              </p>
            </div>

            <figure className={s.portrait}>
              <div className={s.disc}>
                <div className={s.orbit} aria-hidden="true">
                  <svg viewBox="0 0 400 400" className={s.orbitSvg}>
                    <circle cx="200" cy="200" r="196" pathLength={1} className={s.ringOuter} />
                    <circle cx="200" cy="200" r="166" pathLength={1} className={s.ringInner} />
                  </svg>
                </div>
                <Image src={PHOTO} alt="Samy Ben Sadok, founder of GEO Toolbox" width={800} height={800} priority sizes="(max-width: 640px) 230px, 320px" className={s.photo} />
              </div>
              <ul className={s.chips}>
                <li className={`${s.chip} ${s.chipA}`}><span className={s.chipDot} aria-hidden="true" />SEO since 2016</li>
                <li className={`${s.chip} ${s.chipB}`}><span className={s.chipDot} aria-hidden="true" />FR · ES · EN · IT</li>
                <li className={`${s.chip} ${s.chipC}`}><span className={s.chipDot} aria-hidden="true" />Founder · GEO Toolbox</li>
              </ul>
              <figcaption className={s.caption}>Samy Ben Sadok</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ---------------- 01 Background ---------------- */}
      <section className={`${k.section} ${k.sectionBorder}`} aria-labelledby="background-title">
        <div className={`${k.wrap} ${s.bgGrid}`}>
          <div className={s.bgAside}>
            <div data-reveal="">
              <Index n="01" label="Background" />
              <h2 id="background-title" className={k.sectionTitle}>Where the playbook comes from.</h2>
              <p className={s.asideLead}>In-house, freelance and consulting roles since 2015, with the results each one produced.</p>
            </div>
            <dl className={s.glance} data-reveal="" style={{ ["--rd" as string]: 1 }}>
              <div><dt>SEO since</dt><dd>2016</dd></div>
              <div><dt>Worked in</dt><dd>French, Spanish, English, Italian</dd></div>
              <div><dt>Industries</dt><dd>Crypto, edtech, e-commerce</dd></div>
              <div><dt>Studied</dt><dd>Computer science, then digital marketing & data analytics</dd></div>
            </dl>
          </div>

          <div className={s.timelineCol}>
            <ol className={s.timeline}>
              {CAREER.map((c, i) => (
                <li key={`${c.org}-${c.years}`} className={`${s.step}${c.now ? ` ${s.stepNow}` : ""}`} data-reveal="" style={{ ["--rd" as string]: Math.min(i, 3) }}>
                  <span className={s.node} aria-hidden="true" />
                  <p className={s.years}>{c.years}</p>
                  <div className={s.stepBody}>
                    <h3 className={s.role}>{c.role} <span className={s.at}>·</span> <span className={s.org}>{c.org}</span></h3>
                    {c.where ? <p className={s.where}>{c.where}</p> : null}
                    <p className={s.detail}>{c.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className={s.edu} data-reveal="">
              <p className={s.eduLabel}>Education</p>
              <ul className={s.eduList}>
                {EDUCATION.map((e) => (
                  <li key={e.school}>
                    <span className={s.eduSchool}>{e.school}</span>
                    <span className={s.eduWhat}>{e.what}</span>
                    <span className={s.eduYears}>{e.years}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 02 Why ---------------- */}
      <section className={`${k.section} ${k.band}`} aria-labelledby="why-title">
        <div className={k.wrap}>
          <div className={s.whyGrid}>
            <div data-reveal="">
              <Index n="02" label="Why GEO Toolbox" />
              <h2 id="why-title" className={k.sectionTitle}>My tools showed rankings. None showed the answer.</h2>
              <div className={s.story}>
                <p>
                  For ten years the job was one loop: see where a page ranks, find what it is missing, fix it, measure again.
                  Then buyers started asking ChatGPT, Claude, Gemini and Google’s AI Mode. The answer names a few brands and cites a
                  few pages. If you are not in it, there is no page two to climb from.
                </p>
                <p>
                  I wanted the same loop for AI answers: which prompts mention a brand, which pages each engine cites, and whether
                  a fix changed the next answer. GEO Toolbox runs that loop across up to 8 AI engines, with {featureCount} features
                  and {toolCount} free tools.
                </p>
              </div>
            </div>
            <ol className={s.loop}>
              {[
                { step: how.trackStep, title: how.trackTitle },
                { step: how.traceStep, title: how.traceTitle },
                { step: how.fixStep, title: how.fixTitle },
              ].map((x, i) => (
                <li key={x.step} className={`${k.card} ${s.loopCard}`} data-reveal="" style={{ ["--rd" as string]: i }}>
                  <p className={s.loopStep}><span className={s.loopNum}>{String(i + 1).padStart(2, "0")}</span>{x.step}</p>
                  <p className={s.loopTitle}>{x.title}</p>
                </li>
              ))}
              <li className={s.loopFoot} data-reveal="" style={{ ["--rd" as string]: 3 }}>
                <Link href="/features" className={k.textLink}>{how.features}<Arrow /></Link>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* ---------------- 03 How I run it ---------------- */}
      <section className={k.section} aria-labelledby="rules-title">
        <div className={k.wrap}>
          <div className={k.sectionHead} data-reveal="">
            <div>
              <Index n="03" label="How I run it" />
              <h2 id="rules-title" className={k.sectionTitle}>Four rules I hold the product to.</h2>
            </div>
            <p className={k.sectionLead}>The same rules I wanted from the tools I bought as an SEO.</p>
          </div>
          <ul className={s.rules}>
            <li className={k.card} data-reveal="" style={{ ["--rd" as string]: 0 }}>
              <p className={s.ruleNum}>01</p>
              <h3 className={k.h3}>Real answers, not estimates.</h3>
              <p className={k.body}>Scans send real prompts to the engines and record the domains and pages they cite. You see each answer and its sources, not just a score.</p>
            </li>
            <li className={k.card} data-reveal="" style={{ ["--rd" as string]: 1 }}>
              <p className={s.ruleNum}>02</p>
              <h3 className={k.h3}>Our own site goes first.</h3>
              <p className={k.body}>We started publishing on geotoolbox.ai in May 2026 and run each playbook here before we sell it. The numbers are below.</p>
            </li>
            <li className={k.card} data-reveal="" style={{ ["--rd" as string]: 2 }}>
              <p className={s.ruleNum}>03</p>
              <h3 className={k.h3}>Prices on the page.</h3>
              <p className={k.body}>
                Plans start at {usd(starter.priceMonthly)} a month ({usd(starter.priceYearly / 12)} billed annually) with a {starter.trialDays}-day
                free trial. <span className={s.keep}>Done-with-you</span> work starts at {usd(dwyFrom)} a month. <Link href="/pricing" className={s.inlineLink}>See pricing</Link>
              </p>
            </li>
            <li className={k.card} data-reveal="" style={{ ["--rd" as string]: 3 }}>
              <p className={s.ruleNum}>04</p>
              <h3 className={k.h3}>You deal with me.</h3>
              <p className={k.body}>Book a call and you talk to me. Emails to samy@geotoolbox.ai reach me too, and I usually reply within one business day.</p>
            </li>
          </ul>

          <div className={s.ledgerHead} data-reveal="">
            <p className={s.ledgerTitle}>{r.index}: geotoolbox.ai</p>
            <p className={s.ledgerStamp}>{r.read} {dateOf(g.asOf)} · {r.since} {r.sinceValue}</p>
          </div>
          <div className={s.ledger}>
            <div className={s.cell} data-reveal="" style={{ ["--rd" as string]: 0 }}>
              <p className={s.cellTag}>{r.googleAiTag}</p>
              <p className={s.cellNum}>{compact(g.impressions)}</p>
              <p className={s.cellLabel}>{r.googleAiLabel}</p>
            </div>
            <div className={s.cell} data-reveal="" style={{ ["--rd" as string]: 1 }}>
              <p className={s.cellTag}>{r.bingTag}</p>
              <p className={s.cellNum}>{compact(b.total)}</p>
              <p className={s.cellLabel}>{r.bingLabel}</p>
            </div>
            <div className={s.cell} data-reveal="" style={{ ["--rd" as string]: 2 }}>
              <p className={s.cellTag}>{r.queriesTag.replace("{days}", String(q.windowDays))}</p>
              <p className={s.cellNum}>{compact(q.rankedKeywords)}</p>
              <p className={s.cellLabel}>{r.queriesLabel.replace("{days}", String(q.windowDays))}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Close ---------------- */}
      <section className={s.closeSection} aria-labelledby="close-title">
        <div className={k.wrap}>
          <div className={`${k.cardLime} ${s.close}`} data-reveal="">
            <div>
              <Index n="04" label="Talk to me" />
              <h2 id="close-title" className={s.closeTitle}>See what AI says about your brand.</h2>
              <p className={s.closeBody}>{v3.close.body}</p>
            </div>
            <div className={s.closeActions}>
              <a href={BOOK_CALL} data-cta-placement="about_close" className={k.btnLime} {...ext}>Book a call with me<Arrow /></a>
              <HomeAction href={`${siteConfig.appFreeScanUrl}&ref=about-close`} placement="about_close_free" locale="en" className={k.btnOutline}>{v3.freeCta}</HomeAction>
              <HomeAction href={`${siteConfig.appSignupUrl}&ref=about-close`} placement="about_close" locale="en" className={s.closeLink}>Start free trial<Arrow /></HomeAction>
            </div>
          </div>
        </div>
      </section>
    </DarkPage>
  )
}
