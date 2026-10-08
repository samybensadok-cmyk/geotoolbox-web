/* eslint-disable @next/next/no-img-element -- Decorative, prerendered PNGs bypass image optimization. */
import type { Post } from "@/lib/content"
import { localePath } from "@/lib/i18n/paths"
import { formatDate } from "@/lib/utils"
import styles from "./archive.module.css"

export type ArchiveCardPost = Pick<Post, "slug" | "title" | "description" | "date" | "image"> & {
  topicLabel: string
  readTime: string
}

export function ArchiveCard({ post, locale, hero = false, eager = false }: {
  post: ArchiveCardPost; locale: string; hero?: boolean; eager?: boolean
}) {
  const href = localePath("blog", post.slug, locale)
  return <article className={`${styles.card} ${hero ? styles.hero : ""}`}>
    <a href={href} className={styles.cardLink} aria-labelledby={`title-${post.slug}`}>
      <img src={post.image || `${href}/thumbnail`} width={800} height={450} alt=""
        loading={hero || eager ? "eager" : "lazy"} fetchPriority={hero ? "high" : undefined} />
      <div className={styles.cardBody}>
        <p className={styles.topic}>{post.topicLabel}</p>
        <h3 id={`title-${post.slug}`}>{post.title}</h3>
        <p className={styles.excerpt}>{post.description}</p>
        <p className={styles.meta}><time dateTime={post.date}>{formatDate(post.date, locale)}</time><span>{post.readTime}</span></p>
      </div>
    </a>
  </article>
}

export function ArchiveGrid({ posts, locale, hero }: { posts: ArchiveCardPost[]; locale: string; hero: boolean }) {
  return <>
    {hero && posts[0] && <ArchiveCard post={posts[0]} locale={locale} hero />}
    <div className={styles.grid}>
      {(hero ? posts.slice(1) : posts).map((post, i) => <ArchiveCard key={post.slug} post={post} locale={locale} eager={i < 3} />)}
    </div>
  </>
}
