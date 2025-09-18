import { NextRequest } from "next/server";

/**
 * Proxy de imágenes:
 *   GET /api/img?u=<url codificada>
 * - Evita problemas de referer/hosts
 * - Aplica cache por 1 día
 */
export async function GET(req: NextRequest) {
  const u = req.nextUrl.searchParams.get("u");
  if (!u) return new Response("Missing 'u' param", { status: 400 });

  try {
    const upstream = await fetch(u, {
      // No enviamos credenciales ni referer
      redirect: "follow",
      // Cache en el edge/node (Vercel): 1 día
      next: { revalidate: 60 * 60 * 24 }
    });

    if (!upstream.ok) {
      return new Response(`Upstream ${upstream.status}`, { status: 502 });
    }

    // Copiamos content-type si existe
    const contentType = upstream.headers.get("content-type") || "image/jpeg";
    const arrayBuf = await upstream.arrayBuffer();
    return new Response(arrayBuf, {
      status: 200,
      headers: {
        "content-type": contentType,
        // Cache en el navegador: 1 día
        "cache-control": "public, max-age=86400, immutable"
      }
    });
  } catch (e) {
    return new Response("Proxy error", { status: 500 });
  }
}
