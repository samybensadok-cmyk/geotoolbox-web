import { buildLlmsIndex } from "@/lib/llms-index"

// llms.txt (llmstxt.org) — agentic-web hygiene, generated from the content lib
// so it never goes stale. Stance (vault ai-citation-evidence-2026 §5a): this is
// NOT a citation/ranking lever and we don't claim it is; we ship it because
// (a) Lighthouse audits it under agentic browsing, (b) we run an llms.txt
// checker tool ourselves, so 404ing on our own file is a bad look.
//
// The body lives in lib/llms-index.ts so `npm run check:agents` can measure the
// exact bytes served — notably the 30,000-character ceiling on a navigation
// index, which this file blew past (~77KB) once the corpus hit 250+ articles.
export function GET() {
  return new Response(buildLlmsIndex(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  })
}
