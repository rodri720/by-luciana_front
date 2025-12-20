// src/pages/CheckoutPage.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import PaymentButton from '../components/PaymentButton';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    dni: ''
  });
  
  const [shippingInfo, setShippingInfo] = useState({
    method: 'standard',
    cost: 800
  });
  
  const [loading, setLoading] = useState(false);
  
  // Calcular total usando la función del contexto
  const total = getCartTotal();

  // 🔍 DEBUG: Verificar estructura del carrito
  useEffect(() => {
    console.log('🛒 DEBUG - Carrito en CheckoutPage:', cart);
    if (cart.length > 0) {
      console.log('📋 Primer item del carrito:', cart[0]);
      console.log('💰 Precio del primer item:', cart[0]?.price || cart[0]?.product?.price || cart[0]?.precio);
      console.log('📦 Nombre del primer item:', cart[0]?.name || cart[0]?.product?.name || cart[0]?.nombre);
    }
  }, [cart]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleShippingChange = (e) => {
    const { value } = e.target;
    const cost = value === 'express' ? 1500 : 800;
    setShippingInfo({
      method: value,
      cost
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // La validación y procesamiento se hace en PaymentButton
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Tu carrito está vacío</h2>
        <p>Agrega productos antes de proceder al pago.</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Volver a la tienda
        </button>
      </div>
    );
  }

  // Preparar cartItems para PaymentButton
  const prepareCartItems = () => {
    return cart.map(item => {
      // Extraer datos de forma segura
      const product = item?.product || item;
      
      // Obtener nombre
      const name = item?.name || product?.name || product?.nombre || 'Producto';
      
      // Obtener precio - manejar diferentes estructuras
      const price = Number(
        item?.price || 
        product?.price || 
        product?.precio || 
        item?.precio || 
        0
      );
      
      // Obtener cantidad
      const quantity = Number(item?.quantity || 1);
      
      // Obtener imagen
      const image = item?.image || 
                   product?.image || 
                   product?.images?.[0] || 
                   product?.imagen?.[0] || 
                   item?.imagen?.[0] || 
                   '';
      
      return {
        id: item?.id || product?._id || item?._id || Date.now().toString(),
        productId: product?._id || item?.productId || item?.id,
        name: name,
        description: product?.description || product?.descripcion || '',
        price: isNaN(price) ? 0 : price,
        quantity: isNaN(quantity) ? 1 : quantity,
        image: image,
        size: item?.size || product?.size,
        color: item?.color || product?.color
      };
    }).filter(item => item.price > 0 && item.quantity > 0); // Filtrar items inválidos
  };

  // Datos de prueba TEMPORALES (comentar cuando funcione)
  const testCartItems = [
    {
      id: 'test-1',
      productId: 'test-1',
      name: 'Producto de Prueba 1',
      description: 'Descripción de prueba',
      price: 4500,
      quantity: 1,
      image: '',
      size: 'M',
      color: 'Negro'
    },
    {
      id: 'test-2',
      productId: 'test-2',
      name: 'Producto de Prueba 2',
      description: 'Descripción de prueba',
      price: 7800,
      quantity: 2,
      image: '',
      size: 'L',
      color: 'Azul'
    }
  ];

  return (
    <div className="checkout-container">
      <h1>Finalizar Compra</h1>
      
      <div className="checkout-grid">
        {/* Formulario del cliente */}
        <div className="checkout-form-section">
          <h2>Información del cliente</h2>
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-group">
              <label htmlFor="name">Nombre completo *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={customerInfo.name}
                onChange={handleInputChange}
                required
                placeholder="Ej: María González"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  required
                  placeholder="ejemplo@gmail.com"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Teléfono</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  placeholder="11 1234-5678"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="address">Dirección de envío</label>
              <input
                type="text"
                id="address"
                name="address"
                value={customerInfo.address}
                onChange={handleInputChange}
                placeholder="Calle y número"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">Ciudad</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={customerInfo.city}
                  onChange={handleInputChange}
                  placeholder="Ciudad"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="province">Provincia</label>
                <input
                  type="text"
                  id="province"
                  name="province"
                  value={customerInfo.province}
                  onChange={handleInputChange}
                  placeholder="Provincia"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="postalCode">Código postal</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={customerInfo.postalCode}
                onChange={handleInputChange}
                placeholder="1234"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="dni">DNI/CUIL</label>
              <input
                type="text"
                id="dni"
                name="dni"
                value={customerInfo.dni}
                onChange={handleInputChange}
                placeholder="12.345.678"
              />
            </div>
          </form>
          
          <h2>Método de envío</h2>
          <div className="shipping-methods">
            <label className="shipping-option">
              <input
                type="radio"
                name="shipping"
                value="standard"
                checked={shippingInfo.method === 'standard'}
                onChange={handleShippingChange}
              />
              <div className="shipping-content">
                <span className="shipping-title">Envío estándar</span>
                <span className="shipping-price">$800</span>
                <span className="shipping-time">3-5 días hábiles</span>
              </div>
            </label>
            
            <label className="shipping-option">
              <input
                type="radio"
                name="shipping"
                value="express"
                checked={shippingInfo.method === 'express'}
                onChange={handleShippingChange}
              />
              <div className="shipping-content">
                <span className="shipping-title">Envío express</span>
                <span className="shipping-price">$1.500</span>
                <span className="shipping-time">24-48 horas</span>
              </div>
            </label>
          </div>
        </div>
        
        {/* Resumen del pedido */}
        <div className="checkout-summary">
          <h2>Resumen del pedido</h2>
          
          <div className="order-items">
            {prepareCartItems().map((item, index) => (
              <div key={`${item.id}-${index}`} className="order-item">
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  {item.size && <span className="item-size">Talle: {item.size}</span>}
                  {item.color && <span className="item-color">Color: {item.color}</span>}
                </div>
                <div className="item-quantity">x{item.quantity}</div>
                <div className="item-price">${item.price * item.quantity}</div>
              </div>
            ))}
          </div>
          
          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>${total}</span>
            </div>
            <div className="total-row">
              <span>Envío:</span>
              <span>${shippingInfo.cost}</span>
            </div>
            <div className="total-row grand-total">
              <span>Total:</span>
              <span>${total + shippingInfo.cost}</span>
            </div>
          </div>
          
          {/* Métodos de pago */}
          <div className="payment-methods-info">
            <h3>Métodos de pago aceptados</h3>
            <div className="payment-icons">
              <span title="Tarjetas de crédito">💳</span>
              <span title="Tarjetas de débito">🏦</span>
              <span title="PagoFácil">🏪</span>
              <span title="RapiPago">📱</span>
              <span title="Western Union">🌍</span>
            </div>
          </div>
          
          {/* Botón de pago */}
          <div className="payment-section">
            {/* 🔧 PRUEBA 1: Con datos reales del carrito */}
            <PaymentButton
              cartItems={prepareCartItems()}
              customerInfo={customerInfo}
              shippingInfo={shippingInfo}
              onSuccess={() => {
                clearCart();
                navigate('/payment/success');
              }}
              onError={(error) => {
                console.error('Payment error:', error);
                alert(`❌ Error: ${error.message}\n\nPrueba con datos de prueba en la consola.`);
                navigate('/payment/failure');
              }}
              disabled={!customerInfo.name || !customerInfo.email || prepareCartItems().length === 0}
            />
            
            {/* 🔧 PRUEBA 2: Datos fijos (descomentar para probar) */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button 
                onClick={() => {
                  // Usar datos de prueba directamente
                  const testCustomerInfo = {
                    name: 'Test User',
                    email: 'bylualiendo@gmail.com',
                    phone: '1122334455'
                  };
                  
                  const testShippingInfo = {
                    method: 'standard',
                    cost: 800
                  };
                  
                  // Llamar directamente a processPayment con datos de prueba
                  import('../services/paymentService').then(({ processPayment }) => {
                    processPayment(testCartItems, testCustomerInfo, testShippingInfo)
                      .then(() => {
                        clearCart();
                        navigate('/payment/success');
                      })
                      .catch(error => {
                        console.error('Test payment error:', error);
                        alert(`Error de prueba: ${error.message}`);
                      });
                  });
                }}
                className="test-payment-btn"
                style={{
                  background: '#ff6b6b',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                🧪 Probar con Datos Fijos (Debug)
              </button>
              <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                Usa esto si el carrito real no funciona
              </p>
            </div>
            
            <p className="secure-payment-note">
              🔒 Pago seguro procesado por MercadoPago. Tus datos están protegidos.
            </p>
            
            <p className="sandbox-notice">
              ⚠️ <strong>MODO PRUEBAS:</strong> Estás en entorno de desarrollo. 
              No se realizarán cargos reales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;