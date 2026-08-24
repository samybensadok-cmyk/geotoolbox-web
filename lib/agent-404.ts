import { siteConfig } from "./config"

/**
 * Shared 404 recovery payload — ONE definition rendered into three surfaces:
 * the HTML 404 page, the markdown twin 404 (/blog/<unknown>.md), and /404.md.
 *
 * WHY IT MATTERS: a 404 is the single most common thing an agent hits on a site
 * it is exploring, and a bare status code is a dead end. An agent that gets a
 * status plus a short markdown body naming the sitemap, the llms.txt index and
 * the section hubs can re-plan in one step instead of falling back to a search
 * engine (or, worse, concluding the whole site is broken).
 *
 * Keep this SHORT. It is an escape hatch, not a site map.
 */

export type RecoveryLink = { label: string; href: string; what: string }

export const recoveryLinks: RecoveryLink[] = [
  { label: "Sitemap", href: "/sitemap.xml", what: "every indexable URL on this site, with lastmod dates" },
  { label: "llms.txt", href: "/llms.txt", what: "navigation index: what this site is and when to use it" },
  { label: "Agent instructions", href: "/agents.md", what: "when to use GEO Toolbox and how to call it" },
  { label: "Blog index", href: "/blog", what: "every article — append .md to any of them for markdown" },
  { label: "Features", href: "/features", what: "what the product measures" },
  { label: "Homepage", href: "/", what: "start over" },
]

/**
 * The markdown recovery body. Used verbatim as the response body of the
 * markdown 404s, and embedded (inside a <pre>) in the HTML 404 so that a text
 * extraction of that page yields the same markdown.
 *
 * @param path the path that was not found, echoed back so an agent can see
 *   which of several in-flight requests failed. Omitted when unknown.
 */
export function markdown404Body(path?: string): string {
  const base = siteConfig.url
  return [
    "# 404 — page not found",
    "",
    path
      ? `\`${path}\` does not exist on ${base}. This is a real HTTP 404, not an app shell — the page is genuinely absent, so re-plan rather than retrying.`
      : `That path does not exist on ${base}. This is a real HTTP 404, not an app shell — the page is genuinely absent, so re-plan rather than retrying.`,
    "",
    "## Where to look next",
    "",
    ...recoveryLinks.map((l) => `- [${l.label}](${base}${l.href}): ${l.what}`),
    "",
    `Contact: ${siteConfig.contactEmail}`,
    "",
  ].join("\n")
}

/** Response headers shared by every markdown 404. */
export function markdown404Headers() {
  const base = siteConfig.url
  return {
    "Content-Type": "text/markdown; charset=utf-8",
    Link: `<${base}/sitemap.xml>; rel="sitemap", <${base}/llms.txt>; rel="index"`,
    "X-Robots-Tag": "noindex",
    "Cache-Control": "no-store",
  }
}
