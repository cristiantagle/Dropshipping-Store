import { createClient } from "@supabase/supabase-js";

// ⚠️ Usamos ANON_KEY para lectura segura en frontend/SSR.
// La SERVICE_ROLE_KEY queda comentada por si se necesita en el futuro
// para operaciones administrativas en el servidor.
export const supabaseServer = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { 
      auth: { persistSession: false },
      // ✅ Deshabilitar cache en desarrollo para datos siempre frescos
      ...(process.env.NODE_ENV === 'development' && {
        db: {
          schema: 'public'
        },
        global: {
          fetch: (url, options = {}) => {
            return fetch(url, {
              ...options,
              cache: 'no-store', // 🚀 Sin cache en desarrollo
            });
          },
        },
      })
    }
  );

// export const supabaseServer = () =>
//   createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.SUPABASE_SERVICE_ROLE_KEY!,
//     { auth: { persistSession: false } }
//   );
