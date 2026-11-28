import { realQuery } from "./query-data"
import s from "./home-v3.module.css"

// The citation orbit: one real buyer question in the middle, the engines around it, and every
// domain each engine cited on the outer ring. Server-rendered SVG; the engine filter is CSS-only
// (radio inputs + :has()), so the section ships no JavaScript.

type EngineId = (typeof realQuery.engines)[number]["id"]
type Copy = {
  filter: string; all: string; question: string; winner: string
  legendWinner: string; legendShared: string; legendNone: string; stamp: string
  engineCount: Record<EngineId, string>; engineBox: Record<EngineId, string>
}

const W = 1160, H = 720, CX = 580, CY = 370, RX = 410, RY = 290
const ENGINE_POS: Record<EngineId, { x: number; y: number }> = {
  chatgpt: { x: 790, y: CY }, claude: { x: 370, y: CY }, aimode: { x: CX, y: 225 }, gemini: { x: CX, y: 515 },
}
const WINNER = "clickup.com" // ChatGPT names ClickUp first and cites clickup.com (query-data.ts)

function domainsOf(id: EngineId) {
  return realQuery.engines.find(e => e.id === id)!.sources.map(x => x.domain)
}
function enginesCiting(domain: string): EngineId[] {
  return realQuery.engines.filter(e => e.sources.some(x => x.domain === domain)).map(e => e.id)
}

// Ring placement: shared domains on top, each engine's own domains on its side of the ring,
// longest labels at the ends of an arc where the ring is narrowest.
function layout() {
  const shared = realQuery.shared as readonly string[]
  const own = (id: EngineId) => [...new Set(domainsOf(id))].filter(d => !shared.includes(d))
  const byLen = (list: string[]) => {
    const sorted = [...list].sort((a, b) => a.length - b.length)
    const out: string[] = []
    sorted.forEach((d, i) => (i % 2 ? out.push(d) : out.unshift(d)))
    return out // short labels in the middle, long ones at both ends
  }
  const spread = (list: string[], from: number, to: number) =>
    list.map((d, i) => ({ d, a: list.length === 1 ? (from + to) / 2 : from + ((to - from) * i) / (list.length - 1) }))
  const right = byLen(own("chatgpt").filter(d => d !== WINNER))
  right.splice(Math.floor(right.length / 2), 0, WINNER)
  const top: { d: string; a: number }[] = []
  const topOrder = [...own("aimode"), ...shared]
  // AI Mode's own domains top-left, shared ones across the top
  topOrder.forEach((d, i) => top.push({ d, a: -112 + (44 * i) / Math.max(1, topOrder.length - 1) }))
  const nodes = [...spread(right, -46, 62), ...spread(byLen(own("claude")), 122, 238), ...top]
  return nodes.map(({ d, a }) => {
    const r = (a * Math.PI) / 180
    const x = CX + RX * Math.cos(r), y = CY + RY * Math.sin(r)
    const side = Math.abs(a + 90) < 8 ? "top" : Math.cos(r) >= 0 ? "right" : "left"
    return { d, x, y, side, engines: enginesCiting(d) }
  })
}
const NODES = layout()

function wrap(text: string, max: number) {
  const lines: string[] = []
  for (const w of text.split(" ")) {
    const last = lines[lines.length - 1]
    if (last && (last + " " + w).length <= max) lines[lines.length - 1] = last + " " + w
    else lines.push(w)
  }
  return lines
}

export function Orbit({ copy }: { copy: Copy }) {
  const engines = realQuery.engines
  const q = wrap(`“${realQuery.prompt}”`, 27)
  return (
    <div className={s.orbitShell} data-reveal="">
      <div className={s.orbitBar}>
        <span className={s.stampChip}><span className={s.stampDot} aria-hidden="true" />{copy.stamp}</span>
        <fieldset className={s.pills}>
          <legend className={s.srOnly}>{copy.filter}</legend>
          <label className={s.pill}><input type="radio" name="orbit-engine" value="all" defaultChecked /><span>{copy.all}</span></label>
          {engines.map(e => (
            <label key={e.id} className={s.pill}>
              <input type="radio" name="orbit-engine" value={e.id} />
              <span>{e.name} ({e.sources.length})</span>
            </label>
          ))}
        </fieldset>
      </div>

      <div className={s.orbitStage}>
        <svg className={s.orbitSvg} viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
          <defs>
            <radialGradient id="orbit-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#cdff00" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#cdff00" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx={CX} cy={CY} rx={RX + 40} ry={RY + 30} fill="url(#orbit-glow)" />
          <ellipse cx={CX} cy={CY} rx={RX} ry={RY} className={s.ring} />
          <ellipse cx={CX} cy={CY} rx={RX * 0.66} ry={RY * 0.66} className={s.ringInner} />
          <ellipse cx={CX} cy={CY} rx={RX * 0.36} ry={RY * 0.36} className={s.ringInner} />

          {NODES.flatMap((n, ni) => n.engines.map(id => (
            <line key={`${id}-${n.d}`} data-e={id} className={n.d === WINNER ? `${s.spoke} ${s.spokeWin}` : s.spoke}
              pathLength={1} style={{ ["--si" as string]: ni }}
              x1={ENGINE_POS[id].x} y1={ENGINE_POS[id].y} x2={n.x} y2={n.y} />
          )))}
          <line className={s.spokeDash} x1={CX} y1={CY + 52} x2={CX} y2={ENGINE_POS.gemini.y - 24} />
          <line className={s.spokeAxis} x1={CX} y1={CY - 52} x2={CX} y2={ENGINE_POS.aimode.y + 24} />
          <line className={s.spokeAxis} x1={CX - 115} y1={CY} x2={ENGINE_POS.claude.x + 75} y2={CY} />
          <line className={s.spokeAxis} x1={CX + 115} y1={CY} x2={ENGINE_POS.chatgpt.x - 75} y2={CY} />

          {NODES.map((n, ni) => {
            const win = n.d === WINNER, shared = n.engines.length > 1
            const anchor = n.side === "right" ? "start" : n.side === "left" ? "end" : "middle"
            const tx = n.side === "right" ? n.x + 14 : n.side === "left" ? n.x - 14 : n.x
            const ty = n.side === "top" ? n.y - 16 : n.y + 4
            return (
              <g key={n.d} data-e={n.engines.join(" ")} className={s.domainNode} style={{ ["--si" as string]: ni }}>
                {win && <circle cx={n.x} cy={n.y} r={16} className={s.winHalo} />}
                <circle cx={n.x} cy={n.y} r={win ? 7 : 5} className={win ? s.nodeWin : shared ? s.nodeShared : s.node} />
                <text x={tx} y={ty} textAnchor={anchor} className={win ? s.labelWin : s.label}>{n.d}</text>
                {win && <text x={tx} y={ty + 17} textAnchor={anchor} className={s.labelTag}>{copy.winner}</text>}
              </g>
            )
          })}

          <g className={s.questionBox}>
            <rect x={CX - 118} y={CY - 56} width={236} height={112} rx={8} />
            <text x={CX} y={CY - 26} textAnchor="middle" className={s.qLabel}>{copy.question.toUpperCase()}</text>
            {q.map((line, i) => <text key={i} x={CX} y={CY - 2 + i * 19} textAnchor="middle" className={s.qText}>{line}</text>)}
          </g>

          {engines.map(e => {
            const p = ENGINE_POS[e.id], none = e.sources.length === 0
            return (
              <g key={e.id} data-e={e.id} className={s.engineNode}>
                <rect x={p.x - 75} y={p.y - 25} width={150} height={50} rx={5} className={none ? s.engineBoxNone : s.engineBox} />
                <text x={p.x} y={p.y - 3} textAnchor="middle" className={s.engineName}>{e.name}</text>
                <text x={p.x} y={p.y + 15} textAnchor="middle" className={s.engineCount}>{copy.engineBox[e.id]}</text>
              </g>
            )
          })}
        </svg>

        {/* The same data as text: visible on phones, read by screen readers everywhere. */}
        <ul className={s.orbitList}>
          {engines.map(e => (
            <li key={e.id} data-e={e.id} className={s.orbitGroup}>
              <p className={s.orbitGroupHead}><strong>{e.name}</strong><span>{copy.engineCount[e.id]}</span></p>
              {e.sources.length ? (
                <ul className={s.chips}>
                  {[...new Set(e.sources.map(x => x.domain))].map(d => (
                    <li key={d} className={d === WINNER ? s.chipWin : enginesCiting(d).length > 1 ? s.chipShared : s.chip}>
                      {d}{d === WINNER ? ` · ${copy.winner}` : ""}
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      </div>

      <div className={s.orbitLegend}>
        <span><i className={s.swWin} aria-hidden="true" />{copy.legendWinner}</span>
        <span><i className={s.swShared} aria-hidden="true" />{copy.legendShared}</span>
        <span><i className={s.swNone} aria-hidden="true" />{copy.legendNone}</span>
      </div>
    </div>
  )
}
