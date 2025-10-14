"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseAuth } from "@/lib/supabase/authClient";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const { data, error } = await supabaseAuth.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    // Crear/actualizar perfil si ya existe sesión (dependiendo de la política de confirmación)
    const { data: userData } = await supabaseAuth.auth.getUser();
    if (userData.user && name.trim()) {
      await supabaseAuth.from('profiles').upsert({ user_id: userData.user.id, display_name: name.trim() }, { onConflict: 'user_id' });
    }
    setMessage("Revisa tu correo para confirmar tu cuenta.");
    router.replace("/cuenta");
  };

  return (
    <main className="max-w-md mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">Crear cuenta</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre (opcional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded-lg px-3 py-2"
        />
        <input
          type="password"
          placeholder="Contraseña (mín 6 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border rounded-lg px-3 py-2"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {message && <p className="text-green-700 text-sm">{message}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-lime-600 hover:bg-lime-700 text-white font-semibold py-2 rounded-lg"
        >
          {loading ? "Creando..." : "Crear cuenta"}
        </button>
      </form>
      <p className="text-sm text-gray-600 mt-4">
        ¿Ya tienes cuenta? <Link href="/cuenta/login" className="text-lime-700 hover:underline">Inicia sesión</Link>
      </p>
    </main>
  );
}
