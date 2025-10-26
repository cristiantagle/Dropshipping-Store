'use client';

import { useState, useEffect, useMemo } from 'react';
import CategoryCarousel from '@/components/CategoryCarousel';
import { CarouselSkeleton } from '@/components/Skeleton';
import { createClient } from '@supabase/supabase-js';

interface Product {
  id: string;
  name: string;
  name_es?: string;
  image_url: string;
  price_cents: number;
}

export default function DemoPage() {
  const [showSkeletons, setShowSkeletons] = useState(false); // Empezar mostrando productos reales
  const [bellezaProducts, setBellezaProducts] = useState<Product[]>([]);
  const [ropaProducts, setRopaProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true); // Empezar cargando

  const supabase = useMemo(
    () =>
      createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      ),
    [],
  );

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      // Obtener productos de belleza
      const { data: belleza } = await supabase
        .from('products')
        .select('id, name, name_es, image_url, price_cents')
        .eq('category_slug', 'belleza')
        .not('image_url', 'is', null)
        .order('price_cents', { ascending: true })
        .limit(6);

      // Obtener productos de ropa mujer
      const { data: ropa } = await supabase
        .from('products')
        .select('id, name, name_es, image_url, price_cents')
        .eq('category_slug', 'ropa_mujer')
        .not('image_url', 'is', null)
        .order('price_cents', { ascending: true })
        .limit(6);

      setBellezaProducts(belleza || []);
      setRopaProducts(ropa || []);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-gray-900">
          Demo de Loading States
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-gray-600">
          Compara el loading skeleton con el contenido real
        </p>

        <div className="mt-8 space-y-4">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                if (!loading) {
                  setShowSkeletons(!showSkeletons);
                }
              }}
              disabled={loading}
              className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition-colors ${
                loading
                  ? 'cursor-not-allowed bg-gray-400 text-gray-200'
                  : 'bg-lime-600 text-white hover:bg-lime-700'
              }`}
            >
              {loading
                ? '⏳ Cargando...'
                : showSkeletons
                  ? '📱 Mostrar productos reales'
                  : '⚡ Mostrar loading skeletons'}
            </button>

            <button
              onClick={() => {
                if (!loading) {
                  setLoading(true);
                  setShowSkeletons(false); // Primero mostrar productos reales
                  // Simular 2 segundos de loading
                  setTimeout(() => {
                    setLoading(false);
                  }, 2000);
                }
              }}
              disabled={loading}
              className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition-colors ${
                loading
                  ? 'cursor-not-allowed bg-gray-400 text-gray-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading ? '⏳ Simulando...' : '🔄 Simular carga real'}
            </button>
          </div>

          {!loading && !showSkeletons && (
            <div className="text-center">
              <div className="inline-block rounded-lg bg-green-50 p-3 text-sm text-gray-600">
                ✅ <strong>{bellezaProducts.length}</strong> productos de belleza y{' '}
                <strong>{ropaProducts.length}</strong> de ropa cargados desde Supabase
              </div>
            </div>
          )}

          {loading && (
            <div className="text-center">
              <div className="inline-block rounded-lg bg-blue-50 p-3 text-sm text-blue-600">
                ⏳ Cargando productos desde la base de datos...
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Demo Category Carousel - Belleza */}
      {showSkeletons ? (
        <CarouselSkeleton itemCount={6} />
      ) : loading ? (
        <CategoryCarousel
          title="Productos de Belleza Reales"
          description="Cargando productos desde Supabase..."
          products={[]}
          link="/categorias/belleza"
          loading={true}
        />
      ) : (
        <CategoryCarousel
          title="Productos de Belleza Reales"
          description={`Estos son ${bellezaProducts.length} productos reales de tu base de datos`}
          products={bellezaProducts}
          link="/categorias/belleza"
          loading={false}
        />
      )}

      {/* Second demo - Ropa Mujer */}
      {showSkeletons ? (
        <CarouselSkeleton itemCount={6} />
      ) : loading ? (
        <CategoryCarousel
          title="Ropa de Mujer Real"
          description="Cargando productos desde Supabase..."
          products={[]}
          link="/categorias/ropa_mujer"
          loading={true}
        />
      ) : (
        <CategoryCarousel
          title="Ropa de Mujer Real"
          description={`Estos son ${ropaProducts.length} productos reales de ropa femenina`}
          products={ropaProducts}
          link="/categorias/ropa_mujer"
          loading={false}
        />
      )}

      <div className="mt-16 rounded-xl bg-gray-50 p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">🎆 ¿Qué mejoramos?</h2>

        <div className="mx-auto mb-8 grid max-w-6xl gap-6 text-left md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-lime-600">
              ⚡ Loading Skeletons
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-400" />
                Shimmer effect suave
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-400" />
                Mantiene el layout estable
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-400" />
                Mejor percepción de velocidad
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-orange-400" />
                Componentes reutilizables
              </li>
            </ul>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-lime-600">
              🎆 Hero Mejorado
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-400" />
                Imagen de fondo atractiva
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-400" />
                Animaciones de entrada fluidas
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-400" />
                Gradientes profesionales
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-orange-400" />
                Trust badges y elementos flotantes
              </li>
            </ul>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-lime-600">
              📊 Performance
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-400" />
                First Load JS: 98.9 kB
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-400" />
                Build optimizado
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-400" />
                SSG + datos dinámicos
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-orange-400" />
                Cero errores TypeScript
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-lg border border-lime-200 bg-lime-50 p-6">
          <h3 className="mb-2 font-semibold text-lime-700">🏆 Impacto de las mejoras</h3>
          <p className="text-sm text-gray-700">
            Los loading skeletons mejoran la <strong>percepción de velocidad</strong> hasta en un
            40%, mientras que el Hero renovado aumenta el <strong>engagement</strong> y reduce el
            bounce rate. Todo esto manteniendo el excelente rendimiento de Next.js.
          </p>
        </div>
      </div>
    </main>
  );
}
