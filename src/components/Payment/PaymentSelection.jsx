import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';
import './PaymentSelection.css';

const PaymentSelection = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('card');
  
  // ✅ ESTADO PARA DATOS DEL CLIENTE
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '1000'
  });

  const [showForm, setShowForm] = useState(true); // Mostrar formulario por defecto
  
  const cartTotal = getCartTotal();
  const shippingCost = 800;
  const totalWithShipping = cartTotal + shippingCost;

  // Si el carrito está vacío, volver al carrito
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!customerData.name.trim()) {
      setError('Por favor ingresa tu nombre');
      return false;
    }
    if (!customerData.email.trim()) {
      setError('Por favor ingresa tu email');
      return false;
    }
    // Validación simple de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerData.email)) {
      setError('Por favor ingresa un email válido');
      return false;
    }
    if (!customerData.phone.trim()) {
      setError('Por favor ingresa tu teléfono');
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    // Validar formulario
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Preparar items para MercadoPago
      const items = cart.map((item, index) => ({
        id: item._id || item.product?._id || `item-${index}-${Date.now()}`,
        title: item.product?.name || item.nombre || 'Producto',
        description: item.product?.description || 'Producto de By Luciana',
        quantity: item.quantity,
        unit_price: item.product?.price || item.precio || 0,
        currency_id: 'ARS',
        picture_url: item.product?.images?.[0] || item.imagen?.[0] || ''
      }));

      // Extraer código de área y número de teléfono
      const phoneStr = customerData.phone.replace(/\D/g, '');
      const areaCode = phoneStr.length >= 10 ? phoneStr.substring(0, 3) : '11';
      const phoneNumber = phoneStr.length >= 10 ? parseInt(phoneStr.substring(3)) || 12345678 : parseInt(phoneStr) || 12345678;

      // Preparar datos del cliente
      const payer = {
        name: customerData.name.split(' ')[0] || 'Cliente',
        surname: customerData.name.split(' ').slice(1).join(' ') || 'Invitado',
        email: customerData.email,
        phone: {
          area_code: areaCode,
          number: phoneNumber
        },
        address: {
          zip_code: customerData.postalCode || '1000',
          street_name: customerData.address || 'Calle Principal',
          street_number: 123,
          city: customerData.city || 'Buenos Aires'
        }
      };

      const paymentData = {
        items,
        payer,
        payment_method_id: selectedMethod,
        customerData: customerData // Guardamos también los datos completos
      };

      console.log('🔄 Creando pago con datos:', paymentData);

      // Crear preferencia en MercadoPago
      const response = await api.post('/api/payments/create-preference', paymentData);
      
      // ✅ CORRECCIÓN CRÍTICA: Validar que response no sea null
      if (!response) {
        throw new Error('No se recibió respuesta del servidor');
      }
      
      // ✅ Validar que response.data exista
      if (!response.data) {
        throw new Error('La respuesta del servidor no contiene datos');
      }
      
      if (response.data.success) {
        console.log('✅ Preferencia creada:', response.data);
        
        // Limpiar carrito
        clearCart();
        
        // Guardar datos del cliente localmente (para mostrar en success page)
        localStorage.setItem('lastCustomerData', JSON.stringify(customerData));
        
        // ✅ CORRECCIÓN: Usar los nombres de propiedades correctos
        // Tu backend devuelve 'sandboxInitPoint' y 'initPoint', no 'sandbox_init_point'
        const redirectUrl = response.data.sandboxInitPoint || response.data.initPoint;
        
        if (!redirectUrl) {
          throw new Error('No se recibió URL de redirección');
        }
        
        console.log('📍 Redirigiendo a:', redirectUrl);
        window.location.href = redirectUrl;
      } else {
        setError('Error al crear el pago: ' + (response.data.message || 'Intenta nuevamente'));
      }

    } catch (err) {
      console.error('❌ Error en el pago:', err);
      setError('Error al procesar el pago. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-selection-container">
      <div className="payment-selection">
        <h1>💳 Finalizar Compra</h1>
        
        {/* RESUMEN DEL PEDIDO */}
        <div className="order-summary">
          <h3>Resumen de tu compra</h3>
          <div className="summary-items">
            {cart.map((item, index) => (
              <div key={index} className="summary-item">
                <span>{item.product?.name || item.nombre} x {item.quantity}</span>
                <span>${((item.product?.price || item.precio) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="summary-item">
              <span>Envío</span>
              <span>${shippingCost}.00</span>
            </div>
            <div className="summary-total">
              <span>Total a pagar:</span>
              <span>${totalWithShipping.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* FORMULARIO DE DATOS DEL CLIENTE */}
        <div className="customer-form-section">
          <h3>📝 Tus datos para la factura</h3>
          <p className="form-subtitle">Completa tus datos para generar la factura y enviarte el pedido</p>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre y Apellido *</label>
              <input
                type="text"
                name="name"
                value={customerData.name}
                onChange={handleInputChange}
                placeholder="Ej: María González"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={customerData.email}
                onChange={handleInputChange}
                placeholder="tucorreo@ejemplo.com"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Teléfono *</label>
              <input
                type="tel"
                name="phone"
                value={customerData.phone}
                onChange={handleInputChange}
                placeholder="11 1234-5678"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Dirección</label>
              <input
                type="text"
                name="address"
                value={customerData.address}
                onChange={handleInputChange}
                placeholder="Calle y número"
              />
            </div>
            
            <div className="form-group">
              <label>Ciudad</label>
              <input
                type="text"
                name="city"
                value={customerData.city}
                onChange={handleInputChange}
                placeholder="Buenos Aires"
              />
            </div>
            
            <div className="form-group">
              <label>Código Postal</label>
              <input
                type="text"
                name="postalCode"
                value={customerData.postalCode}
                onChange={handleInputChange}
                placeholder="1000"
              />
            </div>
          </div>
          
          <div className="form-note">
            <p>📧 Recibirás la factura en el email que ingreses</p>
            <p>📦 El pedido se enviará a la dirección que proporciones</p>
            <p>🔒 Tus datos están protegidos y solo se usan para esta compra</p>
          </div>
        </div>

        {/* MÉTODOS DE PAGO */}
        <div className="payment-methods-section">
          <h3>Selecciona cómo quieres pagar</h3>
          
          <div className="payment-options">
            <div 
              className={`payment-option ${selectedMethod === 'card' ? 'selected' : ''}`}
              onClick={() => setSelectedMethod('card')}
            >
              <div className="option-icon">💳</div>
              <div className="option-details">
                <h4>Tarjeta de crédito/débito</h4>
                <p>Visa, Mastercard, Naranja, Cabal, American Express</p>
              </div>
              <div className="option-check">✓</div>
            </div>

            <div 
              className={`payment-option ${selectedMethod === 'wallet_purchase' ? 'selected' : ''}`}
              onClick={() => setSelectedMethod('wallet_purchase')}
            >
              <div className="option-icon">💰</div>
              <div className="option-details">
                <h4>Mercado Pago</h4>
                <p>Paga con tu saldo de Mercado Pago</p>
              </div>
              <div className="option-check">✓</div>
            </div>

            <div 
              className={`payment-option ${selectedMethod === 'ticket' ? 'selected' : ''}`}
              onClick={() => setSelectedMethod('ticket')}
            >
              <div className="option-icon">🏧</div>
              <div className="option-details">
                <h4>Efectivo</h4>
                <p>PagoFácil, RapiPago, CobroExpress</p>
              </div>
              <div className="option-check">✓</div>
            </div>

            <div 
              className={`payment-option ${selectedMethod === 'bank_transfer' ? 'selected' : ''}`}
              onClick={() => setSelectedMethod('bank_transfer')}
            >
              <div className="option-icon">🏦</div>
              <div className="option-details">
                <h4>Transferencia bancaria</h4>
                <p>Transferencia directa o PIX</p>
              </div>
              <div className="option-check">✓</div>
            </div>
          </div>
        </div>

        {/* MENSAJES DE ERROR */}
        {error && (
          <div className="error-message">
            <span>{error}</span>
            <button onClick={() => setError('')} className="close-error">×</button>
          </div>
        )}

        {/* BOTONES DE ACCIÓN */}
        <div className="payment-actions">
          <button 
            className="back-button"
            onClick={() => navigate('/cart')}
            disabled={loading}
          >
            ← Volver al carrito
          </button>
          
          <button 
            className="pay-button"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span> Procesando...
              </>
            ) : (
              `Pagar $${totalWithShipping.toFixed(2)}`
            )}
          </button>
        </div>

        {/* INFORMACIÓN DE SEGURIDAD */}
        <div className="payment-security">
          <h4>🔒 Compra 100% segura</h4>
          <div className="security-features">
            <div className="feature">
              <span>✅</span>
              <p>Factura electrónica automática al email</p>
            </div>
            <div className="feature">
              <span>✅</span>
              <p>Protegido por Mercado Pago</p>
            </div>
            <div className="feature">
              <span>✅</span>
              <p>Datos cifrados y seguros</p>
            </div>
            <div className="feature">
              <span>✅</span>
              <p>Soporte post-venta incluido</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSelection;