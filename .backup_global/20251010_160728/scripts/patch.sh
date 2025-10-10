#!/usr/bin/env bash
set -euo pipefail
echo "🔧 Aplicando parche en app/page.tsx..."
node <<'PATCH'
import fs from "fs";
const file = "app/page.tsx";
let src = fs.readFileSync(file, "utf8");
src = src.replace(
  /select\("id, name, image_url, price_cents, category_slug"\)/g,
  'select("id, name, name_es, image_url, price_cents, category_slug")'
);
src = src.replace(
  /(<ProductCard[^>]*\n\s*id=\{p\.id\}\n\s*name=\{p\.name\})/g,
  '$1\n                name_es={p.name_es}'
);
fs.writeFileSync(file, src, "utf8");
console.log("✅ Patch aplicado en", file);
PATCH
