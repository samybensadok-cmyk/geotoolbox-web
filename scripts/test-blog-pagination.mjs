// node --experimental-strip-types scripts/test-blog-pagination.mjs
import assert from "node:assert/strict"
import { pageCount, paginate, paginationParams, parseArchivePage, archivePath, pagerItems } from "../lib/blog-pagination.ts"

for (const shape of ["main", "topic"]) {
  const expected = shape === "main" ? [0, 1, 1, 1, 2, 2] : [0, 1, 1, 2, 2, 3]
  for (const [i, count] of [0, 1, 12, 13, 24, 25].entries()) {
    const posts = Array.from({ length: count }, (_, n) => n)
    assert.equal(pageCount(count, shape), expected[i])
    const pages = [1, ...paginationParams(count, shape).map(({ pageNumber }) => Number(pageNumber))]
    assert.deepEqual(pages.flatMap((page) => paginate(posts, page, shape)), posts)
    assert.deepEqual(paginate(posts, expected[i] + 1, shape), [])
    assert.deepEqual(paginate(posts, 0, shape), [])
  }
}
for (const input of ["0", "000", "-1", "2.5", "abc", "", " 2", "2e1", "9007199254740992"]) {
  assert.equal(parseArchivePage(input), undefined, input)
}
assert.equal(parseArchivePage("001"), 1)
assert.equal(parseArchivePage("02"), 2)
assert.equal(archivePath("en", 1), "/blog")
assert.equal(archivePath("nl", 2, "comparisons"), "/nl/blog/topic/comparisons/page/2")
assert.deepEqual(pagerItems(6, 12), [1, "ellipsis", 4, 5, 6, 7, 8, "ellipsis", 12])
console.log("blog-pagination: boundary counts, coverage, parser and pager passed")
