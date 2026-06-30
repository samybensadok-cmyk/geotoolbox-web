import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { calculateReadingTime, slugify } from "./utils"

export type Heading = { level: 2 | 3; text: string; slug: string }

/**
 * Parse MDX content for `## Heading` and `### Heading` lines and
 * return them as a flat list. Used to build the sticky TOC sidebar
 * on blog post pages. Ignores headings inside fenced code blocks.
 */
export function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = []
  let inFence = false
  for (const line of content.split("\n")) {
    if (line.startsWith("```")) { inFence = !inFence; continue }
    if (inFence) continue
    const m = /^(#{2,3})\s+(.+?)\s*$/.exec(line)
    if (!m) continue
    const level = (m[1].length as 2 | 3)
    const text = m[2].replace(/[*_`]/g, "").trim()
    if (!text) continue
    headings.push({ level, text, slug: slugify(text) })
  }
  return headings
}

/**
 * Parse the "## Frequently Asked Questions" section of a post into Q/A pairs
 * for FAQPage JSON-LD. Supports both house formats: `### Question` headings
 * and bold-line questions (`**Question?**`) each followed by answer paragraphs.
 * Returns [] when no FAQ section exists or it has fewer than 2 questions.
 */
export function extractFaq(content: string): Array<{ question: string; answer: string }> {
  const lines = content.split("\n")
  const start = lines.findIndex((l) => /^##\s+(frequently asked questions|faqs?)\s*$/i.test(l.trim()))
  if (start === -1) return []

  const clean = (s: string) =>
    s
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> anchor text
      .replace(/<[^>]+>/g, "")
      .replace(/[*_`]/g, "")
      .replace(/\s+/g, " ")
      .trim()

  const faqs: Array<{ question: string; answer: string }> = []
  let question = ""
  let answer: string[] = []
  const flush = () => {
    if (question && answer.length) faqs.push({ question: clean(question), answer: clean(answer.join(" ")) })
    answer = []
  }

  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (/^##\s/.test(line)) break // next H2 ends the section
    const h3 = /^###\s+(.+)$/.exec(line)
    const bold = /^\*\*(.+?)\*\*$/.exec(line)
    if (h3 || bold) {
      flush()
      question = (h3?.[1] ?? bold?.[1] ?? "").trim()
    } else if (line && question) {
      answer.push(line)
    }
  }
  flush()
  return faqs.length >= 2 ? faqs : []
}

// Locale-aware content roots. `en` keeps the original flat dirs
// (content/blog, content/glossary) so existing EN URLs + builds are
// byte-identical; other locales read content/{locale}/blog|glossary.
function blogDir(locale: string = "en") {
  return locale === "en"
    ? path.join(process.cwd(), "content", "blog")
    : path.join(process.cwd(), "content", locale, "blog")
}

export type Post = {
  slug: string
  title: string
  description: string
  date: string
  updated?: string
  author: string
  tags: string[]
  image?: string
  draft: boolean
  noindex: boolean
  /** set `inlineCta: false` in frontmatter to opt a post out of the mid-body CTA */
  inlineCta?: boolean
  readingTime: number
  content: string
  /** locale of this post; "en" for the root content/blog dir */
  locale: string
  /** localization provenance (set on non-en files by the translation pipeline) */
  donorSlug?: string
  donorCommit?: string
}

export function getAllPosts(locale: string = "en"): Post[] {
  const dir = blogDir(locale)
  if (!fs.existsSync(dir)) return []
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"))
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8")
      const { data, content } = matter(raw)
      return {
        slug: file.replace(".mdx", ""),
        title: data.title ?? "",
        description: data.description ?? "",
        date: data.date ?? "",
        updated: data.updated,
        author: data.author ?? "Samy Ben Sadok",
        tags: data.tags ?? [],
        image: data.image,
        draft: data.draft ?? false,
        noindex: data.noindex ?? false,
        inlineCta: data.inlineCta,
        readingTime: calculateReadingTime(content),
        content,
        locale,
        donorSlug: data.donorSlug,
        donorCommit: data.donorCommit,
      } as Post
    })
    .filter((p) => !p.draft)
    .filter((p) => !p.noindex)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string, locale: string = "en"): Post | undefined {
  const filePath = path.join(blogDir(locale), `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return undefined
  const raw = fs.readFileSync(filePath, "utf-8")
  const { data, content } = matter(raw)
  return {
    slug,
    title: data.title ?? "",
    description: data.description ?? "",
    date: data.date ?? "",
    updated: data.updated,
    author: data.author ?? "Samy Ben Sadok",
    tags: data.tags ?? [],
    image: data.image,
    draft: data.draft ?? false,
    noindex: data.noindex ?? false,
    inlineCta: data.inlineCta,
    readingTime: calculateReadingTime(content),
    content,
    locale,
    donorSlug: data.donorSlug,
    donorCommit: data.donorCommit,
  }
}

export function getAllTags(locale: string = "en"): string[] {
  const posts = getAllPosts(locale)
  const tags = new Set<string>()
  posts.forEach((p) => p.tags.forEach((t) => tags.add(t)))
  return Array.from(tags).sort()
}

/**
 * Slugs of all NON-DRAFT posts for a locale, INCLUDING noindex ones — for
 * generateStaticParams. noindexed pages (e.g. un-graduated localized articles,
 * spec §8) must still prerender + be reachable + crawlable; only listings,
 * sitemap, and hreflang (via getAllPosts) hide them. Drafts never render.
 */
export function getAllPostSlugs(locale: string = "en"): string[] {
  const dir = blogDir(locale)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .filter((f) => {
      const { data } = matter(fs.readFileSync(path.join(dir, f), "utf-8"))
      return !(data.draft ?? false)
    })
    .map((f) => f.replace(".mdx", ""))
}

// ---------------------------------------------------------------------------
// Related posts — hybrid relevance + popularity scoring for the "Keep reading"
// block on blog post pages.
// ---------------------------------------------------------------------------

const STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "but", "by", "do", "does", "for",
  "from", "how", "in", "into", "is", "it", "its", "of", "on", "or", "that",
  "the", "their", "this", "to", "vs", "what", "when", "which", "why", "with",
  "you", "your",
])

function titleTokens(title: string): Set<string> {
  return new Set(
    title
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length > 2 && !STOPWORDS.has(t))
  )
}

/**
 * Popularity boost per slug, derived from lib/popular.json (a GSC snapshot
 * baked manually during content sessions). List order = popularity rank;
 * boost is the rank decile mapped to 1.0 (top) .. 0.1 (bottom). Missing or
 * malformed file degrades to no boost — a stale snapshot must never break
 * builds or rendering.
 */
function getPopularityBoosts(): Map<string, number> {
  const boosts = new Map<string, number>()
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), "lib", "popular.json"), "utf-8")
    const pages: Array<{ slug: string }> = JSON.parse(raw).pages ?? []
    pages.forEach((p, i) => {
      boosts.set(p.slug, (10 - Math.floor((i / pages.length) * 10)) / 10)
    })
  } catch {
    // no popular.json — pure relevance fallback
  }
  return boosts
}

/**
 * Hybrid related-posts picker:
 *   relevance = shared_tags * 2 + title token overlap (stopword-filtered)
 *   score     = relevance + popularity_boost (rank decile / 10)
 * Posts need relevance >= 2 to qualify on relevance; remaining slots fill
 * from the popularity list, then by recency, so every post gets n cards
 * even with thin tags (cold-start guarantee). Excludes self; drafts and
 * noindex posts are already excluded by getAllPosts().
 */
export function getRelatedPosts(slug: string, n = 3, locale: string = "en"): Post[] {
  const current = getPostBySlug(slug, locale)
  if (!current) return []
  const pool = getAllPosts(locale).filter((p) => p.slug !== slug)
  const boosts = getPopularityBoosts()
  const currentTags = new Set(current.tags)
  const currentTokens = titleTokens(current.title)

  const scored = pool
    .map((post) => {
      const sharedTags = post.tags.filter((t) => currentTags.has(t)).length
      let overlap = 0
      titleTokens(post.title).forEach((t) => {
        if (currentTokens.has(t)) overlap++
      })
      const relevance = sharedTags * 2 + overlap
      return { post, relevance, score: relevance + (boosts.get(post.slug) ?? 0) }
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        new Date(b.post.date).getTime() - new Date(a.post.date).getTime()
    )

  const picks = scored.filter((s) => s.relevance >= 2).slice(0, n).map((s) => s.post)

  if (picks.length < n) {
    const taken = new Set(picks.map((p) => p.slug))
    // fill from popularity rank, then recency (pool is already date-sorted)
    const fillers = [
      ...pool.filter((p) => boosts.has(p.slug)).sort((a, b) => (boosts.get(b.slug) ?? 0) - (boosts.get(a.slug) ?? 0)),
      ...pool,
    ]
    for (const p of fillers) {
      if (picks.length >= n) break
      if (!taken.has(p.slug)) {
        taken.add(p.slug)
        picks.push(p)
      }
    }
  }

  return picks
}

// ---------------------------------------------------------------------------
// Glossary — short, answer-first definition pages. Mirrors the blog content
// pipeline but reads content/glossary/*.mdx. Each entry is one term.
// ---------------------------------------------------------------------------

function glossaryDir(locale: string = "en") {
  return locale === "en"
    ? path.join(process.cwd(), "content", "glossary")
    : path.join(process.cwd(), "content", locale, "glossary")
}

export type GlossaryTerm = {
  slug: string
  term: string
  aliases: string[]
  definition: string
  category: string
  related: string[]
  article?: string
  articleLabel?: string
  relatedArticles: { href: string; label: string }[]
  updated: string
  draft: boolean
  content: string
  locale: string
  donorSlug?: string
  donorCommit?: string
}

function parseGlossaryFile(file: string, locale: string = "en"): GlossaryTerm {
  const raw = fs.readFileSync(path.join(glossaryDir(locale), file), "utf-8")
  const { data, content } = matter(raw)
  return {
    slug: file.replace(".mdx", ""),
    term: data.term ?? "",
    aliases: data.aliases ?? [],
    definition: data.definition ?? "",
    category: data.category ?? "General",
    related: data.related ?? [],
    article: data.article,
    articleLabel: data.articleLabel,
    relatedArticles: data.relatedArticles ?? [],
    updated: data.updated ?? "",
    draft: data.draft ?? false,
    content,
    locale,
    donorSlug: data.donorSlug,
    donorCommit: data.donorCommit,
  }
}

export function getAllGlossaryTerms(locale: string = "en"): GlossaryTerm[] {
  const dir = glossaryDir(locale)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => parseGlossaryFile(f, locale))
    .filter((t) => !t.draft)
    .sort((a, b) => a.term.localeCompare(b.term))
}

export function getGlossaryTermBySlug(slug: string, locale: string = "en"): GlossaryTerm | undefined {
  const filePath = path.join(glossaryDir(locale), `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return undefined
  return parseGlossaryFile(`${slug}.mdx`, locale)
}

/** Slugs of all non-draft glossary terms (incl. noindex) for generateStaticParams. */
export function getAllGlossarySlugs(locale: string = "en"): string[] {
  const dir = glossaryDir(locale)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .filter((f) => {
      const { data } = matter(fs.readFileSync(path.join(dir, f), "utf-8"))
      return !(data.draft ?? false)
    })
    .map((f) => f.replace(".mdx", ""))
}

export function getGlossaryCategories(locale: string = "en"): string[] {
  const cats = new Set(getAllGlossaryTerms(locale).map((t) => t.category))
  return Array.from(cats).sort()
}
