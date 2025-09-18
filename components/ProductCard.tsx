'use client';

type Props = {
  p: {
    id: string;
    nombre: string;
    precio: number;
    moneda?: string;
    imagen: string;
    categoria: string;
  };
  onAdd?: (id: string) => void;
};

export default function ProductCard({ p, onAdd }: Props) {
  return (
    <div className="group rounded-xl border overflow-hidden bg-white hover:shadow-md transition">
      <div className="aspect-[4/3] overflow-hidden bg-gray-50">
        <img
          src={p.imagen}
          alt={p.nombre}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="text-sm text-gray-500 mb-1 capitalize">{p.categoria}</div>
        <h3 className="font-medium leading-tight">{p.nombre}</h3>
        <div className="mt-3 flex items-center justify-between">
          <div className="font-semibold">
            {(p.moneda ?? "CLP")} {p.precio.toLocaleString("es-CL")}
          </div>
          {onAdd ? (
            <button
              onClick={() => onAdd(p.id)}
              className="px-3 py-1.5 text-sm rounded-lg bg-black text-white hover:opacity-90"
            >
              Agregar
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
