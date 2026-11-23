import { ImageResponse } from "next/og"
import { inflateSync } from "node:zlib"
import { BF } from "@/lib/black-friday"

// Animated "ends in" countdown for the Black Friday emails: an 8-bit grayscale GIF that plays the next
// FRAMES seconds from the moment it is fetched, then holds on the last frame (no loop). Rendered per request
// from BF.endIso and served no-store so a mail proxy never freezes a stale time. No dependencies: digit
// sprites + the static layer come from next/og once per instance, frames are composited and LZW-encoded here.
export const dynamic = "force-dynamic"

const W = 840
const H = 190
const FRAMES = 60
const LBL_W = 0
const TW = 195
const TH = 190
const GAP = 20
const TY = 0
const CELL_W = 70
const CELL_H = 120
const NUM_DX = 27 // digits start 27px inside a tile (2 cells = 140px)
const NUM_DY = 16
const LABELS = ["DAYS", "HRS", "MIN", "SEC"]
const FONT = "system-ui, sans-serif"

type Gray = { w: number; h: number; px: Uint8Array }
type Sprites = { base: Gray; digits: Gray[] }

function decodePng(buf: Buffer): Gray {
  let pos = 8
  let w = 0
  let h = 0
  const idat: Buffer[] = []
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos)
    const type = buf.toString("ascii", pos + 4, pos + 8)
    const data = buf.subarray(pos + 8, pos + 8 + len)
    if (type === "IHDR") {
      w = data.readUInt32BE(0)
      h = data.readUInt32BE(4)
      if (data[8] !== 8 || data[9] !== 6 || data[12] !== 0) throw new Error("unexpected PNG format")
    } else if (type === "IDAT") idat.push(data)
    else if (type === "IEND") break
    pos += 12 + len
  }
  const raw = inflateSync(Buffer.concat(idat))
  const stride = w * 4
  const out = Buffer.alloc(h * stride)
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)]
    const src = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1))
    for (let x = 0; x < stride; x++) {
      const a = x >= 4 ? out[y * stride + x - 4] : 0
      const b = y > 0 ? out[(y - 1) * stride + x] : 0
      const c = x >= 4 && y > 0 ? out[(y - 1) * stride + x - 4] : 0
      let v = src[x]
      if (f === 1) v += a
      else if (f === 2) v += b
      else if (f === 3) v += (a + b) >> 1
      else if (f === 4) {
        const p = a + b - c
        const pa = Math.abs(p - a)
        const pb = Math.abs(p - b)
        const pc = Math.abs(p - c)
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c
      }
      out[y * stride + x] = v & 255
    }
  }
  const px = new Uint8Array(w * h)
  for (let i = 0; i < w * h; i++) px[i] = out[i * 4] // design is pure grayscale, opaque
  return { w, h, px }
}

async function renderGray(el: React.ReactElement, width: number, height: number): Promise<Gray> {
  const res = new ImageResponse(el, { width, height })
  return decodePng(Buffer.from(await res.arrayBuffer()))
}

let spritesPromise: Promise<Sprites> | null = null
function getSprites(): Promise<Sprites> {
  spritesPromise ??= (async () => {
    const tiles = LABELS.map((label, i) => (
      <div
        key={label}
        style={{
          position: "absolute",
          left: LBL_W + i * (TW + GAP),
          top: TY,
          width: TW,
          height: TH,
          display: "flex",
          borderRadius: 18,
          background: "#1c1c1c",
          border: "2px solid #2e2e2e",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 146,
            width: TW - 4,
            display: "flex",
            justifyContent: "center",
            fontSize: 24,
            letterSpacing: 3,
            color: "#b4b4ac",
            fontFamily: FONT,
          }}
        >
          {label}
        </div>
      </div>
    ))
    const baseRaw = await renderGray(
      <div style={{ display: "flex", position: "relative", width: "100%", height: "100%", background: "#0b0b0b" }}>
        {tiles}
      </div>,
      W,
      H,
    )
    const base: Gray = { w: baseRaw.w, h: baseRaw.h, px: baseRaw.px.map((v) => v >> 1) }
    const digits: Gray[] = []
    for (let d = 0; d < 10; d++) {
      const g = await renderGray(
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              background: "#1c1c1c",
              fontSize: 108,
              fontWeight: 700,
              color: "#ffffff",
              fontFamily: FONT,
            }}
          >
            {String(d)}
          </div>,
          CELL_W,
          CELL_H,
        )
      digits.push({ w: g.w, h: g.h, px: g.px.map((v) => 128 + Math.round(Math.max(0, Math.min(1, (v - 28) / 227)) * 127)) })
    }
    return { base, digits }
  })()
  spritesPromise.catch(() => {
    spritesPromise = null
  })
  return spritesPromise
}

function parts(ms: number): string[] {
  const s = Math.max(0, Math.floor(ms / 1000))
  return [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60].map((n) =>
    String(Math.min(n, 99)).padStart(2, "0"),
  )
}

function drawTile(img: Uint8Array, sp: Sprites, tile: number, text: string) {
  for (let j = 0; j < 2; j++) {
    const cell = sp.digits[Number(text[j])]
    const x0 = LBL_W + tile * (TW + GAP) + NUM_DX + j * CELL_W
    const y0 = TY + NUM_DY
    for (let y = 0; y < CELL_H; y++) img.set(cell.px.subarray(y * CELL_W, (y + 1) * CELL_W), (y0 + y) * W + x0)
  }
}

function lzw(idx: Uint8Array): number[] {
  const MIN = 8
  const CLEAR = 1 << MIN
  const EOI = CLEAR + 1
  const bytes: number[] = []
  let cur = 0
  let nbits = 0
  let codeSize = MIN + 1
  let next = EOI + 1
  let dict = new Map<number, number>()
  const emit = (code: number) => {
    cur |= code << nbits
    nbits += codeSize
    while (nbits >= 8) {
      bytes.push(cur & 255)
      cur >>>= 8
      nbits -= 8
    }
  }
  emit(CLEAR)
  let prefix = idx[0]
  for (let i = 1; i < idx.length; i++) {
    const k = idx[i]
    const key = (prefix << 8) | k
    const code = dict.get(key)
    if (code !== undefined) {
      prefix = code
      continue
    }
    emit(prefix)
    if (next === 4096) {
      emit(CLEAR)
      dict = new Map()
      next = EOI + 1
      codeSize = MIN + 1
    } else {
      if (next >= 1 << codeSize) codeSize++
      dict.set(key, next++)
    }
    prefix = k
  }
  emit(prefix)
  emit(EOI)
  if (nbits > 0) bytes.push(cur & 255)
  return bytes
}

function frameBytes(out: number[], data: Uint8Array, x: number, y: number, w: number, h: number) {
  out.push(0x21, 0xf9, 0x04, 0x04, 100, 0, 0, 0) // disposal: keep, delay 1.00 s
  out.push(0x2c, x & 255, x >> 8, y & 255, y >> 8, w & 255, w >> 8, h & 255, h >> 8, 0)
  out.push(8)
  const packed = lzw(data)
  for (let i = 0; i < packed.length; i += 255) {
    const chunk = packed.slice(i, i + 255)
    out.push(chunk.length, ...chunk)
  }
  out.push(0)
}

export async function GET() {
  const sp = await getSprites()
  const left = Math.max(0, Date.parse(BF.endIso) - Date.now())
  const img = new Uint8Array(sp.base.px)
  let prev = parts(left)
  prev.forEach((t, i) => drawTile(img, sp, i, t))

  const out: number[] = [0x47, 0x49, 0x46, 0x38, 0x39, 0x61, W & 255, W >> 8, H & 255, H >> 8, 0xf7, 0, 0]
  for (let i = 0; i < 128; i++) out.push(i * 2, i * 2, i * 2) // 0..127: gray ramp (static layer)
  for (let k = 0; k < 128; k++) {
    // 128..255: tile background -> brand yellow (anti-aliased digits)
    const t = k / 127
    out.push(Math.round(28 + t * 227), Math.round(28 + t * 172), Math.round(28 - t * 28))
  }
  frameBytes(out, img, 0, 0, W, H)

  for (let f = 1; f < FRAMES; f++) {
    const cur = parts(left - f * 1000)
    const changed = cur.map((t, i) => (t !== prev[i] ? i : -1)).filter((i) => i >= 0)
    if (changed.length === 0) {
      prev = cur
      continue
    }
    changed.forEach((i) => drawTile(img, sp, i, cur[i]))
    const first = Math.min(...changed)
    const last = Math.max(...changed)
    const x0 = LBL_W + first * (TW + GAP) + NUM_DX
    const x1 = LBL_W + last * (TW + GAP) + NUM_DX + 2 * CELL_W
    const y0 = TY + NUM_DY
    const sub = new Uint8Array((x1 - x0) * CELL_H)
    for (let y = 0; y < CELL_H; y++) sub.set(img.subarray((y0 + y) * W + x0, (y0 + y) * W + x1), y * (x1 - x0))
    frameBytes(out, sub, x0, y0, x1 - x0, CELL_H)
    prev = cur
  }
  out.push(0x3b)
  return new Response(new Uint8Array(out), {
    headers: { "Content-Type": "image/gif", "Cache-Control": "no-store, max-age=0" },
  })
}
