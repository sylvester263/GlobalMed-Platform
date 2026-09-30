import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Uptime check endpoint (docs/14 §5). `commit` is the deployed Git commit on Vercel. */
export function GET() {
  return NextResponse.json({
    status: "ok",
    time: new Date().toISOString(),
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
  });
}
