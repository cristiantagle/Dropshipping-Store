import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get("u");
    if (!url) return NextResponse.json({ error: "Missing u" }, { status: 400 });

    const upstream = await fetch(url, {
      headers: {
        "User-Agent": "Lunaria/1.0 (+https://github.com/cristiantagle/Dropshipping-Store)",
        "Accept": "image/avif,image/webp,image/*,*/*;q=0.8",
        "Accept-Language": "es-CL,es;q=0.9"
      },
      cache: "no-store",
      redirect: "follow"
    });

    if (!upstream.ok) {
      return NextResponse.json({ error: "Upstream error", status: upstream.status }, { status: 502 });
    }

    const contentType = upstream.headers.get("content-type") || "image/jpeg";
    const buf = await upstream.arrayBuffer();
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "content-type": contentType,
        "cache-control": "public, max-age=3600, immutable"
      }
    });
  } catch (e) {
    return NextResponse.json({ error: "Proxy failure" }, { status: 500 });
  }
}
