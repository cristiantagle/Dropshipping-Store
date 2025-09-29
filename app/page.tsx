import "server-only";
import Hero from "@/components/Hero";
import SectionHeader from "@/components/SectionHeader";
import ProductSkeleton from "@/components/ProductSkeleton";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";
import PreviewDebug from "@/components/PreviewDebug";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

type Producto = {
  id: string;
  nombre: string;
  precio?: number | null;
  imagen?: string | null;
  imagen_url?: string | null;
  imagen?: string | null;
  image?: string | null;
  envio?: string | null;
  categoria_slug?: string | null;
  destacado?: boolean | null;
  created_at?: string | null;
  ventas?: number | null;
};

const SELECT_COLS =
  "id,nombre,precio,imagen,imagen_url,imagen,image,envio,categoria_slug,destacado,created_at,ventas";

const MOCKS = [
  { id: "m1", nombre: "Organizador minimal", imagen: "/lunaria-icon.png" },
  { id: "m2", nombre: "Botella térmica", imagen: "/lunaria-icon.png" },
  { id: "m3", nombre: "Auriculares", imagen: "/lunaria-icon.png" },
  { id: "m4", nombre: "Silla ergonómica", imagen: "/lunaria-icon.png" },
  { id: "m5", nombre: "Lámpara cálida", imagen: "/lunaria-icon.png" },
  { id: "m6", nombre: "Mochila urbana", imagen: "/lunaria-icon.png" }
];

const IMG_FALLBACK = "/lunaria-icon.png";

function pickImg(p: Partial<Producto> & {
  imagen?: string | null;
  imagen_url?: string | null;
  imagen?: string | null;
  image?: string | null;
}) {
  const toStr = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const cands = [p.imagen, p.imagen_url, p.imagen, p.image].map(toStr).filter(Boolean);
  return cands[0] || IMG_FALLBACK;
}

async function getHomeData() {
  try {
    const supa = supabaseServer();
    if (!supa) {
      return { destacados: [] as Producto[], nuevos: [] as Producto[], top: [] as Producto[] };
    }

    let destacados: Producto[] = [];
    try {
      const { data } = await supa
        .from("products")
        .select(SELECT_COLS)
        .eq("destacado", true)
        .order("id", { ascending: true })
        .limit(6);
      destacados = (data ?? []) as Producto[];
    } catch (e) {
      console.error("Supabase destacados:", e);
      destacados = [];
    }

    let nuevos: Producto[] = [];
    try {
      const r1 = await supa
        .from("products")
        .select(SELECT_COLS)
        .order("created_at", { ascending: false })
        .limit(6);
      nuevos = (r1.data ?? []) as Producto[];
      if (nuevos.length === 0) {
        const r2 = await supa
          .from("products")
          .select(SELECT_COLS)
          .order("id", { ascending: false })
          .limit(6);
        nuevos = (r2.data ?? []) as Producto[];
      }
    } catch (e) {
      console.error("Supabase nuevos:", e);
      nuevos = [];
    }

    let top: Producto[] = [];
    try {
      const r1 = await supa
        .from("products")
        .select(SELECT_COLS)
        .order("ventas", { ascending: false })
        .limit(6);
      top = (r1.data ?? []) as Producto[];
      if (top.length === 0) {
        const r2 = await supa
          .from("products")
          .select(SELECT_COLS)
          .order("id", { ascending: true })
          .limit(6);
        top = (r2.data ?? []) as Producto[];
      }
    } catch (e) {
      console.error("Supabase top:", e);
      top = [];
    }

    return { destacados, nuevos, top };
  } catch (e) {
    console.error("getHomeData fatal:", e);
    return { destacados: [] as Producto[], nuevos: [] as Producto[], top: [] as Producto[] };
  }
}

export default async function Home() {
  const isPreview = process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";
  const hasSupabase = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const { destacados, nuevos, top } = await getHomeData();

  return (
    <main className="space-y-12">
      <Hero />

      {/* NUEVOS */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader title="Nuevos" subtitle="Lo último que estamos destacando en la tienda" />
        {nuevos.length > 0 ? (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lunaria-grid-in">
            {nuevos.map((m) => (
              <li key={m.id}>
                <ProductCard
                  id={m.id}
                  nombre={m.nombre}
                  precio={m.precio}
                  envio={m.envio ?? undefined}
                  imagen={m.imagen ?? undefined}
                  imagen_url={m.imagen_url ?? undefined}
                  imagen={m.imagen ?? undefined}
                  image={m.image ?? undefined}
                  href={`/producto/${m.id}`}
                />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {MOCKS.slice(0,6).map((m) => (
              <li key={m.id} className="rounded-xl border overflow-hidden bg-white group">
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img src={m.imagen} alt={m.nombre} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />
                </div>
                <div className="p-3">
                  <div className="text-sm font-semibold line-clamp-1">{m.nombre}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* TENDENCIAS (destacados) */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader title="Tendencias" subtitle="Se mueven mucho estos días" />
        {destacados.length > 0 ? (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lunaria-grid-in">
            {destacados.map((m) => (
              <li key={m.id}>
                <ProductCard
                  id={m.id}
                  nombre={m.nombre}
                  precio={m.precio}
                  envio={m.envio ?? undefined}
                  imagen={m.imagen ?? undefined}
                  imagen_url={m.imagen_url ?? undefined}
                  imagen={m.imagen ?? undefined}
                  image={m.image ?? undefined}
                  href={`/producto/${m.id}`}
                />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i}><ProductSkeleton /></li>
            ))}
          </ul>
        )}
      </section>

      {/* TOP VENTAS */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-end justify-between">
          <SectionHeader
            title="Top Ventas"
            subtitle="Los favoritos de la comunidad"
            className="mb-0"
          />
          <Link href="/categorias" className="text-sm font-semibold rounded-xl px-3 py-1.5 hover:bg-neutral-100">
            Ver todas las categorías →
          </Link>
        </div>
        {top.length > 0 ? (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lunaria-grid-in">
            {top.map((m) => (
              <li key={m.id}>
                <ProductCard
                  id={m.id}
                  nombre={m.nombre}
                  precio={m.precio}
                  envio={m.envio ?? undefined}
                  imagen={m.imagen ?? undefined}
                  imagen_url={m.imagen_url ?? undefined}
                  imagen={m.imagen ?? undefined}
                  image={m.image ?? undefined}
                  href={`/producto/${m.id}`}
                />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i}><ProductSkeleton /></li>
            ))}
          </ul>
        )}
      </section>

      {/* Debug sólo en preview */}
      <PreviewDebug isPreview={isPreview} hasSupabase={hasSupabase} counts={{
        nuevos: nuevos.length, destacados: destacados.length, top: top.length
      }} />
    </main>
  );
}
