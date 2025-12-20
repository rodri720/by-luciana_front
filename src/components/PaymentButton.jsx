// src/components/PaymentButton.jsx
import React, { useState } from 'react';
import { processPayment, formatPrice } from '../services/paymentService';
import './PaymentButton.css';

const PaymentButton = ({ 
  cartItems = [], 
  customerInfo = {}, 
  shippingInfo = {},
  onSuccess = () => {},
  onError = () => {},
  className = '',
  disabled = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calcular total
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = shippingInfo?.cost || 0;
  const total = subtotal + shippingCost;

  const handlePayment = async () => {
    // Validaciones
    if (!cartItems || cartItems.length === 0) {
      setError('El carrito está vacío');
      return;
    }

    if (!customerInfo.name || !customerInfo.email) {
      setError('Por favor completa tu nombre y email');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Mostrar confirmación
      const confirmPayment = window.confirm(
        `¿Confirmar pago de ${formatPrice(total)}?\n\n` +
        `Productos: ${cartItems.length}\n` +
        `Cliente: ${customerInfo.name}\n` +
        `Email: ${customerInfo.email}`
      );

      if (!confirmPayment) {
        setIsLoading(false);
        return;
      }

      // Procesar pago
      await processPayment(cartItems, customerInfo, shippingInfo);
      
      // Éxito
      onSuccess();
      
      // Mostrar alerta de éxito
      alert('✅ ¡Compra exitosa!\n\nSerás redirigido a MercadoPago para completar el pago.');

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Error al procesar el pago');
      onError(err);
      
      // Mostrar alerta de error
      alert(`❌ Error: ${err.message || 'No se pudo procesar el pago'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Determinar si el botón debe estar deshabilitado
  const isButtonDisabled = disabled || isLoading || cartItems.length === 0 || !customerInfo.name || !customerInfo.email;

  return (
    <div className={`payment-button-container ${className}`}>
      {/* Resumen del pago */}
      <div className="payment-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span className="amount">{formatPrice(subtotal)}</span>
        </div>
        
        {shippingCost > 0 && (
          <div className="summary-row">
            <span>Envío:</span>
            <span className="amount">{formatPrice(shippingCost)}</span>
          </div>
        )}
        
        <div className="summary-row total">
          <span className="total-label">Total:</span>
          <span className="total-amount">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Botón de pago */}
      <button
        onClick={handlePayment}
        disabled={isButtonDisabled}
        className={`payment-button ${isLoading ? 'loading' : ''} ${isButtonDisabled ? 'disabled' : ''}`}
      >
        {isLoading ? (
          <>
            <span className="spinner"></span>
            Procesando...
          </>
        ) : (
          <>
            <span className="payment-icon">💳</span>
            Pagar con MercadoPago
            <span className="payment-methods">(Tarjetas, PagoFácil, Western Union)</span>
          </>
        )}
      </button>

      {/* Métodos de pago aceptados */}
      <div className="accepted-methods">
        <span className="methods-label">Aceptamos:</span>
        <div className="method-icons">
          <span className="method-icon" title="Tarjetas de crédito">💳</span>
          <span className="method-icon" title="Tarjetas de débito">🏦</span>
          <span className="method-icon" title="PagoFácil">🏪</span>
          <span className="method-icon" title="RapiPago">📱</span>
          <span className="method-icon" title="Western Union">🌍</span>
        </div>
      </div>

      {/* Mensajes de error */}
      {error && (
        <div className="payment-error">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Mensajes de validación */}
      {!customerInfo.name && (
        <div className="validation-message">
          ⚠️ Ingresa tu nombre para continuar
        </div>
      )}
      
      {!customerInfo.email && (
        <div className="validation-message">
          ⚠️ Ingresa tu email para continuar
        </div>
      )}
      
      {cartItems.length === 0 && (
        <div className="validation-message">
          ⚠️ Agrega productos al carrito para pagar
        </div>
      )}

      {/* Información adicional */}
      <div className="payment-info">
        <p className="info-text">
          <strong>💰 Prueba el pago con tarjetas de prueba:</strong>
        </p>
        <ul className="test-cards">
          <li>Visa: 4509 9535 6623 3704 (cualquier fecha futuro, CVV 123)</li>
          <li>Mastercard: 5031 7557 3453 0604 (cualquier fecha futuro, CVV 123)</li>
          <li>AMEX: 3711 8030 3257 522 (cualquier fecha futuro, CVV 1234)</li>
        </ul>
        <p className="sandbox-notice">
          <strong>⚠️ MODO PRUEBAS:</strong> Estás en entorno de desarrollo. 
          No se realizarán cargos reales.
        </p>
      </div>
    </div>
  );
};

export default PaymentButton;