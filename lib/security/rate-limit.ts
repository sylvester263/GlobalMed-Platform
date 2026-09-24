import "server-only";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { serverEnv } from "@/lib/server-env";

type Limit = { requests: number; windowSeconds: number };

/** Per-surface limits (docs/11 §4). */
export const limits = {
  leadForm: { requests: 5, windowSeconds: 600 },
  newsletter: { requests: 5, windowSeconds: 600 },
  verify: { requests: 30, windowSeconds: 60 },
  authLogin: { requests: 10, windowSeconds: 300 },
  authSignup: { requests: 5, windowSeconds: 3600 },
  authReset: { requests: 5, windowSeconds: 3600 },
  authMfa: { requests: 10, windowSeconds: 300 },
} satisfies Record<string, Limit>;

const redis =
  serverEnv.UPSTASH_REDIS_REST_URL && serverEnv.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: serverEnv.UPSTASH_REDIS_REST_URL,
        token: serverEnv.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

const limiters = new Map<string, Ratelimit>();

// Fallback when Upstash isn't configured: per-instance memory. Serverless instances don't
// share it, so production must set Upstash (listed in .env.example).
const memory = new Map<string, number[]>();

function memoryLimit(key: string, { requests, windowSeconds }: Limit): boolean {
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;
  const hits = (memory.get(key) ?? []).filter((t) => t > windowStart);
  if (hits.length >= requests) {
    memory.set(key, hits);
    return false;
  }
  hits.push(now);
  memory.set(key, hits);
  return true;
}

/** Returns true when the caller is within the limit. `identifier` is usually the client IP. */
export async function checkRateLimit(
  surface: keyof typeof limits,
  identifier: string,
): Promise<boolean> {
  const limit = limits[surface];
  const key = `${surface}:${identifier}`;
  if (!redis) return memoryLimit(key, limit);

  let limiter = limiters.get(surface);
  if (!limiter) {
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit.requests, `${limit.windowSeconds} s`),
      prefix: "gm-rl",
    });
    limiters.set(surface, limiter);
  }
  const { success } = await limiter.limit(key);
  return success;
}
