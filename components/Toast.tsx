'use client';
import React from "react";
type ToastMsg = { id: number; text: string };
export default function Toast() {
  const [items, setItems] = React.useState<ToastMsg[]>([]);
  React.useEffect(() => {
    function onToast(e: Event) {
      const ce = e as CustomEvent<{ message: string }>;
      const id = Date.now() + Math.random();
      const text = ce.detail?.message || "Hecho";
      setItems((prev) => [...prev, { id, text }]);
      setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 2400);
    }
    window.addEventListener("toast", onToast as EventListener);
    return () => window.removeEventListener("toast", onToast as EventListener);
  }, []);
  return (
    <div className="fixed inset-x-0 bottom-6 z-[90] pointer-events-none flex justify-center px-4">
      <div className="flex flex-col gap-2 max-w-md w-full">
        {items.map((t) => (
          <div key={t.id} className="rounded-xl bg-neutral-900/90 text-white px-4 py-3 shadow-lg backdrop-blur pointer-events-auto animate-toast-in" role="status">
            {t.text}
          </div>
        ))}
      </div>
    </div>
  );
}
