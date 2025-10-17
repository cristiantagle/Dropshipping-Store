import { cookies } from "next/headers";

function badRequest(msg: string) {
  return new Response(msg, { status: 400, headers: { "content-type": "text/plain; charset=utf-8" } });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const appKey = process.env.AE_APP_KEY;
  const authBase = process.env.AE_OAUTH_AUTH_URL || "https://oauth.aliexpress.com/authorize";
  if (!appKey) return badRequest("AE_APP_KEY is not set on the server");

  // Build redirect_uri
  const explicit = process.env.AE_REDIRECT_URI; // optional explicit override
  let base = process.env.NEXT_PUBLIC_URL;
  if (!base) {
    const proto = url.protocol; // already includes ':'
    const host = url.host;
    base = `${proto}//${host}`;
  }
  const redirectUri = explicit || `${base}/api/aliexpress/oauth/callback`;

  // State
  const state = Math.random().toString(36).slice(2) + Date.now().toString(36);
  const cookieStore = cookies();
  cookieStore.set("ae_oauth_state", state, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 10 * 60 });

  // Optional scope; leave blank unless you know required scopes
  const scope = process.env.AE_OAUTH_SCOPE || "";

  const authUrl = new URL(authBase);
  authUrl.searchParams.set("client_id", appKey);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("state", state);
  if (scope) authUrl.searchParams.set("scope", scope);

  return new Response(null, { status: 302, headers: { Location: authUrl.toString() } });
}
