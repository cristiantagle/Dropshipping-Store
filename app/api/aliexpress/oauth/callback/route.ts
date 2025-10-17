import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";

function page(body: string, status = 200) {
  return new Response(
    `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>AliExpress OAuth</title><style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#f8fafc;color:#0f172a;padding:24px}.box{max-width:720px;margin:40px auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;box-shadow:0 8px 24px rgba(15,23,42,.06)}.box h1{font-size:20px;margin:0;padding:20px 24px;border-bottom:1px solid #f1f5f9}.box .content{padding:20px 24px}.ok{color:#16a34a}.warn{color:#b45309}.err{color:#dc2626}.meta{font-size:12px;color:#475569;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;overflow:auto;white-space:pre-wrap}</style></head><body>${body}</body></html>`,
    { status, headers: { "content-type": "text/html; charset=utf-8" } }
  );
}

async function exchangeToken(params: { code: string; redirectUri: string }) {
  const clientId = process.env.AE_APP_KEY!;
  const clientSecret = process.env.AE_APP_SECRET!;
  const primary = process.env.AE_OAUTH_TOKEN_URL || "https://oauth.aliexpress.com/token";

  // Candidate token endpoints (ordered)
  const tokenUrls = Array.from(new Set([
    primary,
    "https://api-sg.aliexpress.com/oauth/token",
    "https://api-sg.aliexpress.com/oauth/access_token",
    "https://oauth.aliexpress.com/token",
    "https://oauth.alibaba.com/token",
  ].filter(Boolean)));

  // Common payload
  const common = new URLSearchParams();
  common.set("grant_type", "authorization_code");
  common.set("client_id", clientId);
  common.set("client_secret", clientSecret);
  common.set("code", params.code);
  common.set("redirect_uri", params.redirectUri);
  common.set("need_refresh_token", "true");

  // Alternate payload using app_key instead of client_id
  const alt = new URLSearchParams(common);
  alt.delete("client_id");
  alt.set("app_key", clientId);

  const attempts: Array<{ url: string; method: "POST" | "GET"; body?: string; note: string }> = [];
  for (const url of tokenUrls) {
    // Prefer POST (standard), also try GET as some gateways expect query
    attempts.push({ url, method: "POST", body: common.toString(), note: `POST client_id @ ${url}` });
    const get1 = new URL(url); for (const [k, v] of common) get1.searchParams.set(k, v);
    attempts.push({ url: get1.toString(), method: "GET", note: `GET client_id @ ${url}` });

    // app_key variant
    attempts.push({ url, method: "POST", body: alt.toString(), note: `POST app_key @ ${url}` });
    const get2 = new URL(url); for (const [k, v] of alt) get2.searchParams.set(k, v);
    attempts.push({ url: get2.toString(), method: "GET", note: `GET app_key @ ${url}` });
  }

  const errors: string[] = [];
  for (const a of attempts) {
    try {
      const res = await fetch(a.url, {
        method: a.method,
        headers: a.method === "POST" ? { "content-type": "application/x-www-form-urlencoded" } : undefined,
        body: a.method === "POST" ? a.body : undefined,
        cache: "no-store",
      });
      const text = await res.text();
      let json: any;
      try {
        json = JSON.parse(text);
      } catch {
        // Some gateways return url-encoded body
        try {
          const sp = new URLSearchParams(text);
          const obj: any = {};
          for (const [k, v] of sp) obj[k] = v;
          json = obj;
        } catch {
          json = { raw: text };
        }
      }
      if (!res.ok) {
        errors.push(`HTTP ${res.status} ${a.note}`);
        // continue trying all endpoints/styles on 4xx/5xx
        continue;
      }
      // Normalize common fields
      const norm = {
        access_token: json.access_token || json.accessToken || json.data?.access_token || json.result?.access_token,
        refresh_token: json.refresh_token || json.refreshToken || json.data?.refresh_token || json.result?.refresh_token,
        expires_in: Number(json.expires_in || json.expiresIn || json.data?.expires_in || json.result?.expires_in || 0) || undefined,
        scope: json.scope || json.data?.scope || json.result?.scope,
        user_id: json.user_id || json.uid || json.data?.user_id || json.result?.user_id,
        raw: json,
      } as any;
      return norm;
    } catch (e: any) {
      errors.push(`${a.note}: ${e?.message || e}`);
    }
  }
  throw new Error(errors.join(" | "));
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const err = url.searchParams.get("error") || url.searchParams.get("error_description");

  const cookieStore = cookies();
  const expectedState = cookieStore.get("ae_oauth_state")?.value;

  if (err) {
    return page(
      `<div class="box"><h1 class="err">AliExpress – Authorization Error</h1><div class="content"><p>La autorización fue rechazada por AliExpress.</p><p class="meta"><strong>error</strong>: ${err}</p><p>Intenta nuevamente desde el inicio del flujo.</p></div></div>`,
      400
    );
  }
  if (!code) {
    return page(
      `<div class="box"><h1 class="warn">AliExpress – Falta código</h1><div class="content"><p>No se recibió el parámetro <code>code</code>.</p><p>Vuelve a iniciar el flujo de autorización desde tu panel.</p></div></div>`,
      400
    );
  }
  if (expectedState && state && expectedState !== state) {
    return page(
      `<div class="box"><h1 class="err">AliExpress – State inválido</h1><div class="content"><p>El parámetro <code>state</code> no coincide. Por seguridad, se detuvo el proceso.</p><div class="meta"><div><strong>state recibido</strong>: ${state}</div><div><strong>state esperado</strong>: ${expectedState}</div></div><p>Refresca la página donde iniciaste el flujo e inténtalo de nuevo.</p></div></div>`,
      400
    );
  }

  // Build redirect_uri consistently with start handler
  const explicit = process.env.AE_REDIRECT_URI;
  let base = process.env.NEXT_PUBLIC_URL;
  if (!base) base = `${url.protocol}//${url.host}`;
  const redirectUri = explicit || `${base}/api/aliexpress/oauth/callback`;

  // If no secret configured, show the code only (to avoid leaking)
  if (!process.env.AE_APP_SECRET) {
    return page(
      `<div class="box"><h1 class="ok">AliExpress – Código recibido</h1><div class="content"><p>La app está en línea. Ahora completa el intercambio de tokens en el servidor.</p><div class="meta"><div><strong>code</strong>: ${code}</div>${state ? `<div><strong>state</strong>: ${state}</div>` : ""}<div><strong>redirect_uri</strong>: ${redirectUri}</div></div></div></div>`
    );
  }

  try {
    const token = await exchangeToken({ code, redirectUri });
    const mask = (v: string) => (typeof v === "string" && v.length > 10 ? v.slice(0, 4) + "…" + v.slice(-4) : String(v));

    // Persist tokens (best-effort) if service role is configured and tokens present
    if (token?.access_token && token?.refresh_token && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supa = supabaseAdmin();
        const expiresAt = token.expires_in ? new Date(Date.now() + Number(token.expires_in) * 1000).toISOString() : null;
        await supa.from("aliexpress_tokens").upsert({
          id: 1,
          access_token: token.access_token,
          refresh_token: token.refresh_token,
          expires_at: expiresAt,
          scope: token.scope || null,
          user_id: token.user_id || null,
          updated_at: new Date().toISOString(),
        }, { onConflict: "id" });
      } catch {}
    }
    return page(
      `<div class="box"><h1 class="ok">AliExpress – Autorización completada</h1><div class="content"><p>Se canjeó el código por tokens correctamente.</p><div class="meta">${
        token ? JSON.stringify({
          access_token: mask(token.access_token),
          refresh_token: mask(token.refresh_token),
          expires_in: token.expires_in,
          scope: token.scope,
          user_id: token.user_id,
        }, null, 2) : "Sin datos"
      }</div><p>Importante: los tokens se guardan en el servidor si está configurada la Service Role Key. Si no, habilítala y repite el flujo.</p></div></div>`
    );
  } catch (e: any) {
    const tip = `Tried multiple endpoints: api-sg/oauth/token, api-sg/oauth/access_token, oauth.aliexpress.com/token, oauth.alibaba.com/token with POST/GET and client_id/app_key.`;
    return page(
      `<div class="box"><h1 class="err">AliExpress – Error al canjear token</h1><div class="content"><p>No se pudo completar el intercambio code → access_token.</p><div class="meta">${e?.message || e}</div><p>${tip}</p><p>Confirma que el <code>redirect_uri</code> registrado en la consola coincide exactamente y que el dominio de token es <code>api-sg.aliexpress.com/oauth/token</code>.</p></div></div>`,
      500
    );
  }
}
