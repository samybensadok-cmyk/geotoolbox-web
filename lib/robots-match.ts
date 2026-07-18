/**
 * robots.txt parsing and Googlebot-compatible matching.
 *
 * Written standalone and dependency-free because it is needed twice: here, to
 * cross-check whether a sitemap lists URLs the site also blocks, and later by
 * the robots.txt tester tool. Google retired its own tester in Search Console,
 * so replicating its actual matching rules is the point — not a simplified
 * prefix check.
 *
 * Rules implemented (Google's robots.txt spec / RFC 9309):
 *   - Group selection: user-agent tokens match by EQUALITY, not prefix, with an
 *     explicit fallback hierarchy (Googlebot-News → Googlebot). ALL groups
 *     declaring the winning token are merged — split "User-agent: *" blocks are
 *     common (plugins appending their own) and Google concatenates them.
 *   - Unrecognized lines (Host:, Clean-param:, …) are ignored WITHOUT closing
 *     the current group.
 *   - Path matching: "*" matches any run, "$" anchors the end. Implemented as
 *     Google's linear DP, NOT a regex — a regex with several ".*" segments
 *     backtracks catastrophically, and robots.txt content is attacker-supplied.
 *   - Precedence: the rule matching the most OCTETS wins; Allow beats Disallow
 *     on a tie. Measured on the normalized form, not the raw source text.
 *   - An empty Disallow value means "allow everything" and is not a match.
 *   - Percent-encoding: raw non-ASCII is encoded and only UNRESERVED escapes are
 *     decoded, so `/café/` matches `/caf%C3%A9/` while `/private%2Fadmin` stays
 *     distinct from `/private/admin` and a literal `%2A` is never a wildcard.
 *   - Rules before the first User-agent line are discarded, not reassigned to
 *     "*" — inventing a group changes crawl decisions.
 *
 * NOTE ON THE `agent` ARGUMENT: callers pass a product TOKEN ("Googlebot"), not
 * a full HTTP User-Agent header. Matching is by token equality per RFC 9309.
 */

export interface RobotsRule {
  type: "allow" | "disallow"
  /** As written in the file — used for display and "which rule matched". */
  path: string
  /**
   * Normalized to comparable octets. Precedence is "most octets of the rule
   * path" per RFC 9309, and `path.length` counts UTF-16 units and percent-escape
   * SPELLING — so two equivalent rules written differently would otherwise get
   * different priority.
   */
  norm: string
}

export interface RobotsGroup {
  agents: string[]
  rules: RobotsRule[]
  crawlDelay?: number
}

export interface ParsedRobots {
  groups: RobotsGroup[]
  sitemaps: string[]
  /** Lines we couldn't classify — useful for the tester UI. */
  unknownDirectives: number
  /** Rules that appeared before any User-agent line and were discarded. */
  orphanRules: number
}

/** Defensive ceilings. robots.txt is attacker-supplied whenever a user submits
 *  someone else's domain, so the parser refuses to build pathological inputs. */
const MAX_RULES_PER_GROUP = 1_000
/** Defensive only — Google's reference parser does NOT cap wildcards, so a
 *  pattern above this is treated as non-matching and we diverge from Googlebot.
 *  Kept because the DP is O(pattern x path) and patterns are attacker-supplied;
 *  the tester surfaces a warning when it fires rather than silently differing. */
const MAX_WILDCARDS = 8
export const MATCHER_LIMITS = { MAX_WILDCARDS, MAX_PATTERN_LEN: 1_000, MAX_RULES_TOTAL: 10_000 }
const MAX_PATTERN_LEN = 1_000
/** Totals. Without these, group selection scans every group on every isAllowed()
 *  call, so a file split into tens of thousands of tiny groups made linting
 *  (which calls isAllowed once per sitemap plus asset probes) quadratic. */
const MAX_GROUPS = 1_000
const MAX_AGENTS_TOTAL = 2_000
const MAX_RULES_TOTAL = 10_000
const MAX_SITEMAPS = 100

export function parseRobots(text: string): ParsedRobots {
  const groups: RobotsGroup[] = []
  const sitemaps: string[] = []
  let unknownDirectives = 0

  let current: RobotsGroup | null = null
  // Consecutive user-agent lines share one group; a RULE line closes the header.
  let inAgentBlock = false
  let agentTotal = 0
  let ruleTotal = 0
  /** Rules appearing before any User-agent line. RFC 9309 says a parser must not
   *  reinterpret them, so they're counted for the linter and then discarded. */
  let orphanRules = 0

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, "").trim()
    if (!line) continue

    const idx = line.indexOf(":")
    if (idx === -1) {
      unknownDirectives++
      continue
    }
    const field = line.slice(0, idx).trim().toLowerCase()
    const value = line.slice(idx + 1).trim()

    switch (field) {
      case "user-agent": {
        if (!inAgentBlock || !current) {
          if (groups.length >= MAX_GROUPS) break
          current = { agents: [], rules: [] }
          groups.push(current)
          inAgentBlock = true
        }
        if (agentTotal >= MAX_AGENTS_TOTAL) break
        agentTotal++
        current.agents.push(value.toLowerCase())
        break
      }
      case "allow":
      case "disallow": {
        inAgentBlock = false
        if (!current) {
          // RFC 9309: a rule before any User-agent line has no group to belong
          // to. Attributing it to "*" (the previous behaviour) INVENTS a rule
          // the file never expressed and changes crawl decisions. Count it so
          // the linter can report it, then discard.
          orphanRules++
          break
        }
        // An empty Disallow means "nothing is disallowed" — not a match on "".
        if (field === "disallow" && value === "") break
        if (current.rules.length >= MAX_RULES_PER_GROUP) break
        if (ruleTotal >= MAX_RULES_TOTAL) break
        if (value.length > MAX_PATTERN_LEN) break
        ruleTotal++
        current.rules.push({ type: field, path: value, norm: normalizePath(value) })
        break
      }
      case "crawl-delay": {
        if (current) {
          const n = Number(value)
          if (!Number.isNaN(n)) current.crawlDelay = n
        }
        inAgentBlock = false
        break
      }
      case "sitemap": {
        if (sitemaps.length >= MAX_SITEMAPS) break
        if (/^https?:\/\//i.test(value)) sitemaps.push(value)
        break
      }
      default:
        // Google ignores unrecognized lines entirely. Crucially this must NOT
        // close the user-agent block: a stray "Host:" between two User-agent
        // lines would otherwise split one group into two and silently drop the
        // second agent's rules.
        unknownDirectives++
    }
  }

  return { groups, sitemaps, unknownDirectives, orphanRules }
}

/**
 * Google's documented crawler hierarchy: a specific crawler falls back to its
 * parent token's group when it has no group of its own. This is an explicit
 * table, not string prefixing — "User-agent: Google" is NOT a token Googlebot
 * answers to, and treating it as one wrongly blocks entire sites.
 */
const AGENT_FALLBACKS: Record<string, string[]> = {
  "googlebot-news": ["googlebot"],
  "googlebot-image": ["googlebot"],
  "googlebot-video": ["googlebot"],
  "googlebot-mobile": ["googlebot"],
  "google-extended": [],
}

/**
 * Merged rule set for `agent`: exact token match, then the documented fallback
 * chain, then "*". ALL groups declaring the winning token are concatenated.
 */
/** Merged-group cache. Without it, a tester request asking for 100 URLs x 12
 *  agents re-filtered and re-flatMapped every group 1,200 times — measured at
 *  2.65s per verdict on a rule-heavy file, i.e. the whole function budget. */
const GROUP_CACHE = new WeakMap<ParsedRobots, Map<string, RobotsGroup | null>>()

export function groupFor(robots: ParsedRobots, agent: string): RobotsGroup | null {
  const ua = agent.toLowerCase()
  let perAgent = GROUP_CACHE.get(robots)
  if (!perAgent) {
    perAgent = new Map()
    GROUP_CACHE.set(robots, perAgent)
  }
  const hit = perAgent.get(ua)
  if (hit !== undefined) return hit

  const candidates = [ua, ...(AGENT_FALLBACKS[ua] ?? []), "*"]

  let resolved: RobotsGroup | null = null
  for (const token of candidates) {
    const matching = robots.groups.filter((g) => g.agents.includes(token))
    if (matching.length === 0) continue
    resolved =
      matching.length === 1
        ? matching[0]
        : {
            agents: [token],
            rules: matching.flatMap((g) => g.rules),
            crawlDelay: matching.find((g) => g.crawlDelay !== undefined)?.crawlDelay,
          }
    break
  }
  perAgent.set(ua, resolved)
  return resolved
}

/**
 * Normalize a path or rule to comparable percent-encoded octets.
 *
 * Decoding BOTH sides (the obvious approach, and what this did first) is wrong:
 * RFC 9309 keeps percent-encoded reserved octets distinct from their literal
 * form, so `/private%2Fadmin` must NOT match `/private/admin`. Worse, blanket
 * decoding turns a literal `%2A` into a wildcard and a trailing `%24` into an
 * end anchor, silently changing what a rule means.
 *
 * So: encode raw non-ASCII to UTF-8 octets (making `/café/` and `/caf%C3%A9/`
 * comparable, which was the original motivation), decode ONLY unreserved
 * escapes, and uppercase the rest. `*` and `$` are read from the literal
 * pattern text and survive untouched, because they are never percent-escapes.
 */
function normalizePath(s: string): string {
  // Raw non-ASCII → UTF-8 percent octets.
  let out = ""
  for (const ch of s) {
    if (ch.charCodeAt(0) > 127) {
      try {
        out += encodeURIComponent(ch)
      } catch {
        out += ch
      }
    } else {
      out += ch
    }
  }
  // Decode only unreserved escapes (RFC 3986 §2.3); leave reserved encoded.
  return out.replace(/%([0-9a-fA-F]{2})/g, (m, hex: string) => {
    const code = parseInt(hex, 16)
    const ch = String.fromCharCode(code)
    return /[A-Za-z0-9\-._~]/.test(ch) ? ch : `%${hex.toUpperCase()}`
  })
}

/**
 * Does a robots path pattern match this URL path?
 *
 * Google's linear dynamic-programming matcher, ported from the reference
 * implementation. `pos` holds the set of path offsets reachable after consuming
 * the pattern so far; each pattern character either advances every offset or
 * (for "*") opens every offset from the current minimum onward. There is no
 * backtracking, so runtime is bounded by pattern length × path length.
 *
 * The previous regex version took 105 SECONDS on a 30-character pattern against
 * a 60-character path, which an attacker could trigger with one hosted
 * robots.txt. This version is microseconds on the same input.
 */
export function pathMatches(pattern: string, path: string, preNormalized = false): boolean {
  if (pattern === "") return false

  const pat = preNormalized ? pattern : normalizePath(pattern)
  const p = preNormalized ? path : normalizePath(path)

  // Reject absurd patterns rather than attempt them.
  let wildcards = 0
  for (let i = 0; i < pat.length; i++) if (pat[i] === "*") wildcards++
  if (wildcards > MAX_WILDCARDS || pat.length > MAX_PATTERN_LEN) return false

  const pathlen = p.length
  const pos = new Int32Array(pathlen + 1)
  let numpos = 1
  pos[0] = 0

  for (let i = 0; i < pat.length; i++) {
    const ch = pat[i]

    if (ch === "$" && i + 1 === pat.length) {
      // End-anchor: matches only if some reachable offset consumed the whole path.
      return pos[numpos - 1] === pathlen
    }

    if (ch === "*") {
      // Every offset from the current minimum to the end becomes reachable.
      numpos = pathlen - pos[0] + 1
      for (let j = 1; j < numpos; j++) pos[j] = pos[j - 1] + 1
      continue
    }

    let newnumpos = 0
    for (let j = 0; j < numpos; j++) {
      if (pos[j] < pathlen && p[pos[j]] === ch) {
        pos[newnumpos++] = pos[j] + 1
      }
    }
    if (newnumpos === 0) return false
    numpos = newnumpos
  }

  return true
}

export interface RobotsVerdict {
  allowed: boolean
  /** The rule that decided it, for "why" output. Absent when nothing matched. */
  rule?: RobotsRule
}

/**
 * Is `url` crawlable by `agent` under these rules?
 * Longest match wins; Allow beats Disallow on an exact tie.
 */
export function isAllowed(robots: ParsedRobots, url: string, agent = "*"): RobotsVerdict {
  let path: string
  try {
    const u = new URL(url)
    path = u.pathname + u.search
  } catch {
    return { allowed: true }
  }

  const group = groupFor(robots, agent)
  if (!group) return { allowed: true }

  // Normalize the request path ONCE, then compare against pre-normalized rules.
  const normPath = normalizePath(path)

  let winner: RobotsRule | undefined
  for (const rule of group.rules) {
    const norm = rule.norm ?? normalizePath(rule.path)
    if (!pathMatches(norm, normPath, true)) continue
    if (!winner) {
      winner = rule
      continue
    }
    // RFC 9309 precedence is "most octets of the rule path". Comparing the RAW
    // path would rank by percent-escape spelling and UTF-16 units instead, so
    // two equivalent rules written differently could get different priority.
    const winnerNorm = winner.norm ?? normalizePath(winner.path)
    if (norm.length > winnerNorm.length) winner = rule
    else if (norm.length === winnerNorm.length && rule.type === "allow") winner = rule
  }

  return { allowed: winner ? winner.type === "allow" : true, rule: winner }
}
