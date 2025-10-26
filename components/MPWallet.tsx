'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { CartItem } from '@/contexts/OptimizedCartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabaseAuth } from '@/lib/supabase/authClient';

declare global {
  interface Window {
    MercadoPago?: any;
  }
}

interface MPWalletProps {
  items: CartItem[];
  guestEmail?: string;
}

// Bricks Wallet embebido
export default function MPWallet({ items, guestEmail }: MPWalletProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const containerId = useRef<string>(`mp-wallet-${Math.random().toString(36).slice(2)}`);
  const { user } = useAuth();
  const MARKUP = Number(process.env.NEXT_PUBLIC_MARKUP) || 1.4;

  const mpItems = useMemo(
    () =>
      items.map((item) => ({
        title: item.name_es || item.name,
        quantity: item.qty,
        price: Math.round((item.price_cents / 100) * MARKUP),
      })),
    [items, MARKUP],
  );

  // Cargar SDK si es necesario
  const loadSdk = () =>
    new Promise<void>((resolve, reject) => {
      if (typeof window !== 'undefined' && window.MercadoPago) return resolve();
      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('No se pudo cargar el SDK de Mercado Pago'));
      document.head.appendChild(script);
    });

  // Crear preferencia en el servidor
  const createPreference = async () => {
    const payload: any = { items: mpItems };
    const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
    if (isHttps && guestEmail?.trim()) payload.email = guestEmail.trim();
    const res = await fetch('/api/checkout/mercadopago', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      let err: any = null;
      try {
        err = await res.json();
      } catch {}
      throw new Error(err?.error || err?.details || 'No se pudo crear la preferencia de pago');
    }
    const data = await res.json();

    // Registrar orden (opcional) si el usuario está autenticado
    if (user) {
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

    return data.id as string;
  };

  // Renderizar Wallet brick cuando hay preferenceId y SDK
  const renderWallet = async (prefId: string) => {
    const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!;
    const mp = new window.MercadoPago(publicKey, { locale: 'es-CL' });
    const bricks = mp.bricks();
    // Destruir previos si el contenedor ya tiene algo
    const container = document.getElementById(containerId.current);
    if (!container) throw new Error('Contenedor de Wallet no encontrado');
    container.innerHTML = '';
    await bricks.create('wallet', containerId.current, {
      initialization: {
        preferenceId: prefId,
      },
      customization: {
        texts: { valueProp: 'smart_option' },
        // Abrir el checkout en nueva pestaña
        redirectMode: 'blank',
      },
      callbacks: {
        onReady: () => {},
        onError: (e: any) => {
          // Mostrar error visible si el Brick falla
          const msg = e?.message || 'Error en el Brick de Mercado Pago';
          // setError está en cierre, pero como estamos en una función async externa, hacemos fallback directo
          console.error('Wallet brick error:', e);
        },
      },
    });
  };

  useEffect(() => {
    let cancelled = false;
    if (items.length === 0) {
      setPreferenceId(null);
      setLoading(false);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        setError(null);
        await loadSdk();
        const prefId = await createPreference();
        if (cancelled) return;
        setPreferenceId(prefId);
        await renderWallet(prefId);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Error al preparar el pago');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // Re-crear la preferencia cuando cambian items o email
  }, [JSON.stringify(mpItems), guestEmail]);

  if (items.length === 0) return null;
  return (
    <div className="mt-4">
      {error && <div className="mb-2 text-sm text-red-600">{error}</div>}
      <div id={containerId.current} className="min-h-[56px] w-full" />
      {loading && <div className="mt-2 text-sm text-gray-600">Preparando pago...</div>}
    </div>
  );
}
