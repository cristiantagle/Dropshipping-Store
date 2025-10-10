// cj_transform.ts
// Transforma productos crudos de CJ en filas listas para Supabase

import { mapCategory } from "./cj_config";

// 👇 tasa de conversión configurable desde .env
const USD_TO_CLP = parseFloat(process.env.USD_TO_CLP || "950");

export interface CJRawProduct {
  pid: string;
  productNameEn: string;
  productSku: string;
  productImage: string;
  sellPrice: string;
  categoryName: string | null;
}

export interface ProductRow {
  cj_id: string;
  name: string;        // nombre original en inglés
  name_es: string;     // 👈 nuevo: nombre traducido
  productsku: string;
  image_url: string;
  price_cents: number; // precio convertido a CLP
  category_slug: string;
}

// 👇 función simple de traducción (puedes mejorarla con API externa)
function translateNameToSpanish(name: string): string {
  // Diccionario básico de palabras frecuentes
  const dictionary: Record<string, string> = {
    "Household": "Hogar",
    "Desk": "Escritorio",
    "Lamp": "Lámpara",
    "Bag": "Bolso",
    "Dress": "Vestido",
    "Ring": "Anillo",
    "Bracelet": "Pulsera",
    "Pearl": "Perla",
    "Christmas": "Navidad",
    "Girls": "Niñas",
    "Men's": "Hombres",
    "Women's": "Mujeres",
    "Outdoor": "Exterior",
    "Fashion": "Moda",
    "New": "Nuevo",
  };

  let translated = name;
  for (const [en, es] of Object.entries(dictionary)) {
    const regex = new RegExp(`\\b${en}\\b`, "gi");
    translated = translated.replace(regex, es);
  }

  return translated;
}

export function transformCJProduct(raw: CJRawProduct): ProductRow {
  const usdPrice = parseFloat(raw.sellPrice);
  const clpPrice = usdPrice * USD_TO_CLP;

  return {
    cj_id: raw.pid,
    name: raw.productNameEn, // original en inglés
    name_es: translateNameToSpanish(raw.productNameEn), // traducido
    productsku: raw.productSku,
    image_url: raw.productImage,
    price_cents: Math.round(clpPrice), // guardamos en CLP
    category_slug: mapCategory(raw.categoryName),
  };
}