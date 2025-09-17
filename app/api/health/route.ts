import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ ok: true, env: process.env.NEXT_PUBLIC_SITE_URL ?? null, ts: new Date().toISOString() });
}
