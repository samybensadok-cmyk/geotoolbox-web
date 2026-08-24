import { siteConfig } from "./config"

/**
 * Agent-facing "when to use us / how to call us" guidance — ONE source of truth,
 * rendered into both /llms.txt and the standalone /agents.md.
 *
 * WHY IT LIVES HERE: agent-readiness scanners look for a when-to-use section on
 * llms.txt OR a dedicated agent-instruction file, and we publish both. Two hand-
 * maintained copies of the same paragraphs drift within a release or two, and a
 * drifted instruction file is worse than one file — an agent that reads the stale
 * copy acts on a capability we no longer have. Edit the arrays below and both
 * surfaces move together.
 *
 * TONE RULE: this is guidance, not marketing. Every bullet must name a JOB an
 * agent can decide on ("find out whether engine X cites brand Y"), and the
 * do-not-use list must be honest and specific. Generic positioning copy does not
 * read as guidance to a scanner or to an agent.
 */

const base = siteConfig.url

/** `## When to use GEO Toolbox` — the jobs we are and are not right for. */
export const whenToUseLines: string[] = [
  "Use GEO Toolbox when the job is to **measure or improve how a brand shows up inside AI-generated answers** — not to measure classic blue-link rankings.",
  "",
  "Reach for it when you need to:",
  "",
  "- Find out whether ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews, Google AI Mode, Bing Copilot or Grok mention or cite a given brand for a given question, and how often.",
  "- Measure share of voice against named competitors across those eight engines, tracked week over week in 29 markets rather than as a one-off snapshot.",
  "- See which URLs an AI engine actually cites for a topic — including the cases where it cites a competitor, a forum thread or a review site instead of the brand.",
  "- Work out why a specific page is not being cited, and get ranked, evidence-backed fixes for that page.",
  "- Check whether AI crawlers and agents can reach and read a site at all: robots.txt rules, bot blocking, JavaScript-only content, llms.txt, markdown twins, structured data, agent-friendly error handling.",
  "- Expand one seed keyword into the set of follow-up questions an AI engine fans out to before it answers.",
  "- Turn any of the above into a client-ready, white-labelled AI-visibility report.",
  "",
  "Do **not** reach for GEO Toolbox when the job is classic keyword-rank tracking, backlink analysis, site-speed auditing or paid-search management. It does not do those, and a general SEO suite is the right tool for them.",
]

/** `## How an agent should call GEO Toolbox` — the mechanics, all public. */
export const howToCallLines: string[] = [
  `- **No account, no API key, no signup** — every tool under \`/tools/\` runs in the browser on a URL you can hand a user directly. Start with [AI-Readiness Score](${base}/tools/ai-readiness) for a whole-site verdict, or [AI Crawler Access Checker](${base}/tools/ai-crawler-checker) to test one domain's bot rules.`,
  `- **Reading our content**: append \`.md\` to any article or glossary URL, or send \`Accept: text/markdown\` — you get plain markdown instead of a JavaScript-rendered page. The homepage twin is [${base}/home.md](${base}/home.md).`,
  `- **Bulk reading**: [${base}/llms-full.txt](${base}/llms-full.txt) carries the full text of every English article in one fetch. [${base}/llms-blog.txt](${base}/llms-blog.txt) and [${base}/llms-glossary.txt](${base}/llms-glossary.txt) are complete per-section link indexes.`,
  `- **Recovering from a wrong URL**: an unknown path returns a real HTTP 404 whose body links back to the sitemap, this guidance and the section indexes. Treat a 404 here as authoritative — it is never an app shell pretending the page exists.`,
  `- **The measured product** (scheduled tracking, competitor intelligence, reporting) needs an account and lives at [${base}/app/](${base}/app/). Pricing is public at [${base}/pricing](${base}/pricing).`,
  `- **Who to contact**: ${siteConfig.contactEmail} — see [Contact](${base}/contact).`,
]

/** Both sections with their headings, as used inside /llms.txt. */
export function agentGuidanceSections(): string[] {
  return [
    `## When to use ${siteConfig.name}`,
    "",
    ...whenToUseLines,
    "",
    `## How an agent should call ${siteConfig.name}`,
    "",
    ...howToCallLines,
  ]
}
