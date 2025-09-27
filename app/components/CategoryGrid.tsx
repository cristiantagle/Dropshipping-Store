"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import SafeSVG from "@/components/SafeSVG";

type Categoria = {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  imagen_url: string;
};

export default function CategoryGrid() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    supabase
      .from("categorias")
      .select("id, nombre, slug, descripcion, imagen_url")
      .then(({ data, error }) => {
        if (!error && data) setCategorias(data);
      });
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {categorias.map((cat) => (
        <div
          key={cat.id}
          className="flex flex-col items-center justify-center p-4 border rounded-lg shadow-sm hover:shadow-md transition"
        >
          <SafeSVG src={cat.imagen_url} alt={cat.nombre} />
          <p className="mt-2 font-semibold">{cat.nombre}</p>
          <p className="text-sm text-gray-500">{cat.descripcion}</p>
        </div>
      ))}
    </div>
  );
}
