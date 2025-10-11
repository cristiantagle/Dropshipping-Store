"use client";

import { useState, useEffect } from 'react';

interface CartState {
  itemCount: number;
  items: any[];
}

export function useCartListener(): CartState {
  const [cartState, setCartState] = useState<CartState>({ itemCount: 0, items: [] });

  useEffect(() => {
    // Función para obtener el estado actual del carrito
    const getCartState = (): CartState => {
      if (typeof window === 'undefined') return { itemCount: 0, items: [] };
      
      try {
        const raw = localStorage.getItem("carro") || "[]";
        const items = JSON.parse(raw);
        const itemCount = Array.isArray(items) ? items.reduce((sum, item) => sum + (item.qty || 0), 0) : 0;
        return { itemCount, items: Array.isArray(items) ? items : [] };
      } catch {
        return { itemCount: 0, items: [] };
      }
    };

    // Inicializar estado
    setCartState(getCartState());

    // Escuchar eventos de cambio en el carrito
    const handleCarroUpdated = () => {
      setCartState(getCartState());
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "carro" || e.key === null) {
        setCartState(getCartState());
      }
    };

    // Agregar listeners
    window.addEventListener("carro:updated", handleCarroUpdated);
    window.addEventListener("storage", handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener("carro:updated", handleCarroUpdated);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return cartState;
}