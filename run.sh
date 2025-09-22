#!/usr/bin/env bash
set -euo pipefail

BR="preview/restore-backbtn-$(date +%Y%m%d-%H%M%S)"
echo "🔧 Restaurando botón Volver (BackNav) sin romper nada…"
echo "🌱 Rama: $BR"

git fetch origin --prune
git checkout -B "$BR" origin/main || git checkout -b "$BR"

mkdir -p components
cat > components/BackNav.tsx <<'TSX'
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BackNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [canGoBack, setCanGoBack] = useState(false);

  if (pathname === '/') return null;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCanGoBack(window.history.length > 1);
    }
  }, [pathname]);

  const onClick = () => {
    if (canGoBack) router.back();
    else router.push('/categorias');
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Volver"
      className="fixed top-20 left-4 z-[60] inline-flex items-center gap-2 rounded-full bg-lime-600 text-white px-4 py-2 shadow-lg hover:bg-lime-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/60"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="-ml-1">
        <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="hidden sm:inline">Volver</span>
    </button>
  );
}
TSX

LAYOUT="app/layout.tsx"
if [ ! -f "$LAYOUT" ]; then
  echo "❌ No encuentro $LAYOUT"
  exit 1
fi

python3 - <<'PY'
from pathlib import Path
p = Path("app/layout.tsx")
src = p.read_text(encoding="utf-8")

# 1) Import BackNav tras import "./globals.css";
if 'BackNav' not in src:
    lines = src.splitlines()
    out = []
    inserted_import = False
    for i, line in enumerate(lines):
        out.append(line)
        if not inserted_import and line.strip() == 'import "./globals.css";':
            out.append('import BackNav from "@/components/BackNav";')
            inserted_import = True
    if not inserted_import:
        # fallback: al inicio después de la primera línea de imports
        out.insert(1, 'import BackNav from "@/components/BackNav";')
    src = "\n".join(out)

# 2) Insertar <BackNav /> antes de </body>
if '<BackNav />' not in src:
    idx = src.rfind("</body>")
    if idx != -1:
        src = src[:idx] + "  <BackNav />\n" + src[idx:]
    else:
        src = src + "\n  <BackNav />\n"

Path("app/layout.tsx").write_text(src, encoding="utf-8")
PY

git add -A
git commit -m "feat(ui): BackNav global (botón Volver flotante; no interfiere con FloatingCart)"
git push -u origin "$BR"

echo "✅ Preview listo en Vercel para $BR"
echo "👉 Revisa. Cuando digas “LUNARIA OK”, te paso el script de merge a main."
