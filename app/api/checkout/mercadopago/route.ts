import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
export const runtime = "nodejs";
export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json();
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || "";
    if (!accessToken) return NextResponse.json({ error: "MERCADOPAGO_ACCESS_TOKEN no configurado" }, { status: 500 });
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
    if (!siteUrl) return NextResponse.json({ error: "NEXT_PUBLIC_SITE_URL no configurado" }, { status: 500 });

    const client = new MercadoPagoConfig({ accessToken });
    const preferenceClient = new Preference(client);
    const pref = await preferenceClient.create({
      body: {
        items: (items || []).map((p: any) => ({
          title: String(p?.nombre ?? "Producto"),
          quantity: 1,
          currency_id: "CLP",
          unit_price: Number(p?.precio ?? 0)
        })),
        back_urls: {
          success: `${siteUrl}/?estado=aprobado`,
          failure: `${siteUrl}/?estado=falla`,
          pending: `${siteUrl}/?estado=pendiente`
        },
        auto_return: "approved"
      }
    });

    const init_point = (pref as any)?.init_point || (pref as any)?.sandbox_init_point;
    if (!init_point) return NextResponse.json({ error: "Preferencia creada sin init_point" }, { status: 500 });
    return NextResponse.json({ init_point });
  } catch (err: any) {
    return NextResponse.json({ error: "Error al crear preferencia", detail: err?.message ?? String(err) }, { status: 500 });
  }
}
