import type { Metadata } from "next"
import { siteConfig } from "@/lib/config"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How GEO Toolbox collects, uses, and protects your data.",
  alternates: { canonical: `${siteConfig.url}/privacy` },
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-gray-600">Last updated: April 13, 2026</p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-gray-600">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">1. What We Collect</h2>
          <p className="mt-2">
            When you sign in with Google, we receive your <strong>name</strong>, <strong>email address</strong>, and <strong>profile picture</strong> from your Google account. If you connect Google Search Console, we access your <strong>search performance data</strong> (queries, clicks, impressions, positions) for the sites you authorize.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">2. How We Use Your Data</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>To authenticate you and display your account information</li>
            <li>To show your Google Search Console data within the GEO Toolbox dashboard</li>
            <li>To generate AI visibility reports for your domains</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">3. Data Storage</h2>
          <p className="mt-2">
            Google Search Console data is cached locally in your browser (localStorage) and is not stored on our servers. Scan results and domain overviews are stored in our database to provide historical comparisons.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">4. Data Sharing</h2>
          <p className="mt-2">
            We do not sell, rent, or share your personal data with third parties. We use the following services to operate the tool:
          </p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Google OAuth for authentication</li>
            <li>Google Search Console API for search data</li>
            <li>Sentry for error monitoring (no PII transmitted)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">5. Your Rights</h2>
          <p className="mt-2">You can:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Revoke GEO Toolbox&apos;s access to your Google account at any time via your <a href="https://myaccount.google.com/permissions" className="text-accent-700 underline hover:text-accent-800">Google Account permissions</a></li>
            <li>Request deletion of your data by contacting us</li>
            <li>Clear locally cached data by clearing your browser storage</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">6. Cookies</h2>
          <p className="mt-2">
            We use essential cookies for session management. We do not use advertising or tracking cookies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">7. Contact</h2>
          <p className="mt-2">
            For privacy questions or data deletion requests, email{" "}
            <a href="mailto:hello@geotoolbox.ai" className="text-accent-700 underline hover:text-accent-800">hello@geotoolbox.ai</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
