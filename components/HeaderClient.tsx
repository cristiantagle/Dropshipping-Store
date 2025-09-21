"use client";
import React from "react";

export default function HeaderClient() {
  const [count, setCount] = React.useState<number>(0);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem("carro") || "[]";
        const arr = JSON.parse(raw);
        setCount(Array.isArray(arr) ? arr.length : 0);
      } catch { setCount(0); }
    };
    read();
    setReady(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === "carro") read();
    };
    const onCustom = () => read();

    window.addEventListener("storage", onStorage);
    window.addEventListener("carro:changed", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("carro:changed", onCustom);
    };
  }, []);

  React.useEffect(() => {
    // restaurar preferencia de tema
    try {
      const t = localStorage.getItem("theme");
      const root = document.documentElement;
      if (t === "dark") root.classList.add("dark");
      else root.classList.remove("dark");
    } catch {}
  }, []);

  const toggleTheme = () => {
    try {
      const root = document.documentElement;
      const isDark = root.classList.toggle("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {}
  };

  return (
    <div className="flex items-center gap-3">
      <button onClick={toggleTheme} title="Tema claro/oscuro"
        className="rounded-xl px-3 py-2 text-sm bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 transition">
        🌓
      </button>
      <a href="/carro" className="relative rounded-xl px-3 py-2 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 transition">
        🛒
        {ready && (
          <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-lime-600 text-white text-xs flex items-center justify-center">
            {count}
          </span>
        )}
      </a>
    </div>
  );
}
