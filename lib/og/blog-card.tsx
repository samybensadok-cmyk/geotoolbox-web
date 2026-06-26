import type { Post } from "@/lib/content"

/**
 * Smart-default-by-cluster OG card builder for blog posts (used by
 * app/blog/[slug]/opengraph-image.tsx). Everything is derived from existing
 * frontmatter + the post's H2 headings — no per-post authoring required.
 *
 * Cluster → panel treatment:
 *   comparison  ("X vs Y")        → dimension list  ("What we compare")
 *   concept     ("What is…/How…") → numbered section TOC ("Inside this guide")
 *   commercial  ("Best…/…tools")  → check-dot list  ("What's covered")
 *   default     (everything else) → section list, or title-only if <2 headings
 *
 * Styles are kept within the satori CSS subset (flexbox + linear-gradient +
 * boxShadow only) so this renders identically to the HTML design prototype.
 */

export type Cluster = "comparison" | "concept" | "commercial" | "default"

export type CardData = {
  cluster: Cluster
  headline: string
  sub: string
  kicker: string
  panelHeader: string
  items: string[]
  meta: string
}

const C = {
  bg: "#fdfbf4",
  ink: "#111827",
  teal: "#0d9488",
  teal2: "#14b8a6",
  teal3: "#5eead4",
  tealDark: "#0f766e",
  body: "#1f2937",
  sub: "#5b6470",
  muted: "#9aa0a6",
  panelBorder: "#e7e2d3",
  pillBg: "#f0fdfa",
  pillBorder: "#ccfbf1",
}

const KICKER: Record<Cluster, string> = {
  comparison: "AI Comparison",
  concept: "Guide",
  commercial: "Tools & Reviews",
  default: "GEO Toolbox",
}
const PANEL_HEADER: Record<Cluster, string> = {
  comparison: "What we compare",
  concept: "Inside this guide",
  commercial: "What's covered",
  default: "Inside this guide",
}

const GENERIC_H2 =
  /(frequently asked|^faqs?\b|conclusion|bottom line|final thoughts|key takeaways|takeaways|^sources|further reading|tl;?dr|^summary$|wrapping up|what'?s next|^get started|the verdict|at a glance)/i

export function classifyCluster(post: Pick<Post, "slug" | "title" | "tags">): Cluster {
  const slug = (post.slug || "").toLowerCase()
  const title = (post.title || "").toLowerCase()
  const tags = (post.tags || []).map((t) => t.toLowerCase())
  if (/(^|[-\s])vs\.?([-\s]|$)/.test(slug) || /\bvs\.?\b/.test(title) || tags.some((t) => /comparison/.test(t)))
    return "comparison"
  if (
    /^best[-\s]|^top[-\s]|alternativ|pricing|review|[-\s]tools(\b|$)/.test(slug) ||
    /\bbest\b|alternativ|pricing|review|\btools\b/.test(title) ||
    tags.some((t) => /(tools|pricing|review|alternatives)/.test(t))
  )
    return "commercial"
  if (
    /^(what-is|what-are|how-does|how-do|how-to|why-)/.test(slug) ||
    /^(what is|what are|how does|how do|how to|why )/.test(title) ||
    tags.some((t) => /guide/.test(t))
  )
    return "concept"
  return "default"
}

function cleanHeadline(title: string): string {
  let t = (title || "").replace(/\s*\([^)]*\)\s*/g, " ") // drop (parentheticals)
  t = t.split(/\s*[:—–|]\s*/)[0] // cut at subtitle separators
  const q = t.search(/[?!]/) // keep through a trailing question/exclamation
  if (q !== -1) t = t.slice(0, q + 1)
  t = t.replace(/\s+([?!.,;:])/g, "$1").replace(/\s+/g, " ").trim() // no space before punctuation
  return t || (title || "").trim()
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s
  const cut = s.slice(0, n)
  const sp = cut.lastIndexOf(" ")
  return (sp > n * 0.6 ? cut.slice(0, sp) : cut).replace(/[\s,;:.\-]+$/, "") + "…"
}

function monthYear(d: string): string {
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return ""
  return dt.toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

export function deriveCardData(
  post: Pick<Post, "slug" | "title" | "tags" | "description" | "date" | "updated" | "readingTime">,
  h2s: string[],
): CardData {
  const cluster = classifyCluster(post)
  const my = monthYear(post.updated || post.date)
  const headline = cleanHeadline(post.title)
  const hkey = headline.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 16)
  const items = h2s
    .filter((t) => t && !GENERIC_H2.test(t))
    .filter((t) => t.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 16) !== hkey) // drop an H2 that just restates the title
    .slice(0, cluster === "concept" ? 4 : 5)
    .map((t) => truncate(t, 38))
  return {
    cluster,
    headline,
    sub: truncate((post.description || "").replace(/\s+/g, " ").trim(), 92),
    kicker: [KICKER[cluster], my].filter(Boolean).join("  ·  "),
    panelHeader: PANEL_HEADER[cluster],
    items,
    meta: post.readingTime ? `${post.readingTime} min read` : "geotoolbox.ai",
  }
}

function headlineSize(headline: string): number {
  const L = headline.length
  if (L <= 14) return 92
  if (L <= 20) return 78
  if (L <= 30) return 62
  if (L <= 44) return 52
  return 46
}

function PanelItems({ cluster, items }: { cluster: Cluster; items: string[] }) {
  if (cluster === "concept") {
    const shades = [C.teal, C.teal2, C.teal3, C.teal]
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {items.map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 15 }}>
            <div
              style={{
                display: "flex",
                width: 36,
                height: 36,
                borderRadius: 18,
                background: shades[i % shades.length],
                color: i === 2 ? "#06403b" : "#ffffff",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              {i + 1}
            </div>
            <div style={{ display: "flex", fontSize: 18, color: C.body, fontWeight: 500 }}>{t}</div>
          </div>
        ))}
      </div>
    )
  }
  const filled = cluster === "commercial"
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: filled ? 15 : 14 }}>
      {items.map((t, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 13 }}>
          <div style={{ display: "flex", width: filled ? 9 : 8, height: filled ? 9 : 8, borderRadius: 6, background: C.teal2 }} />
          <div style={{ display: "flex", fontSize: 18, color: C.body, fontWeight: filled ? 600 : 500 }}>{t}</div>
        </div>
      ))}
    </div>
  )
}

export function buildBlogCard(d: CardData) {
  const showPanel = d.items.length >= 2
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: C.bg,
        fontFamily: "DM Sans",
      }}
    >
      <div style={{ display: "flex", height: 8, width: "100%", background: `linear-gradient(90deg, ${C.teal} 0%, ${C.teal2} 50%, ${C.teal3} 100%)` }} />
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "54px 80px" }}>
        {/* brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
          <div style={{ display: "flex", width: 44, height: 44, borderRadius: 11, background: C.teal, alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "flex", color: "#fff", fontSize: 23, fontWeight: 700 }}>G</div>
          </div>
          <div style={{ display: "flex", fontSize: 23, fontWeight: 700, color: C.ink, letterSpacing: "-0.01em" }}>GEO Toolbox</div>
        </div>

        {/* main */}
        <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 48 }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", gap: 16 }}>
            <div style={{ display: "flex", fontFamily: "DM Mono", fontSize: 15, fontWeight: 500, letterSpacing: "0.14em", color: C.tealDark }}>
              {d.kicker.toUpperCase()}
            </div>
            <div style={{ display: "flex", fontFamily: "Instrument Serif", fontSize: headlineSize(d.headline), color: C.ink, lineHeight: 1.0, letterSpacing: "-0.01em" }}>
              {d.headline}
            </div>
            {d.sub ? <div style={{ display: "flex", fontSize: 22, color: C.sub, lineHeight: 1.4, maxWidth: showPanel ? 430 : 760 }}>{d.sub}</div> : null}
          </div>

          {showPanel ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: 430,
                gap: 16,
                background: "#ffffff",
                border: `1px solid ${C.panelBorder}`,
                borderRadius: 24,
                padding: 32,
                boxShadow: "0 24px 70px -28px rgba(15,23,42,0.22)",
              }}
            >
              <div style={{ display: "flex", fontFamily: "DM Mono", fontSize: 12, fontWeight: 500, letterSpacing: "0.12em", color: C.muted }}>
                {d.panelHeader.toUpperCase()}
              </div>
              <PanelItems cluster={d.cluster} items={d.items} />
            </div>
          ) : null}
        </div>

        {/* foot */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.pillBg, border: `1px solid ${C.pillBorder}`, borderRadius: 100, padding: "7px 16px", fontSize: 15, fontWeight: 600, color: C.tealDark }}>
            <div style={{ display: "flex", width: 7, height: 7, borderRadius: 4, background: C.teal2 }} />
            geotoolbox.ai/blog
          </div>
          <div style={{ display: "flex", fontSize: 15, color: C.muted }}>{d.meta}</div>
        </div>
      </div>
    </div>
  )
}
