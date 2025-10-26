'use client';

import { useOptimizedCart } from '@/contexts/OptimizedCartContext';
import { formatPrice } from '@/lib/formatPrice';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface MiniCartProps {
  isVisible: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function MiniCart({ isVisible, onMouseEnter, onMouseLeave }: MiniCartProps) {
  const { items, totals, isEmpty } = useOptimizedCart();

  if (!isVisible || isEmpty) return null;

  // Show max 3 items in preview
  const previewItems = items.slice(0, 3);
  const remainingCount = items.length - previewItems.length;

  return (
    <div
      role="dialog"
      aria-label="Mini carrito"
      aria-live="polite"
      className="absolute top-full right-0 z-50 mt-0 w-80 transition-all duration-200 ease-out"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        // Create invisible bridge to prevent hover gap
        paddingTop: '8px',
        marginTop: '-8px',
      }}
    >
      {/* Actual cart content with proper styling */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Tu Carrito</h3>
            <span className="text-sm text-gray-500">{totals.itemCount} productos</span>
          </div>
        </div>

        {/* Items Preview */}
        <div className="max-h-64 overflow-y-auto">
          {previewItems.map((item) => (
            <div
              key={item.id}
              className="hover:bg-gray-25 flex items-center gap-3 border-b border-gray-50 p-4 transition-colors"
            >
              {/* Imagen */}
              <div className="flex-shrink-0">
                <Image
                  src={item.image_url}
                  alt={item.name_es || item.name}
                  width={48}
                  height={48}
                  unoptimized
                  className="h-12 w-12 rounded-lg object-cover"
                />
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-medium text-gray-900">
                  {item.name_es || item.name}
                </h4>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Cant: {item.qty}</span>
                  <span className="text-sm font-semibold text-purple-600">
                    {formatPrice(item.price_cents * item.qty)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Remaining items indicator */}
          {remainingCount > 0 && (
            <div className="bg-gray-25 p-3 text-center text-sm text-gray-500">
              +{remainingCount} producto{remainingCount !== 1 ? 's' : ''} más
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 bg-gray-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-medium text-gray-900">Total:</span>
            <span className="text-lg font-bold text-purple-600">{totals.formattedTotal()}</span>
          </div>

          <Link
            href="/carro"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 font-semibold text-white transition-all duration-200 hover:from-purple-700 hover:to-pink-700"
          >
            Ver Carrito
            <ArrowRight className="h-4 w-4" />
          </Link>

          <p className="mt-2 text-center text-xs text-gray-500">
            Envío gratuito en pedidos sobre $30.000
          </p>
        </div>
      </div>
    </div>
  );
}
