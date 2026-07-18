/**
 * Single source of truth for the free tools. Consumed by:
 *   - the Tools dropdown in the header (components/layout/header.tsx)
 *   - the Tools column in the footer (components/layout/footer.tsx)
 *   - the /tools hub page (app/tools/page.tsx)
 * Add a new tool here once and it appears in all three.
 */

export interface ToolEntry {
  slug: string
  name: string
  /** Full description for the /tools hub cards. */
  desc: string
  /** Short one-liner for the header dropdown. */
  navDesc: string
}

export const tools: ToolEntry[] = [
  {
    slug: "keyword-to-prompts",
    name: "Keyword → AI Prompts",
    desc: "Turn any keyword into the conversational prompts people ask ChatGPT, Claude and Perplexity — ~15 across 6 intents, with the brand-surfacing ones flagged so you know what to track. Free.",
    navDesc: "Turn keywords into trackable AI prompts",
  },
  {
    slug: "query-fanout",
    name: "AI Query Fan-Out",
    desc: "Run a real query fan-out in your browser with your own Gemini key — see the actual sub-queries an engine fires for a topic, clustered into intents with a cross-engine divergence map. Free, keys stay local.",
    navDesc: "See the real sub-queries AI fans out (BYOK)",
  },
  {
    slug: "ai-readiness",
    name: "AI-Readiness Score",
    desc: "Score any domain on the foundations AI agents need — robots, crawler access, content signals, sitemap, markdown — across 5 of our 28 readiness checks. Free.",
    navDesc: "Score your site on 5 of 28 AI-readiness checks",
  },
  {
    slug: "ai-crawler-checker",
    name: "AI Crawler Checker",
    desc: "See which of 34 AI crawlers — GPTBot, ClaudeBot, PerplexityBot and more — your robots.txt allows or blocks, with the exact line to fix. Free.",
    navDesc: "Which of 34 AI crawlers your robots.txt blocks",
  },
  {
    slug: "sitemap-extractor",
    name: "Sitemap URL Extractor",
    desc: "Pull every URL out of any XML sitemap — index files walked to their children, .xml.gz decompressed, the sitemap found from a bare domain. Export CSV, TXT or JSON. Free.",
    navDesc: "Extract every URL from an XML sitemap",
  },
  {
    slug: "llms-txt-checker",
    name: "llms.txt Checker & Generator",
    desc: "Validate any site's llms.txt against the spec, resolve every link, score it 0-100, and generate a clean one. Free.",
    navDesc: "Validate & generate a spec-correct llms.txt",
  },
]
