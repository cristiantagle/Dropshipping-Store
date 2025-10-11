// lib/translation.ts
// Servicio de traducción usando Ollama local

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Configuración del modelo
const TRANSLATION_MODEL = 'qwen2.5:7b';
const MAX_RETRIES = 3;
const TIMEOUT = 30000; // 30 segundos

export interface TranslationResult {
  success: boolean;
  translation?: string;
  error?: string;
  originalText?: string;
}

/**
 * Traduce un texto usando Ollama local
 */
export async function translateWithOllama(
  text: string,
  fromLang: string = 'en',
  toLang: string = 'es',
  context: string = 'ecommerce'
): Promise<TranslationResult> {
  
  if (!text.trim()) {
    return { success: false, error: 'Texto vacío' };
  }

  // Construir prompt especializado según el contexto
  const prompt = buildTranslationPrompt(text, fromLang, toLang, context);
  
  let lastError: string = '';
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`🔄 Intento ${attempt}/${MAX_RETRIES}: Traduciendo "${text.substring(0, 50)}..."`);
      
      const { stdout, stderr } = await execAsync(
        `ollama run ${TRANSLATION_MODEL} "${prompt}"`,
        { 
          timeout: TIMEOUT,
          encoding: 'utf8'
        }
      );

      if (stderr && !stderr.includes('no available memory')) {
        console.warn(`⚠️ Warning de Ollama: ${stderr}`);
      }

      const translation = cleanTranslationOutput(stdout);
      
      if (translation && translation.length > 0) {
        console.log(`✅ Traducción exitosa: "${translation}"`);
        return {
          success: true,
          translation,
          originalText: text
        };
      }

    } catch (error: any) {
      lastError = error.message || 'Error desconocido';
      console.error(`❌ Error en intento ${attempt}: ${lastError}`);
      
      // Esperar antes del siguiente intento
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  return {
    success: false,
    error: `Error después de ${MAX_RETRIES} intentos: ${lastError}`,
    originalText: text
  };
}

/**
 * Traduce múltiples textos de manera eficiente
 */
export async function translateBatch(
  texts: string[],
  fromLang: string = 'en',
  toLang: string = 'es',
  context: string = 'ecommerce'
): Promise<TranslationResult[]> {
  
  const results: TranslationResult[] = [];
  const batchSize = 5; // Traducir de 5 en 5 para no saturar

  console.log(`🚀 Iniciando traducción en lotes de ${texts.length} textos`);

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    
    console.log(`📦 Procesando lote ${Math.floor(i/batchSize) + 1}/${Math.ceil(texts.length/batchSize)}`);
    
    const batchPromises = batch.map(text => 
      translateWithOllama(text, fromLang, toLang, context)
    );

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Pequeña pausa entre lotes
    if (i + batchSize < texts.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  const successCount = results.filter(r => r.success).length;
  console.log(`✅ Traducción completada: ${successCount}/${texts.length} exitosas`);

  return results;
}

/**
 * Construye el prompt de traducción según el contexto
 */
function buildTranslationPrompt(text: string, fromLang: string, toLang: string, context: string): string {
  const contextInstructions: Record<string, string> = {
    'ecommerce': 'para una tienda online, manteniendo un tono comercial atractivo',
    'product_name': 'como nombre de producto para una tienda, debe sonar atractivo y comercial',
    'product_description': 'como descripción de producto, enfocándose en beneficios y características',
    'category': 'como nombre de categoría de tienda',
    'general': 'de manera natural y profesional'
  };

  const instruction = contextInstructions[context] || contextInstructions['general'];
  const langNames: Record<string, string> = {
    'en': 'inglés', 'es': 'español', 'fr': 'francés', 'pt': 'portugués'
  };

  return `Traduce este texto de ${langNames[fromLang] || fromLang} a ${langNames[toLang] || toLang} ${instruction}:

"${text}"

INSTRUCCIONES:
- Responde SOLO con la traducción, sin comillas ni explicaciones
- Mantén el significado original pero adáptalo al español latinoamericano
- Si es nombre de producto, hazlo atractivo para compradores
- No traduzcas marcas o nombres propios conocidos
- Usa lenguaje natural y fluido

Traducción:`;
}

/**
 * Limpia la salida de Ollama removiendo texto innecesario
 */
function cleanTranslationOutput(output: string): string {
  return output
    .trim()
    .replace(/^["']/, '')  // Remove opening quotes
    .replace(/["']$/, '')  // Remove closing quotes
    .replace(/^Traducción:\s*/i, '')  // Remove "Traducción:" prefix
    .replace(/^Translation:\s*/i, '') // Remove "Translation:" prefix
    .split('\n')[0]  // Take only first line
    .trim();
}

/**
 * Verifica si Ollama está disponible y el modelo está instalado
 */
export async function checkOllamaSetup(): Promise<{available: boolean, model: boolean, error?: string}> {
  try {
    // Verificar Ollama
    await execAsync('ollama --version');
    
    // Verificar modelo
    const { stdout } = await execAsync('ollama list');
    const modelInstalled = stdout.includes(TRANSLATION_MODEL);
    
    if (!modelInstalled) {
      return {
        available: true,
        model: false,
        error: `Modelo ${TRANSLATION_MODEL} no instalado. Ejecuta: ollama pull ${TRANSLATION_MODEL}`
      };
    }

    return { available: true, model: true };
    
  } catch (error: any) {
    return {
      available: false,
      model: false,
      error: `Ollama no está disponible: ${error.message}`
    };
  }
}