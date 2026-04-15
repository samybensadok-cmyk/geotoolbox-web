import { ImageResponse } from "next/og"

export const alt = "Analytics: GSC + GA4 dashboard for AI search"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
  const bars = [32, 48, 41, 55, 60, 64, 72, 68, 75, 82, 78, 88]
  const maxBar = Math.max(...bars)

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
            Analytics
          </div>
          <div style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.05, color: "#111827", letterSpacing: "-0.02em" }}>
            The dashboard for AI search.
          </div>
          <div style={{ fontSize: 20, color: "#4b5563", marginTop: 20, lineHeight: 1.4 }}>
            GSC + GA4, rebuilt around AI citations. Quick wins, content decay, click share.
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto", fontSize: 15, color: "#6b7280" }}>
            geotoolbox.ai/features/analytics
          </div>
        </div>

        {/* Right: metric card with sparkline */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 440 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "36px 32px",
              background: "#f5f8fc",
              border: "1px solid #dce4ee",
              borderRadius: 24,
              boxShadow: "0 20px 60px -20px rgba(15,23,42,0.12)",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "#6b7280", textTransform: "uppercase" }}>
              AI visibility score
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 8 }}>
              <span style={{ fontSize: 96, fontWeight: 700, color: "#0f766e", letterSpacing: "-0.04em", lineHeight: 1, fontFamily: "monospace" }}>72</span>
              <span style={{ fontSize: 20, color: "#6b7280", fontFamily: "monospace" }}>/100</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginTop: 24, height: 80 }}>
              {bars.map((v, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    borderRadius: 3,
                    background: "#0d9488",
                    opacity: 0.35 + (i / bars.length) * 0.6,
                    height: `${(v / maxBar) * 100}%`,
                  }}
                />
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 18, fontSize: 13, color: "#6b7280" }}>
              <span>12 weeks</span>
              <span style={{ color: "#15803d", fontWeight: 700 }}>+24 points</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
