"use client";
import ProductCard from "@/components/ProductCard";
import { productos } from "@/lib/products";
import Link from "next/link";

export default function Page() {
  function addToCart(id: string) {
    const key = "carro";
    const current = JSON.parse(localStorage.getItem(key) || "[]");
    localStorage.setItem(key, JSON.stringify([...current, id]));
    alert("Producto agregado al carro");
  }
  return (
    <section className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">AndesDrop — Compra fácil · Envíos en Chile</h1>
        <p className="text-gray-600">Pagos seguros con Mercado Pago. Nichos: Hogar, Mascotas, Belleza, Bienestar, Tecnología y Eco.</p>
        <div className="text-sm text-gray-500">
          <a className="underline mr-3" href="/api/health" target="_blank">/api/health</a>
          <a className="underline mr-3" href="/ok.txt" target="_blank">/ok.txt</a>
          <Link className="underline" href="/carro">Ir al carro</Link>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.map((p) => (<ProductCard key={p.id} p={p} onAdd={addToCart} />))}
      </div>
    </section>
  );
}
