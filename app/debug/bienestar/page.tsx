import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  nombre: string;
  precio: number | null;
  imagen_url: string | null;
  categoria_slug: string;
};

async function getBienestar(): Promise<Row[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(url, anon);
  const { data, error } = await supabase
    .from("productos")
    .select("id,nombre,precio,imagen_url,categoria_slug")
    .eq("categoria_slug", "bienestar")
    .limit(3);
  if (error) throw error;
  return data ?? [];
}

export default async function DebugBienestarPage() {
  const items = await getBienestar();

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Debug: Bienestar (3 items)</h1>
      {items.length === 0 && <p>No hay items.</p>}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((p) => (
          <li key={p.id} className="border rounded-xl p-4 space-y-3">
            <div className="text-sm text-gray-500">ID: {p.id}</div>
            <div className="font-semibold">{p.nombre}</div>
            <div className="text-sm">Precio: {p.precio ?? "—"}</div>

            <div className="text-xs text-gray-500">Next &lt;Image&gt; (400x300)</div>
            <div className="border rounded-md overflow-hidden">
              {p.imagen_url ? (
                <Image
                  src={p.imagen_url}
                  alt={p.nombre}
                  width={400}
                  height={300}
                  className="object-cover w-full h-auto"
                  unoptimized
                />
              ) : (
                <div className="p-6 bg-yellow-50 text-yellow-800">Sin imagen_url</div>
              )}
            </div>

            <div className="text-xs text-gray-500">HTML &lt;img&gt; (fallback)</div>
            <div className="border rounded-md overflow-hidden">
              {p.imagen_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imagen_url} alt={p.nombre} width="400" height="300" />
              ) : (
                <div className="p-6 bg-yellow-50 text-yellow-800">Sin imagen_url</div>
              )}
            </div>

            <div className="text-xs break-all text-gray-600">URL: {p.imagen_url ?? "null"}</div>
          </li>
        ))}
      </ul>
      <p className="text-sm text-gray-500">
        Si &lt;img&gt; carga y &lt;Image&gt; NO, el problema es configuración de <code>next/image</code>.
        Si ninguna carga, el problema es la URL / dominio / CORS / red. Si aquí funciona pero en
        <code>/categorias/bienestar</code> no, el problema es el componente de categorías.
      </p>
    </main>
  );
}
