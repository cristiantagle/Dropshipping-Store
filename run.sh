#!/usr/bin/env bash
set -euo pipefail

echo "✍️ Reescribiendo archivos corregidos (imports + MercadoPago SDK)..."

# ========== app/api/checkout/mercadopago/route.ts ==========
cat <<'EOF' > app/api/checkout/mercadopago/route.ts
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
EOF

# ========== app/page.tsx ==========
cat <<'EOF' > app/page.tsx
"use client";
import Link from "next/link";
import { getProducts } from "@/lib/products";

export default async function Home() {
  const productos = await getProducts();

  return (
    <main className="space-y-12">
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold mb-6">Productos</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lunaria-grid-in">
          {productos.map((m) => (
            <li key={m.id}>
              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                <img src={m.imagen} alt={m.nombre} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <div className="text-sm font-semibold line-clamp-1">{m.nombre}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
EOF

# ========== app/producto/[id]/page.tsx ==========
cat <<'EOF' > app/producto/[id]/page.tsx
"use client";
import Link from "next/link";
import { getProduct } from "@/lib/products";

export default async function Producto({ params }) {
  const prod = await getProduct(params.id);

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border bg-white overflow-hidden">
          <div className="aspect-[4/3] bg-gray-100">
            <img src={prod.imagen} alt={prod.nombre} className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="rounded-2xl border bg-white p-5">
          <h1 className="text-2xl font-bold">{prod.nombre}</h1>
          <div className="mt-3 text-2xl font-black lunaria-price">
            {Intl.NumberFormat("es-CL", {
              style: "currency",
              currency: "CLP",
              maximumFractionDigits: 0,
            }).format(prod.precio)}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              className="lunaria-cta px-5 py-3 font-semibold"
              onClick={() => alert(`Agregado: ${prod.nombre}`)}
            >
              Agregar al carrito
            </button>
            <Link className="btn-brand" href="/">Volver al inicio</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
EOF

echo "✅ Archivos corregidos. Ahora puedes volver a hacer build/deploy."
