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
 *   - Precedence: LONGEST matching rule wins; Allow beats Disallow on a tie.
 *   - An empty Disallow value means "allow everything" and is not a match.
 *   - Percent-encoding is normalized on both sides so a `/café/` rule matches a
 *     `/caf%C3%A9/` URL path.
 */

export interface RobotsRule {
  type: "allow" | "disallow"
  path: string
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
}

/** Defensive ceilings. robots.txt is attacker-supplied whenever a user submits
 *  someone else's domain, so the parser refuses to build pathological inputs. */
const MAX_RULES_PER_GROUP = 1_000
/** Google's own parser caps wildcards per pattern; more than this is never real. */
const MAX_WILDCARDS = 8
const MAX_PATTERN_LEN = 1_000

export function parseRobots(text: string): ParsedRobots {
  const groups: RobotsGroup[] = []
  const sitemaps: string[] = []
  let unknownDirectives = 0

  let current: RobotsGroup | null = null
  // Consecutive user-agent lines share one group; a RULE line closes the header.
  let inAgentBlock = false

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
          current = { agents: [], rules: [] }
          groups.push(current)
          inAgentBlock = true
        }
        current.agents.push(value.toLowerCase())
        break
      }
      case "allow":
      case "disallow": {
        if (!current) {
          // Rules before any user-agent line are technically invalid; attribute
          // them to "*" rather than dropping them silently.
          current = { agents: ["*"], rules: [] }
          groups.push(current)
        }
        inAgentBlock = false
        // An empty Disallow means "nothing is disallowed" — not a match on "".
        if (field === "disallow" && value === "") break
        if (current.rules.length >= MAX_RULES_PER_GROUP) break
        if (value.length > MAX_PATTERN_LEN) break
        current.rules.push({ type: field, path: value })
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

  return { groups, sitemaps, unknownDirectives }
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
  "storebot-google": ["googlebot"],
  "google-extended": [],
}

/**
 * Merged rule set for `agent`: exact token match, then the documented fallback
 * chain, then "*". ALL groups declaring the winning token are concatenated.
 */
export function groupFor(robots: ParsedRobots, agent: string): RobotsGroup | null {
  const ua = agent.toLowerCase()
  const candidates = [ua, ...(AGENT_FALLBACKS[ua] ?? []), "*"]

  for (const token of candidates) {
    const matching = robots.groups.filter((g) => g.agents.includes(token))
    if (matching.length === 0) continue
    if (matching.length === 1) return matching[0]
    return {
      agents: [token],
      rules: matching.flatMap((g) => g.rules),
      crawlDelay: matching.find((g) => g.crawlDelay !== undefined)?.crawlDelay,
    }
  }
  return null
}

/** Percent-decode for comparison so an encoded URL path and a literal rule
 *  (or vice versa) normalize to the same string. Malformed escapes are left
 *  as-is rather than throwing. */
function normalizePath(s: string): string {
  try {
    return decodeURIComponent(s)
  } catch {
    return s
  }
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
export function pathMatches(pattern: string, path: string): boolean {
  if (pattern === "") return false

  const pat = normalizePath(pattern)
  const p = normalizePath(path)

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

  let winner: RobotsRule | undefined
  for (const rule of group.rules) {
    if (!pathMatches(rule.path, path)) continue
    if (!winner) {
      winner = rule
      continue
    }
    if (rule.path.length > winner.path.length) winner = rule
    // Exact-length tie: Allow wins.
    else if (rule.path.length === winner.path.length && rule.type === "allow") winner = rule
  }

  return { allowed: winner ? winner.type === "allow" : true, rule: winner }
}
