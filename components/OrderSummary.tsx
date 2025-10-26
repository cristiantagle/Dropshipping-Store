'use client';

import { useOptimizedCart } from '@/contexts/OptimizedCartContext';
import dynamic from 'next/dynamic';
import { Truck, Shield, CreditCard } from 'lucide-react';

interface OrderSummaryProps {
  showCheckoutButton?: boolean;
  onCheckout?: () => void;
  isCheckingOut?: boolean;
}

export default function OrderSummary({
  showCheckoutButton = true,
  onCheckout,
  isCheckingOut = false,
}: OrderSummaryProps) {
  const { totals, isEmpty } = useOptimizedCart();
  const hasPublicKey = Boolean(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY);
  const MPWallet = hasPublicKey ? dynamic(() => import('./MPWallet'), { ssr: false }) : null;

  if (isEmpty) {
    return null;
  }

  return (
    <div className="rounded-xl bg-gray-50 p-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Resumen del pedido</h3>

      {/* Línea de subtotal */}
      <div className="flex justify-between py-2">
        <span className="text-gray-600">
          Subtotal ({totals.itemCount} {totals.itemCount === 1 ? 'producto' : 'productos'})
        </span>
        <span className="font-medium">{totals.formattedSubtotal()}</span>
      </div>

      {/* Línea de envío */}
      <div className="flex justify-between py-2">
        <span className="flex items-center gap-1 text-gray-600">
          <Truck className="h-4 w-4" />
          Envío
        </span>
        <span className={`font-medium ${totals.shipping() === 0 ? 'text-green-600' : ''}`}>
          {totals.formattedShipping()}
        </span>
      </div>

      {/* Mensaje de envío gratis */}
      {totals.shipping() === 0 ? (
        <div className="mb-4 rounded-md bg-green-50 p-2 text-sm text-green-700">
          🎉 ¡Felicitaciones! Tu pedido califica para envío gratis
        </div>
      ) : (
        <div className="mb-4 rounded-md bg-blue-50 p-2 text-sm text-blue-700">
          💡 Envío gratis en compras sobre{' '}
          {new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
          }).format(50000)}
        </div>
      )}

      {/* Separador */}
      <div className="my-4 border-t border-gray-200"></div>

      {/* Total */}
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold text-gray-900">Total</span>
        <span className="text-xl font-bold text-lime-600">{totals.formattedTotal()}</span>
      </div>

      {/* Acción de pago (botón o Wallet Brick) */}
      {showCheckoutButton && !hasPublicKey && (
        <button
          onClick={onCheckout}
          disabled={isCheckingOut || isEmpty}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-lime-600 px-4 py-3 font-semibold text-white transition-colors duration-200 hover:bg-lime-700 disabled:bg-gray-400"
        >
          {isCheckingOut ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
              Procesando...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4" />
              Proceder al pago
            </>
          )}
        </button>
      )}

      {/* Botonera adicional (placeholders sin lógica) */}
      {!isEmpty && (
        <div className="mt-3 grid gap-2">
          <button
            type="button"
            disabled
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-70"
            title="Disponible pronto"
          >
            Transferencia bancaria (pronto)
          </button>
          <button
            type="button"
            disabled
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-70"
            title="Disponible pronto"
          >
            Pago en cuotas (pronto)
          </button>
        </div>
      )}

      {/* Garantías */}
      <div className="mt-4 space-y-2 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Shield className="h-3 w-3" />
          <span>Compra 100% segura</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="h-3 w-3" />
          <span>Envío a todo Chile</span>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="h-3 w-3" />
          <span>Paga con Mercado Pago</span>
        </div>
      </div>
    </div>
  );
}
