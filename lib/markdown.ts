// Shared MDX → plain-markdown stripper used by the /md article twins and
// llms-full.txt. Keeps agent-facing markdown free of imports/JSX.
export function mdxToMarkdown(content: string): string {
  return content
    .replace(/^import\s.+$/gm, "")
    .replace(/^export\s.+$/gm, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "") // MDX comments
    .replace(/<BlogImage\s[^>]*src="([^"]+)"[^>]*alt="([^"]*)"[^>]*\/>/g, "![$2]($1)")
    .replace(/<BlogImage\s[^>]*alt="([^"]*)"[^>]*src="([^"]+)"[^>]*\/>/g, "![$1]($2)")
    .replace(/<YouTube\s[^>]*id="([^"]+)"[^>]*\/>/g, "Video: https://www.youtube.com/watch?v=$1")
    .replace(/<\/?Callout[^>]*>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}
