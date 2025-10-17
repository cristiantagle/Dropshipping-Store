import { cookies } from "next/headers";

function page(body: string, status = 200) {
  return new Response(
    `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>AliExpress OAuth</title><style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#f8fafc;color:#0f172a;padding:24px}.box{max-width:720px;margin:40px auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;box-shadow:0 8px 24px rgba(15,23,42,.06)}.box h1{font-size:20px;margin:0;padding:20px 24px;border-bottom:1px solid #f1f5f9}.box .content{padding:20px 24px}.ok{color:#16a34a}.warn{color:#b45309}.err{color:#dc2626}.meta{font-size:12px;color:#475569;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;overflow:auto;white-space:pre-wrap}</style></head><body>${body}</body></html>`,
    { status, headers: { "content-type": "text/html; charset=utf-8" } }
  );
}

async function exchangeToken(params: {
  code: string;
  redirectUri: string;
}) {
  const clientId = process.env.AE_APP_KEY!;
  const clientSecret = process.env.AE_APP_SECRET!;
  const tokenUrl = process.env.AE_OAUTH_TOKEN_URL || "https://oauth.aliexpress.com/token";

  const form = new URLSearchParams();
  form.set("grant_type", "authorization_code");
  form.set("client_id", clientId);
  form.set("client_secret", clientSecret);
  form.set("code", params.code);
  form.set("redirect_uri", params.redirectUri);

  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: form.toString(),
    // Node runtime only
    cache: "no-store",
  });
  const text = await res.text();
  let json: any;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!res.ok) {
    throw new Error(`Token HTTP ${res.status}: ${text}`);
  }
  return json;
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
    return page(
      `<div class="box"><h1 class="ok">AliExpress – Autorización completada</h1><div class="content"><p>Se canjeó el código por tokens correctamente.</p><div class="meta">${
        token ? JSON.stringify({
          access_token: mask(token.access_token),
          refresh_token: mask(token.refresh_token),
          expires_in: token.expires_in,
          scope: token.scope,
          user_id: token.user_id || token.uid,
        }, null, 2) : "Sin datos"
      }</div><p>Importante: persiste estos tokens de forma segura en el servidor (DB/KV). Actualmente solo se muestran con máscara para verificación.</p></div></div>`
    );
  } catch (e: any) {
    return page(
      `<div class="box"><h1 class="err">AliExpress – Error al canjear token</h1><div class="content"><p>No se pudo completar el intercambio code → access_token.</p><div class="meta">${e?.message || e}</div><p>Verifica que el <code>redirect_uri</code> coincida exactamente en la consola y que la app esté Online.</p></div></div>`,
      500
    );
  }
}
