import { NextResponse } from "next/server";

export async function GET() {
  const env = process.env.VERCEL_ENV || "development"; // "production" | "preview" | "development"
  const branch = process.env.VERCEL_GIT_COMMIT_REF || null;
  const commit = process.env.VERCEL_GIT_COMMIT_SHA || null;
  const repoOwner = process.env.VERCEL_GIT_REPO_OWNER || null;
  const repoSlug = process.env.VERCEL_GIT_REPO_SLUG || null;
  const repoUrl = repoOwner && repoSlug ? `https://github.com/${repoOwner}/${repoSlug}` : null;

  return NextResponse.json({
    ok: true,
    env,
    branch,
    commit,
    repoOwner,
    repoSlug,
    repoUrl,
    ts: new Date().toISOString()
  });
}
