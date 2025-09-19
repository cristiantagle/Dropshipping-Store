export type CategoriaSlug = "hogar"|"belleza"|"tecnologia"|"bienestar"|"eco"|"mascotas";
export interface Categoria{ slug:CategoriaSlug; nombre:string; descripcion?:string; cover_url?:string; }
export interface Producto{
  id:string; nombre:string; precio:number;
  imagen_url:string|null; categoria_slug:CategoriaSlug; descripcion?:string|null;
}
export const isCategoriaSlug = (s:string): s is CategoriaSlug =>
  ["hogar","belleza","tecnologia","bienestar","eco","mascotas"].includes(s);
export const CATEGORIAS:Categoria[]=[
  {slug:"hogar",nombre:"Hogar",descripcion:"Todo para tu casa"},
  {slug:"belleza",nombre:"Belleza",descripcion:"Cuidado personal"},
  {slug:"tecnologia",nombre:"Tecnología",descripcion:"Gadgets y más"},
  {slug:"bienestar",nombre:"Bienestar",descripcion:"Salud y fitness"},
  {slug:"eco",nombre:"Eco",descripcion:"Sustentable"},
  {slug:"mascotas",nombre:"Mascotas",descripcion:"Amigos peludos"},
];
