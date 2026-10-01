export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/chat/stream-check — five "tick" events 400ms apart, with the same headers as
 * /api/chat. If they arrive one by one, the hosting streams; if all at once after ~2s, a
 * proxy is buffering (docs/09 §10). Carries no data.
 *
 * Diagnostics for the hosting CDN: `?pad=<bytes>` (≤ 16384) adds an SSE comment of that size
 * before each event, and `?type=plain` sends text/plain instead of text/event-stream.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const pad = Math.min(Math.max(Number(params.get("pad")) || 0, 0), 16384);
  const plain = params.get("type") === "plain";
  const padding = pad ? `:${" ".repeat(pad)}\n\n` : "";
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      for (let i = 1; i <= 5; i++) {
        controller.enqueue(
          encoder.encode(
            `${padding}event: tick\ndata: ${JSON.stringify({ i, t: Date.now() })}\n\n`,
          ),
        );
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
      controller.close();
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": plain ? "text/plain; charset=utf-8" : "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
