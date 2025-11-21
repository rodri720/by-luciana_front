// src/components/CartWidget.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './CartWidget.css'; // Opcional, para estilos

const CartWidget = () => {
  const { getCartItemsCount, cart } = useCart();

  console.log('🛒 CartWidget - Items count:', getCartItemsCount());
  console.log('🛒 CartWidget - Cart details:', cart);

  return (
    <Link to="/cart" className="cart-widget">
      <div className="cart-icon">
        🛒
        {getCartItemsCount() > 0 && (
          <span className="cart-badge">
            {getCartItemsCount()}
          </span>
        )}
      </div>
      <span className="cart-text">Carrito</span>
    </Link>
  );
};

export default CartWidget;