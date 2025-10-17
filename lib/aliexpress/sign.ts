import crypto from "crypto";

export type SignStyle = "concat" | "taobao";

// Builds HMAC-SHA256 signature using two common styles used across Alibaba/AliExpress APIs.
// - concat: sign = HMAC_SHA256(secret, canonical)
// - taobao: sign = HMAC_SHA256(secret, secret + canonical + secret)
export function signHmacSHA256(
  params: Record<string, string | number | boolean | undefined>,
  secret: string,
  style: SignStyle = "concat"
) {
  const entries = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => [k, String(v)] as const)
    .sort((a, b) => a[0].localeCompare(b[0]));

  const canonical = entries.map(([k, v]) => `${k}${v}`).join("");
  const base = style === "taobao" ? `${secret}${canonical}${secret}` : canonical;
  const h = crypto.createHmac("sha256", secret);
  h.update(base, "utf8");
  return h.digest("hex");
}

export function toForm(params: Record<string, string | number | boolean | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    sp.set(k, String(v));
  }
  return sp.toString();
}

