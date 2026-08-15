// components/legal/refund-policy-content.tsx
// SG_LEGAL_V2 (2026-08-15): plain-language Cancellation & Refund Policy. It is
// incorporated into the Terms (§1) and must stay consistent with Terms §5–§8.
// Also the URL to register as the "cancellation policy" in the Stripe Dashboard
// (shown on receipts and reminder emails).
import { TERMS_UPDATED } from "@/components/legal/terms-content"

const link = "text-accent-700 underline hover:text-accent-800"

export function RefundPolicyContent({ localeNote }: { localeNote?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Cancellation &amp; Refund Policy</h1>
      <p className="mt-2 text-sm text-gray-600">Last updated: {TERMS_UPDATED} · Part of our <a href="/terms" className={link}>Terms of Service</a> (§5–§8)</p>
      {localeNote}

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-gray-600">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">How subscriptions work</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Paid plans are <strong>subscriptions that renew automatically</strong>, monthly or annually, until you cancel. The card on file is charged at the start of each period. Annual plans are charged in full, in advance.</li>
            <li>A <strong>free trial</strong> requires a card and <strong>converts automatically</strong> to the plan and billing interval you selected on the trial end date shown at checkout, unless you cancel before then. We email you when the trial starts (with the amount and date of the first charge) and again before the charge.</li>
            <li>Prices exclude VAT/sales tax, which is added at checkout where applicable.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">How to cancel</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Sign in and open <strong>Account → Manage subscription</strong> (this opens the Stripe customer portal).</li>
            <li>Choose <strong>Cancel subscription</strong> and confirm. You receive a confirmation email with the end date.</li>
            <li>Alternatively, email <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a> from the account owner&apos;s address, no later than the day before the renewal date (or before the trial-end date and time) shown in your account and in our emails.</li>
          </ol>
          <p className="mt-2">Cancellation takes effect at the end of the current period (or of the trial). You keep access until then. Revoking Google access or deleting the app&apos;s cookies does <em>not</em> cancel a subscription.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Refunds</h2>
          <p className="mt-2"><strong>Fees are non-refundable.</strong> We do not refund:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>a trial that converted because it was not cancelled before it ended (monthly or annual);</li>
            <li>a renewal that was not cancelled before the renewal date;</li>
            <li>unused time after you cancel or downgrade, unused credits, seats, brands or prompts;</li>
            <li>periods in which you did not log in or use the Service;</li>
            <li>dissatisfaction with AI-engine results, rankings or citations, which are outside our control.</li>
          </ul>
          <p className="mt-2">We <strong>do</strong> correct our own billing errors (wrong amount, duplicate charge, charge after a confirmed cancellation) — please tell us promptly. If <em>we</em> terminate your subscription for convenience, discontinue the Service, or a third-party change materially reduces your plan, we refund the unused part of the current period (Terms §13.3, §18.4, §19). Statutory rights of consumers are described below. We may also grant a goodwill refund at our sole discretion; doing so creates no obligation.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">If you think a charge is wrong</h2>
          <p className="mt-2">Email <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a> first — most issues are resolved within two business days. You always keep the right to contact your bank; but for a charge made in accordance with the Terms (a disclosed trial conversion or renewal), we will provide the bank with the record of your acceptance, the checkout disclosures, the confirmation and reminder emails and your usage of the Service; the account may be suspended while the dispute is open, and if a chargeback succeeds against a valid charge the amount remains due (Terms §8.5).</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Statutory rights of consumers</h2>
          <p className="mt-2">GEO Toolbox is a business tool and you confirm business use when you subscribe. If you nevertheless qualify as a <em>consumer</em> under the mandatory law of your country (for example in the EU or the UK), you keep the rights that law gives you — including a 14-day right of withdrawal from the day you subscribe (including a trial start), against payment of the proportion of service already provided. See <a href="/terms#refunds" className={link}>Terms §8.6</a> and the model withdrawal form in Annex B of the Terms.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Contact</h2>
          <p className="mt-2">Billing questions and cancellations: <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a>.</p>
        </section>
      </div>
    </div>
  )
}
