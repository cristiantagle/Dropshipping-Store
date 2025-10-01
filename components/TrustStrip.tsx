export default function TrustStrip() {
  const items = [
    { icon: "🚚", text: "Envío rápido" },
    { icon: "🔒", text: "Pago seguro" },
    { icon: "⭐", text: "Clientes felices" },
    { icon: "↩️", text: "Devoluciones fáciles" },
  ];
  return (
    <section className="mt-10">
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((it, i) => (
          <li key={i} className="rounded-2xl border bg-white shadow-sm px-4 py-3 flex items-center gap-2">
            <span key={c.id} className="text-lg">{it.icon}</span>
            <span className="font-semibold text-gray-800">{it.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
