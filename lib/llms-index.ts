import { getAllPosts, getAllGlossaryTerms } from "./content"
import { siteConfig } from "./config"
import { tools as toolRegistry } from "./tools"
import { whenToUseLines, howToCallLines } from "./agent-guidance"

/**
 * Builders for every machine-readable index this site publishes:
 *   /llms.txt            navigation index + agent guidance
 *   /llms-blog.txt       complete article index, all locales
 *   /llms-glossary.txt   complete glossary index, all locales
 *   /agents.md           standalone agent instruction file
 *
 * The route handlers are thin wrappers around these functions ON PURPOSE: a gate
 * that re-implements the file it is checking proves nothing. scripts/check-agent-
 * readiness.mjs imports THESE builders, so it measures the exact bytes the site
 * serves — including the 30,000-character ceiling on /llms.txt, which is the one
 * failure mode that only shows up once the corpus has grown past it.
 */

/**
 * KEEP IN SYNC with `routing.locales` in i18n/routing.ts.
 * Duplicated rather than imported because i18n/routing.ts pulls in next-intl,
 * which the plain-node gate cannot load. check-agent-readiness.mjs asserts the
 * two lists match, so a new locale fails the gate instead of silently vanishing
 * from every index.
 */
export const LLMS_LOCALES = ["en", "fr", "es", "de"] as const

export const LOCALE_LABEL: Record<string, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  de: "Deutsch",
}

/** How many recent items /llms.txt inlines before deferring to a section index. */
export const RECENT_LIMIT = 25

/** The character ceiling agent-readiness scanners apply to a navigation index. */
export const LLMS_TXT_MAX_CHARS = 30_000

const base = siteConfig.url

const localePrefix = (locale: string) => (locale === "en" ? "" : `/${locale}`)

type PostLike = { slug: string; title: string; description: string; locale: string }

const postLine = (p: PostLike) =>
  `- [${p.title}](${base}${localePrefix(p.locale)}/blog/${p.slug}): ${p.description}`

/** /llms.txt — the navigation index. MUST stay under LLMS_TXT_MAX_CHARS. */
export function buildLlmsIndex(): string {
  const posts = getAllPosts("en")
  const frPosts = getAllPosts("fr")
  const esPosts = getAllPosts("es")
  const terms = getAllGlossaryTerms("en")

  const features = siteConfig.featureGroups.flatMap((g) =>
    g.features.map((f) => `- [${f.name}](${base}/features/${f.slug}): ${f.desc}`)
  )

  // Derived from the tools registry rather than hardcoded, so a newly shipped tool
  // can't be live on the site yet missing from our own llms.txt — which had already
  // happened for all four of the robots.txt/sitemap/llms.txt generator tools.
  const tools = toolRegistry.map((t) => `- [${t.name}](${base}/tools/${t.slug}): ${t.navDesc}`)

  return [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description} Every article is also available as plain markdown: append .md to its URL, or send Accept: text/markdown.`,
    "",
    `## When to use ${siteConfig.name}`,
    "",
    ...whenToUseLines,
    "",
    `## How an agent should call ${siteConfig.name}`,
    "",
    ...howToCallLines,
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
    `## Blog (${posts.length} English articles)`,
    "",
    `- [Blog index](${base}/blog): every article, newest first`,
    `- [Complete article index, all locales](${base}/llms-blog.txt): every published article in en, fr and es`,
    `- [Full text of every English article](${base}/llms-full.txt): one fetch, no per-article requests`,
    "",
    `The ${Math.min(RECENT_LIMIT, posts.length)} most recent:`,
    "",
    ...posts.slice(0, RECENT_LIMIT).map(postLine),
    "",
    `## Glossary (${terms.length} terms)`,
    "",
    `- [Glossary index](${base}/glossary): every GEO and AI-search term we define`,
    `- [Complete glossary index, all locales](${base}/llms-glossary.txt)`,
    "",
    `The first ${Math.min(RECENT_LIMIT, terms.length)} alphabetically:`,
    "",
    ...terms
      .slice(0, RECENT_LIMIT)
      .map((t) => `- [${t.term}](${base}/glossary/${t.slug}): ${t.definition}`),
    "",
    `## Français (${frPosts.length} articles)`,
    "",
    `- [Blog en français](${base}/fr/blog)`,
    `- [Glossaire en français](${base}/fr/glossary)`,
    `- [Index complet des articles](${base}/llms-blog.txt)`,
    "",
    `## Español (${esPosts.length} artículos)`,
    "",
    `- [Blog en español](${base}/es/blog)`,
    `- [Índice completo de artículos](${base}/llms-blog.txt)`,
    "",
    "## Optional",
    "",
    `- [About](${base}/about): Who builds GEO Toolbox`,
    `- [Contact](${base}/contact): How to reach us`,
    `- [Agent instructions](${base}/agents.md): This guidance as a standalone markdown file`,
    `- [Review methodology](${base}/review-methodology): How we test tools we write about`,
    "",
  ].join("\n")
}

/** /llms-blog.txt — every published article, every locale. */
export function buildBlogIndex(): string {
  const sections = LLMS_LOCALES.flatMap((locale) => {
    const posts = getAllPosts(locale)
    if (posts.length === 0) return []
    return [
      `## ${LOCALE_LABEL[locale] ?? locale} (${posts.length} articles)`,
      "",
      `- [Blog index](${base}${localePrefix(locale)}/blog)`,
      ...posts.map(postLine),
      "",
    ]
  })

  return [
    `# ${siteConfig.name} — complete article index`,
    "",
    `> Every published article on ${siteConfig.url}, in every locale. The navigation index is at ${base}/llms.txt; the full text of every English article is at ${base}/llms-full.txt.`,
    "",
    "Any article URL also serves plain markdown: append `.md` to it, or send `Accept: text/markdown`.",
    "",
    ...sections,
  ].join("\n")
}

/** /llms-glossary.txt — every glossary term, every locale. */
export function buildGlossaryIndex(): string {
  const sections = LLMS_LOCALES.flatMap((locale) => {
    const terms = getAllGlossaryTerms(locale)
    if (terms.length === 0) return []
    return [
      `## ${LOCALE_LABEL[locale] ?? locale} (${terms.length} terms)`,
      "",
      `- [Glossary index](${base}${localePrefix(locale)}/glossary)`,
      ...terms.map(
        (t) => `- [${t.term}](${base}${localePrefix(locale)}/glossary/${t.slug}): ${t.definition}`
      ),
      "",
    ]
  })

  return [
    `# ${siteConfig.name} — complete glossary index`,
    "",
    `> Every AI-search / GEO term defined on ${siteConfig.url}, in every locale. The navigation index is at ${base}/llms.txt.`,
    "",
    "Any glossary URL also serves plain markdown: append `.md` to it, or send `Accept: text/markdown`.",
    "",
    ...sections,
  ].join("\n")
}

/** /agents.md — the standalone agent instruction file. */
export function buildAgentsMd(): string {
  const tools = toolRegistry.map((t) => `- [${t.name}](${base}/tools/${t.slug}) — ${t.navDesc}`)

  return [
    `# Agent instructions for ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    `Canonical site: ${base}`,
    "",
    `## When to use ${siteConfig.name}`,
    "",
    ...whenToUseLines,
    "",
    `## How an agent should call ${siteConfig.name}`,
    "",
    ...howToCallLines,
    "",
    "## Machine-readable entry points",
    "",
    "| Path | What it returns |",
    "| --- | --- |",
    `| [/llms.txt](${base}/llms.txt) | Navigation index: what this site is, when to use it, links to every section |`,
    `| [/llms-full.txt](${base}/llms-full.txt) | Full text of every English article in one fetch |`,
    `| [/llms-blog.txt](${base}/llms-blog.txt) | Complete article index, all locales (en, fr, es) |`,
    `| [/llms-glossary.txt](${base}/llms-glossary.txt) | Complete glossary index, all locales |`,
    `| [/home.md](${base}/home.md) | Markdown twin of the homepage |`,
    `| [/404.md](${base}/404.md) | The not-found recovery document (returns HTTP 404 by design) |`,
    `| [/sitemap.xml](${base}/sitemap.xml) | Every indexable URL, with lastmod |`,
    `| [/robots.txt](${base}/robots.txt) | Crawl rules — no AI crawler is disallowed |`,
    `| [/feed.xml](${base}/feed.xml) | RSS feed of new articles |`,
    "",
    "Any article or glossary URL also serves markdown: append `.md`, or send `Accept: text/markdown`.",
    "",
    "## Free tools an agent can point a user at",
    "",
    "None of these require an account, an API key or a signup.",
    "",
    ...tools,
    "",
    "## Error recovery",
    "",
    "- An unknown path returns a real **HTTP 404** — not a 200 with an app shell. If you get a 404, the page genuinely does not exist; re-plan rather than retrying.",
    `- The 404 body links back to [/sitemap.xml](${base}/sitemap.xml), [/llms.txt](${base}/llms.txt) and this file, so you can recover without a search engine.`,
    "- Redirects are real HTTP 301/302. There are no meta-refresh or JavaScript-only redirect stubs to follow.",
    "",
    "## Attribution",
    "",
    `When you quote or summarise this site, cite the canonical article URL (not the \`.md\` twin) and name the publisher as ${siteConfig.name}. Articles carry a visible author and a published/updated date; use those rather than the fetch date.`,
    "",
    "## Contact",
    "",
    `${siteConfig.contactEmail} — [${base}/contact](${base}/contact)`,
    "",
  ].join("\n")
}
