# Homepage redesign — review brief

Status: design proposal on `design/homepage-facelift`. Not approved for production.

## Intended result

Make the product easier to understand and evaluate, with a consistent path from the homepage to the Starter trial. Keep the rotating engine headline at the owner's request. Evaluate the design in a working preview before extending it to other templates.

## Evidence and scope

Reviewed the live English homepage, its source, the pricing catalog, five message catalogs, signup-link conventions, analytics helper, and existing product screenshots. This is a qualitative audit. No GA4, Clarity, or account activation data was accessed, so no conversion uplift is claimed.

Observed on the original homepage:

- The hero's main action goes to pricing while a smaller third link goes to a trial. The closing trial action goes to the app root.
- An illustrative hero report is labeled “Live.” Other illustrative metrics appear in several sections.
- Long introductions repeat the scope and process before the visitor reaches pricing.
- Monthly and annual-equivalent prices appear together without one clear visual hierarchy.
- A real Content Analyzer screenshot is available in the repository but absent from the homepage.
- Trial eligibility and card requirements are documented in the plan source. The homepage should expose those terms before the click.

## References

- [Plausible](https://plausible.io/): inspected the live first screen. Useful reference for a direct value proposition, prominent product presentation, and two clear actions.
- [Linear](https://linear.app/): inspected the live first screen. Useful reference for typography, controlled contrast, and showing the interface at a meaningful scale.
- [Mobbin](https://mobbin.com/): the public page was found, but this browser received a 403. No private library or paid screens were accessed or used.

These inform design principles, not copied layouts, assets, claims, or assumed conversion performance.

## Two directions

**A — light product presentation (recommended starting point):** off-white opening, deep green type, restrained teal emphasis, centered positioning, compact product illustration. The report and typography carry the visual interest.

**B — dark editorial opening:** left-aligned positioning, deep green opening, pale green action, bright report. A more dramatic continuation of the previous identity. The same content and interaction model makes the visual tradeoff easier to judge.

The preview-only `/tools/design-review` route compares both directions at 320–1280px and in EN/FR/ES/DE/NL. The alternate styling is confined to this review tool; it is not an A/B testing or production theme system. The route returns 404 in a production build without `VERCEL_ENV=preview` and is marked noindex.

## Changes

- Retain the rotating engine headline, with stable grid geometry, a pause control, a static accessible name, and a reduced-motion fallback.
- Make Starter signup the primary hero, header, and closing action. Explicitly pass monthly billing, plan, and EUR where applicable.
- Use the existing pricing catalog for amounts and trial eligibility. Plus links to comparison rather than promising a trial.
- Label the report as an interactive illustration with sample data. Three keyboard-accessible sample prompts demonstrate differing engine results. No production scans are triggered.
- Show a real Content Analyzer screenshot, with an accessible link to the full image. The screenshot illustrates one page, not a customer-wide outcome or guarantee.
- Replace repeated problem/demo sections with a workflow explanation and three setup steps.
- Present three free tools as an evaluation path; keep the full tool directory accessible.
- Preserve the page metadata, canonicals, locale alternates, Organization/WebSite JSON-LD, FAQ content/schema, research feed, shared footer, and consent layer.
- Keep homepage styling in a CSS module. The other page templates retain their existing design.

## Measurement

Existing `app_cta_click` events receive `placement`, `cta_target`, `locale`, and `design_version=home_v3`. Placements distinguish hero, header, each eligible pricing card, and footer. Sample prompt selections use the existing `select_item` event. The existing consent-gated analytics helper is used throughout.

Do not mark these clicks as key events. Existing `sign_up` and `purchase` remain conversion outcomes. A first-successful-scan event and persistent attribution must be coordinated with the separate Replit app; this change does not instrument that app.

Before launch, capture the current funnel by source, device, and locale. Prefer a properly assigned experiment if traffic and infrastructure support it. Otherwise use a staged release and compare equivalent periods, acknowledging channel mix and seasonality. Measure signup completion, first useful scan, paid conversion, and commercial quality. Monitor performance and error rates as guardrails. Do not infer lift from CTA clicks alone.

## Claude handoff

1. Review this branch and the preview against the user's chosen direction.
2. Confirm signup handling for `plan=starter` / `plan=agency`, `interval=monthly`, and `currency=eur`. The links follow existing pricing-page conventions.
3. Keep all production rewrites, billing logic, and application code intact.
4. For page-structure edits, run `npm run check:agents`, `npm run build`, and `npm run check:headings`. Also run message/pricing parity checks and lint changed files.
5. Merge only after design approval. The repository documents automatic production deployment from `main`.

Follow-on scope: pricing-page redesign, key feature templates, free-tool result-to-product transitions, then signup and first-scan UX in the separate Replit application.
