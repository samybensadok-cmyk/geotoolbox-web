"use client"

import { useCallback, useEffect, useRef, useState } from "react"

/**
 * Site-wide click-to-zoom lightbox (2026-07-31, operator ask).
 *
 * One instance mounts in RootShell and event-delegates on #main-content, so
 * every content image — blog figures (BlogImage/next-image), service-page and
 * feature-page screenshots, glossary images — becomes zoomable with ZERO edits
 * to articles or pages.
 *
 * Eligibility (checked at click time):
 *   - <img> inside #main-content
 *   - rendered ≥ 200px wide (skips icons, favicons, avatars, badges)
 *   - not inside an <a> (linked images keep navigating)
 *   - opt-out per image with data-nozoom
 *
 * Full quality: next/image serves a downscaled candidate for the layout slot;
 * for the lightbox we rewrite /_next/image?…&w=… to w=3840 (the largest
 * default device size — the optimizer never upscales past the original, so
 * this is simply "the original, optimized"). The quality param is left as-is
 * (Next 16 rejects qualities outside images.qualities). Plain /blog/… images
 * are already the original file.
 */

function fullResSrc(img: HTMLImageElement): string {
  const src = img.currentSrc || img.src
  try {
    const u = new URL(src, window.location.origin)
    if (u.pathname === "/_next/image" && u.searchParams.has("w")) {
      u.searchParams.set("w", "3840")
      return u.pathname + "?" + u.searchParams.toString()
    }
  } catch {
    /* relative/odd src — use as-is */
  }
  return src
}

export function ImageLightbox() {
  const [zoom, setZoom] = useState<{ src: string; alt: string } | null>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const lastFocus = useRef<HTMLElement | null>(null)

  const close = useCallback(() => setZoom(null), [])

  // Open — delegated click handler.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target
      if (!(t instanceof HTMLImageElement)) return
      if (!t.closest("#main-content")) return
      if (t.closest("a, button, [data-nozoom]")) return
      if (t.hasAttribute("data-nozoom")) return
      if (t.getBoundingClientRect().width < 200) return
      e.preventDefault()
      lastFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      setZoom({ src: fullResSrc(t), alt: t.alt || "" })
    }
    // Affordance — zoom-in cursor on eligible images, set lazily on first hover.
    const onOver = (e: MouseEvent) => {
      const t = e.target
      if (!(t instanceof HTMLImageElement) || t.style.cursor) return
      if (!t.closest("#main-content")) return
      if (t.closest("a, button, [data-nozoom]") || t.hasAttribute("data-nozoom")) return
      if (t.getBoundingClientRect().width < 200) return
      t.style.cursor = "zoom-in"
    }
    document.addEventListener("click", onClick)
    document.addEventListener("mouseover", onOver)
    return () => {
      document.removeEventListener("click", onClick)
      document.removeEventListener("mouseover", onOver)
    }
  }, [])

  // Close on Escape + scroll lock + focus management while open.
  useEffect(() => {
    if (!zoom) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    document.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeBtn.current?.focus()
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
      lastFocus.current?.focus()
    }
  }, [zoom, close])

  if (!zoom) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={zoom.alt || "Image preview"}
      onClick={close}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gray-950/85 p-4 backdrop-blur-sm sm:p-8"
      style={{ animation: "lb-fade .16s ease-out" }}
    >
      <style>{`
        @keyframes lb-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes lb-pop { from { transform: scale(.965); opacity: .6 } to { transform: none; opacity: 1 } }
      `}</style>
      <button
        ref={closeBtn}
        type="button"
        onClick={close}
        aria-label="Close image preview"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white transition-colors hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        ×
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element -- full-res URL is computed; optimizer handled upstream */}
      <img
        src={zoom.src}
        alt={zoom.alt}
        onClick={close}
        className="max-h-[86vh] max-w-[94vw] rounded-lg object-contain shadow-2xl"
        style={{ animation: "lb-pop .18s ease-out", cursor: "zoom-out" }}
      />
      {zoom.alt && (
        <p className="mt-3 max-w-2xl text-center text-[13px] leading-snug text-gray-300">{zoom.alt}</p>
      )}
    </div>
  )
}
