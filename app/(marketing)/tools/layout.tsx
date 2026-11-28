import { ReportCta } from "@/components/services/report-cta"
import { ToolsPage, toolsKit as tk } from "@/components/tools/tool-page"

// SG_REPORT_PUSH_V1 (2026-09-22): every free tool ends with the Report card — someone checking
// one signal on their own site is the reader most likely to want the whole picture. The tools
// tree is EN-only (marketing root layout), so no locale check is needed here.
// Dark kit (2026-11-28): the card keeps its own look; the wrapper only gives it the tool pages'
// dark ground and the 1152px page column.
export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolsPage>
        <div className={tk.report}>
          <ReportCta placement="tools" />
        </div>
      </ToolsPage>
    </>
  )
}
