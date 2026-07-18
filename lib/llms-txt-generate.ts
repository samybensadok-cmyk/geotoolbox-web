/**
 * llms.txt generator: give it a domain, get a spec-correct llms.txt back.
 *
 * The existing free generator is a manual form — you type every section and
 * link yourself. Both tools ranking above us (llmstxtgenerate.com, Firecrawl)
 * crawl for you, which is the actual job people search for. This does that.
 *
 * Design choice worth stating: we seed from the site's SITEMAP rather than
 * blind-crawling from the homepage. A sitemap is the site's own declaration of
 * what matters, it is far cheaper than a link crawl, and we already have a
 * hardened fetcher for it. We fall back to a shallow homepage link crawl only
 * when there's no sitemap.
 *
 * We also respect robots.txt while doing it — a tool that audits crawler access
 * has no business ignoring the file it tells you to get right.
 */

import { extractSitemap, assertPublicUrl, fetchRobotsTxt, type SitemapUrlEntry } from "./sitemap-extract"
import { parseRobots, isAllowed, type ParsedRobots } from "./robots-match"

export const GEN_LIMITS = {
  /** Free ceiling on pages fetched for metadata. */
  maxPages: 50,
  /** llms-full.txt is much heavier per page, so it gets a lower ceiling. */
  maxFullPages: 20,
  concurrency: 6,
  perPageTimeoutMs: 8_000,
  totalBudgetMs: 45_000,
  /** Bytes of HTML to read per page — titles and meta live in <head>. */
  maxPageBytes: 400_000,
} as const

const UA = "GeoToolboxLlmsTxtGenerator/1.0 (+https://geotoolbox.ai/tools/llms-txt-generator)"

export interface PageMeta {
  url: string
  title: string
  description?: string
  /** Path-derived section this page was grouped into. */
  section: string
  /** Plain-text body, only populated when full-text mode is on. */
  text?: string
}

export interface GenerateResult {
  ok: boolean
  site: string
  siteName: string
  summary?: string
  pages: PageMeta[]
  /** The generated file. */
  llmsTxt: string
  /** Populated only when includeFullText was requested. */
  llmsFullTxt?: string
  discovery: "sitemap" | "homepage-crawl" | "none"
  totalDiscovered: number
  skippedByRobots: number
  warnings: string[]
  error?: string
  elapsedMs: number
}

/* ------------------------------------------------------------------ *
 * HTML metadata extraction
 * ------------------------------------------------------------------ */

/** Valid Unicode scalar, or the original text when the entity is nonsense. */
function safeCodePoint(n: number, original: string): string {
  return Number.isFinite(n) && n >= 0 && n <= 0x10ffff ? String.fromCodePoint(n) : original
}

/** Decode the handful of entities that actually show up in titles. */
function decodeEntities(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;|&#x27;/gi, "'")
    .replace(/&nbsp;/g, " ")
    // Guard the codepoint range: String.fromCodePoint THROWS RangeError above
    // 0x10FFFF, and a single malformed entity from one broken CMS export would
    // otherwise abort the whole generation and return nothing.
    .replace(/&#(\d+);/g, (m, d) => safeCodePoint(Number(d), m))
    .replace(/&#x([0-9a-f]+);/gi, (m, h) => safeCodePoint(parseInt(h, 16), m))
    .replace(/&amp;/g, "&")
}

function clean(s: string, max = 300): string {
  const out = decodeEntities(s).replace(/\s+/g, " ").trim()
  return out.length > max ? `${out.slice(0, max - 1).trimEnd()}…` : out
}

/**
 * Pull a meta tag's content by name or property. Bounded, attribute-order
 * agnostic, and deliberately not one big backtracking regex — the sitemap tool
 * shipped a 105-second ReDoS by being clever here, so this stays dumb.
 */
function metaContent(html: string, keys: string[]): string | undefined {
  const lower = html.toLowerCase()
  let cursor = 0
  for (;;) {
    const at = lower.indexOf("<meta", cursor)
    if (at === -1) return undefined
    const end = lower.indexOf(">", at)
    if (end === -1) return undefined
    const tag = html.slice(at, end + 1)
    const tagLower = lower.slice(at, end + 1)
    cursor = end + 1

    const nameMatch = tagLower.match(/\b(?:name|property)\s*=\s*["']?([a-z0-9:_-]+)/)
    if (!nameMatch || !keys.includes(nameMatch[1])) continue
    const contentMatch = tag.match(/\bcontent\s*=\s*"([^"]*)"|\bcontent\s*=\s*'([^']*)'/i)
    const value = contentMatch?.[1] ?? contentMatch?.[2]
    if (value) return clean(value)
  }
}

function titleOf(html: string): string | undefined {
  const lower = html.toLowerCase()
  const open = lower.indexOf("<title")
  if (open === -1) return undefined
  const gt = lower.indexOf(">", open)
  const close = lower.indexOf("</title", gt)
  if (gt === -1 || close === -1) return undefined
  return clean(html.slice(gt + 1, close), 160) || undefined
}

/** Strip a title's site-name suffix ("Page | Acme" → "Page"). */
function stripBrand(title: string, siteName: string): string {
  if (!siteName) return title
  const parts = title.split(/\s+[|·—–-]\s+/)
  if (parts.length < 2) return title
  const last = parts[parts.length - 1].trim().toLowerCase()
  if (last === siteName.toLowerCase() || siteName.toLowerCase().includes(last)) {
    return parts.slice(0, -1).join(" - ").trim() || title
  }
  return title
}

/**
 * Very rough main-text extraction for llms-full.txt.
 *
 * The tag strip is a forward scan, NOT /<[^>]+>/g. That regex backtracks
 * catastrophically on unclosed "<": measured 35.9 SECONDS on 160KB of "<" and
 * ~2.1s on 120KB of ordinary prose containing bare "<" comparisons ("if a < b").
 * String.replace is synchronous, so neither the abort signal nor maxDuration can
 * interrupt it, and on shared instances it stalls unrelated requests.
 */
function bodyText(html: string): string {
  let out = html
  // Drop the elements whose text is never content.
  for (const tag of ["script", "style", "noscript", "svg", "nav", "footer", "header", "form"]) {
    out = stripElement(out, tag)
  }

  let text = ""
  let cursor = 0
  for (;;) {
    const lt = out.indexOf("<", cursor)
    if (lt === -1) {
      text += out.slice(cursor)
      break
    }
    const gt = out.indexOf(">", lt)
    if (gt === -1) {
      // Unterminated "<": treat the rest as text rather than rescanning.
      text += out.slice(cursor)
      break
    }
    text += `${out.slice(cursor, lt)} `
    cursor = gt + 1
  }
  return clean(text, 20_000)
}

/** Remove <tag>…</tag> blocks by forward scan (no backtracking regex). */
function stripElement(html: string, tag: string): string {
  const lower = html.toLowerCase()
  let out = ""
  let cursor = 0
  for (;;) {
    const open = lower.indexOf(`<${tag}`, cursor)
    if (open === -1) {
      out += html.slice(cursor)
      return out
    }
    const close = lower.indexOf(`</${tag}`, open)
    if (close === -1) {
      out += html.slice(cursor, open)
      return out
    }
    const gt = lower.indexOf(">", close)
    if (gt === -1) {
      out += html.slice(cursor, open)
      return out
    }
    out += html.slice(cursor, open)
    cursor = gt + 1
  }
}

/* ------------------------------------------------------------------ *
 * Fetching
 * ------------------------------------------------------------------ */

/** Max redirect hops, each re-validated. */
const MAX_REDIRECTS = 5

async function fetchPage(url: string, signal: AbortSignal): Promise<string | null> {
  const ctl = new AbortController()
  const timer = setTimeout(() => ctl.abort(), GEN_LIMITS.perPageTimeoutMs)
  const onAbort = () => ctl.abort()
  signal.addEventListener("abort", onAbort)
  try {
    // Follow redirects MANUALLY and re-validate each hop. redirect:"follow"
    // would let a public page 302 to 127.0.0.1 or the cloud metadata endpoint
    // with the guard none the wiser — the same hole the sitemap fetcher had.
    let current = url
    let res: Response | undefined
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      const guard = await assertPublicUrl(current)
      if (guard) return null

      res = await fetch(current, {
        signal: ctl.signal,
        redirect: "manual",
        headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml" },
      })

      if (res.status >= 300 && res.status < 400) {
        const loc = res.headers.get("location")
        await res.body?.cancel().catch(() => {})
        if (!loc || hop === MAX_REDIRECTS) return null
        try {
          current = new URL(loc, current).toString()
        } catch {
          return null
        }
        continue
      }
      break
    }
    if (!res || !res.ok) return null
    const ct = res.headers.get("content-type") ?? ""
    if (ct && !/text\/html|application\/xhtml/i.test(ct)) {
      await res.body?.cancel().catch(() => {})
      return null
    }
    // Read a bounded prefix: metadata is in <head>, and full-text mode only
    // needs a reasonable sample rather than a whole 10MB page.
    const reader = res.body?.getReader()
    if (!reader) return null
    const chunks: Buffer[] = []
    let total = 0
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(Buffer.from(value))
      total += value.byteLength
      if (total >= GEN_LIMITS.maxPageBytes) {
        await reader.cancel().catch(() => {})
        break
      }
    }
    return Buffer.concat(chunks, total).toString("utf8")
  } catch {
    return null
  } finally {
    clearTimeout(timer)
    signal.removeEventListener("abort", onAbort)
  }
}

async function pool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length)
  let cursor = 0
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      for (;;) {
        const i = cursor++
        if (i >= items.length) return
        out[i] = await fn(items[i])
      }
    }),
  )
  return out
}

/* ------------------------------------------------------------------ *
 * Selection + grouping
 * ------------------------------------------------------------------ */

/**
 * Section name from the first MEANINGFUL path segment, title-cased.
 *
 * Numeric segments are skipped: date permalinks (/2026/07/slug/, the WordPress
 * default) would otherwise produce sections literally named "2009", "2010",
 * "2011" — which is what happened on smashingmagazine.com. When every leading
 * segment is numeric the page is a dated post, so it groups under "Articles".
 */
function sectionOf(url: string): string {
  try {
    const p = new URL(url).pathname.split("/").filter(Boolean)
    if (p.length === 0) return "Overview"

    const meaningful = p.find((seg, i) => {
      if (/^\d+$/.test(seg)) return false
      // The last segment is the page itself, not a section — unless it's the
      // only one (a top-level page like /pricing).
      return i < p.length - 1 || p.length === 1
    })
    if (!meaningful) return "Articles"

    const seg = meaningful.replace(/[-_]+/g, " ").trim()
    if (!seg) return "Overview"
    return seg
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  } catch {
    return "Other"
  }
}

function depthOf(url: string): number {
  try {
    return new URL(url).pathname.split("/").filter(Boolean).length
  } catch {
    return 99
  }
}

/**
 * Choose which pages make the file. llms.txt is meant to be a curated index,
 * not a sitemap dump, so this prefers shallow, high-signal pages and spreads
 * the budget across sections rather than letting one blog eat all 50 slots.
 */
/** ISO-639-1 codes that actually appear as URL locale prefixes. Deliberately an
 *  allowlist: matching "any two letters" turns /hr/ (human resources), /it/ (IT
 *  department), /ai/ and /go/ into phantom locales. */
const ISO_639_1 = new Set([
  "aa","ab","af","ak","am","ar","as","ay","az","ba","be","bg","bh","bi","bm","bn","bo","br","bs",
  "ca","ce","co","cs","cy","da","de","dv","dz","ee","el","en","eo","es","et","eu","fa","ff","fi",
  "fj","fo","fr","fy","ga","gd","gl","gn","gu","gv","ha","he","hi","ho","ht","hu","hy","ia","id",
  "ig","ii","ik","is","iu","ja","jv","ka","kg","ki","kk","kl","km","kn","ko","ks","ku","kw","ky",
  "la","lb","lg","li","ln","lo","lt","lu","lv","mg","mi","mk","ml","mn","mr","ms","mt","my","na",
  "nb","nd","ne","nl","nn","no","nr","nv","ny","oc","om","or","pa","pl","ps","pt","qu","rm","rn",
  "ro","ru","rw","sa","sd","se","sg","si","sk","sl","sm","sn","so","sq","sr","ss","st","su","sv",
  "sw","ta","te","tg","th","ti","tk","tl","tn","to","tr","ts","tt","tw","ty","ug","uk","ur","uz",
  "ve","vi","wo","xh","yi","yo","za","zh","zu",
])

function selectPages(urls: SitemapUrlEntry[], cap: number): { urls: string[]; localeSkipped: number } {
  // Pages an LLM index should never point at: auth flows, commerce plumbing,
  // pagination and taxonomy stubs. Verified against real output — /auth/ and
  // /jobs/ were making the cut before this list grew.
  // Pages an LLM index should never point at. Deliberately narrower than the
  // obvious list: "/pages/" is where Shopify puts EVERY content page, "/cookies/"
  // could be a recipe section, and "/categories/" are often an ecommerce site's
  // highest-value entries. So: pagination only when followed by a number, and
  // cookie only in its policy sense.
  const skip = new RegExp(
    "/(tag|tags|feed|rss|search|cart|checkout|basket|account|login|logout|signin|sign-in|" +
      "signup|sign-up|register|auth|admin|wp-admin|wp-json|wp-login|privacy|terms|legal|" +
      "dsgvo|impressum|datenschutz)s?(/|$)" +
      "|/page/\\d+" + // pagination stubs, not /pages/about
      "|/cookie(-|_)?(policy|notice|settings)" +
      // Transactional dead-ends. Real examples that made it into a generated
      // file before this: "Thank You", "Invoices", "Receipts", and
      // "Smashing Email Newsletter Unsubscribe Successful".
      "|thank(-|_)?you|unsubscribe|subscription-confirmed|check-your-email" +
      "|/(invoice|receipt|order-confirmation|password-reset|verify-email)s?(/|$)" +
      // Year/month ARCHIVE STUBS only — /2012/ or /2012/07/ as the whole path.
      // Must NOT match /2026/07/some-article/: date permalinks are the WordPress
      // default, and an earlier version of this rule silently deleted every
      // article on smashingmagazine.com.
      "|/(19|20)\\d{2}(/\\d{1,2})?/?$",
    "i",
  )

  const cleaned = urls
    .map((u) => u.loc)
    .filter((u) => !skip.test(u))
    .filter((u) => !/\.(jpg|jpeg|png|gif|svg|webp|pdf|zip|xml|json|css|js)$/i.test(u))

  // Locale handling. The naive version ("any two-letter first segment that
  // isn't 'en'") was badly wrong: it dropped /en-gb/ as non-English, deleted
  // EVERY page of a German site served under /de/, and false-positived on
  // ordinary sections like /hr/, /it/, /ai/ and /go/. Instead: only treat
  // prefixes as locales when the site actually looks multilingual (≥2 distinct
  // locale-shaped prefixes), then keep the MOST COMMON one rather than assuming
  // English.
  const localeOf = (u: string): string | null => {
    try {
      const first = new URL(u).pathname.split("/").filter(Boolean)[0] ?? ""
      const m = first.toLowerCase().match(/^([a-z]{2})(?:-([a-z]{2}))?$/)
      if (!m || !ISO_639_1.has(m[1])) return null
      return m[0]
    } catch {
      return null
    }
  }

  const localeCounts = new Map<string, number>()
  let unprefixed = 0
  for (const u of cleaned) {
    const loc = localeOf(u)
    if (loc) localeCounts.set(loc, (localeCounts.get(loc) ?? 0) + 1)
    else unprefixed++
  }

  // Decide which locale is primary, then keep only that one.
  //
  //  - Unprefixed pages exist alongside prefixed ones (en at root + /fr/): the
  //    root IS the primary locale. This is the most common i18n shape and an
  //    earlier "needs >=2 prefixes" rule missed it entirely, since there's only
  //    one prefix.
  //  - No unprefixed pages, several prefixes: keep the biggest.
  //  - No unprefixed pages, one prefix (a wholly German site under /de/):
  //    that IS the site. Keep everything.
  let localeSkipped = 0
  let candidates = cleaned
  if (localeCounts.size > 0) {
    const biggestPrefix = [...localeCounts.entries()].sort((a, b) => b[1] - a[1])[0]
    // A handful of stray matches shouldn't trigger locale filtering on a site
    // that merely has a /no/ or /is/ section.
    const prefixedTotal = [...localeCounts.values()].reduce((a, b) => a + b, 0)
    const looksMultilingual = localeCounts.size >= 2 || (unprefixed > 0 && prefixedTotal >= 3)

    if (looksMultilingual) {
      const primary = unprefixed > 0 ? null : biggestPrefix[0]
      candidates = cleaned.filter((u) => {
        const loc = localeOf(u)
        if (loc === primary) return true
        if (primary === null && loc === null) return true
        localeSkipped++
        return false
      })
    }
  }

  const bySection = new Map<string, string[]>()
  for (const u of candidates.sort((a, b) => depthOf(a) - depthOf(b) || a.length - b.length)) {
    const s = sectionOf(u)
    const arr = bySection.get(s) ?? []
    arr.push(u)
    bySection.set(s, arr)
  }

  /*
   * Allocate slots by section SIZE, not evenly.
   *
   * A flat round-robin looks fair and produces nonsense on real sites: on
   * smashingmagazine.com it returned 45 sections for 45 links, giving a
   * one-page "Receipts" section the same weight as /articles/, which has
   * thousands. Sections named "Thank You", "Invoices" and "2012" made the file
   * while the actual articles got one slot.
   *
   * sqrt weighting favours the big sections without letting the largest one
   * swallow the file, and singleton sections are pooled into "Other" so a site
   * with a long tail of one-off pages doesn't fragment into noise.
   */
  // Taxonomy sections are DEMOTED, not banned. On an ecommerce site /category/
  // pages are among the best index entries; on a publisher, /author/ and
  // /category/ are filler that crowds out the actual writing — Smashing spent 19
  // of 47 slots on them before this cap. Allowing a couple of each keeps the
  // ecommerce case working without letting them take over.
  const TAXONOMY = /^(author|authors|category|categories|topic|topics|tag|tags|archive|archives)$/i
  const TAXONOMY_CAP = 3

  const ranked = [...bySection.entries()].sort((a, b) => {
    const at = TAXONOMY.test(a[0]) ? 1 : 0
    const bt = TAXONOMY.test(b[0]) ? 1 : 0
    if (at !== bt) return at - bt // non-taxonomy first
    return b[1].length - a[1].length
  })
  const MAX_SECTIONS = 12

  const primary = ranked
    .slice(0, MAX_SECTIONS)
    .filter(([, v]) => v.length > 1)
    .map(([name, v]) => [name, TAXONOMY.test(name) ? v.slice(0, TAXONOMY_CAP) : v] as [string, string[]])
  const leftovers = [
    ...ranked.slice(0, MAX_SECTIONS).filter(([, v]) => v.length === 1),
    ...ranked.slice(MAX_SECTIONS),
  ].flatMap(([, v]) => v)

  const weights = primary.map(([, v]) => Math.sqrt(v.length))
  const weightTotal = weights.reduce((a, b) => a + b, 0) || 1
  // Reserve a slice for the pooled leftovers so a genuinely flat site still
  // produces something, but never let them dominate.
  const otherBudget = leftovers.length > 0 ? Math.min(Math.ceil(cap * 0.2), leftovers.length) : 0
  const primaryBudget = cap - otherBudget

  const out: string[] = []
  primary.forEach(([, urls], i) => {
    const share = Math.max(1, Math.round((weights[i] / weightTotal) * primaryBudget))
    out.push(...urls.slice(0, share))
  })

  // Top back up round-robin if rounding left us short.
  if (out.length < primaryBudget) {
    const pools = primary.map(([, v]) => v.slice())
    for (const p of pools) p.splice(0, Math.min(p.length, out.length))
    let added = true
    while (out.length < primaryBudget && added) {
      added = false
      for (const p of pools) {
        if (out.length >= primaryBudget) break
        const next = p.shift()
        if (next && !out.includes(next)) {
          out.push(next)
          added = true
        }
      }
    }
  }

  out.push(...leftovers.slice(0, otherBudget))
  return { urls: out.slice(0, cap), localeSkipped }
}

/* ------------------------------------------------------------------ *
 * Serialization
 * ------------------------------------------------------------------ */

/** Escape the markdown-link metacharacters that would break the file. */
function mdText(s: string): string {
  return s.replace(/([[\]])/g, "\\$1")
}

/** Percent-encode parens so an unbalanced ")" in a query string can't terminate
 *  the markdown link early. Balanced parens survive per CommonMark; unbalanced
 *  ones silently truncate the URL. */
function mdUrl(u: string): string {
  return u.replace(/\(/g, "%28").replace(/\)/g, "%29")
}

function buildLlmsTxt(siteName: string, summary: string | undefined, pages: PageMeta[]): string {
  const lines: string[] = [`# ${mdText(siteName)}`, ""]
  if (summary) {
    lines.push(`> ${mdText(summary)}`, "")
  }

  const grouped = new Map<string, PageMeta[]>()
  for (const p of pages) {
    const arr = grouped.get(p.section) ?? []
    arr.push(p)
    grouped.set(p.section, arr)
  }
  // Pool one-page sections into "Other". A file with 45 headers over 45 links
  // is a list wearing a costume — the section structure only means something
  // when sections actually group.
  const bySection = new Map<string, PageMeta[]>()
  const singles: PageMeta[] = []
  for (const [name, items] of grouped) {
    if (items.length === 1 && grouped.size > 3) singles.push(...items)
    else bySection.set(name, items)
  }
  if (singles.length > 0) {
    bySection.set(singles.length === 1 ? (singles[0].section ?? "Other") : "Other", singles)
  }
  // Overview first, then sections by size — biggest sections are usually the
  // ones a reader wants pointed at first.
  const ordered = [...bySection.entries()].sort((a, b) => {
    if (a[0] === "Overview") return -1
    if (b[0] === "Overview") return 1
    return b[1].length - a[1].length
  })

  for (const [section, items] of ordered) {
    lines.push(`## ${mdText(section)}`, "")
    for (const p of items) {
      const note = p.description ? `: ${mdText(clean(p.description, 160))}` : ""
      lines.push(`- [${mdText(p.title)}](${mdUrl(p.url)})${note}`)
    }
    lines.push("")
  }
  return `${lines.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`
}

function buildLlmsFullTxt(siteName: string, summary: string | undefined, pages: PageMeta[]): string {
  const lines: string[] = [`# ${mdText(siteName)}`, ""]
  if (summary) lines.push(`> ${mdText(summary)}`, "")
  for (const p of pages) {
    if (!p.text) continue
    // Neutralize markdown structure inside body text: a stray "## " or "---"
    // from a page would otherwise invent sections in a file meant to be parsed.
    const body = p.text.replace(/^([#>-]{1,6}\s)/gm, " $1").replace(/^-{3,}$/gm, "—")
    lines.push(`## ${mdText(p.title)}`, "", `Source: ${mdUrl(p.url)}`, "", body, "", "---", "")
  }
  return `${lines.join("\n").trim()}\n`
}

/* ------------------------------------------------------------------ *
 * Orchestration
 * ------------------------------------------------------------------ */

export async function generateLlmsTxt(
  input: string,
  opts: { includeFullText?: boolean } = {},
): Promise<GenerateResult> {
  const started = Date.now()
  const budget = new AbortController()
  const budgetTimer = setTimeout(() => budget.abort(), GEN_LIMITS.totalBudgetMs)
  const warnings: string[] = []

  const base: GenerateResult = {
    ok: false,
    site: input,
    siteName: "",
    pages: [],
    llmsTxt: "",
    discovery: "none",
    totalDiscovered: 0,
    skippedByRobots: 0,
    warnings,
    elapsedMs: 0,
  }

  try {
    let raw = input.trim()
    if (!raw) return { ...base, error: "Enter a domain.", elapsedMs: Date.now() - started }
    if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`

    let origin: string
    let host: string
    try {
      const u = new URL(raw)
      origin = u.origin
      host = u.hostname.replace(/^www\./, "")
    } catch {
      return { ...base, error: "That doesn't look like a valid domain.", elapsedMs: Date.now() - started }
    }

    const guard = await assertPublicUrl(origin)
    if (guard) return { ...base, error: guard, elapsedMs: Date.now() - started }

    // robots.txt first: we respect it while crawling, and it usually points at
    // the sitemap too.
    let robots: ParsedRobots | null = null
    try {
      const txt = await fetchRobotsTxt(origin)
      if (txt) robots = parseRobots(txt)
    } catch {
      /* no robots.txt is not an error */
    }

    // Discover pages via the sitemap.
    const sm = await extractSitemap(origin)
    let discovery: GenerateResult["discovery"] = "none"
    let discovered: SitemapUrlEntry[] = []
    if (sm.ok && sm.urls.length > 0) {
      discovery = "sitemap"
      discovered = sm.urls
    } else {
      // Fallback: shallow link harvest from the homepage. Check robots first —
      // this page claims robots compliance as a headline, so the fallback path
      // has to honour it too.
      const homeAllowed = robots ? isAllowed(robots, `${origin}/`, "*").allowed : true
      const html = homeAllowed ? await fetchPage(origin, budget.signal) : null
      if (html) {
        discovery = "homepage-crawl"
        const seen = new Set<string>()
        const lower = html.toLowerCase()
        let cursor = 0
        while (seen.size < 200) {
          const at = lower.indexOf("<a ", cursor)
          if (at === -1) break
          const end = lower.indexOf(">", at)
          if (end === -1) break
          const tag = html.slice(at, end + 1)
          cursor = end + 1
          const href = tag.match(/\bhref\s*=\s*"([^"]*)"|\bhref\s*=\s*'([^']*)'/i)
          const val = href?.[1] ?? href?.[2]
          if (!val || /^(#|mailto:|tel:|javascript:)/i.test(val)) continue
          try {
            const abs = new URL(val, origin)
            if (abs.hostname.replace(/^www\./, "") !== host) continue
            abs.hash = ""
            seen.add(abs.toString())
          } catch {
            /* skip unparseable href */
          }
        }
        discovered = [...seen].map((loc) => ({ loc, source: origin }))
        warnings.push(
          "No sitemap found, so pages were harvested from homepage links. A sitemap gives a much better result — the site's own list of what matters beats our guess.",
        )
      }
    }

    if (discovered.length === 0) {
      return {
        ...base,
        error: `Couldn't discover any pages on ${origin}. No sitemap, and no internal links on the homepage we could read.`,
        elapsedMs: Date.now() - started,
      }
    }

    // Respect robots.txt: don't fetch what the site asked crawlers not to.
    let skippedByRobots = 0
    if (robots) {
      const before = discovered.length
      discovered = discovered.filter((u) => isAllowed(robots, u.loc, "*").allowed)
      skippedByRobots = before - discovered.length
      if (skippedByRobots > 0) {
        warnings.push(
          `Skipped ${skippedByRobots} URL${skippedByRobots === 1 ? "" : "s"} that robots.txt disallows — we don't fetch what a site asked crawlers to leave alone.`,
        )
      }
    }

    const wantFull = opts.includeFullText === true
    const cap = wantFull ? GEN_LIMITS.maxFullPages : GEN_LIMITS.maxPages
    const { urls: chosen, localeSkipped } = selectPages(discovered, cap)

    if (localeSkipped > 0) {
      warnings.push(
        `Left out ${localeSkipped.toLocaleString()} localized page${localeSkipped === 1 ? "" : "s"} (/fr/, /de/ and similar). They're translations of pages already listed, so including them doubles the file without adding information — publish a per-locale llms.txt instead if you need them.`,
      )
    }

    if (discovered.length > chosen.length) {
      warnings.push(
        `Found ${discovered.length.toLocaleString()} pages and indexed the ${chosen.length} most representative. llms.txt is meant to be a curated index, not a sitemap dump — edit the result down further if anything doesn't earn its place.`,
      )
    }

    // Fetch metadata.
    interface Fetched {
      url: string
      rawTitle: string
      description: string | undefined
      siteNameHint: string | undefined
      isHome: boolean
      text: string | undefined
    }

    const fetched = await pool<string, Fetched | null>(chosen, GEN_LIMITS.concurrency, async (url) => {
      // Once the budget is gone, stop doing work — otherwise every remaining URL
      // still costs a DNS lookup in assertPublicUrl before failing.
      if (budget.signal.aborted) return null
      try {
        const html = await fetchPage(url, budget.signal)
        if (!html) return null
        const rawTitle = titleOf(html)
        if (!rawTitle) return null
        const description = metaContent(html, ["description", "og:description"])
        const isHome = (() => {
          try {
            return new URL(url).pathname === "/"
          } catch {
            return false
          }
        })()
        // Keep the raw HTML only where it's still needed (homepage metadata, or
        // full-text mode). Retaining all 50 bodies held ~40MB per request for
        // nothing.
        return {
          url,
          rawTitle,
          description,
          siteNameHint: isHome ? metaContent(html, ["og:site_name"]) : undefined,
          isHome,
          text: wantFull ? bodyText(html) : undefined,
        }
      } catch {
        // One page with a malformed entity or odd encoding must not sink the
        // whole run — degrade to skipping it.
        return null
      }
    })

    const live = fetched.filter((f): f is Fetched => f !== null)

    if (live.length === 0) {
      return {
        ...base,
        discovery,
        totalDiscovered: discovered.length,
        skippedByRobots,
        // Distinguish "we ran out of time" from "the site blocked us". Sitemap
        // discovery can eat the whole budget on a huge site, after which every
        // page fetch fails instantly — reporting that as bot-blocking would send
        // the user chasing the wrong problem.
        error: budget.signal.aborted
          ? `Ran out of time (${GEN_LIMITS.totalBudgetMs / 1000}s) before any pages could be read — this usually means a very large sitemap. Try a specific section of the site instead.`
          : "Found pages but couldn't read any of them — the site may be blocking our fetcher.",
        elapsedMs: Date.now() - started,
      }
    }

    // Site name + summary from the homepage where possible.
    const home = live.find((f) => f.isHome)
    const siteName =
      home?.siteNameHint ??
      home?.rawTitle.split(/\s+[|·—–-]\s+/).pop()?.trim() ??
      host
    const summary = home?.description

    // Drop per-link notes that merely repeat the site-wide description. Many
    // sites emit one boilerplate meta description on every page, and copying it
    // under every link produces a wall of identical text that tells a reader
    // (or a model) nothing — verified on smashingmagazine.com, where 6 of the
    // first 8 links carried the same sentence.
    const norm = (s?: string) => s?.replace(/\s+/g, " ").trim().toLowerCase() ?? ""
    const summaryNorm = norm(summary)
    const descCounts = new Map<string, number>()
    for (const f of live) {
      const k = norm(f.description)
      if (k) descCounts.set(k, (descCounts.get(k) ?? 0) + 1)
    }

    const pages: PageMeta[] = live.map((f) => {
      const k = norm(f.description)
      const boilerplate = k !== "" && (k === summaryNorm || (descCounts.get(k) ?? 0) > 2)
      return {
        url: f.url,
        title: stripBrand(f.rawTitle, siteName),
        description: boilerplate ? undefined : f.description,
        section: sectionOf(f.url),
        text: f.text,
      }
    })

    if (budget.signal.aborted) {
      warnings.push(`Hit the ${GEN_LIMITS.totalBudgetMs / 1000}s time budget — this is a partial result.`)
    }

    return {
      ok: true,
      site: origin,
      siteName,
      summary,
      pages,
      llmsTxt: buildLlmsTxt(siteName, summary, pages),
      llmsFullTxt: wantFull ? buildLlmsFullTxt(siteName, summary, pages) : undefined,
      discovery,
      totalDiscovered: discovered.length,
      skippedByRobots,
      warnings,
      elapsedMs: Date.now() - started,
    }
  } catch (e) {
    return {
      ...base,
      error: e instanceof Error ? e.message : "Something went wrong.",
      elapsedMs: Date.now() - started,
    }
  } finally {
    clearTimeout(budgetTimer)
  }
}
