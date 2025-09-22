import fs from 'fs';

const path = 'components/FloatingCart.tsx';
if (!fs.existsSync(path)) {
  console.log('ℹ️  No existe components/FloatingCart.tsx — nada que ocultar.');
  process.exit(0);
}

let src = fs.readFileSync(path, 'utf8');
let changed = false;

// 1) Si hay un flag típico, lo forzamos a false
if (src.includes('showBadge')) {
  const before = src;
  src = src.replace(/const\s+showBadge\s*=\s*true/g, 'const showBadge = false');
  if (src !== before) changed = true;
}

// 2) Remover un patrón común: {count > 0 && ( ... )}
{
  const before = src;
  const re = /\{\s*count\s*>\s*0\s*&&\s*\([\s\S]*?\)\s*\}/g;
  src = src.replace(re, ''); // quitamos el bloque JSX del badge
  if (src !== before) changed = true;
}

// 3) Como fallback, ocultar un div "posible badge" (pequeño, redondo) cerca de la esquina inferior derecha
// Buscamos un div con className que incluya "rounded-full" y "fixed" / "absolute" y conteo dentro.
if (!changed) {
  const before = src;
  // Heurística: reemplazar la clase del posible badge por 'hidden'
  src = src.replace(
    /(className\s*=\s*{?["'`][^"'`]*)(rounded-full[^"'`]*)(["'`]}?)/g,
    (_m, p1, _round, p3) => `${p1}hidden${p3}`
  );
  if (src !== before) changed = true;
}

if (changed) {
  fs.writeFileSync(path, src, 'utf8');
  console.log('✅ Burbuja interna del FloatingCart oculta/eliminada.');
} else {
  console.log('ℹ️  No se detectó un patrón claro del badge; no se hicieron cambios.');
}
