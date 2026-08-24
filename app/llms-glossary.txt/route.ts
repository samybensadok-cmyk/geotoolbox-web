import { buildGlossaryIndex } from "@/lib/llms-index"
import { siteConfig } from "@/lib/config"

// Complete per-section index of every glossary term, in every locale. Split out
// of /llms.txt for the same reason as /llms-blog.txt — see the header comment
// there (llms.txt is an index, not a corpus).
export function GET() {
  return new Response(buildGlossaryIndex(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      Link: `<${siteConfig.url}/llms.txt>; rel="index"`,
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  })
}
