import "server-only";
import Hero from "@/components/Hero";
import SectionHeader from "@/components/SectionHeader";
import ProductSkeleton from "@/components/ProductSkeleton";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

type Producto = {
  id: string;
  nombre: string;
  precio?: number | null;
  imagen?: string | null;
  imagen_url?: string | null;
  image_url?: string | null;
  image?: string | null;
  envio?: string | null;
  categoria_slug?: string | null;
  destacado?: boolean | null;
  created_at?: string | null;
  ventas?: number | null;
};

const SELECT_COLS =
  "id,nombre,precio,imagen,imagen_url,image_url,image,envio,categoria_slug,destacado,created_at,ventas";

const MOCKS = [
  { id: "m1", nombre: "Organizador minimal", imagen: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop" },
  { id: "m2", nombre: "Botella térmica", imagen: "https://images.unsplash.com/photo-1502741126161-b048400d085a?q=80&w=1200&auto=format&fit=crop" },
  { id: "m3", nombre: "Auriculares", imagen: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop" },
  { id: "m4", nombre: "Silla ergonómica", imagen: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1200&auto=format&fit=crop" },
  { id: "m5", nombre: "Lámpara cálida", imagen: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=1200&auto=format&fit=crop" },
  { id: "m6", nombre: "Mochila urbana", imagen: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop" }
];

const IMG_FALLBACK = "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?q=80&w=1200&auto=format&fit=crop";

function pickImg(p: Partial<Producto> & { imagen?: string }) {
  return (
    (p.imagen && p.imagen.trim()) ||
    (p.imagen_url && p.imagen_url.trim()) ||
    (p.image_url && p.image_url.trim()) ||
    (p.image && p.image.trim()) ||
    IMG_FALLBACK
  );
}

async function getHomeData() {
  const supa = supabaseServer();
  if (!supa) {
    return { destacados: [] as Producto[], nuevos: [] as Producto[], top: [] as Producto[] };
  }

  // Tendencias = destacados(true)
  let destacados: Producto[] = [];
  {
    const { data, error } = await supa
      .from("productos")
      .select(SELECT_COLS)
      .eq("destacado", true)
      .order("id", { ascending: true })
      .limit(6);
    if (error) console.error("Supabase destacados:", error);
    destacados = (data ?? []) as Producto[];
  }

  // Nuevos: created_at desc → fallback id desc
  let nuevos: Producto[] = [];
  {
    const r1 = await supa
      .from("productos")
      .select(SELECT_COLS)
      .order("created_at", { ascending: false })
      .limit(6);
    if (r1.error) console.error("Supabase nuevos(created_at):", r1.error);
    nuevos = (r1.data ?? []) as Producto[];
    if (nuevos.length === 0) {
      const r2 = await supa
        .from("productos")
        .select(SELECT_COLS)
        .order("id", { ascending: false })
        .limit(6);
      if (r2.error) console.error("Supabase nuevos(id):", r2.error);
      nuevos = (r2.data ?? []) as Producto[];
    }
  }

  // Top ventas: ventas desc → fallback id asc
  let top: Producto[] = [];
  {
    const r1 = await supa
      .from("productos")
      .select(SELECT_COLS)
      .order("ventas", { ascending: false })
      .limit(6);
    if (r1.error) console.error("Supabase top(ventas):", r1.error);
    top = (r1.data ?? []) as Producto[];
    if (top.length === 0) {
      const r2 = await supa
        .from("productos")
        .select(SELECT_COLS)
        .order("id", { ascending: true })
        .limit(6);
      if (r2.error) console.error("Supabase top(id):", r2.error);
      top = (r2.data ?? []) as Producto[];
    }
  }

  return { destacados, nuevos, top };
}

export default async function Home() {
  const { destacados, nuevos, top } = await getHomeData();

  return (
    <main className="space-y-12">
      <Hero />

      {/* NUEVOS */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          title="Nuevos"
          subtitle="Lo último que estamos destacando en la tienda"
        />
        {nuevos.length > 0 ? (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {nuevos.map((m) => (
              <li key={m.id} className="rounded-xl border overflow-hidden bg-white group">
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={pickImg(m)}
                    alt={m.nombre ?? "Producto"}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="p-3">
                  <div className="text-sm font-semibold line-clamp-1">{m.nombre}</div>
                </div>
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
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {destacados.map((m) => (
              <li key={m.id} className="rounded-xl border overflow-hidden bg-white group">
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={pickImg(m)}
                    alt={m.nombre ?? "Producto"}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="p-3">
                  <div className="text-sm font-semibold line-clamp-1">{m.nombre}</div>
                </div>
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
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {top.map((m) => (
              <li key={m.id} className="rounded-xl border overflow-hidden bg-white group">
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={pickImg(m)}
                    alt={m.nombre ?? "Producto"}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="p-3">
                  <div className="text-sm font-semibold line-clamp-1">{m.nombre}</div>
                </div>
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
    </main>
  );
}
