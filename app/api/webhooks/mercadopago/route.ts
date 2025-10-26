import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { MercadoPagoConfig, Payment } from 'mercadopago';

// Minimal MP webhook handler: stores event and updates order by payment/preference if provided
export async function POST(req: NextRequest) {
  try {
    const sb = supabaseAdmin();
    const body = await req.json().catch(() => ({}));
    const topic = (
      body?.topic ||
      body?.type ||
      req.nextUrl.searchParams.get('topic') ||
      ''
    ).toString();
    const type = (body?.type || req.nextUrl.searchParams.get('type') || '').toString();
    await sb.from('mp_events').insert({ topic, type, data: body });

    // Fetch payment detail from Mercado Pago when possible and update order status
    const paymentId = body?.data?.id || body?.id || req.nextUrl.searchParams.get('id');
    const accessToken = (process.env.MP_ACCESS_TOKEN || '').trim();
    if (paymentId && accessToken) {
      try {
        const client = new MercadoPagoConfig({ accessToken });
        const mpPayment = await new Payment(client).get({ id: String(paymentId) });
        const prefId =
          (mpPayment as any)?.additional_info?.metadata?.preference_id ||
          (mpPayment as any)?.metadata?.preference_id ||
          (mpPayment as any)?.order?.id ||
          null;
        const payStatus = (mpPayment as any)?.status || null; // approved | pending | rejected
        const patch: any = { mp_payment_id: String(paymentId) };
        if (prefId) patch.mp_preference_id = String(prefId);
        if (payStatus) patch.status = String(payStatus);
        if (prefId) {
          const { data: orders } = await sb
            .from('orders')
            .select('id, status')
            .eq('mp_preference_id', String(prefId));
          if (orders && orders.length > 0) {
            for (const o of orders) {
              if (o.status === 'cancelled' && payStatus !== 'approved') continue;
              await sb.from('orders').update(patch).eq('id', o.id);
            }
          } else {
            await sb.from('orders').update(patch).eq('mp_preference_id', String(prefId));
          }
        }
        await sb.from('orders').update(patch).eq('mp_payment_id', String(paymentId));
      } catch (e) {
        console.error('MP webhook: error fetching payment detail', e);
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
    const topic = req.nextUrl.searchParams.get('topic');
    const type = req.nextUrl.searchParams.get('type');
    const id = req.nextUrl.searchParams.get('id');
    await sb.from('mp_events').insert({ topic, type, data: { id } });
  } catch {}
  return NextResponse.json({ ok: true });
}
