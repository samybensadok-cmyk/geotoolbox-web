import { NEWSLETTER_COPY_EN, type NewsletterCopy } from "./newsletter-signup"

/**
 * Build the NewsletterSignup copy object from a `footer` messages record
 * (messages/{en,fr}.json → footer.newsletter*). Server-safe; both the Footer
 * band and the blog article placement use this so the widget is localized
 * from the one set of keys. Missing keys fall back to EN.
 */
export function newsletterCopyFrom(f?: Record<string, string>): NewsletterCopy {
  if (!f) return NEWSLETTER_COPY_EN
  return {
    title: f.newsletterTitle ?? NEWSLETTER_COPY_EN.title,
    description: f.newsletterDescription ?? NEWSLETTER_COPY_EN.description,
    placeholder: f.newsletterPlaceholder ?? NEWSLETTER_COPY_EN.placeholder,
    emailLabel: f.newsletterEmailLabel ?? NEWSLETTER_COPY_EN.emailLabel,
    submit: f.newsletterSubmit ?? NEWSLETTER_COPY_EN.submit,
    submitting: f.newsletterSubmitting ?? NEWSLETTER_COPY_EN.submitting,
    done: f.newsletterDone ?? NEWSLETTER_COPY_EN.done,
    honeypot: f.newsletterHoneypot ?? NEWSLETTER_COPY_EN.honeypot,
    errors: {
      missing_email: f.newsletterErrMissing ?? NEWSLETTER_COPY_EN.errors.missing_email,
      invalid_email: f.newsletterErrInvalid ?? NEWSLETTER_COPY_EN.errors.invalid_email,
      rate_limited: f.newsletterErrRate ?? NEWSLETTER_COPY_EN.errors.rate_limited,
      spam_detected: f.newsletterErrSpam ?? NEWSLETTER_COPY_EN.errors.spam_detected,
      internal_error: f.newsletterErrInternal ?? NEWSLETTER_COPY_EN.errors.internal_error,
      network: f.newsletterErrNetwork ?? NEWSLETTER_COPY_EN.errors.network,
    },
  }
}
