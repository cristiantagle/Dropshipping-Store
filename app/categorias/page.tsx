import Link from "next/link";
const cats = ["Hogar","Mascotas","Belleza","Bienestar","Tecnología","Eco"] as const;
export default function Categorias() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Categorías</h1>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cats.map(c => (
          <li key={c} className="border rounded-xl p-6">
            <div className="font-semibold mb-2">{c}</div>
            <p className="text-sm text-gray-600">Productos seleccionados para {c.toLowerCase()}.</p>
            <Link className="underline mt-2 inline-block" href="/">{`Ver ${c}`}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
