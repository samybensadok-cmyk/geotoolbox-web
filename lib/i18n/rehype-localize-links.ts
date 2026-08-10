import { makeLocalizer } from "./siblings"

// Rehype counterpart to the `a` component override in components/mdx/index.tsx.
// The component map only localizes anchors that next-mdx-remote routes through
// it; anchors written as RAW HTML inside the MDX (e.g. the `<table>` comparison
// grids every article uses) render with their authored EN href untouched, so a
// FR/ES reader is bounced to the English page. This plugin walks the rendered
// hast tree and rewrites the href of EVERY `<a>` element via the SAME
// donor-slug sibling map (makeLocalizer) that drives the component override and
// hreflang — so markdown links and raw-HTML links localize identically and can
// never point at different siblings.
//
// makeLocalizer only touches internal /blog|/glossary paths with a sibling in
// this locale; external links, /go/ affiliate links, and already-localized
// /<locale>/... links are returned unchanged. Idempotent with the component
// override (re-running localize on an already-localized href is a no-op), and a
// no-op for the default locale (en), where it should not be wired in at all.
// Anchors reach the rehype stage in two shapes: markdown-origin links are hast
// `element` nodes (tagName/properties); anchors written as raw HTML/JSX in the
// MDX source (the `<table>` grids) are `mdxJsxTextElement`/`mdxJsxFlowElement`
// nodes (name/attributes) — the SAME reason raw HTML bypasses the components
// map. We must handle both, or the raw-HTML links this plugin exists to fix are
// silently skipped.
type MdxJsxAttribute = { type: string; name?: string; value?: unknown }
type HastNode = {
  type: string
  tagName?: string
  name?: string
  properties?: { href?: unknown; [k: string]: unknown }
  attributes?: MdxJsxAttribute[]
  children?: HastNode[]
}

function walk(node: HastNode, localize: (href: string) => string): void {
  // markdown-origin anchor
  if (
    node.type === "element" &&
    node.tagName === "a" &&
    node.properties &&
    typeof node.properties.href === "string"
  ) {
    node.properties.href = localize(node.properties.href)
  }
  // raw-HTML / JSX-origin anchor
  if (
    (node.type === "mdxJsxTextElement" || node.type === "mdxJsxFlowElement") &&
    node.name === "a" &&
    Array.isArray(node.attributes)
  ) {
    for (const attr of node.attributes) {
      // skip mdxJsxExpressionAttribute (no name) and expression-valued hrefs
      if (attr.type === "mdxJsxAttribute" && attr.name === "href" && typeof attr.value === "string") {
        attr.value = localize(attr.value)
      }
    }
  }
  if (node.children) for (const child of node.children) walk(child, localize)
}

// Returns a rehype plugin bound to `locale`. Wire into rehypePlugins ONLY for
// non-default locales: `...(isFr ? [rehypeLocalizeLinks(locale)] : [])`.
export function rehypeLocalizeLinks(locale: string) {
  const localize = makeLocalizer(locale)
  return () => (tree: HastNode) => walk(tree, localize)
}
