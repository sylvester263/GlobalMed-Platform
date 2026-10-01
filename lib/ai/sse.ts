/** Server-sent events parsing for the chat widget (fetch streams; EventSource can't POST). */

export type SseEvent = { event: string; data: unknown };

/**
 * Hostinger's CDN (hcdn) holds a streamed response until about 1.5–2 KB has built up
 * (measured with /api/chat/stream-check, 2026-10-01). Each flush is padded to this size with
 * an SSE comment, which clients ignore, so events arrive as they are sent.
 */
export const SSE_FLUSH_BYTES = 2048;

/** One SSE event, padded with a leading comment to at least `minBytes`. */
export function encodeSse(event: string, data: unknown, minBytes = 0): string {
  const body = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  const size = new TextEncoder().encode(body).length;
  return size >= minBytes ? body : `:${" ".repeat(Math.max(0, minBytes - size - 3))}\n\n${body}`;
}

/**
 * Splits buffered text into complete events. Returns the events and the unfinished rest,
 * which the caller prepends to the next chunk.
 */
export function parseSse(buffer: string): { events: SseEvent[]; rest: string } {
  const events: SseEvent[] = [];
  const blocks = buffer.replace(/\r\n/g, "\n").split("\n\n");
  const rest = blocks.pop() ?? "";
  for (const block of blocks) {
    let event = "message";
    const data: string[] = [];
    for (const line of block.split("\n")) {
      if (line.startsWith("event:")) event = line.slice(6).trim();
      else if (line.startsWith("data:")) data.push(line.slice(5).trimStart());
    }
    if (!data.length) continue;
    try {
      events.push({ event, data: JSON.parse(data.join("\n")) });
    } catch {
      events.push({ event, data: data.join("\n") });
    }
  }
  return { events, rest };
}
