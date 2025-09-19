import { normalizaCategoria, type CategoriaSlug } from "./categorias";
import { productos as base } from "./products";

export interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  precio?: number;
  categoria: string; // texto libre de data original
  imagen: string;
  url?: string;
}

function perteneceACategoria(p: Producto, slug: CategoriaSlug) {
  const c1 = normalizaCategoria(p.categoria);
  const c2 = normalizaCategoria(p.nombre);
  const c3 = normalizaCategoria(p.descripcion);
  return c1 === slug || c2 === slug || c3 === slug;
}

// Si faltan, rellena con matches flojos por texto y luego con cualquiera del dataset (sin repetir)
export function getProductosByCategoria(slug: CategoriaSlug, max = 12): Producto[] {
  const primarios = base.filter((p) => perteneceACategoria(p as any, slug));

  let lista = primarios.slice(0, max);

  if (lista.length < max) {
    // matches flojos por inclusión del slug en categoria
    const flojos = base.filter((p) => String(p.categoria || "").toLowerCase().includes(slug));
    for (const p of flojos) {
      if (lista.length >= max) break;
      if (!lista.find(x => x.id === p.id)) lista.push(p);
    }
  }

  if (lista.length < max) {
    // relleno con cualquiera, preservando variedad y evitando duplicados
    for (const p of base) {
      if (lista.length >= max) break;
      if (!lista.find(x => x.id === p.id)) lista.push(p);
    }
  }

  return lista.slice(0, max);
}
