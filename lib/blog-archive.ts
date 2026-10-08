import { cache } from "react"
import { contentLocales, bcp47 } from "@/i18n/routing"
import { getAllPosts } from "./content"
import { TOPICS, primaryTopic, topicCounts } from "./blog-topics"
import { archivePath, paginationParams } from "./blog-pagination"
import { siteConfig } from "./config"

// Request-scoped memoization keeps metadata and the rendered archive in sync;
// a later ISR render still resolves date tokens afresh.
export const archivePosts = cache((locale: string) =>
  contentLocales.includes(locale as typeof contentLocales[number]) ? getAllPosts(locale) : [])

export function postsForTopic(locale: string, topic?: string) {
  const posts = archivePosts(locale)
  return topic ? posts.filter((post) => primaryTopic(post).slug === topic) : posts
}

export function liveTopicParams(locale: string) {
  const counts = topicCounts(archivePosts(locale))
  return TOPICS.filter((topic) => counts[topic.slug] > 0).map((topic) => ({ topic: topic.slug }))
}

export function archivePageParams(locale: string, topic?: string) {
  return paginationParams(postsForTopic(locale, topic).length, topic ? "topic" : "main")
}

export function archiveLanguages(topic?: string, snapshot = new Map(contentLocales.map((locale) => [locale, archivePosts(locale)]))) {
  const live = contentLocales.filter((locale) => {
    const posts = snapshot.get(locale) ?? []
    return topic ? posts.some((post) => primaryTopic(post).slug === topic) : posts.length > 0
  })
  return Object.fromEntries([
    ...live.map((locale) => [bcp47[locale], `${siteConfig.url}${archivePath(locale, 1, topic)}`]),
    ...(live.includes("en") ? [["x-default", `${siteConfig.url}${archivePath("en", 1, topic)}`]] : []),
  ])
}
