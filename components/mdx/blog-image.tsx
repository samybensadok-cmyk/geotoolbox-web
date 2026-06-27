import Image from "next/image"

/**
 * Blog hero/figure image for MDX.
 *
 * Why this exists instead of using <Image> directly in MDX: under Turbopack dev,
 * next-mdx-remote/rsc strips the `width`/`height` attributes off MDX JSX before
 * the component is called (by attribute name — string or numeric, both vanish),
 * so next/image throws "missing required width property" and the page 500s in dev.
 * Production is unaffected, but the dev 500 makes image posts un-previewable.
 *
 * Passing the dimensions under different prop names (`w`/`h`) survives the strip;
 * we map them back to real width/height here. Works identically in dev and prod.
 */
export function BlogImage({
  w,
  h,
  alt,
  ...rest
}: {
  src: string
  w: number | string
  h: number | string
  alt: string
  sizes?: string
  className?: string
}) {
  return <Image {...rest} alt={alt} width={Number(w)} height={Number(h)} />
}
