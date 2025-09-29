import "server-only";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

type Producto = {
  id: string;
  nombre: string;
  precio?: number | null;
  descripcion?: string | null;
  imagen?: string | null;
  imagen_url?: string | null;
  imagen?: string | null;
  image?: string | null;
  envio?: string | null;
  categoria_slug?: string | null;
};

const SELECT = "id,nombre,precio,descripcion,imagen,imagen_url,imagen,image,envio,categoria_slug";

const FALLBACK_IMG = "/lunaria-icon.png";
const pick = (p: Partial<Producto>) => {
  const vals = [p.imagen, p.imagen_url, p.imagen, p.image].map(v => typeof v === "string" ? v.trim() : "").filter(Boolean);
  return vals[0] || FALLBACK_IMG;
};
const fmtCLP = (v?: number | null) => {
  if (v == null) return "$—";
  try { return Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(v); }
  catch { return `$${v}`; }
};

async function getProducto(id: string): Promise<Producto | null> {
  const supa = supabaseServer();
  if (!supa) {
    return { id, nombre: "Producto", precio: null, imagen: FALLBACK_IMG, envio: "Envío estándar", descripcion: "Descripción no disponible por ahora." };
  }
  try {
    const { data, error } = await supa.from("products").select(SELECT).eq("id", id).maybeSingle();
    if (error) console.error("Supabase producto:", error);
    return (data as Producto) ?? null;
  } catch (e) {
    console.error("getProducto fatal:", e);
    return null;
  }
}

export default async function ProductoPage({ params }: { params: { id: string } }) {
  const prod = await getProducto(params.id);
  if (!prod) {
    return (
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="rounded-xl border p-6 bg-white">
          <h1 className="text-xl font-bold">Producto no encontrado</h1>
          <p className="text-gray-600 mt-1">Puede que haya sido removido o esté temporalmente no disponible.</p>
          <div className="mt-4"><Link className="btn-brand" href="/">Volver al inicio</Link></div>
        </div>
      </main>
    );
  }
  const img = pick(prod);
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:underline">Inicio</Link>
        <span> / </span>
        <Link href="/categorias" className="hover:underline">Categorías</Link>
        <span> / </span>
        <span className="text-gray-800">{prod.nombre}</span>
      </nav>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border bg-white overflow-hidden">
          <div className="aspect-[4/3] bg-gray-100">
            <img src={img} alt={prod.nombre || "Producto"} className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="rounded-2xl border bg-white p-5">
          <h1 className="text-2xl font-extrabold tracking-tight">{prod.nombre}</h1>
          <p className="mt-1 text-sm text-gray-600">{prod.envio || "Envío estándar"}</p>
          <div className="mt-3 text-2xl font-black lunaria-price">{fmtCLP(prod.precio)}</div>
          {prod.descripcion ? (
            <p className="mt-4 text-gray-700 leading-relaxed">{prod.descripcion}</p>
          ) : (
            <p className="mt-4 text-gray-600">Descripción no disponible por ahora.</p>
          )}
          <div className="lunaria-divider" />
          <div className="mt-4 flex items-center gap-3">
            <button type="button" className="lunaria-cta px-5 py-3 font-semibold" onClick={() => alert(`Agregado: ${prod.nombre}`)}>
              Agregar al carrito
            </button>
            <Link href="/" className="rounded-xl border px-4 py-3 font-semibold hover:bg-white">Seguir explorando</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
