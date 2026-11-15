// Marketing routes that are mounted under app/[locale]/ and therefore exist at
// /<locale>/... for every non-default locale. The body-link localizer
// (lib/i18n/localize-href.ts) rewrites an internal link to one of these paths
// to its /<locale>/ form, and ONLY these: a path that is EN-only (a redirect
// such as /features/content-brief, or anything under app/(marketing)) must stay
// unprefixed or it would 404 in the locale.
//
// Not hand-maintained: scripts/check-localized-routes.mjs compares this list
// with the route tree (runs in `prebuild`; `--write` regenerates it).
export const LOCALIZED_MARKETING_ROUTES: readonly string[] = [
  // BEGIN GENERATED
  "/features",
  "/features/agent-readiness",
  "/features/ai-visibility-tracker",
  "/features/analytics",
  "/features/ask-geotoolbox",
  "/features/citation-interceptor",
  "/features/community",
  "/features/competitor-intel",
  "/features/content-analyzer",
  "/features/content-studio",
  "/features/domain-overview",
  "/features/geo-scan",
  "/features/pr-coverage-tracker",
  "/features/query-fanout",
  "/features/white-label-reports",
  "/pricing",
  // END GENERATED
]
