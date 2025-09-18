export type Slug = "belleza" | "hogar" | "tecnologia";

/**
 * Mapa de normalización: TODAS las claves ya en minúsculas.
 * Acepta variantes “de marketing” y las mapea a nuestros slugs canónicos.
 */
const mapa: Record<string, Slug> = {
  // Belleza
  "belleza": "belleza",
  "belleza & cuidado": "belleza",
  "belleza y cuidado": "belleza",
  "accesorios belleza": "belleza",
  "belleza (accesorios)": "belleza",
  "belleza & cuidado (accesorios)": "belleza",

  // Hogar
  "hogar": "hogar",
  "hogar & organización": "hogar",
  "hogar y organización": "hogar",
  "organización": "hogar",

  // Tecnología
  "tecnologia": "tecnologia",
  "tecnología": "tecnologia",
  "accesorios tech": "tecnologia",
  "tech": "tecnologia",

  // Extras mapeados
  "bienestar": "belleza",
  "eco": "hogar",
  "mascotas": "hogar"
};

export function normalizeCategoria(valor: string | null | undefined): Slug | null {
  if (!valor) return null;
  const key = valor.trim().toLowerCase();
  return mapa[key] ?? null;
}
