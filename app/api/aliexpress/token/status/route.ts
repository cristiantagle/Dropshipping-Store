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

export async function GET(_req: NextRequest) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return json(200, { present: false, reason: "missing_service_role" });
  }
  try {
    const supa = supabaseAdmin();
    const { data, error } = await supa
      .from("aliexpress_tokens")
      .select("id, access_token, refresh_token, expires_at, scope, user_id, updated_at, created_at")
      .eq("id", 1)
      .maybeSingle();
    if (error) return json(500, { present: false, error: error.message });
    if (!data) return json(200, { present: false });
    const atLen = data.access_token ? String(data.access_token).length : 0;
    const rtLen = data.refresh_token ? String(data.refresh_token).length : 0;
    return json(200, {
      present: atLen > 0 && rtLen > 0,
      at_len: atLen,
      rt_len: rtLen,
      expires_at: data.expires_at,
      scope: data.scope,
      user_id: data.user_id,
      updated_at: data.updated_at,
    });
  } catch (e: any) {
    return json(500, { present: false, error: e?.message || String(e) });
  }
}

