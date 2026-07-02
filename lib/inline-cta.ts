import type { Post } from "./content"

export type InlineCtaTarget = "ai-readiness" | "content-analyzer"

const MIN_WORDS = 1200
const TARGET_DEPTH = 0.66
// H2s that start the article's tail (FAQ/Sources) — never inject at or after these
const TERMINAL_H2 = /^(frequently asked|faqs?\b|sources|references|further reading|foire aux questions|questions fr[ée]quentes)/i
// any in-body link to a product/tool surface counts as an existing CTA
const CTA_LINK = /\(\/(app|features|tools)([/)#?]|$)/

/**
 * Insert an `<InlineCta />` MDX tag before the H2 whose cumulative word
 * offset is closest to 66% of the body, with guards: skip short posts
 * (<1200 words), never inside/after FAQ or Sources sections, never adjacent
 * to a paragraph that already links a product surface, frontmatter opt-out
 * via `inlineCta: false`. Render-layer only — MDX files are never edited.
 */
export function injectInlineCta(post: Post): { source: string; injected: boolean } {
  if (post.inlineCta === false) return { source: post.content, injected: false }

  const lines = post.content.split("\n")
  let inFence = false
  let totalWords = 0
  const h2s: { line: number; text: string; wordsBefore: number }[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.startsWith("```")) { inFence = !inFence; continue }
    if (!inFence) {
      const m = /^##\s+(.+?)\s*$/.exec(line)
      if (m) {
        h2s.push({ line: i, text: m[1], wordsBefore: totalWords })
        continue
      }
    }
    totalWords += line.split(/\s+/).filter(Boolean).length
  }

  if (totalWords < MIN_WORDS) return { source: post.content, injected: false }

  const terminalIdx = h2s.findIndex((h) => TERMINAL_H2.test(h.text))
  const candidates = (terminalIdx === -1 ? h2s : h2s.slice(0, terminalIdx))
    // never before the first H2 — that's the intro boundary, not mid-body
    .slice(1)
    .sort(
      (a, b) =>
        Math.abs(a.wordsBefore / totalWords - TARGET_DEPTH) -
        Math.abs(b.wordsBefore / totalWords - TARGET_DEPTH)
    )

  const paragraphAround = (lineIdx: number, dir: -1 | 1): string => {
    const block: string[] = []
    let i = lineIdx + dir
    while (i >= 0 && i < lines.length && lines[i].trim() === "") i += dir
    while (i >= 0 && i < lines.length && lines[i].trim() !== "") {
      block.push(lines[i])
      i += dir
    }
    return block.join("\n")
  }

  for (const h2 of candidates) {
    const before = paragraphAround(h2.line, -1)
    const after = paragraphAround(h2.line, 1)
    if (CTA_LINK.test(before) || CTA_LINK.test(after)) continue

    const target = pickTarget(post.content)
    const out = [...lines]
    out.splice(h2.line, 0, `<InlineCta target="${target}" />`, "")
    return { source: out.join("\n"), injected: true }
  }

  return { source: post.content, injected: false }
}

/**
 * Avoid pitching the destination the article already links (typically its
 * conclusion CTA): default is the free AI-Readiness tool; if the post
 * already links it, pitch Content Analyzer instead.
 */
function pickTarget(content: string): InlineCtaTarget {
  return content.includes("/tools/ai-readiness") ? "content-analyzer" : "ai-readiness"
}
