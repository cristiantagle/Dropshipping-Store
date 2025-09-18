'use client';
import { useEffect, useState } from "react";

export default function PreviewBadge() {
  // Toggle por env. Si es "false", se oculta.
  const show = typeof process !== "undefined" && process.env.NEXT_PUBLIC_SHOW_PREVIEW_BADGE !== "false";

  // Hooks al tope:
  const [isPreview, setIsPreview] = useState(false);
  const [branch, setBranch] = useState<string | null>(null);
  const [commit, setCommit] = useState<string | null>(null);
  const [repoUrl, setRepoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!show) return;

    // 1) Intento principal: /api/health
    fetch("/api/health")
      .then((r) => r.json())
      .then((data: any) => {
        if (data?.env === "preview") setIsPreview(true);
        if (data?.branch) setBranch(data.branch);
        if (data?.commit) setCommit(data.commit);
        if (data?.repoUrl) setRepoUrl(data.repoUrl);
      })
      .catch(() => {})
      .finally(() => {
        // 2) Fallback: variables públicas inyectadas en build
        if (!branch && process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF) {
          setBranch(process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF as string);
        }
        if (!commit && process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA) {
          setCommit(process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA as string);
        }
        if (!isPreview) {
          const maybeEnv = process.env.NEXT_PUBLIC_VERCEL_ENV;
          if (maybeEnv === "preview") setIsPreview(true);
          // Heurística de dominio git preview:
          if (typeof window !== "undefined" && window.location.hostname.includes("-git-")) {
            setIsPreview(true);
          }
        }
      });
  }, [show]);

  if (!show || !isPreview) return null;

  const commitUrl = commit && repoUrl ? `${repoUrl}/commit/${commit}` : null;

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-full px-4 py-2 shadow-lg border bg-white/80 backdrop-blur">
      <span className="text-sm font-medium">
        Preview
        {branch ? <span className="ml-2 text-xs opacity-70">({branch})</span> : null}
        {commit ? (
          <span className="ml-2 text-xs opacity-70">
            · {commitUrl ? (
              <a className="underline" href={commitUrl} target="_blank" rel="noreferrer">
                {commit.slice(0,7)}
              </a>
            ) : (
              commit.slice(0,7)
            )}
          </span>
        ) : null}
      </span>
    </div>
  );
}
