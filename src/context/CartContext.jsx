import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

// Hook personalizado
const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Función auxiliar para IDs seguros
const safeGetId = (item, fallback = '') => {
  if (!item) return fallback;
  return item.product?._id || item._id || item.id || fallback;
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
        
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          // Filtrar items null/undefined al cargar
          const filteredCart = parsedCart.filter(item => item != null);
          console.log('✅ Carrito cargado y filtrado:', filteredCart);
          setCart(filteredCart);
        } else {
          console.log('❌ No hay carrito guardado');
        }
      } catch (error) {
        console.log('🚨 Error loading cart:', error);
        setCart([]);
      } finally {
        setLoading(false);
      }
    };

    loadCartFromStorage();
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('byLuciana_cart', JSON.stringify(cart));
    }
  }, [cart]);

  // Validar y limpiar carrito periódicamente
  useEffect(() => {
    const validateCart = () => {
      const hasInvalidItems = cart.some(item => {
        if (!item) return true;
        if (!safeGetId(item)) return true;
        const price = item.product?.precio || item.product?.price || item.precio;
        return !price || price <= 0;
      });
      
      if (hasInvalidItems) {
        console.log('⚠️ Carrito contiene items inválidos, limpiando...');
        const cleanedCart = cart.filter(item => {
          if (!item) return false;
          if (!safeGetId(item)) return false;
          const price = item.product?.precio || item.product?.price || item.precio;
          return price && price > 0;
        });
        setCart(cleanedCart);
      }
    };
    
    if (cart.length > 0) {
      validateCart();
    }
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    console.log('🛒 Intentando agregar al carrito:', { 
      product: product?.name || product?.nombre || 'Sin nombre', 
      productId: product?._id,
      quantity 
    });

    // ✅ VALIDACIÓN CRÍTICA
    if (!product) {
      console.error('❌ ERROR: addToCart recibió product null');
      alert('❌ Error: El producto no es válido');
      return;
    }

    const productId = product._id || product.id;
    if (!productId) {
      console.error('❌ ERROR: Producto sin ID:', product);
      alert('❌ Error: El producto no tiene ID válido');
      return;
    }

    try {
      setCart(prevCart => {
        const existingItemIndex = prevCart.findIndex(item => {
          if (!item) return false;
          return safeGetId(item) === productId;
        });

        let updatedCart;

        if (existingItemIndex !== -1) {
          const existingItem = prevCart[existingItemIndex];
          updatedCart = [...prevCart];
          updatedCart[existingItemIndex] = {
            ...existingItem,
            quantity: (existingItem.quantity || 0) + quantity
          };
        } else {
          const cartItem = {
            _id: productId,
            product: product,
            quantity: Math.max(1, quantity),
            addedAt: new Date().toISOString(),
            nombre: product.nombre || product.name || 'Producto',
            precio: product.precio || product.price || 0,
            imagen: product.imagen || product.images?.[0] || product.image || ''
          };
          updatedCart = [...prevCart, cartItem];
        }

        return updatedCart;
      });
    } catch (error) {
      console.error('🚨 Error adding to cart:', error);
    }
  };

  const removeFromCart = (productId) => {
    console.log('🗑️ Eliminando del carrito, productId:', productId);
    
    try {
      setCart(prevCart => {
        const updatedCart = prevCart.filter(item => {
          if (!item) return false;
          return safeGetId(item) !== productId;
        });
        
        if (updatedCart.length === 0) {
          localStorage.removeItem('byLuciana_cart');
        }
        
        return updatedCart;
      });
    } catch (error) {
      console.error('🚨 Error removing from cart:', error);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    console.log('🔢 Actualizando cantidad:', productId, 'cantidad:', newQuantity);
    
    const safeQuantity = Math.max(1, newQuantity);
    
    try {
      setCart(prevCart => {
        const updatedCart = prevCart.map(item => {
          if (!item) return item;
          if (safeGetId(item) === productId) {
            return { ...item, quantity: safeQuantity };
          }
          return item;
        });
        
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
      localStorage.removeItem('byLuciana_cart');
    } catch (error) {
      console.error('🚨 Error clearing cart:', error);
    }
  };

  const getCartTotal = () => {
    const total = cart.reduce((total, item) => {
      if (!item) return total;
      const price = item.product?.price || item.product?.precio || item.precio || 0;
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0);
    
    return total;
  };

  const getCartItemsCount = () => {
    const count = cart.reduce((total, item) => {
      return total + (item?.quantity || 1);
    }, 0);
    
    return count;
  };

  const getCartItemsForCheckout = () => {
    console.log('🛍️ Preparando items para checkout...');
    
    return cart
      .filter(item => item != null)
      .map((item, index) => {
        const itemId = safeGetId(item);
        
        if (!itemId) {
          const tempId = `temp-${Date.now()}-${index}`;
          console.log(`⚠️ Item sin ID, usando temporal: ${tempId}`);
          
          return {
            id: tempId,
            title: item.product?.nombre || item.product?.name || item.nombre || `Producto ${index + 1}`,
            description: item.product?.descripcion || item.product?.description || '',
            quantity: Math.max(1, item.quantity || 1),
            unit_price: item.product?.precio || item.product?.price || item.precio || 0,
            picture_url: item.product?.imagen?.[0] || item.product?.images?.[0] || item.imagen?.[0] || '',
            category: item.product?.categoria || 'fashion',
            is_temp: true
          };
        }
        
        return {
          id: itemId,
          title: item.product?.nombre || item.product?.name || item.nombre || 'Producto',
          description: item.product?.descripcion || item.product?.description || '',
          quantity: Math.max(1, item.quantity || 1),
          unit_price: item.product?.precio || item.product?.price || item.precio || 0,
          picture_url: item.product?.imagen?.[0] || item.product?.images?.[0] || item.imagen?.[0] || '',
          category: item.product?.categoria || 'fashion',
          is_temp: false
        };
      })
      .filter(item => item.unit_price > 0);
  };

  const isInCart = (productId) => {
    return cart.some(item => {
      if (!item) return false;
      return safeGetId(item) === productId;
    });
  };

  const getProductQuantity = (productId) => {
    const item = cart.find(item => {
      if (!item) return false;
      return safeGetId(item) === productId;
    });
    
    return item ? item.quantity : 0;
  };

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    getCartItemsForCheckout,
    isInCart,
    getProductQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export { CartProvider, useCart };