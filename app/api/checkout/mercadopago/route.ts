import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

interface CheckoutItem {
  title: string;
  quantity: number;
  price: number;
}

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || "",
});

export async function POST(req: Request) {
  try {
    const { items }: { items: CheckoutItem[] } = await req.json();

    // Validar que hay items
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No hay items en el carrito' }, { status: 400 });
    }

    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: items.map((item, index) => ({
          id: `item-${index}-${Date.now()}`,
          title: item.title,
          quantity: item.quantity,
          currency_id: "CLP",
          unit_price: item.price,
        })),
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/carro?status=success`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/carro?status=failure`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/carro?status=pending`,
        },
        auto_return: "approved",
        payment_methods: {
          excluded_payment_types: [],
          excluded_payment_methods: [],
          installments: 12
        },
        shipments: {
          cost: 0,
          mode: "not_specified"
        },
        notification_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/webhooks/mercadopago`
      },
    });

    return NextResponse.json({ 
      id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point
    });
  } catch (err: any) {
    console.error("MercadoPago error:", err);
    return NextResponse.json(
      { error: "Error creando preferencia de pago", details: err.message },
      { status: 500 }
    );
  }
}
