import { toolPageCopy } from "@/lib/tool-page-copy"
import styles from "./tool-experience.module.css"

export function ToolIntro({ slug }: { slug: string }) {
  const tool = toolPageCopy[slug]
  return <div className={styles.intro}>
    <div>
      <p className={styles.eyebrow}>{tool.name} · Free tool</p>
      <h1>{tool.title}</h1>
      <p className={styles.description}>{tool.description}</p>
      <p className={styles.reassurance}>No account needed · Results without an email{slug === "query-fanout" ? " · API usage may cost extra" : ""}</p>
    </div>
    <aside className={styles.outputs} aria-label="What you get">
      <p>WHAT YOU GET</p>
      <ul>{tool.outputs.map((output) => <li key={output}><span aria-hidden="true">↗</span>{output}</li>)}</ul>
    </aside>
  </div>
}
