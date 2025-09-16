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
