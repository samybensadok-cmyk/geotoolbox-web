import type { Metadata } from "next"
import { Suspense } from "react"
import { IntakeForm } from "@/components/services/intake-form"
import { DarkPage, kit } from "@/components/brand/dark-kit"

// Post-payment intake — reached only via the Stripe success redirect with a
// session_id. Not linked anywhere and not useful without a paid order, so keep
// it out of search results.
export const metadata: Metadata = {
  title: "Start Your Audit",
  robots: { index: false, follow: false },
}

export default function ServiceIntakePage() {
  return (
    <DarkPage>
      <Suspense
        fallback={
          <section className={kit.section}>
            <div className={`${kit.wrap} ${kit.narrow}`}>
              <p className={kit.body}>Loading your order…</p>
            </div>
          </section>
        }
      >
        <IntakeForm />
      </Suspense>
    </DarkPage>
  )
}
