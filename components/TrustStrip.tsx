import React from "react";

export default function TrustStrip() {
  const items = [
    "🚚 Envíos rápidos",
    "💳 Pagos seguros",
    "🔄 Devoluciones 7 días",
    "⭐ Productos bien evaluados",
    "📦 Empaque responsable",
  ];
  return (
    <section aria-label="Confianza" className="lunaria-zoom">
      <div className="lunaria-marquee py-3 border-y bg-white/70 dark:bg-neutral-900/50">
        <div className="track">
          {items.concat(items).map((t, i) => (
            <span key={i} className="text-sm text-neutral-600 dark:text-neutral-300">{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
