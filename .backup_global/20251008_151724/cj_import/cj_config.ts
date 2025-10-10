// cj_config.ts

// Base URL correcta de API 2.0
export const CJ_BASE_URL = "https://developers.cjdropshipping.com/api2.0/v1";

// Token de acceso CJ
export const CJ_ACCESS_TOKEN = process.env.CJ_ACCESS_TOKEN || "";

// Mapeo de categorías CJ a tus slugs reales
export const CATEGORY_MAP: Record<string, string> = {
  // 🧴 Belleza
  "beauty": "belleza",
  "makeup": "belleza",
  "skincare": "belleza",
  "hair care": "belleza",
  "jewelry": "belleza",
  "bracelets & bangles": "belleza",
  "rings": "belleza",
  "necklaces": "belleza",
  "earrings": "belleza",
  "watches": "belleza",
  "nail art": "belleza",
  "cosmetics": "belleza",

  // 💆 Bienestar
  "facial steamer": "bienestar",
  "massage": "bienestar",
  "health care": "bienestar",
  "fitness": "bienestar",
  "yoga": "bienestar",
  "personal care": "bienestar",
  "sports": "bienestar",
  "outdoor fitness": "bienestar",

  // 🌱 Eco
  "eco-friendly": "eco",
  "sustainable": "eco",
  "reusable": "eco",
  "green products": "eco",
  "environmental": "eco",

  // 🏠 Hogar
  "home office storage": "hogar",
  "night lights": "hogar",
  "lighting": "hogar",
  "kitchen": "hogar",
  "bathroom": "hogar",
  "furniture": "hogar",
  "home decor": "hogar",
  "storage": "hogar",
  "garden": "hogar",
  "holiday decoration": "hogar",
  "party supplies": "hogar",
  "men's backpacks": "hogar",
  "bags": "hogar",
  "shoes": "hogar",
  "clothing": "hogar",
  "girl dresses": "hogar",
  "men's ties": "hogar",
  "office supplies": "hogar",
  "stationery": "hogar",
  "print": "hogar", // 👈 añadido para cubrir categoría "Print" que vimos en CJ

  // 🐾 Mascotas
  "pet supplies": "mascotas",
  "dog accessories": "mascotas",
  "cat accessories": "mascotas",
  "pet clothing": "mascotas",
  "pet toys": "mascotas",
  "pet beds": "mascotas",
  "pet grooming": "mascotas",

  // 💻 Tecnología
  "electronics": "tecnologia",
  "gadgets": "tecnologia",
  "smart home": "tecnologia",
  "wearable devices": "tecnologia",
  "headphones": "tecnologia",
  "chargers": "tecnologia",
  "computers": "tecnologia",
  "phones": "tecnologia",
  "tablets": "tecnologia",
  "cameras": "tecnologia",
  "drones": "tecnologia",
  "car electronics": "tecnologia",

  // Fallback
  "": "otros"
};

// Función auxiliar para normalizar categorías
export function mapCategory(cjCategory: string | null): string {
  if (!cjCategory) return "otros";
  const key = cjCategory.trim().toLowerCase();
  return CATEGORY_MAP[key] || "otros";
}