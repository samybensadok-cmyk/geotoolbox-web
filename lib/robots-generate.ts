/**
 * robots.txt generation + linting.
 *
 * Two things make this different from the free generators currently ranking:
 *
 *  1. AI crawler directives. None of the top-10 results for "robots.txt
 *     generator" let you decide about GPTBot, ClaudeBot, PerplexityBot or
 *     Google-Extended — which is the actual live question in 2026, and the one
 *     a GEO tool should answer.
 *  2. The Sitemap: line. "robots.txt sitemap xml" is its own 1,000/mo query, so
 *     declaring the sitemap is part of the same job, not a separate one.
 *
 * The linter is deliberately shared with the tester page: the generator emits a
 * file and immediately runs it through the same checks a user would get by
 * pasting someone else's, so we can't ship output our own tool would flag.
 */

import { parseRobots, isAllowed, type ParsedRobots } from "./robots-match"

/* ------------------------------------------------------------------ *
 * AI crawlers
 * ------------------------------------------------------------------ */

export interface AiCrawler {
  /** The exact product token to write in robots.txt. */
  token: string
  label: string
  operator: string
  /** What it's for — the thing people actually need to decide on. */
  purpose: "training" | "search" | "user-request"
  note: string
}

/**
 * The AI crawlers worth an explicit decision. Kept deliberately short and
 * annotated by PURPOSE, because "block AI bots" is usually the wrong instinct:
 * blocking a search/user-request crawler removes you from the answers, while
 * blocking a training crawler doesn't.
 */
export const AI_CRAWLERS: AiCrawler[] = [
  {
    token: "GPTBot",
    label: "GPTBot",
    operator: "OpenAI",
    purpose: "training",
    note: "Trains OpenAI models. Blocking it does NOT remove you from ChatGPT search results.",
  },
  {
    token: "OAI-SearchBot",
    label: "OAI-SearchBot",
    operator: "OpenAI",
    purpose: "search",
    note: "Builds ChatGPT's search index. Block this and you lose ChatGPT search visibility.",
  },
  {
    token: "ChatGPT-User",
    label: "ChatGPT-User",
    operator: "OpenAI",
    purpose: "user-request",
    note: "Fetches a page because a user asked for it in ChatGPT. Blocking breaks live lookups.",
  },
  {
    token: "ClaudeBot",
    label: "ClaudeBot",
    operator: "Anthropic",
    purpose: "training",
    note: "Anthropic's training crawler.",
  },
  {
    token: "Claude-SearchBot",
    label: "Claude-SearchBot",
    operator: "Anthropic",
    purpose: "search",
    note: "Indexes for Claude's search. Blocking costs you Claude citations.",
  },
  {
    token: "Claude-User",
    label: "Claude-User",
    operator: "Anthropic",
    purpose: "user-request",
    note: "Fetches a page on a Claude user's behalf.",
  },
  {
    token: "PerplexityBot",
    label: "PerplexityBot",
    operator: "Perplexity",
    purpose: "search",
    note: "Builds Perplexity's index. Blocking removes you from Perplexity answers.",
  },
  {
    token: "Google-Extended",
    label: "Google-Extended",
    operator: "Google",
    purpose: "training",
    note: "Controls Gemini training AND grounding in Gemini Apps / Vertex AI — blocking it can cost you grounded Gemini answers. Does NOT affect Google Search or AI Overviews ranking.",
  },
  {
    token: "CCBot",
    label: "CCBot",
    operator: "Common Crawl",
    purpose: "training",
    note: "Common Crawl feeds many downstream model datasets.",
  },
  {
    token: "Bytespider",
    label: "Bytespider",
    operator: "ByteDance",
    purpose: "training",
    note: "ByteDance's crawler. Widely reported to be aggressive.",
  },
  {
    token: "meta-externalagent",
    label: "meta-externalagent",
    operator: "Meta",
    purpose: "training",
    note: "Meta's AI training crawler.",
  },
  {
    token: "Applebot-Extended",
    label: "Applebot-Extended",
    operator: "Apple",
    purpose: "training",
    note: "Apple Intelligence training. Applebot itself (search) is separate.",
  },
]

/* ------------------------------------------------------------------ *
 * Presets
 * ------------------------------------------------------------------ */

export interface Preset {
  id: string
  label: string
  description: string
  disallow: string[]
  allow: string[]
}

/**
 * The recipe presets. Derived from the actual long-tail: "robots.txt disallow
 * all" / "allow all" / "block folder" / "noindex" account for 590x11 + 210x2 +
 * 110x2 searches a month, so these are the file people are looking for — not
 * just documentation about the syntax.
 */
export const PRESETS: Preset[] = [
  {
    id: "allow-all",
    label: "Allow everything",
    description: "The default for most sites. Every crawler may fetch every page.",
    disallow: [],
    allow: [],
  },
  {
    id: "wordpress",
    label: "WordPress",
    description:
      "WordPress core's own defaults: keep /wp-admin/ out of the index but allow admin-ajax.php, which themes and plugins need.",
    disallow: ["/wp-admin/"],
    allow: ["/wp-admin/admin-ajax.php"],
  },
  {
    id: "shopify",
    label: "Shopify",
    description: "Blocks cart, checkout and account flows, plus the internal search results Shopify generates.",
    disallow: ["/cart", "/checkout", "/account", "/orders", "/search"],
    allow: [],
  },
  {
    id: "block-admin",
    label: "Block admin & internal search",
    description: "A sensible generic baseline: keep admin areas and search-results pages out of the index.",
    disallow: ["/admin/", "/search", "/cgi-bin/"],
    allow: [],
  },
  {
    id: "block-all",
    label: "Block everything",
    description:
      "Staging and private sites only. This asks crawlers not to fetch anything — it does NOT make an already-indexed page disappear, and it isn't security.",
    disallow: ["/"],
    allow: [],
  },
]

/* ------------------------------------------------------------------ *
 * Generation
 * ------------------------------------------------------------------ */

export interface GenerateOptions {
  presetId: string
  /** Extra paths to disallow for all crawlers. */
  customDisallow: string[]
  /** Paths to explicitly allow (wins over a longer Disallow only if longer). */
  customAllow: string[]
  /** Sitemap URLs to declare. */
  sitemaps: string[]
  /** Crawl-delay in seconds. Bing honours it; Google never has and Yandex
   *  dropped it in 2018. */
  crawlDelay?: number
  /** AI crawler tokens the user chose to BLOCK entirely. */
  blockedAiCrawlers: string[]
}

/**
 * Sanitize a user-supplied path before it becomes a directive.
 *
 * robots.txt is line-oriented and `#` starts a comment, so an unsanitized value
 * can truncate its own rule or inject entirely new ones — `"/a\nUser-agent: *\nDisallow: /"`
 * would otherwise be emitted verbatim and block the whole site. Returns "" for
 * anything unusable rather than emitting something subtly wrong.
 */
function normalizePath(p: string): string {
  // REJECT rather than strip. Removing the newline from
  // "/a\nUser-agent: *\nDisallow: /" and joining what's left yields the
  // nonsense rule "/aUser-agent:%20*Disallow:%20/" — safe, but silently not
  // what anyone asked for. A value containing a control character is a mistake
  // worth surfacing as "nothing", not worth guessing at.
  if (/[\x00-\x1F\x7F]/.test(p)) return ""
  const stripped = p.trim()
  if (!stripped) return ""
  // `#` begins a comment: everything after it would be silently dropped by any
  // parser, so a path containing one cannot be expressed here.
  const t = stripped.split("#")[0].trim()
  if (!t) return ""
  // Spaces are not valid in a path value; percent-encode rather than truncate.
  const safe = t.replace(/ /g, "%20")
  return safe.startsWith("/") ? safe : `/${safe}`
}

/** A Sitemap: value must be a real absolute http(s) URL on one line. */
function normalizeSitemap(s: string): string | null {
  // Same reasoning as normalizePath: a Sitemap value containing a control
  // character is rejected outright rather than silently repaired into a
  // different URL.
  if (/[\x00-\x1F\x7F]/.test(s)) return null
  const stripped = s.trim()
  if (!stripped) return null
  try {
    const u = new URL(stripped)
    if (u.protocol !== "http:" && u.protocol !== "https:") return null
    const out = u.toString()
    // Reject anything that still contains whitespace after serialization.
    return /\s/.test(out) ? null : out
  } catch {
    return null
  }
}

export function generateRobotsTxt(opts: GenerateOptions): string {
  const preset = PRESETS.find((p) => p.id === opts.presetId) ?? PRESETS[0]

  const disallow = [...preset.disallow, ...opts.customDisallow.map(normalizePath)].filter(Boolean)
  const allow = [...preset.allow, ...opts.customAllow.map(normalizePath)].filter(Boolean)

  // De-duplicate while preserving order.
  const uniq = (xs: string[]) => [...new Set(xs)]

  const lines: string[] = []

  lines.push("User-agent: *")
  for (const a of uniq(allow)) lines.push(`Allow: ${a}`)
  if (uniq(disallow).length === 0) {
    // An empty Disallow is the canonical "allow everything" — clearer than
    // omitting the line, which some validators flag as an empty group.
    lines.push("Disallow:")
  } else {
    for (const d of uniq(disallow)) lines.push(`Disallow: ${d}`)
  }
  // Number.isFinite guard: `Infinity > 0` is true, so a large numeric input
  // would otherwise emit the literal `Crawl-delay: Infinity`.
  if (
    opts.crawlDelay !== undefined &&
    Number.isFinite(opts.crawlDelay) &&
    opts.crawlDelay > 0
  ) {
    lines.push(`Crawl-delay: ${Math.min(Math.round(opts.crawlDelay), 3600)}`)
  }

  // AI crawlers get their own groups. Each blocked crawler is a separate group
  // because a named group REPLACES the "*" group rather than adding to it —
  // writing "User-agent: GPTBot / Disallow: /" alongside a "*" group is the
  // only way to express "everyone else as above, this one not at all".
  for (const token of opts.blockedAiCrawlers) {
    const crawler = AI_CRAWLERS.find((c) => c.token === token)
    if (!crawler) continue
    lines.push("")
    lines.push(`# ${crawler.operator} — ${crawler.purpose}`)
    lines.push(`User-agent: ${crawler.token}`)
    lines.push("Disallow: /")
  }

  const sitemaps = uniq(
    opts.sitemaps.map(normalizeSitemap).filter((s): s is string => s !== null),
  )
  if (sitemaps.length > 0) {
    lines.push("")
    for (const s of sitemaps) lines.push(`Sitemap: ${s}`)
  }

  return `${lines.join("\n").trim()}\n`
}

/* ------------------------------------------------------------------ *
 * Linting
 * ------------------------------------------------------------------ */

export type LintSeverity = "error" | "warning" | "info"

export interface LintFinding {
  severity: LintSeverity
  title: string
  detail: string
  /** 1-indexed source line, when the finding maps to one. */
  line?: number
}

/**
 * Lint a robots.txt. Checks the mistakes that actually cost traffic, not
 * cosmetic style — every finding here is something that changes crawler
 * behaviour or reflects a misunderstanding of what robots.txt does.
 */
export function lintRobotsTxt(text: string, opts: { origin?: string } = {}): LintFinding[] {
  const out: LintFinding[] = []
  const parsed = parseRobots(text)
  const rawLines = text.split(/\r?\n/)

  if (text.trim() === "") {
    out.push({
      severity: "warning",
      title: "Empty file",
      detail:
        "An empty robots.txt is valid and means everything is allowed — but so is having no file at all. If that's the intent, this file isn't doing anything.",
    })
    return out
  }

  if (parsed.groups.length === 0) {
    out.push({
      severity: "error",
      title: "No user-agent groups",
      detail:
        "Every rule must sit under a `User-agent:` line. Without one, crawlers have nothing to apply and the file is ignored.",
    })
  }

  if (parsed.orphanRules > 0) {
    out.push({
      severity: "error",
      title: `${parsed.orphanRules} rule${parsed.orphanRules === 1 ? "" : "s"} before the first \`User-agent:\` line`,
      detail:
        "A rule has to sit inside a group. Rules written above the first `User-agent:` line belong to nobody, and crawlers discard them — so they are silently doing nothing. Move them under the group they were meant for.",
    })
  }

  // BOM: breaks the first directive in several parsers.
  if (text.charCodeAt(0) === 0xfeff) {
    out.push({
      severity: "error",
      title: "File starts with a byte-order mark",
      detail:
        "A BOM before the first `User-agent:` makes some parsers miss that line entirely. Save the file as UTF-8 without BOM.",
      line: 1,
    })
  }

  // Blocking everything is legitimate but so often accidental it deserves a flag.
  const star = parsed.groups.find((g) => g.agents.includes("*"))
  if (star?.rules.some((r) => r.type === "disallow" && r.path === "/")) {
    out.push({
      severity: "error",
      title: "This file blocks your entire site",
      detail:
        "`User-agent: * / Disallow: /` asks every crawler to fetch nothing. Correct for staging, catastrophic on production — and a very common copy-paste accident. Note it also won't remove already-indexed pages; that needs noindex or a removal request.",
    })
  }

  // Directives that look real and do nothing.
  rawLines.forEach((raw, i) => {
    const line = raw.replace(/#.*$/, "").trim()
    if (!line) return
    const field = line.split(":")[0]?.trim().toLowerCase()

    if (field === "noindex") {
      out.push({
        severity: "error",
        title: "`Noindex:` in robots.txt does nothing",
        detail:
          "Google stopped supporting a noindex directive in robots.txt in 2019. To keep a page out of the index use an `X-Robots-Tag` header or a `<meta name=\"robots\" content=\"noindex\">` tag — and note the page must be crawlable for that to be seen.",
        line: i + 1,
      })
    }
    if (field === "host") {
      out.push({
        severity: "info",
        title: "`Host:` is obsolete",
        detail:
          "Google and Bing never supported it, and Yandex deprecated it in 2018. Harmless to keep, but it is doing nothing — use redirects and canonicals to express a preferred host.",
        line: i + 1,
      })
    }
    if (field === "crawl-delay") {
      out.push({
        severity: "info",
        title: "`Crawl-delay:` is ignored by Google",
        detail:
          "Bing still honours it. Googlebot never has, and Yandex dropped support in 2018 — so on most sites this line does nothing. Google auto-tunes its crawl rate and removed the Search Console crawl-rate setting in January 2024; if Googlebot is genuinely too aggressive, serve 429/503 responses or use Google's report-a-crawl-problem form.",
        line: i + 1,
      })
    }
    // Wildcards in the middle of a path are fine; a bare "*" as the whole path is
    // usually a misunderstanding.
    if ((field === "allow" || field === "disallow") && line.split(":").slice(1).join(":").trim() === "*") {
      out.push({
        severity: "warning",
        title: "`*` alone blocks the whole site",
        detail:
          "A bare `*` matches every path, so this behaves exactly like `Disallow: /` — which is almost never what someone means when they write it. If you intended to block everything, write `/` so the intent is obvious; otherwise give a real path.",
        line: i + 1,
      })
    }
  })

  // Sitemap declaration.
  if (parsed.sitemaps.length === 0) {
    out.push({
      severity: "info",
      title: "No sitemap declared",
      detail:
        "Adding a `Sitemap: https://…/sitemap.xml` line is the standard way for any crawler to discover your sitemap without you submitting it anywhere. One line, no downside.",
    })
  } else {
    for (const s of parsed.sitemaps) {
      if (!/^https?:\/\//i.test(s)) {
        out.push({
          severity: "error",
          title: "Sitemap URL must be absolute",
          detail: `\`${s}\` is relative. The Sitemap directive requires a full URL including the scheme and host.`,
        })
      } else if (opts.origin) {
        try {
          if (new URL(s).origin !== opts.origin) {
            out.push({
              severity: "warning",
              title: "Sitemap is on a different host",
              detail: `\`${s}\` isn't on ${opts.origin}. That's allowed with cross-submission verification, but is usually a copy-paste error from another site.`,
            })
          }
        } catch {
          /* handled by the absolute-URL check */
        }
      }
    }
  }

  // Blocking your own sitemap or CSS/JS is a classic own-goal.
  const blocksEverything = out.some((f) => f.title === "This file blocks your entire site")
  if (parsed.groups.length > 0) {
    for (const s of parsed.sitemaps) {
      if (!isAllowed(parsed, s, "Googlebot").allowed) {
        out.push({
          severity: "error",
          title: "robots.txt blocks the sitemap it declares",
          detail: `\`${s}\` is disallowed by a rule in this same file. Crawlers can't read a sitemap they're told not to fetch.`,
        })
      }
    }
    // Probe the conventional asset locations rather than one invented path —
    // a single /assets/ probe misses sites that serve from /static/, /_next/ or
    // /wp-content/. We report the matching RULE so the finding is checkable
    // rather than asking the user to take our word for it.
    //
    // Skipped entirely when the file already blocks everything: three findings
    // for one problem buries the one that matters.
    const probeOrigin = opts.origin ?? "https://example.com"
    const ASSET_PROBES = [
      "/assets/app.css",
      "/assets/app.js",
      "/static/app.css",
      "/static/app.js",
      "/_next/static/chunk.js",
      "/wp-content/themes/theme/style.css",
      "/wp-includes/js/script.js",
      "/css/main.css",
      "/js/main.js",
    ]
    if (!blocksEverything) {
      const hits = new Map<string, string>() // rule path -> example blocked asset
      for (const path of ASSET_PROBES) {
        const v = isAllowed(parsed, `${probeOrigin}${path}`, "Googlebot")
        if (!v.allowed && v.rule) hits.set(`${v.rule.type}: ${v.rule.path}`, path)
      }
      for (const [rule, example] of hits) {
        out.push({
          severity: "warning",
          title: "A rule here blocks CSS or JavaScript",
          detail: `\`${rule}\` blocks assets such as \`${example}\`. Google renders pages before judging them, so blocking stylesheets or scripts means it sees a broken version of your site. Check whether that rule is wider than you intended — this is one of the most expensive robots.txt mistakes. (We test conventional asset paths, so this is a strong hint rather than a full audit of your specific setup.)`,
        })
      }
    }
  }

  return out
}

/** Convenience: does this file block a URL for a given agent, and why? */
export function explain(text: string, url: string, agent: string) {
  const parsed: ParsedRobots = parseRobots(text)
  return isAllowed(parsed, url, agent)
}
