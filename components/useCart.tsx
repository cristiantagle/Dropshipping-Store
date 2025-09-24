import { Producto } from "@/lib/products";

export function getCart(): Producto[] {
  try {
    return JSON.parse(localStorage.getItem("carro") || "[]");
  } catch {
    return [];
  }
}

export function addToCart(producto: Producto) {
  const items = getCart();
  const exists = items.some((p) => p.id === producto.id);
  if (!exists) {
    items.push(producto);
    localStorage.setItem("carro", JSON.stringify(items));
    window.dispatchEvent(new Event("carro:updated"));
  }
}

export function removeFromCart(id: string) {
  const items = getCart().filter((p) => p.id !== id);
  localStorage.setItem("carro", JSON.stringify(items));
  window.dispatchEvent(new Event("carro:updated"));
}
