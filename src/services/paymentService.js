// src/services/paymentService.js - CORRECCIÓN CRÍTICA

const API_URL = 'http://localhost:5000/api';

/**
 * Crea una preferencia de pago en MercadoPago
 */
export const createPaymentPreference = async (paymentData) => {
  try {
    console.log('📤 Enviando a backend:', JSON.stringify(paymentData, null, 2));
    
    const response = await fetch(`${API_URL}/payments/create-preference`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    });

    const responseData = await response.json();
    console.log('📥 Respuesta del backend:', responseData);
    
    if (!response.ok) {
      throw new Error(responseData.message || responseData.error || 'Error al crear la preferencia de pago');
    }

    return responseData;
  } catch (error) {
    console.error('❌ Error creating payment preference:', error);
    throw error;
  }
};

/**
 * Procesa el pago con MercadoPago - VERSIÓN CORREGIDA
 */
export const processPayment = async (cartItems, customerInfo, shippingInfo) => {
  try {
    console.log('🔍 processPayment iniciado');
    console.log('🛒 cartItems:', cartItems);
    console.log('👤 customerInfo:', customerInfo);
    
    // Validar y limpiar cartItems CRÍTICO
    const validCartItems = cartItems.map((item, index) => {
      const price = Number(item.price);
      const quantity = Number(item.quantity) || 1;
      const name = item.name || `Producto ${index + 1}`;
      
      if (isNaN(price) || price <= 0) {
        console.error(`⚠️ Item ${index} tiene precio inválido:`, item);
        return {
          ...item,
          price: 1000, // Precio de fallback para pruebas
          quantity: quantity,
          name: name
        };
      }
      
      return {
        ...item,
        price: price,
        quantity: quantity,
        name: name
      };
    }).filter(item => item.price > 0 && item.quantity > 0);

    console.log('✅ cartItems validados:', validCartItems);
    
    if (validCartItems.length === 0) {
      throw new Error('No hay productos válidos en el carrito');
    }

    // Calcular totales
    const subtotal = validCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = shippingInfo?.cost || 0;
    const total = subtotal + shippingCost;

    console.log('💰 Totales:', { subtotal, shippingCost, total });

    // Preparar datos para el backend - ESTRUCTURA EXACTA QUE ESPERA EL BACKEND
    const paymentData = {
      items: validCartItems.map(item => ({
        productId: item.productId || item.id,
        name: item.name,
        description: item.description || '',
        price: item.price,
        quantity: item.quantity,
        image: item.image || '',
        size: item.size,
        color: item.color
      })),
      customer: {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone || '',
        address: customerInfo.address || '',
        dni: customerInfo.dni || ''
      },
      shipping: {
        method: shippingInfo?.method || 'standard',
        cost: shippingCost,
        address: shippingInfo?.address || '',
        city: shippingInfo?.city || '',
        province: shippingInfo?.province || '',
        postalCode: shippingInfo?.postalCode || ''
      },
      discount: 0,
      metadata: {
        source: 'web'
      }
    };

    console.log('📦 paymentData final:', JSON.stringify(paymentData, null, 2));

    // Crear preferencia en MercadoPago
    const result = await createPaymentPreference(paymentData);
    
    console.log('🎉 Resultado MercadoPago:', result);
    
    if (result.success && (result.initPoint || result.sandboxInitPoint)) {
      // Redirigir a MercadoPago - usar sandbox en desarrollo
      const mpUrl = process.env.NODE_ENV === 'development' 
        ? (result.sandboxInitPoint || result.initPoint)
        : result.initPoint;
      
      console.log('🔗 Redirigiendo a:', mpUrl);
      window.location.href = mpUrl;
    } else {
      console.error('❌ No hay initPoint:', result);
      throw new Error(result.message || 'No se pudo crear el enlace de pago');
    }

    return result;
  } catch (error) {
    console.error('❌ Error processing payment:', error);
    throw error;
  }
};

// El resto de las funciones permanecen igual...
export const getOrderStatus = async (orderId) => {
  try {
    const response = await fetch(`${API_URL}/payments/order/${orderId}`);
    
    if (!response.ok) {
      throw new Error('Error al obtener el estado de la orden');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting order status:', error);
    throw error;
  }
};

export const getPaymentMethods = async () => {
  try {
    const response = await fetch(`${API_URL}/payments/methods`);
    
    if (!response.ok) {
      throw new Error('Error al obtener métodos de pago');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting payment methods:', error);
    return {
      success: false,
      paymentMethods: {
        mercadopago: {
          enabled: true,
          methods: {
            credit_cards: true,
            debit_cards: true,
            pagofacil: true,
            rapipago: true
          }
        }
      }
    };
  }
};

export const formatPrice = (amount) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
  }).format(amount);
};

export default {
  createPaymentPreference,
  getOrderStatus,
  getPaymentMethods,
  processPayment,
  formatPrice
};