import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cartService } from '../services/api';

const CartContext = createContext();

// Reducer para manejar el estado del carrito
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items || [],
        total: action.payload.total || 0,
        totalItems: action.payload.totalItems || 0,
        loading: false
      };
    
    case 'ADD_ITEM':
      const existingItemIndex = state.items.findIndex(
        item => item.product?._id === action.payload.productId && 
                item.size === action.payload.size && 
                item.color === action.payload.color
      );

      let newItems;
      if (existingItemIndex > -1) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newItems = [...state.items, {
          _id: Date.now().toString(), // Temporal hasta que venga del backend
          product: { _id: action.payload.productId },
          quantity: action.payload.quantity,
          size: action.payload.size,
          color: action.payload.color
        }];
      }

      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item._id === action.payload.itemId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        totalItems: state.items.reduce((sum, item) => 
          sum + (item._id === action.payload.itemId ? action.payload.quantity : item.quantity), 0
        )
      };

    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item._id !== action.payload.itemId);
      return {
        ...state,
        items: filteredItems,
        totalItems: filteredItems.reduce((sum, item) => sum + item.quantity, 0)
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
        totalItems: 0
      };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
};

const initialState = {
  items: [],
  total: 0,
  totalItems: 0,
  loading: false,
  error: null
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Cargar carrito desde el backend al iniciar
  const loadCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await cartService.getCart();
      dispatch({ type: 'SET_CART', payload: response.data });
    } catch (error) {
      console.error('Error loading cart:', error);
      // Si hay error de autenticación, no hacemos nada (usuario no logueado)
      if (error.response?.status !== 401) {
        dispatch({ type: 'SET_ERROR', payload: 'Error al cargar el carrito' });
      }
    }
  };

  // Agregar item al carrito
  const addToCart = async (productId, quantity = 1, size = '', color = '') => {
    try {
      const response = await cartService.addToCart({
        productId,
        quantity,
        size,
        color
      });
      
      dispatch({ type: 'SET_CART', payload: response.data.cart });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Error al agregar al carrito' 
      };
    }
  };

  // Actualizar cantidad de item
  const updateQuantity = async (itemId, quantity) => {
    try {
      if (quantity < 1) {
        await removeFromCart(itemId);
        return { success: true };
      }

      const response = await cartService.updateCartItem(itemId, quantity);
      dispatch({ type: 'SET_CART', payload: response.data.cart });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Error updating cart item:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Error al actualizar cantidad' 
      };
    }
  };

  // Eliminar item del carrito
  const removeFromCart = async (itemId) => {
    try {
      const response = await cartService.removeFromCart(itemId);
      dispatch({ type: 'SET_CART', payload: response.data.cart });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Error al eliminar del carrito' 
      };
    }
  };

  // Vaciar carrito
  const clearCart = async () => {
    try {
      await cartService.clearCart();
      dispatch({ type: 'CLEAR_CART' });
      return { success: true, message: 'Carrito vaciado' };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Error al vaciar carrito' 
      };
    }
  };

  // Cargar carrito al montar el componente
  useEffect(() => {
    loadCart();
  }, []);

  const value = {
    items: state.items,
    total: state.total,
    totalItems: state.totalItems,
    loading: state.loading,
    error: state.error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    loadCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};