import { ImageResponse } from "next/og"
import { siteConfig } from "@/lib/config"

/**
 * OG card for a shared AI-Readiness report (/r/<id>). Engineered for the screenshot-
 * share loop: "yourdomain.com — AI-Readiness 80% · A". Reads the stored report; any
 * failure falls back to a neutral branded card (never a broken image).
 */

export const alt = "AI-Readiness report — GEO Toolbox"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const runtime = "nodejs"

interface ReportRecord {
  success?: boolean
  host?: string
  report?: { composite?: { pct?: number; grade?: string }; coverage?: { free_checks?: number; total_checks?: number } }
}

async function getReport(id: string): Promise<ReportRecord | null> {
  try {
    const res = await fetch(`${siteConfig.url}/api/ai_readiness_report.php?id=${encodeURIComponent(id)}`, { cache: "no-store" })
    if (!res.ok) return null
    const data = (await res.json()) as ReportRecord
    if (!data?.success) return null
    return data
  } catch {
    return null
  }
}

function gradeBg(grade?: string): string {
  switch (grade) {
    case "A": return "#0f766e"
    case "B": return "#0d9488"
    case "C": return "#b45309"
    case "D": return "#c2410c"
    default: return "#b91c1c"
  }
}

export default async function OGImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getReport(id)
  const host = data?.host ?? "your site"
  const pct = data?.report?.composite?.pct
  const grade = data?.report?.composite?.grade ?? "—"
  const cov = data?.report?.coverage
  const accent = gradeBg(grade)
  const pctLabel = pct != null ? `${pct}` : "—"

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: "60px 80px",
          background: "#eef1f5",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Left: content */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, paddingRight: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 10, background: "#0d9488" }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: "#ffffff" }}>G</span>
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, color: "#111827", letterSpacing: "-0.01em" }}>GEO Toolbox</span>
          </div>

          <div style={{ display: "flex", fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", color: "#0f766e", textTransform: "uppercase", marginBottom: 16 }}>
            AI-Readiness Score
          </div>
          <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.05, color: "#111827", letterSpacing: "-0.02em" }}>
            {host}
          </div>
          <div style={{ fontSize: 22, color: "#4b5563", marginTop: 20, lineHeight: 1.4 }}>
            {cov?.free_checks != null && cov?.total_checks != null
              ? `Foundations an AI agent needs — ${cov.free_checks} of ${cov.total_checks} checks.`
              : "The foundations an AI agent needs to reach and read a site."}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto", fontSize: 15, color: "#6b7280" }}>
            geotoolbox.ai/tools/ai-readiness
          </div>
        </div>

        {/* Right: score card */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 380 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "44px 40px",
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: 24,
              boxShadow: "0 20px 60px -20px rgba(15,23,42,0.12)",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: "#6b7280", textTransform: "uppercase" }}>
              AI-Readiness
            </div>
            <div style={{ display: "flex", alignItems: "baseline", fontSize: 128, fontWeight: 700, lineHeight: 1, color: accent, letterSpacing: "-0.04em", marginTop: 10 }}>
              {pctLabel}<span style={{ fontSize: 52, color: "#d1d5db" }}>%</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 22,
                padding: "8px 22px",
                borderRadius: 999,
                background: accent,
                color: "#ffffff",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              Grade {grade}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
