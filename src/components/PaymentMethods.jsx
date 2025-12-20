import React from 'react';
import './PaymentMethods.css';

const PaymentMethods = ({ selectedMethod, onSelect }) => {
  const methods = [
    {
      id: 'card',
      name: 'Tarjeta de crédito/débito',
      description: 'Pago seguro con todas las tarjetas',
      icon: '💳',
      methods: ['Visa', 'Mastercard', 'American Express', 'Naranja', 'Cabal']
    },
    {
      id: 'mercadopago',
      name: 'Mercado Pago',
      description: 'Pago con saldo de Mercado Pago',
      icon: '🟡',
      methods: ['Saldo MP', 'Mercado Crédito']
    },
    {
      id: 'pagofacil',
      name: 'Pago Fácil',
      description: 'Paga en efectivo en cualquier sucursal',
      icon: '🏪',
      methods: ['Efectivo']
    },
    {
      id: 'rapipago',
      name: 'RapiPago',
      description: 'Paga en efectivo en cualquier sucursal',
      icon: '🏪',
      methods: ['Efectivo']
    },
    {
      id: 'western_union',
      name: 'Western Union',
      description: 'Paga en cualquier agencia Western Union',
      icon: '🌎',
      methods: ['Efectivo', 'Transferencia']
    },
    {
      id: 'transfer',
      name: 'Transferencia bancaria',
      description: 'Transferencia directa a nuestra cuenta',
      icon: '🏦',
      methods: ['Transferencia']
    }
  ];

  return (
    <div className="payment-methods">
      <h3>Selecciona tu método de pago</h3>
      
      <div className="methods-grid">
        {methods.map(method => (
          <div 
            key={method.id}
            className={`method-card ${selectedMethod === method.id ? 'selected' : ''}`}
            onClick={() => onSelect(method.id)}
          >
            <div className="method-header">
              <span className="method-icon">{method.icon}</span>
              <h4>{method.name}</h4>
            </div>
            
            <p className="method-description">{method.description}</p>
            
            <div className="method-types">
              {method.methods.map(type => (
                <span key={type} className="method-type">{type}</span>
              ))}
            </div>
            
            {selectedMethod === method.id && (
              <div className="selected-indicator">✓ Seleccionado</div>
            )}
          </div>
        ))}
      </div>

      <div className="payment-info-note">
        <p>💡 <strong>Importante:</strong> Para pagos con tarjeta serás redirigido a Mercado Pago</p>
        <p>✅ Todos los pagos son 100% seguros y están protegidos</p>
      </div>
    </div>
  );
};

export default PaymentMethods;