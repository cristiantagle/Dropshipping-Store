import './globals.css'

export const metadata = {
  title: 'Proyecto OreTec Compatible',
  description: 'Base compatible con OreTec para deploy en Vercel sin 404.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
