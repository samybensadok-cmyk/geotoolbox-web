"use client"

import Link from "next/link"
import { NewsletterSignup, NEWSLETTER_COPY_EN } from "@/components/newsletter/newsletter-signup"
import styles from "./tool-experience.module.css"

/** Optional newsletter opt-in after results. Never gates results or exports. */
export function ToolResultCapture({ slug, what }: { slug: string; what: string }) {
  return <aside className={styles.capture} aria-label="Optional email updates">
    <div>
      <p className={styles.captureLabel}>Your {what} is ready · Optional next step</p>
      <h3>Keep up with AI search.</h3>
      <p>Get new GEO guides and research by email when we publish. Free to join. Unsubscribe anytime.</p>
    </div>
    <div>
      <NewsletterSignup source={`tool:${slug}`} compact copy={{ ...NEWSLETTER_COPY_EN, submit: "Get email updates" }} />
      <p className={styles.privacy}>Subscribe to the GEO Toolbox newsletter. Confirm via email. <Link href="/privacy">Privacy policy</Link>.</p>
    </div>
  </aside>
}
