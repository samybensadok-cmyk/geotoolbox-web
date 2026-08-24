import { buildBlogIndex } from "@/lib/llms-index"
import { siteConfig } from "@/lib/config"

// Complete per-section index of every published article, in every locale.
//
// WHY THIS FILE EXISTS: /llms.txt is a NAVIGATION INDEX and agent-readiness
// scanners penalise it past ~30,000 characters (the llmstxt.org convention is an
// index, not a corpus). Listing 250+ articles inline pushed it to ~77KB, so the
// exhaustive lists moved here and /llms.txt links to this file instead. Nothing
// is lost — every article is still one hop from /llms.txt.
//
// Deliberately at the ROOT (/llms-blog.txt) rather than /blog/llms.txt: the blog
// lives under app/[locale]/blog, and introducing a literal `app/blog/` segment
// risks shadowing that dynamic branch. Root paths cannot collide.
export function GET() {
  return new Response(buildBlogIndex(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      Link: `<${siteConfig.url}/llms.txt>; rel="index"`,
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  })
}
