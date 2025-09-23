"use client";

function isPreview(): boolean {
  const env = (process.env.NEXT_PUBLIC_VERCEL_ENV || "").toLowerCase();
  if (env && env !== "production") return true;
  if (typeof window !== "undefined") {
    const host = window.location.hostname || "";
    if (host.includes("-git-") || host.includes(".vercel.app") || host.includes("localhost")) return true;
  }
  return false;
}

export default function PreviewBadge() {
  if (!isPreview()) return null;
  const ref = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF || "preview";
  const sha = (process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "").slice(0,7) || "no-sha";
  return (
    <div data-testid="preview-badge">
      <span className="select-none rounded-full bg-black/80 text-white text-xs px-3 py-1.5 shadow-md backdrop-blur">
        preview • <strong>{ref}</strong> • {sha}
      </span>
    </div>
  );
}
