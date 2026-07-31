/**
 * update-proof-stats.mjs — regenerates lib/proof-stats.generated.json from the
 * Google Search Console API (plus, optionally, Bing Webmaster Tools traffic
 * stats). Runs on a 48h GitHub Action schedule; a push of the regenerated JSON
 * triggers the Vercel deploy, so the service-page proof numbers and the growth
 * chart update together and can never drift.
 *
 * Zero npm dependencies: service-account JWT is signed with node:crypto and
 * exchanged for an access token directly.
 *
 * Auth:
 *  - GOOGLE_APPLICATION_CREDENTIALS: path to a service-account JSON key. The
 *    account must be a user on the GSC property (gsc-reader@seo-audit-tools-…
 *    already is). In CI the key arrives via the GSC_SA_KEY secret.
 *  - BING_WMT_API_KEY (optional): Bing Webmaster Tools API key. When present,
 *    daily impressions become a Google+Bing blend; when absent or failing, the
 *    figure stays Google-only and the page labels it accordingly. A Bing
 *    failure never blocks the Google update.
 *
 * Metric definitions (keep in sync with the provenance notes in proof-stats.ts):
 *  - rankedKeywords / top10 / top3: unique queries over a TRAILING 28 full
 *    days (never calendar month-to-date — that would reset to ~0 every 1st),
 *    bucketed by average position (top3 = pos ≤ 3, top10 = pos ≤ 10).
 *    Exact counts via 25k-row pagination — no Looker 1M-row cap.
 *  - monthly[]: unique-query counts per calendar month since May 2026 (the
 *    month publishing began), feeding the GrowthCharts component. The current
 *    month is included only once ≥ 10 days have elapsed (a 2-day bar next to
 *    a full month reads as a collapse), and is flagged partial for labeling.
 *  - impressions/clicks per day: mean over a trailing 28 full days ending
 *    3 days ago (GSC data lags ~2 days).
 *  - NOT here: Bing WMT "AI Performance" citations — that report has no public
 *    API (confirmed 2026-07-31, on Microsoft's backlog); it stays a manual
 *    field in proof-stats.ts with its own "as of" stamp.
 */
import { createSign } from "node:crypto"
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const SITE = "sc-domain:geotoolbox.ai"
const BING_SITE = "https://geotoolbox.ai"
const FIRST_MONTH = "2026-05" // publishing began; charts start here
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "lib", "proof-stats.generated.json")

// ---------- Google auth (service-account JWT → access token) ----------
async function googleToken() {
  const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
  if (!keyPath) throw new Error("GOOGLE_APPLICATION_CREDENTIALS not set")
  const key = JSON.parse(readFileSync(keyPath, "utf8"))
  const now = Math.floor(Date.now() / 1000)
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url")
  const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({
    iss: key.client_email,
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })}`
  const signature = createSign("RSA-SHA256").update(unsigned).sign(key.private_key, "base64url")
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${signature}`,
    }),
  })
  if (!res.ok) throw new Error(`token exchange failed: ${res.status} ${await res.text()}`)
  return (await res.json()).access_token
}

// ---------- GSC query (paginated) ----------
async function gscQuery(token, body) {
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`
  const rows = []
  for (let startRow = 0; ; startRow += 25000) {
    const res = await fetch(url, {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({ rowLimit: 25000, startRow, dataState: "all", ...body }),
    })
    if (!res.ok) throw new Error(`GSC query failed: ${res.status} ${await res.text()}`)
    const page = (await res.json()).rows ?? []
    rows.push(...page)
    if (page.length < 25000) return rows
  }
}

const iso = (d) => d.toISOString().slice(0, 10)
const monthLabel = (ym) =>
  new Date(`${ym}-01T00:00:00Z`).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" })

function* monthsSince(firstYm, today) {
  let [y, m] = firstYm.split("-").map(Number)
  const curYm = today.toISOString().slice(0, 7)
  while (true) {
    const ym = `${y}-${String(m).padStart(2, "0")}`
    if (ym > curYm) return
    yield ym
    m === 12 ? ((y += 1), (m = 1)) : (m += 1)
  }
}

function bucketQueries(rows) {
  let top3 = 0
  let top10 = 0
  for (const r of rows) {
    if (r.position <= 3) top3++
    if (r.position <= 10) top10++
  }
  return { queries: rows.length, top3, top4to10: top10 - top3, top10 }
}

// ---------- Bing WMT daily traffic (optional) ----------
async function bingDailyImpressions(windowStart, windowEnd) {
  const key = process.env.BING_WMT_API_KEY
  if (!key) return null
  try {
    const url = `https://ssl.bing.com/webmaster/api.svc/json/GetRankAndTrafficStats?apikey=${key}&siteUrl=${encodeURIComponent(BING_SITE)}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const days = (await res.json()).d ?? []
    // Rows carry /Date(ms)/ timestamps; keep the same 28-day window as Google.
    const inWindow = days.filter((r) => {
      const ms = Number(/\d+/.exec(r.Date)?.[0])
      const d = iso(new Date(ms))
      return d >= windowStart && d <= windowEnd
    })
    if (!inWindow.length) throw new Error("no rows in window")
    return Math.round(inWindow.reduce((s, r) => s + r.Impressions, 0) / inWindow.length)
  } catch (e) {
    console.warn(`⚠ Bing WMT fetch failed (${e.message}) — falling back to Google-only impressions`)
    return null
  }
}

// ---------- main ----------
const token = await googleToken()
const today = new Date()

// Monthly unique-query series (chart). The current month only joins the chart
// once ≥ 10 days have elapsed, and is flagged partial so the label can say so.
const monthly = []
for (const ym of monthsSince(FIRST_MONTH, today)) {
  const isCurrent = ym === iso(today).slice(0, 7)
  if (isCurrent && today.getUTCDate() < 10) continue
  const start = `${ym}-01`
  const monthEnd = iso(new Date(Date.UTC(+ym.slice(0, 4), +ym.slice(5, 7), 0)))
  const end = monthEnd < iso(today) ? monthEnd : iso(today)
  const rows = await gscQuery(token, { startDate: start, endDate: end, dimensions: ["query"] })
  const b = bucketQueries(rows)
  monthly.push({ month: ym, label: monthLabel(ym), partial: isCurrent, ...b })
  console.log(`${ym}: ${b.queries} queries · top3 ${b.top3} · top4-10 ${b.top4to10}${isCurrent ? " (partial)" : ""}`)
}

// Headline stats + daily clicks/impressions — one trailing window of 28 full
// days ending 3 days ago (GSC lag), so the figures never reset with the
// calendar and "per day" divides by a complete window.
const end = new Date(today.getTime() - 3 * 86400e3)
const start = new Date(end.getTime() - 27 * 86400e3)
const win = { startDate: iso(start), endDate: iso(end) }
const current = bucketQueries(await gscQuery(token, { ...win, dimensions: ["query"] }))
const daily = await gscQuery(token, { ...win, dimensions: ["date"] })
const days = Math.max(daily.length, 1)
const googlePerDay = Math.round(daily.reduce((s, r) => s + r.impressions, 0) / days)
const clicksPerDay = Math.round(daily.reduce((s, r) => s + r.clicks, 0) / days)

const bingPerDay = await bingDailyImpressions(iso(start), iso(end))

// Sanity floor — the one silent-wrong path is a 200 with empty/thin rows (the
// HTTP layer fails loudly). Never unattended-ship a collapse: if the new count
// is less than half the previously published figure, abort without writing.
if (current.queries === 0) throw new Error("sanity: GSC returned 0 queries — refusing to publish")
try {
  const prev = JSON.parse(readFileSync(OUT, "utf8"))
  const prevKw = prev?.google?.rankedKeywords ?? 0
  if (prevKw >= 100 && current.queries < prevKw / 2)
    throw new Error(`sanity: queries dropped ${prevKw} → ${current.queries} (>50%) — refusing to publish; investigate manually`)
} catch (e) {
  if (String(e.message).startsWith("sanity:")) throw e
  // no previous file (first run) — proceed
}
console.log(`(clicks/day over the same window: ${clicksPerDay} — logged only, not published)`)

const out = {
  generatedAt: iso(today),
  asOf: today.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }),
  site: SITE,
  // NOTE: this JSON ships to the client bundle (GrowthCharts is a client
  // component) — publish only fields a surface actually renders.
  google: {
    rankedKeywords: current.queries,
    top10: current.top10,
    top3: current.top3,
    impressionsPerDay: googlePerDay,
    windowDays: 28,
  },
  impressions: {
    perDay: bingPerDay == null ? googlePerDay : googlePerDay + bingPerDay,
    source: bingPerDay == null ? "google" : "google+bing",
    googlePerDay,
    bingPerDay,
  },
  monthly,
}
writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n")
console.log(`\nWrote ${OUT}`)
console.log(
  `Trailing 28d: ${current.queries} queries · ${current.top10} top-10 · ${current.top3} top-3 · ` +
    `${googlePerDay}/day Google impressions${bingPerDay != null ? ` + ${bingPerDay}/day Bing` : " (no Bing key)"}`
)
