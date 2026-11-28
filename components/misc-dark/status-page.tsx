import type { ReactNode } from "react"
import Link from "next/link"
import { DarkPage, kit, Arrow } from "@/components/brand/dark-kit"
import st from "./status.module.css"

// Small centered status page on the dark kit (2026-11-28): one mark, one H1, one line of text and
// one action. The page passes its own words; this only lays them out.
type Mark = "check" | "mail" | "link"

const icons: Record<Mark, ReactNode> = {
  check: <path d="m5 10 3.5 3.5L15 6" strokeLinecap="round" strokeLinejoin="round" />,
  mail: (
    <>
      <rect x="3" y="5" width="14" height="10" rx="1.5" />
      <path d="m3.5 6 6.5 5 6.5-5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  link: (
    <>
      <path d="M8.5 11.5 6.6 13.4a2.4 2.4 0 0 1-3.4-3.4l1.9-1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m11.5 8.5 1.9-1.9a2.4 2.4 0 0 0-3.4-3.4L8.1 5.1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 13l3 3M14.5 11.5H17M11.5 14.5V17" strokeLinecap="round" />
    </>
  ),
}

export function StatusPage({
  mark,
  title,
  children,
  action,
}: {
  mark: Mark
  title: ReactNode
  children: ReactNode
  action: { href: string; label: ReactNode }
}) {
  return (
    <DarkPage>
      <section className={`${st.section} ${kit.heroGlow}`}>
        <div className={st.inner}>
          <span className={mark === "check" ? `${st.mark} ${st.markLime}` : st.mark} aria-hidden="true">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={mark === "check" ? 2.5 : 1.8}>
              {icons[mark]}
            </svg>
          </span>
          <h1 className={st.title}>{title}</h1>
          <p className={st.text}>{children}</p>
          <div className={st.actions}>
            <Link href={action.href} className={kit.btnLime}>
              {action.label}
              <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </DarkPage>
  )
}
