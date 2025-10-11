'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { formatPrice } from '@/lib/formatPrice';

// Sistema de logging persistente
function logToPersistentLog(level: 'info' | 'warn' | 'error', message: string, data?: any) {
  if (typeof window === 'undefined') return;
  
  try {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data: data || {},
      url: window.location.href
    };
    
    const existingLogs = JSON.parse(localStorage.getItem('debug-cart-logs') || '[]');
    existingLogs.push(logEntry);
    
    // Mantener solo los últimos 50 logs
    const recentLogs = existingLogs.slice(-50);
    localStorage.setItem('debug-cart-logs', JSON.stringify(recentLogs));
    
    // También log normal para la consola
    console.log(`[${level.toUpperCase()}] ${message}`, data || '');
  } catch (e) {
    console.error('Error en logging persistente:', e);
  }
}

export interface CartItem {
  id: string;
  name: string;
  name_es?: string;
  image_url: string;
  price_cents: number;
  category_slug?: string;
  qty: number;
}

interface CartContextType {
  items: CartItem[];
  add: (item: Omit<CartItem, 'qty'>) => void;
  remove: (id: string) => void;
  clear: () => void;
  updateQuantity: (id: string, qty: number) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  totals: {
    itemCount: number;
    subtotal: number;
    shipping: () => number;
    total: () => number;
    formattedSubtotal: () => string;
    formattedShipping: () => string;
    formattedTotal: () => string;
  };
  isEmpty: boolean;
  getItem: (id: string) => CartItem | undefined;
  hasItem: (id: string) => boolean;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function OptimizedCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Hidratar desde localStorage al montar (cliente)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    logToPersistentLog('info', '🔄 [CONTEXT-INIT] Inicializando contexto del carrito');
    try {
      const stored = localStorage.getItem('carro');
      const parsed = stored ? JSON.parse(stored) : [];
      logToPersistentLog('info', '📥 [CONTEXT-INIT] Items cargados', { count: parsed.length, items: parsed.map((i: CartItem) => ({ id: i.id, qty: i.qty })) });
      setItems(parsed);
    } catch {
      logToPersistentLog('error', '❌ [CONTEXT-INIT] Error al cargar, usando array vacío');
      setItems([]);
    }
  }, []);

  // Backup automático cada vez que cambia el carrito
  useEffect(() => {
    if (typeof window === 'undefined' || items.length === 0) return;
    
    try {
      const backupKey = `carro-backup-${Date.now()}`;
      const backupData = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        items: items,
        count: items.reduce((sum, item) => sum + item.qty, 0)
      };
      localStorage.setItem(backupKey, JSON.stringify(backupData));
      
      // Mantener solo los últimos 5 backups
      const allKeys = Object.keys(localStorage).filter(key => key.startsWith('carro-backup-'));
      if (allKeys.length > 5) {
        allKeys.sort().slice(0, -5).forEach(key => localStorage.removeItem(key));
      }
      
      logToPersistentLog('info', '💾 [CONTEXT-BACKUP] Backup automático creado', { backupKey, itemCount: items.length });
    } catch (e) {
      logToPersistentLog('error', '❌ [CONTEXT-BACKUP] Error creando backup', e);
    }
  }, [items]);

  // Sincronizar escritura cuando el estado cambia
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const totalItems = items.reduce((sum, item) => sum + item.qty, 0);
    
    // Protección específica contra borrado durante navegación
    if (items.length === 0) {
      // Solo permitir vaciado si es intencional (clear function o timeout)
      const currentStoredItems = (() => {
        try {
          return JSON.parse(localStorage.getItem('carro') || '[]');
        } catch {
          return [];
        }
      })();
      
      if (currentStoredItems.length > 0) {
        logToPersistentLog('warn', '⚠️ [CONTEXT-PROTECTION] Intento de borrado detectado, verificando legitimidad');
        
        // Si el state local está vacío pero localStorage no, podría ser un bug de hidratación
        // Rehidratar desde localStorage en lugar de vaciar
        setItems(currentStoredItems);
        logToPersistentLog('info', '🔄 [CONTEXT-PROTECTION] Rehidratando desde localStorage en lugar de vaciar');
        return;
      }
    }
    
    // Solo procesar si realmente hay un cambio significativo
    const currentStoredItems = (() => {
      try {
        return JSON.parse(localStorage.getItem('carro') || '[]');
      } catch {
        return [];
      }
    })();
    
    const currentIds = items.map(i => `${i.id}-${i.qty}`).sort().join(',');
    const storedIds = currentStoredItems.map((i: CartItem) => `${i.id}-${i.qty}`).sort().join(',');
    
    // Si no hay cambios reales, no hacer nada
    if (currentIds === storedIds) {
      logToPersistentLog('info', '⏹️ [CONTEXT-WRITE] Sin cambios reales, saltando escritura');
      return;
    }
    
    logToPersistentLog('info', '💾 [CONTEXT-WRITE] Guardando carrito', { totalItems, itemsCount: items.length, items: items.map(i => ({ id: i.id, qty: i.qty })) });
    
    try {
      localStorage.setItem('carro', JSON.stringify(items));
      // Solo disparar evento si realmente cambió
      window.dispatchEvent(new CustomEvent('carro:updated', {
        detail: { items, count: totalItems }
      }));
      logToPersistentLog('info', '✅ [CONTEXT-WRITE] Guardado exitoso y evento disparado');
    } catch (e) {
      logToPersistentLog('error', '❌ [CONTEXT-WRITE] Error guardando carrito en localStorage', e);
    }
  }, [items]);

  // Agregar producto al carrito
  function add(item: Omit<CartItem, 'qty'>) {
    logToPersistentLog('info', '🛒 [CONTEXT-ADD] Agregando al carrito', { id: item.id, name: item.name });

    setItems(prevItems => {
      const found = prevItems.find(p => p.id === item.id);
      let updatedItems: CartItem[];
      if (found) {
        updatedItems = prevItems.map(p => p.id === item.id ? { ...p, qty: p.qty + 1 } : p);
        logToPersistentLog('info', '📈 [CONTEXT-ADD] Incrementando cantidad', { productId: item.id, newQty: found.qty + 1 });
      } else {
        updatedItems = [...prevItems, { ...item, qty: 1 }];
        logToPersistentLog('info', '🆕 [CONTEXT-ADD] Agregando nuevo producto', { productId: item.id });
      }

      logToPersistentLog('info', '📦 [CONTEXT-ADD] Items después', { items: updatedItems.map(i => ({ id: i.id, name: i.name, qty: i.qty })) });
      return updatedItems;
    });
  }

  // Eliminar producto completamente del carrito
  function remove(id: string) {
    setItems(prev => prev.filter(p => p.id !== id));
  }

  // Actualizar cantidad específica
  function updateQuantity(id: string, qty: number) {
    if (qty <= 0) {
      remove(id);
      return;
    }
    
    setItems(prev => 
      prev.map(p => 
        p.id === id ? { ...p, qty: Math.max(1, Math.min(99, qty)) } : p
      )
    );
  }

  // Incrementar cantidad
  function increment(id: string) {
    setItems(prev => 
      prev.map(p => 
        p.id === id ? { ...p, qty: Math.min(99, p.qty + 1) } : p
      )
    );
  }

  // Decrementar cantidad
  function decrement(id: string) {
    setItems(prev => 
      prev.map(p => 
        p.id === id ? { ...p, qty: Math.max(1, p.qty - 1) } : p
      )
    );
  }

  // Limpiar carrito (función intencional)
  function clear() {
    logToPersistentLog('info', '🗑️ [CONTEXT-CLEAR] Limpieza intencional del carrito');
    try {
      localStorage.setItem('carro', JSON.stringify([]));
    } catch {}
    setItems([]); 
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('carro:updated', { detail: { items: [], count: 0 } }));
    }
  }

  // Calcular totales
  const totals = {
    // Cantidad total de items
    itemCount: items.reduce((sum, item) => sum + item.qty, 0),
    
    // Subtotal (sin envío ni impuestos)
    subtotal: items.reduce((sum, item) => sum + (item.price_cents * item.qty), 0),
    
    // Costo de envío (gratis para pedidos >$50,000)
    shipping: function() {
      return this.subtotal >= 5000000 ? 0 : 299000; // $2,990 envío
    },
    
    // Total final
    total: function() {
      return this.subtotal + this.shipping();
    },
    
    // Formatear precios
    formattedSubtotal: function() {
      return formatPrice(this.subtotal);
    },
    
    formattedShipping: function() {
      return this.shipping() === 0 ? 'Gratis' : formatPrice(this.shipping());
    },
    
    formattedTotal: function() {
      return formatPrice(this.total());
    }
  };

  // Verificar si el carrito está vacío
  const isEmpty = items.length === 0;
  
  // Obtener producto por ID
  const getItem = (id: string) => items.find(item => item.id === id);
  
  // Verificar si un producto está en el carrito
  const hasItem = (id: string) => items.some(item => item.id === id);

  const value: CartContextType = { 
    items, 
    add, 
    remove, 
    clear, 
    updateQuantity,
    increment,
    decrement,
    totals,
    isEmpty,
    getItem,
    hasItem,
    isLoading,
    setIsLoading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useOptimizedCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useOptimizedCart must be used within an OptimizedCartProvider');
  }
  return context;
}