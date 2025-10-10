"use client";
import Link from "next/link";
import { getProducts } from "@/lib/products";

export default async function Carro() {
  const key = "carro";
  const items =
    typeof window !== "undefined"
      ? (JSON.parse(localStorage.getItem(key) || "[]") as string[])
      : [];
  const allProducts = await getProducts();
  const detalle = allProducts.filter((p) => items.includes(p.id));
  const total = detalle.reduce((acc, p) => acc + (p?.precio || 0), 0);

  function limpiar() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
      location.reload();
    }
  }

  async function pagar() {
    alert("Pago simulado. Total: " + total);
  }

  return (
    <section className="px-6 py-10">
      <h2 className="text-2xl font-bold mb-6">Tu carrito</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {detalle.map((p) => (
          <li key={p.id} className="border rounded-2xl hover:bg-gray-50 transition">
            <Link href={`/producto/${p.id}`} className="block p-4">
              <div className="aspect-[4/3] w-full mb-3 overflow-hidden rounded-xl bg-gray-100">
                <img
                  src={p.imagen}
                  alt={p.nombre}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="font-semibold">{p.nombre}</h3>
              <p className="text-sm text-gray-600">{p.envio}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-bold">
                  {Intl.NumberFormat("es-CL", {
                    style: "currency",
                    currency: "CLP",
                    maximumFractionDigits: 0,
                  }).format(p.precio)}
                </span>
                {p.destacado && (
                  <span className="px-3 py-1 rounded-xl bg-lime-600 text-white text-sm">
                    Destacado
                  </span>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex gap-4">
        <button onClick={limpiar} className="px-4 py-2 bg-gray-200 rounded-lg">
          Vaciar carrito
        </button>
        <button onClick={pagar} className="px-4 py-2 bg-lime-600 text-white rounded-lg">
          Pagar{" "}
          {Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP",
            maximumFractionDigits: 0,
          }).format(total)}
        </button>
      </div>
    </section>
  );
}
