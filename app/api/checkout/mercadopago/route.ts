import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

interface CheckoutItem {
  title: string;
  quantity: number;
  price: number;
}

const accessToken = (process.env.MP_ACCESS_TOKEN || "").trim();
const client = new MercadoPagoConfig({
  accessToken,
});

export async function POST(req: Request) {
  try {
    const { items, email }: { items: CheckoutItem[]; email?: string } = await req.json();

    // Validar que hay items
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No hay items en el carrito' }, { status: 400 });
    }

    // Validar token de MP
    if (!accessToken) {
      return NextResponse.json({ error: 'MP_ACCESS_TOKEN no está configurado' }, { status: 500 });
    }

    const preference = new Preference(client);

    const baseUrl = (process.env.NEXT_PUBLIC_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

    const isHttps = baseUrl.startsWith('https://');

    const body: any = {
      items: items.map((item, index) => ({
          id: `item-${index}-${Date.now()}`,
          title: item.title,
          quantity: item.quantity,
          currency_id: "CLP",
          unit_price: item.price,
        })),
      back_urls: {
        success: `${baseUrl}/carro?status=success`,
        failure: `${baseUrl}/carro?status=failure`,
        pending: `${baseUrl}/carro?status=pending`,
      },
    };

    if (email?.trim()) body.payer = { email: email.trim() };
    if (isHttps) body.auto_return = "approved";
    // Solo incluir notification_url con https (Mercado Pago puede rechazar localhost/http)
    if (isHttps) body.notification_url = `${baseUrl}/api/webhooks/mercadopago`;

    const response = await preference.create({ body });

    return NextResponse.json({ 
      id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point
    });
  } catch (err: any) {
    console.error("MercadoPago error:", err?.message || err, err);
    return NextResponse.json(
      { error: "Error creando preferencia de pago", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
