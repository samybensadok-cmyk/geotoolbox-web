"use client"

import { useSearchParams } from "next/navigation"

/**
 * CheckoutStatusBanner — renders a confirmation (or cancel) notice at the top
 * of /services/ai-seo-agency when Stripe Checkout redirects back with
 * ?status=success|cancel (&purchase=report|sprint). Renders nothing otherwise,
 * so the static page is unaffected for normal visitors. Must be mounted inside
 * a <Suspense> boundary (useSearchParams requirement for static pages).
 */
export function CheckoutStatusBanner() {
  const params = useSearchParams()
  const status = params.get("status")
  const purchase = params.get("purchase")
  const sessionId = params.get("session_id")

  if (status !== "success" && status !== "cancel") return null
  // Only show "payment received" for a real Stripe redirect — the success_url
  // carries a cs_-prefixed session_id. Without it (someone hand-typing
  // ?status=success), render nothing rather than a false confirmation.
  if (status === "success" && !sessionId?.startsWith("cs_")) return null

  const itemLabel =
    purchase === "sprint" ? "30-Day AI Visibility Sprint" : "AI Search Visibility Report"

  if (status === "cancel") {
    return (
      <div role="status" className="border-b border-gray-200 bg-gray-50 px-6 py-4">
        <p className="mx-auto max-w-7xl text-[14px] leading-relaxed text-gray-700">
          <span className="font-semibold">Checkout cancelled — nothing was charged.</span> If something
          didn&apos;t look right or you have a question first, book a free call and ask me directly.
        </p>
      </div>
    )
  }

  return (
    <div role="status" className="border-b border-accent-200 bg-accent-50 px-6 py-5">
      <div className="mx-auto max-w-7xl">
        <p className="text-[15px] font-semibold leading-snug text-accent-900">
          Payment received — your {itemLabel} is booked.
        </p>
        <p className="mt-1 text-[14px] leading-relaxed text-accent-800">
          A confirmation is on its way to your email. I&apos;ll personally reach out within 1 business
          day to collect your domain and market details and get started. — Samy
        </p>
      </div>
    </div>
  )
}
