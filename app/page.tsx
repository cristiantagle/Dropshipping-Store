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
