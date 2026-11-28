import { EngineMark, type EngineId } from "@/components/landing/engine-marks"
import s from "./fx.module.css"

/**
 * AiEngineLogoGrid — a row of AI-engine marks framed as the DATA SOURCES we
 * query (NOT integrations or partnerships — never imply endorsement). Reuses
 * the canonical EngineMark roster so the marks stay in sync site-wide.
 */

const LABELS: Record<EngineId, string> = {
  chatgpt: "ChatGPT",
  perplexity: "Perplexity",
  gemini: "Gemini",
  claude: "Claude",
  aio: "Google AI Overviews",
  aimode: "Google AI Mode",
  copilot: "Bing Copilot",
  grok: "Grok",
}

const ALL: EngineId[] = ["chatgpt", "perplexity", "gemini", "claude", "aio", "aimode", "copilot", "grok"]

export function AiEngineLogoGrid({
  engines = ALL,
  label = "Queried live across the engines your customers actually use",
  showNames = true,
}: {
  engines?: EngineId[]
  label?: string
  showNames?: boolean
}) {
  // Dark kit: mono uppercase roster like the homepage engine strip, marks in lime.
  return (
    <div className={s.engines}>
      {label && <p className={s.enginesLabel}>{label}</p>}
      <ul className={s.engineList}>
        {engines.map((e) => (
          <li key={e} className={s.engineItem}>
            <EngineMark engine={e} className={s.engineMark} />
            {showNames && <span>{LABELS[e]}</span>}
          </li>
        ))}
      </ul>
    </div>
  )
}
