import { ReportCta } from "@/components/services/report-cta"

// SG_REPORT_PUSH_V1 (2026-09-22): every free tool ends with the Report card — someone checking
// one signal on their own site is the reader most likely to want the whole picture. The tools
// tree is EN-only (marketing root layout), so no locale check is needed here.
export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ReportCta placement="tools" />
    </>
  )
}
