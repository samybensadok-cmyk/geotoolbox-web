import { Arrow, kit as k } from "@/components/brand/dark-kit"
import { FxIndex } from "./fx"
import s from "./fx.module.css"

/**
 * PainScenarioSection — the "cost of being invisible" move: name the visitor's blind spot as a
 * concrete scenario with a business cost, then bridge to the fix. Dark kit: auto-numbered index on
 * the left, the scenario as large display type, the bridge as a lime-arrowed line.
 */

export function PainScenarioSection({
  eyebrow = "The blind spot",
  scenario,
  bridge,
}: {
  eyebrow?: string
  /** the concrete, second-person scenario paragraph */
  scenario: string
  /** the one-line gap→fix bridge */
  bridge: string
}) {
  return (
    <section className={s.sec}>
      <div className={`${k.wrap} ${s.painGrid}`}>
        <FxIndex label={eyebrow} />
        <div>
          <p className={s.painText}>{scenario}</p>
          <p className={s.painBridge}>
            <Arrow />
            <span>{bridge}</span>
          </p>
        </div>
      </div>
    </section>
  )
}
