import "dotenv/config";

// Base URL correcta de API 2.0
const CJ_BASE_URL = "https://developers.cjdropshipping.com/api2.0/v1";

// Leemos el token desde .env con fallback seguro
const CJ_ACCESS_TOKEN = (process.env.CJ_ACCESS_TOKEN ?? "").trim();
if (!CJ_ACCESS_TOKEN) {
  console.error("❌ CJ_ACCESS_TOKEN no está definido en .env. Revisa tu archivo cj_import/.env");
  process.exit(1);
}

type CJListResponse<T> = {
  code: number;
  result: boolean;
  message: string;
  data?: {
    pageNum: number;
    pageSize: number;
    total: number;
    list: T[];
  };
  success?: boolean;
  requestId?: string;
};

/**
 * Trae productos de CJ con soporte de paginación y delay para evitar bloqueo.
 * @param limit Cantidad máxima de productos a traer
 * @param categoryId ID de categoría CJ específica (opcional)
 */
export async function fetchCJProducts(limit = 100, categoryId?: string): Promise<any[]> {
  const token = CJ_ACCESS_TOKEN;
  const pageSize = Math.max(10, 50); // ✅ nunca menos de 10
  let pageNum = 1;
  let allProducts: any[] = [];

  try {
    while (allProducts.length < limit) {
      // Construir URL con filtro de categoría opcional
      let url = `${CJ_BASE_URL}/product/list?pageNum=${pageNum}&pageSize=${pageSize}`;
      if (categoryId) {
        url += `&categoryId=${categoryId}`;
        console.log(`🎨 Filtrando por categoría CJ: ${categoryId}`);
      }
      console.log(`🔎 Fetching página ${pageNum} (pageSize=${pageSize})... acumulados: ${allProducts.length}/${limit}`);

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "CJ-Access-Token": token,
        },
      });

      const data = (await res.json()) as CJListResponse<any>;

      if (!data.result || data.code !== 200) {
        console.error(`❌ CJ fetch fallido en página ${pageNum}: ${data.message || "sin mensaje"}`);
        break;
      }

      const list = data.data?.list ?? [];
      console.log(`📦 Página ${pageNum}: recibidos ${list.length} productos`);

      if (list.length === 0) break;

      allProducts = allProducts.concat(list);

      // Si ya alcanzamos el total reportado por CJ, salimos
      if (allProducts.length >= (data.data?.total ?? 0)) {
        console.log("✅ Alcanzado total reportado por CJ");
        break;
      }

      pageNum++;
      await new Promise((r) => setTimeout(r, 1200)); // ⏳ delay de 1.2 segundos
    }

    console.log(`🎯 Total acumulado: ${allProducts.length} productos`);
    return allProducts.slice(0, limit);
  } catch (err: any) {
    console.error("❌ Error ejecutando fetch:", err.message);
    return [];
  }
}