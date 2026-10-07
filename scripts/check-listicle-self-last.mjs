#!/usr/bin/env node
// Listicle self-placement gate: in every comparison table and numbered tool list, the site's own
// product (geotoolbox) must be LAST. Operator rule 2026-10-07: humility, we are new, so we never
// sit first (or anywhere but last) in a ranked list, in EN or any locale twin.
//
// Checks (all locales under content/*/blog and content/blog):
//   (A) any <table> with >= 4 data rows that contains a geotoolbox row: that row must be the last
//       data row, except when every row after it is an INCUMBENT row (the product the article is
//       about, e.g. "Ahrefs (staying put)"): those are reference rows, not ranked alternatives.
//   (B) numbered headings `### N. Name`: the geotoolbox heading must carry the highest N.
//   (C) unnumbered H3 entries: in an H2 section with >= 4 H3s, our H3 is the last (footnote headings excepted).
//
// Why a gate: the rule lived only in prose and 9 listicles (+ twins) had drifted. See
// seo-audits/geotoolbox-main/LISTICLE-SELF-PLACEMENT-AUDIT-2026-10-07.md
//
// Run: node scripts/check-listicle-self-last.mjs   (exit 1 on any violation)
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const OURS = /geo\s?toolbox/i;
// Tools an "alternatives" article is ABOUT: their own table row (the incumbent) may follow ours.
const SUBJECTS = ['semrush', 'ahrefs', 'profound', 'peec'];
// H3 headings that are explicit non-entries (footnotes / locale addenda) and may follow our entry.
const FOOTNOTE_H3 = /radar|also worth|aussi [àa] surveiller|également sur|auch auf dem|acteurs europ|outils fran[cç]ais|cas des outils|actores europeos|deutsche|dach/i;

const dirs = [];
if (existsSync('content/blog')) dirs.push('content/blog');
if (existsSync('content')) {
  for (const d of readdirSync('content', { withFileTypes: true })) {
    if (d.isDirectory() && d.name !== 'blog' && existsSync(join('content', d.name, 'blog'))) {
      dirs.push(join('content', d.name, 'blog'));
    }
  }
}
if (dirs.length === 0) {
  console.error('MISSING content dirs: gate cannot verify anything');
  process.exit(1);
}

let violations = 0;
let tablesChecked = 0;
let listsChecked = 0;
const fail = (msg) => { console.error(`  ${msg}`); violations++; };
const text = (h) => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim();

for (const dir of dirs) {
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.mdx')) continue;
    const path = join(dir, f);
    const src = readFileSync(path, 'utf8');
    if (!OURS.test(src)) continue;

    // (A) tables
    let ti = 0;
    for (const m of src.matchAll(/<table>([\s\S]*?)<\/table>/g)) {
      ti++;
      const rows = [...m[1].matchAll(/<tr>([\s\S]*?)<\/tr>/g)]
        .map((r) => [...r[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((c) => text(c[1])))
        .filter((cells) => cells.length > 0);
      if (rows.length < 4) continue;
      const first = rows.map((r) => r[0]);
      const idx = first.findIndex((c) => OURS.test(c));
      if (idx === -1) continue;
      tablesChecked++;
      const after = first.slice(idx + 1);
      const subjMatch = src.match(/^donorSlug:\s*"?([^"\n]+)"?/m);
      const subject = ((subjMatch ? subjMatch[1] : f.replace(/\.mdx$/, '')) + '').toLowerCase();
      // A trailing row is exempt ONLY if it is the incumbent: it starts with the subject tool's name
      // (the tool the article is an alternative to). A bare "(staying put)" label is not enough.
      const isIncumbent = (c) =>
        SUBJECTS.some((n) => subject.includes(n) && c.toLowerCase().startsWith(n));
      if (after.length > 0 && !after.every(isIncumbent)) {
        fail(`${path} table #${ti}: geotoolbox is row ${idx + 1} of ${rows.length}, must be last (next row: "${after[0].slice(0, 40)}")`);
      }
    }

    // (C) unnumbered H3 entries: inside an H2 section that has >= 4 H3s, our H3 must be the last
    //     H3 except for explicit footnote/addendum headings.
    for (const sec of src.split(/^## /m).slice(1)) {
      const h3 = [...sec.matchAll(/^### (.+)$/gm)].map((m) => m[1]);
      if (h3.length < 4) continue;
      const oi = h3.findIndex((h) => OURS.test(h) && !/^\d+[.)]/.test(h));
      if (oi === -1) continue;
      listsChecked++;
      const after = h3.slice(oi + 1).filter((h) => !FOOTNOTE_H3.test(h));
      if (after.length > 0) fail(`${path}: H3 "${h3[oi].slice(0, 30)}" is followed by tool heading "${after[0].slice(0, 30)}" in its section, must be last`);
    }

    // (B) numbered headings
    const numbered = [...src.matchAll(/^#{2,3}\s+(\d+)[.)]\s+(.+)$/gm)].map((m) => ({ n: Number(m[1]), name: m[2] }));
    if (numbered.length >= 4) {
      const ours = numbered.find((h) => OURS.test(h.name));
      if (ours) {
        listsChecked++;
        const max = Math.max(...numbered.map((h) => h.n));
        if (ours.n !== max) fail(`${path}: numbered entry "${ours.n}. ${ours.name.slice(0, 30)}" is not the last (last is ${max})`);
      }
    }
  }
}

if (violations > 0) {
  console.error(`\n✗ Listicle self-last gate: ${violations} violation(s). geotoolbox must be listed LAST (rule 2026-10-07).`);
  process.exit(1);
}
if (tablesChecked === 0 && listsChecked === 0) {
  console.error('✗ Listicle self-last gate checked nothing (0 tables, 0 numbered lists): the gate is broken or the content moved.');
  process.exit(1);
}
console.log(`✓ Listicle self-last gate: ${tablesChecked} tables and ${listsChecked} numbered lists checked, geotoolbox last in all.`);
