"use client";
import { productos } from "@/lib/products";
import Link from "next/link";
export default function Carro() {
  const key = "carro";
  const items = typeof window !== "undefined" ? JSON.parse(localStorage.getItem(key) || "[]") as string[] : [];
  const detalle = items.map(id => productos.find(p => p.id === id)).filter(Boolean) as typeof productos;
  const total = detalle.reduce((acc, p) => acc + (p?.precio || 0), 0);
  function limpiar() { localStorage.removeItem(key); location.reload(); }
  async function pagar() {
    try {
      const r = await fetch("/api/checkout/mercadopago", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ items: detalle }) });
      if (!r.ok) { const txt = await r.text(); alert("No se pudo iniciar el pago (API 404/500).\n\nDetalle:\n" + txt); return; }
      const { init_point } = await r.json();
      if (!init_point) { alert("Preferencia sin init_point. Verifica MERCADOPAGO_ACCESS_TOKEN y NEXT_PUBLIC_SITE_URL."); return; }
      location.href = init_point;
    } catch (e: any) { alert("Error de red al iniciar pago. Detalle: " + (e?.message || e)); }
  }
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Tu carro</h1>
      {detalle.length === 0 ? (
        <p>Tu carro está vacío. <Link className="underline" href="/">Volver a la tienda</Link></p>
      ) : (
        <>
          <ul className="space-y-2">
            {detalle.map((p) => (
              <li key={p.id} className="flex items-center justify-between border p-3 rounded-xl">
                <span>{p.nombre}</span>
                <span className="font-semibold">${p.precio.toLocaleString("es-CL")}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between text-lg"><span>Total</span><strong>${total.toLocaleString("es-CL")}</strong></div>
          <div className="flex gap-3">
            <button onClick={pagar} className="btn btn-primary">Pagar con Mercado Pago</button>
            <button onClick={limpiar} className="btn border">Limpiar</button>
          </div>
        </>
      )}
    </section>
  );
}
