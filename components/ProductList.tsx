'use client';
import { productos, type Producto } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { useMemo } from "react";

type Props = {
  categoria?: "belleza" | "hogar" | "tecnologia" | null;
  soloDestacados?: boolean;
  titulo?: string;
  limit?: number | null; // null = sin límite
};

export default function ProductList({ categoria, soloDestacados = false, titulo, limit = null }: Props) {
  const lista = useMemo(() => {
    let arr: Producto[] = productos.slice();
    if (categoria) arr = arr.filter(p => p.categoria === categoria);
    if (soloDestacados) arr = arr.filter(p => p.destacado);
    if (limit && limit > 0) arr = arr.slice(0, limit);
    return arr;
  }, [categoria, soloDestacados, limit]);

  return (
    <section className="space-y-4">
      {titulo ? <h2 className="text-xl font-semibold">{titulo}</h2> : null}
      {lista.length === 0 ? (
        <p className="text-sm text-gray-500">No hay productos para mostrar.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {lista.map(p => (
            <ProductCard key={p.id} p={p} onAdd={() => alert("Producto agregado al carro")} />
          ))}
        </div>
      )}
    </section>
  );
}
