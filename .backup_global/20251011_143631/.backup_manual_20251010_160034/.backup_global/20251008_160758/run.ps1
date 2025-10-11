# run.ps1
# Script para automatizar build, commit, push y deploy en Vercel desde PowerShell

Write-Host "🚀 Iniciando consolidación de cambios en main..."

# --- Validar build antes de nada ---
Write-Host "🧪 Validando build local..."
$build = npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build falló. No se hará commit ni push."
    exit 1
}

# --- Detectar rama actual ---
$currentBranch = git rev-parse --abbrev-ref HEAD

# --- Agregar todos los cambios ---
git add -A

# --- Commit atómico ---
git commit -m "chore: consolidación automática desde run.ps1"
if ($LASTEXITCODE -ne 0) {
    Write-Host "ℹ️ No había cambios nuevos para commitear."
}

# --- Si no estamos en main, mergear ---
if ($currentBranch -ne "main") {
    Write-Host "🔀 Estás en $currentBranch, integrando en main..."
    git checkout main
    git pull origin main
    git merge $currentBranch --no-ff -m "merge($currentBranch): integrar cambios desde run.ps1"
}

# --- Push final ---
Write-Host "⬆️  Subiendo cambios a GitHub..."
git push origin main

# --- Deploy a producción en Vercel ---
Write-Host "🌍 Desplegando en Vercel (producción)..."
vercel --prod --confirm

Write-Host "✅ Consolidación completada. main actualizado y desplegado en producción."