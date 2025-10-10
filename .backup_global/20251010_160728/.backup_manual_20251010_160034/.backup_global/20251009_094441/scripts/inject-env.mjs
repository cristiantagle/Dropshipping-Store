import { writeFileSync } from "node:fs";

const envLines = [
  `# Generado automáticamente en build por scripts/inject-env.mjs`,
  `NEXT_PUBLIC_VERCEL_ENV=${process.env.VERCEL_ENV || ""}`,
  `NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF=${process.env.VERCEL_GIT_COMMIT_REF || ""}`,
  `NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA=${process.env.VERCEL_GIT_COMMIT_SHA || ""}`
].join("\n") + "\n";

try {
  writeFileSync(".env.local", envLines, { encoding: "utf8" });
  console.log("🧪 .env.local generado para PreviewBadge:");
  console.log(envLines);
} catch (e) {
  console.error("No se pudo escribir .env.local:", e);
}
