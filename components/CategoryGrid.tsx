import Link from "next/link";
const cats = ["Hogar","Mascotas","Belleza","Bienestar","Tecnología","Eco"] as const;
export default function CategoryGrid() {
  return (
    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cats.map(c => (
        <li key={c} className="rounded-2xl border shadow-sm bg-white p-6">
          <div className="font-semibold mb-2">{c}</div>
          <p className="text-sm text-gray-600 mb-3">Productos seleccionados para {c.toLowerCase()}.</p>
          <Link className="underline" href="/">{`Ver ${c}`}</Link>
        </li>
      ))}
    </ul>
  );
}
