import { siteConfig } from "@/lib/config"
import { PLANS, BOOK_CALL, doneWithYouMonthly } from "@/lib/plans"
import { GEO_SERVICE_PRICES as GSP, usd } from "@/lib/service-offers"

// Markdown twin of the homepage, for AI agents and crawlers. Reached directly
// at /home.md or via `Accept: text/markdown` on / (middleware rewrite) — the
// same contract robots.txt advertises for articles.
export function GET() {
  const base = siteConfig.url

  const features = siteConfig.featureGroups.flatMap((g) => [
    `### ${g.group}`,
    "",
    ...g.features.map((f) => `- [${f.name}](${base}/features/${f.slug}): ${f.desc}`),
    "",
  ])

  const starter = PLANS.find((p) => p.id === "starter")!
  const body = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    `${siteConfig.name} measures how visible a brand is in AI answers (share of voice,`,
    "citations, sentiment) and whether AI agents and crawlers can actually access and",
    "use its site — then turns both into ranked, evidence-backed fixes.",
    "",
    "## Features",
    "",
    ...features,
    "## Ways to work with us",
    "",
    `- Do it yourself: plans from ${usd(Math.round(starter.priceYearly! / 12))}/mo billed yearly (${usd(starter.priceMonthly!)}/mo billed monthly). [Pricing](${base}/pricing)`,
    `- Done with you: your plan plus a 60-minute monthly session with the founder and a one-page worklist, ${usd(doneWithYouMonthly("brand"))}/mo for brands (Plus plan included) or ${usd(doneWithYouMonthly("agency"))}/mo for agencies (Growth plan included, up to 3 client brands). [Book a call](${BOOK_CALL})`,
    `- Done for you: AI + SEO Visibility Report ${usd(GSP.report)} one-off, 30-Day AI Visibility Sprint from ${usd(GSP.sprintFrom)}, ongoing GEO + SEO work from ${usd(GSP.retainerFromMonthly)}/mo. [Services](${base}/services/generative-engine-optimization)`,
    "",
    "## Free tools",
    "",
    `- [AI Crawler Checker](${base}/tools/ai-crawler-checker)`,
    `- [AI-Readiness Score](${base}/tools/ai-readiness)`,
    `- [llms.txt Checker](${base}/tools/llms-txt-checker)`,
    `- [Keyword to AI Prompts](${base}/tools/keyword-to-prompts)`,
    `- [Query Fan-Out Preview](${base}/tools/query-fanout)`,
    "",
    "## Key links",
    "",
    `- [Pricing](${base}/pricing)`,
    `- [Blog](${base}/blog) — every article is also markdown: append .md, or send Accept: text/markdown`,
    `- [llms.txt](${base}/llms.txt) · [llms-full.txt](${base}/llms-full.txt)`,
    `- [Contact](${base}/contact)`,
    "",
  ].join("\n")

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Link: `<${base}/>; rel="canonical"`,
      Vary: "Accept",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  })
}
