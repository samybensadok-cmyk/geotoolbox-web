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

const CONTENT_DIR = path.join(process.cwd(), "content", "blog")

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
  readingTime: number
  content: string
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(CONTENT_DIR)) return []
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"))
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8")
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
        readingTime: calculateReadingTime(content),
        content,
      } as Post
    })
    .filter((p) => !p.draft)
    .filter((p) => !p.noindex)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): Post | undefined {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`)
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
    readingTime: calculateReadingTime(content),
    content,
  }
}

export function getAllTags(): string[] {
  const posts = getAllPosts()
  const tags = new Set<string>()
  posts.forEach((p) => p.tags.forEach((t) => tags.add(t)))
  return Array.from(tags).sort()
}

// ---------------------------------------------------------------------------
// Glossary — short, answer-first definition pages. Mirrors the blog content
// pipeline but reads content/glossary/*.mdx. Each entry is one term.
// ---------------------------------------------------------------------------

const GLOSSARY_DIR = path.join(process.cwd(), "content", "glossary")

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
}

function parseGlossaryFile(file: string): GlossaryTerm {
  const raw = fs.readFileSync(path.join(GLOSSARY_DIR, file), "utf-8")
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
  }
}

export function getAllGlossaryTerms(): GlossaryTerm[] {
  if (!fs.existsSync(GLOSSARY_DIR)) return []
  return fs
    .readdirSync(GLOSSARY_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map(parseGlossaryFile)
    .filter((t) => !t.draft)
    .sort((a, b) => a.term.localeCompare(b.term))
}

export function getGlossaryTermBySlug(slug: string): GlossaryTerm | undefined {
  const filePath = path.join(GLOSSARY_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return undefined
  return parseGlossaryFile(`${slug}.mdx`)
}

export function getGlossaryCategories(): string[] {
  const cats = new Set(getAllGlossaryTerms().map((t) => t.category))
  return Array.from(cats).sort()
}
