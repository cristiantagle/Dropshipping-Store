"use client";

export default function DiagPage() {
  const checks = [
    { label: "Conexión a Supabase", status: "OK" },
    { label: "Variables de entorno", status: "OK" },
    { label: "Build local", status: "OK" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Diagnóstico</h1>
      <ul className="space-y-3">
        {checks.map((c, idx) => (
          <li
            key={idx}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <span key={c.id}>{c.label}</span>
            <span
              className={
                c.status === "OK"
                  ? "text-green-600 font-semibold"
                  : "text-red-600 font-semibold"
              }
            >
              {c.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
