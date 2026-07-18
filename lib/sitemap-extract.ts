/**
 * Sitemap fetching + parsing core, shared by the sitemap tools.
 *
 * Handles the things real sitemaps actually do and most free extractors don't:
 *   - <sitemapindex> recursion (walk every child sitemap, depth-capped)
 *   - gzipped .xml.gz files (a gzipped *file*, which fetch does NOT auto-inflate,
 *     unlike Content-Encoding: gzip which it does)
 *   - plain-text sitemaps (one URL per line, allowed by sitemaps.org)
 *   - path auto-detect, so "acme.com" works as input, not just a full sitemap URL
 *
 * Deliberately dependency-free: a regex-based parser beats pulling an XML lib in
 * for a format this constrained, and sitemaps in the wild are frequently
 * malformed enough that a strict parser would reject files users need read.
 */

import { gunzipSync } from "node:zlib"
import dns from "node:dns/promises"
import net from "node:net"

/** Hard ceilings. sitemaps.org caps a single file at 50k URLs / 50MB uncompressed. */
export const LIMITS = {
  /** Max URLs returned to the client. Above this we truncate and say so. */
  maxUrls: 50_000,
  /** Max bytes for a single sitemap file (uncompressed). */
  maxBytes: 50 * 1024 * 1024,
  /** Max child sitemaps to walk from an index. */
  maxChildSitemaps: 200,
  /** How deep to recurse through nested indexes (index → index → urlset). */
  maxDepth: 3,
  /** Per-request fetch timeout. */
  timeoutMs: 12_000,
  /** Total wall-clock budget for a whole extraction. */
  totalBudgetMs: 45_000,
} as const

/** Paths to probe when the user gives a bare domain rather than a sitemap URL.
 *  Ordered by real-world frequency; wp-sitemap.xml is WordPress core since 5.5
 *  and the long-tail data shows users arrive with WP-native paths in hand. */
export const COMMON_SITEMAP_PATHS = [
  "/sitemap.xml",
  "/sitemap_index.xml",
  "/wp-sitemap.xml",
  "/sitemap-index.xml",
  "/sitemap/sitemap.xml",
  "/sitemap1.xml",
  "/sitemap.xml.gz",
] as const

export interface SitemapUrlEntry {
  loc: string
  lastmod?: string
  changefreq?: string
  priority?: string
  /** Which sitemap file this URL came from — matters once an index fans out. */
  source: string
}

export interface ExtractResult {
  ok: boolean
  /** The sitemap URL we actually ended up reading. */
  resolvedFrom: string
  /** How we found it: given directly, probed, or read from robots.txt. */
  discovery: "direct" | "probed" | "robots.txt"
  /** Unique page URLs, de-duplicated by <loc>. */
  urls: SitemapUrlEntry[]
  /** Total <loc> entries seen before de-duplication. */
  rawCount: number
  /** How many entries were collapsed as duplicates. */
  duplicatesRemoved: number
  /** Every sitemap file touched, with its own URL count. */
  sitemaps: { url: string; count: number; kind: "index" | "urlset" | "text"; error?: string }[]
  truncated: boolean
  warnings: string[]
  error?: string
  elapsedMs: number
}

/* ------------------------------------------------------------------ *
 * SSRF guard
 * ------------------------------------------------------------------ */

const BLOCKED_HOSTNAMES = new Set(["localhost", "metadata.google.internal", "instance-data"])

/** True for addresses that must never be reachable from a public tool: loopback,
 *  RFC1918, link-local (incl. the 169.254.169.254 cloud metadata endpoint), CGNAT,
 *  and the IPv6 equivalents. */
function isPrivateAddress(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const p = ip.split(".").map(Number)
    if (p[0] === 10) return true
    if (p[0] === 127) return true
    if (p[0] === 0) return true
    if (p[0] === 172 && p[1] >= 16 && p[1] <= 31) return true
    if (p[0] === 192 && p[1] === 168) return true
    if (p[0] === 169 && p[1] === 254) return true // link-local + cloud metadata
    if (p[0] === 100 && p[1] >= 64 && p[1] <= 127) return true // CGNAT
    if (p[0] >= 224) return true // multicast + reserved
    return false
  }
  if (net.isIPv6(ip)) {
    const a = ip.toLowerCase()
    if (a === "::1" || a === "::") return true
    if (a.startsWith("fe80")) return true // link-local
    if (a.startsWith("fc") || a.startsWith("fd")) return true // unique-local
    // IPv4-mapped addresses must be re-checked against the v4 rules. Node
    // normalizes these to HEX form ("::ffff:a00:1"), not the dotted form people
    // type ("::ffff:10.0.0.1"), so both shapes have to be handled — matching only
    // the dotted one let ::ffff:10.0.0.1 through as "public".
    if (a.startsWith("::ffff:")) {
      const dotted = a.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/)
      if (dotted) return isPrivateAddress(dotted[1])
      const hex = a.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/)
      if (hex) {
        const hi = parseInt(hex[1], 16)
        const lo = parseInt(hex[2], 16)
        return isPrivateAddress(`${hi >> 8}.${hi & 255}.${lo >> 8}.${lo & 255}`)
      }
      return true // unrecognized mapped form → refuse rather than guess
    }
    if (a.startsWith("::")) return true // ::, ::1, and other unspecified/compat forms
    return false
  }
  return true // unparseable → refuse
}

/** Validate a URL is public http(s) and does not resolve to internal space.
 *  Returns null when safe, or a human-readable reason to refuse. */
export async function assertPublicUrl(raw: string): Promise<string | null> {
  let u: URL
  try {
    u = new URL(raw)
  } catch {
    return "That doesn't look like a valid URL."
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    return "Only http and https URLs can be fetched."
  }
  // Restrict the port. Without this, a public hostname on :22 / :3306 / :6379
  // passes every other check, and response timing distinguishes "connection
  // refused" from "filtered" — turning the status checker into a port scanner
  // pointed at arbitrary hosts and attributed to our egress IPs.
  if (u.port !== "" && !["80", "443", "8080", "8443"].includes(u.port)) {
    return "Only standard web ports (80, 443, 8080, 8443) can be fetched."
  }
  // URL.hostname keeps IPv6 literals bracketed ("[::1]"); strip them so the
  // net.isIP literal check below actually sees an address.
  const host = u.hostname.toLowerCase().replace(/\.$/, "").replace(/^\[|\]$/g, "")
  if (BLOCKED_HOSTNAMES.has(host) || host.endsWith(".localhost") || host.endsWith(".internal")) {
    return "That host isn't reachable from this tool."
  }
  // A literal IP in the URL still has to clear the private-range check.
  if (net.isIP(host) && isPrivateAddress(host)) {
    return "That address is in private network space."
  }
  try {
    const records = await dns.lookup(host, { all: true })
    if (records.length === 0) return "That domain didn't resolve."
    // Refuse if ANY resolved address is private — a hostname resolving to both a
    // public and a private address is a classic DNS-rebinding shape.
    if (records.some((r) => isPrivateAddress(r.address))) {
      return "That domain resolves to a private address."
    }
  } catch {
    return "That domain didn't resolve."
  }
  return null
}

/* ------------------------------------------------------------------ *
 * Fetching
 * ------------------------------------------------------------------ */

const UA =
  "GeoToolboxSitemapExtractor/1.0 (+https://geotoolbox.ai/tools/sitemap-extractor)"

interface FetchedBody {
  text: string
  status: number
  contentType: string
}

/** Max redirect hops to follow. Each hop is re-validated against the SSRF guard. */
const MAX_REDIRECTS = 5

/**
 * Fetch with the SSRF guard applied to EVERY hop.
 *
 * Two holes this closes that a naive fetch leaves open:
 *   1. redirect:"follow" would let a public URL 302 to 127.0.0.1 or to the cloud
 *      metadata endpoint, with the guard none the wiser — so we follow manually
 *      and re-validate each Location.
 *   2. Child sitemaps parsed out of a <sitemapindex> are attacker-controlled
 *      content; every one of them comes back through here and gets validated,
 *      rather than trusting the index because its parent URL was public.
 *
 * Residual risk: DNS rebinding between our lookup and the kernel's connect is
 * not fully preventable without pinning the resolved IP (which breaks TLS SNI).
 * The blast radius is limited — this endpoint returns parsed sitemap URLs, not
 * arbitrary response bodies — but it is a known limit, not an oversight.
 */
async function fetchBody(url: string, signal?: AbortSignal): Promise<FetchedBody> {
  const ctl = new AbortController()
  const timer = setTimeout(() => ctl.abort(), LIMITS.timeoutMs)
  // Abort the inner fetch if the overall budget runs out.
  const onOuterAbort = () => ctl.abort()
  signal?.addEventListener("abort", onOuterAbort)
  try {
    let current = url
    let res: Response | undefined

    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      const unsafe = await assertPublicUrl(current)
      if (unsafe) throw new Error(unsafe)

      res = await fetch(current, {
        signal: ctl.signal,
        redirect: "manual",
        headers: {
          "User-Agent": UA,
          // Ask for the gzipped form too; some hosts only serve .xml.gz.
          Accept: "application/xml,text/xml,text/plain,application/gzip;q=0.9,*/*;q=0.8",
        },
      })

      if (res.status >= 300 && res.status < 400) {
        const loc = res.headers.get("location")
        if (!loc) break
        if (hop === MAX_REDIRECTS) throw new Error("Too many redirects.")
        // Resolve relative Location headers against the current URL.
        current = new URL(loc, current).toString()
        continue
      }
      break
    }

    if (!res) throw new Error("Fetch failed.")
    const contentType = res.headers.get("content-type") ?? ""
    const tooBig = `File is larger than the ${LIMITS.maxBytes / 1024 / 1024}MB limit.`

    // Guard on the declared length before reading, when the server provides it.
    const declared = Number(res.headers.get("content-length") ?? "0")
    if (declared > LIMITS.maxBytes) throw new Error(tooBig)

    // Read incrementally and bail the moment we cross the cap. Buffering the whole
    // body first (res.arrayBuffer()) would let a server with a missing or lying Content-Length
    // stream gigabytes into memory before the check ever ran.
    const buf = await readCapped(res, LIMITS.maxBytes, tooBig)

    // .xml.gz is a gzipped FILE. fetch transparently handles Content-Encoding: gzip,
    // but not this — so sniff the gzip magic number (1f 8b) and inflate ourselves.
    let raw: Buffer
    if (buf.length > 2 && buf[0] === 0x1f && buf[1] === 0x8b) {
      try {
        // maxOutputLength caps the INFLATED size, which is what stops a gzip bomb:
        // a few KB of .gz can otherwise expand to gigabytes and take the process out.
        raw = gunzipSync(buf, { maxOutputLength: LIMITS.maxBytes })
      } catch (e) {
        throw new Error(
          e instanceof RangeError || /maxOutputLength/i.test(String(e))
            ? tooBig
            : "File looked gzipped but couldn't be decompressed.",
        )
      }
    } else {
      raw = buf
    }
    return { text: decodeBody(raw, contentType), status: res.status, contentType }
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener("abort", onOuterAbort)
  }
}

/** Stream a response body, aborting as soon as it exceeds `cap` bytes. */
async function readCapped(res: Response, cap: number, tooBigMsg: string): Promise<Buffer> {
  if (!res.body) return Buffer.alloc(0)
  const reader = res.body.getReader()
  const chunks: Buffer[] = []
  let total = 0
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      total += value.byteLength
      if (total > cap) {
        await reader.cancel().catch(() => {})
        throw new Error(tooBigMsg)
      }
      chunks.push(Buffer.from(value))
    }
  } finally {
    reader.releaseLock?.()
  }
  return Buffer.concat(chunks, total)
}

/**
 * Decode bytes to text, honouring the encoding the document actually declares.
 * Assuming UTF-8 everywhere silently corrupts any sitemap served as ISO-8859-1
 * or UTF-16 — non-ASCII URLs become replacement characters, which then breaks
 * both extraction and de-duplication.
 */
function decodeBody(buf: Buffer, contentType: string): string {
  // BOM wins over every declaration.
  if (buf.length >= 2) {
    if (buf[0] === 0xff && buf[1] === 0xfe) return new TextDecoder("utf-16le").decode(buf)
    if (buf[0] === 0xfe && buf[1] === 0xff) return new TextDecoder("utf-16be").decode(buf)
  }
  if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    return buf.subarray(3).toString("utf8")
  }

  let charset = contentType.match(/charset=["']?([\w-]+)/i)?.[1]
  if (!charset) {
    // Fall back to the XML declaration in the first bytes, read as latin1 so the
    // declaration is legible regardless of the real encoding.
    charset = buf.subarray(0, 200).toString("latin1").match(/encoding=["']([\w-]+)["']/i)?.[1]
  }
  if (charset && !/^utf-?8$/i.test(charset)) {
    try {
      return new TextDecoder(charset).decode(buf)
    } catch {
      // Unknown label — fall through to UTF-8 rather than failing the whole fetch.
    }
  }
  return buf.toString("utf8")
}

/* ------------------------------------------------------------------ *
 * Parsing
 * ------------------------------------------------------------------ */

function decodeEntities(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&amp;/g, "&") // last, so &amp;lt; doesn't double-decode
}

/**
 * Strip XML comments so commented-out <url> blocks aren't parsed as live entries.
 *
 * Forward scan rather than /<!--[\s\S]*?-->/g: on input containing many unclosed
 * "<!--" the lazy regex rescans to end-of-string from each opener, which is
 * quadratic (measured: 242KB of unclosed openers took 736ms, 20MB never
 * finished). Sitemap bodies are attacker-supplied, so this has to be linear.
 */
function stripComments(xml: string): string {
  if (!xml.includes("<!--")) return xml
  let out = ""
  let cursor = 0
  for (;;) {
    const open = xml.indexOf("<!--", cursor)
    if (open === -1) {
      out += xml.slice(cursor)
      break
    }
    out += xml.slice(cursor, open)
    const close = xml.indexOf("-->", open + 4)
    if (close === -1) break // unterminated comment swallows the rest, as XML would
    cursor = close + 3
  }
  return out
}

/**
 * Find `<tag …> … </tag>` blocks by forward scan, allowing an optional namespace
 * prefix. Replaces /<(?:[a-z0-9._-]+:)?url\b[\s\S]*?<\/…>/g, which rescanned to
 * end-of-string from every unmatched opener — O(n²) on malformed input.
 */
function findBlocks(xml: string, tag: string, limit = 200_000): string[] {
  const out: string[] = []
  const lower = xml.toLowerCase()
  const openBare = `<${tag}`
  const closeBare = `</${tag}`
  let cursor = 0

  while (out.length < limit) {
    // Locate the next opener, bare or namespace-prefixed.
    let open = lower.indexOf(openBare, cursor)
    let openLen = openBare.length
    const colonOpen = findPrefixed(lower, tag, cursor, false)
    if (colonOpen !== -1 && (open === -1 || colonOpen.index < open)) {
      open = colonOpen.index
      openLen = colonOpen.length
    }
    if (open === -1) break

    // The character after the tag name must end it — otherwise <urlset> matches <url>.
    const after = lower[open + openLen]
    if (after !== undefined && after !== ">" && after !== " " && after !== "\t" && after !== "\n" && after !== "\r" && after !== "/") {
      cursor = open + openLen
      continue
    }

    let close = lower.indexOf(closeBare, open)
    const colonClose = findPrefixed(lower, tag, open, true)
    if (colonClose !== -1 && (close === -1 || colonClose.index < close)) {
      close = colonClose.index
      // fall through; end computed below
    }
    if (close === -1) break

    const gt = lower.indexOf(">", close)
    if (gt === -1) break
    out.push(xml.slice(open, gt + 1))
    cursor = gt + 1
  }
  return out
}

/** Locate `<ns:tag` (or `</ns:tag`) at or after `from`. Returns -1 or {index,length}. */
function findPrefixed(
  lower: string,
  tag: string,
  from: number,
  closing: boolean,
): { index: number; length: number } | -1 {
  const needle = `:${tag}`
  let i = from
  for (;;) {
    const at = lower.indexOf(needle, i)
    if (at === -1) return -1
    // Walk back over the prefix to the "<" (or "</").
    let j = at - 1
    while (j >= 0 && /[a-z0-9._-]/.test(lower[j])) j--
    const isClose = j >= 1 && lower[j] === "/" && lower[j - 1] === "<"
    const isOpen = j >= 0 && lower[j] === "<"
    const start = isClose ? j - 1 : j
    if (j < at - 1 && ((closing && isClose) || (!closing && isOpen && !isClose))) {
      return { index: start, length: at + needle.length - start }
    }
    i = at + needle.length
  }
}

const NS = "(?:[a-z0-9._-]+:)?"

function matchTag(block: string, tag: string, allowPrefix: boolean): string | undefined {
  const p = allowPrefix ? NS : ""
  const re = new RegExp(`<${p}${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${p}${tag}\\s*>`, "i")
  return block.match(re)?.[1]
}

function tagText(block: string, tag: string): string | undefined {
  // Try the unprefixed tag first. This ordering matters: an image sitemap nests
  // <image:loc> inside <url>, and preferring the prefixed form would return the
  // image URL instead of the page URL.
  const inner = matchTag(block, tag, false) ?? matchTag(block, tag, true)
  if (inner === undefined) return undefined
  const cdata = inner.match(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/)
  // Entities are NOT expanded inside CDATA — decoding there would turn a literal
  // "&amp;" in a query string into "&" and change the URL.
  const v = (cdata ? cdata[1] : decodeEntities(inner)).trim()
  return v || undefined
}

export type SitemapKind = "index" | "urlset" | "text" | "unknown"

export function detectKind(body: string): SitemapKind {
  const head = stripComments(body.slice(0, 8000)).toLowerCase()
  // Allow a namespace prefix (<sm:urlset>), which is valid and does occur.
  if (/<(?:[a-z0-9._-]+:)?sitemapindex[\s>]/.test(head)) return "index"
  if (/<(?:[a-z0-9._-]+:)?urlset[\s>]/.test(head)) return "urlset"
  // A plain-text sitemap: non-empty, no XML, and the first real line is a URL.
  const firstLine = body.trim().split(/\r?\n/, 1)[0]?.trim() ?? ""
  if (!head.includes("<") && /^https?:\/\//i.test(firstLine)) return "text"
  return "unknown"
}

/** Pull <url> entries out of a <urlset>. */
export function parseUrlset(body: string, source: string): SitemapUrlEntry[] {
  const out: SitemapUrlEntry[] = []
  const blocks = findBlocks(stripComments(body), "url")
  for (const b of blocks) {
    const loc = tagText(b, "loc")
    if (!loc) continue
    out.push({
      loc,
      lastmod: tagText(b, "lastmod"),
      changefreq: tagText(b, "changefreq"),
      priority: tagText(b, "priority"),
      source,
    })
  }
  return out
}

/** Pull child sitemap URLs out of a <sitemapindex>. */
export function parseIndex(body: string): string[] {
  const out: string[] = []
  const blocks = findBlocks(stripComments(body), "sitemap")
  for (const b of blocks) {
    const loc = tagText(b, "loc")
    if (loc) out.push(loc)
  }
  return out
}

/**
 * Is `a` the same host as `b`, or a subdomain of it?
 *
 * Deliberately NOT a registrable-domain ("last two labels") comparison: that
 * treats every `*.co.uk`, `*.github.io`, `*.vercel.app` and `*.pages.dev` host
 * as one site, which is both wrong and a weaker check than it appears. Exact
 * host or a subdomain of the parent covers the real cases (a sitemap index
 * pointing at de.example.com) without a PSL dependency.
 *
 * Note this is a spec-conformance check, not the SSRF control — the per-hop
 * guard inside fetchBody is what actually prevents internal fetches.
 */
function sameSite(child: string, parent: string): boolean {
  try {
    const c = new URL(child).hostname.toLowerCase().replace(/^www\./, "")
    const p = new URL(parent).hostname.toLowerCase().replace(/^www\./, "")
    return c === p || c.endsWith(`.${p}`) || p.endsWith(`.${c}`)
  } catch {
    return false
  }
}

/** Turn an HTTP status into something a user can act on. A bare "HTTP 403" reads
 *  like our bug; it's almost always the site's bot protection refusing us. */
function describeStatus(status: number): string {
  if (status === 403 || status === 401) {
    return `HTTP ${status} — the site blocked our request (bot protection). Try downloading the sitemap and hosting it somewhere fetchable, or use a crawler that runs from your own IP.`
  }
  if (status === 404) return "HTTP 404 — no sitemap at that address."
  if (status === 429) return "HTTP 429 — the site is rate-limiting us. Wait a minute and retry."
  if (status >= 500) return `HTTP ${status} — the site's server errored.`
  return `HTTP ${status}`
}

function parseText(body: string, source: string): SitemapUrlEntry[] {
  return body
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => /^https?:\/\//i.test(l))
    .map((loc) => ({ loc, source }))
}

/* ------------------------------------------------------------------ *
 * Discovery
 * ------------------------------------------------------------------ */

/** Fetch a site's robots.txt through the same guarded path. Returns null when
 *  there isn't one (a 404 means nothing is blocked, which is not an error). */
export async function fetchRobotsTxt(origin: string): Promise<string | null> {
  const { text, status } = await fetchBody(`${origin}/robots.txt`)
  return status === 200 ? text : null
}

/** Read robots.txt and return any Sitemap: directives. This is the correct
 *  first move for a bare domain — it's where the site itself declares the answer. */
async function sitemapsFromRobots(origin: string, signal?: AbortSignal): Promise<string[]> {
  try {
    const { text, status } = await fetchBody(`${origin}/robots.txt`, signal)
    if (status !== 200) return []
    return text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => /^sitemap:/i.test(l))
      .map((l) => l.slice(l.indexOf(":") + 1).trim())
      .filter((u) => /^https?:\/\//i.test(u))
  } catch {
    return []
  }
}

/** Turn whatever the user typed into a sitemap URL we can actually read. */
async function discover(
  input: string,
  signal?: AbortSignal,
): Promise<{ url: string; discovery: ExtractResult["discovery"]; warnings: string[] } | { error: string }> {
  const warnings: string[] = []
  let raw = input.trim()
  if (!raw) return { error: "Enter a sitemap URL or a domain." }
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`

  let u: URL
  try {
    u = new URL(raw)
  } catch {
    return { error: "That doesn't look like a valid URL." }
  }

  // Looks like a sitemap file already — use it directly.
  const looksLikeFile = /\.(xml|xml\.gz|txt)$/i.test(u.pathname) || /sitemap/i.test(u.pathname)
  if (looksLikeFile && u.pathname !== "/") {
    return { url: u.toString(), discovery: "direct", warnings }
  }

  const origin = u.origin

  // 1. Ask robots.txt — the site's own declaration beats our guesses.
  const fromRobots = await sitemapsFromRobots(origin, signal)
  if (fromRobots.length > 0) {
    if (fromRobots.length > 1) {
      warnings.push(
        `robots.txt declares ${fromRobots.length} sitemaps. Extracted the first (${fromRobots[0]}); paste another directly to read it instead.`,
      )
    }
    return { url: fromRobots[0], discovery: "robots.txt", warnings }
  }

  // 2. Probe the common paths.
  for (const path of COMMON_SITEMAP_PATHS) {
    if (signal?.aborted) break
    try {
      const { text, status } = await fetchBody(`${origin}${path}`, signal)
      if (status === 200 && detectKind(text) !== "unknown") {
        return { url: `${origin}${path}`, discovery: "probed", warnings }
      }
    } catch {
      // try the next path
    }
  }

  return {
    error: `No sitemap found at ${origin}. Checked robots.txt and ${COMMON_SITEMAP_PATHS.length} common paths. Paste the sitemap URL directly if it lives somewhere else.`,
  }
}

/* ------------------------------------------------------------------ *
 * Orchestration
 * ------------------------------------------------------------------ */

/**
 * Parse sitemap XML the user supplied directly (paste or file upload), with no
 * fetching at all. This exists because bot protection legitimately blocks our
 * fetcher on some sites (nytimes.com 403s), and "the site blocked us" is a much
 * better error when it comes with a way to proceed anyway.
 *
 * A sitemap INDEX can't be walked here — we have the index but not its children,
 * and fetching them would defeat the point of the paste path — so we say so
 * rather than returning the child sitemap URLs as if they were pages.
 */
export function extractFromText(xml: string, sourceLabel = ""): ExtractResult {
  const started = Date.now()
  const source = sourceLabel.trim() || "pasted content"
  const kind = detectKind(xml)

  const base: ExtractResult = {
    ok: false,
    resolvedFrom: source,
    discovery: "direct",
    urls: [],
    rawCount: 0,
    duplicatesRemoved: 0,
    sitemaps: [],
    truncated: false,
    warnings: [],
    elapsedMs: 0,
  }

  if (kind === "unknown") {
    return { ...base, error: "That doesn't parse as a sitemap. Expected XML with <urlset> or <sitemapindex>, or a plain-text list of URLs.", elapsedMs: Date.now() - started }
  }

  if (kind === "index") {
    const children = parseIndex(xml)
    return {
      ...base,
      sitemaps: [{ url: source, count: children.length, kind: "index" }],
      warnings: [
        `This is a sitemap index listing ${children.length} child sitemaps, not page URLs. Paste one of the child files, or use the URL field so we can walk them for you.`,
      ],
      urls: children.map((loc) => ({ loc, source })),
      rawCount: children.length,
      ok: true,
      elapsedMs: Date.now() - started,
    }
  }

  const entries = kind === "text" ? parseText(xml, source) : parseUrlset(xml, source)
  const byLoc = new Map<string, SitemapUrlEntry>()
  for (const e of entries) if (!byLoc.has(e.loc)) byLoc.set(e.loc, e)
  const unique = [...byLoc.values()]
  const warnings: string[] = []
  if (entries.length - unique.length > 0) {
    warnings.push(
      `Collapsed ${entries.length - unique.length} duplicate entries into ${unique.length} unique URLs.`,
    )
  }

  return {
    ok: true,
    resolvedFrom: source,
    discovery: "direct",
    urls: unique,
    rawCount: entries.length,
    duplicatesRemoved: entries.length - unique.length,
    sitemaps: [{ url: source, count: unique.length, kind: kind === "text" ? "text" : "urlset" }],
    truncated: false,
    warnings,
    elapsedMs: Date.now() - started,
  }
}

export async function extractSitemap(input: string): Promise<ExtractResult> {
  const started = Date.now()
  const budget = new AbortController()
  const budgetTimer = setTimeout(() => budget.abort(), LIMITS.totalBudgetMs)

  const base: ExtractResult = {
    ok: false,
    resolvedFrom: input,
    discovery: "direct",
    urls: [],
    rawCount: 0,
    duplicatesRemoved: 0,
    sitemaps: [],
    truncated: false,
    warnings: [],
    elapsedMs: 0,
  }

  try {
    const found = await discover(input, budget.signal)
    if ("error" in found) {
      return { ...base, error: found.error, elapsedMs: Date.now() - started }
    }

    const guard = await assertPublicUrl(found.url)
    if (guard) return { ...base, error: guard, elapsedMs: Date.now() - started }

    const warnings = [...found.warnings]
    // De-duplicate DURING the walk, not after. Capping the raw entry count would
    // truncate an image-heavy site at a fraction of its real page count (a page
    // repeated once per image), while the UI claimed the full 50,000.
    const byLoc = new Map<string, SitemapUrlEntry>()
    const sourcesPerLoc = new Map<string, Set<string>>()
    let rawCount = 0
    const sitemaps: ExtractResult["sitemaps"] = []
    const seen = new Set<string>()
    let truncated = false
    let hitUrlCap = false
    let hitFileCap = false
    let offSite = 0

    // Breadth-first walk so a deep nest can't starve the shallow siblings.
    let frontier: { url: string; depth: number }[] = [{ url: found.url, depth: 0 }]

    while (frontier.length > 0 && !budget.signal.aborted) {
      const next: { url: string; depth: number }[] = []

      for (const { url, depth } of frontier) {
        if (budget.signal.aborted) break
        if (seen.has(url)) continue
        seen.add(url)
        if (sitemaps.length >= LIMITS.maxChildSitemaps) {
          // Flag rather than warn here: `break` only exits the inner loop, so the
          // outer BFS re-enters and would push an identical warning once per
          // remaining level.
          truncated = true
          hitFileCap = true
          break
        }

        let body: string
        try {
          const res = await fetchBody(url, budget.signal)
          if (res.status !== 200) {
            sitemaps.push({ url, count: 0, kind: "urlset", error: describeStatus(res.status) })
            continue
          }
          body = res.text
        } catch (e) {
          sitemaps.push({
            url,
            count: 0,
            kind: "urlset",
            error: e instanceof Error ? e.message : "Fetch failed",
          })
          continue
        }

        const kind = detectKind(body)

        if (kind === "index") {
          const children = parseIndex(body)
          sitemaps.push({ url, count: children.length, kind: "index" })
          if (depth >= LIMITS.maxDepth) {
            warnings.push(`Stopped recursing at depth ${LIMITS.maxDepth} (${url}).`)
            continue
          }
          for (const c of children) {
            // The spec wants absolute URLs, but relative <loc> values do appear
            // in the wild; resolve them against the sitemap that listed them
            // rather than failing the whole child.
            let child: string
            try {
              child = new URL(c, url).toString()
            } catch {
              continue
            }
            // Sitemaps.org: a sitemap may only reference files on its own host
            // (absent cross-submission verification). Spec-conformance first;
            // it also happens to narrow the reachable set, though the per-hop
            // guard in fetchBody is what actually prevents internal fetches.
            if (!sameSite(child, url)) {
              offSite++
              continue
            }
            next.push({ url: child, depth: depth + 1 })
          }
          continue
        }

        const entries =
          kind === "text" ? parseText(body, url) : kind === "urlset" ? parseUrlset(body, url) : []

        if (kind === "unknown") {
          sitemaps.push({ url, count: 0, kind: "urlset", error: "Not a recognizable sitemap." })
          continue
        }

        sitemaps.push({ url, count: entries.length, kind: kind === "text" ? "text" : "urlset" })

        for (const e of entries) {
          rawCount++
          const srcs = sourcesPerLoc.get(e.loc) ?? new Set<string>()
          srcs.add(e.source)
          sourcesPerLoc.set(e.loc, srcs)
          if (byLoc.has(e.loc)) continue
          if (byLoc.size >= LIMITS.maxUrls) {
            truncated = true
            hitUrlCap = true
            break
          }
          byLoc.set(e.loc, e)
        }
        if (hitUrlCap) break
      }

      if (hitUrlCap || hitFileCap) break
      frontier = next
    }

    if (hitFileCap) {
      warnings.push(`Stopped after ${LIMITS.maxChildSitemaps} sitemap files — results are partial.`)
    }

    if (budget.signal.aborted) {
      warnings.push(
        `Hit the ${LIMITS.totalBudgetMs / 1000}s time budget — results below are partial.`,
      )
      truncated = true
    }

    if (byLoc.size === 0 && sitemaps.length > 0 && sitemaps.every((s) => s.error)) {
      return {
        ...base,
        resolvedFrom: found.url,
        discovery: found.discovery,
        sitemaps,
        warnings,
        error: "Couldn't read that sitemap. See the per-file errors below.",
        elapsedMs: Date.now() - started,
      }
    }

    const unique = [...byLoc.values()]
    const duplicatesRemoved = rawCount - unique.length

    if (duplicatesRemoved > 0) {
      // Distinguish the two very different causes: the same URL listed twice
      // inside one file (usually an image/video sitemap) vs. the same URL in two
      // different files (usually a genuine sitemap bug worth fixing).
      const crossFile = [...sourcesPerLoc.values()].filter((s) => s.size > 1).length
      warnings.push(
        crossFile > 0
          ? `Collapsed ${duplicatesRemoved.toLocaleString()} duplicate entries into ${unique.length.toLocaleString()} unique URLs — ${crossFile.toLocaleString()} appear in more than one sitemap file, which is usually worth fixing.`
          : `Collapsed ${duplicatesRemoved.toLocaleString()} duplicate entries into ${unique.length.toLocaleString()} unique URLs. Repeated entries within one file normally mean an image or video sitemap, which lists a page once per asset.`,
      )
    }
    // Only claim the URL cap when the URL cap is what actually stopped us — the
    // file limit and the time budget set `truncated` too, and each already has
    // its own warning.
    if (hitUrlCap) {
      warnings.push(`Truncated at ${LIMITS.maxUrls.toLocaleString()} unique URLs.`)
    }
    if (offSite > 0) {
      warnings.push(
        `Skipped ${offSite} child sitemap${offSite === 1 ? "" : "s"} pointing at a different domain — sitemaps may only list URLs on their own host.`,
      )
    }

    return {
      ok: true,
      resolvedFrom: found.url,
      discovery: found.discovery,
      urls: unique,
      rawCount,
      duplicatesRemoved,
      sitemaps,
      truncated,
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
