#!/usr/bin/env node
// IndexNow submitter — pings Bing (which feeds ChatGPT Search + Copilot) the
// moment content publishes, instead of waiting days/weeks for a crawl.
//   node scripts/indexnow.mjs --all                # every indexable URL
//   node scripts/indexnow.mjs <url> [url...]       # explicit URLs
//   node scripts/indexnow.mjs --files <path...>    # content file paths -> URLs
// The key is public by design (it only proves we control the host); it lives
// in public/<key>.txt and is auto-discovered below.
import fs from "node:fs"
import path from "node:path"

const HOST = "geotoolbox.ai"
const BASE = `https://${HOST}`
const ENDPOINT = "https://api.indexnow.org/indexnow"

const keyFile = fs.readdirSync("public").find((f) => /^[a-f0-9]{32}\.txt$/.test(f))
if (!keyFile) {
  console.error("No IndexNow key file found in public/")
  process.exit(1)
}
const key = fs.readFileSync(path.join("public", keyFile), "utf-8").trim()

function isIndexable(mdxPath) {
  if (!fs.existsSync(mdxPath)) return true // deleted -> submit so Bing sees the 404
  const head = fs.readFileSync(mdxPath, "utf-8").slice(0, 2000)
  return !/^draft:\s*true/m.test(head) && !/^noindex:\s*true/m.test(head)
}

// content/blog/x.mdx -> /blog/x ; content/fr/blog/x.mdx -> /fr/blog/x ; same for glossary
function fileToUrl(file) {
  const m = /^content\/(?:(fr|es|nl|de)\/)?(blog|glossary)\/([^/]+)\.mdx$/.exec(file)
  if (!m) return null
  if (!isIndexable(file)) return null
  const [, locale, section, slug] = m
  return `${BASE}${locale ? `/${locale}` : ""}/${section}/${slug}`
}

function allUrls() {
  const urls = [
    `${BASE}/`, `${BASE}/blog`, `${BASE}/glossary`, `${BASE}/features`,
    `${BASE}/pricing`, `${BASE}/about`, `${BASE}/contact`,
  ]
  for (const dir of ["app/features", "app/tools"]) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) urls.push(`${BASE}/${dir.replace("app/", "")}/${entry.name}`)
    }
  }
  const contentDirs = ["content/blog", "content/glossary", "content/fr/blog", "content/fr/glossary"]
  for (const dir of contentDirs) {
    if (!fs.existsSync(dir)) continue
    for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"))) {
      const url = fileToUrl(`${dir}/${f}`)
      if (url) urls.push(url)
    }
  }
  return urls
}

const args = process.argv.slice(2)
let urlList
if (args[0] === "--all") {
  urlList = allUrls()
} else if (args[0] === "--files") {
  urlList = args.slice(1).map(fileToUrl).filter(Boolean)
} else {
  urlList = args.filter((a) => a.startsWith("http"))
}

if (!urlList.length) {
  console.log("Nothing to submit.")
  process.exit(0)
}

const payload = {
  host: HOST,
  key,
  keyLocation: `${BASE}/${keyFile}`,
  urlList: [...new Set(urlList)].slice(0, 10000),
}

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
})
console.log(`IndexNow: submitted ${payload.urlList.length} URLs -> HTTP ${res.status}`)
if (!res.ok && res.status !== 202) {
  console.error(await res.text())
  process.exit(1)
}
