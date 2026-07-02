const NBSP = " " // no-break space
const NNBSP = " " // narrow no-break space
const APOS = "’" // typographic apostrophe
const SP = `[ ${NBSP}${NNBSP}]` // any space variant already present

/**
 * French typography fixes applied at render time (FR locale only), so MDX
 * sources stay plain-ASCII and future articles inherit the rules for free:
 *
 * - narrow no-break space (U+202F) before ; ? ! and inside « guillemets »
 * - no-break space (U+00A0) before :
 * - narrow no-break space before % € $ when preceded by a digit
 * - narrow no-break space as thousands separator (1 618)
 * - typographic apostrophe (U+2019) between letters
 *
 * Prevents orphan punctuation at line breaks — the visible tell separating
 * carefully-set French (e.g. JDN) from machine output.
 */
export function frenchTypography(text: string): string {
  return (
    text
      // guillemets: inner spaces become narrow no-break
      .replace(new RegExp(`«${SP}`, "g"), `«${NNBSP}`)
      .replace(new RegExp(`${SP}»`, "g"), `${NNBSP}»`)
      // space before double punctuation
      .replace(new RegExp(`${SP}+([;?!])`, "g"), `${NNBSP}$1`)
      .replace(new RegExp(`${SP}+:`, "g"), `${NBSP}:`)
      // digit + unit/symbol
      .replace(new RegExp(`(\\d)${SP}+([%€$])`, "g"), `$1${NNBSP}$2`)
      // thousands separator: digit, space, exactly three digits not followed by a digit
      .replace(new RegExp(`(\\d)${SP}(\\d{3})(?!\\d)`, "g"), `$1${NNBSP}$2`)
      // typographic apostrophe between letters (l'IA, aujourd'hui)
      .replace(/([A-Za-zÀ-ÖØ-öø-ÿ])'(?=[A-Za-zÀ-ÖØ-öø-ÿ])/g, `$1${APOS}`)
  )
}

const SKIP_TAGS = new Set(["code", "pre", "script", "style", "kbd", "samp"])

type HastNode = {
  type: string
  tagName?: string
  value?: string
  children?: HastNode[]
}

function walk(node: HastNode): void {
  if (node.type === "element" && node.tagName && SKIP_TAGS.has(node.tagName)) return
  if (node.type === "text" && typeof node.value === "string") {
    node.value = frenchTypography(node.value)
    return
  }
  if (node.children) for (const child of node.children) walk(child)
}

/**
 * Rehype plugin: applies frenchTypography() to every text node in the
 * rendered MDX tree, skipping code-like elements. Wire it into
 * rehypePlugins only when the post locale is `fr`.
 */
export function rehypeFrenchTypography() {
  return (tree: HastNode) => {
    walk(tree)
  }
}
