import { getPostBySlug, getGlossaryTermBySlug } from "@/lib/content"
import { siteConfig } from "@/lib/config"
import { mdxToMarkdown } from "@/lib/markdown"
import { makeLocalizer } from "@/lib/i18n/siblings"
import { localizeMarkdownLinks } from "@/lib/i18n/localize-markdown"
import { contentLocales } from "@/i18n/routing"
import { markdown404Body, markdown404Headers } from "@/lib/agent-404"

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
    return new Response(markdown404Body(`/${locale}/${section}/${slug}.md`), {
      status: 404,
      headers: markdown404Headers(),
    })
  }

  const prefix = locale === "en" ? "" : `/${locale}`
  const canonical = `${siteConfig.url}${prefix}/${section}/${slug}`
  // Body links in a non-default locale point at the same localized siblings as
  // the HTML page (same localizer). The default locale is left untouched.
  // Applied here, not inside mdxToMarkdown, which also feeds /llms-full.txt.
  const body = (mdx: string) => {
    const md = mdxToMarkdown(mdx)
    return locale === "en" ? md : localizeMarkdownLinks(md, makeLocalizer(locale))
  }
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
        body(post.content),
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
        body(term.content),
        "",
      ].join("\n")
    }
  }

  if (!markdown) {
    return new Response(markdown404Body(`/${locale}/${section}/${slug}.md`), {
      status: 404,
      headers: markdown404Headers(),
    })
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
