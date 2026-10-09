// After building and starting the production server:
// node scripts/check-blog-archive-live.mjs http://localhost:3100
import "./lib/register-app-modules.mjs"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
const { getAllPosts } = await import("../lib/content.ts")
const { TOPICS, primaryTopic } = await import("../lib/blog-topics.ts")
const { archivePath, paginate, pageCount } = await import("../lib/blog-pagination.ts")
const { siteConfig } = await import("../lib/config.ts")
const { bcp47 } = await import("../i18n/routing.ts")
const { default: sitemap } = await import("../app/sitemap.ts")
const origin = process.argv[2]
if (!origin) throw new Error("Supply the running production server URL")
const locales = ["en", "fr", "es", "de"]
const snapshot = new Map(locales.map((locale) => [locale, getAllPosts(locale)]))
const messages = new Map(locales.map((locale) => [locale, JSON.parse(readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), "utf8"))]))
const decode = (text) => text.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map((match) => [match[1].toLowerCase(), decode(match[2])]))
const text = (html) => decode(html.replace(/<[^>]*>/g, ""))
const thumbnails = new Set()
const bytes = []
let checked = 0
async function fetchPath(path, options = {}) {
  return fetch(new URL(path, origin), { redirect: "manual", signal: AbortSignal.timeout(30000), ...options })
}
for (const locale of locales) {
  const posts = snapshot.get(locale)
  const msg = messages.get(locale)
  for (const topic of [undefined, ...TOPICS.map((topic) => topic.slug)]) {
    const group = topic ? posts.filter((post) => primaryTopic(post).slug === topic) : posts
    const shape = topic ? "topic" : "main"
    const total = pageCount(group.length, shape)
    const union = []
    for (let page = 1; page <= total; page++) {
      const path = archivePath(locale, page, topic)
      const response = await fetchPath(path)
      assert.equal(response.status, 200, path)
      assert.equal((await fetchPath(path, { method: "HEAD" })).status, 200, `HEAD ${path}`)
      const html = await response.text()
      const links = [...html.matchAll(/<link\b[^>]*>/g)].map(([tag]) => attrs(tag))
      assert.deepEqual(links.filter((link) => link.rel === "canonical").map((link) => link.href), [`${siteConfig.url}${path}`], path)
      const languages = links.filter((link) => link.hreflang)
      const live = locales.filter((loc) => topic ? snapshot.get(loc).some((post) => primaryTopic(post).slug === topic) : snapshot.get(loc).length)
      const expectedLanguages = page === 1 ? Object.fromEntries([
        ...live.map((loc) => [bcp47[loc], `${siteConfig.url}${archivePath(loc, 1, topic)}`]),
        ...(live.includes("en") ? [["x-default", `${siteConfig.url}${archivePath("en", 1, topic)}`]] : []),
      ]) : {}
      assert.deepEqual(Object.fromEntries(languages.map((link) => [link.hreflang, link.href])), expectedLanguages, `hreflang ${path}`)
      const title = `${topic ? `${msg.blogTopics[topic]} - ` : ""}Blog${page > 1 ? ` - ${msg.blogArchive.page.replace("{page}", page)}` : ""} | ${siteConfig.name}`
      assert.equal(text(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? ""), title, `title ${path}`)
      const headings = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)]
      assert.deepEqual(headings.map((match) => text(match[1])), [topic ? msg.blogTopics[topic] : msg.blogIndex.heading], `H1 ${path}`)
      assert.ok(!/<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html), `indexable ${path}`)
      const cards = [...html.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)].map(([card]) => attrs(card.match(/<a\b[^>]*>/)[0]).href)
      const expected = paginate(group, page, shape).map((post) => `${archivePath(locale)}/${post.slug}`)
      assert.deepEqual(cards, expected, `cards ${path}`)
      union.push(...cards)
      if (total > 1) {
        const nav = [...html.matchAll(/<nav\b[^>]*>[\s\S]*?<\/nav>/g)].map(([nav]) => nav).find((nav) => attrs(nav.match(/<nav\b[^>]*>/)[0])["aria-label"] === msg.blogArchive.pager)
        assert.ok(nav?.includes('aria-current="page"'), `pager ${path}`)
        assert.ok(nav?.includes(`href="${archivePath(locale, 1, topic)}"`), `first page link ${path}`)
        assert.ok(nav?.includes(`href="${archivePath(locale, total, topic)}"`), `last page link ${path}`)
      }
      const crumbs = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
        .map((match) => JSON.parse(match[1])).find((data) => data["@type"] === "BreadcrumbList")
      assert.equal(crumbs?.itemListElement.length, 2 + Number(Boolean(topic)) + Number(page > 1), `breadcrumbs ${path}`)
      for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
        const image = attrs(tag)
        if (image.src?.endsWith("/thumbnail")) thumbnails.add(image.src)
      }
      checked++
    }
    assert.equal(new Set(union).size, group.length, `unique coverage ${locale}/${topic}`)
    const invalid = archivePath(locale, total + 1, topic)
    for (const method of ["GET", "HEAD"]) assert.equal((await fetchPath(invalid, { method })).status, 404, `${method} ${invalid}`)
  }
  const base = archivePath(locale)
  for (const accept of ["text/html", "text/markdown"]) for (const method of ["GET", "HEAD"]) {
    for (const [suffix, status, destination] of [
      ["", 200], ["/page/9999", 404], ["/page/0", 404], ["/page/-1", 404], ["/page/abc", 404], ["/page/2.5", 404],
      ["/page/1", 308, base], ["/page/01", 308, base], ["?page=2", 308, `${base}/page/2`],
      ["?topic=comparisons", 308, `${base}/topic/comparisons`], ["?tag=ai", 308, base],
    ]) {
      const response = await fetchPath(base + suffix, { method, headers: { accept } })
      assert.equal(response.status, status, `${method} ${accept} ${base}${suffix}`)
      if (destination) assert.equal(new URL(response.headers.get("location"), origin).pathname, destination)
    }
  }
  const index = await fetchPath(`${base}/search-index`)
  assert.equal(index.status, 200)
  const records = await index.json()
  assert.equal(records.length, posts.length)
  assert.ok(records.every((post) => post.description.length <= 160 && post.topicLabel === msg.blogTopics[post.topicSlug]))
}
for (const path of thumbnails) {
  const response = await fetchPath(path)
  assert.equal(response.status, 200, path)
  assert.ok(response.headers.get("content-type")?.startsWith("image/svg+xml"), path)
  const buffer = Buffer.from(await response.arrayBuffer())
  assert.ok(buffer.toString("utf8").startsWith('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"'), path)
  assert.ok(buffer.length <= 40000, `${path} is ${buffer.length} bytes`)
  bytes.push(buffer.length)
}
const start = performance.now()
const response = await fetchPath("/sitemap.xml")
assert.equal(response.status, 200)
const xml = await response.text()
const sitemapMilliseconds = performance.now() - start
assert.ok(!/\/blog(?:\/topic\/[^/]+)?\/page\/\d/.test(xml))
process.env.NODE_ENV = "production"
for (const entry of sitemap().filter((entry) => /\/blog(?:\/topic\/[^/]+)?$/.test(entry.url))) {
  assert.ok(xml.includes(`<loc>${entry.url}</loc>`), `sitemap ${entry.url}`)
}
bytes.sort((a, b) => a - b)
console.log(JSON.stringify({ archivePages: checked, thumbnails: bytes.length, thumbnailP95Bytes: bytes[Math.ceil(bytes.length * .95) - 1], sitemapMilliseconds: +sitemapMilliseconds.toFixed(2) }))
console.log("Live archive checks passed. Browser layout, search interactions, Lighthouse and build resource deltas still require separate checks.")
