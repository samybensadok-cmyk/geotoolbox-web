import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { bcp47, type Locale } from "@/i18n/routing"
import { archiveLanguages, archivePosts, postsForTopic } from "@/lib/blog-archive"
import { archivePath, pageCount, paginate, parseArchivePage } from "@/lib/blog-pagination"
import { TOPICS, primaryTopic, topicBySlug, topicCounts } from "@/lib/blog-topics"
import { heroImage } from "@/lib/blog-hero"
import { siteConfig } from "@/lib/config"
import { breadcrumbsSchema } from "@/lib/seo-schema"
import { JsonLd } from "@/components/seo/json-ld"
import { ArchiveGrid } from "./archive-cards"
import { ArchivePager, TopicPills } from "./archive-navigation"
import { BlogResults, type SearchLabels } from "./blog-results"
import styles from "./archive.module.css"

export type ArchiveParams = { locale: string; topic?: string; pageNumber?: string }
export type ArchiveProps = { params: Promise<ArchiveParams> }

function archiveData(params: ArchiveParams) {
  const { locale, topic } = params
  const page = params.pageNumber === undefined ? 1 : parseArchivePage(params.pageNumber)
  if (!page || (params.pageNumber !== undefined && (page < 2 || String(page) !== params.pageNumber))) notFound()
  if (topic !== undefined && !topicBySlug(topic)) notFound()
  const posts = postsForTopic(locale, topic)
  const shape = topic ? "topic" : "main"
  const total = pageCount(posts.length, shape)
  if (!posts.length || page > total) notFound()
  return { locale, topic, page, total, posts: paginate(posts, page, shape), count: posts.length }
}

export async function archiveMetadata({ params }: ArchiveProps): Promise<Metadata> {
  const { locale, topic, page } = archiveData(await params)
  setRequestLocale(locale)
  const [t, ui, topics] = await Promise.all([
    getTranslations({ locale, namespace: "blogIndex" }),
    getTranslations({ locale, namespace: "blogArchive" }),
    getTranslations({ locale, namespace: "blogTopics" }),
  ])
  const title = `${topic ? `${topics(topic)} - ` : ""}Blog${page > 1 ? ` - ${ui("page", { page })}` : ""}`
  return {
    title, description: t("description"), robots: { index: true, follow: true },
    alternates: {
      canonical: `${siteConfig.url}${archivePath(locale, page, topic)}`,
      languages: page === 1 ? archiveLanguages(topic) : undefined,
    },
    openGraph: { locale: bcp47[locale as Locale].replace("-", "_") },
  }
}

export async function ArchivePage({ params }: ArchiveProps) {
  const { locale, topic, page, total, posts, count } = archiveData(await params)
  setRequestLocale(locale)
  const [t, ui, topics, blog] = await Promise.all([
    getTranslations({ locale, namespace: "blogIndex" }), getTranslations({ locale, namespace: "blogArchive" }),
    getTranslations({ locale, namespace: "blogTopics" }), getTranslations({ locale, namespace: "blog" }),
  ])
  const crumbs = [{ name: blog("home"), url: locale === "en" ? "/" : `/${locale}` }, { name: "Blog", url: archivePath(locale) }]
  if (topic) crumbs.push({ name: topics(topic), url: archivePath(locale, 1, topic) })
  if (page > 1) crumbs.push({ name: ui("page", { page }), url: archivePath(locale, page, topic) })
  const allPosts = archivePosts(locale)
  const counts = topicCounts(allPosts)
  const searchLabels = Object.fromEntries(["searchLabel", "searchPlaceholder", "loading", "error", "retry", "clear", "empty", "results"].map((key) => [key, ui(key)])) as SearchLabels
  return <div className={styles.archive}>
    <JsonLd data={breadcrumbsSchema(crumbs)} />
    <header className={styles.header}>
      <p className={styles.eyebrow}>{t("eyebrow")}</p>
      <h1>{topic ? topics(topic) : t("heading")}</h1>
      {!topic && <p>{t("intro")}</p>}
      <p className={styles.count}>{topic ? ui("topicCount", { count }) : t("count", { count })}</p>
      {page > 1 && <p>{ui("pageOf", { page, total })}</p>}
    </header>
    <BlogResults key={`${locale}:${topic ?? "all"}:${page}`} locale={locale} topic={topic} labels={searchLabels}
      filters={<TopicPills locale={locale} active={topic} label={ui("filterLabel")} topics={[
        { label: t("all"), count: allPosts.length },
        ...TOPICS.filter((item) => counts[item.slug] > 0).map((item) => ({ slug: item.slug, label: topics(item.slug), count: counts[item.slug] })),
      ]} />}>
      <section aria-labelledby="archive-posts">
        <h2 id="archive-posts" className={styles.sectionTitle}>{!topic && page === 1 ? ui("latest") : ui("articles")}</h2>
        <ArchiveGrid locale={locale} hero={!topic && page === 1} posts={posts.map((post) => ({
          slug: post.slug, title: post.title, description: post.description, date: post.date, cover: heroImage(post),
          topicLabel: topics(primaryTopic(post).slug), readTime: ui("readTime", { minutes: post.readingTime }),
        }))} />
      </section>
      <ArchivePager locale={locale} page={page} total={total} topic={topic} labels={{
        pager: ui("pager"), previous: ui("previous"), next: ui("next"), pageOf: ui("pageOf", { page, total }),
        pages: Object.fromEntries(Array.from({ length: total }, (_, i) => [i + 1, ui("page", { page: i + 1 })])),
      }} />
    </BlogResults>
  </div>
}
