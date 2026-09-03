# DE localization — geotoolbox.ai marketing / feature / pricing

**COMPLETE as of 2026-09-03.**

> ⚠️ The copy committed at `~/Desktop/seo-audits/de-localization-2026-09-03/`
> (seo-audits `04bef03ab4`) is **STALE** — it says IN FLIGHT, lists the Codex fixes as unapplied
> and the header fix as unverified. All three are now done. Overwrite it with this directory:
> `rsync -a --delete ~/geotoolbox-web/.de-localization-artifacts/ ~/Desktop/seo-audits/de-localization-2026-09-03/`
 Branch `de-localization-2026-09` in `~/geotoolbox-web`,
**5 commits, NOT pushed.** Everything below is on disk.

## What shipped

| Commit | What |
|---|---|
| `ef9fa53` | `de` wired into routing, sitemap, hreflang, billing, gates |
| `e322cdf` | `messages/de.json` — 1,937 strings |
| `e5d3cf7` | header nav fix at the `md` breakpoint |
| `af10624` | three-model QA round applied (Codex + Sonnet + Fable) |
| `793dc77` | header fix cold-cache verification recorded |

Scope: `/de` home, `/de/features` + 14 feature detail pages, `/de/pricing`, site chrome, and the
three legal routes. `app/(marketing)/*` (about/contact/services/tools) stays EN, exactly as FR/ES.
`/de/blog`, `/de/glossary`, `/de/privacy` **404 by design** — `de` is deliberately not in
`contentLocales`/`glossaryLocales`.

**Operator decisions (settled):** informal **`du`** · **EUR at identical numeric amounts**
($99 → 99 €), mirroring FR · legal routes mirror FR/ES with canonical EN text.

## Gates — all green
`check:messages` (new this session) · `check:pricing` · `check:titles` · `check:agents` ·
`tsc --noEmit` · `build` · `check:headings` · `de-lint.mjs` (0 ERROR, 1 known-good WARN).

## Rendered verification — done, cold cache
768 px (iPad portrait, the `md` breakpoint) was pushing the page into horizontal scroll in every
non-English locale. Fixed and **verified**: de 27→0, fr 34→0, es 4→0, en 0→0. 375/780/800/900/
1024/1280 clean in all four locales. The check aborts unless a CSS probe first proves the new
stylesheet is loaded — a stale one silently reproduces the pre-fix numbers, which is exactly the
trap the first verification attempt fell into.

## QA round — all three reviewers landed, all findings applied
Full reports: `QA-FINDINGS-fable-fluency.md`, `QA-FINDINGS-sonnet-consistency.md` (this dir).

- **Fable ruled: „Zitate" stays**, do not sweep to „Zitationen" — the German market settled the
  *verb* („zitiert werden"), the noun is genuinely split, and „Zitation" is bibliometric register.
  Its compound-spelling sweep IS applied (closed when both halves German, hyphen only with a
  foreign element; `Zitat-Ausschnitte` exempt because there it really means a quoted passage).
- **Sonnet** found bare „Sichtbarkeit" in 7 home strings (the SISTRIX Sichtbarkeitsindex trap),
  one „Nennung" for „mention", and „Agent Readiness" fused into three German compounds. Fixed.
- **Codex** found the primary promise had drifted from the reader's *brand* to the reader,
  "brand monitoring" flattened to generic visibility, a citation weakened to a mere mention, and
  an outcome asserted where EN only checks. Fixed.

Brand suffix resolved **globally**: marketing + feature titles keep „ | GEO Toolbox" (all 42
shipped en/fr/es titles carry it; the ban is scoped to blog/glossary). Ten DE titles were
rewritten — not truncated — to fit; all 17 are ≤ 60 chars.

## ⚠️ The one gap
Fable hit its session limit mid-message. It had found but never transmitted: **3 grammar
BLOCKERs** (one being bare „Brief" — which is a *letter* in German, the word is „Briefing";
grepped afterwards: **0 occurrences remain**, `de-fp-b` had already fixed it), a handful of
unspecified **calques**, and its verdicts on three flagged calls: `home.playbook.eyebrow`
„Das Playbook" vs „Das Handbuch" (the message was cut at „**K**…", so almost certainly "Keep"),
the English evidence grades on citation-interceptor, and „Thread"/„Subreddit" on community.
Re-spawn a Fable reviewer scoped to just those if you want them closed properly.

## Findings in other locales
**Fixed in `messages/fr.json`:** the homepage FAQ said „Starter est à 99 **$**/mois" on a page
that quotes € everywhere and checks out with `&currency=eur` — the visitor was told $99 and
charged 99 €. `pricing.cards.money` used a plain space before € so „99" could wrap away from its
symbol (now U+00A0). `nav.services` was missing entirely.

**Flagged, not changed (your call):** `messages/en.json:3051` „**Geotoolbox** shows the evidence"
is the lone stray brand form in EN prose. ES `home.playbook.faqs[12].a` writes „99 $/mes" where
the rest of ES writes „$99/mes" (ES is genuinely USD, only placement differs). FR `/pricing` meta
title is 66 chars — the justification for keeping the brand suffix is "they fit inside 60".

## NEXT
0. **FIRST: apply `GLOSSARY-APPEND-PENDING.md`** to
   `~/Desktop/seo-audits/.claude/skills/article-localization/references/de-glossary-and-lessons.md`.
   It holds two live Part-1 contradictions (the `AI Visibility Tracker` product-name-vs-descriptor
   double row; `Geo Scan` should be `GEO Scan` per `lib/config.ts`) and seven Part-4 entries
   including Fable's settled „Zitate" ruling. The glossary was EPERM all session so none of it
   could be written. A lesson that isn't in the glossary gets re-derived on the next locale.
1. `git push` — this is a branch; Vercel deploys on push to `main`, so it needs a merge or a
   deliberate branch deploy. Then verify `geotoolbox.ai/de` live.
2. **Impressum (DDG §5) + a German Datenschutzerklärung** — deliberately deferred, still open.
   A German-facing site legally wants one; `/de/legal` currently mirrors FR/ES.
3. Optional: the Fable gap above.
4. Note another session committed `82de1b4` (a Fable 5.1 article) onto this branch.

## Tooling (this dir, all re-runnable)
`merge.mjs` (rebuild de.json from units, EN key order) · `de-lint.mjs` (German defect list;
its Sie-check is sentence-initial-aware — a naive `\bSie\b` is invalid in German) ·
`restore-title-suffix.mjs` · `units/` + `out/` · `de.json.FINAL` (the shipped bundle) ·
`BRIEF.md` · `QA-BRIEF.md` · `DE-KEYWORD-RESEARCH-2026-09-03.md`.
In the repo: `scripts/check-messages-parity.mjs` (`npm run check:messages`), `lib/i18n/currency.ts`.
