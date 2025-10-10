import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const REQUIRED_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "CJ_ACCESS_TOKEN"
];

const TABLES = ["products", "product_changes", "product_errors"];

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function testCJEnvironment() {
  console.log("🧪 Verificando entorno CJdropshipping...\n");

  // 1. Verificar claves .env
  let envOk = true;
  for (const key of REQUIRED_KEYS) {
    const value = process.env[key];
    if (!value || value.trim() === "") {
      console.error(`❌ Falta clave .env: ${key}`);
      envOk = false;
    } else {
      console.log(`✅ Clave .env presente: ${key}`);
    }
  }

  // 2. Verificar conexión Supabase
  const { data, error } = await supabase.from("products").select("*").limit(1);
  if (error) {
    console.error("❌ Error de conexión con Supabase:", error.message);
  } else {
    console.log("✅ Conexión con Supabase exitosa");
  }

  // 3. Verificar existencia de tablas
  for (const table of TABLES) {
    const { error: tableError } = await supabase.from(table).select("*").limit(1);
    if (tableError) {
      console.error(`❌ Tabla faltante o inaccesible: ${table}`);
    } else {
      console.log(`✅ Tabla accesible: ${table}`);
    }
  }

  console.log("\n🔍 Diagnóstico completado.");
}

testCJEnvironment();