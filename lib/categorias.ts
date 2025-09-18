export type Slug = "belleza" | "hogar" | "tecnologia";
const mapa: Record<string, Slug> = {
  "belleza":"belleza","belleza & cuidado":"belleza","belleza y cuidado":"belleza",
  "accesorios belleza":"belleza","belleza (accesorios)":"belleza","belleza & cuidado (accesorios)":"belleza",
  "hogar":"hogar","hogar & organización":"hogar","hogar y organización":"hogar","organización":"hogar",
  "tecnologia":"tecnologia","tecnología":"tecnologia","accesorios tech":"tecnologia","tech":"tecnologia",
  "bienestar":"belleza","eco":"hogar","mascotas":"hogar"
};
export function normalizeCategoria(v?: string|null): Slug|null {
  if (!v) return null; return mapa[v.trim().toLowerCase()] ?? null;
}
