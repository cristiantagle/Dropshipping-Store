'use client';
import React from "react";
export default function CartCountBubble() {
  const [count, setCount] = React.useState<number>(0);
  const readCount = React.useCallback(() => {
    try {
      const raw = localStorage.getItem("carro") || "[]";
      const arr = JSON.parse(raw);
      setCount(Array.isArray(arr) ? arr.length : 0);
    } catch { setCount(0); }
  }, []);
  React.useEffect(() => {
    readCount();
    const onStorage = (e: StorageEvent) => { if (e.key === "carro") readCount(); };
    window.addEventListener("storage", onStorage);
    const int = setInterval(readCount, 1500);
    return () => { window.removeEventListener("storage", onStorage); clearInterval(int); };
  }, [readCount]);
  if (count <= 0) return null;
  return (
    <div className="fixed right-6 bottom-14 z-[86]">
      <div className="min-w-6 h-6 px-2 rounded-full bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center shadow">{count}</div>
    </div>
  );
}
