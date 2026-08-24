import { buildAgentsMd } from "@/lib/llms-index"
import { siteConfig } from "@/lib/config"

// /agents.md — the standalone agent instruction file.
//
// Same guidance as the `## When to use` section of /llms.txt (both render from
// lib/agent-guidance.ts, so they cannot drift), published separately because
// agents arrive two different ways: some read /llms.txt first, others land on a
// page from web search and probe well-known markdown paths without ever seeing
// the index. This is the cold-discovery copy for the second group.
//
// Served as real text/markdown and advertised from the <head> alternates, the
// Link response header, robots.txt and /llms.txt.
export function GET() {
  const base = siteConfig.url
  return new Response(buildAgentsMd(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Link: `<${base}/llms.txt>; rel="index", <${base}/sitemap.xml>; rel="sitemap"`,
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  })
}
