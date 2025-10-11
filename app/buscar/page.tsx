"use client";

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import ProductCard from '@/components/ProductCard';
import { Search, Filter, SortAsc, SortDesc, X } from 'lucide-react';
import { categorias } from '@/lib/categorias';

interface Product {
  id: string;
  name: string;
  name_es?: string;
  image_url: string;
  price_cents: number;
  category_slug?: string;
}

function BuscarPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(searchParams?.get('q') || '');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceSort, setPriceSort] = useState<'asc' | 'desc' | 'none'>('none');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Búsqueda en tiempo real
  useEffect(() => {
    const searchProducts = async () => {
      if (query.length < 2) {
        setProducts([]);
        return;
      }

      setLoading(true);
      
      let queryBuilder = supabase
        .from('products')
        .select('id, name, name_es, image_url, price_cents, category_slug')
        .not('image_url', 'is', null);

      // Búsqueda por nombre (inglés o español)
      queryBuilder = queryBuilder.or(`name.ilike.%${query}%,name_es.ilike.%${query}%`);

      // Filtro por categoría
      if (categoryFilter !== 'all') {
        queryBuilder = queryBuilder.eq('category_slug', categoryFilter);
      }

      // Filtro por precio
      if (minPrice) {
        // ✅ Convertir precio con markup a precio base para filtrar en BD
        const MARKUP = Number(process.env.NEXT_PUBLIC_MARKUP) || 1.3;
        const basePriceCents = (parseInt(minPrice) / MARKUP) * 100;
        queryBuilder = queryBuilder.gte('price_cents', basePriceCents);
      }
      if (maxPrice) {
        // ✅ Convertir precio con markup a precio base para filtrar en BD
        const MARKUP = Number(process.env.NEXT_PUBLIC_MARKUP) || 1.3;
        const basePriceCents = (parseInt(maxPrice) / MARKUP) * 100;
        queryBuilder = queryBuilder.lte('price_cents', basePriceCents);
      }

      // Ordenación
      if (priceSort === 'asc') {
        queryBuilder = queryBuilder.order('price_cents', { ascending: true });
      } else if (priceSort === 'desc') {
        queryBuilder = queryBuilder.order('price_cents', { ascending: false });
      }

      const { data, error } = await queryBuilder.limit(24);

      if (error) {
        console.error('Error en búsqueda:', error);
      } else {
        setProducts(data || []);
      }
      
      setLoading(false);
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, categoryFilter, priceSort, minPrice, maxPrice]);

  const clearFilters = () => {
    setCategoryFilter('all');
    setPriceSort('none');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">🔍 Buscar Productos</h1>
        
        {/* Barra de búsqueda principal */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar productos por nombre..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent text-lg"
          />
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-4 items-center mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="font-medium text-gray-700">Filtros:</span>
          </div>

          {/* Filtro por categoría */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-lime-500"
          >
            <option value="all">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.nombre}
              </option>
            ))}
          </select>

          {/* Filtro por precio */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Precio:</span>
            <input
              type="number"
              placeholder="Mín"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Máx"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>

          {/* Ordenación */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPriceSort(priceSort === 'asc' ? 'none' : 'asc')}
              className={`p-2 rounded ${priceSort === 'asc' ? 'bg-lime-600 text-white' : 'bg-white text-gray-600'} border border-gray-300 hover:bg-lime-50`}
            >
              <SortAsc className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPriceSort(priceSort === 'desc' ? 'none' : 'desc')}
              className={`p-2 rounded ${priceSort === 'desc' ? 'bg-lime-600 text-white' : 'bg-white text-gray-600'} border border-gray-300 hover:bg-lime-50`}
            >
              <SortDesc className="w-4 h-4" />
            </button>
          </div>

          {/* Limpiar filtros */}
          {(categoryFilter !== 'all' || priceSort !== 'none' || minPrice || maxPrice) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            >
              <X className="w-4 h-4" />
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Resultados */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Buscando productos...</p>
        </div>
      )}

      {!loading && query.length >= 2 && (
        <div className="mb-6">
          <p className="text-gray-600">
            {products.length > 0 
              ? `Se encontraron ${products.length} productos para "${query}"` 
              : `No se encontraron productos para "${query}"`
            }
          </p>
        </div>
      )}

      {!loading && query.length < 2 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">¿Qué estás buscando?</h3>
          <p className="text-gray-600">Escribe al menos 2 caracteres para buscar productos</p>
        </div>
      )}

      {/* Grid de productos */}
      {products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function BuscarPage() {
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando página de búsqueda...</p>
        </div>
      </div>
    }>
      <BuscarPageContent />
    </Suspense>
  );
}
