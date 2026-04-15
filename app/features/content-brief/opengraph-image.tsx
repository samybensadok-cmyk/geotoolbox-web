import { ImageResponse } from "next/og"

export const alt = "Content Brief & Draft: answer-first outlines AI engines cite"
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
            Content Brief &amp; Draft
          </div>
          <div style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.05, color: "#111827", letterSpacing: "-0.02em" }}>
            Briefs AI engines actually quote.
          </div>
          <div style={{ fontSize: 20, color: "#4b5563", marginTop: 20, lineHeight: 1.4 }}>
            Framework-aware outline. Entity checklist. Structure + AI Readiness scores.
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto", fontSize: 15, color: "#6b7280" }}>
            geotoolbox.ai/features/content-brief
          </div>
        </div>

        {/* Right: brief outline card */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 420 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "32px 32px",
              background: "#fdfbf4",
              border: "1px solid #e7e2d3",
              borderRadius: 24,
              boxShadow: "0 20px 60px -20px rgba(15,23,42,0.12)",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "#6b7280", textTransform: "uppercase" }}>
              Brief outline
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginTop: 10, letterSpacing: "-0.01em" }}>
              best crm for small business
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 22 }}>
              {[
                { label: "H1", text: "Direct answer (30 words)", done: true },
                { label: "H2", text: "Criteria for choosing", done: true },
                { label: "H2", text: "Top 5 options compared", done: true },
                { label: "H2", text: "Pricing + migration", done: false },
                { label: "H2", text: "FAQs for AI pick-up", done: false },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15 }}>
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 26, height: 20, borderRadius: 5, background: r.done ? "#0f766e" : "#d6d3c6", color: "#fff", fontFamily: "monospace", fontSize: 11, fontWeight: 700 }}>{r.label}</span>
                  <span style={{ color: r.done ? "#111827" : "#9ca3af", fontWeight: r.done ? 600 : 500, flex: 1 }}>{r.text}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", marginTop: 22, paddingTop: 16, borderTop: "1px solid #e7e2d3", fontSize: 13, color: "#6b7280", justifyContent: "space-between" }}>
              <span>Structure</span>
              <span style={{ color: "#0f766e", fontWeight: 700 }}>92</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
