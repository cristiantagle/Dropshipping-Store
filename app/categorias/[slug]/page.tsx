import { getProductsByCategory } from "@/lib/products";
import { getCategory } from "@/lib/categorias";

export default async function CategoriaPage({ params }: { params: { slug: string } }) {
  const categoria = await getCategory(params.slug);
  const productos = await getProductsByCategory(params.slug);

  console.log("productos:", productos);

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 space-y-12">
      <section className="text-center">
        <h1 className="text-3xl font-bold mb-4">{categoria?.nombre}</h1>
        {categoria?.descripcion && (
          <p className="text-gray-600">{categoria.descripcion}</p>
        )}
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {productos?.length > 0 ? (
          productos.map((p) => (
            <article key={p.id} className="border rounded-lg p-4">
              <img
                src={p.imagen || "/placeholder.jpg"}
                alt={p.nombre}
                className="w-full h-48 object-cover mb-2"
              />
              <h2 className="text-xl font-semibold">{p.nombre}</h2>
              <p className="text-gray-700">
                {p.precio ? `$${p.precio.toLocaleString("es-CL")}` : "Sin precio"}
              </p>
            </article>
          ))
        ) : (
          <p>No hay productos en esta categoría</p>
        )}
      </section>
    </main>
  );
}
