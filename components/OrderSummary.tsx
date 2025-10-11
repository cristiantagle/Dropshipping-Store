"use client";

import { useCart } from './useCart';
import { Truck, Shield, CreditCard } from 'lucide-react';

interface OrderSummaryProps {
  showCheckoutButton?: boolean;
  onCheckout?: () => void;
  isCheckingOut?: boolean;
}

export default function OrderSummary({ 
  showCheckoutButton = true, 
  onCheckout,
  isCheckingOut = false 
}: OrderSummaryProps) {
  const { totals, isEmpty } = useCart();

  if (isEmpty) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-xl p-6 sticky top-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Resumen del pedido
      </h3>

      {/* Línea de subtotal */}
      <div className="flex justify-between py-2">
        <span className="text-gray-600">
          Subtotal ({totals.itemCount} {totals.itemCount === 1 ? 'producto' : 'productos'})
        </span>
        <span className="font-medium">{totals.formattedSubtotal()}</span>
      </div>

      {/* Línea de envío */}
      <div className="flex justify-between py-2">
        <span className="text-gray-600 flex items-center gap-1">
          <Truck className="w-4 h-4" />
          Envío
        </span>
        <span className={`font-medium ${totals.shipping() === 0 ? 'text-green-600' : ''}`}>
          {totals.formattedShipping()}
        </span>
      </div>

      {/* Mensaje de envío gratis */}
      {totals.shipping() === 0 ? (
        <div className="bg-green-50 text-green-700 text-sm p-2 rounded-md mb-4">
          🎉 ¡Felicitaciones! Tu pedido califica para envío gratis
        </div>
      ) : (
        <div className="bg-blue-50 text-blue-700 text-sm p-2 rounded-md mb-4">
          💡 Envío gratis en compras sobre {new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
          }).format(50000)}
        </div>
      )}

      {/* Separador */}
      <div className="border-t border-gray-200 my-4"></div>

      {/* Total */}
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold text-gray-900">Total</span>
        <span className="text-xl font-bold text-lime-600">
          {totals.formattedTotal()}
        </span>
      </div>

      {/* Botón de checkout */}
      {showCheckoutButton && (
        <button
          onClick={onCheckout}
          disabled={isCheckingOut || isEmpty}
          className="w-full mt-6 bg-lime-600 hover:bg-lime-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {isCheckingOut ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Procesando...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              Proceder al pago
            </>
          )}
        </button>
      )}

      {/* Garantías */}
      <div className="mt-4 space-y-2 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Shield className="w-3 h-3" />
          <span>Compra 100% segura</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-3 h-3" />
          <span>Envío a todo Chile</span>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="w-3 h-3" />
          <span>Paga con Mercado Pago</span>
        </div>
      </div>
    </div>
  );
}