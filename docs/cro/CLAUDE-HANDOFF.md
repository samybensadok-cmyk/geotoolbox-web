# Claude handoff: service and pricing CRO redesign

Updated 2026-10-06. Continue on `codex/service-pricing-cro` in `samybensadok-cmyk/geotoolbox-web`.
Draft PR: https://github.com/samybensadok-cmyk/geotoolbox-web/pull/2
Latest implementation commit before this handoff: 9b8f61101b6685c42840386f41588704d00167ea.

## User direction
The homepage redesign is done. Improve conversion on services and pricing with less text, using the homepage visual language. Competitor research is in docs/cro/2026-10-service-pricing-benchmark.md.
The user approved the revised results section: KEEP both growth charts and AI citation numbers visible before service packages. These show growth speed and what the service delivers. Do not hide them in an accordion. Keep sources, dates, reporting windows and accurate metric definitions.
The user wants Claude to finish the work and update data with a fresh pull. No production merge has been requested.

## Implemented
- Shared service experience for AI SEO, GEO, AEO and automation; shorter copy, clear packages and calls to action.
- AI SEO/GEO/AEO proof: ~135,700 Bing AI-citation appearances and 129,000 Google AI-answer impressions from existing September snapshots, ranking totals, and both monthly growth charts visible by default. Automation uses its client builds.
- Client scan screenshots and detailed measurement notes are expandable.
- Pricing redesign with existing offers and five-locale messages preserved.
- Original service offers, FAQs and structured data retained.

## Main files
- components/services/service-experience.tsx and service-experience.module.css
- components/services/growth-charts.tsx
- app/(marketing)/services/{ai-seo-agency,generative-engine-optimization,answer-engine-optimization,ai-automation-agency}/page.tsx
- app/[locale]/pricing/page.tsx
- components/pricing/pricing-cards.tsx and pricing-experience.module.css
- messages/{en,fr,de,es,nl}.json
- lib/proof-stats.ts and lib/proof-stats.generated.json

## Fresh data pull
1. Fetch this branch and latest origin/main. Inspect any intervening work, especially refreshed proof data, before resolving conflicts. Preserve the accepted layout and existing unrelated changes.
2. Read lib/proof-stats.ts, scripts/update-proof-stats.mjs and .github/workflows/update-proof-stats.yml before refreshing.
3. The existing updater runs with:
   `node scripts/update-proof-stats.mjs`
   It needs GOOGLE_APPLICATION_CREDENTIALS pointing to an authorized service-account JSON for sc-domain:geotoolbox.ai. BING_WMT_API_KEY is optional for ordinary Bing traffic. Never commit credentials.
4. The workflow's schedule is currently commented out; its comment says GSC_SA_KEY was not configured. Do not assume automatic refresh is working or that secrets have since been configured.
5. Generate current Google query totals and monthly series into lib/proof-stats.generated.json. Preserve trailing-28-day vs calendar-month definitions and incomplete-month labels. The updater skips the current month until at least 10 days have elapsed.
6. AI figures are separate manual fields in lib/proof-stats.ts. The current integration does NOT refresh Bing AI Performance appearances or Google's Generative AI features report. Pull authorized current report data through available account access/export, recording the actual source, window and as-of date. If unavailable, retain the dated snapshot and explicitly report the blocker. Do not update dates alone or substitute ordinary search impressions.
7. Do not add Bing appearances to Google AI impressions or label impressions as unique citations. Keep own-site evidence distinct from client outcomes. Refresh any other visible dated manual metrics only with supporting source data.

## Finish and verify
- Follow AGENTS.md, including installed Next.js documentation before code changes.
- Inspect desktop and mobile layouts on all four service routes and localized pricing. Mobile verification remains outstanding.
- Verify chart rendering, source labels, results anchor, disclosures, package/checkout links, CTA destinations, FAQs, schema and locale parity.
- TypeScript, whitespace and prior locale/parity checks passed; the latest implementation's Vercel deployment succeeded. Desktop results section was visually verified.
- Local Next dev could not start in the Codex sandbox due native SWC/runtime restrictions. Temporary config workarounds were reverted. Use a working local environment or Vercel preview.
- No measured conversion uplift is claimed.
- Keep changes on this branch and PR for review; do not merge or publish production without user direction.

Preview:
https://geotoolbox-web-git-codex-ser-5503d9-samybensadok-2891s-projects.vercel.app/services/ai-seo-agency#results
