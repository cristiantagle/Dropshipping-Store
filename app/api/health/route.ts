import { NextResponse } from "next/server";
export const runtime = "edge";
export async function GET() {
  const env = process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.VERCEL_ENV || "production";
  const branch = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF || process.env.VERCEL_GIT_COMMIT_REF || null;
  const commit = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || process.env.VERCEL_GIT_COMMIT_SHA || null;
  const normalized = env === "preview" ? "preview" : (env === "development" ? "development" : "production");
  return NextResponse.json({ ok: true, env: normalized, branch, commit, ts: Date.now() });
}
