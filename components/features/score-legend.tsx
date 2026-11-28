/**
 * ScoreLegend — anchors an otherwise-arbitrary product number (the 0–100 AI
 * visibility score, or an A–F citability grade) with a 3-tier "what good looks
 * like" legend so the hero metric reads as meaningful, not random.
 */

import s from "./shared-dark.module.css"

type Tier = { band: string; label: string; tone: "bad" | "mid" | "good" }

const TONE: Record<Tier["tone"], string> = {
  bad: "bg-rose-50 text-rose-700 border-rose-200",
  mid: "bg-amber-50 text-amber-800 border-amber-200",
  good: "bg-accent-50 text-accent-800 border-accent-200",
}

// Dark look inside a <DarkPage> (shared-dark.module.css); the light classes above stay the fallback.
const DARK_TONE: Record<Tier["tone"], string> = { bad: s.legBad, mid: s.legMid, good: s.legGood }

const PRESETS: Record<string, Tier[]> = {
  "0-100": [
    { band: "0–40", label: "Mostly invisible to AI", tone: "bad" },
    { band: "41–70", label: "Inconsistent — cited for some prompts, missing for others", tone: "mid" },
    { band: "71–100", label: "Dominant in AI answers", tone: "good" },
  ],
  "A-F": [
    { band: "D–F", label: "AI engines can't read or cite the page", tone: "bad" },
    { band: "B–C", label: "Reachable, but missing key citability signals", tone: "mid" },
    { band: "A", label: "Structured to be cited", tone: "good" },
  ],
}

export function ScoreLegend({
  variant = "0-100",
  tiers,
}: {
  variant?: "0-100" | "A-F"
  tiers?: Tier[]
}) {
  const data = tiers ?? PRESETS[variant]
  return (
    <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      {data.map((t) => (
        <li
          key={t.band}
          className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] ${TONE[t.tone]} ${s.legItem} ${DARK_TONE[t.tone]}`}
        >
          <span className="font-bold tabular-nums">{t.band}</span>
          <span className="opacity-90">{t.label}</span>
        </li>
      ))}
    </ul>
  )
}
