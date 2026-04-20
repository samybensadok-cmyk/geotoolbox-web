/**
 * Small monochrome marks for each AI engine we track.
 *
 * Sized for inline use at 14–16px in hero engines strip, citation tooltips,
 * and anywhere else we want visual variety instead of uppercase wordmarks.
 * All paths use `currentColor` so they inherit the parent's text color.
 *
 * Adding an engine: extend the discriminated union + add a case.
 * Removing an engine: flip the dark-launch flag in the PHP app and remove
 *   here. Keep in sync with the 6-engine roster documented in
 *   vault/reference/marketing-design-system.md.
 */

export type EngineId =
  | "chatgpt"
  | "perplexity"
  | "gemini"
  | "claude"
  | "aio"
  | "copilot"

export function EngineMark({ engine, className = "h-3.5 w-3.5" }: { engine: EngineId; className?: string }) {
  switch (engine) {
    /* ChatGPT (OpenAI) — knotted hexagon */
    case "chatgpt":
      return (
        <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
          <path
            d="M8 1 L14 5 L14 11 L8 15 L2 11 L2 5 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <path
            d="M2 5 L14 11 M2 11 L14 5 M8 1 L8 15"
            stroke="currentColor"
            strokeWidth="0.9"
            opacity="0.55"
          />
        </svg>
      )

    /* Perplexity — letter P with tail */
    case "perplexity":
      return (
        <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
          <path
            d="M4 1 L4 15 M4 1 L11 1 Q13.5 1 13.5 4 L13.5 6 Q13.5 9 11 9 L4 9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <line
            x1="9.5"
            y1="10.5"
            x2="9.5"
            y2="15"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      )

    /* Gemini — 4-point pinched star */
    case "gemini":
      return (
        <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
          <path d="M8 1 Q9 6 8 8 Q9 10 8 15 Q7 10 8 8 Q7 6 8 1 Z" fill="currentColor" />
          <path d="M1 8 Q6 7 8 8 Q10 7 15 8 Q10 9 8 8 Q6 9 1 8 Z" fill="currentColor" />
        </svg>
      )

    /* Claude (Anthropic) — 8-ray burst */
    case "claude":
      return (
        <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
          <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none">
            <path d="M8 1 L8 4.5" />
            <path d="M8 11.5 L8 15" />
            <path d="M1 8 L4.5 8" />
            <path d="M11.5 8 L15 8" />
            <path d="M3 3 L5.3 5.3" />
            <path d="M10.7 10.7 L13 13" />
            <path d="M13 3 L10.7 5.3" />
            <path d="M3 13 L5.3 10.7" />
          </g>
          <circle cx="8" cy="8" r="1.4" fill="currentColor" />
        </svg>
      )

    /* Google AI Overviews — circular G with inner tick */
    case "aio":
      return (
        <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
          <path
            d="M14 8 A6 6 0 1 1 11.2 2.8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M14 8 L9 8"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      )

    /* Bing Copilot — ribbon swoosh */
    case "copilot":
      return (
        <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
          <path
            d="M1 12 Q4 2 8 9 Q12 16 15 4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="3" cy="12.5" r="1.2" fill="currentColor" />
        </svg>
      )
  }
}
