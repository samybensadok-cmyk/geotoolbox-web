import Image from "next/image"

/**
 * Author avatar. Renders a headshot when `src` is provided, otherwise a clean
 * initials monogram so the byline and bio cards never show a broken image.
 */
export function Avatar({
  name,
  src,
  size = 48,
  className = "",
}: {
  name: string
  src?: string
  size?: number
  className?: string
}) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={size}
        height={size}
        className={`shrink-0 rounded-full object-cover ring-1 ring-black/5 ${className}`}
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-accent-100 font-semibold text-accent-800 ring-1 ring-accent-200/60 ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
    >
      {initials}
    </span>
  )
}
