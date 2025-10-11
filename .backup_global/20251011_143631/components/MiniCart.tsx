"use client";

import { useOptimizedCart } from '@/contexts/OptimizedCartContext';
import { formatPrice } from '@/lib/formatPrice';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface MiniCartProps {
  isVisible: boolean;
}

export default function MiniCart({ isVisible }: MiniCartProps) {
  const { items, totals, isEmpty } = useOptimizedCart();

  if (!isVisible || isEmpty) return null;

  // Show max 3 items in preview
  const previewItems = items.slice(0, 3);
  const remainingCount = items.length - previewItems.length;

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Tu Carrito</h3>
          <span className="text-sm text-gray-500">{totals.itemCount} productos</span>
        </div>
      </div>

      {/* Items Preview */}
      <div className="max-h-64 overflow-y-auto">
        {previewItems.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-4 border-b border-gray-50 hover:bg-gray-25 transition-colors">
            {/* Imagen */}
            <div className="flex-shrink-0">
              <img
                src={item.image_url}
                alt={item.name_es || item.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm text-gray-900 truncate">
                {item.name_es || item.name}
              </h4>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-500">Cant: {item.qty}</span>
                <span className="text-sm font-semibold text-purple-600">
                  {formatPrice((item.price_cents * item.qty * 1.3))}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Remaining items indicator */}
        {remainingCount > 0 && (
          <div className="p-3 text-center text-sm text-gray-500 bg-gray-25">
            +{remainingCount} producto{remainingCount !== 1 ? 's' : ''} más
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium text-gray-900">Total:</span>
          <span className="font-bold text-lg text-purple-600">
            {totals.formattedTotal()}
          </span>
        </div>

        <Link
          href="/carro"
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center gap-2"
        >
          Ver Carrito
          <ArrowRight className="w-4 h-4" />
        </Link>
        
        <p className="text-xs text-gray-500 text-center mt-2">
          Envío gratuito en pedidos sobre $30.000
        </p>
      </div>
    </div>
  );
}