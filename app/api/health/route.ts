import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Uptime check endpoint (docs/14 §5). */
export function GET() {
  return NextResponse.json({ status: "ok", time: new Date().toISOString() });
}
