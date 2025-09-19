export type CategoriaSlug = "hogar" | "belleza" | "tecnologia" | "bienestar" | "eco" | "mascotas";

export interface Categoria {
  slug: CategoriaSlug;
  nombre: string;
  descripcion?: string;
}

export const CATEGORIAS: Record<CategoriaSlug, Categoria> = {
  hogar:      { slug: "hogar",      nombre: "Hogar",      descripcion: "Productos para el hogar" },
  belleza:    { slug: "belleza",    nombre: "Belleza",    descripcion: "Belleza y cuidado personal" },
  tecnologia: { slug: "tecnologia", nombre: "Tecnología", descripcion: "Gadgets y accesorios" },
  bienestar:  { slug: "bienestar",  nombre: "Bienestar",  descripcion: "Salud y fitness" },
  eco:        { slug: "eco",        nombre: "Eco",        descripcion: "Sustentables y reutilizables" },
  mascotas:   { slug: "mascotas",   nombre: "Mascotas",   descripcion: "Para tus mascotas" },
};

const alias: Array<[RegExp, CategoriaSlug]> = [
  // hogar
  [/hogar|casa|home|organiza|cocina|ba(?:n|ñ)o/i, "hogar"],
  // belleza
  [/belleza|maquillaje|cosm[ée]tica|skincare|cuidado personal/i, "belleza"],
  // tecnologia
  [/tecno|tecnolog|gadg|cable|usb|bluetooth|auricular|teclado|mouse/i, "tecnologia"],
  // bienestar
  [/bienestar|salud|fitness|gimnas|yoga|band[ao] el[áa]stic/i, "bienestar"],
  // eco
  [/eco|sustent|reutil|bambu|bamb[úu]/i, "eco"],
  // mascotas
  [/mascota|pet|perr|gat/i, "mascotas"],
];

function stripAccents(s: string) {
  return s.normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

export function normalizaCategoria(texto: string | undefined | null): CategoriaSlug | null {
  if (!texto) return null;
  const t = stripAccents(String(texto)).toLowerCase();
  // match directo por slug
  if ((["hogar","belleza","tecnologia","bienestar","eco","mascotas"] as const).includes(t as any)) {
    return t as CategoriaSlug;
  }
  for (const [re, slug] of alias) {
    if (re.test(t)) return slug;
  }
  return null;
}

export function getCategoriaBySlug(slug: string) {
  const s = normalizaCategoria(slug);
  return s ? CATEGORIAS[s] : null;
}

export function listCategorias() {
  return Object.values(CATEGORIAS);
}

export const ALL_SLUGS: CategoriaSlug[] = ["hogar","belleza","tecnologia","bienestar","eco","mascotas"];
