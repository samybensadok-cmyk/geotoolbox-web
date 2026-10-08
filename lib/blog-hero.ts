import type { Post } from "./content"
import heroes from "./blog-heroes.generated.json"

// Card hero = the article's own lead image, chosen at build time by
// scripts/gen-blog-heroes.mjs (see the rationale there). No filesystem access at
// request time. undefined means the card uses the generated thumbnail.
export type HeroImage = { src: string; width: number; height: number; contain: boolean }

export function heroImage(post: Pick<Post, "slug" | "locale">): HeroImage | undefined {
  return (heroes as Record<string, HeroImage>)[`${post.locale}/${post.slug}`]
}
