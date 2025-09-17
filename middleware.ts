import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Middleware no-op (FASE 1.1)
 * - Mantiene la estructura por si luego se desea activar reglas.
 * - Tipado correcto para pasar verificación de tipos en Next.js.
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

/**
 * Config vacío: no intercepta rutas.
 * Cuando quieras activarlo, define matchers e implementa la lógica arriba.
 * Ejemplo:
 * export const config = { matcher: ["/checkout/:path*"] };
 */
export const config = {
  matcher: []
};
