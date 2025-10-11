// lib/formatPrice.ts
// Función centralizada para formatear precios en toda la aplicación

/**
 * Formatea un precio desde centavos CLP a formato de moneda chilena con markup
 * @param cents - Precio en centavos de CLP (como se almacena en la BD)
 * @returns Precio formateado como string con formato de moneda chilena
 */
export function formatPrice(cents: number): string {
  const MARKUP = Number(process.env.NEXT_PUBLIC_MARKUP) || 1.3;
  
  // Convertir de centavos CLP a pesos CLP y aplicar markup
  const clp = cents / 100;
  const finalPrice = clp * MARKUP;
  
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(finalPrice);
}

/**
 * Calcula el precio base en pesos chilenos (sin markup) para mostrar descuentos
 * @param cents - Precio en centavos de CLP
 * @returns Precio base formateado
 */
export function formatBasePrice(cents: number): string {
  const clp = cents / 100;
  
  return new Intl.NumberFormat("es-CL", {
    style: "currency", 
    currency: "CLP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(clp);
}

/**
 * Calcula el total de múltiples productos
 * @param items - Array de objetos con price_cents y quantity
 * @returns Total formateado
 */
export function formatTotal(items: Array<{ price_cents: number; quantity: number }>): string {
  const totalCents = items.reduce((sum, item) => sum + (item.price_cents * item.quantity), 0);
  return formatPrice(totalCents);
}