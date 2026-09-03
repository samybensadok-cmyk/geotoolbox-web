# PENDING glossary edits — paste into `de-glossary-and-lessons.md` when Desktop access returns

The glossary lives at
`~/Desktop/seo-audits/.claude/skills/article-localization/references/de-glossary-and-lessons.md`
and was EPERM for the whole 2026-09-03 session, so these could not be written. **Do this FIRST on
pickup** — the FR glossary's own header says a lesson that isn't in the glossary gets re-derived
on the next article, and this round produced exactly the entries the file exists for.

---

## A. Part 1 corrections — two live contradictions the translators flagged

1. **`AI Visibility Tracker` appears in BOTH lists** — in the never-translate product-name row AND
   as a Core-concepts descriptor row (`AI visibility tracker → KI-Sichtbarkeits-Tracker`). A
   reviewer seeing only one row will flip the other's work back. **Resolve it explicitly:**

   > **Product NAMES are hardcoded English in `lib/config.ts` and render identically in every
   > locale — never translate them.** But EN sometimes writes the same words **lowercase as a
   > descriptor** ("one credit pool across 14 AI visibility tools", "AI visibility tracker" in a
   > plan-features list). Those ARE translated — FR ships „Suivi de visibilité IA". Rule: match
   > EN's own casing. Capitalized = the product, keep English. Lowercase = a descriptor, use
   > `KI-Sichtbarkeits-Tracking`.

2. **`Geo Scan` → `GEO Scan`.** The glossary writes „Geo Scan"; `lib/config.ts` says **`GEO Scan`**.
   The config wins — it is what actually renders.

3. **Promote the citation row from provisional to settled** (see Part 4 entry below): remove the
   „⚠️ PROVISIONAL" marker and the OPEN QUESTION block before Part 2, and add the compound rule.

---

## B. Part 4 mistake-log entries to append

- 2026-09-03 · **home (7 strings), after the rule already existed** · bare „Sichtbarkeit" → „KI-Sichtbarkeit" · caught by the Sonnet consistency pass. **This is the headline lesson of the round: the trap row was written mid-session and broadcast to every translator, and it STILL recurred 7 times inside one namespace — one page carried 5 correct „KI-Sichtbarkeit" uses next to 4 bare ones.** A terminology rule does not hold by being written down; what closed it was a grep (`/(?<![A-Za-zÄÖÜäöüß-])Sichtbarkeit/`) run over the merged bundle. Treat every "never write X bare" rule as needing a mechanical check, not a briefing.
- 2026-09-03 · geo-scan FAQ · „Domain-**Nennungen**" → „Domain-**Erwähnungen**" for EN "mentions" · 1 deviation against 6 correct uses. The citation/mention split is a product distinction, not a synonym choice.
- 2026-09-03 · agent-readiness schema + alt text · „KI-Agent-Readiness", „Agent-Readiness-Report" → „Agent Readiness", „Report zur Agent Readiness" · **a product name must never be fused into a German compound**, and FR/ES kept the brand string intact on the very same keys — DE was the outlier. When DE diverges from BOTH siblings on the same key, that is the tell.
- 2026-09-03 · **RULING, „Zitate" vs „Zitationen" — „Zitate" WINS, question closed** · adjudicated by the Fable native-voice pass. The German market settled the **verb** („von ChatGPT zitiert werden" — marktgetrieben, schweigler, Händlerbund, azoora all use it in H1/title), while the noun is genuinely split (clicks.digital/nexorbit „Zitate"; crispycontent/geo-tool „Zitationen"; dailylead „Citations"). „Zitation" is bibliometric register (Zitationsanalyse/-index) and reads like a university library in `du`-form marketing copy. Cost of the alternative: ~+800 chars over 215 occurrences, several in chips already at the length ceiling, and „Ein Prompt. Jede KI. Jedes Zitat." dies. **Lean on the verb in headlines and CTAs; the noun choice then matters less.**
- 2026-09-03 · **compound rule for Zitat-** · **closed** when both halves are German (`Zitatrate, Zitatlücke, Zitatanteil, Zitatdaten, Zitatstatus, Zitatzahl, Zitatkarte, Zitatsignal, Zitatlandschaft, Zitatergebnis`); **hyphenated** only where a foreign/brand element is involved (`KI-Zitat, Zitat-Tracking, Zitat-Attribution, Zitat-Tracker`). `Zitat-Ausschnitte` is **exempt** — there it genuinely means a quoted passage, the one place the hyphen carries meaning. The corpus had mixed both spellings of the same word (`Zitatlücke` 8× vs `Zitat-Lücke` 2×, etc.).
- 2026-09-03 · titles · **the brand-suffix ban is scoped to blog + glossary only** — all 42 shipped en/fr/es **marketing and feature** `meta.title`s carry „ | GEO Toolbox", and `check-title-suffix.mjs` gates only the content routes. Gate marketing titles on **length**, not on the suffix. Four of the seven translators independently stripped it because the brief said "no brand suffix in any title tag"; that brief line was wrong for this page class. When 10 DE titles then blew the 60-char budget, the fix was **rewriting them in German, never truncating**.
- 2026-09-03 · verification · a rendered-layout check must **first prove the new stylesheet is in the browser**. A stale cached CSS silently reproduces the pre-fix numbers exactly, which reads as "the fix didn't work" — it cost a wrong conclusion once here. Probe a known class (`px-2 lg:px-3` → 12px at ≥1024, 8px below) and abort the run if it disagrees.
