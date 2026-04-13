import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#111827",
          borderRadius: 40,
        }}
      >
        <span
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 80,
            color: "#14b8a6",
          }}
        >
          G
        </span>
      </div>
    ),
    { ...size }
  )
}
