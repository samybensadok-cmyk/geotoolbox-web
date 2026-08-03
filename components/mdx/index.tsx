import type { MDXComponents } from "mdx/types"
import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { Callout } from "./callout"
import { YouTube } from "./youtube"
import { AffiliateDisclosure } from "./affiliate-disclosure"
import { BlogImage } from "./blog-image"
import { VerdictBox } from "./verdict-box"
import { AiCrawlerCheckerWidget } from "@/components/tools/ai-crawler-checker-widget"
import { slugify } from "@/lib/utils"
import { makeLocalizer } from "@/lib/i18n/siblings"
import { routing } from "@/i18n/routing"

/**
 * Best-effort string extraction from a React children tree. Good enough for
 * heading text (strings, <strong>, <em>, inline <code>). Returns the stripped
 * text, used to generate anchor slugs for heading `id` attributes.
 */
function childrenToText(children: ReactNode): string {
  if (typeof children === "string") return children
  if (typeof children === "number") return String(children)
  if (Array.isArray(children)) return children.map(childrenToText).join("")
  if (children && typeof children === "object" && "props" in children) {
    // @ts-expect-error — walking React elements
    return childrenToText(children.props.children)
  }
  return ""
}

// Non-anchor components are locale-independent, so they're shared across every
// locale's component map.
const baseComponents: MDXComponents = {
  Callout,
  YouTube,
  AffiliateDisclosure,
  AiCrawlerCheckerWidget,
  VerdictBox,
  Image,
  BlogImage,
  h2: ({ children, ...props }) => (
    <h2 id={slugify(childrenToText(children))} className="scroll-mt-24" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 id={slugify(childrenToText(children))} className="scroll-mt-24" {...props}>
      {children}
    </h3>
  ),
}

/**
 * MDX component map for a given locale. The `a` renderer is locale-aware: an
 * internal /blog or /glossary link (relative or absolute geotoolbox.ai/...) is
 * rewritten to its localized sibling for `locale` when one exists (via the
 * donor-slug sibling map, the same source as hreflang), so a French reader
 * following an in-body link stays in the French cluster instead of landing on
 * the English page. Links with no sibling and external links pass through. For
 * the default locale (en) the localizer is a no-op, so EN output is unchanged.
 */
export function getMdxComponents(locale: string): MDXComponents {
  const localize = makeLocalizer(locale)
  return {
    ...baseComponents,
    a: ({ href, children, ...props }) => {
      // Affiliate redirect links (/go/<slug>) — sponsored, open in a new tab,
      // and NOT client-routed (server 302 redirect handler, not a page). Never
      // localized.
      if (href?.startsWith("/go/")) {
        return (
          <a href={href} target="_blank" rel="sponsored nofollow noopener noreferrer" {...props}>
            {children}
          </a>
        )
      }
      const dest = href ? localize(href) : href
      // Relative internal link -> client-routed <Link>. Absolute URLs (incl.
      // absolute internal geotoolbox.ai links, whose locale we still corrected)
      // keep the existing new-tab behavior.
      if (dest?.startsWith("/")) {
        return (
          <Link href={dest} {...props}>
            {children}
          </Link>
        )
      }
      return (
        <a href={dest} target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      )
    },
  }
}

// Back-compat default map (EN hub). getMdxComponents("en") builds a no-op
// localizer, so this stays byte-identical to the pre-localizer behavior and
// costs nothing at import time (no content index built for the default locale).
export const mdxComponents: MDXComponents = getMdxComponents(routing.defaultLocale)
