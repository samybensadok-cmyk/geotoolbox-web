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
    slug: "ai-crawler-checker",
    name: "AI Crawler Checker",
    desc: "See which of 34 AI crawlers — GPTBot, ClaudeBot, PerplexityBot and more — your robots.txt allows or blocks, with the exact line to fix. Free.",
    navDesc: "Which of 34 AI crawlers your robots.txt blocks",
  },
  {
    slug: "llms-txt-checker",
    name: "llms.txt Checker & Generator",
    desc: "Validate any site's llms.txt against the spec, resolve every link, score it 0-100, and generate a clean one. Free.",
    navDesc: "Validate & generate a spec-correct llms.txt",
  },
]
