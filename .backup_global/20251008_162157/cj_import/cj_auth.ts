// cj_auth.ts
import fs from "fs";
import path from "path";
import "dotenv/config";

const AUTH_URL = "https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken";

const CJ_EMAIL = process.env.CJ_EMAIL;
const CJ_API_KEY = process.env.CJ_API_KEY;

if (!CJ_EMAIL || !CJ_API_KEY) {
  console.error("❌ CJ_EMAIL o CJ_API_KEY no están definidos en .env");
  process.exit(1);
}

async function getAccessToken() {
  const res = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: CJ_EMAIL, apiKey: CJ_API_KEY }),
  });

  const json = await res.json();
  if (!json.result || !json.data?.accessToken) {
    console.error(`❌ Error al obtener token: ${json.message || "sin mensaje"}`);
    process.exit(1);
  }

  const token: string = String(json.data.accessToken).trim();
  console.log("✅ Token obtenido:", token);

  const envPath = path.resolve(process.cwd(), ".env");
  let envContent = fs.readFileSync(envPath, "utf-8");

  // Reemplazo limpio, sin comillas ni espacios extras
  if (envContent.includes("CJ_ACCESS_TOKEN=")) {
    envContent = envContent.replace(/CJ_ACCESS_TOKEN=.*/g, `CJ_ACCESS_TOKEN=${token}`);
  } else {
    envContent += `\nCJ_ACCESS_TOKEN=${token}\n`;
  }

  fs.writeFileSync(envPath, envContent, { encoding: "utf-8" });
  console.log("📝 .env actualizado con el nuevo CJ_ACCESS_TOKEN");
}

getAccessToken();