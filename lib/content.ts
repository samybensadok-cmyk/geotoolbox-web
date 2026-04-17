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

const CONTENT_DIR = path.join(process.cwd(), "content", "blog")

export type Post = {
  slug: string
  title: string
  description: string
  date: string
  author: string
  tags: string[]
  image?: string
  draft: boolean
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
        author: data.author ?? "Samy Mahmoudi",
        tags: data.tags ?? [],
        image: data.image,
        draft: data.draft ?? false,
        readingTime: calculateReadingTime(content),
        content,
      } as Post
    })
    .filter((p) => !p.draft)
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
    author: data.author ?? "Samy Mahmoudi",
    tags: data.tags ?? [],
    image: data.image,
    draft: data.draft ?? false,
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
