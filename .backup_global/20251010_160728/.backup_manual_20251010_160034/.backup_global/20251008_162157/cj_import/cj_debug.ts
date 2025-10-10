import "dotenv/config"; // 👈 Esto carga tu .env automáticamente
import { fetchCJProducts } from "./cj_fetch";
import { transformCJProduct } from "./cj_transform";
import { validateCJProduct } from "./cj_validate";

async function debugCJ() {
  const raw = await fetchCJProducts();
  const valid = raw.filter((p, i) => validateCJProduct(p, i));

  console.log(`🔍 ${valid.length} productos válidos de ${raw.length} recibidos.`);

  for (let i = 0; i < Math.min(valid.length, 5); i++) {
    const transformed = await transformCJProduct(valid[i]);
    console.log(`🧪 Producto #${i + 1}:`);
    console.dir(transformed, { depth: null });
    console.log("—".repeat(40));
  }
}

debugCJ();