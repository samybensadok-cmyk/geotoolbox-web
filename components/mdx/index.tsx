import type { MDXComponents } from "mdx/types"
import Image from "next/image"
import Link from "next/link"
import { Callout } from "./callout"
import { YouTube } from "./youtube"

export const mdxComponents: MDXComponents = {
  Callout,
  YouTube,
  Image,
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
