"use client";
import Link from "next/link";

export default function Page() {
  return (
    <section className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">AndesDrop — Diagnóstico</h1>
        <p className="text-gray-600">Enlaces para comprobar ruteo en Vercel:</p>
      </div>
      <ul className="list-disc ml-6 space-y-2">
        <li><a className="underline" href="/api/health" target="_blank">/api/health</a> (API Route JSON)</li>
        <li><a className="underline" href="/api/ping" target="_blank">/api/ping</a> (API Route JSON)</li>
        <li><a className="underline" href="/ok.txt" target="_blank">/ok.txt</a> (archivo estático)</li>
      </ul>
      <p className="text-sm text-gray-500">Si cualquiera de estos devuelve 404 en Vercel, el problema está en la configuración del proyecto (Routes/Output Directory).</p>
      <div className="mt-8">
        <Link href="/carro" className="underline">Ir al Carro</Link>
      </div>
    </section>
  );
}
