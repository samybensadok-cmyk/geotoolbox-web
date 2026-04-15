import { ImageResponse } from "next/og"

export const alt = "GEO Scan — 6-engine AI visibility scan"
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
            GEO Scan
          </div>
          <div style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.05, color: "#111827", letterSpacing: "-0.02em" }}>
            See who AI cites for your keywords.
          </div>
          <div style={{ fontSize: 20, color: "#4b5563", marginTop: 20, lineHeight: 1.4 }}>
            One prompt, six engines, every citation &mdash; in minutes.
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto", fontSize: 15, color: "#6b7280" }}>
            geotoolbox.ai/features/geo-scan
          </div>
        </div>

        {/* Right: pulse-dot engine panel */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 420 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              padding: "36px 32px",
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: 24,
              boxShadow: "0 20px 60px -20px rgba(15,23,42,0.12)",
              width: "100%",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: "#6b7280", textTransform: "uppercase" }}>Engines</div>
            {[
              { name: "ChatGPT", cited: true },
              { name: "Perplexity", cited: true },
              { name: "Gemini", cited: false },
              { name: "Claude", cited: true },
              { name: "AI Overviews", cited: true },
              { name: "Bing Copilot", cited: false },
            ].map((e) => (
              <div key={e.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 17 }}>
                <span style={{ color: "#1f2937", fontWeight: 500 }}>{e.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: e.cited ? "#14b8a6" : "transparent", border: e.cited ? "none" : "1.5px solid #d1d5db" }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: e.cited ? "#0f766e" : "#9ca3af", letterSpacing: "0.02em" }}>
                    {e.cited ? "CITED" : "MISS"}
                  </span>
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
