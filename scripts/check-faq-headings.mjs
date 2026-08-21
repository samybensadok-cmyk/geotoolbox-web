#!/usr/bin/env node
// FAQ-format gate: FAQ questions MUST be `### H3` headings, never `**bold**` paragraphs.
// Both parse into valid FAQPage schema (lib/content.ts extractFaq accepts both) — which is
// exactly why bold questions slip past schema-based QA silently. This is the mechanical
// backstop. Origin: 2026-06-27 bold→H3 sweep didn't update the article template, so every
// post after it reverted to bold; operator caught the regression 2026-07-13 (36 files).
// Run: node scripts/check-faq-headings.mjs  (exit 1 on any violation)
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'content';
// KEEP IN SYNC with lib/content.ts extractFaq's heading alternation — every
// locale's house FAQ H2 (EN/FR/ES/DE/NL). If they drift, this gate silently
// skips a locale's FAQ sections (that is how ES went unchecked until 2026-08-21).
const FAQ_H = /^##\s+(frequently asked questions|faqs?|foire aux questions|questions fr[ée]quentes|preguntas frecuentes|h[äa]ufige fragen|veelgestelde vragen)\s*$/i;
const BOLD_Q = /^\*\*.*\*\*$/; // a whole-line bold paragraph inside the FAQ section

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (name.endsWith('.mdx')) out.push(p);
  }
  return out;
}

let violations = 0;
for (const file of walk(ROOT)) {
  const lines = readFileSync(file, 'utf8').split('\n');
  let inFaq = false;
  lines.forEach((line, i) => {
    if (FAQ_H.test(line)) { inFaq = true; return; }
    if (inFaq && /^##\s/.test(line)) inFaq = false;
    if (inFaq && BOLD_Q.test(line.trim())) {
      console.error(`  ${file}:${i + 1}  bold FAQ question -> must be "### ${line.trim().replace(/^\*\*|\*\*$/g, '')}"`);
      violations++;
    }
  });
}

if (violations) {
  console.error(`\n✗ FAQ gate FAILED: ${violations} bold-paragraph FAQ question(s). Convert to "### Question?" headings.`);
  process.exit(1);
}
console.log('✓ FAQ gate passed: all FAQ questions are ### headings.');
