// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

// Hook personalizado - debe estar dentro del archivo pero no como export directo
const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Provider component
const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const loadCartFromStorage = () => {
      try {
        console.log('🔄 Cargando carrito desde localStorage...');
        setLoading(true);
        const savedCart = localStorage.getItem('byLuciana_cart');
        console.log('📦 Carrito guardado encontrado:', savedCart);
        
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          console.log('✅ Carrito parseado:', parsedCart);
          setCart(parsedCart);
        } else {
          console.log('❌ No hay carrito guardado en localStorage');
        }
      } catch (error) {
        console.log('🚨 Error loading cart from storage:', error);
        setCart([]);
      } finally {
        setLoading(false);
        console.log('🏁 Carga del carrito completada');
      }
    };

    loadCartFromStorage();
  }, []);

  const addToCart = (product, quantity = 1) => {
    console.log('🛒 Intentando agregar al carrito:', { 
      product: product?.name || 'Sin nombre', 
      productId: product?._id,
      quantity 
    });

    try {
      setCart(prevCart => {
        console.log('📋 Carrito actual:', prevCart);
        
        const existingItem = prevCart.find(item => item.product?._id === product._id);
        console.log('🔍 Item existente encontrado:', existingItem);

        let updatedCart;

        if (existingItem) {
          console.log('📝 Actualizando cantidad del item existente');
          updatedCart = prevCart.map(item =>
            item.product?._id === product._id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          console.log('➕ Agregando nuevo item al carrito');
          updatedCart = [...prevCart, { 
            _id: Date.now().toString(),
            product, 
            quantity,
            addedAt: new Date().toISOString()
          }];
        }

        console.log('🔄 Carrito actualizado:', updatedCart);

        // Guardar en localStorage
        localStorage.setItem('byLuciana_cart', JSON.stringify(updatedCart));
        console.log('💾 Carrito guardado en localStorage');
        
        return updatedCart;
      });
    } catch (error) {
      console.error('🚨 Error adding to cart:', error);
    }
  };

  const removeFromCart = (productId) => {
    console.log('🗑️ Intentando eliminar del carrito, productId:', productId);
    
    try {
      setCart(prevCart => {
        console.log('📋 Carrito antes de eliminar:', prevCart);
        const updatedCart = prevCart.filter(item => item.product?._id !== productId);
        console.log('📋 Carrito después de eliminar:', updatedCart);
        
        localStorage.setItem('byLuciana_cart', JSON.stringify(updatedCart));
        console.log('💾 Carrito actualizado guardado en localStorage');
        
        return updatedCart;
      });
    } catch (error) {
      console.error('🚨 Error removing from cart:', error);
    }
  };

  const updateQuantity = (productId, quantity) => {
    console.log('🔢 Actualizando cantidad, productId:', productId, 'cantidad:', quantity);
    
    if (quantity < 1) {
      console.log('❌ Cantidad menor a 1, eliminando producto');
      removeFromCart(productId);
      return;
    }

    try {
      setCart(prevCart => {
        console.log('📋 Carrito antes de actualizar cantidad:', prevCart);
        const updatedCart = prevCart.map(item =>
          item.product?._id === productId
            ? { ...item, quantity }
            : item
        );
        console.log('📋 Carrito después de actualizar cantidad:', updatedCart);
        
        localStorage.setItem('byLuciana_cart', JSON.stringify(updatedCart));
        console.log('💾 Carrito con cantidad actualizada guardado');
        
        return updatedCart;
      });
    } catch (error) {
      console.error('🚨 Error updating quantity:', error);
    }
  };

  const clearCart = () => {
    console.log('🧹 Limpiando carrito completo');
    try {
      setCart([]);
      localStorage.setItem('byLuciana_cart', JSON.stringify([]));
      console.log('✅ Carrito limpiado correctamente');
    } catch (error) {
      console.error('🚨 Error clearing cart:', error);
    }
  };

  const getCartTotal = () => {
    const total = cart.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
    console.log('💰 Calculando total del carrito:', total);
    return total;
  };

  const getCartItemsCount = () => {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    console.log('🔢 Cantidad total de items en carrito:', count);
    return count;
  };

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount
  };

  console.log('🎯 CartContext value actual:', value);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// SOLO exportaciones nombradas para Fast Refresh
export { CartProvider, useCart };
// NO export default - esto causa el problema