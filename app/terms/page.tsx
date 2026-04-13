import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using GEO Toolbox.",
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Terms of Service</h1>
      <p className="mt-2 text-sm text-gray-400">Last updated: April 13, 2026</p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-gray-600">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">1. Acceptance</h2>
          <p className="mt-2">
            By accessing or using GEO Toolbox (&quot;the Service&quot;), you agree to these Terms of Service. If you do not agree, do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">2. Description of Service</h2>
          <p className="mt-2">
            GEO Toolbox provides AI search visibility analytics, allowing you to track how your brand appears across AI engines including ChatGPT, Perplexity, Gemini, Claude, and others.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">3. Accounts</h2>
          <p className="mt-2">
            You may sign in using Google OAuth. You are responsible for maintaining the security of your Google account. You must not share your session or allow unauthorized access to the Service through your account.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">4. Acceptable Use</h2>
          <p className="mt-2">You agree not to:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Use the Service for any unlawful purpose</li>
            <li>Attempt to gain unauthorized access to any part of the Service</li>
            <li>Interfere with or disrupt the Service or its infrastructure</li>
            <li>Scrape, crawl, or use automated means to access the Service beyond its intended API</li>
            <li>Resell or redistribute data obtained from the Service without permission</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">5. Data and Privacy</h2>
          <p className="mt-2">
            Your use of the Service is also governed by our{" "}
            <a href="/privacy" className="text-accent-600 underline hover:text-accent-700">Privacy Policy</a>.
            You retain ownership of your data. We do not claim any rights to data you provide or that we access on your behalf through connected services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">6. Disclaimer of Warranties</h2>
          <p className="mt-2">
            The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied. We do not guarantee that the Service will be uninterrupted, error-free, or that results will be accurate or complete.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">7. Limitation of Liability</h2>
          <p className="mt-2">
            To the fullest extent permitted by law, GEO Toolbox and its operator shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">8. Termination</h2>
          <p className="mt-2">
            We may suspend or terminate your access to the Service at any time, with or without cause. You may stop using the Service at any time by revoking Google OAuth access.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">9. Changes to Terms</h2>
          <p className="mt-2">
            We may update these Terms from time to time. Continued use of the Service after changes constitutes acceptance of the revised Terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">10. Contact</h2>
          <p className="mt-2">
            Questions about these Terms? Email{" "}
            <a href="mailto:hello@geotoolbox.ai" className="text-accent-600 underline hover:text-accent-700">hello@geotoolbox.ai</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
