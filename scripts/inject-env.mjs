import { writeFileSync, readFileSync, existsSync } from "node:fs";

// Merge-safe injector: preserves existing keys and updates only derived ones.
const DERIVED_KEYS = [
  "NEXT_PUBLIC_VERCEL_ENV",
  "NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF",
  "NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA",
];

const derived = {
  NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV || "",
  NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF: process.env.VERCEL_GIT_COMMIT_REF || "",
  NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA || "",
};

let existing = "";
try {
  if (existsSync(".env.local")) {
    existing = readFileSync(".env.local", "utf8");
  }
} catch {
  // ignore read errors and proceed with empty baseline
}

const lines = existing.split(/\r?\n/);
const keysToReplace = new Set(DERIVED_KEYS);
const kept = [];
for (const line of lines) {
  // Preserve comments and empty lines
  if (!line || /^\s*#/.test(line)) {
    kept.push(line);
    continue;
  }
  const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=.*/);
  if (m && keysToReplace.has(m[1])) {
    // drop old value for derived key (will be re-appended)
    continue;
  }
  kept.push(line);
}

// Ensure a trailing blank line before our injected block
if (kept.length === 0 || kept[kept.length - 1] !== "") {
  kept.push("");
}

const injected = [
  `# Generado automáticamente (merge-safe) por scripts/inject-env.mjs`,
  `NEXT_PUBLIC_VERCEL_ENV=${derived.NEXT_PUBLIC_VERCEL_ENV}`,
  `NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF=${derived.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF}`,
  `NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA=${derived.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}`,
  "",
].join("\n");

const output = kept.join("\n") + injected;

try {
  writeFileSync(".env.local", output, { encoding: "utf8" });
  console.log("🧪 .env.local actualizado (merge-safe) con variables de PreviewBadge");
} catch (e) {
  console.error("No se pudo escribir .env.local:", e);
}

