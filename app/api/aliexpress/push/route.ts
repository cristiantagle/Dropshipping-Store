import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function json(status: number, data: any) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export async function GET() {
  return json(200, { ok: true, message: "AliExpress Push endpoint is alive" });
}

export async function POST(req: NextRequest) {
  // Accept JSON or text payloads from AliExpress test tool
  let body: any = null;
  let raw = "";
  try {
    raw = await req.text();
    try { body = JSON.parse(raw); } catch { body = raw; }
  } catch {
    // ignore parse errors
  }

  // Very simple echo + 200 so their test marks succeeded=true
  // In the future we can add signature verification if AE sends one.
  return json(200, {
    ok: true,
    received_at: new Date().toISOString(),
    body,
  });
}

