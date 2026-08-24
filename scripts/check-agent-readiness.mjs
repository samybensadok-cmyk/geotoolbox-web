/**
 * Gate: the machine-readable surfaces agents actually read.
 *
 *   npm run check:agents
 *
 * These four files (/llms.txt, /llms-blog.txt, /llms-glossary.txt, /agents.md)
 * plus the 404 recovery body and the homepage Organization JSON-LD are what an
 * agent-readiness scanner grades, and every one of them is GENERATED — so they
 * regress silently. Three failure modes have already happened or were one commit
 * away, and each has an assertion here:
 *
 *   1. SIZE DRIFT. /llms.txt is a navigation index; scanners penalise it past
 *      30,000 characters. It was ~77KB in Aug 2026 because it inlined all 250+
 *      articles. Nothing warned — the corpus just grew. Asserted on the REAL
 *      builder output, not a re-implementation of it.
 *   2. GUIDANCE DRIFT. The when-to-use text ships in two places. Two hand-kept
 *      copies drift within a release, and a stale agent-instruction file is
 *      worse than none — an agent acts on a capability we no longer have. Both
 *      render from lib/agent-guidance.ts; this proves they still do.
 *   3. HALF-FILLED IDENTITY. An Organization node with a contactPoint missing
 *      its channel, or a PostalAddress with a country and no locality, is worse
 *      than omitting the block: validators flag it and agents get a dead end.
 *
 * It also guards the boring things that break agent parsing outright: unbalanced
 * code fences (CommonMark swallows the rest of the document), literal
 * "undefined" leaking from a template, and heading-level skips.
 */
import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import {
  buildLlmsIndex,
  buildBlogIndex,
  buildGlossaryIndex,
  buildAgentsMd,
  LLMS_LOCALES,
  LLMS_TXT_MAX_CHARS,
} from "../lib/llms-index.ts"
import { whenToUseLines, howToCallLines } from "../lib/agent-guidance.ts"
import { markdown404Body, recoveryLinks } from "../lib/agent-404.ts"
import { organizationSchema, postalAddressSchema } from "../lib/seo-schema.ts"
import { siteConfig } from "../lib/config.ts"
import { KNOWN_TOP_LEVEL, isDefinitelyUnknownPath, prefersNonHtml } from "../lib/known-routes.ts"

let failures = 0
const fail = (msg) => {
  console.error(`  ✗ ${msg}`)
  failures++
}
const pass = (msg) => console.log(`  ✓ ${msg}`)

const docs = {
  "/llms.txt": buildLlmsIndex(),
  "/llms-blog.txt": buildBlogIndex(),
  "/llms-glossary.txt": buildGlossaryIndex(),
  "/agents.md": buildAgentsMd(),
  "404 recovery body": markdown404Body("/some/missing/path"),
}

console.log("\nagent-readiness gate\n")

// ── 1. locale list stays in sync with the router ────────────────────────────
{
  const routing = readFileSync("i18n/routing.ts", "utf8")
  const m = routing.match(/locales:\s*\[([^\]]+)\]/)
  if (!m) {
    fail("could not read `locales:` out of i18n/routing.ts — the sync check is blind")
  } else {
    const routerLocales = [...m[1].matchAll(/"([a-z-]+)"/g)].map((x) => x[1])
    const mine = [...LLMS_LOCALES]
    if (routerLocales.join(",") !== mine.join(",")) {
      fail(
        `LLMS_LOCALES [${mine}] != routing.locales [${routerLocales}] — a locale would be missing from every index. Update LLMS_LOCALES in lib/llms-index.ts.`
      )
    } else pass(`locale list in sync with the router (${mine.join(", ")})`)
  }
}

// ── 2. /llms.txt stays an INDEX, not a corpus ───────────────────────────────
{
  const n = docs["/llms.txt"].length
  if (n > LLMS_TXT_MAX_CHARS) {
    fail(
      `/llms.txt is ${n.toLocaleString()} chars, over the ${LLMS_TXT_MAX_CHARS.toLocaleString()} ceiling. Move bulk lists into /llms-blog.txt or /llms-glossary.txt and lower RECENT_LIMIT — do not raise the ceiling.`
    )
  } else {
    pass(`/llms.txt is ${n.toLocaleString()} chars (ceiling ${LLMS_TXT_MAX_CHARS.toLocaleString()})`)
  }
}

// ── 3. structural requirements of an llms.txt / agent instruction file ──────
for (const [name, body] of Object.entries(docs)) {
  if (!/^# \S/m.test(body.split("\n")[0])) fail(`${name} does not start with an H1`)
  if (!/\[[^\]]+\]\(https?:\/\/[^)]+\)/.test(body)) fail(`${name} contains no markdown links`)
  // CommonMark: an unclosed fence swallows the remainder of the document.
  const fences = (body.match(/^(```|~~~)/gm) ?? []).length
  if (fences % 2 !== 0) fail(`${name} has ${fences} code-fence lines — must be even`)
  if (/\bundefined\b|\bNaN\b|\[object Object\]/.test(body)) {
    fail(`${name} leaks a template placeholder (undefined / NaN / [object Object])`)
  }
  if (body.includes(`${siteConfig.url}//`)) fail(`${name} emits a double-slash URL`)
}
if (!failures) pass("all generated docs: H1, markdown links, balanced fences, no placeholder leaks")

// ── 4. when-to-use guidance exists and does not drift ───────────────────────
{
  const llms = docs["/llms.txt"]
  const agents = docs["/agents.md"]
  for (const [name, body] of [["/llms.txt", llms], ["/agents.md", agents]]) {
    if (!body.includes(`## When to use ${siteConfig.name}`)) {
      fail(`${name} has no "## When to use ${siteConfig.name}" section — the agent-instruction check fails without it`)
    }
    if (!body.includes(`## How an agent should call ${siteConfig.name}`)) {
      fail(`${name} has no "how to call" section`)
    }
  }
  const missing = whenToUseLines
    .concat(howToCallLines)
    .filter((l) => l.trim() && (!llms.includes(l) || !agents.includes(l)))
  if (missing.length) {
    fail(`${missing.length} guidance line(s) present in one surface but not the other — both must render from lib/agent-guidance.ts`)
  } else pass("when-to-use + how-to-call guidance present and identical in /llms.txt and /agents.md")

  // Guidance, not marketing: the honest "do not use this for X" half is the
  // part that makes it guidance, and it is the first thing a rewrite drops.
  if (!whenToUseLines.some((l) => /Do \*\*not\*\* reach for/.test(l))) {
    fail('when-to-use guidance has no "Do **not** reach for ..." line — without a scope limit it reads as marketing copy')
  } else pass("when-to-use names the jobs it is NOT right for")
}

// ── 5. 404 recovery body ────────────────────────────────────────────────────
{
  const body = docs["404 recovery body"]
  for (const required of ["/sitemap.xml", "/llms.txt"]) {
    if (!body.includes(`${siteConfig.url}${required}`)) {
      fail(`404 recovery body does not point agents at ${required}`)
    }
  }
  for (const l of recoveryLinks) {
    if (!body.includes(`(${siteConfig.url}${l.href})`)) fail(`404 recovery body is missing ${l.href}`)
  }
  if (!body.includes("/some/missing/path")) fail("404 recovery body does not echo the missing path back")
  if (!failures) pass(`404 recovery body links to all ${recoveryLinks.length} recovery targets and echoes the path`)
}

// ── 6. Organization identity is complete or absent, never half-filled ───────
{
  const org = organizationSchema()
  const cp = org.contactPoint?.[0]
  if (!cp) fail("Organization JSON-LD has no contactPoint")
  else {
    if (!cp.contactType) fail("Organization contactPoint has no contactType")
    if (!cp.email && !cp.telephone) fail("Organization contactPoint has neither email nor telephone")
    if (cp.email && !/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(cp.email)) {
      fail(`Organization contactPoint email is malformed: ${cp.email}`)
    }
  }
  const addr = postalAddressSchema()
  if (addr) {
    if (!addr.addressLocality || !addr.addressCountry) {
      fail("PostalAddress is emitted but missing addressLocality or addressCountry — emit a complete address or none")
    } else pass(`Organization carries a complete PostalAddress (${addr.addressLocality}, ${addr.addressCountry})`)
    // Deep-compare, NOT identity: postalAddressSchema() returns a fresh object every
    // call, so `!==` is always true and this assertion fired the first time an
    // address was actually configured. It had never executed before that, because
    // the address was empty from the day the gate was written — a latent
    // false-positive sitting in a branch no run had reached.
    if (JSON.stringify(org.address) !== JSON.stringify(addr)) {
      fail("postalAddressSchema() output is not attached to the Organization node")
    }
  } else {
    if ("address" in org) fail("Organization has an `address` key with no address configured")
    // Not a failure: the operator may deliberately publish no postal address.
    console.log(
      "  · no PostalAddress configured — org-schema-completeness stays partial by design.\n" +
        "    Set address.addressLocality + address.addressCountry in lib/config.ts to close it."
    )
  }
  if (!org.email) fail("Organization JSON-LD has no top-level email")
  if (!failures) pass("Organization JSON-LD identity is complete for what is configured")
}

// ── 7. no heading-level skips in shared chrome ──────────────────────────────
{
  const footer = readFileSync("components/layout/footer.tsx", "utf8")
  const bad = [...footer.matchAll(/<h([4-6])[\s>]/g)].map((m) => `h${m[1]}`)
  if (bad.length) {
    fail(
      `components/layout/footer.tsx uses ${[...new Set(bad)].join(", ")} — the footer follows an <h2>, so anything below h3 is a heading-level skip on EVERY page. Use <h2> (the classes carry the visual size).`
    )
  } else pass("footer introduces no heading-level skip")
}

// ── 8. routes stay thin wrappers over the tested builders ───────────────────
{
  const wrappers = {
    "app/llms.txt/route.ts": "buildLlmsIndex",
    "app/llms-blog.txt/route.ts": "buildBlogIndex",
    "app/llms-glossary.txt/route.ts": "buildGlossaryIndex",
    "app/agents.md/route.ts": "buildAgentsMd",
  }
  for (const [file, fn] of Object.entries(wrappers)) {
    let src
    try {
      src = readFileSync(file, "utf8")
    } catch {
      fail(`${file} is missing — the route this gate checks does not exist`)
      continue
    }
    if (!src.includes(fn)) {
      fail(`${file} no longer calls ${fn}() — this gate would be testing code the site does not serve`)
    }
  }
  if (!failures) pass("all four routes render from the builders this gate measures")
}

// ── 9. the markdown-404 route allowlist covers every real top-level route ───
{
  // Derive the truth from the app/ directory rather than trusting the constant.
  // A missing segment is invisible in a browser and only breaks agents, which is
  // exactly the failure mode nobody notices — so it gets a mechanical check.
  const seg = []
  const isRouteDir = (dir) => {
    try {
      return readdirSync(dir).some((f) => f === "page.tsx" || f === "route.ts")
    } catch {
      return false
    }
  }
  for (const entry of readdirSync("app", { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const name = entry.name
    if (name.startsWith("(") || name === "[locale]") {
      // Route groups add no path segment; [locale] children are served at the root
      // for the default locale. Either way, their children ARE top-level segments.
      for (const child of readdirSync(join("app", name), { withFileTypes: true })) {
        if (child.isDirectory() && !child.name.startsWith("(") && !child.name.startsWith("[")) {
          seg.push(child.name)
        }
      }
      continue
    }
    if (name.startsWith("[") || name.startsWith("_")) continue
    if (isRouteDir(join("app", name)) || name.includes(".")) seg.push(name)
  }
  // Next.js metadata FILE conventions resolve to extensionless routes with no
  // directory of their own (app/opengraph-image.tsx -> /opengraph-image), so the
  // directory walk above cannot see them.
  for (const f of readdirSync("app")) {
    const m = /^(opengraph-image|twitter-image|apple-icon|icon)\.(tsx|ts|jsx|js)$/.exec(f)
    if (m) seg.push(m[1])
  }
  // Segments carrying a file extension never reach the rule (the extension guard
  // returns first), so they do not need to be listed.
  const missing = [...new Set(seg)].filter((x) => !x.includes(".") && !KNOWN_TOP_LEVEL.has(x))
  if (missing.length) {
    fail(
      `lib/known-routes.ts KNOWN_TOP_LEVEL is missing: ${missing.join(", ")}. ` +
        `Those routes work in a browser but return a markdown 404 to any client that does not ask for text/html — i.e. to AI agents, silently. Add them.`
    )
  } else {
    pass(`markdown-404 allowlist covers all ${new Set(seg).size} top-level routes found in app/`)
  }

  // Behavioural spot-checks on the rule itself.
  const cases = [
    ["/", false], ["/pricing", false], ["/blog/some-post", false], ["/fr/blog/x", false],
    ["/tools/ai-readiness", false], ["/app/?page=login", false], ["/opengraph-image", false],
    ["/blog/post/diagram.png", false], ["/definitely-not-real-xyz", true], ["/nope/deeper", true],
  ]
  for (const [path, expected] of cases) {
    if (isDefinitelyUnknownPath(path) !== expected) {
      fail(`isDefinitelyUnknownPath(${path}) should be ${expected} — the markdown-404 rule would ${expected ? "miss a 404" : "hijack a real page"}`)
    }
  }
  if (!prefersNonHtml("*/*") || !prefersNonHtml(null) || prefersNonHtml("text/html,application/xhtml+xml")) {
    fail("prefersNonHtml() is misclassifying clients — browsers must keep the HTML 404")
  }
}

console.log("")
if (failures) {
  console.error(`agent-readiness gate FAILED — ${failures} problem(s)\n`)
  process.exit(1)
}
console.log("agent-readiness gate passed\n")
