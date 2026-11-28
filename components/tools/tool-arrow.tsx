import tk from "./tools-dark.module.css"

/**
 * The kit's arrow (components/brand/dark-kit Arrow), drawn inline for the widget submit buttons.
 * Inline because the AI Crawler Checker widget also renders inside light blog articles, which must
 * not pull in the kit. Shown only on the dark /tools pages; hidden everywhere else.
 */
export function ToolArrow() {
  return (
    <svg className={tk.arrow} aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 10h12m-5-5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
