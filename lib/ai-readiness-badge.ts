/**
 * Shared AI-Readiness badge SVG. Used by the public badge route (live re-score for
 * third-party embeds) AND by the widget's result card, which renders its preview from
 * the score it already holds — the preview must never hit the badge route, because
 * that route re-runs a full scan (the 2026-09-22 double-scan bug).
 */

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

export function badgeSvg(left: string, right: string, color: string): string {
  const lw = 6.6 * left.length + 16
  const rw = 6.6 * right.length + 16
  const w = Math.round(lw + rw)
  const lwR = Math.round(lw)
  const lx = (lwR / 2) * 10
  const rx = (lwR + rw / 2) * 10
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="20" role="img" aria-label="${esc(left)}: ${esc(right)}">
<linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient>
<clipPath id="r"><rect width="${w}" height="20" rx="3" fill="#fff"/></clipPath>
<g clip-path="url(#r)">
<rect width="${lwR}" height="20" fill="#444"/>
<rect x="${lwR}" width="${w - lwR}" height="20" fill="${color}"/>
<rect width="${w}" height="20" fill="url(#s)"/>
</g>
<g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="110" text-rendering="geometricPrecision">
<g transform="scale(.1)">
<text x="${lx}" y="150" fill="#010101" fill-opacity=".3">${esc(left)}</text>
<text x="${lx}" y="140">${esc(left)}</text>
<text x="${rx}" y="150" fill="#010101" fill-opacity=".3">${esc(right)}</text>
<text x="${rx}" y="140">${esc(right)}</text>
</g>
</g>
</svg>`
}

export function badgeColor(pct: number): string {
  return pct >= 80 ? "#2ea44f" : pct >= 40 ? "#dfb317" : "#e05d44"
}
