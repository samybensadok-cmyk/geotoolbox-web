# QA — Sonnet, cross-namespace consistency + claim integrity

Captured from the agent's report (it hit a session limit before writing its own file, but the
findings were transmitted in full).

## 1. BLOCKER — bare „Sichtbarkeit" unqualified, 8 strings across 4 namespaces
The glossary's own trap row (unqualified „Sichtbarkeit" reads as the SISTRIX Sichtbarkeitsindex,
the wrong metric). It recurred across independently-translated pages that use „KI-Sichtbarkeit"
correctly elsewhere on the SAME page — `white-label-reports` alone has 5 correct uses and 4 bare.

| Key | Fix |
|---|---|
| `home.problem.missZero` | „0 Sichtbarkeit heute" → „0 KI-Sichtbarkeit heute" |
| `home.playbook.faqs[6].a` | „ob deine Sichtbarkeit wirklich global ist" → „…deine KI-Sichtbarkeit…" |
| `featurePages.ai-visibility-tracker.pain.eyebrow` | „Die Sichtbarkeit, die du nicht siehst" → „Die KI-Sichtbarkeit, …" |
| `featurePages.agent-readiness.outcomes.items[5].body` | „…deine Sichtbarkeit über acht KI-Engines…" → „…deine KI-Sichtbarkeit über alle acht Engines…" (drop the 2nd KI- to avoid a stutter) |
| `featurePages.white-label-reports.how.steps[2].body` | „Sichtbarkeit pro Engine" → „KI-Sichtbarkeit pro Engine" |
| `featurePages.white-label-reports.trust.items[0].body` | „Sichtbarkeit, Zitatrate, Share of Voice" → „KI-Sichtbarkeit, …" |
| `featurePages.white-label-reports.wedge.body` | „Sichtbarkeit Engine für Engine" → „KI-Sichtbarkeit Engine für Engine" |
| `featurePages.white-label-reports.faqs[1].answer` | „Sichtbarkeit pro KI-Engine" → „KI-Sichtbarkeit pro Engine" |

## 2. MAJOR — „mention" rendered „Nennung" instead of the mandated „Erwähnung"
`featurePages.geo-scan.faqs[2].answer`: „…auf ausdrückliche Domain-**Nennungen** und direkte
Zitate…" → „…auf ausdrückliche Domain-**Erwähnungen** und direkte Zitate…".
The only deviation in the whole corpus (6 correct uses elsewhere).

## 3. MAJOR — „Agent Readiness" hyphenated into German compounds; DE is the outlier vs FR/ES
The glossary forbids hyphenating a product name into a German compound. FR and ES keep the brand
string intact on the same keys and translate the descriptor separately; DE fused `KI-` into it.

| Key | Fix |
|---|---|
| `featurePages.agent-readiness.schema.appSubCategory` | „Scanner für KI-Agent-Readiness" → „Scanner für Agent Readiness" |
| `featurePages.agent-readiness.schema.howToName` | „So prüfst du die KI-Agent-Readiness deiner Website" → „…die Agent Readiness deiner Website" |
| `featurePages.agent-readiness.hero.screenshotAlt` | „Agent-Readiness-Report" → „Agent Readiness Report" (or „Report zur Agent Readiness") |

Not requesting a change: `faqs[0].answer` / `faqs[4].question` use „Agent-Readiness-Level" —
that mirrors EN's own inconsistent hyphenation and FR/ES preserved it verbatim. Defensible as-is.

## 4. MINOR (low confidence) — `featurePages.ai-visibility-tracker.wedge.body`
„Content-Studio-Briefs" fuses the product name „Content Studio" into a German compound. FR/ES
avoided it („les briefs Content Studio" / „los briefs de Content Studio"). The glossary carves an
explicit hyphenation exception for White-Label-Reports but not for Content Studio, so the letter
of the rule is broken — though this is normal German compounding once a German noun attaches.
Either „Content Studio-Briefs" or accept-and-move-on. **Note: „Brief" is itself wrong here —
Fable flagged bare „Brief" (= a letter) as a grammar BLOCKER; the word is „Briefing".**

## Confirmed CLEAN — checked exhaustively, do not re-litigate
- **Wettbewerber/Mitbewerber**: 100 % „Wettbewerber" corpus-wide, zero „Mitbewerber"/„Konkurrent".
- **Zitate/Zitationen**: corpus is 100 % „Zitate", nothing leaked (and Fable ruled: keep „Zitate").
- **report/Bericht**: no page mixes both; „White-Label Reports" always stays the product name.
- **Sie-drift**: zero real violations. The 2 raw grep hits are correct feminine „sie" (for „die KI",
  „die Divergenzkarte") — exactly the false-positive pattern the glossary warns about.
- **All 14 feature names + Ask GeoToolBox + GEO Scan**: byte-identical to `lib/config.ts`; checked
  in BOTH directions (translated a product name / left an EN lowercase descriptor in English).
  `pricing.included.items[0]` correctly localized to the German descriptor, matching FR/ES.
- **nav/footer chrome**: 100 % match to glossary Part 1.
- **Numbers/claims**: 8 engines, 14 tools, 29 markets (country list verified name-by-name), credit
  costs (Claude 20 / Grok 31 / others 1–8, Scale 130,000), Ask GeoToolBox limits
  (10/50/100/300/unlimited) — all byte-identical to EN and cross-checked against `lib/plans.ts`
  tier order (Starter < Plus < Pro < Growth < Scale < Enterprise). Currency/decimal formatting
  correct; earlier "mismatches" were false positives from EN comma-thousands vs DE period-thousands.
