import "server-only";
import Link from "next/link";
import Hero from "@/components/Hero";
import SectionHeader from "@/components/SectionHeader";
import ProductSkeleton from "@/components/ProductSkeleton";
import ProductListClient, { type Producto } from "@/components/ProductListClient";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

type Supa = NonNullable<ReturnType<typeof supabaseServer>>;
type Resp<T> = { data: T | null; error: any };

/**
 * Helper que acepta el builder de Supabase (thenable) y castea el resultado
 * a { data, error } para contentar a TypeScript.
 */
async function q<T = Producto[]>(
  cb: (s: Supa) => any
): Promise<T> {
  const s = supabaseServer();
  if (!s) return [] as unknown as T;
  try {
    const { data, error } = (await cb(s)) as Resp<T>;
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

export default async function Home() {
  const hasEnv =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Destacados
  const destacados = await q<Producto[]>((s) =>
    s.from("productos").select("*").eq("destacado", true).order("id", { ascending: true }).limit(6)
  );

  // Nuevos: created_at desc → fallback id desc
  let nuevos = await q<Producto[]>((s) =>
    s.from("productos").select("*").order("created_at", { ascending: false }).limit(6)
  );
  if (!nuevos?.length) {
    nuevos = await q<Producto[]>((s) =>
      s.from("productos").select("*").order("id", { ascending: false }).limit(6)
    );
  }

  // Top ventas: ventas desc → fallback id asc
  let top = await q<Producto[]>((s) =>
    s.from("productos").select("*").order("ventas", { ascending: false }).limit(6)
  );
  if (!top?.length) {
    top = await q<Producto[]>((s) =>
      s.from("productos").select("*").order("id", { ascending: true }).limit(6)
    );
  }

  return (
    <main className="space-y-12">
      <Hero />

      {!hasEnv && (
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-xl border bg-amber-50 text-amber-900 p-4">
            <p className="font-semibold">Configuración pendiente</p>
            <p className="text-sm">
              Falta <code>NEXT_PUBLIC_SUPABASE_URL</code> y/o <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
              Cuando las agregues, estas secciones se poblarán automáticamente.
            </p>
          </div>
        </div>
      )}

      {/* NUEVOS */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader title="Nuevos" subtitle="Lo último que estamos destacando en la tienda" />
        {Array.isArray(nuevos) && nuevos.length ? (
          <ProductListClient items={nuevos} />
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (<li key={i}><ProductSkeleton/></li>))}
          </ul>
        )}
      </section>

      {/* TENDENCIAS (Destacados) */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader title="Tendencias" subtitle="Se mueven mucho estos días" />
        {Array.isArray(destacados) && destacados.length ? (
          <ProductListClient items={destacados} />
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (<li key={i}><ProductSkeleton/></li>))}
          </ul>
        )}
      </section>

      {/* TOP VENTAS */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-end justify-between">
          <SectionHeader title="Top Ventas" subtitle="Los favoritos de la comunidad" className="mb-0" />
          <Link href="/categorias" className="text-sm font-semibold rounded-xl px-3 py-1.5 hover:bg-neutral-100">
            Ver todas las categorías →
          </Link>
        </div>
        {Array.isArray(top) && top.length ? (
          <ProductListClient items={top} />
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (<li key={i}><ProductSkeleton/></li>))}
          </ul>
        )}
      </section>
    </main>
  );
}
