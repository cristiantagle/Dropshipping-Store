"use client";
import { useEffect, useState } from "react";

type TokenStatus = {
  present: boolean;
  at_len?: number;
  rt_len?: number;
  expires_at?: string | null;
  scope?: string | null;
  user_id?: string | null;
  updated_at?: string | null;
  reason?: string;
  error?: string;
};

export default function TokensDiagPage() {
  const [status, setStatus] = useState<TokenStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/aliexpress/token/status")
      .then((r) => r.json())
      .then((j) => setStatus(j))
      .catch((e) => setStatus({ present: false, error: String(e) }))
      .finally(() => setLoading(false));
  }, []);

  const summary = loading
    ? "checking..."
    : status?.present
    ? `connected (expires ${status?.expires_at ?? "n/a"})`
    : status?.reason === "missing_service_role"
    ? "missing service role (not persisted)"
    : status?.error
    ? `error: ${status.error}`
    : "not connected";

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold">AliExpress Token Status</h1>
      <div className="rounded-lg border p-4 flex items-center justify-between">
        <span>OAuth</span>
        <span
          className={`font-semibold ${
            summary.startsWith("error") || summary.includes("not connected")
              ? "text-red-600"
              : summary.includes("missing service role")
              ? "text-amber-600"
              : "text-green-600"
          }`}
        >
          {summary}
        </span>
      </div>

      {!loading && status && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Details</h2>
          <pre className="text-xs bg-gray-50 border rounded p-3 overflow-auto">
{JSON.stringify({ at_len: status.at_len, rt_len: status.rt_len, expires_at: status.expires_at, scope: status.scope, user_id: status.user_id, updated_at: status.updated_at }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

