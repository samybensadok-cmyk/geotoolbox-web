import { ImageResponse } from "next/og"

export const alt = "Domain Overview: AI visibility command center"
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
            Domain Overview
          </div>
          <div style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.05, color: "#111827", letterSpacing: "-0.02em" }}>
            The command center for your AI visibility.
          </div>
          <div style={{ fontSize: 20, color: "#4b5563", marginTop: 20, lineHeight: 1.4 }}>
            Every scan, every citation, every competitor, aggregated.
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto", fontSize: 15, color: "#6b7280" }}>
            geotoolbox.ai/features/domain-overview
          </div>
        </div>

        {/* Right: dark stat tiles */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 420 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "32px 28px",
              background: "#0b1220",
              borderRadius: 24,
              boxShadow: "0 30px 80px -20px rgba(11,18,32,0.5)",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 16, borderBottom: "1px solid #1f2937" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2dd4bf" }} />
              <span style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 600, color: "#ffffff" }}>stubgroup.com</span>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18 }}>
              {[
                { label: "Visibility", value: "72", unit: "/100", trend: "+8" },
                { label: "Cited pages", value: "34", unit: "pages", trend: "+5" },
                { label: "Competitors", value: "12", unit: "domains", trend: "+2" },
                { label: "Co-cited", value: "47", unit: "domains", trend: "+12" },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: 14,
                    background: "rgba(17, 24, 39, 0.5)",
                    border: "1px solid #1f2937",
                    borderRadius: 12,
                    width: "calc(50% - 5px)",
                  }}
                >
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#6b7280", textTransform: "uppercase" }}>{s.label}</span>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 6 }}>
                    <span style={{ fontSize: 26, fontWeight: 700, color: "#ffffff", fontFamily: "monospace" }}>{s.value}</span>
                    <span style={{ fontSize: 11, color: "#6b7280", fontFamily: "monospace" }}>{s.unit}</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#2dd4bf", fontFamily: "monospace", marginTop: 2 }}>{s.trend} wk</span>
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
