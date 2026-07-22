import Link from "next/link"

/**
 * ActVsMonitorWedge — the category differentiator: most AI-visibility tools show
 * the gap and stop; GEO Toolbox routes the gap to a page-level fix. Make it
 * concrete with a worked example + a contextual link to the tool that does the
 * fixing (e.g. Content Analyzer / Domain Overview recommended actions).
 */

export function ActVsMonitorWedge({
  eyebrow,
  headline = "Most AI-visibility tools show you the gap and stop.",
  emphasis = "GEO Toolbox shows you the gap — then hands you the fix.",
  body,
  example,
  link,
}: {
  /** localized eyebrow; EN default keeps EN byte-identical */
  eyebrow?: string
  headline?: string
  emphasis?: string
  body: string
  example?: string
  link?: { label: string; href: string }
}) {
  return (
    <section className="border-t border-gray-100 bg-accent-50/40 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
          {eyebrow ?? <>Act, don&apos;t just monitor</>}
        </p>
        <h2 className="mt-3 text-[clamp(1.4rem,2.6vw,2rem)] font-bold leading-tight tracking-tight text-gray-900">
          {headline} <span className="text-accent-700">{emphasis}</span>
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-gray-700">{body}</p>
        {example && (
          <p className="mt-4 rounded-xl border border-accent-200 bg-white p-4 text-[14px] leading-relaxed text-gray-700">
            {example}
          </p>
        )}
        {link && (
          <Link
            href={link.href}
            className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent-700 hover:text-accent-800"
          >
            {link.label}
            <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        )}
      </div>
    </section>
  )
}
