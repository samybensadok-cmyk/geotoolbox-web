import { siteConfig } from "@/lib/config"

// Deliberate AI-crawler policy (2026-07-03): geotoolbox.ai is a GEO product —
// maximum AI visibility IS the business, so ALL crawler tiers are welcome:
// search/retrieval bots, user-triggered fetchers, AND training crawlers
// (brand presence inside model weights matters for us). This replaces the
// implicit allow-all with an explicit, named opt-in, plus Content-Signal
// (contentsignals.org) declarations so honoring parsers see consent per use.
// Replaced app/robots.ts (MetadataRoute can't emit Content-Signal lines).

// /md/ = internal rewrite target of the .md twins — crawl the twins, not it.
const DISALLOWS = ["/app/", "/api/", "/go/", "/md/", "/*_rsc="]
// /*_rsc= = Next.js App Router RSC prefetch URLs. They 200 + canonicalize to
// the clean URL, but crawlers fetch them as noise. robots blocks crawlers
// only, so client-side navigation/prefetch is unaffected.

const AI_BOTS = [
  // Retrieval / AI-search indexers (feed live answers + citations)
  "OAI-SearchBot",
  "Claude-SearchBot",
  "PerplexityBot",
  "Applebot",
  "Bingbot",
  // User-triggered fetchers (a human asked their assistant to open us)
  "ChatGPT-User",
  "Claude-User",
  "Perplexity-User",
  // Training crawlers — explicitly allowed, see policy note above
  "GPTBot",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Meta-ExternalAgent",
]

function group(userAgents: string[]): string {
  return [
    ...userAgents.map((ua) => `User-Agent: ${ua}`),
    "Content-Signal: search=yes, ai-input=yes, ai-train=yes",
    "Allow: /",
    ...DISALLOWS.map((d) => `Disallow: ${d}`),
  ].join("\n")
}

export function GET() {
  const body = [
    "# geotoolbox.ai — AI crawlers, fetchers, and agents are explicitly welcome.",
    "# Policy: https://contentsignals.org — search=yes, ai-input=yes, ai-train=yes",
    "# Markdown versions of articles: append .md to any /blog or /glossary URL,",
    "# or request with Accept: text/markdown.",
    "",
    group(["*"]),
    "",
    "# Named AI bots (same rules as * — listed to make the welcome explicit)",
    group(AI_BOTS),
    "",
    `Sitemap: ${siteConfig.url}/sitemap.xml`,
    "",
  ].join("\n")

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  })
}
