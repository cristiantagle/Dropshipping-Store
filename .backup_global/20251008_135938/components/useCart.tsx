'use client';
import { useState, useEffect } from "react";

export function useCart() {
  const [items, setItems] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem("carro") || "[]"); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("carro", JSON.stringify(items));
    window.dispatchEvent(new Event("carro:updated"));
  }, [items]);

  function add(item: any) {
    setItems(prev => {
      const found = prev.find(p => p.id === item.id);
      if (found) return prev.map(p => p.id === item.id ? { ...p, qty: (p.qty || 1) + 1 } : p);
      return [...prev, { ...item, qty: 1 }];
    });
  }
  function remove(id: string) { setItems(prev => prev.filter(p => p.id !== id)); }
  function clear() { setItems([]); }

  return { items, add, remove, clear };
}
