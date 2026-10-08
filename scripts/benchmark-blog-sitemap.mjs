// node scripts/benchmark-blog-sitemap.mjs
import "./lib/register-app-modules.mjs"
process.env.NODE_ENV = "production"
const { default: sitemap } = await import("../app/sitemap.ts")
const start = performance.now()
const entries = sitemap()
console.log(JSON.stringify({ entries: entries.length, milliseconds: +(performance.now() - start).toFixed(2), hubs: entries.filter((entry) => /\/blog\/topic\//.test(entry.url)).length }))
if (entries.some((entry) => /\/blog(?:\/topic\/[^/]+)?\/page\//.test(entry.url))) throw new Error("Paginated archive in sitemap")
