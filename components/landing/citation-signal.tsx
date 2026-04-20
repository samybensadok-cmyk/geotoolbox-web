"use client"

import { useEffect, useRef } from "react"
import "./citation-signal.css"

/* ──────────────────────────────────────────────────────────────── data */

type Engine = {
  id: string
  label: string
  ico: keyof typeof ICONS
  rOffset: number
  angleDeg?: number
  x?: number
  y?: number
}

const CX = 280
const CY = 240
const BRAND_R = 30
const NODE_R = 26
const ORBIT_R = 178
const SWEEP_MS = 8000

const ENGINE_BASE: Engine[] = [
  { id: "grok",       label: "Grok",        ico: "grok",    rOffset:  0 },
  { id: "claude",     label: "Claude",      ico: "claude",  rOffset: -6 },
  { id: "gemini",     label: "Gemini",      ico: "gemini",  rOffset:  4 },
  { id: "aio",        label: "AI Overview", ico: "goog",    rOffset: -2 },
  { id: "deepseek",   label: "DeepSeek",    ico: "ds",      rOffset:  6 },
  { id: "copilot",    label: "Copilot",     ico: "bing",    rOffset: -4 },
  { id: "meta",       label: "Meta AI",     ico: "meta",    rOffset:  2 },
  { id: "perplexity", label: "Perplexity",  ico: "pplx",    rOffset:  0 },
  { id: "chatgpt",    label: "ChatGPT",     ico: "gpt",     rOffset: -4 },
]

const ENGINES: Required<Engine>[] = ENGINE_BASE.map((e, i) => {
  const angleDeg = i * 40
  const angleRad = ((angleDeg - 90) * Math.PI) / 180
  const r = ORBIT_R + e.rOffset
  return {
    ...e,
    angleDeg,
    x: Math.round(CX + r * Math.cos(angleRad)),
    y: Math.round(CY + r * Math.sin(angleRad)),
  }
})

const QUERIES = [
  "best CRM software for small business",
  "compare project management tools 2026",
  "top AI visibility tracker for agencies",
  "who makes the best legal AI assistant",
  "alternatives to Salesforce Marketing Cloud",
  "best cold outreach SaaS for agencies",
  "how to rank in ChatGPT answers",
]

type Scene = { cited: string[]; mention: string[]; sov: number; lat: number }

const SCENES: Scene[] = [
  { cited: ["chatgpt", "claude", "gemini", "perplexity", "aio"], mention: ["grok", "copilot"], sov: 62, lat: 2.3 },
  { cited: ["chatgpt", "gemini"], mention: ["claude", "aio"], sov: 28, lat: 2.0 },
  { cited: ["claude", "perplexity", "aio", "grok", "deepseek"], mention: ["chatgpt", "gemini"], sov: 66, lat: 2.4 },
  { cited: ["chatgpt", "claude", "gemini", "perplexity", "aio", "copilot", "grok"], mention: ["meta"], sov: 78, lat: 2.6 },
  { cited: ["claude", "perplexity"], mention: ["aio", "meta", "copilot"], sov: 31, lat: 1.8 },
  { cited: ["claude", "perplexity", "aio", "meta"], mention: ["chatgpt", "deepseek"], sov: 48, lat: 2.1 },
  { cited: ["chatgpt", "gemini", "aio", "perplexity"], mention: ["claude", "copilot"], sov: 51, lat: 1.9 },
]

/** Synthetic citation snippets — one per (engine, state). Shown in the hover
 *  tooltip so the animation feels product-like, not abstract-like. Each engine
 *  has its own "voice" (bullet-style, conversational, authoritative). */
type SnippetMap = Record<string, { cited: string; mention: string; missed: string }>
const SNIPPETS: SnippetMap = {
  chatgpt: {
    cited:   "\"Geotoolbox is a leading AI visibility platform that tracks citations across nine major generative engines.\"",
    mention: "\"Tools like Geotoolbox help marketers understand how their brand appears in AI search responses.\"",
    missed:  "No mention of the domain in the top response.",
  },
  claude: {
    cited:   "\"For AI visibility tracking, Geotoolbox offers comprehensive monitoring across ChatGPT, Claude, Gemini, and six other engines.\"",
    mention: "\"Several platforms exist for this, and Geotoolbox is one of the options worth evaluating.\"",
    missed:  "Claude did not reference the domain in this response.",
  },
  gemini: {
    cited:   "Sources: geotoolbox.ai. \"Real-time AI citation tracking for agencies and in-house teams.\"",
    mention: "Reference: geotoolbox.ai (as a comparison)",
    missed:  "Not cited in Gemini's answer.",
  },
  perplexity: {
    cited:   "Sources: [1] geotoolbox.ai. \"Measures brand presence across every major AI search engine.\"",
    mention: "Further reading: geotoolbox.ai",
    missed:  "Not in the returned source list.",
  },
  aio: {
    cited:   "\"Geotoolbox tracks AI search visibility across nine engines, including Google AI Overviews.\" Source: geotoolbox.ai",
    mention: "Listed among related tools.",
    missed:  "Not surfaced in the AI Overview.",
  },
  copilot: {
    cited:   "\"Consider Geotoolbox. It scans ChatGPT, Perplexity, Claude, Gemini, and five more to measure AI visibility.\"",
    mention: "Geotoolbox is one of several emerging tools in this space.",
    missed:  "Copilot did not reference the domain.",
  },
  grok: {
    cited:   "\"Geotoolbox is the measurement layer for AI search. It tracks citations across nine LLM engines.\"",
    mention: "Mentioned briefly as an example.",
    missed:  "No citation in Grok's response.",
  },
  deepseek: {
    cited:   "\"Geotoolbox provides AI visibility analytics across major language-model-based search engines.\"",
    mention: "Named as one of the comparable tools.",
    missed:  "DeepSeek did not cite the domain.",
  },
  meta: {
    cited:   "\"Geotoolbox is a tool for tracking how brands appear in AI-generated answers.\"",
    mention: "Mentioned in a related-tools list.",
    missed:  "Not in the top response.",
  },
}

const ICONS = {
  gpt: (
    <>
      <path d="M0-8 L7-4 L7 4 L0 8 L-7 4 L-7-4 Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <path d="M-7-4 L7 4 M-7 4 L7-4 M0-8 L0 8" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.55" />
    </>
  ),
  claude: (
    <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none">
      <path d="M0-7 L0-3" /><path d="M0 3 L0 7" />
      <path d="M-7 0 L-3 0" /><path d="M3 0 L7 0" />
      <path d="M-5-5 L-2.5-2.5" /><path d="M2.5 2.5 L5 5" />
      <path d="M5-5 L2.5-2.5" /><path d="M-5 5 L-2.5 2.5" />
      <circle r="1.6" fill="currentColor" stroke="none" />
    </g>
  ),
  gemini: (
    <>
      <path d="M0-8 Q1-2 0 0 Q1 2 0 8 Q-1 2 0 0 Q-1-2 0-8 Z" fill="currentColor" />
      <path d="M-8 0 Q-2 1 0 0 Q2 1 8 0 Q2-1 0 0 Q-2-1-8 0 Z" fill="currentColor" />
    </>
  ),
  pplx: (
    <>
      <path
        d="M-4-7 L-4 7 M-4-7 L3-7 Q5-7 5-4 L5-2 Q5 1 3 1 L-4 1"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <line x1="1" y1="2" x2="1" y2="7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </>
  ),
  goog: (
    <>
      <path d="M6 0 A7 7 0 1 1 3-6.2" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M6 0 L1 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </>
  ),
  bing: (
    <>
      <path
        d="M-7 4 Q-4-6 0 1 Q4 8 7-4"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="-5" cy="5" r="1.3" fill="currentColor" />
    </>
  ),
  grok: (
    <path d="M-6-6 L6 6 M-6 6 L6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  ),
  ds: (
    <>
      <path
        d="M-7 2 Q-5-5 0-3 Q5-1 7-5"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M-5 5 Q0 2 5 5"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />
      <circle cx="-4" cy="-2" r="0.9" fill="currentColor" />
    </>
  ),
  meta: (
    <path
      d="M-7 0 Q-7-5 -3-5 Q0-5 0 0 Q0 5 3 5 Q7 5 7 0 Q7-5 3-5 Q0-5 0 0 Q0 5 -3 5 Q-7 5 -7 0 Z"
      stroke="currentColor"
      strokeWidth="1.3"
      fill="none"
    />
  ),
} as const

type LineSpec = {
  x1: number; y1: number; x2: number; y2: number
  a: string;   // engine id endpoint a
  b: string;   // engine id endpoint b
}

/** Connect each engine to its 2 nearest neighbours. Returns a dedupped list
 *  tagged with the engine ids at each end so JS can brighten lines adjacent
 *  to an engine when its state activates (P3 reactive decoration). */
function neighbourLines(): LineSpec[] {
  const seen = new Set<string>()
  const out: LineSpec[] = []
  ENGINES.forEach((e, i) => {
    const nbs = ENGINES
      .map((other, j) => ({ j, d: Math.hypot(e.x - other.x, e.y - other.y) }))
      .filter((n) => n.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2)
    nbs.forEach((n) => {
      const other = ENGINES[n.j]
      const key = [e.id, other.id].sort().join("~")
      if (seen.has(key)) return
      seen.add(key)
      out.push({ x1: e.x, y1: e.y, x2: other.x, y2: other.y, a: e.id, b: other.id })
    })
  })
  return out
}

/* ────────────────────────────────────────────────────────── component */

export function CitationSignal() {
  const stageRef = useRef<HTMLDivElement | null>(null)
  const beamsRef = useRef<SVGGElement | null>(null)
  const queryRef = useRef<HTMLSpanElement | null>(null)
  const citedRef = useRef<HTMLSpanElement | null>(null)
  const sovRef = useRef<HTMLSpanElement | null>(null)
  const latRef = useRef<HTMLSpanElement | null>(null)
  const dotsRef = useRef<HTMLDivElement | null>(null)
  const tipRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const stage = stageRef.current
    const beamsG = beamsRef.current
    const queryEl = queryRef.current
    const citedEl = citedRef.current
    const sovEl = sovRef.current
    const latEl = latRef.current
    const dotsEl = dotsRef.current
    const tipEl = tipRef.current
    if (!stage || !beamsG || !queryEl || !citedEl || !sovEl || !latEl || !dotsEl || !tipEl) return

    const SVG_NS = "http://www.w3.org/2000/svg"
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const timeouts: number[] = []
    const intervals: number[] = []
    const sleep = (ms: number) =>
      new Promise<void>((r) => {
        const id = window.setTimeout(() => r(), ms)
        timeouts.push(id)
      })
    const rand = (a: number, b: number) => a + Math.random() * (b - a)

    const endpointTowardCenter = (e: Required<Engine>) => {
      const dx = CX - e.x
      const dy = CY - e.y
      const d = Math.hypot(dx, dy)
      return { x: e.x + (dx * NODE_R) / d, y: e.y + (dy * NODE_R) / d }
    }
    const endpointFromCenter = (e: Required<Engine>) => {
      const dx = e.x - CX
      const dy = e.y - CY
      const d = Math.hypot(dx, dy)
      return { x: CX + (dx * BRAND_R) / d, y: CY + (dy * BRAND_R) / d }
    }

    const colorFor = (cls: string) => {
      if (cls.includes("back-cited"))   return "var(--color-accent-300)"
      if (cls.includes("back-mention")) return "#f59e0b"
      if (cls.includes("back-missed"))  return "#ef4444"
      return "var(--color-accent-300)"
    }

    /** Spawn one bright head + N trailing particles staggered behind it, plus
     *  an optional arrival burst. Replaces the previous single-dot beam — now
     *  reads as a comet, not a ping. Borrows the "layered constraints" idea
     *  from the Vercel Ship shader (head pulls, tail follows with lag). */
    const fireParticle = (
      from: { x: number; y: number },
      to: { x: number; y: number },
      opts: { cls: string; duration?: number; delay?: number; showLine?: boolean; trail?: number; burst?: boolean }
    ) => {
      const { cls, duration = 620, delay = 0, showLine = true, trail = 3, burst = true } = opts
      const color = colorFor(cls)

      // thin guide beam (still helpful, but dimmer — the eye should follow the particles)
      if (showLine) {
        const line = document.createElementNS(SVG_NS, "line")
        line.setAttribute("class", `beam ${cls}`)
        line.setAttribute("x1", String(from.x))
        line.setAttribute("y1", String(from.y))
        line.setAttribute("x2", String(to.x))
        line.setAttribute("y2", String(to.y))
        ;(line as unknown as HTMLElement).style.opacity = "0"
        beamsG.appendChild(line)
        timeouts.push(
          window.setTimeout(() => {
            ;(line as unknown as HTMLElement).style.transition = "opacity 260ms ease"
            ;(line as unknown as HTMLElement).style.opacity = "1"
          }, delay)
        )
        timeouts.push(
          window.setTimeout(() => {
            ;(line as unknown as HTMLElement).style.opacity = "0"
            timeouts.push(window.setTimeout(() => line.remove(), 400))
          }, delay + duration + 500)
        )
      }

      // head + trail
      const total = 1 + trail
      for (let i = 0; i < total; i++) {
        const isHead = i === 0
        const stagger = i * 85 // ms between head and each tail particle
        const r       = isHead ? 2.8 : Math.max(0.9, 2.3 - i * 0.45)
        const op      = isHead ? 1   : Math.max(0.25, 0.85 - i * 0.2)

        const dot = document.createElementNS(SVG_NS, "circle")
        dot.setAttribute("class", "beam-particle")
        dot.setAttribute("r", String(r))
        dot.setAttribute("cx", String(from.x))
        dot.setAttribute("cy", String(from.y))
        dot.setAttribute("fill", color)
        ;(dot as unknown as HTMLElement).style.color = color
        ;(dot as unknown as HTMLElement).style.opacity = String(op)
        beamsG.appendChild(dot)

        timeouts.push(
          window.setTimeout(() => {
            ;(dot as unknown as HTMLElement).style.transition = `cx ${duration}ms cubic-bezier(.4,.0,.3,1), cy ${duration}ms cubic-bezier(.4,.0,.3,1), opacity 300ms ease`
            dot.setAttribute("cx", String(to.x))
            dot.setAttribute("cy", String(to.y))
          }, delay + stagger)
        )
        timeouts.push(
          window.setTimeout(() => {
            ;(dot as unknown as HTMLElement).style.transition = "r 200ms ease, opacity 200ms ease"
            ;(dot as unknown as HTMLElement).style.opacity = "0"
            timeouts.push(window.setTimeout(() => dot.remove(), 220))
          }, delay + stagger + duration)
        )
      }

      // arrival burst — 6 sub-particles radiating outward ~18px then fading
      if (burst) {
        timeouts.push(
          window.setTimeout(() => {
            for (let j = 0; j < 6; j++) {
              const angle = (j / 6) * Math.PI * 2 + Math.random() * 0.35
              const travel = 14 + Math.random() * 8
              const sub = document.createElementNS(SVG_NS, "circle")
              sub.setAttribute("class", "beam-burst")
              sub.setAttribute("r", "1.4")
              sub.setAttribute("cx", String(to.x))
              sub.setAttribute("cy", String(to.y))
              sub.setAttribute("fill", color)
              ;(sub as unknown as HTMLElement).style.color = color
              ;(sub as unknown as HTMLElement).style.opacity = "0.9"
              beamsG.appendChild(sub)
              timeouts.push(
                window.setTimeout(() => {
                  ;(sub as unknown as HTMLElement).style.transition =
                    "cx 360ms cubic-bezier(.2,.6,.3,1), cy 360ms cubic-bezier(.2,.6,.3,1), opacity 360ms ease, r 360ms ease"
                  sub.setAttribute("cx", String(to.x + Math.cos(angle) * travel))
                  sub.setAttribute("cy", String(to.y + Math.sin(angle) * travel))
                  sub.setAttribute("r", "0.3")
                  ;(sub as unknown as HTMLElement).style.opacity = "0"
                }, 10)
              )
              timeouts.push(window.setTimeout(() => sub.remove(), 420))
            }
          }, delay + duration)
        )
      }
    }

    /** P3: brighten constellation lines adjacent to an engine for a moment. */
    const flashAdjacentLines = (engineId: string) => {
      stage.querySelectorAll<SVGLineElement>(`.constellation-line[data-a="${engineId}"], .constellation-line[data-b="${engineId}"]`)
        .forEach((line) => {
          line.classList.add("is-live")
          timeouts.push(window.setTimeout(() => line.classList.remove("is-live"), 650))
        })
    }

    /** P7: backspace existing text char-by-char, then type the new query.
     *  Feels like a real person hitting the field. */
    const typeQuery = async (text: string) => {
      const current = queryEl.textContent ?? ""
      // backspace — fast, ~18ms per char
      for (let i = current.length; i > 0; i--) {
        queryEl.textContent = current.slice(0, i - 1)
        await sleep(rand(14, 22))
      }
      // type new — slower, feels deliberate
      for (const ch of text) {
        queryEl.textContent = (queryEl.textContent ?? "") + ch
        await sleep(rand(20, 42))
      }
    }

    /** Smooth crossfade reset: instead of hard-clearing states, let the old
     *  states sit at reduced opacity for 400ms while new ones ramp in. */
    const softResetEngines = async () => {
      stage.classList.add("is-transitioning")
      await sleep(400)
      ENGINES.forEach((e) => {
        const n = stage.querySelector(`#node-${e.id}`)
        n?.classList.remove("state-cited", "state-mention", "state-missed")
      })
      stage.classList.remove("is-transitioning")
      citedEl.textContent = "0/9"
      sovEl.textContent = "0%"
      latEl.textContent = "0.0s"
    }

    const setActive = (i: number) => {
      dotsEl.querySelectorAll(".scene-dot").forEach((el, idx) => {
        el.classList.toggle("is-active", idx === i)
      })
    }

    const runScene = async (scene: Scene, query: string, idx: number) => {
      await softResetEngines()
      setActive(idx)
      await typeQuery(query)

      let citedCount = 0
      ENGINES.forEach((e) => {
        const hitMs = (e.angleDeg / 360) * SWEEP_MS + rand(-60, 60)
        const state = scene.cited.includes(e.id) ? "cited" : scene.mention.includes(e.id) ? "mention" : "missed"

        const outDelay = Math.max(0, hitMs - 480)
        fireParticle(endpointFromCenter(e), endpointTowardCenter(e), {
          cls: "beam-out",
          duration: 480,
          delay: outDelay,
          trail: 2, // lighter trail on outbound
          burst: false, // no burst on outbound — keep the drama for arrivals
        })

        timeouts.push(
          window.setTimeout(() => {
            const node = stage.querySelector(`#node-${e.id}`)
            node?.classList.add(`state-${state}`)
            flashAdjacentLines(e.id) // P3: adjacent lines flicker as the engine responds

            const cls =
              state === "cited" ? "beam-back-cited" : state === "mention" ? "beam-back-mention" : "beam-back-missed"
            fireParticle(endpointTowardCenter(e), endpointFromCenter(e), {
              cls,
              duration: 460,
              delay: 40,
              showLine: state !== "missed",
              trail: state === "missed" ? 1 : 3,
              burst: state !== "missed", // only cited/mention bursts on return
            })
            if (state === "cited") {
              citedCount++
              citedEl.textContent = `${citedCount}/9`
            }
          }, hitMs)
        )
      })

      timeouts.push(
        window.setTimeout(() => {
          sovEl.textContent = `${scene.sov}%`
          latEl.textContent = `${scene.lat.toFixed(1)}s`
        }, SWEEP_MS + 200)
      )

      await sleep(SWEEP_MS + 1600)
    }

    // static snapshot for reduced motion
    if (reduceMotion) {
      const s = SCENES[0]
      queryEl.textContent = QUERIES[0]
      setActive(0)
      ENGINES.forEach((e) => {
        const n = stage.querySelector(`#node-${e.id}`)
        const st = s.cited.includes(e.id) ? "cited" : s.mention.includes(e.id) ? "mention" : "missed"
        n?.classList.add(`state-${st}`)
      })
      citedEl.textContent = `${s.cited.length}/9`
      sovEl.textContent = `${s.sov}%`
      latEl.textContent = `${s.lat.toFixed(1)}s`
      return () => {
        timeouts.forEach(clearTimeout)
        intervals.forEach(clearInterval)
      }
    }

    // main loop
    let running = true
    let paused = false
    let idx = 0
    const loop = async () => {
      while (running) {
        if (!paused && !document.hidden) {
          await runScene(SCENES[idx % SCENES.length], QUERIES[idx % QUERIES.length], idx % SCENES.length)
          idx++
        } else {
          await sleep(400)
        }
      }
    }

    const onEnter = () => {
      paused = true
      stage.classList.add("is-paused")
    }
    const onLeave = () => {
      paused = false
      stage.classList.remove("is-paused")
    }
    stage.addEventListener("mouseenter", onEnter)
    stage.addEventListener("mouseleave", onLeave)

    /* ---- P4: per-engine hover tooltip ---- */
    const hideTip = () => {
      tipEl.classList.remove("is-visible")
      tipEl.classList.remove("is-below")
    }
    const showTip = (engineId: string, nodeEl: SVGGElement) => {
      // determine current state from node classes
      const state: "cited" | "mention" | "missed" =
        nodeEl.classList.contains("state-cited")   ? "cited" :
        nodeEl.classList.contains("state-mention") ? "mention" :
        nodeEl.classList.contains("state-missed")  ? "missed" : "missed"
      const snip = SNIPPETS[engineId]
      if (!snip) return
      const label = ENGINES.find(e => e.id === engineId)?.label ?? engineId

      // populate tooltip
      const chipCls = state === "cited" ? "cited" : state === "mention" ? "mention" : "missed"
      const chipText = state === "cited" ? "CITED" : state === "mention" ? "MENTIONED" : "NOT FOUND"
      tipEl.innerHTML = `
        <div class="tip-head">
          <span class="tip-engine">${label}</span>
          <span class="tip-chip tip-chip-${chipCls}">${chipText}</span>
        </div>
        <div class="tip-body">${snip[state]}</div>
      `

      // Project node centre from SVG viewBox into canvas screen space
      const canvas = stage.querySelector<HTMLElement>(".signal-canvas")
      const svg = stage.querySelector<SVGSVGElement>(".signal-svg")
      if (!canvas || !svg) return
      const canvasRect = canvas.getBoundingClientRect()
      const pt = svg.createSVGPoint()
      const nodeTransform = nodeEl.getAttribute("transform") || ""
      const m = nodeTransform.match(/translate\(([-\d.]+) ([-\d.]+)\)/)
      if (!m) return
      pt.x = parseFloat(m[1])
      pt.y = parseFloat(m[2])
      const ctm = svg.getScreenCTM()
      if (!ctm) return
      const screen = pt.matrixTransform(ctm)

      const nodeX = screen.x - canvasRect.left
      const nodeY = screen.y - canvasRect.top

      // Measure tooltip so we can position it edge-safely
      tipEl.classList.remove("is-below")
      // make temporarily measurable without flashing
      tipEl.style.visibility = "hidden"
      tipEl.style.opacity = "0"
      tipEl.classList.add("is-visible")
      const tipW = tipEl.offsetWidth
      const tipH = tipEl.offsetHeight
      tipEl.style.visibility = ""

      const GAP = 14
      const EDGE_PAD = 12

      // --- vertical: flip to below if above would clip the canvas top ---
      const wouldClipAbove = (nodeY - NODE_R - GAP - tipH) < EDGE_PAD
      const showBelow = wouldClipAbove
      const top = showBelow
        ? nodeY + NODE_R + GAP
        : nodeY - NODE_R - GAP

      // --- horizontal: clamp so tooltip stays inside canvas, then nudge the
      //     caret so it continues to point at the node ---
      const canvasW = canvasRect.width
      const idealLeft = nodeX                // centre on node
      const halfW = tipW / 2
      const minLeft = EDGE_PAD + halfW       // tip's transformed left at this X puts its edge at EDGE_PAD
      const maxLeft = canvasW - EDGE_PAD - halfW
      const clampedLeft = Math.max(minLeft, Math.min(maxLeft, idealLeft))
      const caretShiftPx = idealLeft - clampedLeft   // positive if clamped right, negative if clamped left
      const caretX = 50 + (caretShiftPx / tipW) * 100
      const caretXClamped = Math.max(12, Math.min(88, caretX))  // keep caret inside tip

      tipEl.style.left = `${clampedLeft}px`
      tipEl.style.top = `${top}px`
      tipEl.style.setProperty("--tip-caret-x", `${caretXClamped}%`)
      if (showBelow) tipEl.classList.add("is-below")
      tipEl.style.opacity = ""    // clear inline opacity (let .is-visible class drive it)
    }

    const onEngineEnter = (ev: Event) => {
      const target = ev.currentTarget as SVGGElement
      const id = target.id.replace(/^node-/, "")
      paused = true
      stage.classList.add("is-paused")
      showTip(id, target)
    }
    const onEngineLeave = () => {
      hideTip()
    }

    const engineNodes = stage.querySelectorAll<SVGGElement>(".engine-node")
    engineNodes.forEach(n => {
      n.addEventListener("mouseenter", onEngineEnter)
      n.addEventListener("mouseleave", onEngineLeave)
    })

    let started = false
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true
            loop()
            io.disconnect()
          }
        })
      },
      { threshold: 0.2 }
    )
    io.observe(stage)

    // safety kick in case observer never fires (already-visible edge case)
    timeouts.push(
      window.setTimeout(() => {
        if (!started) {
          started = true
          loop()
          io.disconnect()
        }
      }, 800)
    )

    return () => {
      running = false
      timeouts.forEach(clearTimeout)
      intervals.forEach(clearInterval)
      stage.removeEventListener("mouseenter", onEnter)
      stage.removeEventListener("mouseleave", onLeave)
      engineNodes.forEach(n => {
        n.removeEventListener("mouseenter", onEngineEnter)
        n.removeEventListener("mouseleave", onEngineLeave)
      })
      io.disconnect()
    }
  }, [])

  return (
    <div className="signal-stage" ref={stageRef}>
      <div className="signal-header">
        <div className="signal-query">
          <span className="query-caret">▸</span>
          <span className="query-text" ref={queryRef} />
          <span className="query-cursor" />
        </div>
      </div>

      <div className="signal-canvas">
        <svg className="signal-svg" viewBox="0 0 560 480" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="scanSweepGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--color-accent-300)" stopOpacity="0" />
              <stop offset="70%" stopColor="var(--color-accent-300)" stopOpacity="0.02" />
              <stop offset="100%" stopColor="var(--color-accent-300)" stopOpacity="0.16" />
            </radialGradient>
            <linearGradient id="scanSweepArm" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-accent-300)" stopOpacity="0" />
              <stop offset="100%" stopColor="var(--color-accent-300)" stopOpacity="0.65" />
            </linearGradient>
            <filter id="scanSoftGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g transform="translate(280 240)">
            <circle r="80" className="radar-ring" />
            <circle r="140" className="radar-ring" />
            <circle r="200" className="radar-ring" />
            <line x1="-220" y1="0" x2="220" y2="0" className="radar-cross" />
            <line x1="0" y1="-220" x2="0" y2="220" className="radar-cross" />
          </g>

          <g>
            {neighbourLines().map((l, i) => (
              <line
                key={i}
                x1={l.x1}
                y1={l.y1}
                x2={l.x2}
                y2={l.y2}
                className="constellation-line"
                data-a={l.a}
                data-b={l.b}
              />
            ))}
          </g>

          <g ref={beamsRef} />

          <g className="radar-sweep" transform="translate(280 240)">
            <path d="M 0 0 L 220 0 A 220 220 0 0 1 201.6 87.7 Z" fill="url(#scanSweepGrad)" />
            <line x1="0" y1="0" x2="220" y2="0" stroke="url(#scanSweepArm)" strokeWidth="1.2" />
          </g>

          <g>
            {ENGINES.map((e) => (
              <g
                key={e.id}
                id={`node-${e.id}`}
                className="engine-node"
                transform={`translate(${e.x} ${e.y})`}
              >
                <circle className="engine-ring" r={NODE_R} />
                <g className="engine-icon">{ICONS[e.ico]}</g>
                <text className="engine-label" y={NODE_R + 14}>
                  {e.label}
                </text>
              </g>
            ))}
          </g>

          {/* Brand mark — matches the nav: teal rounded square + white G.
              Swapped from circle stack for identity continuity. */}
          <g transform="translate(280 240)">
            <defs>
              <linearGradient id="scanBrandGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--color-accent-300)" />
                <stop offset="100%" stopColor="var(--color-accent-600)" />
              </linearGradient>
            </defs>
            <circle className="brand-halo" r={48} />
            <circle className="brand-halo brand-halo-2" r={48} />
            <rect
              className="brand-mark-bg"
              x={-26}
              y={-26}
              width={52}
              height={52}
              rx={12}
              fill="url(#scanBrandGrad)"
              filter="url(#scanSoftGlow)"
            />
            <text className="brand-mark-label" y={9} textAnchor="middle">
              G
            </text>
          </g>
        </svg>

        <div className="readout-chip">
          <div className="readout-item">
            <span className="readout-label">Cited</span>
            <span className="readout-value readout-cited" ref={citedRef}>
              0/9
            </span>
          </div>
          <div className="readout-sep" />
          <div className="readout-item">
            <span className="readout-label">SoV</span>
            <span className="readout-value" ref={sovRef}>
              0%
            </span>
          </div>
          <div className="readout-sep" />
          <div className="readout-item">
            <span className="readout-label">Scan</span>
            <span className="readout-value readout-mono" ref={latRef}>
              0.0s
            </span>
          </div>
        </div>

        <div className="signal-legend">
          <span className="legend-item">
            <span className="swatch swatch-cited" />
            Cited
          </span>
          <span className="legend-item">
            <span className="swatch swatch-mention" />
            Mentioned
          </span>
          <span className="legend-item">
            <span className="swatch swatch-missed" />
            Not found
          </span>
        </div>

        <div className="scene-dots" ref={dotsRef} aria-hidden>
          {SCENES.map((_, i) => (
            <span key={i} className="scene-dot" data-idx={i} />
          ))}
        </div>

        {/* P4: hover tooltip — positioned absolutely, populated by JS on engine hover */}
        <div className="engine-tip" ref={tipRef} aria-hidden />
      </div>
    </div>
  )
}
