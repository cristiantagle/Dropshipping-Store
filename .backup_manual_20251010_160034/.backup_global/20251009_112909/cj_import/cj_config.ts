// cj_config.ts
// Configuración de categorías y funciones de mapeo

// Diccionario de categorías finales
export const CATEGORY_MAP: Record<string, string> = {
  "hogar": "hogar",
  "belleza": "belleza",
  "bienestar": "bienestar",
  "ecologia": "eco",
  "eco": "eco",
  "mascotas": "mascotas",
  "tecnologia": "tecnologia",
  "ropa_hombre": "ropa_hombre",
  "ropa_mujer": "ropa_mujer",
  "accesorios": "accesorios",
  "otros": "otros",
};

// Diccionario extenso de palabras clave
export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  hogar: [
    "house", "home", "kitchen", "cook", "pan", "pot", "knife", "fork", "spoon",
    "plate", "bowl", "cup", "glass", "mug", "furniture", "chair", "table",
    "sofa", "bed", "pillow", "blanket", "sheet", "curtain", "lamp", "light",
    "bulb", "storage", "organizer", "cleaning", "broom", "mop", "vacuum",
    "bath", "toilet", "shower", "towel", "mirror", "decoration", "candle",
    "frame", "rug", "carpet", "mat", "shelf", "drawer", "closet"
  ],
  belleza: [
    "beauty", "makeup", "cosmetic", "lipstick", "lip gloss", "foundation",
    "concealer", "powder", "blush", "eyeshadow", "mascara", "eyeliner",
    "nail", "polish", "manicure", "pedicure", "skincare", "cream", "lotion",
    "serum", "toner", "cleanser", "mask", "perfume", "fragrance", "shampoo",
    "conditioner", "hair", "wig", "extension", "comb", "brush", "mirror",
    "spa", "facial", "gel", "oil", "sunscreen"
  ],
  bienestar: [
    "wellness", "health", "fitness", "yoga", "pilates", "exercise", "gym",
    "workout", "training", "dumbbell", "barbell", "weight", "resistance band",
    "mat", "massage", "therapy", "relax", "meditation", "mindfulness",
    "supplement", "vitamin", "protein", "herbal", "essential oil", "aromatherapy",
    "first aid", "bandage", "brace", "support", "posture", "sleep", "rest"
  ],
  eco: [
    "eco", "ecology", "sustainable", "sustainability", "reusable", "recycle",
    "recycled", "biodegradable", "compostable", "organic", "bamboo", "wooden",
    "cotton", "linen", "hemp", "solar", "renewable", "green", "environment",
    "zero waste", "plastic free", "eco-friendly", "natural", "handmade",
    "fair trade", "vegan", "non-toxic"
  ],
  mascotas: [
    "pet", "dog", "cat", "puppy", "kitten", "hamster", "rabbit", "bird",
    "parrot", "fish", "aquarium", "reptile", "turtle", "snake", "lizard",
    "leash", "collar", "harness", "toy", "bone", "treat", "food", "bowl",
    "kennel", "bed", "scratcher", "litter", "grooming", "shampoo", "brush",
    "claw", "nail", "carrier", "cage"
  ],
  tecnologia: [
    "tech", "technology", "gadget", "device", "smart", "phone", "iphone",
    "android", "tablet", "laptop", "notebook", "computer", "pc", "desktop",
    "monitor", "keyboard", "mouse", "usb", "cable", "charger", "adapter",
    "battery", "power bank", "earphone", "headphone", "speaker", "bluetooth",
    "wireless", "camera", "webcam", "microphone", "drone", "watch", "smartwatch",
    "console", "gaming", "controller", "vr", "projector", "printer", "scanner"
  ],
  ropa_hombre: [
    "men", "male", "jacket", "blazer", "suit", "shirt", "sweater", "hoodie",
    "trousers", "pants", "jeans", "coat", "parka", "vest", "shorts"
  ],
  ropa_mujer: [
    "women", "woman", "lady", "dress", "skirt", "blouse", "top", "camisole",
    "leggings", "romper", "gown", "sweater", "hoodie", "trench", "vest"
  ],
  accesorios: [
    "earring", "necklace", "pendant", "ring", "jewelry", "bracelet", "watch",
    "backpack", "bag", "purse", "handbag", "wallet", "belt", "cap", "hat",
    "scarf", "glove", "shoe", "sandal", "boot", "flat", "pump", "sneaker"
  ],
};

// Función de clasificación por palabras clave
export function guessCategory(text: string): string {
  const lower = text.toLowerCase();

  for (const [slug, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        return slug;
      }
    }
  }

  return "otros"; // fallback final
}

// Función principal de mapeo
export function mapCategory(cjCategory: string | null, productName?: string): string {
  if (cjCategory) {
    const key = cjCategory.trim().toLowerCase();
    if (CATEGORY_MAP[key]) {
      return CATEGORY_MAP[key];
    }
    return guessCategory(key);
  }

  if (productName) {
    return guessCategory(productName);
  }

  return "otros";
}