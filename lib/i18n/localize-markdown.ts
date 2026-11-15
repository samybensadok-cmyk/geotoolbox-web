// Applies an href localizer to the link targets in a markdown document: the
// `.md` twins of localized articles. Rewrites `](url)` / `](<url> "title")`
// targets, `<https://...>` autolinks, reference definitions (`[x]: url`) and raw
// `href="..."` attributes. Never touches fenced code blocks or inline code
// spans, so a URL shown as code stays exactly as written.

const INLINE_CODE = /(`+)(.+?)\1(?!`)/g
const FENCE = /^\s{0,3}(```+|~~~+)/

// A target whose last path segment is a file (/blog/<slug>/figure.png) is an
// asset, typically an image: it lives under the EN slug folder in /public and
// has no localized twin, so it is never rewritten.
const FILE_TARGET = /\/[^/?#]*\.[a-z0-9]{2,5}(?:[?#].*)?$/i

function rewriteProse(text: string, loc: (href: string) => string): string {
  const localize = (url: string) => (FILE_TARGET.test(url) ? url : loc(url))
  return text
    .replace(/\]\(\s*(<?)([^()\s>]+)(>?)((?:\s+(?:"[^"]*"|'[^']*'))?)\s*\)/g, (_m, lt, url, gt, title) =>
      `](${lt}${localize(url)}${gt}${title})`)
    .replace(/<(https?:\/\/[^>\s]+)>/g, (_m, url) => `<${localize(url)}>`)
    .replace(/^(\s{0,3}\[[^\]]+\]:\s*)(\S+)/, (_m, pre, url) => `${pre}${localize(url)}`)
    .replace(/\bhref=(["'])([^"']*)\1/g, (_m, q, url) => `href=${q}${localize(url)}${q}`)
}

export function localizeMarkdownLinks(markdown: string, localize: (href: string) => string): string {
  let fence: string | null = null
  return markdown
    .split("\n")
    .map((line) => {
      const f = FENCE.exec(line)
      if (fence) {
        // a closing fence uses the same character and is at least as long
        if (f && f[1][0] === fence[0] && f[1].length >= fence.length) fence = null
        return line
      }
      if (f) {
        fence = f[1]
        return line
      }
      let out = ""
      let last = 0
      for (const m of line.matchAll(INLINE_CODE)) {
        out += rewriteProse(line.slice(last, m.index), localize) + m[0]
        last = m.index + m[0].length
      }
      return out + rewriteProse(line.slice(last), localize)
    })
    .join("\n")
}
