import { NextRequest } from "next/server";
import { signHmacSHA256, toForm } from "@/lib/aliexpress/sign";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function bad(status: number, data: any) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export async function GET(req: NextRequest) {
  return handle(req);
}

export async function POST(req: NextRequest) {
  return handle(req);
}

async function handle(req: NextRequest) {
  const url = new URL(req.url);
  const appKey = process.env.AE_APP_KEY;
  const appSecret = process.env.AE_APP_SECRET;
  const endpoint = url.searchParams.get("endpoint") ||
    process.env.AE_SECURITY_TOKEN_URL ||
    "https://oauth.aliexpress.com/auth/token/security/create";

  if (!appKey || !appSecret) {
    return bad(400, { error: "missing_credentials", message: "AE_APP_KEY/AE_APP_SECRET not configured on server" });
  }

  const style = (url.searchParams.get("style") as any) || "concat"; // or "taobao"
  const method = (url.searchParams.get("method") as any) || "POST"; // GET or POST
  const debug = url.searchParams.get("debug") === "1";

  // Basic parameters commonly required
  const unit = url.searchParams.get("unit") || "ms"; // ms | sec
  const ts = Date.now();
  const timestamp = unit === "sec" ? Math.floor(ts / 1000) : ts;
  const signMethod = url.searchParams.get("sign_method") || "HMAC-SHA256"; // allow override casing
  const baseParams: Record<string, string | number> = {
    app_key: appKey,
    timestamp,
    sign_method: signMethod,
  };

  // Optional pass-through parameters (nonce, format, v, etc.)
  const passthrough = ["nonce", "format", "v", "partner_id", "sdk", "sign_method", "app_signature"] as const;
  for (const key of passthrough) {
    const v = url.searchParams.get(key);
    if (v) (baseParams as any)[key] = v;
  }

  // Build signature across known schemes
  const sign = signHmacSHA256(baseParams, appSecret, style);
  const reqParams = { ...baseParams, sign } as Record<string, string | number>;

  if (debug) {
    return bad(200, {
      endpoint,
      method,
      params: reqParams,
      style,
      unit,
      note: "If the endpoint rejects the request, adjust endpoint (query or AE_SECURITY_TOKEN_URL), timestamp unit (unit=sec), sign method (sign_method), or signature style (style=taobao).",
    });
  }

  try {
    const res = await fetch(endpoint, {
      method,
      headers: method === "POST" ? { "content-type": "application/x-www-form-urlencoded" } : undefined,
      body: method === "POST" ? toForm(reqParams) : undefined,
      cache: "no-store",
    });
    const text = await res.text();
    let data: any = text;
    try { data = JSON.parse(text); } catch {}
    if (!res.ok) {
      return bad(res.status, { error: "remote_error", status: res.status, body: data });
    }
    return bad(200, { ok: true, data });
  } catch (e: any) {
    return bad(500, { error: "network_error", message: e?.message || String(e) });
  }
}
