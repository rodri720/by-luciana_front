// CartPage.js - Versión con validaciones mejoradas Y checkout
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
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

  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cartReady, setCartReady] = useState(false);

  // Asegurar que el carrito esté listo
  useEffect(() => {
    console.log('🛒 CartPage - Carrito actual:', cart);
    console.log('📦 Tipo de cart:', typeof cart);
    console.log('🔍 Es array?', Array.isArray(cart));
    console.log('🔢 Longitud del carrito:', cart?.length || 0);
    
    if (cart && Array.isArray(cart)) {
      setCartReady(true);
      
      // Verificar cada item del carrito
      cart.forEach((item, index) => {
        console.log(`Item ${index}:`, item);
        console.log(`Item ${index} ID:`, item?._id || item?.product?._id || 'NO ID');
      });
    }
  }, [cart]);

  const handleCheckout = async () => {
    console.log('🔄 Iniciando checkout...');
    
    // Validación adicional
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      setError('Tu carrito está vacío o no está disponible');
      return;
    }
    
    // Verificar que todos los items tengan ID
    const invalidItems = cart.filter(item => 
      !item?._id && !item?.product?._id
    );
    
    if (invalidItems.length > 0) {
      setError('Algunos productos no tienen identificador válido');
      console.error('Items inválidos:', invalidItems);
      return;
    }
    
    try {
      setLoading(true);
      console.log('📍 Navegando a checkout...');
      
      // Preparar datos para checkout
      const cartItemsForCheckout = cart.map(item => ({
        id: item?._id || item?.product?._id,
        productId: item?.product?._id || item?._id,
        name: item?.product?.name || item?.nombre || 'Producto',
        description: item?.product?.description || '',
        price: item?.product?.price || item?.precio || 0,
        quantity: item.quantity || 1,
        image: item?.product?.images?.[0] || item?.imagen?.[0] || '',
        size: item.size,
        color: item.color
      }));
      
      // Guardar en localStorage para usar en checkout
      localStorage.setItem('checkoutCart', JSON.stringify(cartItemsForCheckout));
      
      // Redirigir a checkout
      navigate('/checkout');
      
    } catch (err) {
      console.error('❌ Error en checkout:', err);
      setError('Error al procesar el pago: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Si cart no está listo
  if (!cartReady) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <h1>🛒 Tu Carrito</h1>
          <div className="loading-cart">
            <div className="spinner"></div>
            <p>Cargando carrito...</p>
          </div>
        </div>
      </div>
    );
  }

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

  // Función segura para obtener valores
  const getItemImage = (item) => {
    const image = item?.product?.images?.[0] || item?.imagen?.[0];
    if (!image) return null;
    
    return image.startsWith('http') 
      ? image 
      : `http://localhost:5000${image}`;
  };

  const getItemName = (item) => {
    return item?.product?.name || item?.nombre || 'Producto sin nombre';
  };

  const getItemPrice = (item) => {
    return item?.product?.price || item?.precio || 0;
  };

  const getItemId = (item) => {
    const id = item?._id || item?.product?._id;
    if (!id) {
      console.error('Item sin ID:', item);
      return 'invalid-id';
    }
    return id;
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>🛒 Tu Carrito</h1>
          <p>{getCartItemsCount()} producto(s) en tu carrito</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)} className="close-error">×</button>
          </div>
        )}

        <div className="cart-content">
          <div className="cart-items">
            {cart.map((item, index) => {
              const itemId = getItemId(item);
              const image = getItemImage(item);
              const name = getItemName(item);
              const price = getItemPrice(item);
              
              return (
                <div key={`${itemId}-${index}`} className="cart-item">
                  <div className="item-image">
                    {image ? (
                      <img src={image} alt={name} />
                    ) : (
                      <div className="image-placeholder">📷</div>
                    )}
                  </div>

                  <div className="item-details">
                    <h3 className="item-name">{name}</h3>
                    <p className="item-price">
                      ${price.toLocaleString('es-AR')} ARS
                    </p>
                    {item?.size && <p className="item-size">Talla: {item.size}</p>}
                    {item?.color && <p className="item-color">Color: {item.color}</p>}
                  </div>

                  <div className="item-quantity">
                    <button 
                      onClick={() => {
                        if (itemId !== 'invalid-id') {
                          updateQuantity(itemId, item.quantity - 1);
                        }
                      }}
                      className="quantity-btn"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      onClick={() => {
                        if (itemId !== 'invalid-id') {
                          updateQuantity(itemId, item.quantity + 1);
                        }
                      }}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>

                  <div className="item-total">
                    ${(price * item.quantity).toLocaleString('es-AR')} ARS
                  </div>

                  <button 
                    onClick={() => {
                      if (itemId !== 'invalid-id') {
                        removeFromCart(itemId);
                      }
                    }}
                    className="remove-btn"
                    title="Eliminar producto"
                  >
                    🗑️
                  </button>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Resumen del Pedido</h3>
              
              <div className="summary-row">
                <span>Productos ({getCartItemsCount()})</span>
                <span>${getCartTotal().toLocaleString('es-AR')} ARS</span>
              </div>
              
              <div className="summary-row">
                <span>Envío</span>
                <span>$800 ARS</span>
              </div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>${(getCartTotal() + 800).toLocaleString('es-AR')} ARS</span>
              </div>

              {/* ✅ BOTÓN DE CHECKOUT MEJORADO */}
              <button 
                onClick={handleCheckout}
                className="btn-checkout"
                disabled={loading || cart.length === 0}
              >
                {loading ? (
                  <>
                    <span className="checkout-spinner"></span>
                    Procesando...
                  </>
                ) : (
                  <>
                    💳 Proceder al Pago
                    <span className="checkout-arrow">→</span>
                  </>
                )}
              </button>

              {/* ✅ BOTÓN DE CHECKOUT ALTERNATIVO */}
              <button 
                onClick={() => navigate('/checkout')}
                className="checkout-button"
                disabled={cart.length === 0}
              >
                🔒 Ir a Checkout
              </button>

              <button 
                onClick={clearCart}
                className="btn-clear"
                disabled={loading}
              >
                Vaciar Carrito
              </button>

              <Link to="/outlet" className="continue-shopping">
                ← Seguir comprando
              </Link>

              <div className="payment-methods-info">
                <h4>💳 Métodos de pago disponibles:</h4>
                <ul className="payment-methods-list">
                  <li>✅ Tarjetas de crédito/débito</li>
                  <li>✅ Mercado Pago (saldo)</li>
                  <li>✅ Pago Fácil</li>
                  <li>✅ RapiPago</li>
                  <li>✅ Western Union</li>
                  <li>✅ Transferencias bancarias</li>
                </ul>
                <p className="secure-payment">
                  🔒 Todos los pagos son 100% seguros mediante Mercado Pago
                </p>
                <p className="test-mode-info">
                  ⚠️ <strong>MODO PRUEBAS ACTIVADO:</strong> 
                  Puedes usar tarjetas de prueba. No se realizarán cargos reales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;