"use client"

import { useRef, useState, type KeyboardEvent } from "react"
import { EngineMark, type EngineId } from "./engine-marks"
import { trackEvent } from "@/lib/analytics"
import s from "./homepage.module.css"

export type ReportCopy = {
  sample: string; domain: string; prompt: string; overview: string; engines: string;
  cited: string; mentioned: string; missing: string; insight: string; insightBody: string;
  engine: string; result: string; source: string; examplePage: string;
  tabs: string[]; questions: string[]; sampleNote: string;
}

const engines: { id: EngineId; name: string }[] = [
  { id: "chatgpt", name: "ChatGPT" }, { id: "perplexity", name: "Perplexity" },
  { id: "gemini", name: "Gemini" }, { id: "claude", name: "Claude" },
  { id: "aio", name: "AI Overviews" }, { id: "aimode", name: "AI Mode" },
  { id: "copilot", name: "Bing Copilot" }, { id: "grok", name: "Grok" },
]
// Illustrative data, deliberately independent of production services.
const samples = [[0, 0, 2, 1, 0, 1, 2, 0], [0, 2, 0, 0, 1, 0, 2, 1], [1, 0, 0, 2, 0, 2, 1, 0]]

export function ReportPreview({ copy, locale }: { copy: ReportCopy; locale: string }) {
  const [selected, setSelected] = useState(0)
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const statuses = [copy.cited, copy.mentioned, copy.missing]
  const state = samples[selected]
  const select = (index: number) => {
    setSelected(index)
    trackEvent("select_item", { item_list_name: "homepage_sample", item_id: String(index), locale })
  }
  const keyboard = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index
    if (event.key === "ArrowRight") next = (index + 1) % 3
    else if (event.key === "ArrowLeft") next = (index + 2) % 3
    else if (event.key === "Home") next = 0
    else if (event.key === "End") next = 2
    else return
    event.preventDefault()
    select(next)
    refs.current[next]?.focus()
  }
  return <figure className={s.reportFigure}>
    <div className={s.report}>
      <div className={s.reportTop}>
        <span className={s.reportBrand}><span className={s.miniLogo}>G</span> GEO Toolbox <span className={s.slash}>/</span> <span>{copy.overview}</span></span>
        <span className={s.sampleBadge}>{copy.sample}</span>
      </div>
      <div className={s.reportLayout}>
        <div className={s.reportSide}>
          <span className={s.smallLabel}>{copy.domain}</span>
          <strong>example.com</strong>
          <div className={s.reportNav}><span aria-hidden="true">◉</span> {copy.overview}</div>
          <div className={s.sideMetric}><span>{copy.engines}</span><strong>8<span>/8</span></strong></div>
          <div className={s.sideInsight}><span className={s.smallLabel}>{copy.insight}</span><p>{copy.insightBody}</p></div>
        </div>
        <div className={s.reportMain}>
          <div role="tablist" aria-label={copy.prompt} className={s.reportTabs}>
            {copy.tabs.map((label, i) => <button type="button" key={label} role="tab" id={`sample-tab-${i}`} aria-selected={selected === i}
              aria-controls={`sample-panel-${i}`} tabIndex={selected === i ? 0 : -1}
              ref={el => { refs.current[i] = el }} onClick={() => select(i)} onKeyDown={event => keyboard(event, i)}>{label}</button>)}
          </div>
          <div role="tabpanel" id={`sample-panel-${selected}`} aria-labelledby={`sample-tab-${selected}`} tabIndex={0}>
            <div className={s.query}><span aria-hidden="true">⌕</span><span>{copy.questions[selected]}</span></div>
            <div className={s.reportStats}>
              {statuses.map((label, i) => <div key={label}><span><i className={s[`dot${i}`]} />{label}</span><strong>{state.filter(v => v === i).length}<small>/8</small></strong></div>)}
            </div>
            <table className={s.engineTable}>
              <thead><tr><th scope="col">{copy.engine}</th><th scope="col">{copy.result}</th><th scope="col">{copy.source}</th></tr></thead>
              <tbody>{engines.map((engine, i) => <tr key={engine.id}>
                <th scope="row"><span><EngineMark engine={engine.id} className={s.engineIcon} />{engine.name}</span></th>
                <td><span className={s[`status${state[i]}`]}><i className={s[`dot${state[i]}`]} />{statuses[state[i]]}</span></td>
                <td>{state[i] === 0 ? <span className={s.sourceUrl}>example.com/{copy.examplePage}</span> : <span aria-label={statuses[state[i]]}>—</span>}</td>
              </tr>)}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <figcaption>{copy.sampleNote}</figcaption>
  </figure>
}
