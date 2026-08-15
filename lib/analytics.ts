/**
 * SG_GA4_EVENTS_V1 (2026-07-18) — GA4 event helper for the marketing site.
 *
 * GA4 is loaded globally by `@next/third-parties/google` (see
 * components/analytics/google-analytics.tsx), which puts `gtag` on `window`. No
 * provider or context is needed — any client component can import `trackEvent`
 * and call it directly.
 *
 * Every call is guarded and swallowed: analytics must never break a form submit
 * or a tool result. A missing NEXT_PUBLIC_GA_ID, an ad-blocker, or SSR all end up
 * as a silent no-op rather than a thrown TypeError inside a submit handler.
 */

type GtagParams = Record<string, unknown>

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: GtagParams) => void
  }
}

/**
 * KEY EVENTS (counted as conversions in GA4 → and therefore in the AI Traffic
 * ROI tab). Keep this list SHORT: the ROI tab sums all key events into a single
 * number, so every addition dilutes "AI conversion rate" into meaninglessness.
 *
 *   purchase       — paid subscription (fired server-side from the Stripe webhook)
 *   sign_up        — account created (fired in the app, js/auth.js)
 *   generate_lead  — contact form submitted (fired here)
 *
 * Everything else below is tracked for funnel analysis but must NOT be marked as
 * a key event in the GA4 admin.
 */
export type AnalyticsEvent =
  | "generate_lead"
  | "sign_up"
  | "login"
  | "begin_checkout"
  | "purchase"
  | "free_tool_used"
  | "newsletter_signup"
  | "select_item"
  | "app_cta_click"
  // SG_PROMO_V2 (2026-08-15): sitewide offer banner funnel. NOT key events —
  // they exist so banner variants can be judged on view→click→dismiss and
  // joined to begin_checkout/purchase via the `promo_variant` param.
  | "promo_banner_view"
  | "promo_banner_click"
  | "promo_banner_dismiss"

export function trackEvent(name: AnalyticsEvent, params: GtagParams = {}): void {
  try {
    if (typeof window === "undefined" || typeof window.gtag !== "function") return
    window.gtag("event", name, params)
  } catch {
    /* analytics must never break the surrounding flow */
  }
}
