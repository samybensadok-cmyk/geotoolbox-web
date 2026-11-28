import type { ReactNode } from "react"
import { DarkPage, kit } from "@/components/brand/dark-kit"
import t from "./tools-dark.module.css"

// Dark free-tools family (2026-11-28). Every /tools page wraps its content in <ToolsPage> and builds
// its sections with the kit (components/brand/dark-kit) plus tools-dark.module.css. The shared
// feature components (HowItWorks3Step, FeatureFaq, ScoreLegend, Breadcrumbs tone="dark") restyle
// themselves inside a <DarkPage>, so the tool pages use them as they are.
export { t as toolsKit }

export function ToolsPage({ children }: { children: ReactNode }) {
  return <DarkPage className={t.tools}>{children}</DarkPage>
}

/** Mono section label, same look as the FeatureFaq eyebrow on a dark page. */
export function ToolIndex({ children }: { children: ReactNode }) {
  return <p className={kit.index}>{children}</p>
}
