'use client';

import { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { SortAsc, SortDesc, Filter, Grid, List } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  name_es?: string;
  image_url: string;
  price_cents: number;
  category_slug?: string;
}

interface Props {
  productos: Product[];
  nombreCategoria: string;
}

type SortOption = 'none' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';
type ViewMode = 'grid' | 'list';

export default function CategoryPageClient({ productos, nombreCategoria }: Props) {
  const [sortBy, setSortBy] = useState<SortOption>('none');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Productos filtrados y ordenados
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...productos];

    // Filtro por precio
    if (minPrice || maxPrice) {
      filtered = filtered.filter((p) => {
        const MARKUP = Number(process.env.NEXT_PUBLIC_MARKUP) || 1.4;
        const price = (p.price_cents / 100) * MARKUP; // ✅ Aplicar markup como en formatPrice
        const min = minPrice ? parseFloat(minPrice) : 0;
        const max = maxPrice ? parseFloat(maxPrice) : Infinity;
        return price >= min && price <= max;
      });
    }

    // Ordenación
    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price_cents - b.price_cents);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price_cents - a.price_cents);
        break;
      case 'name_asc':
        filtered.sort((a, b) => {
          const nameA = a.name_es || a.name;
          const nameB = b.name_es || b.name;
          return nameA.localeCompare(nameB);
        });
        break;
      case 'name_desc':
        filtered.sort((a, b) => {
          const nameA = a.name_es || a.name;
          const nameB = b.name_es || b.name;
          return nameB.localeCompare(nameA);
        });
        break;
      default:
        // Sin ordenación
        break;
    }

    return filtered;
  }, [productos, sortBy, minPrice, maxPrice]);

  // Estadísticas de precios para el filtro
  const priceStats = useMemo(() => {
    if (productos.length === 0) return { min: 0, max: 0 };
    const MARKUP = Number(process.env.NEXT_PUBLIC_MARKUP) || 1.4;
    const prices = productos.map((p) => (p.price_cents / 100) * MARKUP); // ✅ Aplicar markup
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [productos]);

  const clearFilters = () => {
    setSortBy('none');
    setMinPrice('');
    setMaxPrice('');
  };

  const hasActiveFilters = sortBy !== 'none' || minPrice || maxPrice;

  if (!productos || productos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl bg-gray-50 py-16 text-gray-500">
        <p className="text-lg font-medium">No hay productos en esta categoría.</p>
        <p className="mt-1 text-sm">Vuelve pronto — estamos agregando nuevas colecciones.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Barra de filtros */}
      <div className="mb-8 flex flex-col justify-between gap-4 rounded-lg bg-gray-50 p-4 lg:flex-row lg:items-center">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-600" />
            <span className="font-medium text-gray-700">Filtros y orden:</span>
          </div>

          {/* Ordenación */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-lime-500"
          >
            <option value="none">Sin ordenar</option>
            <option value="price_asc">Precio: menor a mayor</option>
            <option value="price_desc">Precio: mayor a menor</option>
            <option value="name_asc">Nombre: A-Z</option>
            <option value="name_desc">Nombre: Z-A</option>
          </select>

          {/* Filtro de precio */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Precio:</span>
            <input
              type="number"
              placeholder={`${priceStats.min}`}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder={`${priceStats.max}`}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
            />
          </div>

          {/* Limpiar filtros */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="rounded bg-red-100 px-3 py-1.5 text-sm text-red-700 transition-colors hover:bg-red-200"
            >
              Limpiar
            </button>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 lg:justify-end">
          {/* Contador de productos */}
          <span className="text-sm text-gray-600">
            {filteredAndSortedProducts.length} de {productos.length} productos
          </span>

          {/* Vista grid/list */}
          <div className="flex items-center rounded-md border border-gray-300">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-lime-600 text-white' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-lime-600 text-white' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid de productos */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid grid-cols-1 gap-4'
        }
      >
        {filteredAndSortedProducts.map((producto) => (
          <ProductCard key={producto.id} {...producto} />
        ))}
      </div>

      {/* Mensaje si no hay resultados con filtros */}
      {filteredAndSortedProducts.length === 0 && hasActiveFilters && (
        <div className="py-12 text-center">
          <p className="mb-4 text-gray-500">
            No se encontraron productos con los filtros aplicados.
          </p>
          <button
            onClick={clearFilters}
            className="rounded-lg bg-lime-600 px-4 py-2 text-white transition-colors hover:bg-lime-700"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}
