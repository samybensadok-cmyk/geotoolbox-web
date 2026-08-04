import { getPostBySlug, getGlossaryTermBySlug } from "@/lib/content"
import { siteConfig } from "@/lib/config"
import { mdxToMarkdown } from "@/lib/markdown"
import { contentLocales } from "@/i18n/routing"

// Internal target of the middleware markdown rewrites (/blog/<slug>.md and
// Accept: text/markdown). Serves the article as clean markdown — same URL
// space stays canonical via the Link header. Direct /md/* crawling is
// disallowed in robots.txt; agents reach this only through the twins.

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string; section: string; slug: string }> }
) {
  const { locale, section, slug } = await params
  if (!(contentLocales as readonly string[]).includes(locale) || !["blog", "glossary"].includes(section)) {
    return new Response("Not found", { status: 404 })
  }

  const prefix = locale === "en" ? "" : `/${locale}`
  const canonical = `${siteConfig.url}${prefix}/${section}/${slug}`
  let markdown: string | undefined

  if (section === "blog") {
    const post = getPostBySlug(slug, locale)
    if (post && !post.draft) {
      markdown = [
        `# ${post.title}`,
        "",
        `> ${post.description}`,
        "",
        `- Published: ${post.date}`,
        ...(post.updated ? [`- Updated: ${post.updated}`] : []),
        `- Author: ${post.author}`,
        `- Canonical: ${canonical}`,
        "",
        "---",
        "",
        mdxToMarkdown(post.content),
        "",
      ].join("\n")
    }
  } else {
    const term = getGlossaryTermBySlug(slug, locale)
    if (term && !term.draft) {
      markdown = [
        `# ${term.term}`,
        "",
        `> ${term.definition}`,
        "",
        ...(term.updated ? [`- Updated: ${term.updated}`] : []),
        `- Canonical: ${canonical}`,
        "",
        "---",
        "",
        mdxToMarkdown(term.content),
        "",
      ].join("\n")
    }
  }

  if (!markdown) {
    return new Response("Not found", { status: 404 })
  }

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Link: `<${canonical}>; rel="canonical"`,
      Vary: "Accept",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  })
}
