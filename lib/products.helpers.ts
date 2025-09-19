import { normalizaCategoria, type CategoriaSlug } from "./categorias";
import { productos as base } from "./products";

type AnyProduct = typeof base[number];

function matchCategoria(p: AnyProduct, slug: CategoriaSlug) {
  const cat = String((p as any)?.categoria ?? "");
  const nom = String((p as any)?.nombre ?? "");
  return normalizaCategoria(cat) === slug || normalizaCategoria(nom) === slug;
}

export function getProductosByCategoria(slug: CategoriaSlug, max = 12): AnyProduct[] {
  const uniq = new Map<string, AnyProduct>();

  // Fuerte por categoría normalizada
  for (const p of base) {
    if (matchCategoria(p, slug)) {
      const id = (p as any).id ?? `${(p as any).nombre}-${uniq.size}`;
      if (!uniq.has(id)) uniq.set(id, p);
      if (uniq.size >= max) break;
    }
  }

  // Débil por inclusión (sin depender de 'descripcion')
  if (uniq.size < max) {
    const s = String(slug).toLowerCase();
    for (const p of base) {
      const blob = `${String((p as any)?.categoria ?? "").toLowerCase()} ${String((p as any)?.nombre ?? "").toLowerCase()}`;
      const id = (p as any).id ?? `${(p as any).nombre}-${uniq.size}`;
      if (blob.includes(s) && !uniq.has(id)) {
        uniq.set(id, p);
        if (uniq.size >= max) break;
      }
    }
  }

  // Relleno sin repetir
  if (uniq.size < max) {
    for (const p of base) {
      const id = (p as any).id ?? `${(p as any).nombre}-${uniq.size}`;
      if (!uniq.has(id)) {
        uniq.set(id, p);
        if (uniq.size >= max) break;
      }
    }
  }

  // Repetición cíclica si el dataset es corto
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
