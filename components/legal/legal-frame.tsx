import type { ReactNode } from "react"
import { DarkPage } from "@/components/brand/dark-kit"
import s from "./legal-dark.module.css"

// Dark document frame for the legal and policy pages (2026-11-28 redesign). Presentation only: the
// documents keep their exact text and markup, and legal-dark.module.css restyles them from here.
export function LegalFrame({ children }: { children: ReactNode }) {
  return <DarkPage className={s.doc}>{children}</DarkPage>
}
