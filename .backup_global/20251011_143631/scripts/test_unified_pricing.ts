// test_unified_pricing.ts
// Script para verificar que el formateo esté unificado

import * as dotenv from 'dotenv';
import { formatPrice, formatTotal } from '../lib/formatPrice';

// Cargar variables de entorno
dotenv.config();

console.log('🔧 Probando función centralizada de formateo de precios');
console.log('');

// Ejemplo de productos con precios reales de la BD
const testProducts = [
  { name: "Suéter de mujer", price_cents: 818900 },
  { name: "Lámpara decorativa", price_cents: 350600 },
  { name: "Abrigo de cuero", price_cents: 1260700 },
  { name: "Lámpara pequeña", price_cents: 208100 },
  { name: "Lámpara de vestíbulo", price_cents: 334400 },
];

console.log('📋 Precios individuales:');
testProducts.forEach((product, index) => {
  const formattedPrice = formatPrice(product.price_cents);
  console.log(`${index + 1}. ${product.name}: ${formattedPrice}`);
});

console.log('');
console.log('🛒 Prueba de carrito con múltiples productos:');
const cartItems = [
  { price_cents: 818900, quantity: 2 },
  { price_cents: 350600, quantity: 1 },
  { price_cents: 208100, quantity: 3 }
];

const cartTotal = formatTotal(cartItems);
console.log(`Total del carrito: ${cartTotal}`);

console.log('');
console.log('✅ Si todos los precios están en rangos normales ($2.000 - $20.000), la corrección funciona!');
console.log('✅ Los precios deben ser consistentes en toda la aplicación.');