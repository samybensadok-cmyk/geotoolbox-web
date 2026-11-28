import Image from "next/image"
import { kit as k } from "@/components/brand/dark-kit"
import s from "./fx.module.css"

/**
 * ScreenshotFrame: a dark frame (thin border, slim chrome bar, mono caption bar) around a REAL
 * product screenshot, with optional numbered callouts. The screenshot itself is a light UI image:
 * it is never inverted or filtered, it sits on a dark mat.
 *
 * Images live in /public/screenshots/<feature>/<name>.png. Always pass real, descriptive `alt`.
 * Never wrap a fabricated mock in this frame; it is for real captures only.
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
  /** show the slim window bar */
  chrome?: boolean
  priority?: boolean
}) {
  return (
    <figure className={k.frame}>
      {chrome && (
        <div className={s.shotBar} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      )}
      <div className={s.shotMat}>
        <div className={s.shotImg}>
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            priority={priority}
            sizes="(min-width: 1024px) 640px, 100vw"
          />
          {callouts.map((c, i) => (
            <span key={i} className={s.callout} style={{ top: c.top, left: c.left }}>
              <span className={s.calloutPill}>
                <span className={s.calloutNum}>{i + 1}</span>
                {c.label}
              </span>
            </span>
          ))}
        </div>
      </div>
      {caption && <figcaption className={s.shotCap}>{caption}</figcaption>}
    </figure>
  )
}
