// src/pages/PaymentFailure.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { getOrderStatus } from '../services/paymentService';
import './PaymentFailure.css';

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const orderId = searchParams.get('orderId');
  const paymentId = searchParams.get('paymentId');
  const errorCode = searchParams.get('error');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (orderId) {
        try {
          const response = await getOrderStatus(orderId);
          if (response.success) {
            setOrder(response.order);
          }
        } catch (err) {
          console.error('Error fetching order:', err);
        }
      }
      setLoading(false);
    };

    fetchOrderDetails();
    
    // Mostrar alerta de error
    setTimeout(() => {
      alert('❌ Hubo un problema con tu pago.\n\nPor favor, revisa los datos e intenta nuevamente.');
    }, 500);
  }, [orderId]);

  const getErrorMessage = () => {
    if (errorCode) {
      const errorMessages = {
        'payment_id_missing': 'No se encontró el ID del pago.',
        'order_not_found': 'No se encontró la orden.',
        'server_error': 'Error interno del servidor.',
        'insufficient_funds': 'Fondos insuficientes en la cuenta.',
        'card_declined': 'Tarjeta rechazada.',
        'expired_card': 'Tarjeta vencida.',
        'invalid_card': 'Tarjeta inválida.',
        'payment_cancelled': 'Pago cancelado por el usuario.',
        'timeout': 'Tiempo de espera agotado.'
      };
      return errorMessages[errorCode] || 'Error desconocido en el pago.';
    }
    return 'Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.';
  };

  const getErrorSuggestions = () => {
    const suggestions = {
      'insufficient_funds': [
        'Verifica el saldo de tu tarjeta o cuenta.',
        'Intenta con otro método de pago.',
        'Contacta con tu entidad bancaria.'
      ],
      'card_declined': [
        'Verifica los datos de tu tarjeta.',
        'Asegúrate de que la tarjeta esté habilitada para compras online.',
        'Contacta con tu banco para autorizar la transacción.'
      ],
      'expired_card': [
        'Utiliza una tarjeta vigente.',
        'Verifica la fecha de vencimiento.'
      ],
      'default': [
        'Revisa que todos los datos sean correctos.',
        'Intenta con otro método de pago.',
        'Verifica tu conexión a internet.',
        'Espera unos minutos e intenta nuevamente.'
      ]
    };

    return suggestions[errorCode] || suggestions['default'];
  };

  const handleRetryPayment = () => {
    if (order) {
      navigate(`/checkout?orderId=${order._id}`);
    } else {
      navigate('/cart');
    }
  };

  const handleContactSupport = () => {
    const subject = encodeURIComponent(`Problema con pago - Orden: ${order?.orderNumber || 'N/A'}`);
    const body = encodeURIComponent(
      `Hola,\n\nTuve un problema con mi pago.\n` +
      `Orden: ${order?.orderNumber || 'N/A'}\n` +
      `Error: ${getErrorMessage()}\n` +
      `ID de pago: ${paymentId || 'N/A'}\n\n` +
      `Por favor, ayúdenme a resolverlo.`
    );
    
    window.location.href = `mailto:bylualiendo@gmail.com?subject=${subject}&body=${body}`;
  };

  if (loading) {
    return (
      <div className="payment-failure-container loading">
        <div className="loading-spinner"></div>
        <p>Analizando el error...</p>
      </div>
    );
  }

  return (
    <div className="payment-failure-container">
      {/* Encabezado de error */}
      <div className="failure-header">
        <div className="failure-icon">❌</div>
        <h1>Pago no procesado</h1>
        <p className="failure-message">{getErrorMessage()}</p>
      </div>

      {/* Detalles del error */}
      <div className="error-details">
        <h2>Detalles del error</h2>
        
        <div className="details-grid">
          {order && (
            <div className="detail-card">
              <div className="detail-icon">📝</div>
              <div className="detail-content">
                <h4>Orden afectada</h4>
                <p className="order-number">{order.orderNumber}</p>
                <p className="order-date">
                  {new Date(order.createdAt).toLocaleDateString('es-AR')}
                </p>
              </div>
            </div>
          )}
          
          {paymentId && (
            <div className="detail-card">
              <div className="detail-icon">💰</div>
              <div className="detail-content">
                <h4>ID de transacción</h4>
                <p className="payment-id">{paymentId}</p>
                <p className="payment-note">Proporciona este ID si contactas soporte</p>
              </div>
            </div>
          )}
          
          <div className="detail-card">
            <div className="detail-icon">⏰</div>
            <div className="detail-content">
              <h4>Hora del error</h4>
              <p className="error-time">{new Date().toLocaleTimeString('es-AR')}</p>
              <p className="error-date">{new Date().toLocaleDateString('es-AR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Soluciones sugeridas */}
      <div className="suggestions">
        <h2>¿Qué puedes hacer?</h2>
        
        <div className="suggestion-list">
          {getErrorSuggestions().map((suggestion, index) => (
            <div key={index} className="suggestion-item">
              <span className="suggestion-number">{index + 1}</span>
              <span className="suggestion-text">{suggestion}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Métodos de pago alternativos */}
      <div className="alternative-payments">
        <h2>Métodos de pago alternativos</h2>
        <p>También puedes pagar mediante:</p>
        
        <div className="payment-methods-grid">
          <div className="payment-method">
            <div className="method-icon">🏪</div>
            <div className="method-content">
              <h4>Pago Fácil</h4>
              <p>Paga en efectivo en miles de locaciones</p>
            </div>
          </div>
          
          <div className="payment-method">
            <div className="method-icon">🌍</div>
            <div className="method-content">
              <h4>Western Union</h4>
              <p>Transferencia internacional</p>
            </div>
          </div>
          
          <div className="payment-method">
            <div className="method-icon">🏦</div>
            <div className="method-content">
              <h4>Transferencia bancaria</h4>
              <p>Datos en la página de checkout</p>
            </div>
          </div>
          
          <div className="payment-method">
            <div className="method-icon">📱</div>
            <div className="method-content">
              <h4>Rapi Pago</h4>
              <p>Pago en efectivo rápido</p>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="action-buttons">
        <button onClick={handleRetryPayment} className="btn btn-primary">
          Reintentar pago
        </button>
        
        <button onClick={() => navigate('/cart')} className="btn btn-secondary">
          Volver al carrito
        </button>
        
        <button onClick={handleContactSupport} className="btn btn-outline">
          Contactar soporte
        </button>
      </div>

      {/* Información importante */}
      <div className="important-info">
        <div className="info-box">
          <h3>⚠️ No se realizó ningún cargo</h3>
          <p>
            Tu pago fue rechazado antes de completarse. 
            <strong> No se realizó ningún cargo a tu cuenta.</strong>
          </p>
        </div>
        
        <div className="info-box">
          <h3>📞 ¿Necesitas ayuda?</h3>
          <p>
            Contacta a nuestro equipo de soporte:<br />
            <strong>Email:</strong> byluciendo@gmail.com<br />
            <strong>WhatsApp:</strong> +54 9 11 1234-5678
          </p>
        </div>
        
        <div className="info-box">
          <h3>💳 Tarjetas de prueba</h3>
          <p>
            Si estás en modo de pruebas, usa:<br />
            <strong>Visa:</strong> 4509 9535 6623 3704 (CVV: 123)<br />
            <strong>Mastercard:</strong> 5031 7557 3453 0604 (CVV: 123)
          </p>
        </div>
      </div>

      {/* Volver a inicio */}
      <div className="back-to-home">
        <Link to="/" className="home-link">
          ← Volver a la página principal
        </Link>
      </div>
    </div>
  );
};

export default PaymentFailure;