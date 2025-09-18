'use client';
import { useEffect, useState } from "react";

export default function PreviewBadge() {
  // Toggle por env. Si es "false", se oculta. Cualquier otro valor o vacío = mostrar.
  const show = typeof process !== "undefined" && process.env.NEXT_PUBLIC_SHOW_PREVIEW_BADGE !== "false";

  // Hooks SIEMPRE al tope (nunca condicionales):
  const [isPreview, setIsPreview] = useState(false);
  const [branch, setBranch] = useState<string | null>(null);
  const [commit, setCommit] = useState<string | null>(null);
  const [repoUrl, setRepoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!show) return;
    fetch("/api/health")
      .then((r) => r.json())
      .then((data: any) => {
        if (data?.env === "preview") setIsPreview(true);
        if (data?.branch) setBranch(data.branch);
        if (data?.commit) setCommit(data.commit);
        if (data?.repoUrl) setRepoUrl(data.repoUrl);
      })
      .catch(() => {});
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
