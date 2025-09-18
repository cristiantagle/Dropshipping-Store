import { NextResponse } from "next/server";

/**
 * Devuelve metadatos de entorno que Vercel expone:
 * - env: "production" | "preview" | "development"
 * - branch, commit
 * - repoUrl deducido desde Vercel (owner/slug)
 */
export async function GET() {
  const env = process.env.VERCEL_ENV || "development";
  const branch = process.env.VERCEL_GIT_COMMIT_REF || null;
  const commit = process.env.VERCEL_GIT_COMMIT_SHA || null;
  const owner = process.env.VERCEL_GIT_REPO_OWNER || null;
  const slug  = process.env.VERCEL_GIT_REPO_SLUG  || null;
  const repoUrl = owner && slug ? `https://github.com/${owner}/${slug}` : null;

  return NextResponse.json({
    ok: true,
    env,
    branch,
    commit,
    repoUrl,
    ts: new Date().toISOString()
  });
}
