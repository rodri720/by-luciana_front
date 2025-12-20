import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [paymentData, setPaymentData] = useState(null);

  const paymentId = searchParams.get('payment_id');
  const externalReference = searchParams.get('external_reference');

  useEffect(() => {
    const checkPayment = async () => {
      if (paymentId) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/payments/${paymentId}`
          );
          
          setPaymentData(response.data);
          
          switch (response.data.status) {
            case 'approved':
              setStatus('success');
              break;
            case 'rejected':
              setStatus('failure');
              break;
            case 'in_process':
            case 'pending':
              setStatus('pending');
              break;
            default:
              setStatus('failure');
          }
        } catch (error) {
          console.error('Error checking payment:', error);
          setStatus('error');
        }
      }
    };

    checkPayment();
  }, [paymentId]);

  const renderContent = () => {
    switch (status) {
      case 'success':
        return (
          <div className="success">
            <h2>✅ Pago Aprobado</h2>
            <p>Tu pago fue procesado exitosamente.</p>
            <p>ID de transacción: {paymentData?.id}</p>
            <p>Enviaremos los detalles a tu email.</p>
          </div>
        );
      
      case 'pending':
        return (
          <div className="pending">
            <h2>⏳ Pago Pendiente</h2>
            <p>Tu pago está siendo procesado.</p>
            
            {paymentData?.payment_method_id === 'pagofacil' && (
              <div className="payment-instructions">
                <h4>Instrucciones para Pago Fácil:</h4>
                <ol>
                  <li>Acércate a cualquier sucursal de Pago Fácil</li>
                  <li>Proporciona el número de factura: {externalReference}</li>
                  <li>Realiza el pago en efectivo</li>
                  <li>Guarda el comprobante</li>
                </ol>
              </div>
            )}
            
            {paymentData?.payment_method_id === 'western_union' && (
              <div className="payment-instructions">
                <h4>Instrucciones para Western Union:</h4>
                <ol>
                  <li>Acércate a una agencia Western Union</li>
                  <li>Menciona que es un pago Mercado Pago</li>
                  <li>Proporciona el código de pago: {externalReference}</li>
                  <li>Realiza el pago en efectivo</li>
                </ol>
              </div>
            )}
          </div>
        );
      
      case 'failure':
        return (
          <div className="failure">
            <h2>❌ Pago Rechazado</h2>
            <p>Tu pago no pudo ser procesado.</p>
            <p>Por favor intenta con otro método de pago.</p>
          </div>
        );
      
      default:
        return <p>Cargando...</p>;
    }
  };

  return (
    <div className="payment-result">
      {renderContent()}
      <button onClick={() => window.location.href = '/'}>
        Volver al inicio
      </button>
    </div>
  );
};

export default PaymentResult;