/**
 * check-jsx-entity-space.mjs — guards against a Next 16 / oxc JSX-transform bug
 * that silently glues two words together in rendered copy.
 *
 * THE BUG (reproduced on next@16.2.3 with a 17-variant test route, 2026-08-28):
 * a JSX text node loses its LEADING space when all three hold —
 *   1. it follows a sibling (an expression `{x}` OR an element `</strong>`),
 *   2. it spans two or more source lines, and
 *   3. it contains an HTML entity (&apos; &quot; &mdash; &rarr; …).
 * Drop the entity, or keep the node on one line, and the space survives; a
 * literal “—” instead of `&mdash;` also survives. Only the leading space is
 * eaten — a space before a following expression is fine.
 *
 * It shipped real defects: "2.1 Acceptance.You accept" on /terms,
 * ".xml.gzis decompressed" on /tools/sitemap-extractor, "yet.That's the gap"
 * on /services/ai-seo-agency — all live for weeks before anyone noticed.
 *
 * FIX PATTERN: make the space explicit — replace the node's leading run of
 * spaces with `{" "}`. Do NOT just delete the entity: `react/no-unescaped-
 * entities` (on via eslint-config-next) requires it for ' and ".
 *
 * Run: npm run check:jsx     (exit 1 on any hit)
 */
import ts from "typescript"
import { readFileSync, globSync } from "node:fs"

const ENTITY = /&[a-zA-Z#][a-zA-Z0-9]*;/
// Leading spaces/tabs followed by real content. A run that ends in a newline is
// whitespace JSX drops anyway, so it is not this bug and must not be "fixed".
const LEADING = /^[ \t]+\S/

const files = globSync(["app/**/*.tsx", "components/**/*.tsx"]).sort()
const hits = []

for (const file of files) {
  const src = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const visit = (node) => {
    if (ts.isJsxElement(node) || ts.isJsxFragment(node)) {
      node.children.forEach((child, i) => {
        if (i === 0 || !ts.isJsxText(child)) return
        const raw = src.text.slice(child.pos, child.end)
        if (!LEADING.test(raw) || !raw.includes("\n") || !ENTITY.test(raw)) return
        const { line } = src.getLineAndCharacterOfPosition(child.pos)
        hits.push({ file, line: line + 1, snippet: raw.replace(/\s+/g, " ").trim().slice(0, 60) })
      })
    }
    ts.forEachChild(node, visit)
  }
  visit(src)
}

if (hits.length === 0) {
  console.log(`✓ jsx-entity-space gate: ${files.length} files, no glued text nodes`)
  process.exit(0)
}

console.error(`\n✗ jsx-entity-space gate: ${hits.length} text node(s) will render without their leading space\n`)
for (const h of hits) console.error(`  ${h.file}:${h.line}\n     "${h.snippet}…"`)
console.error(`\n  Fix: replace the leading space of each node with {" "} — e.g.\n     </strong> You accept…      →      </strong>{" "}You accept…\n`)
process.exit(1)
