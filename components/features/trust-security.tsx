import { kit as k } from "@/components/brand/dark-kit"
import { FxIndex } from "./fx"
import s from "./fx.module.css"

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
    <section className={s.sec}>
      <div className={k.wrap}>
        <div className={s.head}>
          <FxIndex />
          <h2 className={s.title}>{heading}</h2>
        </div>
        <ul className={s.trustList}>
          {items.map((it) => (
            <li key={it.title} className={s.trustItem}>
              <span className={s.trustIcon} aria-hidden="true">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 1.5 2.5 4v3.5c0 3 2.3 5.6 5.5 7 3.2-1.4 5.5-4 5.5-7V4L8 1.5Z" strokeLinejoin="round" />
                  <path d="M5.5 8 7.2 9.7 10.5 6.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <h3 className={s.trustTitle}>{it.title}</h3>
                <p className={s.trustBody}>{it.body}</p>
              </div>
            </li>
          ))}
        </ul>
        {note && <p className={s.note}>{note}</p>}
      </div>
    </section>
  )
}
