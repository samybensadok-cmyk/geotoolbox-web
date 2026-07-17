import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { ContactForm } from "@/components/contact/contact-form"
import { JsonLd } from "@/components/seo/json-ld"
import { contactPageSchema, organizationSchema } from "@/lib/seo-schema"
import { siteConfig } from "@/lib/config"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "A question about AI visibility, the right plan, or a scan that looks off? Send a message. A real person replies within one business day.",
  alternates: { canonical: `${siteConfig.url}/contact` },
  openGraph: {
    title: "Contact GEO Toolbox",
    description:
      "Questions about AI visibility, plans, or partnerships? Send us a message and we'll reply within one business day.",
    url: `${siteConfig.url}/contact`,
    type: "website",
  },
}

const CHANNELS = [
  {
    title: "Sales & plans",
    body: (
      <>
        Which plan fits, custom limits, Enterprise (SSO, dedicated CSM). See{" "}
        <Link href="/pricing" className="font-semibold text-accent-700 hover:text-accent-800">
          pricing
        </Link>{" "}
        first if you want the quick version.
      </>
    ),
  },
  {
    title: "Support",
    body: (
      <>
        Something not working, a scan looks off, or a billing question. Already a user? You can also reach us from inside the{" "}
        <Link href="/app" prefetch={false} className="font-semibold text-accent-700 hover:text-accent-800">
          app
        </Link>
        .
      </>
    ),
  },
  {
    title: "Partnerships",
    body: <>Agencies, integrations, affiliates, or content collaborations across the AI visibility and AI-search space.</>,
  },
]

export default function ContactPage() {
  return (
    <>
      <JsonLd data={[contactPageSchema(), organizationSchema()]} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--surface-warm,theme(colors.amber.50))] px-6 pt-14 pb-16 sm:pt-20 sm:pb-20">
        <div className="mx-auto max-w-5xl">
          <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Contact", href: "" }]} />
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">Contact</p>
          <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
            Talk to us.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-700">
            Questions about AI visibility, the right plan, a partnership, or something that&apos;s not behaving? Send a
            message and a real person replies, usually within one business day.
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>

          {/* Aside */}
          <aside className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-900">Prefer email?</h2>
              <a
                href="mailto:samy@geotoolbox.ai"
                className="mt-2 inline-block text-[15px] font-semibold text-accent-700 underline underline-offset-2 hover:text-accent-800"
              >
                samy@geotoolbox.ai
              </a>
              <p className="mt-1.5 text-[13px] leading-relaxed text-gray-600">
                Goes to the same place as the form. We reply within one business day.
              </p>
            </div>

            <div className="mt-5 space-y-5 rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-900">What we can help with</h2>
              {CHANNELS.map((c) => (
                <div key={c.title}>
                  <p className="text-[14px] font-semibold text-gray-900">{c.title}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-gray-600">{c.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-900">Just exploring?</h2>
              <p className="mt-2 text-[13px] leading-relaxed text-gray-600">
                You don&apos;t need to email us to try it. Run a free scan and see how AI engines describe your brand.
              </p>
              <Link
                href="/app"
                prefetch={false}
                className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent-700 hover:text-accent-800"
              >
                Run your first scan
                <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
