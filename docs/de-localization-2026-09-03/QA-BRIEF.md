# DE localization QA — shared context for all reviewers

## What was built
`messages/de.json` in `~/geotoolbox-web` — the German bundle for the geotoolbox.ai
marketing surface: home, /features + 14 feature detail pages, /pricing, and site chrome
(header/footer/nav). 1,937 strings. **No German blog or glossary content ships** — those
routes 404 by design.

Sources of truth, in priority order:
1. `messages/en.json` — the source language. Every DE string must be faithful to it.
2. `/Users/samou/Desktop/seo-audits/.claude/skills/article-localization/references/de-glossary-and-lessons.md`
   — binding terminology, register and typography rules. Read Parts 0, 0.5, 1 and 2.
3. `DE-KEYWORD-RESEARCH-2026-09-03.md` (this dir) — DataForSEO Germany/de + Ahrefs de +
   a live German SERP. The five terminology decisions in glossary Part 0.5 are settled by
   this data and are NOT open to preference.
4. `messages/fr.json` / `messages/es.json` — the shipped French and Spanish bundles, useful
   for "how was this key handled elsewhere". FR is formal *vous*, ES informal *tú*;
   **German is `du`**.

## Decided, do not re-litigate
- Register: informal **`du`**, lowercase. Zero `Sie`/`Ihnen`/`Ihre`.
- **`AI Overviews`**, **`Google AI Mode`**, **`GEO` / `Generative Engine Optimization`**,
  **`Share of Voice`**, all product names, all plan names, all engine names: stay English.
- **`KI-`** prefix for German concepts (KI-Sichtbarkeit, KI-Suche, KI-Antworten, KI-Engines).
- Currency: euro at the **same numeric amount** as USD ($99 → 99 €, non-breaking space).
  This is correct — the Stripe prices carry `currency_options[eur]` at identical amounts.
- Title tags carry **no brand suffix** and target ~60 characters.

## The one genuinely open question
**„Zitate" or „Zitationen"** for an AI citation. `Zitat` = a quoted passage; `Zitation` = the
act of citing a source. Ahrefs DE ships „Zitate"; Google's own German AI Overview and
gerlach.media use „Zitationen". Search volume cannot arbitrate (both ~170/mo, both polluted).
The corpus currently uses **„Zitate"** consistently. **Only the native-fluency reviewer decides
this.** Whatever wins is applied in ONE corpus-wide sweep, never file-by-file.

## Mechanical gates already run (do not re-do these by eye)
- `npm run check:messages` — key set, value shape, array length, ICU placeholders, rich-text
  tags, and EN-identical leftovers, DE vs EN.
- `npm run check:pricing` — DE pricing digits vs `lib/plans.ts`, compare-table shape, currency symbol.
- `node de-lint.mjs` — Sie-drift, straight quotes, € order/spacing, English thousands separators,
  AI-/KI- prefix, brand suffix in titles, ß/ss, percent spacing.
- `npx tsc --noEmit` and `npm run build`.

Spend your effort on what those cannot see.

## How to report
A markdown list. For each finding: the **exact JSON key path**, the current DE string, your
proposed replacement, and one line of why. Mark each **BLOCKER** (ships a wrong claim, wrong
number, broken grammar, or the wrong register) / **MAJOR** (a German reader notices it's a
translation) / **MINOR** (preference). Do not propose a change you cannot justify against the
EN source, the glossary, or the keyword data — false positives cost more than they save here.
