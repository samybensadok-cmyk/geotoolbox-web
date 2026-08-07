import type { Post } from "./content"

export type InlineCtaTarget = "ai-readiness" | "content-analyzer" | "signup"

/**
 * Articles where the reader is actively comparing tools in OUR category —
 * these get a signup CTA (mid-article and end-block extras) instead of the
 * generic free-tool ask. Deliberately an explicit allowlist, not a slug
 * pattern: "grok-vs-claude" is a model comparison, not tool-shopping, and
 * pattern-matching "-vs-"/"best-" would hijack those. Includes FR twins
 * (FR slugs differ via the donor map). semrush-vs-ahrefs is excluded on
 * purpose — it monetizes via the affiliate route.
 */
export const COMMERCIAL_INTENT_SLUGS = new Set<string>([
  "best-generative-engine-optimization-tools",
  "best-ai-visibility-tools",
  "best-aeo-tools",
  "profound-alternatives",
  "profound-pricing",
  "what-is-peec-ai",
  "scrunch-ai-review",
  "best-perplexity-rank-tracker",
  "geo-services-vs-software",
  "ai-overview-tracker",
  "ai-rank-tracker",
  "how-to-track-ai-visibility",
  "ai-visibility-audit",
  // FR twins
  "suivre-visibilite-ia",
])

export function isCommercialIntent(slug: string): boolean {
  return COMMERCIAL_INTENT_SLUGS.has(slug)
}

const MIN_WORDS = 1200
const TARGET_DEPTH = 0.66
// H2s that start the article's tail (FAQ/Sources) — never inject at or after
// these. KEEP IN SYNC with contentLocales: a locale missing from this pattern
// silently loses the guard and can take an InlineCta injected inside its FAQ.
// (es was missing until 2026-08-07, so every ES article shipped unguarded.)
const TERMINAL_H2 =
  /^(frequently asked|faqs?\b|sources|references|further reading|foire aux questions|questions fr[ée]quentes|preguntas frecuentes|fuentes|referencias|m[áa]s informaci[óo]n)/i
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

    const target = pickTarget(post)
    const out = [...lines]
    out.splice(h2.line, 0, `<InlineCta target="${target}" />`, "")
    return { source: out.join("\n"), injected: true }
  }

  return { source: post.content, injected: false }
}

/**
 * Commercial-intent articles (tool comparisons in our category) pitch signup —
 * that reader is shopping, not learning. Otherwise avoid pitching the
 * destination the article already links (typically its conclusion CTA):
 * default is the free AI-Readiness tool; if the post already links it,
 * pitch Content Analyzer instead.
 */
function pickTarget(post: Post): InlineCtaTarget {
  if (isCommercialIntent(post.slug)) return "signup"
  return post.content.includes("/tools/ai-readiness") ? "content-analyzer" : "ai-readiness"
}
