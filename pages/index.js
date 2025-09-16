import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useState } from 'react';

const catalogo = [
  {
    id: '001',
    nombre: 'Crema Facial Hidratante',
    descripcion: 'Hidratación profunda para todo tipo de piel.',
    precio: 15990,
    proveedor: 'AliExpress',
    url: 'https://es.aliexpress.com/item/1005001234567890.html',
    imagen: 'https://ae01.alicdn.com/kf/HTB1XfacX3mTBuNjy1Xbq6yMrVXaw/Crema-Facial-Hidratante.jpg',
  },
  {
    id: '002',
    nombre: 'Serum Rejuvenecedor',
    descripcion: 'Reduce arrugas y mejora elasticidad.',
    precio: 18990,
    proveedor: 'Wowi.cl',
    url: 'https://wowi.cl/producto/serum-rejuvenecedor',
    imagen: 'https://wowi.cl/images/productos/serum.jpg',
  },
  {
    id: '003',
    nombre: 'Champú Orgánico',
    descripcion: 'Para cabello saludable y libre de químicos.',
    precio: 12990,
    proveedor: 'AliExpress',
    url: 'https://es.aliexpress.com/item/1005009876543210.html',
    imagen: 'https://ae01.alicdn.com/kf/HTB1CcacX3mTBuNjy1Xbq6yMrVXaw/Champu-Organico.jpg',
  },
];

export default function Home() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => {
      const found = prev.find((p) => p.id === product.id);
      if (found) {
        return prev.map((p) => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const total = cart.reduce((acc, item) => acc + item.precio * item.quantity, 0);

  return (
    <div className={styles.container}>
      <Head>
        <title>Beauty Dropshipping Chile</title>
        <meta name="description" content="Productos de cuidado personal y belleza con envíos rápidos en Chile" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Beauty Dropshipping Chile</h1>
        <p className={styles.description}>Venta online de productos de cuidado personal y belleza.</p>

        <section className={styles.products}>
          <h2>Productos Destacados</h2>
          <div className={styles.productList}>
            {catalogo.map((producto) => (
              <div key={producto.id} className={styles.productCard}>
                <img src={producto.imagen} alt={producto.nombre} width={150} />
                <h3>{producto.nombre}</h3>
                <p>{producto.descripcion}</p>
                <p><strong>${producto.precio.toLocaleString('es-CL')}</strong></p>
                <a href={producto.url} target="_blank" rel="noopener noreferrer">Comprar en {producto.proveedor}</a>
                <br />
                <button onClick={() => addToCart(producto)}>Agregar al Carrito</button>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.cart}>
          <h2>Carrito</h2>
          {cart.length === 0 ? (
            <p>Carrito vacío</p>
          ) : (
            <ul>
              {cart.map((item) => (
                <li key={item.id}>
                  {item.nombre} x {item.quantity} - ${ (item.precio * item.quantity).toLocaleString('es-CL')}
                  <button onClick={() => removeFromCart(item.id)}>Eliminar</button>
                </li>
              ))}
            </ul>
          )}
          <p><strong>Total: ${total.toLocaleString('es-CL')}</strong></p>
        </section>

        <footer className={styles.footer}>
          <p>© 2025 Beauty Dropshipping Chile</p>
        </footer>
      </main>
    </div>
  );
}
