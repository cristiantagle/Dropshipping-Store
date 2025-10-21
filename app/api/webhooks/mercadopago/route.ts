import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// Minimal MP webhook handler: stores event and updates order by payment/preference if provided
export async function POST(req: NextRequest) {
  try {
    const sb = supabaseAdmin();
    const body = await req.json().catch(() => ({}));
    const topic = (body?.topic || body?.type || req.nextUrl.searchParams.get("topic") || "").toString();
    const type = (body?.type || req.nextUrl.searchParams.get("type") || "").toString();
    await sb.from("mp_events").insert({ topic, type, data: body });

    // Try naive updates when identifiers are present
    const paymentId = body?.data?.id || body?.id || req.nextUrl.searchParams.get("id");
    const prefId = body?.data?.preference_id || body?.preference_id || req.nextUrl.searchParams.get("preference_id");
    const status = body?.data?.status || body?.status || null;

    if (paymentId || prefId) {
      const patch: any = {};
      if (paymentId) patch.mp_payment_id = String(paymentId);
      if (prefId) patch.mp_preference_id = String(prefId);
      if (status) patch.status = String(status);
      if (Object.keys(patch).length > 0) {
        // Update by payment id first, fallback to preference id
        if (paymentId) {
          await sb.from("orders").update(patch).eq("mp_payment_id", String(paymentId));
        }
        if (prefId) {
          await sb.from("orders").update(patch).eq("mp_preference_id", String(prefId));
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Some MP notifications ping GET first; record as event
  try {
    const sb = supabaseAdmin();
    const topic = req.nextUrl.searchParams.get("topic");
    const type = req.nextUrl.searchParams.get("type");
    const id = req.nextUrl.searchParams.get("id");
    await sb.from("mp_events").insert({ topic, type, data: { id } });
  } catch {}
  return NextResponse.json({ ok: true });
}

