// SG_CONSENT_V1 (2026-07-28) — geo probe for the cookie-consent gate.
//
// Returns the viewer's ISO country from Vercel's edge header so the client
// banner can decide whether EEA/UK/CH consent rules apply. Deliberately NOT
// under /api (that whole prefix is rewritten to the Replit backend in
// next.config.ts; app routes would win on afterFiles, but keeping the path
// disjoint removes the ambiguity entirely) and NOT in middleware (widening the
// middleware matcher routes marketing pages into next-intl and 404s them —
// the known locale-rewrite gotcha).
//
// Privacy note: the response carries no identifier and is never stored server-
// side; the client caches it in a short-lived first-party cookie (sg_cc).
// (No `runtime = "edge"` — Fable P2-3: the header is a plain request header,
// available identically in the default Node runtime, and reading it already
// keeps the route dynamic; the edge pragma only added an untested code path.)

export function GET(request: Request): Response {
  const country = (request.headers.get("x-vercel-ip-country") ?? "").toUpperCase()
  return Response.json(
    { c: country },
    // Per-viewer answer — must never be cached by the CDN or shared.
    { headers: { "cache-control": "private, no-store" } }
  )
}
