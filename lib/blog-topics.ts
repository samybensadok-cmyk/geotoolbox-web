import type { Post } from "./content"

// ---------------------------------------------------------------------------
// Curated browse taxonomy for the blog index.
//
// Raw frontmatter tags are METADATA (102 of them, mostly one-offs) used for
// related-posts and per-article chips. They are NOT navigation. These ~6
// editorial topics are what the index filters on.
//
// Each post is assigned to exactly ONE primary topic (first match in the order
// below), so counts partition cleanly and no post is double-listed. The order
// is "most specific first" -> the universal "geo"/"ai-visibility" tags only
// matter for the GEO Fundamentals catch-all at the end.
// ---------------------------------------------------------------------------

export type Topic = {
  slug: string
  label: string
  tags: string[]
}

export const TOPICS: Topic[] = [
  {
    slug: "comparisons",
    label: "Comparisons",
    tags: [
      "ai-comparison", "comparison", "agency-vs-software", "chinese-ai-models",
      "claude-vs-chatgpt", "claude-vs-gemini", "gemini-vs-chatgpt",
      "grok-vs-chatgpt", "grok-vs-claude", "grok-vs-gemini", "chatgpt-vs-perplexity",
      "microsoft-copilot-vs-chatgpt", "copilot-vs-chatgpt", "copilot-vs-gemini",
    ],
  },
  {
    slug: "how-ai-works",
    label: "How AI Works",
    tags: [
      "transformer", "tokens", "tokenization", "vector-embeddings", "rag",
      "temperature", "ai-temperature", "llm-temperature", "sampling",
      "constitutional-ai", "content-chunking", "query-fan-out", "ai-mode", "google-ai-mode",
      "how-does-chatgpt-work", "how-does-claude-work",
    ],
  },
  {
    slug: "crawlers-agents",
    label: "Crawlers & Agents",
    tags: [
      "ai-crawlers", "gptbot", "robots-txt", "llms-txt",
      "agentic-ai", "ai-agents", "agent-ready-website", "agentic-browsing",
      "agentic-commerce", "agentic-payments", "what-is-agentic-ai", "x402",
      "ai-browser", "comet", "perplexity-comet",
    ],
  },
  {
    slug: "tools-tracking",
    label: "Tools & Tracking",
    tags: [
      "tools", "measurement", "metrics", "rank-tracking", "audit",
      "share-of-voice", "ai-citation", "ai-overviews", "pricing", "review",
      "link building", "link building platforms", "backlinks", "digital pr",
      "gemini-pricing", "gemini-api", "ai-pricing", "copilot-pricing", "chatgpt-pricing", "claude-pricing",
    ],
  },
  {
    slug: "ai-engines",
    label: "AI Engines",
    tags: [
      "chatgpt", "chatgpt-search", "gemini", "google-gemini", "gemini-ai", "gemini-gems", "gemini-seo", "gemini-omni",
      "claude", "claude-seo", "claude-fable-5", "claude-mythos", "claude-sonnet-5", "sonnet-5",
      "grok", "grok-ai", "grok-5", "grok-5-release-date", "grok-imagine", "xai",
      "perplexity", "deepseek", "deepseek-r1", "kimi-ai", "kimi-k2",
      "moonshot-ai", "qwen", "qwen3", "tongyi-qianwen", "alibaba",
      "glm", "glm-5-2", "zhipu-ai", "z-ai", "openai", "anthropic", "gpt-5-6",
      "copilot", "microsoft-copilot", "copilot-ai", "copilot-seo",
      "copilot-studio", "microsoft-copilot-studio", "copilot-agents",
      "elon-musk", "chinese-ai", "ai-assistant", "ai-news", "open-weights",
      "what-is-claude-ai", "what-is-gemini", "what-is-grok", "what-is-copilot",
      "what-is-deepseek", "what-is-kimi-ai", "what-is-qwen", "what-is-glm-5-2",
    ],
  },
  {
    // Catch-all: foundational GEO/AEO concept posts. Its tag list includes the
    // universal "geo"/"ai-visibility"/"llm" tags so every post that did not
    // match a more specific topic lands here.
    slug: "geo-fundamentals",
    label: "GEO Fundamentals",
    tags: [
      "aeo", "llmo", "llm-seo", "llm", "generative-ai", "eeat",
      "schema-markup", "structured-data", "technical-seo", "content-strategy",
      "content", "writing", "ecommerce", "seo", "checklist", "ai-search",
      "geo", "ai-visibility",
    ],
  },
]

const FALLBACK: Topic = TOPICS[TOPICS.length - 1]

/** The single primary topic a post belongs to (first match, else GEO Fundamentals). */
export function primaryTopic(post: Post): Topic {
  for (const t of TOPICS) {
    if (post.tags.some((tag) => t.tags.includes(tag))) return t
  }
  return FALLBACK
}

export function topicBySlug(slug: string): Topic | undefined {
  return TOPICS.find((t) => t.slug === slug)
}

/** Post count per topic slug, using the mutually-exclusive primary assignment. */
export function topicCounts(posts: Post[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const t of TOPICS) counts[t.slug] = 0
  for (const p of posts) counts[primaryTopic(p).slug]++
  return counts
}
