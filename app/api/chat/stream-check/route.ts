export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/chat/stream-check — five "tick" events 400ms apart, with the same headers as
 * /api/chat. If they arrive one by one, the hosting streams; if all at once after ~2s, a
 * proxy is buffering (docs/09 §10). Carries no data.
 */
export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      for (let i = 1; i <= 5; i++) {
        controller.enqueue(
          encoder.encode(`event: tick\ndata: ${JSON.stringify({ i, t: Date.now() })}\n\n`),
        );
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
      controller.close();
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
