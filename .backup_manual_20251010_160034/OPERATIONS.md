# OPERATIONS.md

## 1. Reglas de Oro
- Backup antes de todo: ningún cambio sin snapshot en .backup_global/.
- Restauración confiable en Windows: scripts/restore_global.sh debe usar cp -r, nunca rsync.
- Cambios incrementales y reversibles: todo debe poder deshacerse con un solo comando.
- Consistencia en imports:
  - En Next.js (frontend): sin .ts en imports.
  - En scripts (cj_import/, scripts/): ejecutados con ts-node -P <carpeta>/tsconfig.json.
- Variables de entorno: siempre con fallback seguro:
    const token = (process.env.CJ_ACCESS_TOKEN ?? "").trim();
    if (!token) throw new Error("CJ_ACCESS_TOKEN no está definido");
- No modificar el repo entero: los cambios se limitan a la carpeta correspondiente.
- Comunicación clara y copy-paste-ready: nada ambiguo, todo debe poder pegarse y correr.

---

## 2. Flujo de Trabajo Estándar
1. Backup
    bash scripts/backup.sh
2. Patch (correcciones puntuales en imports, variables, etc.).
3. Dump de verificación
    bash scripts/dump.sh <archivo>
4. Build estricto
    npm run build
   - Si falla → restaurar snapshot más reciente.
5. Dev server
    npm run dev
6. Restauración manual
    cp -r .backup_global/<timestamp>/* .

---

## 3. Problemas y Soluciones Documentadas

### a) Imports con .ts
- Problema: Next.js no permite .ts en imports (el tsconfig.json global no tiene allowImportingTsExtensions).
- Solución: normalizar todos los imports en cj_import/ sin .ts.
- Ejecución de scripts:
    ts-node -P cj_import/tsconfig.json archivo.ts

### b) CJ_ACCESS_TOKEN
- Problema: CJ_ACCESS_TOKEN.trim() → “posiblemente undefined”.
- Solución:
    const token = (process.env.CJ_ACCESS_TOKEN ?? "").trim();
    if (!token) throw new Error("CJ_ACCESS_TOKEN no está definido en .env");

### c) Restauración rota (rsync no disponible)
- Problema: rsync no existe en Windows/Git Bash.
- Solución: restore_global.sh final:
    #!/usr/bin/env bash
    set -euo pipefail

    SNAP=$1
    if [ -z "${SNAP:-}" ]; then
      echo "Uso: $0 <timestamp>"
      exit 1
    fi

    echo "Restaurando desde .backup_global/$SNAP..."
    cp -r .backup_global/$SNAP/* .
    echo "Restauración completada."

### d) Errores de sintaxis en run.sh
- Problema: emojis/paréntesis + encoding UTF-8 con BOM.
- Solución: simplificar echo y guardar como UTF-8 sin BOM.
    #!/usr/bin/env bash
    set -euo pipefail

    echo "Run auxiliar: normalizar imports en cj_import sin .ts"

---

## 4. Decisiones Técnicas Clave
- No tocar tsconfig.json global salvo que sea imprescindible.
- Centralizar compilación de scripts en scripts/tsconfig.json o cj_import/tsconfig.json.
- Normalizar imports sin .ts para evitar choques con Next.js.
- Usar ts-node -P para ejecutar scripts con su config local.
- Validar variables de entorno siempre con fallback.
- Mantener snapshots rotativos para poder volver atrás en segundos.

---

## 5. Forma de Trabajo
- Diagnóstico primero, acción después: entender la raíz antes de parchear.
- Confirmación antes de actuar: no se aplican cambios sin validación.
- Scripts desechables (run.sh): se usan para aplicar cambios puntuales, luego se eliminan.
- Repo limpio y seguro: snapshots + restauración rápida.
- Documentación viva: este manual se actualiza con cada aprendizaje.

---

## 6. Checklist Operativo Rápido
1. Antes de tocar nada
    bash scripts/backup.sh
2. Si hay error de imports → quitar .ts en cj_import/.
3. Si hay error de variables de entorno → usar process.env.X ?? "".
4. Si falla build → restaurar último snapshot:
    cp -r .backup_global/<timestamp>/* .
5. Si falla restore_global.sh → confirmar que usa cp -r.
6. Siempre ejecutar scripts con:
    ts-node -P cj_import/tsconfig.json archivo.ts

---

## 7. Sesión típica (ejemplo práctico)
- Crear snapshot:
    bash scripts/backup.sh
- Normalizar imports en cj_import/ (sin .ts):
    # Ejemplo sed (ajusta a tus archivos)
    sed -i 's#\(\./[a-zA-Z0-9_-]\+\)\.ts#\1#g' cj_import/*.ts
- Asegurar variable de entorno segura en cj_fetch.ts:
    # En el código:
    const token = (process.env.CJ_ACCESS_TOKEN ?? "").trim();
    if (!token) throw new Error("CJ_ACCESS_TOKEN no está definido en .env");
- Verificar cambios:
    bash scripts/dump.sh cj_import/
- Build:
    npm run build
- Dev:
    npm run dev
- Restaurar si algo falla:
    cp -r .backup_global/<timestamp>/* .

---

## 8. Notas de compatibilidad
- Git Bash en Windows puede romper scripts si tienen emojis/paréntesis o están en UTF-8 con BOM.
- Usa shebang correcto y evita caracteres especiales en líneas echo.
- Si usas PowerShell, convierte comandos Bash a su equivalente, o ejecuta desde Git Bash.

