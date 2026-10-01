import { z } from "zod";

import { respond, type ChatEvent } from "@/lib/ai/engine";
import { encodeSse, SSE_FLUSH_BYTES } from "@/lib/ai/sse";
import {
  createConversation,
  getChatSettings,
  getConversation,
  hashToken,
  isStoreAvailable,
  newVisitorToken,
  tokenMatches,
} from "@/lib/ai/store";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { clientIp } from "@/lib/security/request";
import { verifyTurnstile } from "@/lib/security/turnstile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  message: z.string().trim().min(1).max(1000),
  visitorId: z.string().regex(/^[A-Za-z0-9_-]{8,64}$/),
  conversationId: z.uuid().optional(),
  token: z.string().min(16).max(128).optional(),
  turnstileToken: z.string().max(4096).optional(),
});

/**
 * Streaming headers: X-Accel-Buffering: no and Cache-Control: no-transform stop nginx-style
 * proxies buffering. Hostinger's CDN ignores them, so flushes are also padded (lib/ai/sse.ts).
 */
const sseHeaders = {
  "Content-Type": "text/event-stream; charset=utf-8",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
  "X-Accel-Buffering": "no",
};

function json(status: number, error: string) {
  return Response.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

/** Text parts are merged and sent at most this often, so padding stays small per reply. */
const DELTA_FLUSH_MS = 120;

/** POST /api/chat — one visitor message, answered as server-sent events (docs/09 §2). */
export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return json(400, "invalid");
  const { message, visitorId, conversationId, token, turnstileToken } = parsed.data;

  const ip = await clientIp();
  const [visitorOk, ipOk] = await Promise.all([
    checkRateLimit("chat", visitorId),
    checkRateLimit("chatIp", ip),
  ]);
  if (!visitorOk || !ipOk) return json(429, "rate_limited");
  if (!isStoreAvailable()) return json(503, "unavailable");

  let conversation;
  let newToken: string | undefined;
  if (conversationId) {
    conversation = await getConversation(conversationId);
    if (!conversation || !token || !tokenMatches(token, conversation.tokenHash)) {
      return json(404, "not_found");
    }
    if (conversation.status === "closed") return json(410, "closed");
  } else {
    // Turnstile on the first message only (fails closed without a secret, except local dry run).
    if (!(await verifyTurnstile(turnstileToken, ip))) return json(403, "verification_failed");
    newToken = newVisitorToken();
    conversation = await createConversation({
      visitorId,
      tokenHash: hashToken(newToken),
      summary: message.slice(0, 200),
    });
  }

  const settings = await getChatSettings();
  const current = conversation;
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) =>
        controller.enqueue(encoder.encode(encodeSse(event, data, SSE_FLUSH_BYTES)));
      let pending = "";
      let lastFlush = 0;
      const flush = () => {
        if (pending) send("delta", { text: pending });
        pending = "";
        lastFlush = Date.now();
      };

      send("meta", { conversationId: current.id, token: newToken, status: current.status });
      try {
        for await (const event of respond(current, message, settings)) {
          if (event.type === "delta") {
            pending += event.text;
            if (Date.now() - lastFlush >= DELTA_FLUSH_MS) flush();
            continue;
          }
          flush();
          const { type, ...data } = event as ChatEvent;
          send(type, data);
        }
        flush();
      } catch {
        flush();
        send("error", { message: "Something went wrong. Please try again or use WhatsApp." });
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, { headers: sseHeaders });
}
