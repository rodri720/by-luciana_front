// src/pages/CartPage.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './CartPage.css';

const CartPage = () => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal,
    getCartItemsCount 
  } = useCart();

  console.log('🛒 CartPage - Carrito:', cart);

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <h1>🛒 Tu Carrito</h1>
          <div className="empty-cart">
            <div className="empty-cart-icon">📦</div>
            <h2>Tu carrito está vacío</h2>
            <p>Agrega algunos productos para comenzar a comprar</p>
            <Link to="/outlet" className="btn btn-primary">
              Ir a Comprar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>🛒 Tu Carrito</h1>
          <p>{getCartItemsCount()} producto(s) en tu carrito</p>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item._id} className="cart-item">
                <div className="item-image">
                  {item.product?.images?.[0] ? (
                    <img 
                      src={
                        item.product.images[0].startsWith('http') 
                          ? item.product.images[0] 
                          : `http://localhost:5000${item.product.images[0]}`
                      } 
                      alt={item.product.name}
                    />
                  ) : (
                    <div className="image-placeholder">📷</div>
                  )}
                </div>

                <div className="item-details">
                  <h3 className="item-name">{item.product?.name}</h3>
                  <p className="item-price">${item.product?.price?.toLocaleString()}</p>
                  {item.size && <p className="item-size">Talla: {item.size}</p>}
                  {item.color && <p className="item-color">Color: {item.color}</p>}
                </div>

                <div className="item-quantity">
                  <button 
                    onClick={() => updateQuantity(item.product?._id, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.product?._id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>

                <div className="item-total">
                  ${((item.product?.price || 0) * item.quantity).toLocaleString()}
                </div>

                <button 
                  onClick={() => removeFromCart(item.product?._id)}
                  className="remove-btn"
                  title="Eliminar producto"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Resumen del Pedido</h3>
              
              <div className="summary-row">
                <span>Productos ({getCartItemsCount()})</span>
                <span>${getCartTotal().toLocaleString()}</span>
              </div>
              
              <div className="summary-row">
                <span>Envío</span>
                <span>Gratis</span>
              </div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>${getCartTotal().toLocaleString()}</span>
              </div>

              <button className="btn-checkout">
                Finalizar Compra
              </button>

              <button 
                onClick={clearCart}
                className="btn-clear"
              >
                Vaciar Carrito
              </button>

              <Link to="/outlet" className="continue-shopping">
                ← Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;