// src/context/ProductContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

export const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');

  // ✅ FUNCIÓN OPTIMIZADA PARA CARGAR PRODUCTOS
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      setBackendStatus('connecting');
      
      const backendUrl = 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/products/all`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // ✅ CORREGIR LAS URLS DE LAS IMÁGENES
      let productsToSet = [];
      
      if (Array.isArray(data)) {
        productsToSet = data.map(product => ({
          ...product,
          images: product.images?.map(image => 
            image.startsWith('http') ? image : `${backendUrl}${image}`
          ) || ['/placeholder-product.jpg']
        }));
      } else if (data.success && Array.isArray(data.products)) {
        productsToSet = data.products.map(product => ({
          ...product,
          images: product.images?.map(image => 
            image.startsWith('http') ? image : `${backendUrl}${image}`
          ) || ['/placeholder-product.jpg']
        }));
      } else {
        throw new Error('Estructura de datos inválida del backend');
      }
      
      setProducts(productsToSet);
      setBackendStatus('connected');
      
    } catch (error) {
      console.error('Error cargando productos:', error);
      setError(error.message);
      setBackendStatus('error');
      
      // ✅ Datos de ejemplo como fallback
      setProducts(getSampleProducts());
      setBackendStatus('fallback');
    } finally {
      setLoading(false);
    }
  };

  // ✅ DATOS DE EJEMPLO MEJORADOS
  const getSampleProducts = () => [
    {
      _id: '1',
      name: 'Remera Básica Negra',
      price: 15990,
      description: 'Remera de algodón 100% premium, perfecta para uso diario.',
      images: ['/placeholder-product.jpg'],
      category: 'ropa',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Negro'],
      stock: 15,
      featured: true,
      createdAt: new Date()
    },
    {
      _id: '2',
      name: 'Jean Slim Fit',
      price: 29990,
      description: 'Jean de corte slim fit, cómodo y moderno.',
      images: ['/placeholder-product.jpg'],
      category: 'ropa',
      sizes: ['28', '30', '32', '34'],
      colors: ['Azul', 'Negro'],
      stock: 8,
      featured: true,
      createdAt: new Date()
    },
    {
      _id: '3',
      name: 'Camisa de Lino',
      price: 22990,
      description: 'Camisa de lino natural, ideal para verano.',
      images: ['/placeholder-product.jpg'],
      category: 'ropa',
      sizes: ['S', 'M', 'L'],
      colors: ['Blanco', 'Beige'],
      stock: 12,
      featured: false,
      createdAt: new Date()
    }
  ];

  // ✅ CREATE PRODUCT - VERSIÓN OPTIMIZADA
  const createProduct = async (productData) => {
    try {
      setError(null);
      const formData = new FormData();
      
      // ✅ AGREGAR CAMPOS NORMALES
      Object.keys(productData).forEach(key => {
        if (key !== 'images' && productData[key] !== undefined && productData[key] !== null) {
          const value = typeof productData[key] === 'boolean' 
            ? productData[key].toString() 
            : productData[key];
          formData.append(key, value);
        }
      });

      // ✅ AGREGAR IMÁGENES - LÓGICA MEJORADA
      if (productData.images && productData.images.length > 0) {
        productData.images.forEach((imageItem) => {
          let fileToUpload;

          if (imageItem instanceof File) {
            fileToUpload = imageItem;
          } 
          else if (imageItem && imageItem.file instanceof File) {
            fileToUpload = imageItem.file;
          }
          else if (imageItem && typeof imageItem === 'object' && imageItem.size) {
            fileToUpload = imageItem;
          }
          
          if (fileToUpload && fileToUpload.size > 0) {
            formData.append('images', fileToUpload);
          }
        });
      }

      const backendUrl = 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/api/products`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error ${res.status}: ${errorText}`);
      }

      const newProduct = await res.json();
      
      // ✅ CORREGIR URLS DE IMÁGENES DEL NUEVO PRODUCTO
      const productWithCorrectUrls = {
        ...newProduct,
        images: newProduct.images?.map(image => 
          image.startsWith('http') ? image : `${backendUrl}${image}`
        ) || ['/placeholder-product.jpg']
      };
      
      // Actualizar estado local
      setProducts(prev => [...prev, productWithCorrectUrls]);
      return productWithCorrectUrls;

    } catch (error) {
      console.error('Error creando producto:', error);
      setError(error.message);
      throw error;
    }
  };

  // ✅ ACTUALIZAR PRODUCTO - OPTIMIZADO
  const updateProduct = async (id, productData) => {
    try {
      setError(null);
      
      const backendUrl = 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error ${res.status}: ${errorText}`);
      }

      const updatedProduct = await res.json();
      
      // ✅ CORREGIR URLS DE IMÁGENES DEL PRODUCTO ACTUALIZADO
      const productWithCorrectUrls = {
        ...updatedProduct,
        images: updatedProduct.images?.map(image => 
          image.startsWith('http') ? image : `${backendUrl}${image}`
        ) || ['/placeholder-product.jpg']
      };
      
      setProducts(prev => 
        prev.map(product => product._id === id ? productWithCorrectUrls : product)
      );
      return productWithCorrectUrls;
    } catch (error) {
      console.error('Error actualizando producto:', error);
      setError(error.message);
      throw error;
    }
  };

  // ✅ SUBIR IMAGEN A PRODUCTO EXISTENTE
  const uploadProductImage = async (productId, formData) => {
    try {
      setError(null);
      
      const backendUrl = 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/api/products/${productId}/image`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error subiendo imagen');
      }

      const data = await res.json();
      
      // ✅ CORREGIR URLS DE IMÁGENES
      const correctedImages = data.images?.map(image => 
        image.startsWith('http') ? image : `${backendUrl}${image}`
      ) || ['/placeholder-product.jpg'];
      
      // Actualizar producto en el estado
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product._id === productId 
            ? { 
                ...product, 
                images: correctedImages,
                image: correctedImages[0] 
              }
            : product
        )
      );

      return { ...data, images: correctedImages };
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      setError(error.message);
      throw error;
    }
  };

  // ✅ ELIMINAR IMAGEN DE PRODUCTO
  const deleteProductImage = async (productId, imageUrl) => {
    try {
      setError(null);
      
      const backendUrl = 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/api/products/${productId}/delete-image`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error eliminando imagen');
      }

      const data = await res.json();
      
      // ✅ CORREGIR URLS DE IMÁGENES RESTANTES
      const correctedImages = data.images?.map(image => 
        image.startsWith('http') ? image : `${backendUrl}${image}`
      ) || ['/placeholder-product.jpg'];
      
      // Actualizar producto en el estado
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product._id === productId 
            ? { 
                ...product, 
                images: correctedImages 
              }
            : product
        )
      );

      return { ...data, images: correctedImages };
    } catch (error) {
      console.error('Error eliminando imagen:', error);
      setError(error.message);
      throw error;
    }
  };

  // ✅ ESTABLECER IMAGEN PRINCIPAL
  const setMainImage = async (productId, imageUrl) => {
    try {
      setError(null);
      
      const backendUrl = 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/api/products/${productId}/set-main-image`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error estableciendo imagen principal');
      }

      const data = await res.json();
      
      // ✅ CORREGIR URLS DE IMÁGENES
      const correctedImages = data.images?.map(image => 
        image.startsWith('http') ? image : `${backendUrl}${image}`
      ) || ['/placeholder-product.jpg'];
      
      // Actualizar producto en el estado
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product._id === productId 
            ? { 
                ...product, 
                images: correctedImages 
              }
            : product
        )
      );

      return { ...data, images: correctedImages };
    } catch (error) {
      console.error('Error estableciendo imagen principal:', error);
      setError(error.message);
      throw error;
    }
  };

  // ✅ ELIMINAR PRODUCTO (SOFT DELETE)
  const deleteProduct = async (id) => {
    try {
      setError(null);
      
      const backendUrl = 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error ${res.status}: ${errorText}`);
      }

      // Actualizar estado local
      setProducts(prev => prev.filter(product => product._id !== id));
      
    } catch (error) {
      console.error('Error eliminando producto:', error);
      setError(error.message);
      throw error;
    }
  };

  // ✅ OBTENER PRODUCTO POR ID (CON FETCH)
  const fetchProductById = async (id) => {
    try {
      setError(null);
      
      const backendUrl = 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/api/products/${id}`);
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      const product = await res.json();
      
      // ✅ CORREGIR URLS DE IMÁGENES
      const productWithCorrectUrls = {
        ...product,
        images: product.images?.map(image => 
          image.startsWith('http') ? image : `${backendUrl}${image}`
        ) || ['/placeholder-product.jpg']
      };
      
      return productWithCorrectUrls;
    } catch (error) {
      console.error('Error obteniendo producto:', error);
      setError(error.message);
      throw error;
    }
  };

  // ✅ FUNCIONES DE CONSULTA LOCALES
  const getProductById = (id) => {
    return products.find(product => product._id === id);
  };

  const getFeaturedProducts = () => {
    return products.filter(product => product.featured);
  };

  const getProductsByCategory = (category) => {
    return products.filter(product => product.category === category);
  };

  // ✅ FUNCIÓN PARA LIMPIAR ERRORES MANUALMENTE
  const clearError = () => {
    setError(null);
  };

  // ✅ CARGAR PRODUCTOS AL INICIAR
  useEffect(() => {
    loadProducts();
  }, []);

  // ✅ VALOR DEL CONTEXTO COMPLETO Y OPTIMIZADO
  const contextValue = {
    // Estados
    products,
    loading,
    error,
    backendStatus,
    
    // Funciones de carga y gestión
    loadProducts,
    refetchProducts: loadProducts,
    clearError,
    
    // Funciones de consulta local
    getProductById,
    getFeaturedProducts,
    getProductsByCategory,
    
    // Funciones CRUD completas
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage,
    deleteProductImage,
    setMainImage,
    
    // Función para obtener producto individual (con fetch)
    fetchProductById
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
}

// ✅ HOOK PARA USAR EL CONTEXTO
export const useProducts = () => {
  const context = useContext(ProductContext);
  
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  
  return context;
};

export default ProductContext;