import { ImageResponse } from "next/og"

export const alt = "AI Query Fan-Out: the real questions AI asks about your topic"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
  const rows = [
    { q: "best AI SEO tools compared 2026", tag: "FIRED", color: "#0f766e", bg: "#ccfbf1" },
    { q: "how to measure AI visibility", tag: "FIRED", color: "#0f766e", bg: "#ccfbf1" },
    { q: "do AI SEO tools actually work", tag: "RELATED", color: "#4b5563", bg: "#f3f4f6" },
  ]
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: "60px 80px",
          background: "#f1f3fc",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Left: content */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, paddingRight: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 10, background: "#0d9488" }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: "#ffffff" }}>G</span>
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, color: "#111827", letterSpacing: "-0.01em" }}>GEO Toolbox</span>
          </div>

          <div style={{ display: "flex", fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", color: "#0f766e", textTransform: "uppercase", marginBottom: 14 }}>
            AI Query Fan-Out · 4 engines
          </div>
          <div style={{ fontSize: 54, fontWeight: 700, lineHeight: 1.05, color: "#111827", letterSpacing: "-0.02em" }}>
            The real questions AI asks about your topic.
          </div>
          <div style={{ fontSize: 20, color: "#4b5563", marginTop: 20, lineHeight: 1.4 }}>
            Validated fan-out across ChatGPT, Gemini, Perplexity &amp; Grok — with a cross-engine divergence map.
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto", fontSize: 15, color: "#6b7280" }}>
            geotoolbox.ai/features/query-fanout
          </div>
        </div>

        {/* Right: fan-out card */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 440 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "32px 30px",
              background: "#ffffff",
              border: "1px solid #e0e3f3",
              borderRadius: 28,
              boxShadow: "0 30px 80px -28px rgba(30,32,60,0.30)",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", width: 9, height: 9, borderRadius: 999, background: "#14b8a6" }} />
              <div style={{ display: "flex", fontSize: 14, fontWeight: 700, color: "#111827", fontFamily: "monospace" }}>
                seed: best ai seo tool
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 22, marginBottom: 22 }}>
              {[
                { v: "25", l: "QUERIES" },
                { v: "19", l: "CLUSTERS" },
                { v: "4", l: "ENGINES" },
              ].map((s) => (
                <div key={s.l} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#111827", fontFamily: "monospace" }}>{s.v}</div>
                  <div style={{ display: "flex", fontSize: 10, letterSpacing: "0.1em", color: "#6b7280", fontFamily: "monospace", marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, borderTop: "1px solid #f3f4f6", paddingTop: 18 }}>
              {rows.map((r) => (
                <div key={r.q} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ display: "flex", fontSize: 14, color: "#374151", fontFamily: "monospace", flex: 1, overflow: "hidden" }}>{r.q}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: r.color, background: r.bg, borderRadius: 999, padding: "3px 9px" }}>
                    {r.tag}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 22, borderTop: "1px solid #f3f4f6", paddingTop: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "#0f766e", background: "#ccfbf1", borderRadius: 999, padding: "4px 10px", fontFamily: "monospace" }}>
                11 shared
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "#b45309", background: "#fef3c7", borderRadius: 999, padding: "4px 10px", fontFamily: "monospace" }}>
                8 whitespace
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
