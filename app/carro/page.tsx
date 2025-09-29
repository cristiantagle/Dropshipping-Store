import Link from "next/link";
import { getProducts } from "@/lib/products";

export default async function Carro() {
  const productos = await getProducts();

  return (
    <section className="px-6 py-10">
      <h2 className="text-2xl font-bold mb-6">Tu carrito</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {productos.map((p) => (
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
    </section>
  );
}
