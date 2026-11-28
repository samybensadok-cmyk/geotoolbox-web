import type { ReactNode } from "react"
import { DarkPage, kit as k } from "@/components/brand/dark-kit"
import s from "./fx.module.css"

// Feature-page building blocks on the dark kit (2026-11-28). <FeaturePage> wraps a feature page (or the
// features index) in <DarkPage> and turns on the section counter + the skin that re-colors the legacy
// light Tailwind utilities still used inside bespoke mockups. Section indexes number themselves in
// document order (CSS counter), so a page never hand-passes "01", "02".
export { s as fx }

export function FeaturePage({ children }: { children: ReactNode }) {
  return <DarkPage className={`${s.root} ${s.skin}`}>{children}</DarkPage>
}

/** "03 | LABEL" (auto-numbered). Without a label: the number alone. */
export function FxIndex({ label }: { label?: ReactNode }) {
  return (
    <p className={s.index}>
      <span className={label ? s.indexNum : `${s.indexNum} ${s.indexSolo}`} aria-hidden="true" />
      {label ? label : null}
    </p>
  )
}

const TRAILING_PUNCT = /([\s.,;:!?…»"”’)]+)$/

/** Splits trailing punctuation off a phrase so a lime mark never swallows (or butts against) it. */
function splitTrail(text: string) {
  const m = text.match(TRAILING_PUNCT)
  return m ? [text.slice(0, -m[1].length), m[1]] as const : [text, ""] as const
}

/**
 * The one lime phrase an H1 may carry: lime text (no block), trailing punctuation kept white. A phrase
 * longer than `maxWords` stays white, so a heading never carries more than a short lime phrase.
 */
export function HeroAccent({ text, maxWords = 3 }: { text: string; maxWords?: number }) {
  const [core, trail] = splitTrail(text)
  if (core.trim().split(/\s+/).length > maxWords) return <>{text}</>
  return (
    <>
      <span className={s.accentText}>{core}</span>
      {trail}
    </>
  )
}

/** Renders `text` with only its last `words` words in lime (trailing punctuation kept white). */
export function LimeTail({ text, words = 3 }: { text: string; words?: number }) {
  const [core, trail] = splitTrail(text)
  const parts = core.split(/(\s+)/)
  const tokens = parts.filter((x) => x.trim())
  if (tokens.length <= words) {
    return (
      <>
        <span className={s.accentText}>{core}</span>
        {trail}
      </>
    )
  }
  // index in `parts` where the lime tail starts (count `words` non-space tokens from the end)
  let seen = 0
  let cut = parts.length
  for (let i = parts.length - 1; i >= 0; i--) {
    if (parts[i].trim()) seen++
    if (seen === words) { cut = i; break }
  }
  return (
    <>
      {parts.slice(0, cut).join("")}
      <span className={s.accentText}>{parts.slice(cut).join("")}</span>
      {trail}
    </>
  )
}

export function FxSection({
  id,
  band = false,
  narrow = false,
  className,
  children,
}: {
  id?: string
  /** slightly lifted ground, used to alternate long pages */
  band?: boolean
  /** 860px reading column, left-aligned inside the 1200px wrap */
  narrow?: boolean
  className?: string
  children: ReactNode
}) {
  const cls = [s.sec, band ? s.secBand : "", id ? s.anchor : "", className ?? ""].filter(Boolean).join(" ")
  return (
    <section id={id} className={cls}>
      <div className={k.wrap}>{narrow ? <div className={s.narrowCol}>{children}</div> : children}</div>
    </section>
  )
}

/** Section head: auto-numbered index + H2, optional lead (beside the title with `leadSide`). */
export function FxHead({
  eyebrow,
  title,
  lead,
  leadSide = false,
}: {
  eyebrow?: ReactNode
  title: ReactNode
  lead?: ReactNode
  leadSide?: boolean
}) {
  if (lead && leadSide) {
    return (
      <div className={s.headSplit}>
        <div>
          <FxIndex label={eyebrow} />
          <h2 className={s.title}>{title}</h2>
        </div>
        <p className={s.lead}>{lead}</p>
      </div>
    )
  }
  return (
    <div className={s.head}>
      <FxIndex label={eyebrow} />
      <h2 className={s.title}>{title}</h2>
      {lead ? <p className={`${s.lead} ${s.leadBelow}`}>{lead}</p> : null}
    </div>
  )
}

/** The closing card every feature page ends on (homepage close-card look). `children` = the actions. */
export function FeatureCloseCta({
  title,
  sub,
  after,
  foot,
  children,
}: {
  title: ReactNode
  sub?: ReactNode
  /** extra content under the body (left column) */
  after?: ReactNode
  /** small mono line under the actions */
  foot?: ReactNode
  children: ReactNode
}) {
  return (
    <section className={s.close}>
      <div className={k.wrap}>
        <div className={s.closeCard}>
          <div>
            <FxIndex />
            <h2 className={s.closeTitle}>{title}</h2>
            {sub ? <p className={s.closeBody}>{sub}</p> : null}
            {after}
          </div>
          <div className={s.closeActions}>
            {children}
            {foot ? <p className={s.closeFoot}>{foot}</p> : null}
          </div>
        </div>
      </div>
    </section>
  )
}
