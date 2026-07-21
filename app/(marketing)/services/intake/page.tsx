import type { Metadata } from "next"
import { Suspense } from "react"
import { IntakeForm } from "@/components/services/intake-form"

// Post-payment intake — reached only via the Stripe success redirect with a
// session_id. Not linked anywhere and not useful without a paid order, so keep
// it out of search results.
export const metadata: Metadata = {
  title: "Start Your Audit",
  robots: { index: false, follow: false },
}

export default function ServiceIntakePage() {
  return (
    <Suspense
      fallback={
        <section className="bg-white px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl">
            <p className="text-gray-500">Loading your order…</p>
          </div>
        </section>
      }
    >
      <IntakeForm />
    </Suspense>
  )
}
