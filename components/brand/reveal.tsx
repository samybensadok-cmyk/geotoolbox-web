"use client"

import { useEffect } from "react"

/**
 * Scroll reveal for elements marked `data-reveal` (styles in app/globals.css). Discreet by design:
 * a 16px rise + fade, once. Anything already on screen when the page hydrates is never hidden, the
 * content stays visible without JavaScript, and reduced-motion visitors get no animation at all.
 * Stagger: set `style={{ "--rd": n }}` on siblings.
 */
export function RevealOnScroll() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          ;(entry.target as HTMLElement).dataset.reveal = "in"
          io.unobserve(entry.target)
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    )
    const limit = window.innerHeight * 0.92
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      if (el.dataset.reveal === "in") return
      if (el.getBoundingClientRect().top < limit) return
      el.dataset.reveal = "wait"
      io.observe(el)
    })
    return () => io.disconnect()
  }, [])
  return null
}
