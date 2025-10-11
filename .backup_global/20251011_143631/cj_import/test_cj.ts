import "dotenv/config";

const token = process.env.CJ_ACCESS_TOKEN!;
const url = "https://developers.cjdropshipping.com/api2.0/v1/product/list?pageNum=1&pageSize=1";

if (!token) {
  console.error("❌ CJ_ACCESS_TOKEN no está definido en .env");
  process.exit(1);
}

console.log("🔑 Usando token con longitud:", token.length);

try {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "CJ-Access-Token": token,
    },
  });

  console.log("🌐 Status:", res.status);
  const text = await res.text();
  console.log("📦 Body:", text);
} catch (err: any) {
  console.error("❌ Error en fetch:", err.message);
}
