import Link from "next/link"
import { getLocale, getTranslations } from "next-intl/server"
import { PLANS, BOOK_CALL, doneWithYouMonthly } from "@/lib/plans"
import { isEuroLocale, currencyParam } from "@/lib/i18n/currency"
import { proofStats } from "@/lib/proof-stats"
import { GEO_SERVICE_PRICES as GSP, usd } from "@/lib/service-offers"
import { siteConfig } from "@/lib/config"
import { tools } from "@/lib/tools"
import { localizeNavHref } from "@/lib/i18n/nav"
import { HomeAction } from "../home-action"
import { Playbook } from "../playbook"
import { LatestPosts } from "../latest-posts"
import { realQuery } from "./query-data"
import { Orbit } from "./orbit"
import { geist } from "./geist"
import s from "./home-v3.module.css"

// Homepage v4 (2026-11-28): dark "citation orbit" design. Every number on this page is read from
// its source at render time: plans (lib/plans.ts), our own results (lib/proof-stats.ts), the real
// query (query-data.ts, generated from a saved engine run), service prices (lib/service-offers.ts).

type EngineId = (typeof realQuery.engines)[number]["id"]
const MARQUEE = ["ChatGPT", "Claude", "Gemini", "Google AI Overviews", "Google AI Mode", "Bing Copilot", "Grok", "Perplexity"]
const FEATURED_TOOLS = ["ai-crawler-checker", "query-fanout", "keyword-to-prompts", "agent-readiness-scanner"]
const PICK_LABEL: Record<EngineId, "pickTop" | "pickTwo" | "pickDepends" | "pickDefault"> = {
  chatgpt: "pickTop", claude: "pickDepends", aimode: "pickDepends", gemini: "pickTwo",
}
const WINNER = "clickup.com"

function Arrow() {
  return <svg className={s.arrow} aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 10h12m-5-5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}
function Check() {
  return <svg className={s.check} aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3.5 8.5 3 3 6-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
}
function Index({ n, label }: { n: string; label: string }) {
  return <p className={s.index}><span className={s.indexNum}>{n}</span><span className={s.indexPipe} aria-hidden="true">|</span>{label}</p>
}

/** Grouped money in the visitor's billing currency (same rule as lib/i18n/currency.formatPrice). */
function money(n: number, locale: string) {
  return isEuroLocale(locale) ? `${n.toLocaleString(locale)} €` : `$${n.toLocaleString("en-US")}`
}
function compact(n: number, locale: string) {
  return new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: n >= 1e6 ? 2 : 1 }).format(n)
}
/** ISO timestamps and "3 Nov 2026"-style stamps, both read as UTC dates (never the build machine's zone). */
function dateOf(value: string, locale: string) {
  const ms = /^\d{4}-\d{2}-\d{2}T/.test(value) ? Date.parse(value) : Date.parse(`${value} 00:00:00 UTC`)
  if (Number.isNaN(ms)) throw new Error(`HomeV3: unreadable date "${value}"`)
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(ms))
}

export async function HomeV3() {
  const locale = await getLocale()
  const t = await getTranslations("home.v3")
  const tFree = await getTranslations("home.freeTools")
  const tOld = await getTranslations("home.redesign")
  const L = (href: string) => localizeNavHref(href, locale)
  const startTrial = (ref: string) => `${siteConfig.appSignupUrl}&ref=${ref}${currencyParam(locale)}`
  const freeScan = (ref: string) => `${siteConfig.appFreeScanUrl}&ref=${ref}`
  const ext = { target: "_blank", rel: "noopener noreferrer" } as const

  const engines = realQuery.engines
  const queryDate = dateOf(realQuery.runUtc, locale)
  const list = (items: readonly string[]) => new Intl.ListFormat(locale, { style: "long", type: "conjunction" }).format(items)
  const engineCount = Object.fromEntries(engines.map(e => [e.id, e.sources.length === 0 ? t("orbit.legendNone") : t("orbit.count", { sources: e.sources.length, domains: new Set(e.sources.map(x => x.domain)).size })])) as Record<EngineId, string>
  const engineBox = Object.fromEntries(engines.map(e => [e.id, t("orbit.boxCount", { count: e.sources.length })])) as Record<EngineId, string>

  const starter = PLANS.find(p => p.id === "starter")!
  const trialPlans = list(PLANS.filter(p => p.trialDays).map(p => p.name))
  const dwyBrand = doneWithYouMonthly("brand"), dwyAgency = doneWithYouMonthly("agency")
  const g = proofStats.googleAiFeatures, b = proofStats.aiCitations, q = proofStats.google

  const roundups = engines.flatMap(e => e.sources.filter(x => x.kind === "roundup").map(x => ({ ...x, e: e.id })))
  const homepages = engines.flatMap(e => e.sources.filter(x => x.kind === "homepage").map(x => ({ ...x, e: e.id })))
  const roundupDomains = [...new Map(roundups.map(x => [x.domain, roundups.filter(r => r.domain === x.domain).map(r => r.e)])).entries()]
  const perEngine = (rows: { e: EngineId }[]) => engines.map(e => [e, rows.filter(r => r.e === e.id).length] as const).filter(([, n]) => n > 0)
  const gemini = engines.find(e => e.id === "gemini")!

  return (
    <div className={`${s.home} ${geist.variable}`} data-home-v4="">
      <nav className={s.rail} aria-label={t("rail.label")}>
        {(["query", "sources", "results", "how", "pricing", "tools"] as const).map(k => (
          <a key={k} href={`#${k === "how" ? "how-it-works" : k}`} className={s.railLink}><span className={s.railLabel}>{t(`rail.${k}`)}</span><span className={s.railDot} aria-hidden="true" /></a>
        ))}
      </nav>

      {/* ---------------- Hero ---------------- */}
      <section className={s.hero} aria-labelledby="home-title">
        <div className={s.wrap}>
          <a href="#results" className={s.proofPill}>
            <span className={s.proofDot} aria-hidden="true" />
            <span className={s.proofTag}>{t("badgeTag")}</span>
            <span>{t("badgeText", { impressions: compact(g.impressions, locale) })}</span>
            <Arrow />
          </a>
          <h1 id="home-title" className={s.heroTitle}>
            {t("h1Before")}<span className={s.hl}>{t("h1Mark")}</span>{t("h1After")}
          </h1>
          <div className={s.heroSplit}>
            <div>
              <p className={s.footnote}><span className={s.footnoteIdx} aria-hidden="true">[1]</span><span className={s.heroSub}>{tOld("subhead")}</span></p>
              <div className={s.ctaRow}>
                <HomeAction href={startTrial("home-hero")} placement="home_hero" locale={locale} className={s.btnLime}>{tOld("freeCta")}<Arrow /></HomeAction>
                <a href={BOOK_CALL} data-cta-placement="home_hero" className={s.btnOutline} {...ext}>{t("bookCall")}</a>
              </div>
              <p className={s.micro}>{tOld("freeTerms")}</p>
            </div>
            <div className={s.freeBox}>
              <p className={s.freeLabel}>{t("freeLabel")}</p>
              <HomeAction href={freeScan("home-hero-free")} placement="home_hero_free" locale={locale} className={s.freeBtn}>
                <span className={s.freeBtnGlobe} aria-hidden="true"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="10" cy="10" r="7.5" /><path d="M2.5 10h15M10 2.5c2 2.2 3 4.7 3 7.5s-1 5.3-3 7.5c-2-2.2-3-4.7-3-7.5s1-5.3 3-7.5z" /></svg></span>
                <span className={s.freeBtnText}>{t("freeCta")}</span><Arrow />
              </HomeAction>
              <p className={s.freeHint}>{t("freeHint")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className={s.marquee} aria-label={t("enginesLabel")}>
        <div className={s.marqueeViewport}>
          <div className={s.marqueeTrack}>
            {[0, 1].map(k => (
              <ul key={k} className={s.marqueeGroup} aria-hidden={k === 1 ? true : undefined}>
                {MARQUEE.map(name => <li key={name}>{name}</li>)}
              </ul>
            ))}
          </div>
        </div>
        <p className={s.marqueeNote}>{tOld("engineNote")}</p>
      </section>

      {/* ---------------- 01 Orbit ---------------- */}
      <section id="query" className={s.section} aria-labelledby="query-title">
        <div className={s.wrap}>
          <div className={s.sectionHead}>
            <div>
              <Index n="01" label={t("orbit.index")} />
              <h2 id="query-title" className={s.sectionTitle}>{t("orbit.title", { engines: engines.length, domains: realQuery.totals.domains })}</h2>
            </div>
            <p className={s.sectionLead}>{t("orbit.lead", { engines: engines.length, date: queryDate, shared: list(realQuery.shared) })}</p>
          </div>
          <Orbit copy={{
            filter: t("orbit.filter"), all: t("orbit.all", { engines: engines.length }), question: t("orbit.question"), winner: t("orbit.winner"),
            legendWinner: t("orbit.legendWinner"), legendShared: t("orbit.legendShared"), legendNone: t("orbit.legendNone"),
            stamp: t("orbit.stamp", { date: queryDate }), engineCount, engineBox,
          }} />
          <p className={s.method}>{t("orbit.method")}{locale !== "en" && <> {t("orbit.capture")}</>}</p>
        </div>
      </section>

      {/* ---------------- 02 Sources ---------------- */}
      <section id="sources" className={`${s.section} ${s.sectionBorder}`} aria-labelledby="sources-title">
        <div className={s.wrap}>
          <div className={s.sectionHead}>
            <div>
              <Index n="02" label={t("sources.index")} />
              <h2 id="sources-title" className={s.sectionTitle}>{t("sources.title")}</h2>
            </div>
            <p className={s.sectionLead}>{t("sources.lead", { roundups: realQuery.totals.roundups, entries: realQuery.totals.entries, homepages: realQuery.totals.homepages })}</p>
          </div>

          <div className={s.workbench}>
            <div className={s.wbTop}>
              <span className={s.stampChip}><span className={s.stampDot} aria-hidden="true" />{t("orbit.stamp", { date: queryDate })}</span>
              <fieldset className={s.tabs}>
                <legend className={s.srOnly}>{t("sources.filter")}</legend>
                <label className={s.tab}><input type="radio" name="wb-engine" value="all" defaultChecked /><span>{t("sources.all")}</span></label>
                {engines.map(e => <label key={e.id} className={s.tab}><input type="radio" name="wb-engine" value={e.id} /><span>{e.name}</span></label>)}
              </fieldset>
            </div>
            <div className={s.wbPrompt}>
              <p className={s.wbPromptText}><span className={s.wbPromptLabel}>{t("orbit.question")}</span>“{realQuery.prompt}”</p>
              <span className={s.wbDiff}>{t("sources.different", { engines: engines.length })}</span>
            </div>
            <div className={s.wbSplit}>
              <div className={s.wbAnswers}>
                <h3 className={s.paneTitle}>{t("sources.answers")}</h3>
                <ul className={s.engineList}>
                  {engines.map(e => (
                    <li key={e.id} data-e={e.id} className={s.engineRow}>
                      <div className={s.engineCol}>
                        <strong>{e.name}</strong>
                        <span>{engineCount[e.id].split(" · ").map(part => <span key={part} className={s.countLine}>{part}</span>)}</span>
                      </div>
                      <div>
                        <p className={s.pickRow}>
                          <span className={s.pickLabel}>{t(`sources.${PICK_LABEL[e.id]}`)}</span>
                          {e.picks.map((p, i) => <span key={p} className={i === 0 && PICK_LABEL[e.id] !== "pickDepends" ? s.pickMain : s.pickChip}>{p}</span>)}
                        </p>
                        <blockquote className={s.quote} lang="en">“{e.quote}”</blockquote>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={s.wbSources}>
                <h3 className={`${s.paneTitle} ${s.paneLime}`}>{t("sources.behind")}</h3>
                <div className={s.sourceStack}>
                  <article className={s.sourceItem} data-e={[...new Set(roundups.map(r => r.e))].join(" ")}>
                    <header className={s.sourceHead}><h4>{t("sources.roundupsTitle")}</h4><span>{t("sources.entries", { count: roundups.length })}</span></header>
                    <p className={s.sourceMeta}>{perEngine(roundups).map(([e, n]) => `${e.name} ${n}`).join(" · ")}</p>
                    <ul className={s.chips}>{roundupDomains.map(([d, es]) => <li key={d} data-e={es.join(" ")} className={s.chip}>{d}</li>)}</ul>
                    <p className={s.sourceNote}>{t("sources.roundupsNote")}</p>
                    <p className={s.move}><span>{t("sources.move")}</span>{t("sources.roundupsMove")}</p>
                  </article>
                  <article className={`${s.sourceItem} ${s.sourceSpot}`} data-e={[...new Set(homepages.map(r => r.e))].join(" ")}>
                    <header className={s.sourceHead}><h4>{t("sources.homepagesTitle")}</h4><span>{t("sources.entries", { count: homepages.length })}</span></header>
                    <p className={s.sourceMeta}>{perEngine(homepages).map(([e, n]) => `${e.name} ${n}`).join(" · ")}</p>
                    <ul className={s.chips}>{homepages.map(x => <li key={x.domain} data-e={x.e} className={x.domain === WINNER ? s.chipWin : s.chip}>{x.domain}{x.domain === WINNER ? ` · ${t("orbit.winner")}` : ""}</li>)}</ul>
                    <p className={s.sourceNote}>{t("sources.homepagesNote", { count: homepages.length })}</p>
                    <p className={s.move}><span>{t("sources.move")}</span>{t("sources.homepagesMove")}</p>
                  </article>
                  {gemini.sources.length === 0 && (
                    <article className={`${s.sourceItem} ${s.sourceMuted}`} data-e="gemini">
                      <header className={s.sourceHead}><h4>{t("sources.noneTitle")}</h4><span>Gemini</span></header>
                      <p className={s.sourceNote}>{t("sources.noneNote")}</p>
                      <p className={s.move}><span>{t("sources.move")}</span>{t("sources.noneMove")}</p>
                    </article>
                  )}
                </div>
                <div className={s.wbFoot}>
                  <strong>{t("sources.footer")}</strong>
                  <HomeAction href={freeScan("home-sources-free")} placement="home_sources_free" locale={locale} className={s.textLink}>{t("sources.footerCta")}<Arrow /></HomeAction>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 03 Our own results ---------------- */}
      <section id="results" className={s.proof} aria-labelledby="results-title">
        <div className={s.wrap}>
          <div className={s.sectionHead}>
            <div>
              <Index n="03" label={t("results.index")} />
              <h2 id="results-title" className={s.sectionTitle}>{t("results.title")}</h2>
              <p className={s.proofLead}>{t("results.lead")}</p>
            </div>
            <dl className={s.proofStamp}>
              <div><dt>{t("results.site")}</dt><dd>geotoolbox.ai</dd></div>
              <div><dt>{t("results.read")}</dt><dd>{dateOf(g.asOf, locale)}</dd></div>
              <div><dt>{t("results.since")}</dt><dd>{t("results.sinceValue")}</dd></div>
            </dl>
          </div>
          <div className={s.ledger}>
            <div className={s.cell}>
              <p className={s.cellTag}><span>{t("results.googleAiTag")}</span><i aria-hidden="true" /></p>
              <p className={s.cellNum}>{compact(g.impressions, locale)}</p>
              <p className={s.cellLabel}>{t("results.googleAiLabel")}</p>
            </div>
            <div className={s.cell}>
              <p className={s.cellTag}><span>{t("results.bingTag")}</span><i aria-hidden="true" /></p>
              <p className={s.cellNum}>{compact(b.total, locale)}</p>
              <p className={s.cellLabel}>{t("results.bingLabel")}</p>
            </div>
            <div className={s.cell}>
              <p className={s.cellTag}><span>{t("results.queriesTag", { days: q.windowDays })}</span><i aria-hidden="true" /></p>
              <p className={s.cellNum}>{compact(q.rankedKeywords, locale)}</p>
              <p className={s.cellLabel}>{t("results.queriesLabel", { days: q.windowDays })}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 04 How it works ---------------- */}
      <section id="how-it-works" className={s.section} aria-labelledby="how-title">
        <div className={s.wrap}>
          <div className={s.sectionHead}>
            <div>
              <Index n="04" label={t("how.index")} />
              <h2 id="how-title" className={s.sectionTitle}>{t("how.title")}</h2>
            </div>
            <p className={s.sectionLead}>{t("how.lead")}</p>
          </div>
          <div className={s.stages}>
            <div className={s.stage}>
              <div>
                <p className={s.stageNum}>01 · {t("how.trackStep")}</p>
                <h3 className={s.stageTitle}>{t("how.trackTitle")}</h3>
                <p className={s.stageCopy}>{t("how.trackBody")}</p>
                <ul className={s.tags}>{(t.raw("how.trackTags") as string[]).map(x => <li key={x}>{x}</li>)}</ul>
              </div>
              <figure className={s.frame}>
                <figcaption className={s.frameHead}><span>{t("how.trackFrame")}</span><span className={s.illus}>{t("how.illustrative")}</span></figcaption>
                <ul className={s.frameRows}>
                  {([["ChatGPT", "statusRival", s.stRival], ["Claude", "statusCited", s.stLime], ["Google AI Mode", "statusMissing", s.stNeutral], ["Gemini", "statusNone", s.stNeutral]] as const).map(([name, key, cls]) => (
                    <li key={name}><span><strong>{name}</strong><small>{t("how.trackPrompt")}</small></span><span className={`${s.status} ${cls}`}>{t(`how.${key}`)}</span></li>
                  ))}
                </ul>
              </figure>
            </div>
            <div className={s.stage}>
              <div>
                <p className={s.stageNum}>02 · {t("how.traceStep")}</p>
                <h3 className={s.stageTitle}>{t("how.traceTitle")}</h3>
                <p className={s.stageCopy}>{t("how.traceBody")}</p>
                <ul className={s.tags}>{(t.raw("how.traceTags") as string[]).map(x => <li key={x}>{x}</li>)}</ul>
              </div>
              <figure className={s.frame}>
                <figcaption className={s.frameHead}><span>{t("how.traceFrame")}</span><span className={s.illus}>{t("how.illustrative")}</span></figcaption>
                <ul className={s.frameRows}>
                  {([["rowRoundup", "rowRoundupSub", "namesRival", s.stRival], ["rowThread", "rowThreadSub", "namesRival", s.stRival], ["rowOwn", "rowOwnSub", "ownPage", s.stLime], ["rowPress", "rowPressSub", "notYet", s.stNeutral]] as const).map(([k, sub, st, cls]) => (
                    <li key={k}><span><strong>{t(`how.${k}`)}</strong><small>{t(`how.${sub}`)}</small></span><span className={`${s.status} ${cls}`}>{t(`how.${st}`)}</span></li>
                  ))}
                </ul>
              </figure>
            </div>
            <div className={s.fixBand}>
              <div>
                <p className={s.stageNum}>03 · {t("how.fixStep")}</p>
                <h3 className={s.stageTitle}>{t("how.fixTitle")}</h3>
                <p className={s.stageCopy}>{t("how.fixBody")}</p>
                <div className={s.ctaRow}>
                  <HomeAction href={startTrial("home-how")} placement="home_how" locale={locale} className={s.btnLime}>{tOld("freeCta")}<Arrow /></HomeAction>
                  <Link href={L("/features")} className={s.btnOutline}>{t("how.features")}</Link>
                </div>
              </div>
              <ol className={s.fixSteps}>
                {(t.raw("how.fixSteps") as { title: string; body: string; tag: string }[]).map((x, i) => (
                  <li key={x.title}><span className={s.fixIdx}>0{i + 1}</span><span><strong>{x.title}</strong><small>{x.body}</small></span><span className={s.fixTag}>{x.tag}</span></li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 05 Pricing ---------------- */}
      <section id="pricing" className={`${s.section} ${s.sectionBorder}`} aria-labelledby="pricing-title">
        <div className={s.wrap}>
          <div className={s.sectionHead}>
            <div>
              <Index n="05" label={t("pricing.index")} />
              <h2 id="pricing-title" className={s.sectionTitle}>{t("pricing.title").split(/(?<=\.)\s+/).map((part, i) => <span key={i} className={s.keep}>{i ? " " : ""}{part}</span>)}</h2>
            </div>
            <p className={s.sectionLead}>{t("pricing.lead")}</p>
          </div>
          <div className={s.tiers}>
            <article className={`${s.tier} ${s.tierDiy}`}>
              <div className={s.tierHead}><h3 className={s.tierKicker}>{t("pricing.diyKicker")}</h3></div>
              <p className={s.tierPrice}><small>{t("pricing.from")}</small> {money(Math.round(starter.priceYearly! / 12), locale)}<span>{t("pricing.billedYearly")}</span></p>
              <p className={s.tierAlt}>{t("pricing.diyAlt", { price: money(starter.priceMonthly!, locale) })}</p>
              <ul className={s.tierList}>{(t.raw("pricing.diyItems") as string[]).map(x => <li key={x}><Check />{x.replace("{plans}", trialPlans)}</li>)}</ul>
              <div className={s.tierCtas}>
                <HomeAction href={`${siteConfig.appSignupUrl}&plan=starter&ref=home-pricing-diy${currencyParam(locale)}`} placement="home_pricing_diy" locale={locale} className={s.btnLime}>{tOld("freeCta")}<Arrow /></HomeAction>
                <Link href={L("/pricing")} className={s.btnOutline}>{t("pricing.compare")}</Link>
              </div>
            </article>
            <article className={`${s.tier} ${s.tierDwy}`}>
              <div className={s.tierHead}><h3 className={s.tierKicker}>{t("pricing.dwyKicker")}</h3><span className={s.badge}>{t("pricing.dwyBadge")}</span></div>
              <div className={s.dwyPrices}>
                <div><p className={s.dwyVal}>{money(dwyBrand, locale)}<span>{t("pricing.perMonth")}</span></p><p className={s.dwyWho}>{t("pricing.dwyBrands")}</p></div>
                <div><p className={s.dwyVal}>{money(dwyAgency, locale)}<span>{t("pricing.perMonth")}</span></p><p className={s.dwyWho}>{t("pricing.dwyAgencies")}</p></div>
              </div>
              <p className={s.tierDesc}>{t("pricing.dwyDesc")}</p>
              <ul className={s.tierList}>{(t.raw("pricing.dwyItems") as string[]).map(x => <li key={x}><Check />{x}</li>)}</ul>
              <div className={s.tierCtas}>
                <a href={BOOK_CALL} data-cta-placement="home_pricing_dwy" className={s.btnLime} {...ext}>{t("bookCall")}<Arrow /></a>
              </div>
            </article>
          </div>
          <article className={s.dfy}>
            <div className={s.dfyHead}>
              <h3 className={s.tierKicker}>{t("pricing.dfyKicker")}</h3>
              <p className={s.dfyTitle}>{t("pricing.dfyTitle")}</p>
              <p className={s.tierDesc}>{t("pricing.dfyNote")}</p>
            </div>
            <div className={s.dfyActions}>
              <Link href={L("/services/generative-engine-optimization")} className={s.btnOutline}>{t("pricing.dfyCta")}<Arrow /></Link>
              <a href={BOOK_CALL} data-cta-placement="home_pricing_dfy" className={s.textLink} {...ext}>{t("bookCall")}<Arrow /></a>
            </div>
            {/* Same rows in every column (label, price, name, terms) so the prices share one baseline. */}
            <ul className={s.dfyPrices}>
              <li><p className={s.dfyTop}>{t("pricing.dfyOneOff")}</p><p className={s.dfyVal}>{usd(GSP.report)}</p><p className={s.dfyName}>{t("pricing.dfyReportName")}</p></li>
              <li><p className={s.dfyTop}>{t("pricing.from")}</p><p className={s.dfyVal}>{usd(GSP.sprintFrom)}</p><p className={s.dfyName}>{t("pricing.dfySprint")}</p></li>
              <li><p className={s.dfyTop}>{t("pricing.from")}</p><p className={s.dfyVal}>{usd(GSP.retainerFromMonthly)}<span>{t("pricing.perMonth")}</span></p><p className={s.dfyName}>{t("pricing.dfyRetainerName")}</p><p className={s.dfyLbl}>{t("pricing.dfyRetainerTerm")}</p></li>
            </ul>
          </article>
        </div>
      </section>

      {/* ---------------- 06 Free tools ---------------- */}
      <section id="tools" className={s.tools} aria-labelledby="tools-title">
        <div className={`${s.wrap} ${s.toolsSplit}`}>
          <div>
            <Index n="06" label={t("tools.index")} />
            <h2 id="tools-title" className={s.sectionTitle}>{t("tools.title", { count: tools.length })}</h2>
            <p className={s.toolsLead}>{t("tools.lead")}</p>
            <Link href={L("/tools")} className={s.btnOutline}>{t("tools.all", { count: tools.length })}<Arrow /></Link>
          </div>
          <ol className={s.toolIndex}>
            {FEATURED_TOOLS.map((slug, i) => {
              const tool = tools.find(x => x.slug === slug)!
              return <li key={slug}><Link href={L(`/tools/${slug}`)} className={s.toolRow}><span className={s.toolNum}>0{i + 1}</span><span><strong>{tool.name}</strong><small>{tFree(`descs.${slug}`)}</small></span><Arrow /></Link></li>
            })}
          </ol>
        </div>
      </section>

      <div className={s.darkTw}>
        <Playbook />
        <LatestPosts />
      </div>

      {/* ---------------- Close ---------------- */}
      <section className={s.close} aria-labelledby="close-title">
        <div className={s.wrap}>
          <div className={s.closeCard}>
            <div>
              <Index n="07" label={t("close.index")} />
              <h2 id="close-title" className={s.closeTitle}>{t("close.title")}</h2>
              <p className={s.closeBody}>{t("close.body")}</p>
            </div>
            <div className={s.closeActions}>
              <HomeAction href={freeScan("home-close-free")} placement="home_footer_free" locale={locale} className={s.freeBtn}>
                <span className={s.freeBtnText}>{t("freeCta")}</span><Arrow />
              </HomeAction>
              <div className={s.ctaRow}>
                <HomeAction href={startTrial("home-close")} placement="home_footer" locale={locale} className={s.btnLime}>{tOld("freeCta")}<Arrow /></HomeAction>
                <a href={BOOK_CALL} data-cta-placement="home_close" className={s.btnOutline} {...ext}>{t("bookCall")}</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
