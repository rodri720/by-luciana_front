// src/context/ProductContext.jsx - VERSIÓN CORREGIDA CON BACKEND REAL
import React, { createContext, useContext, useState, useEffect } from 'react';

// URL del backend
const BACKEND_URL = 'http://localhost:5000';

// ✅ 1. CREAR CONTEXTO
const ProductContext = createContext();

// ✅ 2. CREAR HOOK PARA USAR EL CONTEXTO
export const useProducts = () => {
  const context = useContext(ProductContext);
  
  if (!context) {
    console.error('❌ ERROR: useProducts() usado fuera de ProductProvider');
    return {
      products: [],
      loading: false,
      error: null,
      getProductsByCategory: () => [],
      getFeaturedProducts: () => [],
      getProductById: () => null,
      fetchProductById: async () => null,
      loadProducts: async () => {},
      refetchProducts: async () => {},
      createProduct: async () => null,
      updateProduct: async () => null,
      deleteProduct: async () => {}
    };
  }
  
  return context;
};

// ✅ 3. COMPONENTE PRODUCT PROVIDER
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Cargar productos desde el backend real
  const loadProducts = async () => {
    try {
      setLoading(true);
      console.log('📦 Cargando productos desde backend...');
      
      const response = await fetch(`${BACKEND_URL}/api/products`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Asegurarse de que data.products existe y es un array
      const productsArray = Array.isArray(data.products) ? data.products : 
                           Array.isArray(data) ? data : [];
      
      console.log(`✅ ${productsArray.length} productos cargados desde backend`);
      setProducts(productsArray);
      setError(null);
    } catch (err) {
      console.error('❌ Error cargando productos:', err);
      setError(err.message || 'Error cargando productos');
      setProducts([]); // Usar array vacío en lugar de productos de muestra
    } finally {
      setLoading(false);
    }
  };

  // ✅ Cargar productos al iniciar
  useEffect(() => {
    console.log('🚀 ProductProvider montado');
    loadProducts();
  }, []);

  // ✅ Funciones que necesita Novedades.jsx
  const getProductsByCategory = (category) => {
    if (!category || category === 'todos') return products;
    
    // Normalizar la categoría para comparación
    const normalizedCategory = category.toLowerCase().trim();
    
    return products.filter(product => {
      if (!product.category) return false;
      
      // Normalizar la categoría del producto
      const productCategory = product.category.toLowerCase().trim();
      
      // Comparar categorías normalizadas
      return productCategory === normalizedCategory;
    });
  };

  const getFeaturedProducts = () => {
    return products.filter(product => product.featured === true);
  };

  const getProductById = (id) => {
    return products.find(product => product._id === id);
  };

  const fetchProductById = async (id) => {
    try {
      console.log(`🔍 Buscando producto con ID: ${id}`);
      
      // Primero buscar en cache local
      const cachedProduct = getProductById(id);
      if (cachedProduct) {
        console.log('✅ Producto encontrado en cache local');
        return cachedProduct;
      }
      
      // Si no está en cache, buscar en el backend
      const response = await fetch(`${BACKEND_URL}/api/products/${id}`);
      
      if (!response.ok) {
        throw new Error(`Producto no encontrado: ${response.status}`);
      }
      
      const product = await response.json();
      console.log('✅ Producto cargado desde backend:', product.name);
      return product;
      
    } catch (err) {
      console.error('❌ Error cargando producto:', err);
      throw err;
    }
  };

  // ✅ CRUD con backend real
  const createProduct = async (productData) => {
    try {
      setLoading(true);
      console.log('🆕 Creando nuevo producto:', productData.name);
      
      const response = await fetch(`${BACKEND_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }
      
      const newProduct = await response.json();
      console.log('✅ Producto creado exitosamente:', newProduct._id);
      
      // Actualizar la lista local
      setProducts(prev => [...prev, newProduct]);
      
      return newProduct;
      
    } catch (err) {
      console.error('❌ Error creando producto:', err);
      setError(err.message || 'Error creando producto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      setLoading(true);
      console.log('🔄 Actualizando producto:', id);
      
      const response = await fetch(`${BACKEND_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }
      
      const updatedProduct = await response.json();
      console.log('✅ Producto actualizado exitosamente');
      
      // Actualizar la lista local
      setProducts(prev => 
        prev.map(product => 
          product._id === id ? updatedProduct : product
        )
      );
      
      return updatedProduct;
      
    } catch (err) {
      console.error('❌ Error actualizando producto:', err);
      setError(err.message || 'Error actualizando producto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      console.log('🗑️ Eliminando producto:', id);
      
      const response = await fetch(`${BACKEND_URL}/api/products/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }
      
      console.log('✅ Producto eliminado exitosamente');
      
      // Actualizar la lista local
      setProducts(prev => prev.filter(product => product._id !== id));
      
      return true;
      
    } catch (err) {
      console.error('❌ Error eliminando producto:', err);
      setError(err.message || 'Error eliminando producto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Funciones adicionales que puedas necesitar
  const searchProducts = async (searchTerm) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/products/search?q=${encodeURIComponent(searchTerm)}`);
      
      if (!response.ok) {
        throw new Error(`Error en búsqueda: ${response.status}`);
      }
      
      return await response.json();
    } catch (err) {
      console.error('❌ Error buscando productos:', err);
      return [];
    }
  };

  const getProductsByTag = (tag) => {
    if (!tag) return [];
    
    const normalizedTag = tag.toLowerCase().trim();
    return products.filter(product => {
      if (!product.tags || !Array.isArray(product.tags)) return false;
      
      return product.tags.some(productTag => 
        productTag.toLowerCase().trim() === normalizedTag
      );
    });
  };

  // ✅ Valor del contexto
  const value = {
    // Estados
    products,
    loading,
    error,
    
    // Funciones de carga
    loadProducts,
    refetchProducts: loadProducts,
    clearError: () => setError(null),
    
    // Consultas
    getProductsByCategory,
    getFeaturedProducts,
    getProductById,
    fetchProductById,
    searchProducts,
    getProductsByTag,
    
    // CRUD
    createProduct,
    updateProduct,
    deleteProduct,
    
    // Utilidades
    getCategories: () => {
      const categories = new Set();
      products.forEach(product => {
        if (product.category) {
          categories.add(product.category);
        }
      });
      return Array.from(categories);
    }
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;