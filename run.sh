#!/usr/bin/env bash
set -euo pipefail

BR="preview/home-supabase-safe-$(date +%Y%m%d-%H%M%S)"
echo "🔧 Conectando Home → Supabase (seguro) sin romper UI"
echo "🌱 Rama: $BR"

# Asegurar estado y crear rama desde main
git add -A >/dev/null 2>&1 || true
git checkout -B "$BR" origin/main

# Solo tocamos app/page.tsx
cat > app/page.tsx <<'EOF'
import "server-only";
import Hero from "@/components/Hero";
import SectionHeader from "@/components/SectionHeader";
import ProductSkeleton from "@/components/ProductSkeleton";
import ProductListClient, { type Producto } from "@/components/ProductListClient";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";

/** Mocks que ya usabas para "Nuevos" (se conservan) */
const MOCKS = [
  { id: "m1", nombre: "Organizador minimal", imagen: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop" },
  { id: "m2", nombre: "Botella térmica", imagen: "https://images.unsplash.com/photo-1502741126161-b048400d085a?q=80&w=1200&auto=format&fit=crop" },
  { id: "m3", nombre: "Auriculares", imagen: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop" },
  { id: "m4", nombre: "Silla ergonómica", imagen: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1200&auto=format&fit=crop" },
  { id: "m5", nombre: "Lámpara cálida", imagen: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=1200&auto=format&fit=crop" },
  { id: "m6", nombre: "Mochila urbana", imagen: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop" }
];

/**
 * Helper seguro que tolera:
 * - Falta de envs (cuando supabaseServer() es null)
 * - Errores de consulta
 * - Tipos "thenables" de supabase (v2) sin pelear con TypeScript
 */
async function q<T = any>(promiseLike: any): Promise<T> {
  try {
    const { data, error } = await (promiseLike as Promise<{ data: T | null; error: any }>);
    if (error) return [] as T;
    return (data ?? []) as T;
  } catch {
    return [] as T;
  }
}

export const dynamic = "force-dynamic";

export default async function Home() {
  const supa = supabaseServer();

  // Por defecto vacías → skeletons
  let tendencias: Producto[] = [];
  let top: Producto[] = [];

  if (supa) {
    // Tendencias: los "más nuevos" por created_at desc (si esa columna existe en tu tabla)
    tendencias = await q<Producto[]>(
      supa.from("productos").select("*").order("created_at", { ascending: false }).limit(6)
    );

    // Top ventas: por 'ventas' desc si existe; si viene vacío, cae a id asc
    top = await q<Producto[]>(
      supa.from("productos").select("*").order("ventas", { ascending: false }).limit(6)
    );
    if (!Array.isArray(top) || top.length === 0) {
      top = await q<Producto[]>(
        supa.from("productos").select("*").order("id", { ascending: true }).limit(6)
      );
    }
  }

  return (
    <main className="space-y-12">
      <Hero />

      {/* NUEVOS: conserva tu UI con mocks */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          title="Nuevos"
          subtitle="Lo último que estamos destacando en la tienda"
        />
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
      </section>

      {/* TENDENCIAS */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          title="Tendencias"
          subtitle="Se mueven mucho estos días"
        />
        {Array.isArray(tendencias) && tendencias.length > 0 ? (
          <ProductListClient items={tendencias} />
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
        {Array.isArray(top) && top.length > 0 ? (
          <ProductListClient items={top} />
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
EOF

git add app/page.tsx
git commit -m "feat(home): conecta Tendencias/Top a Supabase con fallback seguro; conserva mocks de Nuevos"
git push -u origin "$BR"

echo "✅ Rama subida: $BR"
echo "➡ Revisá el preview en Vercel."
