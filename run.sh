#!/bin/bash

BRANCH="preview/app-router-full"

# Crear/cambiar branch
if git show-ref --quiet refs/heads/$BRANCH; then
  git checkout $BRANCH
else
  git checkout -b $BRANCH
fi

# Crear carpeta app
mkdir -p app

# app/layout.tsx con estructura HTML, SEO y estilos globales
cat > app/layout.tsx <<'TSX'
import './globals.css';

export const metadata = {
  title: 'Beauty Dropshipping Chile',
  description: 'Los mejores productos de cuidado personal y belleza, con envíos rápidos en Chile.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metadata.description} />
        <title>{metadata.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <header style={{padding: '1rem', textAlign: 'center', backgroundColor: '#f7b733', color: '#fff', fontWeight: 'bold'}}>
          Beauty Dropshipping Chile
        </header>
        <main style={{maxWidth: '720px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'Arial, sans-serif'}}>
          {children}
        </main>
        <footer style={{textAlign: 'center', padding: '1rem', fontSize: '0.9rem', color: '#888'}}>
          © 2025 Beauty Dropshipping Chile - Todos los derechos reservados
        </footer>
      </body>
    </html>
  );
}
TSX

# app/page.tsx con landing page simple y efectiva
cat > app/page.tsx <<'TSX'
export default function Home() {
  return (
    <>
      <h1 style={{color: '#f7b733', textAlign: 'center'}}>Bienvenido a Beauty Dropshipping Chile</h1>
      <p style={{textAlign: 'center', fontSize: '1.2rem', margin: '1rem 0'}}>
        Descubre los mejores productos de cuidado personal y belleza con envío rápido a todo Chile.
      </p>
      <div style={{textAlign: 'center'}}>
        <a
          href="https://wa.me/56912345678"
          style={{
            display: 'inline-block',
            backgroundColor: '#f7b733',
            color: '#fff',
            padding: '0.8rem 1.5rem',
            borderRadius: '8px',
            fontWeight: 'bold',
            textDecoration: 'none',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          }}
          target="_blank"
          rel="noopener noreferrer"
        >
          Contáctanos por WhatsApp
        </a>
      </div>
    </>
  );
}
TSX

# app/globals.css con estilos básicos
cat > app/globals.css <<'CSS'
body {
  margin: 0;
  background: #ffffff;
  color: #333;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Trebuchet MS', Helvetica, sans-serif;
}

a:hover {
  opacity: 0.85;
}
CSS

# Ajustar next.config.js sin experimental appDir
cat > next.config.js <<'TS'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig;
TS

# Agregar y hacer commit
git add -A
git commit -m "Implementa estructura App Router con layout, globals y landing page optimizada dropshipping"
git push -u origin $BRANCH --force

echo "✅ Estructura App Router completa creada y push a rama $BRANCH listo."
echo "✔ Despliega esta rama en Vercel y prueba la página."
