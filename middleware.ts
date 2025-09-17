import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Middleware no-op con tipado correcto.
 * - No intercepta ninguna ruta (matcher vacío).
 * - Seguro para build en Next.js 14.
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: []
};
