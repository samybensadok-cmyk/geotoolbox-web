# Free tools CRO — 2026-10-06

Branch: codex/free-tools-cro, independent of the service/pricing draft being finished by Claude.

## Scope
Directory and all ten public free-tool pages: shorter hero copy, dark/teal visual system, outputs before input, task-based directory, first long explanation expandable. Existing metadata, schemas, FAQs and tool logic retained.

## Email capture
The existing newsletter backend is /api/subscribe.php via the Replit rewrite. Six tools already had result-stage capture. This change extends it to the robots tester, sitemap extractor, llms generator and robots generator (after copy/download). All use the existing double opt-in, honeypot, minimum fill time, tool:<slug> source and newsletter_signup event. No email gate, report delivery or automatic rescans are promised. No new email service or database was created. Successful delivery and inbox confirmation need a controlled end-to-end check with an authorized test address; do not claim verified delivery from a UI-only check.

## Benchmark observations
Reviewed 2026-10-06. These are category references, not verified SERP rankings or conversion evidence.
- https://ahrefs.com/ai-visibility-checker/ — a brief outcome statement, immediate input, no-signup promise and a clear distinction between a free snapshot and paid monitoring.
- https://www.screamingfrog.co.uk/seo-spider/ — product capabilities and free/paid scope clearly presented.
- https://www.aleydasolis.com/en/seo-resources-tools/ — task-specific tools grouped with learning resources.
Implementation inference: give visitors a clear task and output before explanatory content, then a voluntary next step after value. No guaranteed conversion uplift.

## Verification
TypeScript, JSX entity spacing, FAQ and git whitespace checks passed locally before preview. Follow-up browser review is reported in the PR. Existing local Next/SWC sandbox restrictions prevent a normal local development server. Mobile and real subscription delivery should be verified before merging. Keep secrets and real addresses out of commits and analytics.
