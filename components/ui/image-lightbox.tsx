"use client"

import { useCallback, useEffect, useRef, useState } from "react"

/**
 * Site-wide click-to-zoom lightbox (2026-07-31, operator ask).
 *
 * One instance mounts in RootShell and event-delegates on #main-content, so
 * every content visual — blog figures (BlogImage/next-image), service-page
 * screenshots, glossary images, AND the inline-SVG product mockups on feature
 * pages — becomes zoomable with ZERO edits to articles or pages.
 *
 * Eligibility (checked at click time):
 *   - <img> ≥ 200px rendered width, or <svg> ≥ 260×140 rendered (skips icons,
 *     avatars, checkmarks, sparklines)
 *   - inside #main-content, not inside an <a>/<button>
 *   - opt-out per element (or per subtree) with data-nozoom
 *
 * Raster quality: next/image serves a downscaled candidate for the layout
 * slot; the lightbox rewrites /_next/image?…&w=… to w=3840 (largest default
 * device size — the optimizer never upscales past the original). The quality
 * param is left as-is (Next 16 rejects qualities outside images.qualities).
 *
 * SVG mockups: the clicked <svg> is CLONED into the overlay (not serialized to
 * an <img>), so global Tailwind classes keep styling it and it stays vector-
 * crisp at any size. The clone gets a viewBox derived from its width/height
 * when missing, so CSS can scale it freely.
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

type Zoom =
  | { kind: "img"; src: string; alt: string }
  | { kind: "svg"; html: string; alt: string; ratio: number }
  /** DOM-mockup clone (feature/landing hero product mockups, marked
   *  data-zoomable): rendered at its natural width w and scaled by CSS
   *  transform — real DOM, so text/borders stay vector-crisp at any zoom. */
  | { kind: "dom"; html: string; alt: string; w: number; h: number; scale: number }

/** Nearest content <svg>, unwound to the OUTERMOST svg ancestor (a click's
 *  target is usually an inner <path>/<rect>; nested svgs resolve to the root). */
function outermostSvg(target: EventTarget | null): SVGSVGElement | null {
  if (!(target instanceof Element)) return null
  let svg = target.closest("svg")
  if (!svg) return null
  let parent = svg.parentElement?.closest("svg")
  while (parent) {
    svg = parent
    parent = svg.parentElement?.closest("svg")
  }
  return svg instanceof SVGSVGElement ? svg : null
}

function svgEligible(svg: SVGSVGElement): boolean {
  if (!svg.closest("#main-content")) return false
  if (svg.closest("a, button, [data-nozoom]")) return false
  const r = svg.getBoundingClientRect()
  return r.width >= 260 && r.height >= 140
}

function svgLabel(svg: SVGSVGElement): string {
  return (
    svg.getAttribute("aria-label") ||
    svg.querySelector(":scope > title")?.textContent ||
    svg.closest("figure")?.querySelector("figcaption")?.textContent ||
    ""
  ).trim()
}

/** Clone with a guaranteed viewBox and no fixed dimensions, so the overlay
 *  can scale it purely via CSS while preserving aspect. */
function svgCloneHtml(svg: SVGSVGElement): string {
  const clone = svg.cloneNode(true) as SVGSVGElement
  if (!clone.getAttribute("viewBox")) {
    const r = svg.getBoundingClientRect()
    const w = parseFloat(svg.getAttribute("width") || "") || r.width
    const h = parseFloat(svg.getAttribute("height") || "") || r.height
    if (w > 0 && h > 0) clone.setAttribute("viewBox", `0 0 ${w} ${h}`)
  }
  clone.removeAttribute("width")
  clone.removeAttribute("height")
  clone.setAttribute("aria-hidden", "true") // the dialog carries the label
  return clone.outerHTML
}

export function ImageLightbox() {
  const [zoom, setZoom] = useState<Zoom | null>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const lastFocus = useRef<HTMLElement | null>(null)

  const close = useCallback(() => setZoom(null), [])

  // Open — delegated click handler.
  useEffect(() => {
    const imgEligible = (t: EventTarget | null): t is HTMLImageElement =>
      t instanceof HTMLImageElement &&
      !!t.closest("#main-content") &&
      !t.closest("a, button, [data-nozoom]") &&
      !t.hasAttribute("data-nozoom") &&
      t.getBoundingClientRect().width >= 200

    const zoomableEligible = (t: EventTarget | null): HTMLElement | null => {
      if (!(t instanceof Element)) return null
      const box = t.closest("[data-zoomable]")
      if (!(box instanceof HTMLElement) || !box.closest("#main-content")) return null
      // Interactive elements inside a mockup keep working; a click on them
      // never zooms.
      if (t.closest("a, button")) return null
      const r = box.getBoundingClientRect()
      return r.width >= 200 && r.height >= 100 ? box : null
    }

    const onClick = (e: MouseEvent) => {
      if (imgEligible(e.target)) {
        e.preventDefault()
        lastFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
        setZoom({ kind: "img", src: fullResSrc(e.target), alt: e.target.alt || "" })
        return
      }
      const box = zoomableEligible(e.target)
      if (box) {
        e.preventDefault()
        lastFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
        const r = box.getBoundingClientRect()
        const ratio = r.width / Math.max(1, r.height)
        // Target width: fill the viewport (bounded by height via the aspect
        // ratio), but never render a mockup below its natural size.
        const target = Math.max(r.width, Math.min(0.94 * window.innerWidth, 0.86 * window.innerHeight * ratio))
        setZoom({ kind: "dom", html: box.outerHTML, alt: "", w: r.width, h: r.height, scale: target / r.width })
        return
      }
      const svg = outermostSvg(e.target)
      if (svg && svgEligible(svg)) {
        e.preventDefault()
        lastFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
        const r = svg.getBoundingClientRect()
        setZoom({ kind: "svg", html: svgCloneHtml(svg), alt: svgLabel(svg), ratio: r.width / Math.max(1, r.height) })
      }
    }
    // Affordance — zoom-in cursor on eligible visuals, set lazily on first hover.
    const onOver = (e: MouseEvent) => {
      if (imgEligible(e.target)) {
        if (!e.target.style.cursor) e.target.style.cursor = "zoom-in"
        return
      }
      const box = zoomableEligible(e.target)
      if (box) {
        if (!box.style.cursor) box.style.cursor = "zoom-in"
        return
      }
      const svg = outermostSvg(e.target)
      if (svg && svgEligible(svg) && !svg.style.cursor) svg.style.cursor = "zoom-in"
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
        .lb-svg > svg { width: 100%; height: auto; display: block; }
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
      {zoom.kind === "img" ? (
        // eslint-disable-next-line @next/next/no-img-element -- full-res URL is computed; optimizer handled upstream
        <img
          src={zoom.src}
          alt={zoom.alt}
          onClick={close}
          className="max-h-[86vh] max-w-[94vw] rounded-lg object-contain shadow-2xl"
          style={{ animation: "lb-pop .18s ease-out", cursor: "zoom-out" }}
        />
      ) : zoom.kind === "dom" ? (
        <div
          onClick={close}
          className="max-h-[86vh] max-w-[94vw] overflow-auto rounded-lg"
          style={{ animation: "lb-pop .18s ease-out", cursor: "zoom-out" }}
        >
          {/* Layout box sized to the SCALED mockup; the clone renders at its
              natural width and is transform-scaled (transforms don't affect
              layout, hence the explicit box). pointer-events off so any click
              inside the clone closes the overlay. */}
          <div style={{ width: zoom.w * zoom.scale, height: zoom.h * zoom.scale }}>
            <div
              style={{ width: zoom.w, transform: `scale(${zoom.scale})`, transformOrigin: "top left", pointerEvents: "none" }}
              dangerouslySetInnerHTML={{ __html: zoom.html }}
            />
          </div>
        </div>
      ) : (
        <div
          onClick={close}
          className="lb-svg overflow-hidden rounded-lg bg-white p-4 shadow-2xl sm:p-6"
          style={{
            // Fill the viewport while preserving the mockup's aspect ratio.
            width: `min(94vw, calc(82vh * ${zoom.ratio.toFixed(4)}))`,
            animation: "lb-pop .18s ease-out",
            cursor: "zoom-out",
          }}
          dangerouslySetInnerHTML={{ __html: zoom.html }}
        />
      )}
      {zoom.alt && (
        <p className="mt-3 max-w-2xl text-center text-[13px] leading-snug text-gray-300">{zoom.alt}</p>
      )}
    </div>
  )
}
