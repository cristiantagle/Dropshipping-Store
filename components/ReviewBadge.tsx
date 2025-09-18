"use client";
type KV = Record<string, string | undefined>;
const short = (s?: string) => (s ? s.slice(0, 7) : "—");
function Row({ k, v }: { k: string; v?: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-500">{k}:</span>
      <code className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-800">{v ?? "—"}</code>
    </div>
  );
}
export default function ReviewBadge() {
  const env: KV = {
    BRANCH: process.env.VERCEL_GIT_COMMIT_REF,
    COMMIT: process.env.VERCEL_GIT_COMMIT_SHA,
    MSG: process.env.VERCEL_GIT_COMMIT_MESSAGE,
    URL: process.env.VERCEL_URL,
    PROD: process.env.VERCEL_PROJECT_PRODUCTION_URL,
    SITE: process.env.NEXT_PUBLIC_SITE_URL
  };
  return (
    <div className="mt-8 text-xs text-gray-600 border rounded-xl p-3 bg-gray-50">
      <div className="mb-1 font-semibold">Preview Info</div>
      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-1">
        <Row k="Rama" v={env.BRANCH} />
        <Row k="Commit" v={short(env.COMMIT)} />
        <Row k="Mensaje" v={env.MSG} />
        <Row k="Deploy URL" v={env.URL} />
        <Row k="Prod URL" v={env.PROD} />
        <Row k="SITE_URL" v={env.SITE} />
      </div>
    </div>
  );
}
