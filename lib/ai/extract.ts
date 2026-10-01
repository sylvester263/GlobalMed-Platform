/**
 * Plain text from a rendered page's <main> (knowledge-base sync from the live site). Drops
 * scripts, styles, SVG, hidden sizers (aria-hidden), forms' inputs and markup; keeps block
 * structure as line breaks.
 */

const entities: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  reg: "®",
  copy: "©",
  ndash: "–",
  mdash: "—",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
  middot: "·",
  hellip: "…",
};

export function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] === "#") {
      const n =
        code[1]?.toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : match;
    }
    return entities[code.toLowerCase()] ?? match;
  });
}

export function extractMainText(html: string): string {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? html;
  const text = main
    .replace(/<(script|style|svg|noscript|template|form|nav)\b[\s\S]*?<\/\1>/gi, " ")
    // Invisible duplicates (slider sizers) and decorative text.
    .replace(/<(span|div|p)\b[^>]*aria-hidden="true"[^>]*>[^<]*<\/\1>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(
      /<\/(p|div|section|article|li|h[1-6]|tr|dd|dt|ul|ol|table|header|footer|blockquote)>/gi,
      "\n",
    )
    .replace(/<li\b[^>]*>/gi, "\n• ")
    .replace(/<[^>]+>/g, " ");
  return decodeEntities(text)
    .split("\n")
    .map((line) => line.replace(/[ \t ]+/g, " ").trim())
    .filter((line) => line && line !== "•")
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
}
