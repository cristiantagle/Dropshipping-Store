"use client";

import { useEffect, useMemo, useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import type { CartItem } from "@/contexts/OptimizedCartContext";

interface MPWalletProps {
  items: CartItem[];
  guestEmail?: string;
}

export default function MPWallet({ items, guestEmail }: MPWalletProps) {
  const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || "";
  const [prefId, setPrefId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";

  // Prepare items for MP (CLP, with markup like the checkout button did)
  const mpItems = useMemo(
    () =>
      items.map((item) => ({
        title: item.name_es || item.name,
        quantity: item.qty,
        price: parseFloat(((item.price_cents * 1.3) / 100).toFixed(0)),
      })),
    [items]
  );

  useEffect(() => {
    if (!publicKey) return;
    try {
      initMercadoPago(publicKey, { locale: "es-CL" });
    } catch {}
  }, [publicKey]);

  useEffect(() => {
    let cancelled = false;
    async function createPreference() {
      setLoading(true);
      setError(null);
      setPrefId(null);
      try {
        const payload: any = { items: mpItems };
        if (isHttps && guestEmail && guestEmail.trim()) {
          payload.email = guestEmail.trim();
        }
        const res = await fetch("/api/checkout/mercadopago", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          let err: any = null;
          try { err = await res.json(); } catch {}
          throw new Error(err?.error || err?.details || "No se pudo crear la preferencia de pago");
        }
        const data = await res.json();
        if (!cancelled) setPrefId(data.id);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Error creando preferencia");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (items.length > 0) {
      createPreference();
    } else {
      setPrefId(null);
    }
    return () => {
      cancelled = true;
    };
  }, [mpItems, guestEmail, isHttps]);

  if (!publicKey) {
    return (
      <div className="mt-3 text-sm text-red-600">
        Faltan credenciales: configura `NEXT_PUBLIC_MP_PUBLIC_KEY` en .env.local.
      </div>
    );
  }

  if (items.length === 0) return null;

  if (loading) {
    return (
      <div className="w-full mt-4 flex items-center justify-center text-gray-600 text-sm">
        Generando preferencia de pago...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full mt-4 text-sm text-red-600">
        Error al preparar el pago: {error}
      </div>
    );
  }

  if (!prefId) return null;

  return (
    <div className="mt-4">
      <Wallet initialization={{ preferenceId: prefId }} />
    </div>
  );
}
