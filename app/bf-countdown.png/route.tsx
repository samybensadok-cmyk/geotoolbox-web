import { ImageResponse } from "next/og"
import { BF } from "@/lib/black-friday"

// Live "ends in" tile image for the Black Friday emails. Rendered per request from BF.endIso so the
// number is right whenever the email is opened. No-store: mail proxies must not freeze a stale time.
export const dynamic = "force-dynamic"

const W = 560
const H = 132

export async function GET() {
  const left = Math.max(0, Date.parse(BF.endIso) - Date.now())
  const tiles: Array<[number, string]> = [
    [Math.floor(left / 86_400_000), "DAYS"],
    [Math.floor((left % 86_400_000) / 3_600_000), "HRS"],
    [Math.floor((left % 3_600_000) / 60_000), "MIN"],
  ]
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          paddingLeft: 10,
          background: "#0b0b0b",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 15, letterSpacing: 2, color: "#9a9a94", fontWeight: 700, marginRight: 20 }}>
          ENDS IN
        </div>
        {tiles.map(([n, label]) => (
          <div
            key={label}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: 104,
              height: 104,
              marginRight: 12,
              borderRadius: 12,
              background: "#1c1c1c",
              border: "1px solid #2e2e2e",
            }}
          >
            <div style={{ display: "flex", fontSize: 54, fontWeight: 700, color: "#ffffff" }}>{String(n).padStart(2, "0")}</div>
            <div style={{ display: "flex", fontSize: 13, letterSpacing: 1.5, color: "#9a9a94", marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>
    ),
    { width: W, height: H, headers: { "Cache-Control": "no-store, max-age=0" } },
  )
}
