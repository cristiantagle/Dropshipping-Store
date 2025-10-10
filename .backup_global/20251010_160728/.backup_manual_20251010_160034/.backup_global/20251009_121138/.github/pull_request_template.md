# Resumen
<!-- ¿Qué cambia y por qué? -->

## Tipo de cambio
- [ ] Fix (arreglo sin breaking)
- [ ] Feature (funcionalidad nueva)
- [ ] Refactor / DX
- [ ] Chore (build, deps, scripts)

## URL del Preview
<!-- Pega la URL del deployment de Vercel -->

## Riesgo / Impacto
<!-- Áreas afectadas y riesgos conocidos -->

## Plan de Rollback
<!-- ¿Cómo vuelvo a `stable/lunaria-ok` si algo falla? -->

---

## Checklist de Lunaria (NO merges sin esto)
**Categorías:** hogar, belleza, tecnologia, eco, mascotas, bienestar

- [ ] Se ven **12 tarjetas** por categoría (no 1, no 6).
- [ ] **Imágenes cargan** en todas las categorías.
- [ ] **Bienestar** muestra imágenes (sin placeholders amarillos).
- [ ] `components/ProductListClient.tsx` **no** fue modificado (o se justifica en el PR).
- [ ] `app/categorias/[slug]/page.tsx` mantiene el **slice/limit a 12**.
- [ ] `next.config.js` conserva `images.remotePatterns` y `unoptimized: true`.
- [ ] No se cambiaron nombres de columnas usadas por el front:
      `id, nombre, precio, imagen_url, envio, destacado, categoria_slug`.
- [ ] `/api/health` responde “ok” en el Preview.
- [ ] No hay errores en consola del navegador (Preview).
- [ ] Probado **deep-links** a cada categoría (sin 404).

## Notas de QA
<!-- Pasos de prueba manuales + capturas si aplica -->
