import { cookies } from "next/headers";

function html(body: string) {
  return new Response(
    `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>AliExpress OAuth</title><style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#f8fafc;color:#0f172a;padding:24px}.box{max-width:680px;margin:40px auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;box-shadow:0 8px 24px rgba(15,23,42,.06)}.box h1{font-size:20px;margin:0;padding:20px 24px;border-bottom:1px solid #f1f5f9}.box .content{padding:20px 24px}.ok{color:#16a34a}.warn{color:#b45309}.err{color:#dc2626}.meta{font-size:12px;color:#475569;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;overflow:auto}</style></head><body>${body}</body></html>`,
    { status: 200, headers: { "content-type": "text/html; charset=utf-8" } }
  );
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const err = url.searchParams.get("error") || url.searchParams.get("error_description");

  const cookieStore = cookies();
  const expectedState = cookieStore.get("ae_oauth_state")?.value;

  if (err) {
    return html(
      `<div class="box"><h1 class="err">AliExpress – Authorization Error</h1><div class="content"><p>La autorización fue rechazada por AliExpress.</p><p class="meta"><strong>error</strong>: ${err}</p><p>Intenta nuevamente desde el inicio del flujo.</p></div></div>`
    );
  }

  if (!code) {
    return html(
      `<div class="box"><h1 class="warn">AliExpress – Falta código</h1><div class="content"><p>No se recibió el parámetro <code>code</code>.</p><p>Vuelve a iniciar el flujo de autorización desde tu panel.</p></div></div>`
    );
  }

  if (expectedState && state && expectedState !== state) {
    return html(
      `<div class="box"><h1 class="err">AliExpress – State inválido</h1><div class="content"><p>El parámetro <code>state</code> no coincide. Por seguridad, se detuvo el proceso.</p><div class="meta"><div><strong>state recibido</strong>: ${state}</div><div><strong>state esperado</strong>: ${expectedState}</div></div><p>Refresca la página donde iniciaste el flujo e inténtalo de nuevo.</p></div></div>`
    );
  }

  // En esta primera versión solo registramos el código para completar la configuración.
  // La integración de intercambio de tokens (code -> access_token) se hará con AE_APP_KEY/AE_APP_SECRET.

  const body = `
  <div class="box">
    <h1 class="ok">AliExpress – Autorización completada</h1>
    <div class="content">
      <p>Tu aplicación recibió el código de autorización correctamente.</p>
      <p>Completa la configuración del intercambio de tokens en el servidor para finalizar el enlace.</p>
      <div class="meta"><div><strong>code</strong>: ${code}</div>${state ? `<div><strong>state</strong>: ${state}</div>` : ""}</div>
      <p>Próximos pasos:</p>
      <ol>
        <li>Configura las variables <code>AE_APP_KEY</code> y <code>AE_APP_SECRET</code> en el servidor.</li>
        <li>Implementa el intercambio de tokens (code → access_token) en un endpoint server-only.</li>
        <li>Guarda los tokens de forma segura y redirige a tu panel.</li>
      </ol>
    </div>
  </div>`;

  return html(body);
}

