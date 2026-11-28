"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import s from "./service-experience.module.css"

// "Other services" strip at the foot of every service page. The page you are on is shown muted and is not a
// link (aria-current="page"); the others wrap in their own flex row.
const SERVICES = [
  { href: "/services/ai-seo-agency", label: "AI SEO" },
  { href: "/services/generative-engine-optimization", label: "GEO" },
  { href: "/services/answer-engine-optimization", label: "AEO" },
  { href: "/services/ai-automation-agency", label: "AI automation" },
]

export function RelatedServices() {
  const path = (usePathname() ?? "").replace(/\/+$/, "")
  return (
    <nav aria-label="Related services" className={s.related}>
      <span className={s.relatedLabel}>Other services</span>
      <div className={s.relatedLinks}>
        {SERVICES.map(x => x.href === path
          ? <span key={x.href} className={s.relatedHere} aria-current="page">{x.label}</span>
          : <Link key={x.href} href={x.href}>{x.label}</Link>)}
      </div>
    </nav>
  )
}
