import { ImageResponse } from "next/og"

export const alt = "Ask GeoToolBox: AI analyst chat over your own AI visibility data"
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
          background: "#fdfbf4",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, paddingRight: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 10, background: "#0d9488" }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: "#ffffff" }}>G</span>
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, color: "#111827", letterSpacing: "-0.01em" }}>GEO Toolbox</span>
          </div>

          <div style={{ display: "flex", fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", color: "#92400e", textTransform: "uppercase", marginBottom: 14 }}>
            Ask GeoToolBox
          </div>
          <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.05, color: "#111827", letterSpacing: "-0.02em" }}>
            Stop digging through dashboards. Just ask.
          </div>
          <div style={{ fontSize: 20, color: "#4b5563", marginTop: 20, lineHeight: 1.4 }}>
            An AI analyst that answers from your own tracked visibility data — with the report behind every claim.
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto", fontSize: 15, color: "#6b7280" }}>
            geotoolbox.ai/features/ask-geotoolbox
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 420 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "36px 32px",
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: 24,
              boxShadow: "0 20px 60px -20px rgba(15,23,42,0.12)",
              width: "100%",
            }}
          >
            <div style={{ fontSize: 13, color: "#6b7280", fontFamily: "monospace" }}>geotoolbox.ai</div>
            <div style={{ display: "flex", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "#6b7280", textTransform: "uppercase", marginTop: 18 }}>
              Ask a question
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20 }}>
              {[
                { label: "Why did citations drop?", value: "Movers report", color: "#15803d", bg: "#dcfce7" },
                { label: "Who cites us less?", value: "Gap analysis", color: "#a16207", bg: "#fef9c3" },
                { label: "Fix first?", value: "Action cards", color: "#4338ca", bg: "#e0e7ff" },
              ].map((r) => (
                <div key={r.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: r.color, background: r.bg, borderRadius: 999, padding: "4px 12px" }}>
                    {r.label}
                  </div>
                  <div style={{ display: "flex", fontSize: 14, color: "#4b5563" }}>{r.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
