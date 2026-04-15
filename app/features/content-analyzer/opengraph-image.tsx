import { ImageResponse } from "next/og"

export const alt = "Content Analyzer — page-level AI citability audit"
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
            Content Analyzer
          </div>
          <div style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.05, color: "#111827", letterSpacing: "-0.02em" }}>
            Grade any page A&ndash;F for AI citability.
          </div>
          <div style={{ fontSize: 20, color: "#4b5563", marginTop: 20, lineHeight: 1.4 }}>
            19 signals. Clarity, Authority, Access. In under 60 seconds.
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto", fontSize: 15, color: "#6b7280" }}>
            geotoolbox.ai/features/content-analyzer
          </div>
        </div>

        {/* Right: grade card */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 420 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "40px 36px",
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: 24,
              boxShadow: "0 20px 60px -20px rgba(15,23,42,0.12)",
              width: "100%",
            }}
          >
            <div style={{ fontSize: 13, color: "#6b7280", fontFamily: "monospace" }}>stubgroup.com/ai-seo</div>
            <div style={{ display: "flex", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "#6b7280", textTransform: "uppercase", marginTop: 18 }}>
              Citability grade
            </div>
            <div style={{ fontSize: 140, fontWeight: 700, lineHeight: 1, color: "#0f766e", letterSpacing: "-0.04em", marginTop: 4 }}>
              B+
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 22 }}>
              {[
                { label: "Clarity", score: "4.2" },
                { label: "Authority", score: "3.1" },
                { label: "Access", score: "4.8" },
              ].map((r) => (
                <div key={r.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 15, padding: "4px 0" }}>
                  <span style={{ color: "#374151", fontWeight: 600 }}>{r.label}</span>
                  <span style={{ color: "#0f766e", fontWeight: 700 }}>{r.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
