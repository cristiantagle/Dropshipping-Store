export type Categoria = {
  slug: "belleza" | "hogar" | "tecnologia" | "bienestar" | "eco" | "mascotas";
  nombre: "Belleza" | "Hogar" | "Tecnología" | "Bienestar" | "Eco" | "Mascotas";
};

export const CATEGORIAS: Categoria[] = [
  { slug: "belleza",    nombre: "Belleza" },
  { slug: "hogar",      nombre: "Hogar" },
  { slug: "tecnologia", nombre: "Tecnología" },
  { slug: "bienestar",  nombre: "Bienestar" },
  { slug: "eco",        nombre: "Eco" },
  { slug: "mascotas",   nombre: "Mascotas" },
];

export function normalizarCategoria(input: string | null | undefined): Categoria["slug"] | null {
  if (!input) return null;
  const s = input
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();

  const MAP: Record<string, Categoria["slug"]> = {
    "belleza": "belleza",
    "accesorios belleza": "belleza",
    "belleza (accesorios)": "belleza",
    "belleza & cuidado (accesorios)": "belleza",

    "hogar": "hogar",
    "casa": "hogar",
    "organizacion": "hogar",
    "organizadores": "hogar",

    "tecnologia": "tecnologia",
    "gadgets": "tecnologia",
    "electronica": "tecnologia",

    "bienestar": "bienestar",
    "salud": "bienestar",
    "fitness": "bienestar",

    "eco": "eco",
    "ecologico": "eco",
    "sustentable": "eco",

    "mascotas": "mascotas",
    "pet": "mascotas",
    "perros": "mascotas",
    "gatos": "mascotas",
  };

  if (MAP[s]) return MAP[s];

  const reglas: Array<[RegExp, Categoria["slug"]]> = [
    [/belleza|maquill|skincare|cosmet/i, "belleza"],
    [/hogar|organiza|closet|cocina|casa/i, "hogar"],
    [/tecno|electron|gadget|smart/i, "tecnologia"],
    [/bienestar|salud|relaj|masaje|fit/i, "bienestar"],
    [/eco|verde|sustent/i, "eco"],
    [/mascotas|perr|gat|pet/i, "mascotas"],
  ];
  for (const [re, slug] of reglas) {
    if (re.test(s)) return slug;
  }
  return null;
}

export function getCategoriaBySlug(slug: string): Categoria | null {
  return CATEGORIAS.find(c => c.slug === slug) ?? null;
}
