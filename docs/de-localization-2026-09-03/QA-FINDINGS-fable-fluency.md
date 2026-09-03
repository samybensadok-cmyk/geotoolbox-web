# QA — Fable, native German voice

**Captured from the agent's report; the agent hit a session limit mid-message, so the tail
(the three grammar BLOCKERs and part of the three flagged calls) is INCOMPLETE — see the gap
note at the bottom.**

## Overall verdict
Reads as German, not as a translation. Register (`du`, lowercase) holds across all 1,937 strings.
Zero Denglisch verbs (`gecheckt/getrackt/performen/Learnings` — grepped, 0 hits), zero title-case
headlines, zero noun-capitalization slips in buttons, no English word order in `weil/dass/wenn`
clauses, `ß/ss` clean (28× `dass`, 5× `muss`, no Swiss forms), quotes and dashes correct.

## THE RULING — „Zitate" STAYS. Do not sweep to „Zitationen".

Keep `Zitat / Zitate / KI-Zitat` as the noun corpus-wide; let **`zitiert werden`** carry the load
in headlines and CTAs; fix the three places where „Zitat" collides with its everyday meaning.

1. **The German market settled the VERB, not the noun.** Every ranking German page frames it as
   „von ChatGPT **zitiert werden**" / „als Quelle **herangezogen** werden" (marktgetrieben.de,
   schweigler.at, Händlerbund, azoora.de all use the verb in H1/title). The noun is genuinely
   split — clicks.digital and nexorbit write „KI-Zitate"; crispycontent.de and geo-tool.com write
   „Zitationen"; dailylead.de just writes „Citations". Neither noun won; the verb did. The corpus
   already leans on the verb (`blogIndex.heading`, `home.hero.h1Lead`, `footer.tagline`,
   `home.features.cards[0].title`) — keep doing that and the noun matters less.
2. **„Zitat" is the nominalization a `du`-register reader forms from the verb.** „Wirst du
   zitiert? → dein Zitat." „Zitation" is bibliometric register (Zitationsanalyse, Zitationsindex)
   — technically closer, but on a `du` marketing page it reads like a university library.
3. **The overflow cost is real and one-directional.** ~25 compound forms get +4 chars each
   (Zitatrate→Zitationsrate, Zitatlücke→Zitationslücke, Perplexity-Zitate→Perplexity-Zitationen —
   that last one is a `home.problem.untracked` chip). 215 occurrences, ~+800 characters, several
   inside chips/cells already at the 130 % ceiling. And „Ein Prompt. Jede KI. Jedes Zitat." →
   „Jede Zitation." kills the headline.
4. **The ambiguity argument is valid but LOCAL.** „Zitat" carries two meanings only on the
   Content Analyzer signals page, where the page's own signals „Inline-Zitate" (outbound source
   links) and „Experten-Zitate" (actual quoted passages) sit next to „zitiert / nicht zitiert"
   (AI citation). That is a naming collision inside one list, not a reason to re-noun the site.

### Corollary sweep (MINOR, mechanical, same pass) — unify compound spelling
The corpus mixes closed and hyphenated forms of the same word:
`Zitatlücke(n)` 8× vs `Zitat-Lücke` 2× · `Zitatanteil` 3× vs `Zitat-Anteil` 1× ·
`Zitatdaten` 4× vs `Zitat-Daten` 1× · `Zitatstatus` 1× vs `Zitat-Status` 1×.

**Rule:** **closed** when both halves are German — `Zitatrate, Zitatlücke, Zitatanteil,
Zitatdaten, Zitatstatus, Zitatzahl, Zitatkarte, Zitatausschnitt`. **Hyphen** only where a
foreign/brand element is involved — `KI-Zitat, Zitat-Tracking, Zitat-Attribution,
Perplexity-Zitate`.

**Exempt from the sweep** (they genuinely mean a quoted passage): `Experten-Zitate` (renamed
anyway), `wörtliche Zitat-Ausschnitte` (`home.playbook.faqs[0].a`, `faqs[3].a`), „wörtlich
übernommene Passagen" (`domain-overview.sections[0].body`, `faqs[3].answer`).

## ⚠️ GAP — what was truncated and never delivered
The agent reported it had found, but did not transmit before dying:
- **3 grammar BLOCKERs**, one of them "the word „Brief"" (bare `Brief` = a letter in German;
  the correct word is `Briefing`. `de-fp-b` independently caught and fixed this in its own unit,
  so the surviving instances are most likely in `home` / `pricing` / other units — **greppable**).
- **A handful of calques** (unspecified).
- **Its verdicts on the three flagged calls**: `home.playbook.eyebrow` „Das Playbook" vs
  „Das Handbuch" (message cut at „**K**…", so the answer was probably „Keep"); the English
  evidence grades (Observed / Hypothesis / Risky-Unproven) on citation-interceptor; and
  „Thread"/„Subreddit" on the community page.

Re-spawn a Fable reviewer scoped to just these if the operator wants them closed properly.
