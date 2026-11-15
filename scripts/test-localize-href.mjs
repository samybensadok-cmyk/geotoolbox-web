/**
 * Regression tests for the body-link localizer (lib/i18n/localize-href.ts) and
 * its markdown counterpart (lib/i18n/localize-markdown.ts).
 *
 *   npm run test:localize
 */
import test from "node:test"
import assert from "node:assert/strict"
import { createHrefLocalizer } from "../lib/i18n/localize-href.ts"
import { localizeMarkdownLinks } from "../lib/i18n/localize-markdown.ts"
import { LOCALIZED_MARKETING_ROUTES } from "../lib/i18n/localized-routes.ts"

const SIBLINGS = { blog: { "what-is-grok": "cest-quoi-grok" }, glossary: {} }
const lookup = (kind, slug) => SIBLINGS[kind][slug]
const fr = createHrefLocalizer("fr", "en", lookup)
const en = createHrefLocalizer("en", "en", lookup)

test("en is a no-op", () => {
  for (const h of ["/features/geo-scan", "/pricing", "/blog/what-is-grok", "https://geotoolbox.ai/pricing"]) {
    assert.equal(en(h), h)
  }
})

test("/features/<slug> and /pricing localize", () => {
  assert.equal(fr("/features/citation-interceptor"), "/fr/features/citation-interceptor")
  assert.equal(fr("/features"), "/fr/features")
  assert.equal(fr("/pricing"), "/fr/pricing")
})

test("suffixes and origin are kept", () => {
  assert.equal(fr("/pricing#plans"), "/fr/pricing#plans")
  assert.equal(fr("/pricing?ref=x"), "/fr/pricing?ref=x")
  assert.equal(fr("/features/geo-scan/"), "/fr/features/geo-scan/")
  assert.equal(fr("https://geotoolbox.ai/pricing"), "https://geotoolbox.ai/fr/pricing")
  assert.equal(fr("https://www.geotoolbox.ai/features/geo-scan#x"), "https://www.geotoolbox.ai/fr/features/geo-scan#x")
})

test("EN-only routes and unrelated paths stay unchanged", () => {
  assert.ok(!LOCALIZED_MARKETING_ROUTES.includes("/features/content-brief"))
  assert.equal(fr("/features/content-brief"), "/features/content-brief")
  assert.equal(fr("/features/geo-scan/extra"), "/features/geo-scan/extra")
  assert.equal(fr("/tools/ai-readiness"), "/tools/ai-readiness")
  assert.equal(fr("/pricing-guide"), "/pricing-guide")
  assert.equal(fr("/app/?page=signup"), "/app/?page=signup")
  assert.equal(fr("https://example.com/pricing"), "https://example.com/pricing")
  assert.equal(fr(""), "")
})

test("idempotent: already-localized links are not re-matched", () => {
  for (const h of ["/fr/pricing", "/fr/features/geo-scan", "/fr/blog/cest-quoi-grok", "https://geotoolbox.ai/fr/pricing"]) {
    assert.equal(fr(h), h)
  }
  for (const h of ["/features/geo-scan", "/pricing", "/blog/what-is-grok"]) {
    assert.equal(fr(fr(h)), fr(h))
  }
})

test("blog links still localize, and keep falling back to EN without a sibling", () => {
  assert.equal(fr("/blog/what-is-grok"), "/fr/blog/cest-quoi-grok")
  assert.equal(fr("https://geotoolbox.ai/blog/what-is-grok#x"), "https://geotoolbox.ai/fr/blog/cest-quoi-grok#x")
  assert.equal(fr("/blog/no-sibling"), "/blog/no-sibling")
})

test("markdown: link targets, autolinks, href attributes and reference definitions", () => {
  const md = [
    "See [grok](/blog/what-is-grok) and [plans](/pricing \"Plans\") or [f](</features/geo-scan>).",
    "Auto <https://geotoolbox.ai/features/geo-scan> and <a href=\"/pricing\">p</a>.",
    "[ref]: /features/query-fanout",
  ].join("\n")
  assert.equal(
    localizeMarkdownLinks(md, fr),
    [
      "See [grok](/fr/blog/cest-quoi-grok) and [plans](/fr/pricing \"Plans\") or [f](</fr/features/geo-scan>).",
      "Auto <https://geotoolbox.ai/fr/features/geo-scan> and <a href=\"/fr/pricing\">p</a>.",
      "[ref]: /fr/features/query-fanout",
    ].join("\n"),
  )
})

test("markdown: code fences, inline code and image assets are never touched", () => {
  const md = [
    "Inline `[x](/pricing)` and ``[y](/features/geo-scan)`` stay, [z](/pricing) changes.",
    "```md",
    "[a](/pricing)",
    "```",
    "~~~",
    "[b](/features/geo-scan)",
    "~~~",
    "![fig](/blog/what-is-grok/figure.png) and [after](/pricing)",
  ].join("\n")
  assert.equal(
    localizeMarkdownLinks(md, fr),
    [
      "Inline `[x](/pricing)` and ``[y](/features/geo-scan)`` stay, [z](/fr/pricing) changes.",
      "```md",
      "[a](/pricing)",
      "```",
      "~~~",
      "[b](/features/geo-scan)",
      "~~~",
      "![fig](/blog/what-is-grok/figure.png) and [after](/fr/pricing)",
    ].join("\n"),
  )
})

test("markdown: idempotent and no-op for en", () => {
  const md = "[a](/pricing) [b](/fr/pricing) [c](/blog/what-is-grok)"
  const once = localizeMarkdownLinks(md, fr)
  assert.equal(localizeMarkdownLinks(once, fr), once)
  assert.equal(localizeMarkdownLinks(md, en), md)
})
