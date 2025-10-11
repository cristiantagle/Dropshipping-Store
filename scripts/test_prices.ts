// test_prices.ts
// Script para probar los precios calculados

import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const MARKUP = Number(process.env.NEXT_PUBLIC_MARKUP) || 1.3;

function formatPrice(cents: number) {
  const clp = cents / 100; // Convertir de centavos CLP a pesos CLP
  const finalPrice = clp * MARKUP;
  
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(finalPrice);
}

// Ejemplos de precios que vimos en la corrección
const examplePrices = [
  818900, // Women's Loose And Lazy Style Love Sweater Cardigan
  350600, // Small Night Lamp Glass Ball Small Ornaments Birthday Gift
  1260700, // Vintage Brown Lapel Men's Leather Overcoat Jacket
  208100, // Small Night Lamp Glass Ball Decoration Birthday Gift
  334400, // Personality Cloakroom Living Room Porch Light
];

console.log('🧮 Prueba de precios con la nueva lógica:');
console.log(`📊 Markup configurado: ${MARKUP} (${(MARKUP - 1) * 100}% ganancia)`);
console.log('');

examplePrices.forEach((priceCents, index) => {
  const formattedPrice = formatPrice(priceCents);
  console.log(`${index + 1}. Centavos almacenados: ${priceCents.toLocaleString()} → Precio final: ${formattedPrice}`);
});

console.log('');
console.log('💡 Los precios deberían estar ahora en un rango razonable de productos chilenos.');
console.log('💡 Si ves precios como $10.646 o $4.558, ¡está funcionando correctamente!');