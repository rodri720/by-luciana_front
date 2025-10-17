import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Header() {
  const { getCartItemsCount } = useCart();

  return (
    <header style={{
      background: 'white',
      padding: '1rem 2rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>
        <h1 style={{ margin: 0 }}>By Luciana</h1>
      </Link>
      
      <nav style={{ display: 'flex', gap: '2rem' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>Inicio</Link>
        <Link to="/productos" style={{ textDecoration: 'none', color: '#333' }}>Productos</Link>
      </nav>

      <Link to="/carrito" style={{ textDecoration: 'none', color: '#333', position: 'relative' }}>
        🛒 Carrito
        {getCartItemsCount() > 0 && (
          <span style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            background: '#007bff',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.8rem'
          }}>
            {getCartItemsCount()}
          </span>
        )}
      </Link>
    </header>
  );
}

export default Header;