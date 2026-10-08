// node scripts/check-blog-reserved-slugs.mjs
import { readdirSync } from "node:fs"
import { join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

export function reservedBlogSlugs(contentRoot) {
  const failures = []
  function visit(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name)
      if (entry.isDirectory()) visit(path)
      else if (directory.endsWith(`${process.platform === "win32" ? "\\" : "/"}blog`) && /^(page|topic|search-index)\.mdx$/.test(entry.name)) failures.push(path)
    }
  }
  visit(contentRoot)
  return failures
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const conflicts = reservedBlogSlugs(fileURLToPath(new URL("../content", import.meta.url)))
  if (conflicts.length) {
    console.error(`Reserved blog slugs conflict with archive routes:\n${conflicts.join("\n")}`)
    process.exitCode = 1
  } else console.log("blog-reserved-slugs: no page/topic/search-index conflicts")
}
