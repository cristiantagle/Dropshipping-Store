import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || "",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: (body.items || []).map((item: any) => ({
          title: item.title,
          quantity: item.quantity,
          currency_id: "CLP",
          unit_price: item.price,
        })),
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_URL}/success`,
          failure: `${process.env.NEXT_PUBLIC_URL}/failure`,
          pending: `${process.env.NEXT_PUBLIC_URL}/pending`,
        },
        auto_return: "approved",
      },
    });

    return NextResponse.json({ id: response.id });
  } catch (err: any) {
    console.error("MercadoPago error:", err);
    return NextResponse.json(
      { error: "Error creando preferencia de pago" },
      { status: 500 }
    );
  }
}
