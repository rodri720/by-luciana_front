// Crea este componente
// src/components/PaymentSuccessModal.jsx
import React from 'react';

const PaymentSuccessModal = ({ isOpen, onClose, orderId, total }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        textAlign: 'center',
        maxWidth: '400px',
        width: '90%'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '15px' }}>🎉</div>
        <h2 style={{ color: '#28a745', marginBottom: '15px' }}>
          ¡Compra Exitosa!
        </h2>
        <p style={{ marginBottom: '10px' }}>
          <strong>Número de orden:</strong> {orderId}
        </p>
        <p style={{ marginBottom: '10px' }}>
          <strong>Total:</strong> ${total.toLocaleString('es-AR')}
        </p>
        <p style={{ marginBottom: '20px', color: '#666' }}>
          Recibirás un email de confirmación con los detalles de tu compra.
        </p>
        <button 
          onClick={onClose}
          style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;