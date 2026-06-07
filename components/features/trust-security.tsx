/**
 * TrustSecurityBlock — explicit data-handling / OAuth-scope copy for the
 * trust-critical moment (load-bearing on Analytics, where the user must connect
 * GSC/GA4). ONLY state claims that are actually implemented — every item here is
 * a promise the product must keep. A lighter variant carries the anti-astroturf
 * statement on Citation Interceptor and the GSC note on Domain Overview.
 */

export function TrustSecurityBlock({
  heading = "Your data, handled honestly",
  items,
  note,
}: {
  heading?: string
  items: Array<{ title: string; body: string }>
  /** honest status line, e.g. verification queue state */
  note?: string
}) {
  return (
    <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-[clamp(1.3rem,2.4vw,1.8rem)] font-bold tracking-tight text-gray-900">
          {heading}
        </h2>
        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {items.map((it) => (
            <li key={it.title} className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent-700">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 1.5 2.5 4v3.5c0 3 2.3 5.6 5.5 7 3.2-1.4 5.5-4 5.5-7V4L8 1.5Z" strokeLinejoin="round" />
                    <path d="M5.5 8 7.2 9.7 10.5 6.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <h3 className="text-[15px] font-bold text-gray-900">{it.title}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-gray-600">{it.body}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {note && <p className="mt-6 text-center text-[13px] text-gray-500">{note}</p>}
      </div>
    </section>
  )
}
