import { normalizaCategoria, type CategoriaSlug } from "./categorias";
import { productos as base } from "./products";

/** Derivo el tipo directamente del dataset para evitar desalineaciones */
type AnyProduct = typeof base[number];

function perteneceACategoria(p: AnyProduct, slug: CategoriaSlug) {
  const cat = (p as any)?.categoria ?? "";
  const nombre = (p as any)?.nombre ?? "";
  const c1 = normalizaCategoria(cat);
  const c2 = normalizaCategoria(nombre);
  return c1 === slug || c2 === slug;
}

/** Retorna exactamente `max` items por categoría (rellena si faltan) */
export function getProductosByCategoria(slug: CategoriaSlug, max = 12): AnyProduct[] {
  const uniq = new Map<string, AnyProduct>();

  // 1) matches fuertes
  for (const p of base) {
    if (perteneceACategoria(p, slug)) {
      const id = (p as any).id ?? `${(p as any).nombre}-${uniq.size}`;
      if (!uniq.has(id)) uniq.set(id, p);
      if (uniq.size >= max) break;
    }
  }

  // 2) matches flojos por inclusión (sin usar descripcion para evitar TS)
  if (uniq.size < max) {
    const s = String(slug).toLowerCase();
    for (const p of base) {
      const cat = String((p as any)?.categoria ?? "").toLowerCase();
      const nom = String((p as any)?.nombre ?? "").toLowerCase();
      const blob = `${cat} ${nom}`;
      const id = (p as any).id ?? `${(p as any).nombre}-${uniq.size}`;
      if (blob.includes(s) && !uniq.has(id)) {
        uniq.set(id, p);
        if (uniq.size >= max) break;
      }
    }
  }

  // 3) relleno sin repetir
  if (uniq.size < max) {
    for (const p of base) {
      const id = (p as any).id ?? `${(p as any).nombre}-${uniq.size}`;
      if (!uniq.has(id)) {
        uniq.set(id, p);
        if (uniq.size >= max) break;
      }
    }
  }

  // 4) si el dataset es corto, repetir cíclicamente
  let arr = Array.from(uniq.values());
  if (arr.length < max && arr.length > 0) {
    let i = 0;
    while (arr.length < max) {
      arr.push(arr[i % arr.length]);
      i++;
    }
  }
  return arr.slice(0, max);
}
