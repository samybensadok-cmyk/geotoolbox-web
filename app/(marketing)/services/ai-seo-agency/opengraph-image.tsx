import { ImageResponse } from "next/og"
import { proofStats } from "@/lib/proof-stats"

export const alt = "Done-for-you AI SEO & GEO, run by one specialist"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
  const { google, aiCitations, weeksToResult } = proofStats
  const fmt = (n: number) => n.toLocaleString("en-US")

  const stats = [
    { value: String(google.top3), label: "In Google's top 3" },
    { value: `~${fmt(aiCitations.total)}`, label: "AI citations (Bing WMT)" },
    { value: fmt(google.rankedKeywords), label: "Keywords in Google" },
    { value: `${weeksToResult} wks`, label: "From zero" },
  ]

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
        {/* Left: message */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, paddingRight: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 10, background: "#0d9488" }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: "#ffffff" }}>G</span>
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, color: "#111827", letterSpacing: "-0.01em" }}>GEO Toolbox</span>
          </div>

          <div style={{ display: "flex", fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", color: "#0f766e", textTransform: "uppercase", marginBottom: 14 }}>
            Done-for-you AI SEO &amp; GEO
          </div>
          <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.05, color: "#111827", letterSpacing: "-0.02em" }}>
            If AI doesn&apos;t recommend you, that&apos;s the problem I fix.
          </div>
          <div style={{ fontSize: 20, color: "#4b5563", marginTop: 20, lineHeight: 1.4 }}>
            One specialist. Your pages rebuilt to get cited. Measured monthly.
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto", fontSize: 15, color: "#6b7280" }}>
            geotoolbox.ai/services/ai-seo-agency
          </div>
        </div>

        {/* Right: proof panel */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 420 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              padding: "36px 32px",
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: 24,
              boxShadow: "0 20px 60px -20px rgba(15,23,42,0.12)",
              width: "100%",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: "#6b7280", textTransform: "uppercase" }}>
              My own test domain
            </div>
            {stats.map((s) => (
              <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: 32, fontWeight: 700, color: "#0f766e", letterSpacing: "-0.01em" }}>{s.value}</span>
                <span style={{ fontSize: 14, color: "#6b7280", fontWeight: 500 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
