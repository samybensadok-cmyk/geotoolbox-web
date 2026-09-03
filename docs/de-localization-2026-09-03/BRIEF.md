# DE localization brief — geotoolbox.ai marketing/feature/pricing strings

You are producing the German (`de`) message bundle for geotoolbox.ai, an AI-visibility /
GEO (generative engine optimization) SaaS. Audience: German SEO managers, content leads,
in-house marketing teams and SEO agencies. These strings render the HOME, FEATURES,
FEATURE-DETAIL and PRICING pages plus site chrome. There is NO German blog or glossary.

## MANDATORY reading before you write a single string
`/Users/samou/Desktop/seo-audits/.claude/skills/article-localization/references/de-glossary-and-lessons.md`

That file is binding. Part 0 (register), Part 1 (glossary) and Part 2 (defect list) are
not suggestions — every term in Part 1 has ONE canonical German form and you must use it.

## Your inputs
- `units/<UNIT>.en.json` — **the source. Translate from this and only this.**
- `units/<UNIT>.fr.json` and `units/<UNIT>.es.json` — the shipped French and Spanish
  versions of the SAME keys. Use them ONLY to see how a tricky string was handled
  (structure, what got kept in English, how a pun was reworked). Never translate from them.
  Note FR uses formal *vous* and ES informal *tú* — **German uses `du`** (see Part 0).

## Your output
Write `out/<UNIT>.de.json`:
- **Byte-identical key structure to the EN file.** Same keys, same nesting, same array
  order and array LENGTH. No added keys, no dropped keys, no reordering.
- Valid JSON, UTF-8, 2-space indent, real accented characters (no `\uXXXX` escapes).
- Every `{placeholder}` present in the EN string must be present in yours, spelled the
  same. Same for any rich-text tags (`<b>`, `<link>`…). German word order will tempt you
  to drop one — don't.

## Hard rules
1. **Register: informal `du`.** Lowercase `du/dich/dir/dein/deine`. Zero `Sie`/`Ihnen`/`Ihre`.
   Imperative CTAs without the pronoun: „Starte deinen ersten Scan".
2. **Never translate** product names (Geo Scan, Citation Interceptor, Query Fan-Out, Content
   Studio, Agent Readiness, White-Label Reports, Ask GEO Toolbox, Domain Overview, Competitor
   Intel, Analytics, Community, AI Visibility Tracker, PR Coverage Tracker), plan names
   (Starter/Growth/Pro/Scale/Enterprise), engine names (ChatGPT, Gemini, Perplexity, Claude,
   Grok, Copilot, Google AI Mode, **AI Overviews**), or `GEO Toolbox`.
3. **Every number stays exactly as in EN.** 8 engines stays 8, 14 tools stays 14, 99 stays 99,
   2 minutes stays 2. You are translating, not repricing or re-scoping. If EN says "under 2
   minutes", DE says „in unter 2 Minuten" — never „in wenigen Minuten".
4. **Currency = euro, same numeric amount.** EN `$99/mo` → DE `99 €/Monat` (non-breaking
   space U+00A0 before €, exactly as the FR file does it). Never `€99`, never convert the
   number. A `money` template key must be `"{amount} €"` (NBSP), matching FR.
5. **German typography.** Quotes „…" (never "…"). Decimal comma, thousands dot (`1.000`).
   Percent with a space: `30 %`. En dash in ranges: `7–14 Tage`.
6. **Sentence case in headlines**, not English title case. But ALL nouns capitalized —
   including inside buttons („Alle Funktionen ansehen", never „Alle funktionen ansehen").
7. **Keep it tight.** German runs long and these strings sit in nav items, buttons, cards
   and table cells. For any EN string under ~30 characters (nav labels, CTAs, badges, table
   headers, eyebrows), your German must be **no more than ~130 % of the EN character count**.
   Find a shorter synonym or reword the CTA — do not ship a label that will overflow.
8. **Write German, don't transpose English.** Verb-final subordinate clauses, natural
   compounds, verbs over `-ung` nominalizations, split sentences that ran long. If a German
   marketer would not say it out loud, rewrite it. Marketing copy may be re-angled to land
   the same promise natively — but never invent a claim, a number or a feature that is not
   in the EN source.
9. **No Denglisch** beyond the loanwords whitelisted in glossary Part 1.

## When you finish
Re-read your output against glossary Part 2 (the German defect list) and fix what you find,
then report: the unit name, the string count, any EN string you deliberately re-angled
rather than translated (with the reason), and anything you were unsure about.
