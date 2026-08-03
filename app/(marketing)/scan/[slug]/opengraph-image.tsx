import { ImageResponse } from "next/og"
import { getSnapshot, clampPct, scoreBand, type ScoreTone } from "@/lib/lgs-public"

/**
 * OG card for a snapshot (/scan/<slug>). Reads the same public projection the
 * page reads and nothing else; any failure, and any scan whose composite was
 * withheld, falls back to a neutral branded card rather than inventing a number.
 */

export const alt = "AI Visibility Snapshot by GEO Toolbox"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const runtime = "nodejs"

const TONE_HEX: Record<ScoreTone, string> = {
  bad: "#be123c",
  mid: "#b45309",
  good: "#0f766e",
}

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await getSnapshot(slug)

  const brand = data?.brand?.replace(/[\r\n\t]+/g, " ").trim().slice(0, 60) || "Your brand"
  const composite =
    data && data.scores.state === "complete" && data.scores.composite != null
      ? clampPct(data.scores.composite)
      : null
  const band = composite != null ? scoreBand(composite) : null
  const accent = band ? TONE_HEX[band.tone] : "#0d9488"

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: "60px 80px",
          background: "#effaf4",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            paddingRight: 40,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "#0d9488",
              }}
            >
              <span style={{ fontSize: 20, fontWeight: 700, color: "#ffffff" }}>G</span>
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, color: "#111827", letterSpacing: "-0.01em" }}>
              GEO Toolbox
            </span>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "#0f766e",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            AI Visibility Snapshot
          </div>
          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              lineHeight: 1.05,
              color: "#111827",
              letterSpacing: "-0.02em",
            }}
          >
            {brand}
          </div>
          <div style={{ fontSize: 22, color: "#4b5563", marginTop: 20, lineHeight: 1.4 }}>
            How ChatGPT, Google AI Overviews, Gemini, and Perplexity answer buying questions in
            this market.
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: "auto",
              fontSize: 15,
              color: "#6b7280",
            }}
          >
            geotoolbox.ai
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 380 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "44px 40px",
              background: "#ffffff",
              border: "1px solid #d3ebde",
              borderRadius: 24,
              boxShadow: "0 20px 60px -20px rgba(15,23,42,0.12)",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: "#6b7280",
                textTransform: "uppercase",
              }}
            >
              AI Visibility
            </div>
            {/* Siblings rather than a fragment: satori walks children directly. */}
            {composite != null ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  fontSize: 128,
                  fontWeight: 700,
                  lineHeight: 1,
                  color: accent,
                  letterSpacing: "-0.04em",
                  marginTop: 10,
                }}
              >
                {composite}
                <span style={{ fontSize: 44, color: "#d1d5db" }}>/100</span>
              </div>
            ) : null}
            {band != null ? (
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
                  fontSize: 18,
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                {band.label}
              </div>
            ) : null}
            {composite == null ? (
              <div
                style={{
                  display: "flex",
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#374151",
                  marginTop: 24,
                  textAlign: "center",
                  lineHeight: 1.3,
                }}
              >
                Measured across four AI engines
              </div>
            ) : null}
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
