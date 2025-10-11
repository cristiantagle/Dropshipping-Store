# setup_translation_model.ps1
# Script para instalar el modelo de traducción recomendado

Write-Host "🚀 Configurando modelo de traducción con Ollama..." -ForegroundColor Green
Write-Host ""

# Verificar si Ollama está instalado
try {
    $ollamaVersion = ollama --version
    Write-Host "✅ Ollama detectado: $ollamaVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Ollama no está instalado. Instalalo desde: https://ollama.ai" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Instalando modelo recomendado para traducción..." -ForegroundColor Yellow
Write-Host "Modelo: qwen2.5:7b (Excelente para traducción ES-EN)" -ForegroundColor Cyan

# Instalar el modelo
ollama pull qwen2.5:7b

Write-Host ""
Write-Host "🧪 Probando el modelo con una traducción de ejemplo..." -ForegroundColor Yellow

# Probar traducción
$testPrompt = @"
Traduce este texto de inglés a español de manera natural y profesional para una tienda online:

"Women's Loose And Lazy Style Love Sweater Cardigan"

Responde solo con la traducción, sin explicaciones.
"@

$translation = ollama run qwen2.5:7b $testPrompt

Write-Host ""
Write-Host "📝 Resultado de prueba:" -ForegroundColor Green
Write-Host $translation -ForegroundColor White

Write-Host ""
Write-Host "✅ ¡Modelo configurado correctamente!" -ForegroundColor Green
Write-Host "Puedes usar 'ollama run qwen2.5:7b' para traducir manualmente" -ForegroundColor Cyan