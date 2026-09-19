import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { DesignReview } from "@/components/landing/design-review"

export const metadata: Metadata = {
  title: "Homepage design review",
  robots: { index: false, follow: false },
}

/** Review tooling is available only in development and Vercel Preview builds. */
export default function DesignReviewPage() {
  if (process.env.NODE_ENV === "production" && process.env.VERCEL_ENV !== "preview") notFound()
  return <DesignReview />
}
