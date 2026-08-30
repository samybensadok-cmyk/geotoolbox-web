#!/usr/bin/env node
// Brand-suffix gate: article + glossary <title> tags must NOT carry " | GEO Toolbox".
//
// Why: the root metadata template (lib/root-metadata.ts) appends " | GEO Toolbox" (+14 chars)
// to every route that doesn't opt out with `title: { absolute: ... }`. Forensic audit 2026-08-30
// found Google STRIPS that suffix from 38 of 40 sampled SERP appearances, re-adds the site name
// on its own terms anyway, and never routes AI-Overview brand attribution through the title tag
// (that rides the citation's own `source` field). Meanwhile the +14 chars pushed 87% of EN posts
// past the ~60-char display budget, truncating the differentiating half of the title instead.
// Full evidence: seo-audits/geotoolbox-main/TITLE-BRAND-SUFFIX-AUDIT-2026-08-30.md
//
// Two regression vectors, both gated here:
//   (A) someone drops the `absolute` opt-out from a route  -> template suffix silently returns
//   (B) someone hand-writes the suffix into frontmatter/i18n -> suffix returns on one page
//
// Run: node scripts/check-title-suffix.mjs   (exit 1 on any violation)
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const BRAND = 'GEO Toolbox';
// Matches "| GEO Toolbox", "- GEO Toolbox", "– GEO Toolbox" etc. at end of a title string.
const SUFFIX = /[|\-–—:·]\s*GEO\s*Toolbox\s*$/i;

// Routes that MUST opt out of the template. If one of these files is renamed or moved,
// the gate FAILS rather than silently passing — a guard that can't find its target has
// not checked anything.
const MUST_BE_ABSOLUTE = [
  'app/[locale]/blog/[slug]/page.tsx',
  'app/[locale]/glossary/[slug]/page.tsx',
];

let violations = 0;
const fail = (msg) => { console.error(`  ${msg}`); violations++; };

// --- (A) route-level opt-out still present -----------------------------------
for (const route of MUST_BE_ABSOLUTE) {
  if (!existsSync(route)) {
    fail(`MISSING ROUTE ${route} — gate cannot verify the opt-out. Update MUST_BE_ABSOLUTE in this script if the route moved.`);
    continue;
  }
  const src = readFileSync(route, 'utf8');
  // Accept `title: { absolute: <anything> }` in the generateMetadata return.
  if (!/title:\s*\{\s*absolute:/.test(src)) {
    fail(`${route}  title is NOT { absolute: ... } — the "%s | ${BRAND}" template will be appended to every article in every locale.`);
  }
}

// --- (B) no hand-written suffix in content frontmatter ------------------------
function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (name.endsWith('.mdx')) out.push(p);
  }
  return out;
}

const contentFiles = walk('content');
if (contentFiles.length === 0) {
  fail('walked content/ and found 0 .mdx files — gate would pass vacuously. Check the path.');
}
for (const file of contentFiles) {
  const head = readFileSync(file, 'utf8').slice(0, 3000);
  for (const field of ['title', 'term']) {
    const m = head.match(new RegExp(`^${field}:\\s*"?(.*?)"?\\s*$`, 'm'));
    if (m && SUFFIX.test(m[1])) {
      fail(`${file}  ${field}: ends with the brand suffix -> "${m[1]}". Remove it; Google supplies the site name.`);
    }
  }
}

// --- (B2) no hand-written suffix in the i18n patterns that feed ARTICLE routes ---
// Scoped deliberately. Marketing surfaces (home, pricing, features, featurePages,
// services, tools) carry the brand IN-STRING via `title: { absolute: t("title") }`
// and are OUT of scope for the 2026-08-30 decision: they are already inside the
// ~60-char budget with the brand, and they take branded queries where it earns its
// place. That is a separate call to revisit, not an oversight — see the audit's §6.
// Only namespaces that render article/glossary <title>s are gated here.
const ARTICLE_NAMESPACES = ['glossary', 'blog'];
// Glob, never a hardcoded locale list: DE/NL/IT/PT are queued, and a hardcoded list
// silently leaves a new locale ungated. (Same drift that left ES unchecked in the FAQ
// gate until 2026-08-21.)
const msgFiles = existsSync('messages')
  ? readdirSync('messages').filter((f) => f.endsWith('.json')).map((f) => join('messages', f))
  : [];
if (msgFiles.length === 0) fail('found 0 messages/*.json files — i18n gate would pass vacuously.');
for (const msgFile of msgFiles) {
  const json = JSON.parse(readFileSync(msgFile, 'utf8'));
  let scanned = 0;
  const scan = (node, path) => {
    if (typeof node === 'string') {
      if (/(title|metaTitle|indexTitle|ogTitle)$/i.test(path)) {
        scanned++;
        if (SUFFIX.test(node)) fail(`${msgFile}  ${path} -> "${node}" hand-writes the brand suffix.`);
      }
      return;
    }
    if (node && typeof node === 'object') for (const [k, v] of Object.entries(node)) scan(v, `${path}.${k}`);
  };
  for (const ns of ARTICLE_NAMESPACES) if (json[ns]) scan(json[ns], ns);
  if (scanned === 0) fail(`${msgFile}: scanned 0 title keys under [${ARTICLE_NAMESPACES}] — namespaces renamed? Gate would pass vacuously.`);
}

if (violations) {
  console.error(`\n✗ Title brand-suffix gate FAILED: ${violations} violation(s).`);
  console.error(`  Article titles must not carry " | ${BRAND}". See TITLE-BRAND-SUFFIX-AUDIT-2026-08-30.md`);
  process.exit(1);
}
console.log(`✓ Title brand-suffix gate: ${MUST_BE_ABSOLUTE.length} routes opt out of the template, ${contentFiles.length} content files clean.`);
