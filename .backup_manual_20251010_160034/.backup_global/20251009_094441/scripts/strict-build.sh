#!/usr/bin/env bash
set -euo pipefail
echo "📦 Instalando dependencias limpias..."
npm ci
echo "🏗️  Compilando con reglas de Vercel..."
npm run build
