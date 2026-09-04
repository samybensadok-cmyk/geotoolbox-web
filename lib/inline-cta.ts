import type { Post } from "./content"

/**
 * Mid-article CTA targets. EVERY target must be a destination that DOES
 * something for the reader — a free tool that runs on their own domain, or the
 * signup form. `/features/*` is deliberately absent: those are brochure pages
 * whose own only action is a link onward to `/app`
 * (verified 2026-09-01 — app/[locale]/features/content-analyzer/page.tsx has no
 * form, no input and no fetch; its single CTA is `/app`). Until 2026-09-01 the
 * `content-analyzer` target sent 143 of 260 published articles — 55% of the
 * corpus, and the single most-served CTA on the site — to that brochure.
 */
export type InlineCtaTarget =
  | "signup"
  | "ai-readiness"
  | "ai-crawler-checker"
  | "llms-txt-checker"
  | "query-fanout"
  | "keyword-to-prompts"

/**
 * Articles where the reader is actively comparing tools in OUR category —
 * these get a signup CTA (mid-article and end-block extras) instead of the
 * generic free-tool ask. Deliberately an explicit allowlist, not a slug
 * pattern: "grok-vs-claude" is a model comparison, not tool-shopping, and
 * pattern-matching "-vs-"/"best-" would hijack those. semrush-vs-ahrefs is
 * excluded on purpose — it monetizes via the affiliate route.
 *
 * EN slugs ONLY. Localized twins resolve through `post.donorSlug` (see
 * `isCommercialIntentPost`), not through hand-maintained twin entries — the
 * hand-maintained list had drifted to 1 of 10 twins (FR `suivre-visibilite-ia`
 * present; the other 2 FR and all 7 ES twins missing), so 9 localized
 * commercial-intent articles were silently getting the generic free-tool CTA
 * and no pricing link.
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
])

/** Raw slug check. Prefer `isCommercialIntentPost` — it resolves twins. */
export function isCommercialIntent(slug: string): boolean {
  return COMMERCIAL_INTENT_SLUGS.has(slug)
}

/**
 * Locale-safe commercial-intent test. A localized article carries the EN slug
 * it was transcreated from in frontmatter `donorSlug:`; that field is read by
 * lib/content.ts, so this is immune to the quoted-vs-unquoted `donorSlug:`
 * mess that breaks frontmatter greps. Falls back to the article's own slug for
 * EN posts and for natives written directly in a locale.
 */
export function isCommercialIntentPost(post: Pick<Post, "slug" | "donorSlug">): boolean {
  return COMMERCIAL_INTENT_SLUGS.has(post.donorSlug ?? post.slug)
}

const MIN_WORDS = 1200
const TARGET_DEPTH = 0.66
// H2s that start the article's tail (FAQ/Sources) — never inject at or after
// these. KEEP IN SYNC with contentLocales: a locale missing from this pattern
// silently loses the guard and can take an InlineCta injected inside its FAQ.
// (es was missing until 2026-08-07, so every ES article shipped unguarded.)
// "more questions" is the FAQ-trim tail H2 (faq-trim-2026-08-31/scripts/21-apply-demote.mjs
// `H2` map). It always follows the FAQ H2, so it is already excluded transitively — listed
// anyway, because a pattern missing from here fails silently rather than loudly.
const TERMINAL_H2 =
  /^(frequently asked|faqs?\b|more questions|sources|references|further reading|foire aux questions|questions fr[ée]quentes|preguntas frecuentes|fuentes|referencias|m[áa]s informaci[óo]n)/i
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
/**
 * Topic routing table, most specific first. Each entry maps a subject the
 * article is actually ABOUT to the free tool that answers the reader's next
 * question about their OWN site. Patterns are matched against the article body
 * (lowercased) plus its slug and tags, and are written in EN + FR + ES because
 * the same component serves all three locales and the bodies are transcreated,
 * not translated.
 *
 * Ordering matters: an article about blocking GPTBot in robots.txt should get
 * the crawler checker, not the generic readiness score, even though it will
 * also mention "AI search".
 */
const TOPIC_ROUTES: { target: Exclude<InlineCtaTarget, "signup">; pattern: RegExp; min: number }[] = [
  {
    target: "llms-txt-checker",
    pattern: /llms\.txt|llms-txt|llms_txt/gi,
    min: 3,
  },
  {
    // Distinctive tokens only. An earlier draft also counted "crawler" and
    // "user-agent"; those appear in passing in most AI articles and routed 101
    // of 260 posts here, including "gemini-gems", which is not about crawlers
    // at all. Named bots and robots.txt mean the article really is about
    // crawl access.
    target: "ai-crawler-checker",
    pattern: /robots\.txt|gptbot|oai-searchbot|chatgpt-user|claudebot|claude-searchbot|perplexitybot|google-extended|ccbot|bytespider|meta-externalagent|applebot-extended|amazonbot/gi,
    min: 4,
  },
  {
    target: "query-fanout",
    pattern: /query fan-?out|fan-?out|follow-?up quer|sub-?quer|requête dérivée|éclatement de requête|consulta derivada|abanico de consultas/gi,
    min: 3,
  },
  {
    target: "keyword-to-prompts",
    pattern: /keyword research|keyword volume|search volume|keyword cluster|recherche de mots-?clés|volume de recherche|investigación de palabras clave|volumen de búsqueda/gi,
    min: 3,
  },
]

/**
 * Which tool to pitch mid-article.
 *
 * 1. Commercial intent in our own category → the reader is shopping, send them
 *    to signup (twin-safe via donorSlug).
 * 2. Otherwise route on what the article is about, so the CTA answers the
 *    question the reader is already holding.
 * 3. On a topic route, skip a tool the article ALREADY links — there the CTA
 *    would add nothing the reader can't see in the body.
 * 4. Otherwise fall back to the AI-Readiness score, the broadest "run it on
 *    your own domain" ask. The fallback deliberately does NOT skip an
 *    already-linked readiness page: an in-body link and a visual CTA band are
 *    different weights of ask, and the previous "pitch something else instead"
 *    rule was what pushed 143 articles onto the content-analyzer brochure.
 *
 * Every branch returns a destination that DOES something.
 */
function pickTarget(post: Post): InlineCtaTarget {
  if (isCommercialIntentPost(post)) return "signup"

  const haystack = `${post.slug} ${post.tags.join(" ")} ${post.content}`.toLowerCase()

  for (const route of TOPIC_ROUTES) {
    if (post.content.includes(`/tools/${route.target}`)) continue
    // `pattern` carries the /g flag, so reset lastIndex before every reuse —
    // a shared global regex is stateful and would silently skip matches.
    route.pattern.lastIndex = 0
    const hits = haystack.match(route.pattern)?.length ?? 0
    if (hits >= route.min) return route.target
  }

  return "ai-readiness"
}
