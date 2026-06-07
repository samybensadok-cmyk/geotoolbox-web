import { EngineMark, type EngineId } from "@/components/landing/engine-marks"

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
  copilot: "Bing Copilot",
  grok: "Grok",
}

const ALL: EngineId[] = ["chatgpt", "perplexity", "gemini", "claude", "aio", "copilot", "grok"]

export function AiEngineLogoGrid({
  engines = ALL,
  label = "Queried live across the engines your customers actually use",
  showNames = true,
}: {
  engines?: EngineId[]
  label?: string
  showNames?: boolean
}) {
  return (
    <div className="text-center">
      {label && (
        <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
          {label}
        </p>
      )}
      <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        {engines.map((e) => (
          <li key={e} className="flex items-center gap-2 text-gray-700">
            <EngineMark engine={e} className="h-4 w-4" />
            {showNames && <span className="text-[13px] font-semibold">{LABELS[e]}</span>}
          </li>
        ))}
      </ul>
    </div>
  )
}
