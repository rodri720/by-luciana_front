// src/context/ProductContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar productos
  const loadProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Crear producto
  const createProduct = async (productData) => {
    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      const newProduct = await res.json();
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  };

  // Actualizar producto
  const updateProduct = async (id, productData) => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      const updatedProduct = await res.json();
      setProducts(prev => 
        prev.map(product => product._id === id ? updatedProduct : product)
      );
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  // Subir imagen
  const uploadProductImage = async (productId, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const res = await fetch(`http://localhost:5000/api/upload/product/${productId}/image`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Error subiendo imagen');

      const data = await res.json();
      
      // Actualizar el producto en el estado
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product._id === productId 
            ? { ...product, image: data.imageUrl }
            : product
        )
      );

      return data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  // Eliminar producto
  const deleteProduct = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
      });
      setProducts(prev => prev.filter(product => product._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <ProductContext.Provider value={{
      products,
      loading,
      loadProducts,
      createProduct,
      updateProduct,
      deleteProduct,
      uploadProductImage
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};