import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase/admin';

function page(body: string, status = 200) {
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>AliExpress OAuth</title><style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#f8fafc;color:#0f172a;padding:24px}.box{max-width:720px;margin:40px auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;box-shadow:0 8px 24px rgba(15,23,42,.06)}.box h1{font-size:20px;margin:0;padding:20px 24px;border-bottom:1px solid #f1f5f9}.box .content{padding:20px 24px}.ok{color:#16a34a}.warn{color:#b45309}.err{color:#dc2626}.meta{font-size:12px;color:#475569;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;overflow:auto;white-space:pre-wrap}</style></head><body>${body}</body></html>`;
  return new Response(html, { status, headers: { 'content-type': 'text/html; charset=utf-8' } });
}

async function exchangeToken(params: { code: string; redirectUri: string }) {
  const clientId = process.env.AE_APP_KEY!;
  const clientSecret = process.env.AE_APP_SECRET!;
  const primary = process.env.AE_OAUTH_TOKEN_URL || 'https://api-sg.aliexpress.com/oauth/token';

  const tokenUrls = Array.from(
    new Set([
      primary,
      'https://api-sg.aliexpress.com/oauth/access_token',
      'https://api-sg.aliexpress.com/oauth/token',
      'https://oauth.aliexpress.com/token',
      'https://oauth.alibaba.com/token',
    ]),
  );

  const common = new URLSearchParams();
  common.set('grant_type', 'authorization_code');
  common.set('client_id', clientId);
  common.set('client_secret', clientSecret);
  common.set('code', params.code);
  common.set('redirect_uri', params.redirectUri);
  common.set('need_refresh_token', 'true');

  const alt = new URLSearchParams(common);
  alt.delete('client_id');
  alt.set('app_key', clientId);

  const attempts: Array<{ url: string; method: 'POST' | 'GET'; body?: string; note: string }> = [];
  for (const url of tokenUrls) {
    attempts.push({
      url,
      method: 'POST',
      body: common.toString(),
      note: `POST client_id @ ${url}`,
    });
    const get1 = new URL(url);
    for (const [k, v] of common) get1.searchParams.set(k, v);
    attempts.push({ url: get1.toString(), method: 'GET', note: `GET client_id @ ${url}` });
    attempts.push({ url, method: 'POST', body: alt.toString(), note: `POST app_key @ ${url}` });
    const get2 = new URL(url);
    for (const [k, v] of alt) get2.searchParams.set(k, v);
    attempts.push({ url: get2.toString(), method: 'GET', note: `GET app_key @ ${url}` });
  }

  const errors: string[] = [];
  for (const a of attempts) {
    try {
      const res = await fetch(a.url, {
        method: a.method,
        headers:
          a.method === 'POST' ? { 'content-type': 'application/x-www-form-urlencoded' } : undefined,
        body: a.method === 'POST' ? a.body : undefined,
        cache: 'no-store',
      });
      const text = await res.text();
      let json: unknown;
      try {
        json = JSON.parse(text);
      } catch {
        try {
          const sp = new URLSearchParams(text);
          const obj: Record<string, string> = {};
          for (const [k, v] of sp) obj[k] = v;
          json = obj;
        } catch {
          json = { raw: text } as const;
        }
      }
      if (!res.ok) {
        errors.push(`HTTP ${res.status} ${a.note}`);
        continue;
      }
      const deepFind = (obj: unknown, matcher: (k: string) => boolean): unknown => {
        if (!obj || typeof obj !== 'object') return undefined;
        for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
          if (matcher(k)) return v as unknown;
          if (v && typeof v === 'object') {
            const r = deepFind(v, matcher);
            if (r !== undefined) return r;
          }
        }
        return undefined;
      };
      const listKeys = (obj: unknown, acc: string[] = [], depth = 0): string[] => {
        if (!obj || typeof obj !== 'object' || depth > 2) return acc;
        for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
          acc.push(k);
          if (v && typeof v === 'object') listKeys(v, acc, depth + 1);
        }
        return acc;
      };
      const toNumber = (v: unknown) => (v == null ? undefined : Number(v) || undefined);
      const norm = {
        access_token:
          (json as any).access_token ||
          (json as any).accessToken ||
          deepFind(json, (k) => /access[_-]?token/i.test(k)),
        refresh_token:
          (json as any).refresh_token ||
          (json as any).refreshToken ||
          deepFind(json, (k) => /refresh[_-]?token/i.test(k)),
        expires_in: toNumber(
          (json as any).expires_in ||
            (json as any).expiresIn ||
            deepFind(json, (k) => /expires[_-]?in/i.test(k)),
        ),
        scope: (json as any).scope || deepFind(json, (k) => /^scope$/i.test(k)),
        user_id:
          (json as any).user_id ||
          (json as any).uid ||
          deepFind(json, (k) => /user[_-]?id/i.test(k)),
        error_code: (json as any).error_code || deepFind(json, (k) => /error[_-]?code/i.test(k)),
        error_msg:
          (json as any).error_msg ||
          (json as any).error_message ||
          deepFind(json, (k) => /error[_-]?(msg|message)/i.test(k)),
        raw: { keys: listKeys(json).slice(0, 50) },
      } as {
        access_token?: string;
        refresh_token?: string;
        expires_in?: number;
        scope?: string;
        user_id?: string | number;
        error_code?: string | number;
        error_msg?: string;
        raw?: { keys: string[] };
      };
      return norm;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`${a.note}: ${msg}`);
    }
  }
  throw new Error(errors.join(' | '));
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const err = url.searchParams.get('error') || url.searchParams.get('error_description');

  const cookieStore = await cookies();
  const expectedState = cookieStore.get('ae_oauth_state')?.value;

  if (err) {
    return page(
      `<div class="box"><h1 class="err">AliExpress \u2013 Authorization Error</h1><div class="content"><p>La autorizaci\u00F3n fue rechazada por AliExpress.</p><p class=\"meta\"><strong>error</strong>: ${err}</p><p>Intenta nuevamente desde el inicio del flujo.</p></div></div>`,
      400,
    );
  }
  if (!code) {
    return page(
      `<div class=\"box\"><h1 class=\"warn\">AliExpress \u2013 Falta c\u00F3digo</h1><div class=\"content\"><p>No se recibi\u00F3 el par\u00E1metro <code>code</code>.</p><p>Vuelve a iniciar el flujo de autorizaci\u00F3n desde tu panel.</p></div></div>`,
      400,
    );
  }
  if (expectedState && state && expectedState !== state) {
    return page(
      `<div class=\"box\"><h1 class=\"err\">AliExpress \u2013 State inv\u00E1lido</h1><div class=\"content\"><p>El par\u00E1metro <code>state</code> no coincide. Por seguridad, se detuvo el proceso.</p><div class=\"meta\"><div><strong>state recibido</strong>: ${state}</div><div><strong>state esperado</strong>: ${expectedState}</div></div><p>Refresca la p\u00E1gina donde iniciaste el flujo e int\u00E9ntalo de nuevo.</p></div></div>`,
      400,
    );
  }

  const explicit = process.env.AE_REDIRECT_URI;
  let base = process.env.NEXT_PUBLIC_URL;
  if (!base) base = `${url.protocol}//${url.host}`;
  const redirectUri = explicit || `${base}/api/aliexpress/oauth/callback`;

  if (!process.env.AE_APP_SECRET) {
    return page(
      `<div class=\"box\"><h1 class=\"ok\">AliExpress \u2013 C\u00F3digo recibido</h1><div class=\"content\"><p>La app est\u00E1 en l\u00EDnea. Completa el intercambio de tokens en el servidor.</p><div class=\"meta\"><div><strong>code</strong>: ${code}</div>${state ? `<div><strong>state</strong>: ${state}</div>` : ''}<div><strong>redirect_uri</strong>: ${redirectUri}</div></div></div></div>`,
    );
  }

  try {
    const token = await exchangeToken({ code, redirectUri });
    const mask = (v: string) =>
      typeof v === 'string' && v.length > 10 ? v.slice(0, 4) + '\u2026' + v.slice(-4) : String(v);

    if (token?.access_token && token?.refresh_token && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supa = supabaseAdmin();
        const expiresAt = token.expires_in
          ? new Date(Date.now() + Number(token.expires_in) * 1000).toISOString()
          : null;
        await supa.from('aliexpress_tokens').upsert(
          {
            id: 1,
            access_token: token.access_token,
            refresh_token: token.refresh_token,
            expires_at: expiresAt,
            scope: token.scope || null,
            user_id: token.user_id || null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' },
        );
      } catch {}
    }

    const attemptedPersist = Boolean(
      token?.access_token && token?.refresh_token && process.env.SUPABASE_SERVICE_ROLE_KEY,
    );
    const debugNote =
      !token?.access_token || !token?.refresh_token
        ? {
            attemptedPersist,
            error_code: token?.error_code ?? null,
            error_msg: token?.error_msg ?? null,
            response_keys: token?.raw?.keys || [],
          }
        : { attemptedPersist };

    return page(
      `<div class=\"box\"><h1 class=\"ok\">AliExpress \u2013 Autorizaci\u00F3n completada</h1><div class=\"content\"><p>Se canje\u00F3 el c\u00F3digo por tokens correctamente.</p><div class=\"meta\">${token ? JSON.stringify({ access_token: mask(token.access_token || ''), refresh_token: mask(token.refresh_token || ''), expires_in: token.expires_in, scope: token.scope, user_id: token.user_id }, null, 2) : 'Sin datos'}</div><p>Importante: los tokens se guardan en el servidor si est\u00E1 configurada la Service Role Key. Si no, habil\u00EDtala y repite el flujo.</p><div class=\"meta\">${JSON.stringify(debugNote, null, 2)}</div></div></div>`,
    );
  } catch (e: unknown) {
    const tip =
      'Tried multiple endpoints and methods (POST/GET, client_id/app_key) across api-sg token URLs.';
    const message = e instanceof Error ? e.message : String(e);
    return page(
      `<div class=\"box\"><h1 class=\"err\">AliExpress \u2013 Error al canjear token</h1><div class=\"content\"><p>No se pudo completar el intercambio code \u2192 access_token.</p><div class=\"meta\">${message}</div><p>${tip}</p><p>Confirma que el <code>redirect_uri</code> registrado en la consola coincide exactamente y que el dominio de token es <code>api-sg.aliexpress.com</code>.</p></div></div>`,
      500,
    );
  }
}
