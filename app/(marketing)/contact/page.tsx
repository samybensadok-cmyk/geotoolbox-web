import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { ContactForm } from "@/components/contact/contact-form"
import { JsonLd } from "@/components/seo/json-ld"
import { DarkPage, Index, Arrow, kit as k } from "@/components/brand/dark-kit"
import { contactPageSchema, organizationSchema } from "@/lib/seo-schema"
import { BOOK_CALL } from "@/lib/plans"
import { siteConfig } from "@/lib/config"
import s from "./contact.module.css"

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
        <Link href="/pricing" className={s.inlineLink}>
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
        <Link href="/app" prefetch={false} className={s.inlineLink}>
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
    <DarkPage>
      <JsonLd data={[contactPageSchema(), organizationSchema()]} />

      {/* Hero */}
      <section className={`${k.heroGlow} ${s.hero}`} aria-labelledby="contact-title">
        <div className={k.wrap}>
          <Breadcrumbs tone="dark" trail={[{ name: "Home", href: "/" }, { name: "Contact", href: "" }]} />
          <div className={s.heroText}>
            <Index label="Get in touch" />
            <h1 id="contact-title" className={s.heroTitle}>Talk to us.</h1>
            <p className={k.heroLead}>
              Questions about AI visibility, the right plan, a partnership, or something that&apos;s not behaving? Send a
              message and a real person replies, usually within one business day.
            </p>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className={s.body}>
        <div className={`${k.wrap} ${s.grid}`}>
          {/* Form */}
          <div className={s.formCol}>
            <ContactForm />
          </div>

          {/* Aside */}
          <aside className={s.aside}>
            <div className={`${k.card} ${s.founder}`}>
              <Image src="/authors/samy-ben-sadok-linkedin.jpg" alt="" width={112} height={112} className={s.founderPhoto} />
              <div>
                <p className={s.founderName}>Samy Ben Sadok</p>
                <p className={s.founderRole}>Founder · messages sent here come to me</p>
                <Link href="/about" className={k.textLink}>About me<Arrow /></Link>
              </div>
            </div>

            <div className={`${k.card} ${s.box}`}>
              <h2 className={s.boxLabel}>Prefer email?</h2>
              <a href="mailto:samy@geotoolbox.ai" className={s.email}>
                samy@geotoolbox.ai
              </a>
              <p className={s.boxText}>Goes to the same place as the form. We reply within one business day.</p>
            </div>

            <div className={`${k.card} ${s.box}`}>
              <h2 className={s.boxLabel}>Prefer to talk?</h2>
              <p className={s.boxText}>Book a 30-minute call with me.</p>
              <a href={BOOK_CALL} data-cta-placement="contact_aside" className={`${k.btnOutline} ${s.boxBtn}`} target="_blank" rel="noopener noreferrer">
                Book a call<Arrow />
              </a>
            </div>

            <div className={`${k.card} ${s.box}`}>
              <h2 className={s.boxLabel}>What we can help with</h2>
              <ul className={s.channels}>
                {CHANNELS.map((c) => (
                  <li key={c.title}>
                    <p className={s.channelTitle}>{c.title}</p>
                    <p className={s.boxText}>{c.body}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`${k.card} ${s.box}`}>
              <h2 className={s.boxLabel}>Just exploring?</h2>
              <p className={s.boxText}>
                You don&apos;t need to email us to try it. Run a free scan and see how AI engines describe your brand.
              </p>
              <Link href="/app" prefetch={false} className={`${k.textLink} ${s.boxLink}`}>
                Run your first scan
                <Arrow />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </DarkPage>
  )
}
