import "dotenv/config";
import { CJ_ACCESS_TOKEN } from "./cj_config";

// Base URL correcta de API 2.0
const CJ_BASE_URL = "https://developers.cjdropshipping.com/api2.0/v1";

if (!CJ_ACCESS_TOKEN) {
  console.error("❌ CJ_ACCESS_TOKEN no está definido. Ejecuta `ts-node cj_auth.ts` y vuelve a correr.");
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

export async function fetchCJProducts(pageNum = 1, pageSize = 10) {
  const url = `${CJ_BASE_URL}/product/list?pageNum=${pageNum}&pageSize=${pageSize}`;
  const token = CJ_ACCESS_TOKEN.trim();

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "CJ-Access-Token": token,
      },
    });

    const data = (await res.json()) as CJListResponse<any>;

    if (!data.result || data.code !== 200) {
      console.error(`❌ CJ fetch fallido: ${data.message || "sin mensaje"}`);
      return [];
    }

    return data.data?.list ?? [];
  } catch (err: any) {
    console.error("❌ Error ejecutando fetch:", err.message);
    return [];
  }
}