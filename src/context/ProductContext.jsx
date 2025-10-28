// src/context/ProductContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

// ✅ Crear el contexto y exportarlo
export const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar productos
  const loadProducts = async () => {
    try {
      console.log('🔄 Cargando productos...');
      const res = await fetch('http://localhost:5000/api/products/all');
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('✅ Productos cargados:', data.length);
      setProducts(data);
    } catch (error) {
      console.error('❌ Error loading products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // 🚀 CREATE PRODUCT - VERSIÓN CORREGIDA DEFINITIVA
  const createProduct = async (productData) => {
    console.log('=== 🚨 CREATE PRODUCT INICIADO 🚨 ===');
    console.log('📦 Datos recibidos:', productData);
    console.log('🖼️ Imágenes recibidas:', productData.images);
    console.log('📊 Número de imágenes:', productData.images?.length || 0);
    
    try {
      const formData = new FormData();
      
      console.log('📤 Creando FormData...');
      
      // ✅ AGREGAR CAMPOS NORMALES
      Object.keys(productData).forEach(key => {
        if (key !== 'images' && productData[key] !== undefined && productData[key] !== null) {
          const value = typeof productData[key] === 'boolean' 
            ? productData[key].toString() 
            : productData[key];
          formData.append(key, value);
          console.log(`📝 Agregando campo: ${key} = ${value}`);
        }
      });

      // ✅ AGREGAR IMÁGENES - LÓGICA MEJORADA
      if (productData.images && productData.images.length > 0) {
        console.log(`🖼️ Procesando ${productData.images.length} imágenes...`);
        
        productData.images.forEach((imageItem, index) => {
          console.log(`📸 Imagen ${index}:`, imageItem);
          console.log(`🔍 Tipo:`, typeof imageItem);
          console.log(`🔍 Es File?:`, imageItem instanceof File);
          console.log(`🔍 Tamaño:`, imageItem.size);
          
          let fileToUpload;

          // Diferentes formas en que puede venir la imagen
          if (imageItem instanceof File) {
            fileToUpload = imageItem;
            console.log(`✅ Caso 1 - Es File directo`);
          } 
          else if (imageItem && imageItem.file instanceof File) {
            fileToUpload = imageItem.file;
            console.log(`✅ Caso 2 - Tiene propiedad file`);
          }
          else if (imageItem && typeof imageItem === 'object' && imageItem.size) {
            fileToUpload = imageItem;
            console.log(`✅ Caso 3 - Es objeto con size`);
          }
          else {
            console.log(`❌ Imagen ${index} en formato no reconocido:`, imageItem);
            return;
          }
          
          // Verificación final
          if (fileToUpload && fileToUpload.size > 0) {
            formData.append('images', fileToUpload);
            console.log(`✅✅ IMAGEN ${index} AGREGADA: ${fileToUpload.name} (${fileToUpload.size} bytes)`);
          } else {
            console.log(`❌ Imagen ${index} sin tamaño válido`);
          }
        });
      } else {
        console.log('ℹ️ No hay imágenes para enviar');
      }

      console.log('🚀 Enviando request...');
      
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        body: formData, // ✅ Sin headers - importante!
      });

      console.log('=== 🔍 RESPUESTA DEL SERVIDOR ===');
      console.log('📨 Status:', res.status);
      console.log('📨 OK:', res.ok);
      
      const responseText = await res.text();
      console.log('📨 Body:', responseText);

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${responseText}`);
      }

      const newProduct = JSON.parse(responseText);
      console.log('✅ PRODUCTO CREADO EXITOSAMENTE:', newProduct);
      
      // Actualizar estado local
      setProducts(prev => [...prev, newProduct]);
      return newProduct;

    } catch (error) {
      console.error('❌ Error en createProduct:', error);
      throw error;
    }
  };

  // Actualizar producto
  const updateProduct = async (id, productData) => {
    try {
      console.log('🔄 Actualizando producto:', id);
      
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
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
      console.log('✅ Producto actualizado:', updatedProduct);
      
      setProducts(prev => 
        prev.map(product => product._id === id ? updatedProduct : product)
      );
      return updatedProduct;
    } catch (error) {
      console.error('❌ Error updating product:', error);
      throw error;
    }
  };

  // Subir imagen a producto existente
  const uploadProductImage = async (productId, formData) => {
    try {
      console.log('🔄 Subiendo imagen para producto:', productId);
      
      const res = await fetch(`http://localhost:5000/api/products/${productId}/image`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error subiendo imagen');
      }

      const data = await res.json();
      console.log('✅ Imagen subida:', data);
      
      // Actualizar producto en el estado
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product._id === productId 
            ? { 
                ...product, 
                images: data.images,
                image: data.imageUrl || data.images?.[0] 
              }
            : product
        )
      );

      return data;
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      throw error;
    }
  };

  // Eliminar imagen de producto
  const deleteProductImage = async (productId, imageUrl) => {
    try {
      console.log('🔄 Eliminando imagen:', imageUrl);
      
      const res = await fetch(`http://localhost:5000/api/products/${productId}/delete-image`, {
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
      console.log('✅ Imagen eliminada:', data);
      
      // Actualizar producto en el estado
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product._id === productId 
            ? { 
                ...product, 
                images: data.images 
              }
            : product
        )
      );

      return data;
    } catch (error) {
      console.error('❌ Error deleting image:', error);
      throw error;
    }
  };

  // Establecer imagen principal
  const setMainImage = async (productId, imageUrl) => {
    try {
      console.log('🔄 Estableciendo imagen principal:', imageUrl);
      
      const res = await fetch(`http://localhost:5000/api/products/${productId}/set-main-image`, {
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
      console.log('✅ Imagen principal establecida:', data);
      
      // Actualizar producto en el estado
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product._id === productId 
            ? { 
                ...product, 
                images: data.images 
              }
            : product
        )
      );

      return data;
    } catch (error) {
      console.error('❌ Error setting main image:', error);
      throw error;
    }
  };

  // Eliminar producto (soft delete)
  const deleteProduct = async (id) => {
    try {
      console.log('🔄 Eliminando producto:', id);
      
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error ${res.status}: ${errorText}`);
      }

      console.log('✅ Producto eliminado');
      
      // Actualizar estado local
      setProducts(prev => prev.filter(product => product._id !== id));
      
    } catch (error) {
      console.error('❌ Error deleting product:', error);
      throw error;
    }
  };

  // Obtener producto por ID
  const getProductById = async (id) => {
    try {
      console.log('🔄 Obteniendo producto:', id);
      
      const res = await fetch(`http://localhost:5000/api/products/${id}`);
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      const product = await res.json();
      return product;
    } catch (error) {
      console.error('❌ Error getting product:', error);
      throw error;
    }
  };

  // Cargar productos al iniciar
  useEffect(() => {
    loadProducts();
  }, []);

  // Valor del contexto
  const contextValue = {
    products,
    loading,
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage,
    deleteProductImage,
    setMainImage,
    getProductById
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
}

// ✅ Hook para usar el contexto - CORREGIDO
export const useProducts = () => {
  const context = useContext(ProductContext);
  
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  
  return context;
};

// ✅ Exportación por defecto del contexto para acceso directo si es necesario
export default ProductContext;