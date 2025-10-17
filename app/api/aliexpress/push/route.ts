import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

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

  // Persist event with service role if available
  const adminKeyPresent = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (adminKeyPresent) {
    try {
      const supa = supabaseAdmin();
      const payload = typeof body === "string" ? { raw } : body;
      const insert = {
        event: payload,
        received_at: new Date().toISOString(),
        received_path: "/api/aliexpress/push",
      };
      await supa.from("ae_push_events").insert(insert);
    } catch (e) {
      // swallow errors to not break webhook ack
    }
  }

  // Echo back for test tool
  return json(200, { ok: true, received_at: new Date().toISOString(), body });
}
