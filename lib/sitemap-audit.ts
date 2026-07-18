/**
 * Sitemap health audit: spec conformance + a robots.txt cross-check.
 *
 * This is the layer no competing free extractor has. Extraction answers "what
 * URLs are in here"; this answers "and what's wrong with them" — the question
 * people actually have once they've got the list.
 *
 * Every finding is derived from data already in memory after extraction, except
 * the robots.txt fetch (one request).
 */

import type { ExtractResult, SitemapUrlEntry } from "./sitemap-extract"
import { parseRobots, isAllowed, type ParsedRobots } from "./robots-match"

export type IssueSeverity = "error" | "warning" | "info"

export interface AuditIssue {
  id: string
  severity: IssueSeverity
  title: string
  /** What it means and what to do, in one or two sentences. */
  detail: string
  count: number
  /** A handful of offending URLs, for evidence. */
  samples: string[]
}

export interface AuditResult {
  issues: AuditIssue[]
  robots: {
    checked: boolean
    /** Sitemap URLs declared in robots.txt. */
    declaredSitemaps: string[]
    /** Was the sitemap we read actually declared there? */
    sitemapDeclared: boolean
    blockedCount: number
    error?: string
  }
  /** 0-100 health score. Transparent rubric: -20 per error, -7 per warning. */
  score: number
  /** False when a check couldn't run — the score is not comparable then. */
  complete: boolean
  incompleteReasons: string[]
}

/** W3C datetime (the sitemaps.org lastmod format): date, or date+time+offset. */
const W3C_DATE =
  /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2}))?$/

const CHANGEFREQ = new Set([
  "always",
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "never",
])

function sample(urls: string[], n = 5): string[] {
  return urls.slice(0, n)
}

export async function auditSitemap(
  result: ExtractResult,
  fetchRobots: (origin: string) => Promise<string | null>,
): Promise<AuditResult> {
  const issues: AuditIssue[] = []
  const urls = result.urls

  let siteOrigin = ""
  try {
    siteOrigin = new URL(result.resolvedFrom).origin
  } catch {
    /* leave blank; robots check is skipped below */
  }

  /* ---------------- Spec conformance ---------------- */

  const badLastmod: string[] = []
  const futureLastmod: string[] = []
  const badPriority: string[] = []
  const badChangefreq: string[] = []
  const nonHttps: string[] = []
  const offHost: string[] = []
  const tooLong: string[] = []
  const now = Date.now()
  // 36h of slack: the largest real UTC offset is +14, and date-only values parse
  // at UTC midnight, so anything less produces false "future" flags.
  const futureCutoff = now + 36 * 60 * 60 * 1000

  const sitemapHost = (() => {
    try {
      return new URL(result.resolvedFrom).hostname.replace(/^www\./, "")
    } catch {
      return ""
    }
  })()

  for (const u of urls) {
    if (u.lastmod) {
      if (!W3C_DATE.test(u.lastmod)) badLastmod.push(u.loc)
      else {
        const t = Date.parse(u.lastmod)
        if (!Number.isNaN(t) && t > futureCutoff) futureLastmod.push(u.loc)
      }
    }
    if (u.priority !== undefined) {
      const p = Number(u.priority)
      if (Number.isNaN(p) || p < 0 || p > 1) badPriority.push(u.loc)
    }
    if (u.changefreq !== undefined && !CHANGEFREQ.has(u.changefreq.toLowerCase())) {
      badChangefreq.push(u.loc)
    }
    try {
      const parsed = new URL(u.loc)
      if (parsed.protocol === "http:") nonHttps.push(u.loc)
      // Compare against the file that LISTED this URL, not the root index. A
      // multi-subdomain setup (example.com index → de.example.com/sitemap.xml)
      // is legitimate, and judging its URLs against the root host would flag
      // every one of them as an error.
      let listedBy = sitemapHost
      try {
        listedBy = new URL(u.source).hostname.replace(/^www\./, "")
      } catch {
        /* source may be a paste label; fall back to the root host */
      }
      if (listedBy && parsed.hostname.replace(/^www\./, "") !== listedBy) {
        offHost.push(u.loc)
      }
    } catch {
      offHost.push(u.loc)
    }
    if (u.loc.length > 2048) tooLong.push(u.loc)
  }

  if (badLastmod.length) {
    issues.push({
      id: "lastmod-format",
      severity: "error",
      title: "Invalid lastmod format",
      detail:
        "lastmod must be W3C datetime (YYYY-MM-DD, optionally with a time and timezone offset). Google ignores a lastmod it can't parse, so these entries lose the one hint that still carries weight.",
      count: badLastmod.length,
      samples: sample(badLastmod),
    })
  }
  if (futureLastmod.length) {
    issues.push({
      id: "lastmod-future",
      severity: "warning",
      title: "lastmod dates in the future",
      detail:
        "A future lastmod is a common sign of a CMS writing timestamps rather than reporting real changes. Google discounts lastmod on sites where it isn't demonstrably accurate.",
      count: futureLastmod.length,
      samples: sample(futureLastmod),
    })
  }
  if (badPriority.length) {
    issues.push({
      id: "priority-range",
      severity: "warning",
      title: "priority outside 0.0–1.0",
      detail:
        "The spec requires priority between 0.0 and 1.0. Worth fixing for validity, though Google has said it ignores priority entirely.",
      count: badPriority.length,
      samples: sample(badPriority),
    })
  }
  if (badChangefreq.length) {
    issues.push({
      id: "changefreq-value",
      severity: "warning",
      title: "Invalid changefreq value",
      detail:
        "changefreq must be one of always, hourly, daily, weekly, monthly, yearly, never. Google ignores changefreq, so this is a validity issue rather than a ranking one.",
      count: badChangefreq.length,
      samples: sample(badChangefreq),
    })
  }
  if (offHost.length) {
    issues.push({
      id: "cross-domain",
      severity: "warning",
      title: "URLs on a different host than the sitemap listing them",
      detail:
        "A sitemap normally may only list URLs on its own host. There is a legitimate exception — cross-submission, where the sitemap is declared in the robots.txt of the host it lists — so check that before treating these as broken. Outside that case, crawlers ignore the off-host entries and those pages aren't really being submitted.",
      count: offHost.length,
      samples: sample(offHost),
    })
  }
  if (nonHttps.length) {
    issues.push({
      id: "http-urls",
      severity: "warning",
      title: "Plain http:// URLs",
      detail:
        "These will normally redirect to https, which wastes crawl budget and makes the sitemap disagree with your canonicals. Submit the final https URLs directly.",
      count: nonHttps.length,
      samples: sample(nonHttps),
    })
  }
  if (tooLong.length) {
    issues.push({
      id: "url-length",
      severity: "warning",
      title: "URLs longer than 2,048 characters",
      detail: "The sitemaps.org spec caps a URL at 2,048 characters. Longer entries may be dropped.",
      count: tooLong.length,
      samples: sample(tooLong),
    })
  }

  /* ---------------- File-level limits ---------------- */

  const overCount = result.sitemaps.filter((s) => s.kind !== "index" && s.count > 50_000)
  if (overCount.length) {
    issues.push({
      id: "file-url-limit",
      severity: "error",
      title: "Sitemap file exceeds 50,000 URLs",
      detail:
        "A single sitemap file may contain at most 50,000 URLs. Split it and reference the parts from a sitemap index.",
      count: overCount.length,
      samples: sample(overCount.map((s) => s.url)),
    })
  }

  const emptyFiles = result.sitemaps.filter((s) => !s.error && s.kind !== "index" && s.count === 0)
  if (emptyFiles.length) {
    issues.push({
      id: "empty-sitemap",
      severity: "warning",
      title: "Empty sitemap files",
      detail:
        "These files parsed correctly but contain no URLs. Usually a generator bug or a stale file still referenced by the index.",
      count: emptyFiles.length,
      samples: sample(emptyFiles.map((s) => s.url)),
    })
  }

  const brokenChildren = result.sitemaps.filter((s) => s.error)
  if (brokenChildren.length) {
    issues.push({
      id: "unreachable-child",
      severity: "error",
      title: "Sitemap files that couldn't be read",
      detail:
        "An index pointing at files that error means those pages are never discovered through the sitemap. Fix or remove the references.",
      count: brokenChildren.length,
      samples: sample(brokenChildren.map((s) => `${s.url} — ${s.error}`)),
    })
  }

  if (result.duplicatesRemoved > 0) {
    issues.push({
      id: "duplicates",
      severity: "info",
      title: "Duplicate URLs",
      detail:
        "The same URL appeared more than once. Within a single file this usually means an image or video sitemap listing a page once per asset, which is normal. Across different files it's a generator bug worth fixing.",
      count: result.duplicatesRemoved,
      samples: [],
    })
  }

  /* ---------------- robots.txt cross-check ---------------- */

  const robotsOut: AuditResult["robots"] = {
    checked: false,
    declaredSitemaps: [],
    sitemapDeclared: false,
    blockedCount: 0,
  }

  if (siteOrigin) {
    try {
      const txt = await fetchRobots(siteOrigin)
      if (txt === null) {
        robotsOut.error = "No robots.txt found (which means nothing is blocked)."
      } else {
        const parsed: ParsedRobots = parseRobots(txt)
        robotsOut.checked = true
        robotsOut.declaredSitemaps = parsed.sitemaps
        // Normalize before comparing: scheme, www., and trailing slash all differ
        // routinely between what robots.txt declares and what the user typed.
        // Also treat "the declared index is the parent we walked" as declared —
        // reading a child sitemap is the normal case, not an omission.
        const norm = (s: string) =>
          s.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "")
        const declared = parsed.sitemaps.map(norm)
        const readFrom = norm(result.resolvedFrom)
        const walkedFiles = result.sitemaps.map((s) => norm(s.url))
        robotsOut.sitemapDeclared =
          declared.includes(readFrom) || declared.some((d) => walkedFiles.includes(d))

        const blocked: string[] = []
        for (const u of urls) {
          const verdict = isAllowed(parsed, u.loc, "Googlebot")
          if (!verdict.allowed) blocked.push(`${u.loc}  ←  ${verdict.rule?.type}: ${verdict.rule?.path}`)
        }
        robotsOut.blockedCount = blocked.length

        if (blocked.length) {
          issues.push({
            id: "robots-blocked",
            severity: "error",
            title: "Sitemap lists URLs that robots.txt blocks",
            detail:
              "You're asking Google to crawl pages you're also telling it not to fetch. Search Console reports these as \"Indexed, though blocked by robots.txt\" or simply skips them. Either remove them from the sitemap or unblock them — the two files should agree.",
            count: blocked.length,
            samples: sample(blocked),
          })
        }

        if (!robotsOut.sitemapDeclared) {
          issues.push({
            id: "sitemap-not-declared",
            severity: "info",
            title: "Sitemap not declared in robots.txt",
            detail:
              "Adding a `Sitemap:` line to robots.txt is the standard way to let any crawler discover it without you submitting it anywhere. One line, no downside.",
            count: 1,
            samples: [`${siteOrigin}/robots.txt`],
          })
        }
      }
    } catch (e) {
      robotsOut.error = e instanceof Error ? e.message : "robots.txt check failed."
    }
  }

  /* ---------------- Score ---------------- */

  // Transparent and deliberately blunt: errors cost more than warnings, and the
  // number exists to rank fixes, not to be a vanity metric.
  const errors = issues.filter((i) => i.severity === "error").length
  const warnings = issues.filter((i) => i.severity === "warning").length
  const score = Math.max(0, 100 - errors * 20 - warnings * 7)

  // A score is only meaningful over a complete audit. If robots.txt was
  // unreachable we never ran the blocked-URL check, and if the walk truncated we
  // only saw part of the URL set — in both cases the naive score goes UP for
  // being harder to audit, which is exactly backwards. Say so instead.
  const incomplete: string[] = []
  if (!robotsOut.checked) incomplete.push("robots.txt couldn't be read, so the blocked-URL check didn't run")
  if (result.truncated) incomplete.push("the URL list was truncated, so counts are partial")

  return {
    issues,
    robots: robotsOut,
    score,
    complete: incomplete.length === 0,
    incompleteReasons: incomplete,
  }
}

export type { SitemapUrlEntry }
