import "server-only";
import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import ProductListClient from "@/components/ProductListClient";
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
  destacado?: boolean | null;
  categoria?: string | null;
  categoria_slug?: string | null;
  created_at?: string | null;
  ventas?: number | null;
};

async function fetchSafe<T>(p: Promise<{ data: T | null; error: any }>): Promise<T> {
  try {
    const { data, error } = await p;
    if (error) {
      console.error("Supabase error:", error);
      return [] as unknown as T;
    }
    return (data ?? ([] as unknown as T));
  } catch (e) {
    console.error("Supabase exception:", e);
    return [] as unknown as T;
  }
}

export default async function HomePage() {
  const supa = supabaseServer();

  let destacados: Producto[] = [];
  let nuevos: Producto[] = [];
  let top: Producto[] = [];
  const hasEnv =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supa) {
    destacados = await fetchSafe<Producto[]>(
      supa.from("productos").select("*").eq("destacado", true).order("id", { ascending: true }).limit(6)
    );

    try {
      nuevos = await fetchSafe<Producto[]>(
        supa.from("productos").select("*").order("created_at", { ascending: false }).limit(6)
      );
      if (!Array.isArray(nuevos) || nuevos.length === 0) throw new Error();
    } catch {
      nuevos = await fetchSafe<Producto[]>(
        supa.from("productos").select("*").order("id", { ascending: false }).limit(6)
      );
    }

    try {
      top = await fetchSafe<Producto[]>(
        supa.from("productos").select("*").order("ventas", { ascending: false }).limit(6)
      );
      if (!Array.isArray(top) || top.length === 0) throw new Error();
    } catch {
      top = await fetchSafe<Producto[]>(
        supa.from("productos").select("*").order("id", { ascending: true }).limit(6)
      );
    }
  }

  return (
    <main className="space-y-10">
      <Hero />

      {!hasEnv && (
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-xl border bg-amber-50 text-amber-900 p-4">
            <p className="font-semibold">Configuración pendiente</p>
            <p className="text-sm">
              Falta <code>NEXT_PUBLIC_SUPABASE_URL</code> y/o <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
              Aún así, el sitio funciona; cuando agregues las variables se poblarán estas secciones.
            </p>
          </div>
        </div>
      )}

      <section className="mx-auto max-w-6xl px-4 sm:px-6 space-y-8">
        <div>
          <h2 className="section-title">Destacados</h2>
          <p className="section-sub">Selección curada de productos</p>
        </div>
        {Array.isArray(destacados) && destacados.length > 0 ? (
          <ProductListClient items={destacados} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border rounded-2xl p-4 bg-white">
                <div className="aspect-[4/3] w-full mb-3 rounded-xl skeleton" />
                <div className="h-4 w-1/2 skeleton rounded-md" />
                <div className="mt-2 h-3 w-1/3 skeleton rounded-md" />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 space-y-8">
        <div>
          <h2 className="section-title">Nuevos</h2>
          <p className="section-sub">Lo último que llegó a la tienda</p>
        </div>
        {Array.isArray(nuevos) && nuevos.length > 0 ? (
          <ProductListClient items={nuevos} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border rounded-2xl p-4 bg-white">
                <div className="aspect-[4/3] w-full mb-3 rounded-xl skeleton" />
                <div className="h-4 w-1/2 skeleton rounded-md" />
                <div className="mt-2 h-3 w-1/3 skeleton rounded-md" />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 space-y-8">
        <div>
          <h2 className="section-title">Top ventas</h2>
          <p className="section-sub">Los favoritos de la comunidad</p>
        </div>
        {Array.isArray(top) && top.length > 0 ? (
          <ProductListClient items={top} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border rounded-2xl p-4 bg-white">
                <div className="aspect-[4/3] w-full mb-3 rounded-xl skeleton" />
                <div className="h-4 w-1/2 skeleton rounded-md" />
                <div className="mt-2 h-3 w-1/3 skeleton rounded-md" />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 space-y-6">
        <div>
          <h2 className="section-title">Explora por categoría</h2>
          <p className="section-sub">Encuentra lo que necesitas en segundos</p>
        </div>
        <CategoryGrid />
      </section>
    </main>
  );
}
