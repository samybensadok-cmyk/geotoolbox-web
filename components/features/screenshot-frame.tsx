import Image from "next/image"

/**
 * ScreenshotFrame — a browser/app-chrome <figure> wrapper around a REAL product
 * screenshot, with optional numbered callout annotations and a caption. This
 * replaces the hand-coded JSX mock cards (acme.co/57, fake session numbers, the
 * "live" threat-feed widget) on the feature pages with real, annotated product
 * UI — the heaviest-weighted rubric dimension.
 *
 * Images live in /public/screenshots/<feature>/<name>.png. Always pass real,
 * descriptive `alt`. Never wrap a fabricated mock in this frame — it is for real
 * captures only.
 */

export type Callout = {
  /** label shown in the pill */
  label: string
  /** position as % of the image box */
  top: string
  left: string
}

export function ScreenshotFrame({
  src,
  alt,
  width,
  height,
  caption,
  callouts = [],
  chrome = true,
  priority = false,
}: {
  src: string
  alt: string
  width: number
  height: number
  caption?: string
  callouts?: Callout[]
  /** show the faux browser chrome bar */
  chrome?: boolean
  priority?: boolean
}) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_20px_60px_-24px_rgba(15,23,42,0.18)]">
      {chrome && (
        <div className="flex items-center gap-1.5 border-b border-gray-100 bg-gray-50 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
        </div>
      )}
      <div className="relative">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className="h-auto w-full"
          sizes="(min-width: 1024px) 640px, 100vw"
        />
        {callouts.map((c, i) => (
          <span
            key={i}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ top: c.top, left: c.left }}
          >
            <span className="flex items-center gap-1.5 rounded-full border border-accent-200 bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-accent-800 shadow-sm backdrop-blur">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent-600 text-[10px] font-bold text-white tabular-nums">
                {i + 1}
              </span>
              {c.label}
            </span>
          </span>
        ))}
      </div>
      {caption && (
        <figcaption className="border-t border-gray-100 px-4 py-2.5 text-[12px] text-gray-500">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
