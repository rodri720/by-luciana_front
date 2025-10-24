// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const loadCartFromStorage = () => {
      try {
        setLoading(true);
        const savedCart = localStorage.getItem('byLuciana_cart');
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
      } catch (error) {
        console.log('Error loading cart from storage:', error);
        setCart([]);
      } finally {
        setLoading(false);
      }
    };

    loadCartFromStorage();
  }, []);

  const addToCart = (product, quantity = 1) => {
    try {
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.product?._id === product._id);
        let updatedCart;

        if (existingItem) {
          updatedCart = prevCart.map(item =>
            item.product?._id === product._id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          updatedCart = [...prevCart, { 
            _id: Date.now().toString(),
            product, 
            quantity,
            addedAt: new Date().toISOString()
          }];
        }

        // Guardar en localStorage
        localStorage.setItem('byLuciana_cart', JSON.stringify(updatedCart));
        return updatedCart;
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = (productId) => {
    try {
      setCart(prevCart => {
        const updatedCart = prevCart.filter(item => item.product?._id !== productId);
        localStorage.setItem('byLuciana_cart', JSON.stringify(updatedCart));
        return updatedCart;
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    try {
      setCart(prevCart => {
        const updatedCart = prevCart.map(item =>
          item.product?._id === productId
            ? { ...item, quantity }
            : item
        );
        localStorage.setItem('byLuciana_cart', JSON.stringify(updatedCart));
        return updatedCart;
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const clearCart = () => {
    try {
      setCart([]);
      localStorage.setItem('byLuciana_cart', JSON.stringify([]));
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
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

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;