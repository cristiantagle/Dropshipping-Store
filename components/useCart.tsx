"use client";
import { useState } from "react";
import { toast } from "./Toast";

export function useCart() {
  const [items, setItems] = useState<any[]>([]);

  const addItem = (item: any) => {
    setItems((prev) => [...prev, item]);
    toast("Producto agregado al carrito 🛒");
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast("Producto eliminado del carrito");
  };

  return { items, addItem, removeItem };
}
