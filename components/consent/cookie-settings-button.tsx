"use client"

// SG_CONSENT_V1 — footer "Cookie settings" trigger. Re-opens the consent
// banner so a visitor can change their choice at any time (GDPR withdrawal
// must be as easy as consent). Rendered inside the (server) Footer.
import { CONSENT_OPEN_EVENT } from "@/lib/consent"

export function CookieSettingsButton({ label = "Cookie settings" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
      className="text-xs text-gray-600 hover:text-gray-900 transition-colors"
    >
      {label}
    </button>
  )
}
