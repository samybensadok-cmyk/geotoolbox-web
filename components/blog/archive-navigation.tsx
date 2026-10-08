import { archivePath, pagerItems } from "@/lib/blog-pagination"
import styles from "./archive.module.css"

export function ArchivePager({ locale, page, total, topic, labels }: {
  locale: string; page: number; total: number; topic?: string
  labels: { pager: string; previous: string; next: string; pageOf: string; pages: Record<number, string> }
}) {
  if (total < 2) return null
  return <nav className={styles.pager} aria-label={labels.pager}>
    {page > 1 ? <a href={archivePath(locale, page - 1, topic)} rel="prev">{labels.previous}</a> : <span />}
    <span className={styles.mobilePage}>{labels.pageOf}</span>
    <div className={styles.pageNumbers}>
      {pagerItems(page, total).map((item, i) => item === "ellipsis"
        ? <span key={`gap-${i}`} aria-hidden="true">…</span>
        : <a key={item} href={archivePath(locale, item, topic)} aria-label={labels.pages[item]}
            aria-current={item === page ? "page" : undefined}>{item}</a>)}
    </div>
    {page < total ? <a href={archivePath(locale, page + 1, topic)} rel="next">{labels.next}</a> : <span />}
  </nav>
}

export function TopicPills({ locale, active, label, topics }: {
  locale: string; active?: string; label: string
  topics: Array<{ slug?: string; label: string; count: number }>
}) {
  return <div className={styles.pillEdges}><nav className={styles.pills} aria-label={label}>
    {topics.map((topic) => <a key={topic.slug ?? "all"} href={archivePath(locale, 1, topic.slug)}
      aria-current={active === topic.slug ? "true" : undefined}>
      {topic.label}<span>{topic.count}</span>
    </a>)}
  </nav></div>
}
