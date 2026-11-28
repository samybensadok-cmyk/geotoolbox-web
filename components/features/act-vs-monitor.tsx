import Link from "next/link"
import { Arrow, kit as k } from "@/components/brand/dark-kit"
import { FxIndex, LimeTail } from "./fx"
import s from "./fx.module.css"

/**
 * ActVsMonitorWedge — the category differentiator: most AI-visibility tools show the gap and stop;
 * GEO Toolbox routes the gap to a page-level fix. Dark kit: a lifted band, headline left (only the
 * last words of the emphasis in lime), body + worked example + contextual link right.
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
    <section className={`${s.sec} ${s.secBand}`}>
      <div className={`${k.wrap} ${s.wedgeGrid}`}>
        <div>
          <FxIndex label={eyebrow ?? <>Act, don&apos;t just monitor</>} />
          <h2 className={s.title}>
            {headline} <LimeTail text={emphasis} words={3} />
          </h2>
        </div>
        <div>
          <p className={s.wedgeBody}>{body}</p>
          {example && <p className={s.wedgeExample}>{example}</p>}
          {link && (
            <div className={s.linkRow}>
              <Link href={link.href} className={k.textLink}>
                {link.label}
                <Arrow />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
