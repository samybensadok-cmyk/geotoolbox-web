/**
 * Verbatim LLM answer excerpts arrive as raw markdown (bold markers, [n]
 * citation indices, link syntax, table rows, headings) and were rendered
 * as-is, which reads as garbage in a prospect-facing report. This is a
 * CLEANER, not a markdown renderer: syntax that can't render inside a
 * quote is stripped to text, **bold** becomes <strong>, and the engine's
 * own line structure is preserved by the caller via whitespace-pre-line.
 */

export function cleanLlmExcerpt(raw: string): string {
  let s = String(raw).replace(/\r\n/g, "\n")

  /* Table rows and |---| separators can't read as prose; drop the lines. */
  s = s
    .split("\n")
    .filter((line) => !/^\s*\|.*\|\s*$/.test(line) && !/^\s*[-|:\s]+\s*$/.test(line.replace(/\|/g, "")))
    .join("\n")

  /* Headings: "### My recommendations" → "My recommendations". */
  s = s.replace(/^#{1,6}\s*/gm, "")

  /* Markdown links keep their label: "[www.g2.com](https://…)" → "www.g2.com". */
  s = s.replace(/\[([^\]]+)\]\((?:[^)]*)\)/g, "$1")

  /* Numeric citation runs "[1][2][13]" point at footnotes we don't show. */
  s = s.replace(/(?:\[\d{1,3}\])+/g, "")

  /* Bold variants normalize to ** for the renderer; lone emphasis marks go. */
  s = s.replace(/__([^_]+)__/g, "**$1**")

  /* Whitespace: spaces before punctuation left by stripped markers, 3+ blank
     lines, trailing space per line. */
  s = s
    .replace(/[ \t]+([.,;:!?])/g, "$1")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()

  /* Upstream clamps the excerpt mid-word ("…project managem"); make the cut
     honest. Unmatched trailing ** from the same cut dies in the renderer. */
  if (s !== "" && !/[.!?…"'’”)\]]$/.test(s)) s += "…"
  return s
}

export function ExcerptText({ text }: { text: string }) {
  const cleaned = cleanLlmExcerpt(text)
  const parts = cleaned.split(/\*\*([^*]+)\*\*/g)
  return (
    <>
      {parts.map((seg, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold">
            {seg}
          </strong>
        ) : (
          seg.replace(/\*\*/g, "")
        )
      )}
    </>
  )
}
