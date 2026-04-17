import type { MDXComponents } from "mdx/types"
import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { Callout } from "./callout"
import { YouTube } from "./youtube"
import { slugify } from "@/lib/utils"

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

export const mdxComponents: MDXComponents = {
  Callout,
  YouTube,
  Image,
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
  a: ({ href, children, ...props }) => {
    if (href?.startsWith("/")) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      )
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    )
  },
}
