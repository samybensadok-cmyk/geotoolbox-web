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
    slug: "robots-txt-tester",
    name: "robots.txt Tester",
    desc: "Test any URL against a site's robots.txt with Google's real precedence rules — per crawler, with the exact rule that decided each verdict. Replaces the retired Search Console tester. Free.",
    navDesc: "Test what your robots.txt actually blocks",
  },
  {
    slug: "robots-txt-generator",
    name: "robots.txt Generator",
    desc: "Build a robots.txt from WordPress/Shopify presets, declare your sitemap, and decide about AI crawlers with each labelled by what blocking it costs you. Free.",
    navDesc: "Build a robots.txt with AI crawler controls",
  },
  {
    slug: "sitemap-extractor",
    name: "Sitemap URL Extractor",
    desc: "Pull every URL out of any XML sitemap — index files walked to their children, .xml.gz decompressed, the sitemap found from a bare domain. Export CSV, TXT or JSON. Free.",
    navDesc: "Extract every URL from an XML sitemap",
  },
  {
    slug: "llms-txt-generator",
    name: "llms.txt Generator",
    desc: "Paste a domain and get a spec-correct llms.txt built from your own sitemap — real titles, grouped sections, junk pages left out. Plus llms-full.txt. Free.",
    navDesc: "Build an llms.txt from your domain",
  },
  {
    slug: "llms-txt-checker",
    name: "llms.txt Checker",
    desc: "Validate any site's llms.txt against the spec, resolve every link, and score it 0-100 on a published rubric. Free.",
    navDesc: "Validate & score an existing llms.txt",
  },
]
