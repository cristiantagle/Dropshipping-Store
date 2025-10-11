"use client";

import { useRecentlyViewed } from '../contexts/RecentlyViewedContext';
import ProductCard from './ProductCard';
import { Eye, Clock, X } from 'lucide-react';

interface RecentlyViewedProps {
  title?: string;
  maxItems?: number;
  showClearButton?: boolean;
  className?: string;
}

export default function RecentlyViewed({
  title = "Productos vistos recientemente",
  maxItems = 6,
  showClearButton = true,
  className = ""
}: RecentlyViewedProps) {
  const { products, totalViewed, clearHistory } = useRecentlyViewed();

  // No mostrar si no hay productos vistos
  if (totalViewed === 0) {
    return null;
  }

  const displayProducts = products.slice(0, maxItems);

  const handleClear = () => {
    if (window.confirm('¿Estás seguro de que deseas limpiar tu historial de productos vistos?')) {
      clearHistory();
    }
  };

  return (
    <section className={`py-12 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {totalViewed} producto{totalViewed !== 1 ? 's' : ''} visto{totalViewed !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {showClearButton && (
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Limpiar historial"
            >
              <X className="w-4 h-4" />
              Limpiar historial
            </button>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayProducts.map((product) => (
            <div key={product.id} className="relative group">
              <ProductCard
                id={product.id}
                name={product.name}
                name_es={product.name_es}
                image_url={product.image_url}
                price_cents={product.price_cents}
                category_slug={product.category_slug}
              />
              
              {/* Timestamp overlay */}
              <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1 z-20">
                <Clock className="w-3 h-3" />
                {getRelativeTime(product.viewedAt)}
              </div>
            </div>
          ))}
        </div>

        {/* Show more indicator */}
        {totalViewed > maxItems && (
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Y {totalViewed - maxItems} producto{totalViewed - maxItems !== 1 ? 's' : ''} más en tu historial
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// Helper function para mostrar tiempo relativo
function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Ahora';
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d`;
  
  return date.toLocaleDateString('es-CL', { 
    month: 'short', 
    day: 'numeric' 
  });
}