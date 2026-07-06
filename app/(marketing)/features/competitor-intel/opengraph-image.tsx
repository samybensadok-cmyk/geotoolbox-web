import { ImageResponse } from "next/og"

export const alt = "Competitor Intel: see who AI recommends instead of you"
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
            Competitor Intel
          </div>
          <div style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.05, color: "#111827", letterSpacing: "-0.02em" }}>
            See who AI cites instead of you.
          </div>
          <div style={{ fontSize: 20, color: "#4b5563", marginTop: 20, lineHeight: 1.4 }}>
            Co-cited domains. Content gaps. Alerts the day a rival beats you.
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto", fontSize: 15, color: "#6b7280" }}>
            geotoolbox.ai/features/competitor-intel
          </div>
        </div>

        {/* Right: rival comparison card */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 440 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "32px 32px",
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: 24,
              boxShadow: "0 20px 60px -20px rgba(15,23,42,0.12)",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "#6b7280", textTransform: "uppercase" }}>
              AI citation share
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 22 }}>
              {[
                { domain: "acme-corp.com", pct: 18, wins: 3, bg: "#f0fdfa", border: "#ccfbf1", color: "#0f766e" },
                { domain: "rival-one.com", pct: 34, wins: 7, bg: "#fef2f2", border: "#fecaca", color: "#b91c1c" },
                { domain: "rival-two.com", pct: 22, wins: 4, bg: "#f9fafb", border: "#e5e7eb", color: "#4b5563" },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", padding: "14px 16px", background: r.bg, border: `1px solid ${r.border}`, borderRadius: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 14 }}>
                    <span style={{ color: "#111827", fontWeight: 700, fontFamily: "monospace" }}>{r.domain}</span>
                    <span style={{ color: r.color, fontWeight: 700, fontSize: 22 }}>{r.pct}%</span>
                  </div>
                  <div style={{ display: "flex", marginTop: 8, fontSize: 12, color: "#6b7280" }}>
                    {r.wins} new citations this week
                  </div>
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
