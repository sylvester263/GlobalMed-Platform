/**
 * Splits a document into overlapping chunks for embedding (docs/09 §3: ≈800 tokens, 100
 * overlap). Tokens are estimated at 4 characters each; chunks break on paragraph, then
 * sentence, boundaries where possible.
 */
export const CHARS_PER_TOKEN = 4;

export function chunkText(
  text: string,
  { tokens = 800, overlapTokens = 100 }: { tokens?: number; overlapTokens?: number } = {},
): string[] {
  const size = tokens * CHARS_PER_TOKEN;
  const overlap = overlapTokens * CHARS_PER_TOKEN;
  const normalised = text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (!normalised) return [];
  if (normalised.length <= size) return [normalised];

  const chunks: string[] = [];
  let start = 0;
  while (start < normalised.length) {
    let end = Math.min(start + size, normalised.length);
    if (end < normalised.length) {
      const window = normalised.slice(start, end);
      const breakAt = Math.max(window.lastIndexOf("\n\n"), window.lastIndexOf(". "));
      // Only break early if it keeps at least half a chunk.
      if (breakAt > size / 2) end = start + breakAt + 1;
    }
    chunks.push(normalised.slice(start, end).trim());
    if (end >= normalised.length) break;
    start = Math.max(end - overlap, start + 1);
  }
  return chunks.filter(Boolean);
}
