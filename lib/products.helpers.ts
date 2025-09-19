import { normalizaCategoria, type CategoriaSlug } from "./categorias";
import { productos as base } from "./products";

export interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  precio?: number;
  categoria: string;
  imagen: string;
  url?: string;
}

function perteneceACategoria(p: Producto, slug: CategoriaSlug) {
  const c1 = normalizaCategoria(p.categoria);
  const c2 = normalizaCategoria(p.nombre);
  const c3 = normalizaCategoria(p.descripcion);
  return c1 === slug || c2 === slug || c3 === slug;
}

/**
 * Regresa exactamente `max` items:
 * 1) matches estrictos/normalizados
 * 2) matches flojos por inclusión del slug en el texto de categoría/nombre/desc
 * 3) relleno con cualquier producto del dataset sin repetir
 * 4) si aún faltan (dataset pequeño), permite repetir cíclicamente
 */
export function getProductosByCategoria(slug: CategoriaSlug, max = 12): Producto[] {
  const uniq = new Map<string, Producto>();

  // 1) matches robustos
  for (const p of base) {
    if (perteneceACategoria(p as any, slug)) {
      if (!uniq.has(p.id)) uniq.set(p.id, p as any);
      if (uniq.size >= max) break;
    }
  }

  // 2) matches flojos por inclusión de texto
  if (uniq.size < max) {
    const s = String(slug).toLowerCase();
    for (const p of base) {
      const blob = `${p.categoria ?? ""} ${p.nombre ?? ""} ${p.descripcion ?? ""}`.toLowerCase();
      if (blob.includes(s) && !uniq.has(p.id)) {
        uniq.set(p.id, p as any);
        if (uniq.size >= max) break;
      }
    }
  }

  // 3) relleno sin repetir
  if (uniq.size < max) {
    for (const p of base) {
      if (!uniq.has(p.id)) {
        uniq.set(p.id, p as any);
        if (uniq.size >= max) break;
      }
    }
  }

  // 4) si el dataset es pequeño, repetimos cíclicamente para llegar a max
  let arr = Array.from(uniq.values());
  if (arr.length < max && arr.length > 0) {
    let i = 0;
    while (arr.length < max) {
      arr.push(arr[i % uniq.size]);
      i++;
    }
  }

  return arr.slice(0, max);
}
