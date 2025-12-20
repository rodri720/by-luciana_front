// src/components/BackendStatus.jsx
import React from 'react';
import { useProducts } from '../context/ProductContext';

const BackendStatus = () => {
  const { backendStatus, error, refetchProducts } = useProducts();

  if (backendStatus === 'connected') return null;

  const getStatusConfig = () => {
    switch (backendStatus) {
      case 'disconnected':
        return {
          message: '❌ Backend no disponible',
          color: '#f44336',
          action: true
        };
      case 'timeout':
        return {
          message: '⏰ Backend no responde',
          color: '#ff9800', 
          action: true
        };
      case 'fallback':
        return {
          message: '📱 Usando datos de ejemplo',
          color: '#2196f3',
          action: false
        };
      case 'error':
        return {
          message: '⚠️ Error en el backend',
          color: '#ff9800',
          action: true
        };
      default:
        return {
          message: '🔍 Conectando...',
          color: '#2196f3',
          action: false
        };
    }
  };

  const { message, color, action } = getStatusConfig();

  return (
    <div style={{
      background: color + '20',
      border: `1px solid ${color}`,
      color: color,
      padding: '12px 16px',
      margin: '10px 0',
      borderRadius: '8px',
      fontSize: '14px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{message}</span>
        {action && (
          <button 
            onClick={refetchProducts}
            style={{
              background: color,
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            🔄 Reintentar
          </button>
        )}
      </div>
      {error && (
        <div style={{ 
          marginTop: '8px', 
          fontSize: '12px', 
          background: '#00000010', 
          padding: '8px',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}
      {backendStatus === 'disconnected' && (
        <div style={{ marginTop: '8px', fontSize: '12px' }}>
          <strong>💡 Solución:</strong> Abre terminal y ejecuta:<br/>
          <code style={{ background: '#f5f5f5', padding: '4px 8px', borderRadius: '4px' }}>
            cd by-luciana-back && npm start
          </code>
        </div>
      )}
    </div>
  );
};

export default BackendStatus;