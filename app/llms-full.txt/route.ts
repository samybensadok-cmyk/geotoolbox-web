import { getAllPosts } from "@/lib/content"
import { siteConfig } from "@/lib/config"
import { mdxToMarkdown } from "@/lib/markdown"

// llms-full.txt (llmstxt.org) — the expanded companion to /llms.txt: full text
// of every published EN article in one file, so agents that
// prefer a single fetch don't have to walk the per-article .md twins. FR
// content is linked from /llms.txt rather than duplicated here.
export function GET() {
  const base = siteConfig.url
  const posts = getAllPosts("en").filter((p) => !p.draft)

  const postBlocks = posts.map((p) =>
    [
      `## ${p.title}`,
      "",
      `> ${p.description}`,
      "",
      `- Canonical: ${base}/blog/${p.slug}`,
      `- Published: ${p.date}${p.updated ? ` · Updated: ${p.updated}` : ""}`,
      "",
      mdxToMarkdown(p.content),
    ].join("\n")
  )

  const body = [
    `# ${siteConfig.name} — full content`,
    "",
    `> ${siteConfig.description}`,
    "",
    `The index version of this file is at ${base}/llms.txt.`,
    "",
    "# Blog",
    "",
    postBlocks.join("\n\n---\n\n"),
    "",
  ].join("\n")

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  })
}
