'use client';

import { useOptimizedCart, CartItem } from '@/contexts/OptimizedCartContext';
import { useProductText } from '@/lib/useProductText';
import OrderSummary from './OrderSummary';
import MPWallet from './MPWallet';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Minus, Plus, X, ShoppingBag, ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '../contexts/ToastContext';
import { formatPrice } from '@/lib/formatPrice';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { supabaseAuth } from '@/lib/supabase/authClient';

// Componente para cada item del carrito
function CartItemComponent({
  item,
  onIncrement,
  onDecrement,
  onRemove,
  onUpdateQuantity,
}: {
  item: CartItem;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, qty: number) => void;
}) {
  const { name: displayName } = useProductText(item);
  const [quantity, setQuantity] = useState(item.qty);

  // Sincronizar con el carrito cuando cambie externamente
  useEffect(() => {
    setQuantity(item.qty);
  }, [item.qty]);

  const handleQuantityChange = (newQty: number) => {
    if (newQty >= 1 && newQty <= 99) {
      setQuantity(newQty);
      onUpdateQuantity(item.id, newQty);
    }
  };

  const handleQuantityBlur = () => {
    // Asegurar que la cantidad esté en rango válido
    const validQty = Math.max(1, Math.min(99, quantity));
    setQuantity(validQty);
    onUpdateQuantity(item.id, validQty);
  };

  const itemTotal = item.price_cents * item.qty;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md sm:flex-row">
      {/* Imagen del producto */}
      <div className="flex-shrink-0">
        <Image
          src={item.image_url}
          alt={displayName || 'Producto'}
          width={96}
          height={96}
          unoptimized
          className="h-20 w-20 rounded-md bg-gray-50 object-contain sm:h-24 sm:w-24"
        />
      </div>

      {/* Información del producto */}
      <div className="min-w-0 flex-1">
        <h3 className="mb-1 line-clamp-2 font-medium text-gray-900">{displayName}</h3>
        <p className="mb-2 text-sm text-gray-500">{formatPrice(item.price_cents)} c/u</p>

        {/* Controles de cantidad */}
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-md border border-gray-300">
            <button
              onClick={() => onDecrement(item.id)}
              className="p-1 transition-colors hover:bg-gray-100"
              disabled={item.qty <= 1}
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              type="number"
              min="1"
              max="99"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              onBlur={handleQuantityBlur}
              className="w-12 border-0 text-center text-sm focus:ring-0"
            />
            <button
              onClick={() => onIncrement(item.id)}
              className="p-1 transition-colors hover:bg-gray-100"
              disabled={item.qty >= 99}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Precio total del item */}
          <div className="font-semibold text-lime-600">{formatPrice(itemTotal)}</div>
        </div>
      </div>

      {/* Botón eliminar */}
      <div className="flex-shrink-0">
        <button
          onClick={() => onRemove(item.id)}
          className="p-2 text-gray-400 transition-colors hover:text-red-500"
          title="Eliminar producto"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

// Componente de estado de pago
function PaymentStatus() {
  const searchParams = useSearchParams();
  const status = searchParams?.get('status') || searchParams?.get('collection_status');
  const { addToast } = useToast();
  const { clear } = useOptimizedCart();

  useEffect(() => {
    if (status === 'success' || status === 'approved') {
      clear();
      addToast({
        type: 'success',
        title: 'Pago exitoso',
        message: 'Gracias por tu compra. Hemos limpiado tu carrito.',
      });
    } else if (status === 'failure') {
      addToast({
        type: 'error',
        title: 'Pago no procesado',
        message: 'Hubo un problema con el pago. Por favor intenta nuevamente.',
      });
    } else if (status === 'pending') {
      addToast({
        type: 'info',
        title: 'Pago en proceso',
        message: 'Tu pago está siendo procesado. Te notificaremos cuando esté confirmado.',
      });
    }
  }, [status, addToast]);

  if (!status) return null;

  const statusConfig = {
    success: {
      icon: CheckCircle,
      title: '¡Pago exitoso!',
      message: 'Gracias por tu compra. Recibirás un email con los detalles de tu pedido.',
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
      iconColor: 'text-green-600',
    },
    failure: {
      icon: XCircle,
      title: 'Pago no procesado',
      message: 'Hubo un problema con el pago. Por favor intenta nuevamente.',
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
      iconColor: 'text-red-600',
    },
    pending: {
      icon: Clock,
      title: 'Pago en proceso',
      message: 'Tu pago está siendo procesado. Te notificaremos cuando esté confirmado.',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-600',
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} ${config.textColor} mb-6 rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <Icon className={`h-6 w-6 ${config.iconColor} flex-shrink-0`} />
        <div>
          <h3 className="mb-1 font-semibold">{config.title}</h3>
          <p className="text-sm">{config.message}</p>
        </div>
      </div>
    </div>
  );
}

export default function CarroClient() {
  const { items, clear, isEmpty, setIsLoading, increment, decrement, remove, updateQuantity } =
    useOptimizedCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { user } = useAuth();
  const [guestEmail, setGuestEmail] = useState('');
  const { addToast } = useToast();
  // Mostrar Bricks Wallet solo si existe Public Key
  const hasPublicKey = Boolean(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY);

  // Función para proceder al checkout
  const handleCheckout = async () => {
    setIsCheckingOut(true);
    setIsLoading(true);

    try {
      // Preparar items para Mercado Pago
      const MARKUP = Number(process.env.NEXT_PUBLIC_MARKUP) || 1.4;
      const mpItems = items.map((item) => ({
        title: item.name_es || item.name,
        quantity: item.qty,
        price: Math.round((item.price_cents / 100) * MARKUP), // Con markup (+40% por defecto)
      }));

      const forceSandbox =
        typeof window !== 'undefined' &&
        (window.location.protocol !== 'https:' || window.location.hostname === 'localhost');
      const payload: any = { items: mpItems };
      if (!forceSandbox && guestEmail.trim()) {
        payload.email = guestEmail.trim();
      }

      const response = await fetch('/api/checkout/mercadopago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let serverErr: any = null;
        try {
          serverErr = await response.json();
        } catch {}
        console.error('Checkout error details:', serverErr);
        addToast({
          type: 'error',
          title: 'Pago no disponible',
          message: serverErr?.error || 'Error en la respuesta del servidor',
        });
        throw new Error(serverErr?.details || 'Error en la respuesta del servidor');
      }

      const data = await response.json();
      if (user) {
        const MARKUP = Number(process.env.NEXT_PUBLIC_MARKUP) || 1.4;
        const orderItems = items.map((item) => {
          const unitPricePesos = Math.round((item.price_cents / 100) * MARKUP);
          return {
            product_id: item.id,
            title: item.name_es || item.name,
            quantity: item.qty,
            unit_price_cents: unitPricePesos * 100,
            image_url: item.image_url,
          };
        });
        const total_cents = orderItems.reduce(
          (sum, it) => sum + it.unit_price_cents * it.quantity,
          0,
        );
        const { data: orderRow } = await supabaseAuth
          .from('orders')
          .insert({
            user_id: user.id,
            email: guestEmail || user.email,
            status: 'pending',
            currency: 'CLP',
            total_cents,
            mp_preference_id: data.id,
          })
          .select('id')
          .single();
        if (orderRow?.id) {
          const rows = orderItems.map((it) => ({ order_id: orderRow.id, ...it }));
          await supabaseAuth.from('order_items').insert(rows);
        }
      }
      // En entorno local/no-HTTPS forzamos sandbox para pruebas
      const redirectUrl =
        forceSandbox && data.sandbox_init_point
          ? data.sandbox_init_point
          : data.init_point || data.sandbox_init_point;

      if (redirectUrl) {
        // Redirigir a Mercado Pago (prod o sandbox)
        window.open(redirectUrl, '_blank', 'noopener');
      } else {
        console.error('Respuesta checkout inválida:', data);
        throw new Error('No se recibió el link de pago (init_point)');
      }
    } catch (error) {
      console.error('Error en checkout:', error);
      addToast({
        type: 'error',
        title: 'Error en el pago',
        message: 'Error al procesar el pago. Por favor intenta nuevamente.',
      });
    } finally {
      setIsCheckingOut(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Continuar comprando</span>
          </Link>
          <div className="h-6 w-px bg-gray-300"></div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <ShoppingBag className="h-6 w-6" />
            Tu carrito
          </h1>
        </div>

        {/* Estado de pago */}
        <PaymentStatus />

        {isEmpty ? (
          /* Carrito vacío */
          <div className="py-12 text-center">
            <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h2 className="mb-2 text-xl font-semibold text-gray-900">Tu carrito está vacío</h2>
            <p className="mb-6 text-gray-600">
              Descubre productos increíbles en nuestras categorías
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-lime-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-lime-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Explorar productos
            </Link>
          </div>
        ) : (
          /* Carrito con productos */
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2">
              <div className="mb-6 space-y-4">
                {items.map((item) => (
                  <CartItemComponent
                    key={item.id}
                    item={item}
                    onIncrement={increment}
                    onDecrement={decrement}
                    onRemove={remove}
                    onUpdateQuantity={updateQuantity}
                  />
                ))}
              </div>

              {/* Botón limpiar carrito */}
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                <span className="text-sm text-gray-600">
                  {items.length} {items.length === 1 ? 'producto' : 'productos'} en tu carrito
                </span>
                <button
                  onClick={clear}
                  className="text-sm font-medium text-red-600 transition-colors hover:text-red-800"
                >
                  Limpiar carrito
                </button>
              </div>
            </div>

            {/* Resumen del pedido + Pago (sticky en desktop) */}
            <div className="z-10 mt-8 space-y-4 lg:sticky lg:top-4 lg:mt-0 lg:self-start">
              {/* Compra como invitado (email opcional) */}
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email (opcional)
                </label>
                <input
                  type="email"
                  placeholder="Para confirmaciones (puedes dejarlo en blanco)"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Compra como invitado, sin crear cuenta.
                </p>
              </div>
              <OrderSummary
                showCheckoutButton={!hasPublicKey}
                onCheckout={handleCheckout}
                isCheckingOut={isCheckingOut}
              />
              {hasPublicKey && (
                <>
                  <MPWallet items={items} guestEmail={guestEmail} />
                  <div className="mt-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-xs text-gray-700">
                    <p>
                      El pago se abrirá en una pestaña nueva. En producción, al finalizar serás
                      redirigido automáticamente al carrito; si no, vuelve aquí manualmente.
                    </p>
                    <p className="mt-1">
                      <Link href="/cuenta/pedidos" className="font-medium text-lime-700 underline">
                        Revisar estado del pedido
                      </Link>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
