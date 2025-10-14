"use client";

import { useOptimizedCart, CartItem } from '@/contexts/OptimizedCartContext';
import { useProductText } from '@/lib/useProductText';
import OrderSummary from './OrderSummary';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Minus, Plus, X, ShoppingBag, ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '../contexts/ToastContext';
import Image from 'next/image';

// Componente para cada item del carrito
function CartItemComponent({ item, onIncrement, onDecrement, onRemove, onUpdateQuantity }: { 
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
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      {/* Imagen del producto */}
      <div className="flex-shrink-0">
        <Image
          src={item.image_url}
          alt={displayName || 'Producto'}
          width={96}
          height={96}
          unoptimized
          className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-md bg-gray-50"
        />
      </div>

      {/* Información del producto */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">
          {displayName}
        </h3>
        <p className="text-sm text-gray-500 mb-2">
          {new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
          }).format((item.price_cents * 1.3) / 100)} c/u
        </p>

        {/* Controles de cantidad */}
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={() => onDecrement(item.id)}
              className="p-1 hover:bg-gray-100 transition-colors"
              disabled={item.qty <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              min="1"
              max="99"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              onBlur={handleQuantityBlur}
              className="w-12 text-center border-0 focus:ring-0 text-sm"
            />
            <button
              onClick={() => onIncrement(item.id)}
              className="p-1 hover:bg-gray-100 transition-colors"
              disabled={item.qty >= 99}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Precio total del item */}
          <div className="font-semibold text-lime-600">
            {new Intl.NumberFormat('es-CL', {
              style: 'currency',
              currency: 'CLP',
              minimumFractionDigits: 0,
            }).format((itemTotal * 1.3) / 100)}
          </div>
        </div>
      </div>

      {/* Botón eliminar */}
      <div className="flex-shrink-0">
        <button
          onClick={() => onRemove(item.id)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          title="Eliminar producto"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// Componente de estado de pago
function PaymentStatus() {
  const searchParams = useSearchParams();
  const status = searchParams?.get('status');
  const { addToast } = useToast();

  useEffect(() => {
    if (status === 'success') {
      addToast({ type: 'success', title: '¡Pago exitoso!', message: 'Recibirás un email con los detalles de tu pedido.' });
    } else if (status === 'failure') {
      addToast({ type: 'error', title: 'Pago no procesado', message: 'Hubo un problema con el pago. Por favor intenta nuevamente.' });
    } else if (status === 'pending') {
      addToast({ type: 'info', title: 'Pago en proceso', message: 'Tu pago está siendo procesado. Te notificaremos cuando esté confirmado.' });
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
      iconColor: 'text-green-600'
    },
    failure: {
      icon: XCircle,
      title: 'Pago no procesado',
      message: 'Hubo un problema con el pago. Por favor intenta nuevamente.',
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
      iconColor: 'text-red-600'
    },
    pending: {
      icon: Clock,
      title: 'Pago en proceso',
      message: 'Tu pago está siendo procesado. Te notificaremos cuando esté confirmado.',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-600'
    }
  };

  const config = statusConfig[status as keyof typeof statusConfig];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} ${config.textColor} p-4 rounded-lg mb-6`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-6 h-6 ${config.iconColor} flex-shrink-0`} />
        <div>
          <h3 className="font-semibold mb-1">{config.title}</h3>
          <p className="text-sm">{config.message}</p>
        </div>
      </div>
    </div>
  );
}

export default function CarroClient() {
  const { items, clear, isEmpty, setIsLoading, increment, decrement, remove, updateQuantity } = useOptimizedCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const { addToast } = useToast();

  // Función para proceder al checkout
  const handleCheckout = async () => {
    setIsCheckingOut(true);
    setIsLoading(true);

    try {
      // Preparar items para Mercado Pago
      const mpItems = items.map(item => ({
        title: item.name_es || item.name,
        quantity: item.qty,
        price: parseFloat(((item.price_cents * 1.3) / 100).toFixed(0)) // Con markup
      }));

      const response = await fetch('/api/checkout/mercadopago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: mpItems, email: guestEmail.trim() || undefined }),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await response.json();
      
      if (data.init_point) {
        // Redirigir a Mercado Pago
        window.location.href = data.init_point;
      } else {
        throw new Error('No se recibió el link de pago');
      }
    } catch (error) {
      console.error('Error en checkout:', error);
      addToast({ type: 'error', title: 'Error en el pago', message: 'Error al procesar el pago. Por favor intenta nuevamente.' });
    } finally {
      setIsCheckingOut(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Continuar comprando</span>
          </Link>
          <div className="h-6 w-px bg-gray-300"></div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6" />
            Tu carrito
          </h1>
        </div>

        {/* Estado de pago */}
        <PaymentStatus />

        {isEmpty ? (
          /* Carrito vacío */
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-600 mb-6">
              Descubre productos increíbles en nuestras categorías
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-lime-600 hover:bg-lime-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Explorar productos
            </Link>
          </div>
        ) : (
          /* Carrito con productos */
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Lista de productos */}
          <div className="lg:col-span-2">
            <div className="space-y-4 mb-6">
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
              <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200">
                <span className="text-sm text-gray-600">
                  {items.length} {items.length === 1 ? 'producto' : 'productos'} en tu carrito
                </span>
                <button
                  onClick={clear}
                  className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
                >
                  Limpiar carrito
                </button>
              </div>
            </div>

            {/* Resumen del pedido */}
            <div className="mt-8 lg:mt-0">
              {/* Compra como invitado (email opcional) */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (opcional)</label>
                <input
                  type="email"
                  placeholder="Para confirmaciones (puedes dejarlo en blanco)"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
                <p className="text-xs text-gray-500 mt-2">Compra como invitado, sin crear cuenta.</p>
              </div>
              <OrderSummary 
                onCheckout={handleCheckout}
                isCheckingOut={isCheckingOut}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
