import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { tools } from "@/lib/tools"

/**
 * FreeTools — the give-back section. Nine standalone tools, no signup, no
 * email gate. Nobody else in the category leads with free utility, which is
 * exactly why it belongs on the homepage. Tool names come from lib/tools.ts
 * (product names, not translated); the one-line descriptions are localized
 * in messages keyed by slug.
 *
 * The /tools/<slug> pages are EN-only routes — linked from both locales on
 * purpose (the tools themselves are language-neutral utilities).
 */
export async function FreeTools() {
  const t = await getTranslations("home.freeTools")
  return (
    <section className="border-t border-gray-100 bg-white px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[5fr_7fr] lg:items-end lg:gap-16">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
              {t("eyebrow")}
            </p>
            <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-tight tracking-tight text-gray-900">
              {t("h2")}
            </h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-gray-600">
            {t("intro")}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, i) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group flex items-start gap-4 rounded-2xl border border-transparent p-4 transition-colors hover:border-gray-200 hover:bg-gray-50/60"
            >
              <span className="mt-0.5 font-mono text-[11px] font-semibold tabular-nums text-accent-700">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="flex items-center gap-1.5 text-[15px] font-semibold tracking-tight text-gray-900 transition-colors group-hover:text-accent-700">
                  {tool.name}
                  <svg
                    className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100"
                    viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"
                  >
                    <path d="M3 6h6m0 0L6 3m3 3L6 9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="mt-1 block text-[13px] leading-relaxed text-gray-600">
                  {t(`descs.${tool.slug}`)}
                </span>
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10 border-t border-gray-100 pt-8">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-700 hover:text-accent-800"
          >
            {t("exploreAll")}
            <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
