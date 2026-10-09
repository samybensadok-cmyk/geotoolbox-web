// node --experimental-strip-types --import ./scripts/ts-extensionless-resolve.mjs scripts/test-blog-archive-redirects.mjs
import assert from "node:assert/strict"
import { archiveRedirect } from "../lib/blog-archive-redirects.ts"
for (const locale of ["en", "fr", "es", "de"]) {
  const base = `${locale === "en" ? "" : `/${locale}`}/blog`
  const decide = (suffix) => archiveRedirect(new URL(`https://example.com${base}${suffix}`))
  for (const [input, destination] of [
    ["/page/1", ""], ["/page/01", ""], ["/page/002", "/page/2"],
    ["?page=2", "/page/2"], ["?page=02&page=3", "/page/2"],
    ["?topic=comparisons&tag=ai&page=2", "/topic/comparisons"],
    ["?topic=unknown&page=3", ""], ["?tag=ai&page=3", ""],
    ["?topic=&topic=comparisons", ""], ["?page=2&keep=yes", "/page/2?keep=yes"],
    ["/topic/comparisons/page/01", "/topic/comparisons"],
    ["/topic/comparisons?page=2", "/topic/comparisons/page/2"],
  ]) {
    const result = decide(input)
    assert.deepEqual(result, { status: 308, location: base + destination })
    assert.equal(archiveRedirect(new URL(result.location, "https://example.com")), undefined, "one hop")
  }
  for (const invalid of ["0", "000", "-1", "2.5", "abc", "1e2", "9007199254740992"]) {
    assert.deepEqual(decide(`/page/${invalid}`), { status: 404 })
    assert.deepEqual(decide(`?page=${invalid}`), { status: 404 })
  }
  for (const path of ["", "/page/2", "/topic/comparisons", "/article?page=2", "/article/thumbnail?page=2", "/search-index?page=2"]) {
    assert.equal(decide(path), undefined)
  }
}
assert.equal(archiveRedirect(new URL("https://example.com/tools?page=2")), undefined)
console.log("blog-archive-redirects: all five locales, precedence, duplicates, invalid forms and one-hop redirects passed")
