// src/pages/PaymentSuccess.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { getOrderStatus, formatPrice } from '../services/paymentService';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const orderId = searchParams.get('orderId');
  const paymentId = searchParams.get('paymentId');
  const status = searchParams.get('status');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (!orderId) {
          setError('No se encontró información de la orden');
          setLoading(false);
          return;
        }

        const response = await getOrderStatus(orderId);
        
        if (response.success) {
          setOrder(response.order);
          
          // Mostrar alerta de éxito
          setTimeout(() => {
            alert('✅ ¡Compra exitosa!\n\nRecibirás la factura en tu email en unos minutos.');
          }, 500);
          
        } else {
          setError('No se pudo obtener la información de la orden');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Error al cargar los detalles de la orden');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleViewOrder = () => {
    if (order) {
      navigate(`/orders/${order._id}`);
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="payment-success-container loading">
        <div className="loading-spinner"></div>
        <p>Cargando confirmación de pago...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="payment-success-container error">
        <div className="error-icon">⚠️</div>
        <h2>No se pudo cargar la información del pago</h2>
        <p>{error || 'Orden no encontrada'}</p>
        <Link to="/" className="back-button">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="payment-success-container">
      {/* Encabezado de éxito */}
      <div className="success-header">
        <div className="success-icon">✅</div>
        <h1>¡Pago Exitoso!</h1>
        <p className="success-message">
          Tu compra ha sido confirmada. Recibirás la factura en tu email en unos minutos.
        </p>
      </div>

      {/* Resumen de la orden */}
      <div className="order-summary">
        <h2>Resumen de tu compra</h2>
        
        <div className="order-details">
          <div className="detail-row">
            <span className="detail-label">Número de orden:</span>
            <span className="detail-value order-number">{order.orderNumber}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Fecha:</span>
            <span className="detail-value">
              {new Date(order.createdAt).toLocaleDateString('es-AR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Estado:</span>
            <span className="detail-value status-badge paid">
              {order.status === 'paid' ? 'Pagado ✅' : order.status}
            </span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">ID de pago:</span>
            <span className="detail-value payment-id">{paymentId || 'N/A'}</span>
          </div>
        </div>

        {/* Información del cliente */}
        <div className="customer-info">
          <h3>Información del cliente</h3>
          <p><strong>Nombre:</strong> {order.customer.name}</p>
          <p><strong>Email:</strong> {order.customer.email}</p>
          {order.customer.phone && <p><strong>Teléfono:</strong> {order.customer.phone}</p>}
        </div>

        {/* Productos comprados */}
        <div className="products-list">
          <h3>Productos comprados</h3>
          <div className="products-table">
            <div className="table-header">
              <div className="col-product">Producto</div>
              <div className="col-quantity">Cantidad</div>
              <div className="col-price">Precio</div>
              <div className="col-subtotal">Subtotal</div>
            </div>
            
            {order.items.map((item, index) => (
              <div key={index} className="table-row">
                <div className="col-product">
                  <div className="product-name">{item.name}</div>
                  {item.color || item.size ? (
                    <div className="product-variants">
                      {item.color && <span className="variant">Color: {item.color}</span>}
                      {item.size && <span className="variant">Talle: {item.size}</span>}
                    </div>
                  ) : null}
                </div>
                <div className="col-quantity">{item.quantity}</div>
                <div className="col-price">{formatPrice(item.price)}</div>
                <div className="col-subtotal">{formatPrice(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Totales */}
        <div className="order-totals">
          <div className="total-row">
            <span>Subtotal:</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          
          {order.discount > 0 && (
            <div className="total-row discount">
              <span>Descuento:</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          
          {order.shippingCost > 0 && (
            <div className="total-row">
              <span>Envío:</span>
              <span>{formatPrice(order.shippingCost)}</span>
            </div>
          )}
          
          <div className="total-row grand-total">
            <span>Total pagado:</span>
            <span className="total-amount">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Información de envío */}
      {order.shipping && order.shipping.method !== 'pickup' && (
        <div className="shipping-info">
          <h3>Información de envío</h3>
          <p><strong>Método:</strong> {order.shipping.method === 'express' ? 'Envío Express' : 'Envío Estándar'}</p>
          {order.shipping.address && <p><strong>Dirección:</strong> {order.shipping.address}</p>}
          {order.shipping.city && <p><strong>Ciudad:</strong> {order.shipping.city}</p>}
          <p className="shipping-note">
            📦 Recibirás un email con el número de seguimiento cuando tu pedido sea despachado.
          </p>
        </div>
      )}

      {/* Acciones */}
      <div className="action-buttons">
        <button onClick={handleContinueShopping} className="btn btn-secondary">
          Seguir comprando
        </button>
        
        <button onClick={handleViewOrder} className="btn btn-primary">
          Ver detalles de la orden
        </button>
        
        <button onClick={handlePrintInvoice} className="btn btn-outline">
          🖨️ Imprimir factura
        </button>
      </div>

      {/* Información adicional */}
      <div className="additional-info">
        <div className="info-card">
          <div className="info-icon">📧</div>
          <div className="info-content">
            <h4>Factura por email</h4>
            <p>La factura ha sido enviada a <strong>{order.customer.email}</strong>. 
               Revisa tu bandeja de entrada y spam.</p>
          </div>
        </div>
        
        <div className="info-card">
          <div className="info-icon">⏱️</div>
          <div className="info-content">
            <h4>Tiempo de procesamiento</h4>
            <p>Tu pedido será procesado en las próximas 24-48 horas.</p>
          </div>
        </div>
        
        <div className="info-card">
          <div className="info-icon">📞</div>
          <div className="info-content">
            <h4>Soporte</h4>
            <p>¿Tienes preguntas? Contáctanos en {process.env.REACT_APP_STORE_EMAIL || 'bylualiendo@gmail.com'}</p>
          </div>
        </div>
      </div>

      {/* Nota importante */}
      <div className="important-note">
        <h4>⚠️ Importante</h4>
        <p>
          Este es un entorno de <strong>pruebas (Sandbox)</strong>. 
          No se realizaron cargos reales a tu tarjeta. 
          Para pagos reales, cambia a modo producción en MercadoPago.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;