// node scripts/test-blog-reserved-slugs.mjs
import assert from "node:assert/strict"
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { reservedBlogSlugs } from "./check-blog-reserved-slugs.mjs"
const root = mkdtempSync(join(tmpdir(), "blog-slug-test-"))
for (const directory of ["blog", "fr/blog", "nl/blog", "es/blog", "glossary"]) mkdirSync(join(root, directory), { recursive: true })
for (const file of ["blog/page-guide.mdx", "fr/blog/topics.mdx", "glossary/page.mdx"]) writeFileSync(join(root, file), "")
assert.deepEqual(reservedBlogSlugs(root), [])
for (const file of ["blog/page.mdx", "fr/blog/topic.mdx", "nl/blog/page.mdx", "es/blog/search-index.mdx"]) writeFileSync(join(root, file), "---\ndraft: true\n---")
assert.deepEqual(reservedBlogSlugs(root).sort(), ["blog/page.mdx", "fr/blog/topic.mdx", "nl/blog/page.mdx", "es/blog/search-index.mdx"].map((file) => join(root, file)).sort())
console.log("blog-reserved-slugs: root and localized conflicts, including drafts, passed")
