// node scripts/test-blog-archive.mjs
import "./lib/register-app-modules.mjs"
import assert from "node:assert/strict"
const { NextRequest } = await import("next/server")
const { default: middleware } = await import("../middleware.ts")
const { getAllPosts } = await import("../lib/content.ts")
const { primaryTopic, TOPICS } = await import("../lib/blog-topics.ts")
const { paginate, paginationParams, archivePath } = await import("../lib/blog-pagination.ts")
const { generateStaticParams: thumbnailParams } = await import("../app/[locale]/blog/[slug]/thumbnail/route.tsx")
const { generateStaticParams: searchParams } = await import("../app/[locale]/blog/search-index/route.ts")
process.env.NODE_ENV = "production"
const { default: sitemap } = await import("../app/sitemap.ts")
const entries = sitemap()
const byUrl = new Map(entries.map((entry) => [entry.url, entry]))
const thumbnails = thumbnailParams()
const searchLocales = searchParams().map(({ locale }) => locale)
let archives = 0
for (const locale of ["en", "fr", "es", "de"]) {
  const posts = getAllPosts(locale)
  assert.equal(thumbnails.filter((params) => params.locale === locale).length, posts.length)
  assert.equal(searchLocales.includes(locale), posts.length > 0)
  for (const topic of [undefined, ...TOPICS.map((topic) => topic.slug)]) {
    const group = topic ? posts.filter((post) => primaryTopic(post).slug === topic) : posts
    const shape = topic ? "topic" : "main"
    const pages = [1, ...paginationParams(group.length, shape).map(({ pageNumber }) => Number(pageNumber))]
    const union = pages.flatMap((page) => paginate(group, page, shape)).map((post) => post.slug)
    assert.deepEqual(union, group.map((post) => post.slug), `${locale}/${topic}: complete, unique ordered coverage`)
    const path = archivePath(locale, 1, topic)
    const hub = entries.find((entry) => new URL(entry.url).pathname === path)
    assert.equal(Boolean(hub), group.length > 0)
    if (hub) for (const url of Object.values(hub.alternates.languages)) {
      const alternate = byUrl.get(url)
      assert.ok(alternate, `live alternate ${url}`)
      assert.deepEqual(alternate.alternates.languages, hub.alternates.languages, "reciprocal languages")
    }
    archives++
  }
  const base = archivePath(locale)
  for (const accept of ["text/html", "text/markdown"]) {
    for (const method of ["GET", "HEAD"]) {
      for (const [suffix, status, target] of [
        ["/page/01", 308, base], ["?page=2", 308, `${base}/page/2`],
        ["?topic=comparisons&tag=ai&page=2", 308, `${base}/topic/comparisons`],
        ["?tag=ai", 308, base], ["?topic=unknown", 308, base],
        ["/page/0", 404], ["/page/2.5", 404], ["/page/abc", 404],
      ]) {
        const response = middleware(new NextRequest(`https://example.com${base}${suffix}`, { headers: { accept }, method }))
        assert.equal(response.status, status)
        if (target) assert.equal(new URL(response.headers.get("location")).pathname, target)
      }
      for (const suffix of ["", "/page/2", "/topic/comparisons", "/search-index"]) {
        const response = middleware(new NextRequest(`https://example.com${base}${suffix}`, { headers: { accept }, method }))
        assert.ok(!response?.headers.get("x-middleware-rewrite")?.includes("/md/"), "archive must not negotiate to an article twin")
      }
    }
  }
}
assert.ok(!entries.some((entry) => /\/blog(?:\/topic\/[^/]+)?\/page\//.test(entry.url)))
console.log(`blog-archive: ${archives} locale/archive combinations; route-handler params; sitemap reciprocity; middleware GET/HEAD and HTML/markdown passed`)
