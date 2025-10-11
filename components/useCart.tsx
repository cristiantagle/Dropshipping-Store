'use client';
import { useState, useEffect } from "react";
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

export function useCart() {
  // Estado local; se hidrata en cliente para evitar SSR/hydration issues
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Anti-loop: contadores para detectar loops infinitos
  const [syncEventCount, setSyncEventCount] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState(0);
  
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
      
      logToPersistentLog('info', '💾 [BACKUP] Backup automático creado', { backupKey, itemCount: items.length });
    } catch (e) {
      logToPersistentLog('error', '❌ [BACKUP] Error creando backup', e);
    }
  }, [items]);
  
  const [isLoading, setIsLoading] = useState(false);

  // Hidratar desde localStorage al montar (cliente)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    logToPersistentLog('info', '🔄 [HIDRATACIÓN] Cargando carrito inicial desde localStorage');
    try {
      const stored = localStorage.getItem('carro');
      const parsed = stored ? JSON.parse(stored) : [];
      logToPersistentLog('info', '📥 [HIDRATACIÓN] Items cargados', { count: parsed.length, items: parsed.map((i: CartItem) => ({ id: i.id, qty: i.qty })) });
      setItems(parsed);
    } catch {
      logToPersistentLog('error', '❌ [HIDRATACIÓN] Error al cargar, usando array vacío');
      setItems([]);
    }
  }, []);

  // Sincronizar escritura y avisar a otros listeners cuando este estado cambia localmente
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const totalItems = items.reduce((sum, item) => sum + item.qty, 0);
    
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
      logToPersistentLog('info', '⏹️ [SYNC-WRITE] Sin cambios reales, saltando escritura');
      return;
    }
    
    logToPersistentLog('info', '💾 [SYNC-WRITE] Guardando carrito', { totalItems, itemsCount: items.length, items: items.map(i => ({ id: i.id, qty: i.qty })) });
    
    try {
      localStorage.setItem('carro', JSON.stringify(items));
      // Solo disparar evento si realmente cambió
      window.dispatchEvent(new CustomEvent('carro:updated', {
        detail: { items, count: totalItems }
      }));
      logToPersistentLog('info', '✅ [SYNC-WRITE] Guardado exitoso y evento disparado');
    } catch (e) {
      logToPersistentLog('error', '❌ [SYNC-WRITE] Error guardando carrito en localStorage', e);
    }
  }, [items]);

  // Escuchar cambios externos y rehidratar (por si otra instancia del hook o tab modificó el carrito)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const sync = (event?: Event) => {
      const now = Date.now();
      
      // Anti-loop: si recibimos muchos eventos en poco tiempo, es un loop
      if (now - lastSyncTime < 100) { // menos de 100ms desde el último evento
        setSyncEventCount(prev => {
          const newCount = prev + 1;
          if (newCount > 10) {
            logToPersistentLog('error', '🚨 [LOOP-DETECTADO] Se detectó un loop infinito de eventos', {
              eventCount: newCount,
              eventType: event?.type || 'unknown',
              timeDiff: now - lastSyncTime
            });
            return 0; // Reset counter y no procesar más eventos por un momento
          }
          return newCount;
        });
      } else {
        setSyncEventCount(0); // Reset si ha pasado suficiente tiempo
      }
      
      setLastSyncTime(now);
      
      // Si detectamos loop, ignorar el evento
      if (syncEventCount > 10) {
        logToPersistentLog('warn', '⚠️ [LOOP-SKIP] Saltando evento por loop infinito detectado');
        return;
      }
      
      logToPersistentLog('info', '🔄 [SYNC-READ] Evento recibido', { eventType: event?.type || 'unknown', syncCount: syncEventCount });
      try {
        const stored = localStorage.getItem('carro');
        const parsed = stored ? JSON.parse(stored) : [];
        logToPersistentLog('info', '📥 [SYNC-READ] Items desde localStorage', { count: parsed.length, items: parsed.map((i: CartItem) => ({ id: i.id, qty: i.qty })) });
        
        // Prevenir loops infinitos: solo actualizar si realmente cambió
        setItems(prevItems => {
          const currentIds = prevItems.map(i => `${i.id}-${i.qty}`).sort().join(',');
          const newIds = parsed.map((i: CartItem) => `${i.id}-${i.qty}`).sort().join(',');
          
          if (currentIds !== newIds) {
            // ¡ALERTA! Si el carrito se vacía completamente
            if (prevItems.length > 0 && parsed.length === 0) {
              logToPersistentLog('error', '🚨 [BORRADO-DETECTADO] El carrito se ha vaciado completamente!', {
                teniaItems: prevItems.length,
                totalItemsAntes: prevItems.reduce((sum, item) => sum + item.qty, 0),
                itemsAntes: prevItems.map(i => ({ id: i.id, name: i.name, qty: i.qty })),
                quedanItems: parsed.length,
                eventType: event?.type || 'unknown'
              });
            }
            
            logToPersistentLog('warn', '🔄 [SYNC-READ] Cambio detectado, actualizando estado', { from: prevItems.length, to: parsed.length });
            return parsed;
          } else {
            logToPersistentLog('info', '⏹️ [SYNC-READ] Sin cambios, manteniendo estado actual');
            return prevItems;
          }
        });
        
        logToPersistentLog('info', '✅ [SYNC-READ] Sincronización completada');
      } catch (e) {
        logToPersistentLog('error', '❌ [SYNC-READ] Error en sync', e);
      }
    };
    window.addEventListener('carro:updated', sync as EventListener);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('carro:updated', sync as EventListener);
      window.removeEventListener('storage', sync);
    };
  }, []);

  // Agregar producto al carrito usando localStorage como fuente de verdad para evitar pisadas entre instancias
  function add(item: Omit<CartItem, 'qty'>) {
    logToPersistentLog('info', '🛒 Agregando al carrito', { id: item.id, name: item.name });

    let currentItems: CartItem[] = [];
    try {
      const stored = localStorage.getItem('carro');
      currentItems = stored ? JSON.parse(stored) : [];
      logToPersistentLog('info', '🔄 Carrito cargado (pre)', { items: currentItems.map(i => ({ id: i.id, qty: i.qty })) });
    } catch (error) {
      logToPersistentLog('error', 'Error leyendo carrito de localStorage', error);
      currentItems = [...items];
    }

    const found = currentItems.find(p => p.id === item.id);
    let updatedItems: CartItem[];
    if (found) {
      updatedItems = currentItems.map(p => p.id === item.id ? { ...p, qty: p.qty + 1 } : p);
      logToPersistentLog('info', '📈 Incrementando cantidad', { productId: item.id, newQty: found.qty + 1 });
    } else {
      updatedItems = [...currentItems, { ...item, qty: 1 }];
      logToPersistentLog('info', '🆕 Agregando nuevo producto', { productId: item.id });
    }

    try {
      localStorage.setItem('carro', JSON.stringify(updatedItems));
    } catch (e) {
      logToPersistentLog('error', 'Error guardando carrito en localStorage', e);
    }

    logToPersistentLog('info', '📦 Items después', { items: updatedItems.map(i => ({ id: i.id, name: i.name, qty: i.qty })) });
    setItems(updatedItems);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('carro:updated', {
        detail: { items: updatedItems, count: updatedItems.reduce((sum, it) => sum + it.qty, 0) }
      }));
    }

    return updatedItems;
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

  // Limpiar carrito
  function clear() { 
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

  return { 
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
}
