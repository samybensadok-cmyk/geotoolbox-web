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
      <p className="mt-2 text-sm text-gray-600">Last updated: April 15, 2026</p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-gray-600">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">1. What We Collect</h2>
          <p className="mt-2">
            When you sign in with Google, we receive your <strong>name</strong>, <strong>email address</strong>, and <strong>profile picture</strong> from your Google account.
          </p>
          <p className="mt-3">
            If you connect Google Search Console, we access your GSC property list and <strong>search performance data</strong> (queries, clicks, impressions, average position, country, device, page, date) for the sites you authorize, under the <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">https://www.googleapis.com/auth/webmasters.readonly</code> scope.
          </p>
          <p className="mt-3">
            If you connect Google Analytics 4, we access your GA4 property list and <strong>traffic metrics</strong> (sessions, users, engagement rate, conversions, landing pages, source dimensions) under the <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">https://www.googleapis.com/auth/analytics.readonly</code> scope. We use this to identify traffic from AI search engines (ChatGPT, Gemini, Claude, Perplexity, NotebookLM).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">2. How We Use Your Data</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>To authenticate you and display your account information</li>
            <li>To show your Google Search Console and Google Analytics 4 data within the GEO Toolbox dashboard</li>
            <li>To generate AI visibility reports for your domains</li>
          </ul>
          <p className="mt-3">
            <strong>Google user data use is strictly limited to the purposes listed above.</strong> We do not use Google user data to develop, improve, or train generalized AI or machine-learning models. We do not transfer Google user data to third parties except as necessary to provide or improve the Service, or as required by law. Our handling of Google user data conforms to the <a href="https://developers.google.com/terms/api-services-user-data-policy" className="text-accent-700 underline hover:text-accent-800">Google API Services User Data Policy</a>, including the Limited Use requirements.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">3. Data Storage and Retention</h2>
          <p className="mt-2">
            <strong>We do not store your raw Google Search Console or Google Analytics 4 data on our servers.</strong> All GSC and GA4 API responses are cached in your browser&apos;s localStorage for up to 6 hours and then automatically cleared. Clearing browser storage removes them immediately.
          </p>
          <p className="mt-3">
            Server-side storage is limited to:
          </p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Your OAuth tokens (access and refresh), encrypted at rest, retained until you disconnect</li>
            <li>Your connected GSC property and GA4 property identifiers</li>
            <li>Analysis outputs you explicitly generate (scan reports, domain overviews, content briefs, citability analyses, competitor radar scans), automatically purged 90 days after creation</li>
            <li>Error telemetry (anonymized, no PII) for up to 90 days</li>
            <li>AI visibility tracking data — the scheduled scans you&apos;ve configured plus their historical results — is retained for 24 months to provide year-over-year trend analysis. Removing a tracked brand from your dashboard soft-deletes the brand and its watchlist; aggregated scan history remains available for trend continuity for 24 months and is then purged.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">4. Data Sharing</h2>
          <p className="mt-2">
            We do not sell, rent, or share your personal data with third parties for marketing purposes. We use the following subprocessors to operate the Service:
          </p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Google OAuth: authentication</li>
            <li>Google Search Console API: search performance data</li>
            <li>Google Analytics Data API: AI traffic data</li>
            <li>Vercel: application hosting</li>
            <li>Replit: application hosting (PHP backend)</li>
            <li>Neon: PostgreSQL database hosting</li>
            <li>Sentry: error monitoring (no PII transmitted)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">5. Your Rights</h2>
          <p className="mt-2">You can:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Revoke GEO Toolbox&apos;s access to your Google account at any time at <a href="https://myaccount.google.com/permissions" className="text-accent-700 underline hover:text-accent-800">https://myaccount.google.com/permissions</a></li>
            <li>Disconnect GSC or GA4 from within the app&apos;s Analytics tab (the &ldquo;disconnect&rdquo; link under the connected-account badge)</li>
            <li>Request deletion of all server-side data by emailing <a href="mailto:samy@geotoolbox.ai" className="text-accent-700 underline hover:text-accent-800">samy@geotoolbox.ai</a>; we respond within 14 days</li>
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
            <a href="mailto:samy@geotoolbox.ai" className="text-accent-700 underline hover:text-accent-800">samy@geotoolbox.ai</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
