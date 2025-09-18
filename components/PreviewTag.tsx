"use client";
export default function PreviewTag() {
  const branch = process.env.VERCEL_GIT_COMMIT_REF || "local";
  const sha = (process.env.VERCEL_GIT_COMMIT_SHA || "0000000").slice(0,7);
  return (
    <div className="mt-6 text-[11px]">
      <span className="font-mono bg-gray-900 text-white px-2 py-1 rounded">
        Preview({branch}) · {sha}
      </span>
    </div>
  );
}
