// node scripts/spike-blog-thumbnails.mjs /absolute/path/to/thumb-spike.txt
import "./lib/register-app-modules.mjs"
import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, isAbsolute } from "node:path"
const { getAllPosts } = await import("../lib/content.ts")
const { classifyCluster } = await import("../lib/og/blog-card.tsx")
const { renderBlogThumbnail } = await import("../lib/og/blog-thumbnail.ts")

const output = process.argv[2]
if (!output || !isAbsolute(output)) throw new Error("Supply an absolute output log path")
const posts = ["en", "fr", "es", "de"].flatMap((locale) => getAllPosts(locale))
const selected = []
// Cover each available locale/cluster pair, then spread across the remaining posts.
for (const locale of ["en", "fr", "es", "de"]) {
  for (const cluster of ["comparison", "concept", "commercial", "default"]) {
    const post = posts.find((post) => post.locale === locale && classifyCluster(post) === cluster)
    if (post) selected.push(post)
  }
}
for (let i = 0; selected.length < 20 && i < posts.length; i++) {
  const post = posts[Math.floor(i * posts.length / 20) % posts.length]
  if (!selected.includes(post)) selected.push(post)
}
const rows = []
for (const post of selected.slice(0, 20)) {
  const start = performance.now()
  const response = renderBlogThumbnail(post)
  const buffer = Buffer.from(await response.arrayBuffer())
  const milliseconds = performance.now() - start
  if (!response.headers.get("content-type")?.startsWith("image/svg+xml") || !buffer.toString("utf8").startsWith('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"')) throw new Error("Invalid SVG response")
  rows.push({ locale: post.locale, slug: post.slug, cluster: classifyCluster(post), milliseconds: +milliseconds.toFixed(2), bytes: buffer.length })
}
const sortedBytes = rows.map((row) => row.bytes).sort((a, b) => a - b)
const p95Bytes = sortedBytes[Math.ceil(rows.length * .95) - 1]
const maxMilliseconds = Math.max(...rows.map((row) => row.milliseconds))
const passed = p95Bytes <= 40000 && maxMilliseconds <= 400
const report = [...rows.map((row) => JSON.stringify(row)), JSON.stringify({ renders: rows.length, p95Bytes, maxMilliseconds, byteLimit: 40000, renderLimitMs: 400, passed })].join("\n") + "\n"
mkdirSync(dirname(output), { recursive: true })
writeFileSync(output, report)
console.log(report)
if (!passed) process.exitCode = 1
