import { NextResponse } from 'next/server'

export function middleware(request) {
  // dejar pasar sin bloqueo
  return NextResponse.next()
}
export const config = {
  matcher: ['/((?!api|_next/static|favicon.ico).*)'], // fila para ignorar rutas estáticas y API
}
