"use client";

/**
 * Muestra: Preview(<rama>) · <commit7>
 * Usa variables que Vercel expone en runtime.
 */
export default function PreviewTag() {
  const branch =
    process.env.VERCEL_GIT_COMMIT_REF ||
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF ||
    "local";
  const shaFull =
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
    "0000000";
  const sha = shaFull.slice(0, 7);

  return (
    <div className="mt-6 text-[11px]">
      <span className="font-mono bg-gray-900 text-white px-2 py-1 rounded">
        Preview({branch}) · {sha}
      </span>
    </div>
  );
}
