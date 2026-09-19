"use client"

import { useState } from "react"
import { EngineMark, type EngineId } from "./engine-marks"
import s from "./homepage.module.css"

const engines: { id: EngineId; name: string }[] = [
  { id: "chatgpt", name: "ChatGPT" }, { id: "gemini", name: "Gemini" },
  { id: "perplexity", name: "Perplexity" }, { id: "claude", name: "Claude" },
  { id: "aio", name: "AI Overviews" }, { id: "aimode", name: "AI Mode" },
  { id: "copilot", name: "Bing Copilot" }, { id: "grok", name: "Grok" },
]

export function RotatingHeadline({ lead, accessible, pause, resume }: { lead: string; accessible: string; pause: string; resume: string }) {
  const [paused, setPaused] = useState(false)
  return <div className={s.headlineWrap}>
    <h1 id="home-title" className={s.headline}>{lead} <span className="sr-only">{accessible}</span>
      <span aria-hidden="true" className={`engine-rotator ${s.rotator}`} data-paused={paused}>
        {engines.map(engine => <span key={engine.id}><EngineMark engine={engine.id} />{engine.name}</span>)}
      </span>
    </h1>
    <button type="button" className={s.motionToggle} onClick={() => setPaused(!paused)} aria-label={paused ? resume : pause} title={paused ? resume : pause}>
      <svg viewBox="0 0 16 16" aria-hidden="true" width="12" height="12">{paused ? <path d="m5 3 7 5-7 5Z" fill="currentColor" /> : <path d="M5 3v10M11 3v10" stroke="currentColor" strokeWidth="2" />}</svg>
    </button>
  </div>
}
