import { ImageResponse } from "next/og"

export const alt = "GEO Toolbox — AI Search Analytics"
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
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
          background: "#fefefe",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 10, background: "#0d9488" }}>
            <span style={{ fontFamily: "system-ui, sans-serif", fontSize: 20, fontWeight: 700, color: "#ffffff" }}>G</span>
          </div>
          <span style={{ fontSize: 24, fontWeight: 700, color: "#111827", letterSpacing: "-0.01em" }}>GEO Toolbox</span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.1,
            color: "#111827",
            letterSpacing: "-0.02em",
            maxWidth: 800,
          }}
        >
          See what AI search says about your brand
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 22,
            color: "#6b7280",
            marginTop: 20,
            maxWidth: 600,
            lineHeight: 1.4,
          }}
        >
          Track visibility across ChatGPT, Perplexity, Gemini, Claude, and 3 more AI engines.
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginTop: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#f0fdfa",
              border: "1px solid #ccfbf1",
              borderRadius: 100,
              padding: "6px 16px",
              fontSize: 14,
              color: "#0f766e",
              fontWeight: 600,
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#14b8a6" }} />
            geotoolbox.ai
          </div>
          <span style={{ fontSize: 14, color: "#9ca3af" }}>6 AI engines &middot; Visibility score &middot; Citability analysis</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
