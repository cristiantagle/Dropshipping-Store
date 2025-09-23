import "server-only";
import Hero from "@/components/Hero";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";

type Producto = {
  id: string;
  nombre: string;
  precio?: number | null;
  imagen?: string | null;
  imagen_url?: string | null;
  image_url?: string | null;
  image?: string | null;
  created_at?: string | null;
  ventas?: number | null;
};

const MOCKS = [
  { id: "m1", nombre: "Organizador minimal", imagen: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop" },
  { id: "m2", nombre: "Botella térmica", imagen: "https://images.unsplash.com/photo-1502741126161-b048400d085a?q=80&w=1200&auto=format&fit=crop" },
  { id: "m3", nombre: "Auriculares", imagen: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop" },
  { id: "m4", nombre: "Silla ergonómica", imagen: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1200&auto=format&fit=crop" },
  { id: "m5", nombre: "Lámpara cálida", imagen: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=1200&auto=format&fit=crop" },
  { id: "m6", nombre: "Mochila urbana", imagen: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop" }
];

const FALLBACK_IMG = "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?q=80&w=1200&auto=format&fit=crop";

async function q<T>(fn: () => Promise<{ data: T[] | null; error: any }>): Promise<T[]> {
  try {
    const { data, error } = await fn();
    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

function pickImg(p: Partial<Producto>): string {
  const cands = [p.imagen, p.imagen_url, p.image_url, p.image].filter(Boolean) as string[];
  return (cands[0]?.toString().trim() || FALLBACK_IMG);
}

export const dynamic = "force-dynamic";

export default async function Home() {
  const supa = supabaseServer();

  // default vacíos
  let nuevos: Producto[] = [];
  let tendencias: Producto[] = [];
  let top: Producto[] = [];

  if (supa) {
    // Nuevos: por created_at desc (fallback id desc)
    nuevos = await q<Producto>(() =>
      supa.from("productos").select("*").order("created_at", { ascending: false }).limit(6)
    );
    if (nuevos.length === 0) {
      nuevos = await q<Producto>(() =>
        supa.from("productos").select("*").order("id", { ascending: false }).limit(6)
      );
    }

    // Tendencias: usamos 'destacado = true' (si existe)
    tendencias = await q<Producto>(() =>
      supa.from("productos").select("*").eq("destacado", true).order("id", { ascending: true }).limit(6)
    );

    // Top ventas: por 'ventas' desc (fallback id asc)
    top = await q<Producto>(() =>
      supa.from("productos").select("*").order("ventas", { ascending: false }).limit(6)
    );
    if (top.length === 0) {
      top = await q<Producto>(() =>
        supa.from("productos").select("*").order("id", { ascending: true }).limit(6)
      );
    }
  }

  const hasEnv = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return (
    <main className="space-y-12">
      <Hero />

      {!hasEnv && (
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-xl border bg-amber-50 text-amber-900 p-4">
            <p className="font-semibold">Configuración pendiente</p>
            <p className="text-sm">
              Falta <code>NEXT_PUBLIC_SUPABASE_URL</code> y/o <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
              El Home muestra mocks/skeletons hasta que las agregues.
            </p>
          </div>
        </div>
      )}

      {/* NUEVOS */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-3">
          <h2 className="section-title">Nuevos</h2>
          <p className="section-sub">Lo último que estamos destacando en la tienda</p>
        </div>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {(nuevos.length ? nuevos : MOCKS).slice(0,6).map((m) => (
            <li key={m.id} className="rounded-xl border overflow-hidden bg-white group">
              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={pickImg(m)}
                  alt={m.nombre || "Producto"}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="p-3">
                <div className="text-sm font-semibold line-clamp-1">{m.nombre || "Producto"}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* TENDENCIAS */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-3">
          <h2 className="section-title">Tendencias</h2>
          <p className="section-sub">Se mueven mucho estos días</p>
        </div>
        {tendencias.length > 0 ? (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {tendencias.slice(0,6).map((m) => (
              <li key={m.id} className="rounded-xl border overflow-hidden bg-white group">
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={pickImg(m)}
                    alt={m.nombre || "Producto"}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="p-3">
                  <div className="text-sm font-semibold line-clamp-1">{m.nombre || "Producto"}</div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="rounded-xl border overflow-hidden bg-white">
                <div className="aspect-[4/3] rounded-none skeleton" />
                <div className="p-3">
                  <div className="h-4 w-3/4 rounded-md skeleton" />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* TOP VENTAS */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-end justify-between">
          <div className="mb-3">
            <h2 className="section-title">Top Ventas</h2>
            <p className="section-sub">Los favoritos de la comunidad</p>
          </div>
          <Link href="/categorias" className="text-sm font-semibold rounded-xl px-3 py-1.5 hover:bg-neutral-100">
            Ver todas las categorías →
          </Link>
        </div>
        {top.length > 0 ? (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {top.slice(0,6).map((m) => (
              <li key={m.id} className="rounded-xl border overflow-hidden bg-white group">
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={pickImg(m)}
                    alt={m.nombre || "Producto"}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="p-3">
                  <div className="text-sm font-semibold line-clamp-1">{m.nombre || "Producto"}</div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="rounded-xl border overflow-hidden bg-white">
                <div className="aspect-[4/3] rounded-none skeleton" />
                <div className="p-3">
                  <div className="h-4 w-3/4 rounded-md skeleton" />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
