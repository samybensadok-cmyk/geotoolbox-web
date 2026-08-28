// components/legal/terms-content.tsx
// SG_LEGAL_V2 (2026-08-15): full Terms of Service rewrite for the paid-trial era.
// Rendered by /terms (EN) and, until a native translation ships, by /fr/terms and
// /es/terms with a locale banner (the EN text governs — see §21.6).
//
// Drafting notes (keep in sync with geotoolbox-main/LEGAL-TOS-BULLETPROOF-2026-08-15.md):
//  - Card-network rules (Visa Core Rules ed. 18 Apr 2026 §5.4.2.5) forbid asking a
//    cardholder to waive the right to dispute → §8.5 asks them to contact us first, it
//    never waives anything.
//  - EU/UK consumers keep a statutory 14-day withdrawal right from signup (CJEU
//    C-565/22 Sofatutor) → §8.6 recognises it instead of pretending it away; the real
//    lever is the business-use representation in §2.2 (Shopify-style).
//  - French L215-1→L215-3 + L241-3 must be reproduced in full where they apply
//    (L215-4) → Annex A. Model withdrawal form (L221-5 7°) → Annex B.
//  - Entity facts (SIREN 827472424, RNE, address, franchise TVA) filled 2026-08-15 from public records; médiateur pending designation.

export const TERMS_VERSION = "2.0"
export const TERMS_UPDATED = "August 15, 2026"
export const TERMS_EFFECTIVE_NEW = "August 15, 2026" // new customers: on publication
export const TERMS_EFFECTIVE_EXISTING = "September 15, 2026" // existing customers: 30 days' notice

const link = "text-accent-700 underline hover:text-accent-800"

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-lg font-semibold text-gray-900">
      {children}
    </h2>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-2">{children}</p>
}

function UL({ children }: { children: React.ReactNode }) {
  return <ul className="mt-2 list-disc space-y-1 pl-5">{children}</ul>
}

const TOC: Array<[string, string]> = [
  ["who-we-are", "1. Who we are"],
  ["acceptance", "2. Acceptance and business use"],
  ["accounts", "3. Accounts"],
  ["service", "4. The Service, plans and credits"],
  ["free-trial", "5. Free trial"],
  ["fees", "6. Fees, billing and automatic renewal"],
  ["cancellation", "7. Cancellation"],
  ["refunds", "8. Refunds, statutory rights and payment disputes"],
  ["addons", "9. Credit packs, add-ons and services"],
  ["data", "10. Your data, privacy and connected accounts"],
  ["ip", "11. Intellectual property and licence"],
  ["acceptable-use", "12. Acceptable use"],
  ["third-party", "13. Third-party services and AI-generated output"],
  ["availability", "14. Availability, changes and beta features"],
  ["warranties", "15. Disclaimer of warranties"],
  ["liability", "16. Limitation of liability"],
  ["indemnity", "17. Indemnity"],
  ["term", "18. Term, suspension and termination"],
  ["changes", "19. Changes to these Terms"],
  ["law", "20. Governing law and disputes"],
  ["general", "21. General"],
  ["contact", "22. Contact"],
  ["annex-a", "Annex A — French statutory texts (consumers and non-professionals only)"],
  ["annex-b", "Annex B — Model withdrawal form (consumers only)"],
]

export function TermsContent({ localeNote }: { localeNote?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Terms of Service</h1>
      <p className="mt-2 text-sm text-gray-600">
        Version {TERMS_VERSION} · Last updated: {TERMS_UPDATED} · Effective for new customers on {TERMS_EFFECTIVE_NEW} and for existing customers on {TERMS_EFFECTIVE_EXISTING}
      </p>
      {localeNote}

      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
        <p className="font-semibold text-gray-900">Plain-language summary (the full Terms below govern)</p>
        <UL>
          <li>GEO Toolbox is a business tool. By subscribing you confirm you are acting for business purposes.</li>
          <li>Paid plans are <strong>subscriptions that renew automatically</strong> (monthly or annually) until you cancel.</li>
          <li>A free trial requires a card and <strong>converts automatically to a paid subscription when it ends</strong> unless you cancel first. The amount and date of the first charge (for an annual plan, the full annual fee) are shown at checkout and in your confirmation email, and we also email you before the charge.</li>
          <li>You can cancel at any time from <strong>Account → Manage subscription</strong>. Cancellation takes effect at the end of the current period; you keep access until then.</li>
          <li><strong>Fees are non-refundable</strong> — including when a trial converts because you did not cancel in time, and for unused time or credits — except where the law gives you a right we cannot exclude (see §8).</li>
        </UL>
      </div>

      <nav aria-label="Table of contents" className="mt-8 text-sm">
        <p className="font-semibold text-gray-900">Contents</p>
        <ol className="mt-2 grid gap-1 sm:grid-cols-2">
          {TOC.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} className="text-gray-600 hover:text-gray-900">
                {label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-gray-600">
        <section>
          <H2 id="who-we-are">1. Who we are</H2>
          <P>
            GEO Toolbox (&quot;<strong>GEO Toolbox</strong>&quot;, &quot;<strong>we</strong>&quot;, &quot;<strong>us</strong>&quot;) is operated by <strong>Samy Ben Sadok</strong>, sole trader (entrepreneur individuel — EI), registered in France under SIREN 827 472 424 (Registre national des entreprises), business address 1 esplanade de Chantilly, 93330 Neuilly-sur-Marne, France. VAT: not applicable — article 293 B of the French Code général des impôts (franchise en base); prices are therefore charged without French VAT until further notice. Full legal notice:{" "}
            <a href="/legal" className={link}>geotoolbox.ai/legal</a>. Contact:{" "}
            <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a>.
          </P>
          <P>
            These Terms of Service (the &quot;<strong>Terms</strong>&quot;) form a binding agreement between you (the person or entity using the Service, &quot;<strong>you</strong>&quot;, the &quot;<strong>Customer</strong>&quot;) and us. They incorporate our{" "}
            <a href="/privacy" className={link}>Privacy Policy</a> and our{" "}
            <a href="/refund-policy" className={link}>Cancellation &amp; Refund Policy</a>, and the plan details shown on the{" "}
            <a href="/pricing" className={link}>pricing page</a> and at checkout at the time you subscribe (together, the &quot;<strong>Agreement</strong>&quot;).
          </P>
        </section>

        <section>
          <H2 id="acceptance">2. Acceptance and business use</H2>
          <P>
            <strong>2.1 Acceptance.</strong>{" "}You accept these Terms by creating an account, ticking the acceptance box at signup or checkout, clicking a button that references them, or by using the Service. If you do not agree, do not use the Service. If you accept on behalf of a company or other entity, you confirm that you have authority to bind it, and &quot;you&quot; means that entity.
          </P>
          <P>
            <strong>2.2 Business use only.</strong> The Service is a professional tool for marketers, SEO/GEO consultants, agencies and businesses. <strong>You confirm that you are obtaining and using the Service for the purposes of carrying on a trade, business, craft or profession, and not for personal, family or household purposes.</strong> We rely on this representation. If you nevertheless qualify as a consumer under the mandatory law of your country of residence, §8.6 and §20.4 apply to you.
          </P>
          <P>
            <strong>2.3 Age.</strong> You must be at least 18 years old.
          </P>
        </section>

        <section>
          <H2 id="accounts">3. Accounts</H2>
          <P>
            <strong>3.1</strong> You may sign in with an email address and password, a magic link, or Google OAuth. You are responsible for all activity under your account (unless caused by our breach) and for keeping your credentials confidential. Tell us immediately at{" "}
            <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a> if you suspect unauthorised access.
          </P>
          <P>
            <strong>3.2 Team seats.</strong> Where your plan includes team seats, you may invite members. You are responsible for their compliance with these Terms. Only the account owner may change billing, cancel, or delete the account.
          </P>
          <P>
            <strong>3.3 Accuracy.</strong> Keep your account and billing details accurate, including your business name, billing address and, if applicable, VAT number.
          </P>
        </section>

        <section>
          <H2 id="service">4. The Service, plans and credits</H2>
          <P>
            <strong>4.1</strong> The Service provides AI-search visibility analytics: tracking how a brand appears across AI engines (for example ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews and AI Mode, Bing Copilot, Grok), related scans, reports and content tools, as described on our website at the time of your order.
          </P>
          <P>
            <strong>4.2 Plans.</strong> Each plan grants the features and limits stated on the pricing page and at checkout (for example brands, prompts, engines, seats, history window). We may improve or adjust the Service; material reductions to a plan you have paid for take effect only from your next renewal, with notice under §19.
          </P>
          <P>
            <strong>4.3 Credits.</strong> Usage is metered in credits. Each plan grants a monthly credit allowance, granted at the start of each month of service (including on annual plans), or at a reduced level during a trial as described in §5. <strong>Unused credits do not roll over, have no cash value and are not refundable.</strong> Credit weights per engine and tool are published in-app and may change; changes apply prospectively.
          </P>
          <P>
            <strong>4.4 Fair use.</strong> Plan limits are enforced technically. We may throttle or suspend usage that is abusive, automated beyond the intended use, or that threatens the stability or cost basis of the Service, after notice where practicable.
          </P>
        </section>

        <section>
          <H2 id="free-trial">5. Free trial</H2>
          <P>
            <strong>5.1 What it is.</strong> Where offered (currently on selected plans, as shown on the pricing page), a free trial gives you access to the plan you selected for the trial period stated at checkout (currently <strong>7 days</strong>). A valid payment method is required to start a trial. Trial accounts may run with reduced limits (for example a fraction of the plan&apos;s credits, a lower brand cap, no white-label reports); the full plan unlocks when the trial converts.
          </P>
          <P>
            <strong>5.2 Automatic conversion — read this carefully.</strong> <strong>Unless you cancel before the trial ends, your trial converts automatically into a paid subscription for the plan and billing interval (monthly or annual) you selected, and the payment method on file is charged the amount shown at checkout on the trial end date.</strong> The exact amount, currency and first-charge date are displayed at checkout before you confirm, and are repeated in the confirmation email we send when the trial starts. The subscription then renews automatically under §6.
          </P>
          <P>
            <strong>5.3 Reminders.</strong> We send the trial confirmation email at enrollment (including the amount and date of the first charge and how to cancel) — this is the notice of the upcoming charge — and, in addition, reminder emails before the first charge, to the address on your account. Reminders are sent as a courtesy and to meet card-network rules; <strong>non-receipt of a reminder (for example because of a spam filter or a wrong address) does not affect the automatic conversion or entitle you to a refund</strong>. Keep your email address current.
          </P>
          <P>
            <strong>5.4 How to cancel a trial.</strong> Cancel at any time before the trial ends from <strong>Account → Manage subscription</strong> (Stripe customer portal), or by emailing{" "}
            <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a>{" "}from the account owner&apos;s address before the trial end date and time shown in your account and in the confirmation email. A trial cancelled before it ends is never charged. Cancellation is confirmed by email.
          </P>
          <P>
            <strong>5.5 No refund for a missed cancellation.</strong> Because the conversion terms are disclosed at checkout and confirmed by email at enrollment, <strong>a charge that results from your not cancelling before the trial end is a valid charge and is non-refundable</strong> (subject only to §8.6); the additional reminders in §5.3 do not change this. This applies equally to monthly and annual subscriptions.
          </P>
          <P>
            <strong>5.6 One trial per customer.</strong> Trials are limited to one per person, company and payment method, and are not available on upgrades or re-subscriptions. We may refuse, shorten or end a trial early, decline the subscription, close duplicate accounts, or withdraw the trial offer, where we detect trial abuse (for example multiple accounts or payment methods) or at any time on notice.
          </P>
        </section>

        <section>
          <H2 id="fees">6. Fees, billing and automatic renewal</H2>
          <P>
            <strong>6.1 Subscriptions renew automatically.</strong> Paid plans are sold as recurring subscriptions. <strong>Your subscription renews automatically at the end of each billing period (monthly or annually, as selected) for a further period of the same length, and the payment method on file is charged the then-current fee for your plan at the start of each period, until you cancel</strong> under §7. Annual plans are charged in full, in advance, for the year. For annual subscriptions we email a renewal reminder about five weeks (33–39 days) before the renewal date, stating the renewal amount, date and how to cancel.
          </P>
          <P>
            <strong>6.2 Payment.</strong> Payments are processed by Stripe. By providing a payment method you authorise us (through Stripe) to charge all fees due under the Agreement, including renewal fees, applicable taxes, and any credit packs or add-ons you order. Invoices and receipts are issued by email and available in the customer portal.
          </P>
          <P>
            <strong>6.3 Prices, currency and taxes.</strong> Prices are those displayed at checkout in the currency selected (USD or EUR). <strong>Fees are exclusive of VAT, sales tax and similar taxes</strong>, which are added at checkout where applicable based on your billing address; if you provide a valid VAT number, reverse charge may apply. You are responsible for any taxes, duties or bank charges other than taxes on our income.
          </P>
          <P>
            <strong>6.4 Price changes.</strong> We may change our prices. Price increases apply to your subscription only from your next renewal following at least <strong>30 days&apos; notice</strong> by email. If you do not agree, cancel before the renewal; continuing after the effective date is acceptance of the new price.
          </P>
          <P>
            <strong>6.5 Failed payments.</strong> If a charge fails, we (through Stripe) may retry it and email you to update your payment method. We may suspend or downgrade the account while a payment is outstanding and terminate it if the failure is not cured within a reasonable time. You remain liable for the fees for the period. Late amounts due from business customers bear interest at three times the French legal interest rate plus a fixed €40 recovery indemnity per invoice (Code de commerce L441-10 and D441-5).
          </P>
          <P>
            <strong>6.6 Upgrades and downgrades.</strong> Upgrades take effect immediately and are prorated by Stripe. Downgrades take effect at the next renewal; the difference is not refunded.
          </P>
          <P>
            <strong>6.7 Promotions.</strong> Coupons and promotional prices apply for the period stated and then revert to the standard price shown at checkout.
          </P>
        </section>

        <section>
          <H2 id="cancellation">7. Cancellation</H2>
          <P>
            <strong>7.1 Cancel any time, online.</strong> You may cancel your subscription at any time from <strong>Account → Manage subscription</strong>, which opens the Stripe customer portal (&quot;Cancel subscription&quot;), or by emailing{" "}
            <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a>{" "}from the account owner&apos;s address. We confirm every cancellation by email, stating the date on which the subscription ends.
          </P>
          <P>
            <strong>7.2 Effect.</strong> Cancellation stops future renewals. <strong>It takes effect at the end of the current billing period</strong> (or at the end of the trial, if you are trialing) and you keep access until then. <strong>No prorated or partial refund is given for the remainder of a period already paid</strong>, including annual periods, subject to §8.6.
          </P>
          <P>
            <strong>7.3 Cut-off.</strong> To avoid a renewal charge, cancel no later than the day before the renewal date shown in your account and in our emails (charges run at the anniversary time of your original subscription, in UTC). A cancellation made after a charge applies to the following period.
          </P>
          <P>
            <strong>7.4 Deleting your account</strong> cancels any active subscription with effect at the end of the current period, and triggers data deletion under our Privacy Policy. Deleting an account does not by itself entitle you to a refund. Revoking Google OAuth access or uninstalling integrations does <em>not</em> cancel a subscription — use §7.1.
          </P>
        </section>

        <section>
          <H2 id="refunds">8. Refunds, statutory rights and payment disputes</H2>
          <P>
            <strong>8.1 All fees are non-refundable.</strong> Except as expressly stated in this §8, <strong>fees for a billing period that has started are due in full and are non-refundable</strong>. In particular, no refund or credit is given for: (a) a trial that converted because you did not cancel before it ended (§5.5); (b) an automatic renewal you did not cancel in time (§7.3), including annual renewals; (c) unused time in a billing period after you cancel or downgrade; (d) unused credits, seats, brands or prompts; (e) periods during which you did not use the Service; (f) features you did not use or that changed; (g) dissatisfaction with results, rankings or AI-engine outputs, which are outside our control (§13).
          </P>
          <P>
            <strong>8.2 Our own error.</strong> If we charged you incorrectly (wrong amount, duplicate charge, charge after a confirmed cancellation), we will correct it and refund the difference — please tell us promptly (ideally within 60 days) so we can trace the payment.
          </P>
          <P>
            <strong>8.3 Goodwill.</strong> We may, in our sole discretion and without obligation, grant a refund or credit as a gesture of goodwill. Doing so once does not oblige us to do so again, and does not modify these Terms.
          </P>
          <P>
            <strong>8.4 Refund method and timing.</strong> Any refund is made to the original payment method through Stripe, normally within 14 days of our decision.
          </P>
          <P>
            <strong>8.5 Contact us before disputing a charge.</strong> If you believe a charge is wrong, contact us first at{" "}
            <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a> — most issues are resolved within two business days. Nothing in these Terms limits your right to raise a dispute with your card issuer or bank. However, if a chargeback is opened against a charge that was made in accordance with these Terms (for example a properly disclosed trial conversion or renewal), we will submit the evidence of your acceptance of these Terms, the checkout disclosures, the confirmation and reminder emails and your usage of the Service; while the dispute is open we may suspend the account. If a chargeback succeeds against a charge validly made under these Terms, the amount remains due to us; if a chargeback is raised without a good-faith basis we may terminate the account for breach.
          </P>
          <P>
            <strong>8.6 Statutory rights of consumers.</strong> The Service is intended for business use (§2.2). If, despite that, you are a <em>consumer</em> under mandatory law of your country of residence (in particular the EU Consumer Rights Directive, the French Code de la consommation or the UK Consumer Contracts Regulations 2013), nothing in these Terms limits rights that cannot be excluded by contract. In that case: (a) you have a right to withdraw from the Agreement within 14 days of the day you subscribe (including the day a free trial starts), without giving a reason, by clear statement to{" "}
            <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a> (you may use the model form in Annex B); (b) at signup and checkout you gave your <strong>express request that we begin performing during the withdrawal period and acknowledged</strong> that if you withdraw you must pay an amount proportionate to the service provided until you informed us of the withdrawal, and that you lose the right of withdrawal once the service has been fully performed; (c) refunds due under this §8.6 are made within 14 days of your notice; (d) the French provisions on tacit renewal and online cancellation reproduced in Annex A apply to consumers and non-professionals as defined there. Business customers have no right of withdrawal.
          </P>
        </section>

        <section>
          <H2 id="addons">9. Credit packs, add-ons and services</H2>
          <P>
            <strong>9.1</strong> Credit packs and add-ons are one-time purchases, non-refundable, and consumed under §4.3; pack credits expire as stated at purchase.
          </P>
          <P>
            <strong>9.2</strong> Done-for-you services (for example content, audits, GEO/AEO services) are governed by the description, price and delivery terms shown at the time of order and, where applicable, a separate statement of work. Because work begins on order, service fees are non-refundable once work has started, except for our failure to deliver.
          </P>
        </section>

        <section>
          <H2 id="data">10. Your data, privacy and connected accounts</H2>
          <P>
            <strong>10.1</strong> Our processing of personal data is described in the{" "}
            <a href="/privacy" className={link}>Privacy Policy</a>. Where we process personal data on your behalf (for example within reports you generate), we act as your processor; our data processing terms (GDPR Art. 28) and current subprocessor list are available at{" "}
            <a href="/privacy#subprocessors" className={link}>geotoolbox.ai/privacy</a> and on request in signed form.
          </P>
          <P>
            <strong>10.2 Your data.</strong> You retain all rights in the data, brands, prompts and content you submit (&quot;<strong>Customer Data</strong>&quot;). You grant us a non-exclusive licence to host, process and display Customer Data to provide, secure and improve the Service. We may use aggregated, de-identified usage data (for example engine-level citation statistics) that does not identify you or your clients.
          </P>
          <P>
            <strong>10.3 Connected accounts.</strong> If you connect Google Search Console or Google Analytics, you authorise read-only access under the scopes shown at connection and warrant that you are entitled to grant it. You can disconnect at any time.
          </P>
          <P>
            <strong>10.4 Retention and export.</strong> Analysis outputs are retained as described in the Privacy Policy. After termination you may export your data for 30 days, after which we may delete it (billing records are kept as required by law).
          </P>
          <P>
            <strong>10.5 Confidentiality.</strong>{" "}Each party will keep the other&apos;s non-public information confidential and use it only to perform the Agreement, for the term and three years after, except for information that is or becomes public without breach, was already lawfully known or independently developed by the receiving party, or must be disclosed by law (with prior notice where permitted).
          </P>
        </section>

        <section>
          <H2 id="ip">11. Intellectual property and licence</H2>
          <P>
            <strong>11.1</strong>{" "}The Service, its software, methodology, scoring, databases, designs and content are owned by us or our licensors and protected by intellectual-property laws. We grant you a limited, non-exclusive, non-transferable licence (revocable only under §18) to access and use the Service and to use the reports and outputs you generate for your own business or your clients&apos; business, during the term and within your plan limits.
          </P>
          <P>
            <strong>11.2 White-label reports</strong> (where included in your plan) may be presented under your brand to your clients; you remain responsible for their use and for any claims you make on the basis of them.
          </P>
          <P>
            <strong>11.3 Feedback</strong> you give us may be used freely by us without obligation.
          </P>
          <P>
            <strong>11.4 Trademarks.</strong>{" "}&quot;GEO Toolbox&quot; and our logos are our marks. Third-party marks (including AI-engine names) belong to their owners and are used for identification only; we are not affiliated with or endorsed by them.
          </P>
        </section>

        <section>
          <H2 id="acceptable-use">12. Acceptable use</H2>
          <P>You agree not to, and not to allow others to:</P>
          <UL>
            <li>use the Service unlawfully, or in breach of third-party rights, or of the terms of any connected service or AI engine;</li>
            <li>attempt unauthorised access to the Service, other accounts or our infrastructure, or probe, scan or test its vulnerability without our written consent;</li>
            <li>interfere with or disrupt the Service, or circumvent plan limits, credit metering, rate limits or security controls;</li>
            <li>scrape, crawl or bulk-extract the Service or its data other than through features we provide, or use automated means beyond the intended use;</li>
            <li>resell, sublicense, rent, share credentials for, or offer the Service as a service bureau, or redistribute our data or reports other than as permitted by §11;</li>
            <li>reverse-engineer or copy the Service or build a competing product using access to it;</li>
            <li>upload malicious code, or submit content that is unlawful, defamatory or infringing;</li>
            <li>misrepresent your identity, create multiple accounts to obtain repeated trials or credits, or use a payment method you are not authorised to use.</li>
          </UL>
        </section>

        <section>
          <H2 id="third-party">13. Third-party services and AI-generated output</H2>
          <P>
            <strong>13.1</strong> The Service queries and analyses third-party AI engines and data providers. Their availability, behaviour, outputs and terms change frequently and are outside our control. <strong>AI-engine answers are non-deterministic</strong>: results vary between runs, regions, accounts and dates. We do not guarantee that any engine will mention or cite you, that visibility scores or estimates are accurate or complete, or that any recommendation will produce a particular outcome.
          </P>
          <P>
            <strong>13.2</strong> Outputs (scores, reports, briefs, generated content, recommendations) are informational tools for professionals, not professional, legal, financial or marketing advice. You are responsible for reviewing outputs before relying on or publishing them.
          </P>
          <P>
            <strong>13.3</strong> If a third-party provider withdraws or restricts access, we may substitute, modify or remove the affected feature, immediately where the provider leaves no alternative; if this materially reduces a paid plan you may terminate and we refund the unused part of the current period (§18.4).
          </P>
        </section>

        <section>
          <H2 id="availability">14. Availability, changes and beta features</H2>
          <P>
            <strong>14.1</strong> We aim for high availability but do not guarantee uninterrupted or error-free operation. Maintenance, updates and third-party outages may cause interruptions. Credits are not consumed for scans that fail on our side.
          </P>
          <P>
            <strong>14.2</strong> Features labelled beta, preview, experimental or similar are provided as-is, may change or be withdrawn without notice, and are excluded from any commitment on availability.
          </P>
        </section>

        <section>
          <H2 id="warranties">15. Disclaimer of warranties</H2>
          <P>
            To the fullest extent permitted by law, the Service is provided <strong>&quot;as is&quot; and &quot;as available&quot;</strong>, without warranties of any kind, express or implied, including merchantability, fitness for a particular purpose, accuracy, non-infringement, or that the Service will meet your requirements or achieve any result. Nothing in these Terms excludes warranties or rights that cannot be excluded under applicable law.
          </P>
        </section>

        <section>
          <H2 id="liability">16. Limitation of liability</H2>
          <P>
            <strong>16.1 Exclusions.</strong> To the fullest extent permitted by law, we are not liable for any indirect, incidental, special, consequential or punitive damages, or for loss of profits, revenue, business, goodwill, data or anticipated savings, or for decisions taken on the basis of outputs (§13), however arising.
          </P>
          <P>
            <strong>16.2 Cap.</strong> Our total aggregate liability arising out of or in connection with the Agreement in any 12-month period is limited to <strong>the fees you paid us for the Service in the 12 months preceding the event giving rise to the claim</strong> (or €100 if you paid nothing).
          </P>
          <P>
            <strong>16.3 Carve-outs.</strong> Nothing limits liability for death or personal injury caused by negligence, for fraud or wilful misconduct (dol), for gross negligence (faute lourde) to the extent it cannot be limited under French law, or for any other liability that cannot be limited by law. If you are a consumer, §16.1–16.2 do not apply to you and our liability is governed by mandatory law.
          </P>
        </section>

        <section>
          <H2 id="indemnity">17. Indemnity</H2>
          <P>
            If you are a business customer, you will defend and indemnify us against third-party claims, and related costs (including reasonable legal fees), arising from your Customer Data, your use of the Service in breach of the Agreement or of law, your white-label reports, or claims you make to your clients on the basis of outputs — provided we notify you promptly of the claim, let you control the defence and settlement (no settlement admitting fault on our behalf without our consent), and reasonably cooperate at your cost.
          </P>
        </section>

        <section>
          <H2 id="term">18. Term, suspension and termination</H2>
          <P>
            <strong>18.1 Term.</strong> The Agreement starts when you create an account and continues until terminated. Subscriptions run for successive periods under §6.1.
          </P>
          <P>
            <strong>18.2 Suspension.</strong> We may suspend access, in whole or part, with notice where practicable, if: payment is overdue; we reasonably believe there is a security risk, abuse, or breach of §12; required by law or a third-party provider; or a chargeback is pending (§8.5).
          </P>
          <P>
            <strong>18.3 Termination for breach.</strong> Either party may terminate the Agreement if the other materially breaches it and does not cure within 15 days of notice (immediately for breaches of §12 or non-payment persisting after reminder). On termination for your breach, fees for the current period remain due and are not refunded.
          </P>
          <P>
            <strong>18.4 Termination by us for convenience or discontinuation.</strong>{" "}We may terminate the Agreement or discontinue the Service on at least 30 days&apos; notice by email. In that case we will refund the prepaid fees for the unused part of your then-current period.
          </P>
          <P>
            <strong>18.5 Effect.</strong> On termination your licence ends; §10.4 governs data export and deletion; §§8, 10.5, 11, 15–17, 20 and 21 survive.
          </P>
        </section>

        <section>
          <H2 id="changes">19. Changes to these Terms</H2>
          <P>
            We may update these Terms as the Service and the law evolve. The current version, its number and date are always shown at the top of this page, and previous versions are available on request. For <strong>material changes</strong> that reduce your rights we will give at least <strong>30 days&apos; notice</strong> by email or in-app before they take effect for existing customers; you may terminate before the effective date if you do not agree, and we will refund any prepaid fees for the period after termination in that case. Non-material changes (clarifications, new features, legal references) apply on publication. Continued use after the effective date is acceptance.
          </P>
        </section>

        <section>
          <H2 id="law">20. Governing law and disputes</H2>
          <P>
            <strong>20.1 Governing law.</strong> The Agreement is governed by French law, excluding its conflict-of-law rules and the UN Convention on Contracts for the International Sale of Goods.
          </P>
          <p className="mt-2 rounded border border-gray-300 bg-white p-3 font-semibold uppercase tracking-wide text-gray-900">
            20.2 Jurisdiction (business customers). Any dispute arising out of or in connection with the Agreement that is not resolved amicably within 30 days of written notice shall be submitted to the exclusive jurisdiction of the competent courts of Paris, France, including for multi-party proceedings, notwithstanding any other jurisdiction clause. Nothing prevents either party from seeking urgent or interim relief at any time. For customers established in France, this clause applies only to the extent permitted by the French Code de procédure civile (article 48); otherwise the court that is competent under that code has jurisdiction.
          </p>
          <P>
            <strong>20.3 Talk to us first.</strong> Please contact us before starting any proceedings; we resolve almost every issue by email.
          </P>
          <P>
            <strong>20.4 Consumers.</strong> If you are a consumer, §20.2 does not apply: you benefit from the mandatory consumer-protection rules of your country of residence and may bring proceedings before the courts of that country. French consumers may also use free consumer mediation (Code de la consommation L612-1 et seq.) after first contacting us in writing; the médiateur de la consommation is being designated and will be named here and at <a href="/legal" className={link}>geotoolbox.ai/legal</a>. The EU online dispute resolution platform was discontinued on 20 July 2025.
          </P>
        </section>

        <section>
          <H2 id="general">21. General</H2>
          <P><strong>21.1 Entire agreement.</strong> The Agreement is the entire agreement between us on its subject matter and supersedes prior terms; if you have signed a separate written agreement with us, it prevails over these Terms in case of conflict.</P>
          <P><strong>21.2 Assignment.</strong> You may not assign the Agreement without our consent. We may assign it to a successor of our business on notice.</P>
          <P><strong>21.3 Force majeure.</strong> Neither party is liable for delay or failure caused by events beyond its reasonable control (including third-party platform outages, network failures, and acts of authorities), except payment obligations.</P>
          <P><strong>21.4 Severability; waiver.</strong> If a provision is held unenforceable, it is limited to the minimum extent necessary and the rest remains in force. A failure to enforce is not a waiver.</P>
          <P><strong>21.5 Notices.</strong> We may notify you by email to your account address or in-app; our notices are deemed received on the business day after sending. You notify us at <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a>; your notices (including cancellations) are effective when they reach our mail server.</P>
          <P><strong>21.6 Language.</strong> These Terms are written in English. Translations are provided for convenience; where a translation is required by mandatory law for consumers, that translation applies to those consumers, and otherwise the English version prevails.</P>
          <P><strong>21.7 Claims period; sanctions.</strong> For business customers, any claim arising out of the Agreement must be brought within one year of the event giving rise to it. You represent that you are not subject to sanctions or export restrictions that would prohibit us from providing the Service.</P>
          <P><strong>21.8 Records.</strong> We keep a record of your acceptance of these Terms (version, timestamp, IP address, plan and disclosed price) and of billing communications, and may use it as evidence.</P>
        </section>

        <section>
          <H2 id="contact">22. Contact</H2>
          <P>
            Questions about these Terms, billing or cancellation:{" "}
            <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a>. Legal notice:{" "}
            <a href="/legal" className={link}>geotoolbox.ai/legal</a>.
          </P>
        </section>

        <section className="border-t border-gray-200 pt-8">
          <H2 id="annex-a">Annex A — French statutory texts (consumers and non-professionals only)</H2>
          <P>
            The following articles of the French Code de la consommation are reproduced in full as required by article L215-4 of that code. They apply only to contracts with consumers and non-professionals as defined by French law (a natural person acting for purposes outside their trade, business, craft or profession; or a legal person not acting for professional purposes). They do not apply to business customers (§2.2). Text as in force on 15 August 2026 (source: legifrance.gouv.fr).
          </P>
          <div className="mt-3 space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
            <p><strong>Article L215-1</strong> — Pour les contrats de prestations de services conclus pour une durée déterminée avec une clause de reconduction tacite, le professionnel prestataire de services informe le consommateur par écrit, par lettre nominative ou courrier électronique dédiés, au plus tôt trois mois et au plus tard un mois avant le terme de la période autorisant le rejet de la reconduction, de la possibilité de ne pas reconduire le contrat qu&apos;il a conclu avec une clause de reconduction tacite. Cette information, délivrée dans des termes clairs et compréhensibles, mentionne, dans un encadré apparent, la date limite de non-reconduction.<br />
            Lorsque cette information ne lui a pas été adressée conformément aux dispositions du premier alinéa, le consommateur peut mettre gratuitement un terme au contrat, à tout moment à compter de la date de reconduction.<br />
            Les avances effectuées après la dernière date de reconduction ou, s&apos;agissant des contrats à durée indéterminée, après la date de transformation du contrat initial à durée déterminée, sont dans ce cas remboursées dans un délai de trente jours à compter de la date de résiliation, déduction faite des sommes correspondant, jusqu&apos;à celle-ci, à l&apos;exécution du contrat.<br />
            Les dispositions du présent article s&apos;appliquent sans préjudice de celles qui soumettent légalement certains contrats à des règles particulières en ce qui concerne l&apos;information du consommateur.<br />
            Par exception au premier alinéa du présent article, pour les contrats de fourniture de service de télévision au sens de l&apos;article 2 de la loi n° 86-1067 du 30 septembre 1986 relative à la liberté de communication et pour les contrats de fourniture de services de médias audiovisuels à la demande, le consommateur peut mettre gratuitement un terme au contrat, à tout moment à compter de la première reconduction, dès lors qu&apos;il change de domicile ou que son foyer fiscal évolue.</p>
            <p><strong>Article L215-1-1</strong> — Lorsqu&apos;un contrat a été conclu par voie électronique ou a été conclu par un autre moyen et que le professionnel, au jour de la résiliation par le consommateur, offre au consommateur la possibilité de conclure des contrats par voie électronique, la résiliation est rendue possible selon cette modalité. A cet effet, le professionnel met à la disposition du consommateur une fonctionnalité gratuite permettant d&apos;accomplir, par voie électronique, la notification et les démarches nécessaires à la résiliation du contrat. Lorsque le consommateur notifie la résiliation du contrat, le professionnel lui confirme la réception de la notification et l&apos;informe, sur un support durable et dans des délais raisonnables, de la date à laquelle le contrat prend fin et des effets de la résiliation.</p>
            <p><strong>Article L215-2</strong> — Les dispositions du présent chapitre, à l&apos;exception de l&apos;article L. 215-1-1, ne sont pas applicables aux exploitants des services d&apos;eau potable et d&apos;assainissement.</p>
            <p><strong>Article L215-3</strong> — Les dispositions du présent chapitre sont également applicables aux contrats conclus entre des professionnels et des non-professionnels.</p>
            <p><strong>Article L241-3</strong> — Lorsque le professionnel n&apos;a pas procédé au remboursement dans les conditions prévues à l&apos;article L. 215-1, les sommes dues sont productives d&apos;intérêts au taux légal.</p>
          </div>
        </section>

        <section>
          <H2 id="annex-b">Annex B — Model withdrawal form (consumers only)</H2>
          <P>Complete and return this form only if you are a consumer and wish to withdraw from the contract (§8.6).</P>
          <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
            <p>To: Samy Ben Sadok (GEO Toolbox), 1 esplanade de Chantilly, 93330 Neuilly-sur-Marne, France — samy@geotoolbox.ai</p>
            <p className="mt-2">I/We (*) hereby give notice that I/We (*) withdraw from my/our (*) contract for the provision of the following service: GEO Toolbox subscription, plan ______________</p>
            <p className="mt-2">Ordered on (*) / received on (*): ______________</p>
            <p className="mt-2">Name of consumer(s): ______________</p>
            <p className="mt-2">Address of consumer(s): ______________</p>
            <p className="mt-2">Account email: ______________</p>
            <p className="mt-2">Signature of consumer(s) (only if this form is notified on paper): ______________</p>
            <p className="mt-2">Date: ______________</p>
            <p className="mt-2 text-gray-500">(*) Delete as appropriate.</p>
          </div>
        </section>
      </div>
    </div>
  )
}
