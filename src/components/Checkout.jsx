import React, { useState } from 'react';
import axios from 'axios';

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState({
    name: '',
    lastName: '',
    email: '',
    address: ''
  });

  const cartItems = [
    {
      id: '1',
      title: 'Producto 1',
      price: 100,
      quantity: 2
    }
    // ... más productos
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: cartItems,
        payer: customer,
        back_urls: {
          success: `${window.location.origin}/payment/success`,
          failure: `${window.location.origin}/payment/failure`,
          pending: `${window.location.origin}/payment/pending`
        }
      };

      const response = await axios.post(
        'http://localhost:5000/api/payments/create-preference',
        orderData
      );

      // Redirigir a MercadoPago
      window.location.href = response.data.init_point;
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      
      {/* Resumen del carrito */}
      <div className="cart-summary">
        <h3>Resumen de compra</h3>
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <span>{item.title}</span>
            <span>${item.price} x {item.quantity}</span>
          </div>
        ))}
        <div className="total">
          <strong>Total: ${
            cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
          }</strong>
        </div>
      </div>

      {/* Formulario del cliente */}
      <form onSubmit={handleSubmit} className="customer-form">
        <h3>Información del cliente</h3>
        
        <input
          type="text"
          placeholder="Nombre"
          value={customer.name}
          onChange={(e) => setCustomer({...customer, name: e.target.value})}
          required
        />
        
        <input
          type="text"
          placeholder="Apellido"
          value={customer.lastName}
          onChange={(e) => setCustomer({...customer, lastName: e.target.value})}
          required
        />
        
        <input
          type="email"
          placeholder="Email"
          value={customer.email}
          onChange={(e) => setCustomer({...customer, email: e.target.value})}
          required
        />
        
        <input
          type="text"
          placeholder="Dirección"
          value={customer.address}
          onChange={(e) => setCustomer({...customer, address: e.target.value})}
          required
        />

        {/* Medios de pago disponibles */}
        <div className="payment-methods-info">
          <h4>Medios de pago disponibles:</h4>
          <ul>
            <li>✅ Todas las tarjetas de crédito y débito</li>
            <li>✅ Mercado Pago (saldo)</li>
            <li>✅ Pago Fácil</li>
            <li>✅ RapiPago</li>
            <li>✅ Western Union</li>
            <li>✅ Transferencias bancarias</li>
          </ul>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Procesando...' : 'Pagar con Mercado Pago'}
        </button>
      </form>
    </div>
  );
};

export default Checkout;