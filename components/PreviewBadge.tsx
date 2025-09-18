'use client';
import { useEffect, useState } from "react";
export default function PreviewBadge() {
  const show = typeof process !== "undefined" && process.env.NEXT_PUBLIC_SHOW_PREVIEW_BADGE !== "false";
  const [isPreview, setIsPreview] = useState(false);
  const [branch, setBranch] = useState<string | null>(null);
  const [commit, setCommit] = useState<string | null>(null);
  useEffect(() => {
    if (!show) return;
    fetch("/api/health").then(r=>r.json()).then((d:any)=>{
      if (d?.env === "preview") setIsPreview(true);
      if (d?.branch) setBranch(d.branch);
      if (d?.commit) setCommit(d.commit);
    }).catch(()=>{});
  }, [show]);
  if (!show || !isPreview) return null;
  const commitUrl = commit ? `https://github.com/cristiantagle/Dropshipping-Store/commit/${commit}` : null;
  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-full px-4 py-2 shadow-lg border bg-white/80 backdrop-blur">
      <span className="text-sm font-medium">
        Preview
        {branch ? <span className="ml-2 text-xs opacity-70">({branch})</span> : null}
        {commit ? (
          <span className="ml-2 text-xs opacity-70">
            · <a className="underline" href={commitUrl!} target="_blank" rel="noreferrer">{commit.slice(0,7)}</a>
          </span>
        ) : null}
      </span>
    </div>
  );
}
