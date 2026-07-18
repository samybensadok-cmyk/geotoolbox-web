import { getAllPosts, getAllGlossaryTerms } from "@/lib/content"
import { siteConfig } from "@/lib/config"
import { tools as toolRegistry } from "@/lib/tools"

// llms.txt (llmstxt.org) — agentic-web hygiene, generated from the content
// lib so it never goes stale. Stance (vault ai-citation-evidence-2026 §5a):
// this is NOT a citation/ranking lever and we don't claim it is; we ship it
// because (a) Lighthouse audits it under agentic browsing, (b) we run an
// llms.txt checker tool ourselves, so 404ing on our own file is a bad look.

export function GET() {
  const base = siteConfig.url
  const posts = getAllPosts("en")
  const frPosts = getAllPosts("fr")
  const terms = getAllGlossaryTerms("en")

  const postLine = (p: { slug: string; title: string; description: string; locale: string }) =>
    `- [${p.title}](${base}${p.locale === "en" ? "" : `/${p.locale}`}/blog/${p.slug}): ${p.description}`

  const features = siteConfig.featureGroups.flatMap((g) =>
    g.features.map((f) => `- [${f.name}](${base}/features/${f.slug}): ${f.desc}`)
  )

  // Derived from the tools registry rather than hardcoded, so a newly shipped tool
  // can't be live on the site yet missing from our own llms.txt — which had already
  // happened for all four of the robots.txt/sitemap/llms.txt generator tools. Same
  // failure the sitemap route hit; same fix.
  const tools = toolRegistry.map(
    (t) => `- [${t.name}](${base}/tools/${t.slug}): ${t.navDesc}`
  )

  const body = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description} Every article is also available as plain markdown: append .md to its URL, or send Accept: text/markdown.`,
    "",
    "## Product",
    "",
    `- [Features](${base}/features): What GEO Toolbox measures and how`,
    `- [Pricing](${base}/pricing): Plans and what each unlocks`,
    ...features,
    "",
    "## Free tools",
    "",
    ...tools,
    "",
    "## Blog",
    "",
    ...posts.map(postLine),
    "",
    "## Glossary",
    "",
    ...terms.map((t) => `- [${t.term}](${base}/glossary/${t.slug}): ${t.definition}`),
    "",
    "## Français",
    "",
    ...frPosts.map(postLine),
    "",
    "## Optional",
    "",
    `- [About](${base}/about): Who builds GEO Toolbox`,
    `- [Contact](${base}/contact): How to reach us`,
    `- [Review methodology](${base}/review-methodology): How we test tools we write about`,
    "",
  ].join("\n")

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  })
}
