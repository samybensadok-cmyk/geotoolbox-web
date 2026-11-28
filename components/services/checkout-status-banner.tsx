"use client"

import { useSearchParams } from "next/navigation"
import c from "./checkout-status-banner.module.css"

/**
 * CheckoutStatusBanner — renders a cancel notice at the top of
 * /services/ai-seo-agency when Stripe Checkout redirects back with
 * ?status=cancel. Renders nothing otherwise, so the static page is unaffected
 * for normal visitors. Must be mounted inside a <Suspense> boundary
 * (useSearchParams requirement for static pages).
 *
 * Dark-kit look (2026-11-28): rendered inside the services page's <DarkPage>.
 *
 * NOTE: there is no "success" branch. A successful checkout redirects to
 * /services/intake (see inc/actions/service_checkout.php success_url), where the
 * buyer completes intake and gets the confirmation — so a success banner here
 * would only ever show stale copy. Cancel is the only case that returns here.
 */
export function CheckoutStatusBanner() {
  const params = useSearchParams()
  const status = params.get("status")

  if (status !== "cancel") return null

  return (
    <div role="status" className={c.banner}>
      <p className={c.text}>
        <span className={c.lead}>Checkout cancelled — nothing was charged.</span>{" "}If something
        didn&apos;t look right or you have a question first, book a free call and ask me directly.
      </p>
    </div>
  )
}
