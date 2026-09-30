import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Uptime check endpoint (docs/14 §5). `commit` is the Git commit the build was made from. */
export function GET() {
  return NextResponse.json({
    status: "ok",
    time: new Date().toISOString(),
    commit: process.env.BUILD_COMMIT || null,
  });
}
