import { ImageResponse } from "next/og"

export const alt = "Community: where Reddit, Quora, and forums cite your brand"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: "60px 80px",
          background: "#fefefe",
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
            Community Insights
          </div>
          <div style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.05, color: "#111827", letterSpacing: "-0.02em" }}>
            Where AI learns about your brand.
          </div>
          <div style={{ fontSize: 20, color: "#4b5563", marginTop: 20, lineHeight: 1.4 }}>
            Reddit, Quora, forum threads already cited by AI engines. Build presence where they&apos;re reading.
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto", fontSize: 15, color: "#6b7280" }}>
            geotoolbox.ai/features/community
          </div>
        </div>

        {/* Right: thread cards with citation pulses */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 440 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "28px 28px",
              background: "#fdf8f3",
              border: "1px solid #ebe0d1",
              borderRadius: 24,
              boxShadow: "0 20px 60px -20px rgba(15,23,42,0.12)",
              width: "100%",
              gap: 14,
            }}
          >
            <div style={{ display: "flex", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "#6b7280", textTransform: "uppercase", marginBottom: 2 }}>
              Cited threads
            </div>

            {[
              { source: "r/SaaS", snippet: "best cold calling tools for small teams?", cited: 12, engine: "Perplexity" },
              { source: "quora.com", snippet: "Which CRM integrates with Gmail well?", cited: 8, engine: "ChatGPT" },
              { source: "r/smallbusiness", snippet: "honest review of acme's onboarding", cited: 6, engine: "Claude" },
            ].map((t, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "14px 16px",
                  background: "#ffffff",
                  border: "1px solid #ebe0d1",
                  borderRadius: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, color: "#6b7280", fontFamily: "monospace" }}>
                  <span>{t.source}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ display: "flex", width: 8, height: 8, borderRadius: "50%", background: "#0d9488" }} />
                    <span style={{ color: "#0f766e", fontWeight: 700 }}>{t.engine}</span>
                  </div>
                </div>
                <div style={{ display: "flex", fontSize: 15, color: "#111827", fontWeight: 600, marginTop: 6 }}>
                  {t.snippet}
                </div>
                <div style={{ display: "flex", fontSize: 12, color: "#92400e", marginTop: 4 }}>
                  cited {t.cited}&times; this month
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
