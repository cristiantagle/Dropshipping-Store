import { NextResponse } from "next/server";

export async function GET() {
  // Preferimos Vercel server env:
  let env = process.env.VERCEL_ENV || "";
  let branch = process.env.VERCEL_GIT_COMMIT_REF || "";
  let commit = process.env.VERCEL_GIT_COMMIT_SHA || "";
  const owner = process.env.VERCEL_GIT_REPO_OWNER || "";
  const slug  = process.env.VERCEL_GIT_REPO_SLUG  || "";
  const repoUrl = owner && slug ? `https://github.com/${owner}/${slug}` : null;

  // Fallbacks (inyectados en build por postinstall)
  if (!env) env = process.env.NEXT_PUBLIC_VERCEL_ENV || "";
  if (!branch) branch = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF || "";
  if (!commit) commit = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "";

  // Último fallback para detectar preview por heurística del dominio:
  let finalEnv = env || "development";
  if (finalEnv === "development" && (process.env.VERCEL_URL || "").includes("-git-")) {
    finalEnv = "preview";
  }

  return NextResponse.json({
    ok: true,
    env: finalEnv,
    branch: branch || null,
    commit: commit || null,
    repoUrl,
    ts: new Date().toISOString()
  });
}
