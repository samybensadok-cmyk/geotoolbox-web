import { siteConfig } from "@/lib/config"

// Deliberate AI-crawler policy (2026-07-03): geotoolbox.ai is a GEO product —
// maximum AI visibility IS the business, so ALL crawler tiers are welcome:
// search/retrieval bots, user-triggered fetchers, AND training crawlers
// (brand presence inside model weights matters for us). This replaces the
// implicit allow-all with an explicit, named opt-in, plus Content-Signal
// (contentsignals.org) declarations so honoring parsers see consent per use.
// Replaced app/robots.ts (MetadataRoute can't emit Content-Signal lines).

// /md/ = internal rewrite target of the .md twins — crawl the twins, not it.
//
// 2026-07-13 fix: the PHP app is routed entirely by query string (/app?page=X,
// never /app/anything), so its URL path is always the bare string "/app" — which
// "Disallow: /app/" (trailing slash) does NOT match, since robots.txt disallow is
// a literal path-prefix match and "/app" does not start with "/app/". Result:
// login, reset-password, and other app-shell pages were fully crawlable and
// getting indexed (confirmed via GSC: "Crawl allowed? Yes" on /app?page=...).
// "/app$" (end-anchor) matches the bare path exactly; "/app?" matches any query
// string on it. Both are needed since neither alone covers both cases. Can't
// just use "Disallow: /app" (no anchor) either — that would also match
// /apple-icon (a real route, app/apple-icon.tsx), since it shares the "/app"
// prefix as a plain string.
const DISALLOWS = ["/app$", "/app?", "/app/", "/api/", "/go/", "/md/", "/*_rsc="]
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
    "# Markdown versions: append .md to any /blog or /glossary URL (homepage: /home.md),",
    "# or request the canonical URL with Accept: text/markdown.",
    "# Index: /llms.txt \u00b7 full content: /llms-full.txt",
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
