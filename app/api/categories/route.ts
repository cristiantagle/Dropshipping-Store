import { NextRequest, NextResponse } from 'next/server';
import { getAllCategories } from '@/lib/categorias';

export async function GET(req: NextRequest) {
  const origin = req.headers.get('origin') || '*';
  try {
    const items = getAllCategories();
    return NextResponse.json(
      { ok: true, items },
      { headers: { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } },
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || String(e) },
      { status: 500, headers: { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } },
    );
  }
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin') || '*';
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      Vary: 'Origin',
    },
  });
}
