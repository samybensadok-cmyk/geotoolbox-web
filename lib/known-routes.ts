/**
 * Top-level path segments this site actually serves.
 *
 * Used by ONE middleware rule: the agent-facing markdown 404. Middleware runs
 * before routing, so it cannot ask Next whether a path resolves; this list is how
 * it knows a first segment is definitely not ours. Anything whose first segment is
 * NOT here, and that carries no file extension, is a guaranteed 404 — which is the
 * only case where the rule fires.
 *
 * ⚠️ ADD A SEGMENT HERE THE MOMENT YOU ADD A TOP-LEVEL ROUTE. If you forget, that
 * section still works perfectly in a browser but returns a markdown 404 to clients
 * that do not ask for text/html — i.e. to exactly the AI agents the route exists to
 * serve, and silently. `npm run check:agents` derives the real set from the app/
 * directory and fails if this list is missing anything, so the build catches it.
 *
 * Being over-inclusive here is SAFE (the rule just does not fire and the normal
 * HTML 404 is served). Being under-inclusive is the dangerous direction.
 */
export const KNOWN_TOP_LEVEL: ReadonlySet<string> = new Set([
  // app/(marketing)/* — the route group adds no path segment
  "about", "affiliate-disclosure", "author", "contact", "legal", "newsletter",
  "pricing", "privacy", "r", "refund-policy", "review-methodology", "scan",
  "search", "services", "terms", "tools",
  // app/[locale]/* — served at the root for the default locale
  "blog", "features", "glossary",
  // locale prefixes
  "en", "fr", "es",
  // app/* route handlers and special files
  "consent", "go", "md",
  // Next.js metadata file conventions that resolve to EXTENSIONLESS routes
  // (app/opengraph-image.tsx -> /opengraph-image). Easy to forget precisely
  // because there is no directory for them; the gate derives these too.
  "opengraph-image", "apple-icon", "twitter-image", "icon",
  // Proxied to the Replit app or handled outside Next (see next.config.ts)
  "app", "api", "index.php", "router.php", "assets.php",
  // Framework / platform
  "_next", "_vercel", "monitoring",
])

/**
 * True when the path is definitely not served by this site: no file extension
 * (those fall through to static serving) and a first segment we do not own.
 */
export function isDefinitelyUnknownPath(pathname: string): boolean {
  if (pathname === "/" || pathname === "") return false
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) return false
  const first = pathname.split("/").filter(Boolean)[0]
  if (!first) return false
  return !KNOWN_TOP_LEVEL.has(first)
}

/**
 * A request that never mentions text/html is not a browser. Browsers always send
 * `Accept: text/html,...`; scanners, crawlers, curl and fetch() send `*&#47;*` or
 * nothing. This is ordinary content negotiation, not user-agent sniffing — the
 * client states its preference and we honour it.
 */
export function prefersNonHtml(accept: string | null): boolean {
  if (!accept) return true
  return !accept.includes("text/html")
}
