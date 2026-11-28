import type { ReactNode } from "react"
import { geist } from "@/components/landing/v3/geist"
import { RevealOnScroll } from "./reveal"
import k from "./dark-kit.module.css"

// Dark design kit (2026-11-28). Every marketing page family (pricing, services, features, tools,
// about/contact) wraps its content in <DarkPage> and builds with the classes in dark-kit.module.css,
// so the whole site matches the homepage. The blog keeps a light reading column (operator call).
export { k as kit }

export function DarkPage({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`${k.page} ${geist.variable}${className ? ` ${className}` : ""}`} data-dark-page="">{children}<RevealOnScroll /></div>
}

/** "01 | LABEL" section index. Pass n="" to drop the number. */
export function Index({ n, label }: { n?: string; label: string }) {
  return (
    <p className={k.index}>
      {n ? <><span className={k.indexNum}>{n}</span><span className={k.indexPipe} aria-hidden="true">|</span></> : null}
      {label}
    </p>
  )
}

export function SectionHead({ n, label, title, lead, id, as: As = "h2" }: {
  n?: string; label: string; title: ReactNode; lead?: ReactNode; id?: string; as?: "h1" | "h2"
}) {
  return (
    <div className={k.sectionHead} data-reveal="">
      <div>
        <Index n={n} label={label} />
        <As id={id} className={As === "h1" ? k.heroTitle : k.sectionTitle}>{title}</As>
      </div>
      {lead ? <p className={k.sectionLead}>{lead}</p> : null}
    </div>
  )
}

export function Arrow() {
  return <svg className={k.arrow} aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 10h12m-5-5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

export function Check() {
  return <svg className={k.check} aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3.5 8.5 3 3 6-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
}
