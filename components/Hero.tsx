"use client";
import { motion } from "framer-motion";
import Link from "next/link";
export default function Hero() {
  return (
    <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="p-10 text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Lunaria — Tu tienda favorita en Chile</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">Productos seleccionados para Hogar, Mascotas, Belleza, Bienestar, Tecnología y Eco. Pagos seguros con Mercado Pago y envíos a todo Chile.</p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/categorias" className="btn btn-primary">Explorar categorías</Link>
          <Link href="/carro" className="btn border">Ver carro</Link>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-purple-200/50 blur-2xl" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-amber-200/50 blur-2xl" />
    </div>
  );
}
