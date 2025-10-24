// src/pages/AdminDashboard.jsx
import { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import ProductForm from '../components/ProductForm/ProductForm';
import './AdminDashboard.css';

function AdminDashboard() {
  const { products, createProduct, updateProduct, deleteProduct, loading } = useProducts();
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Función para obtener productos por categoría (la que ya tenías)
  const getProductsByCategory = (category) => {
    return products.filter(product => product.category === category);
  };

  const handleCreateProduct = async (productData) => {
    try {
      await createProduct(productData);
      setShowForm(false);
      alert('✅ Producto creado correctamente');
    } catch (error) {
      alert('❌ Error creando producto');
    }
  };

  const handleUpdateProduct = async (productData) => {
    try {
      await updateProduct(editingProduct._id, productData);
      setEditingProduct(null);
      alert('✅ Producto actualizado correctamente');
    } catch (error) {
      alert('❌ Error actualizando producto');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await deleteProduct(productId);
        alert('🗑️ Producto eliminado');
      } catch (error) {
        alert('❌ Error eliminando producto');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="admin-dashboard">
      {/* Header con estadísticas - MANTENIENDO TU DISEÑO */}
      <header className="dashboard-header">
        <h1>🎯 Panel de Administración - By Luciana</h1>
        <div className="header-info">
          <span className="backend-status">
            {process.env.NODE_ENV === 'development' ? '🔴 Modo Local' : '🟢 Conectado'}
          </span>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            📦 + Nuevo Producto
          </button>
        </div>
      </header>

      {/* Estadísticas - MANTENIENDO TU DISEÑO */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Productos</h3>
          <span className="stat-number">{products.length}</span>
        </div>
        <div className="stat-card">
          <h3>En Outlet</h3>
          <span className="stat-number">{getProductsByCategory('outlet').length}</span>
        </div>
        <div className="stat-card">
          <h3>Destacados</h3>
          <span className="stat-number">{products.filter(p => p.featured).length}</span>
        </div>
        <div className="stat-card">
          <h3>Mayorista</h3>
          <span className="stat-number">{getProductsByCategory('mayorista').length}</span>
        </div>
      </div>

      {/* Formulario modal - NUEVA ESTRUCTURA */}
      {(showForm || editingProduct) && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="form-header">
              <h2>{editingProduct ? '✏️ Editar Producto' : '🆕 Crear Producto'}</h2>
              <button 
                type="button" 
                onClick={resetForm}
                className="form-close-btn"
                title="Cerrar formulario"
              >
                ×
              </button>
            </div>
            
            <ProductForm
              product={editingProduct}
              onSave={editingProduct ? handleUpdateProduct : handleCreateProduct}
              onCancel={resetForm}
            />
          </div>
        </div>
      )}

      {/* Lista de productos - MANTENIENDO TU DISEÑO CON MEJORAS */}
      <div className="products-section">
        <div className="section-header">
          <h2>📦 Gestión de Productos ({products.length})</h2>
        </div>
        
        {loading ? (
          <div className="loading">⏳ Cargando productos...</div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  {product.image ? (
                    <img 
                      src={product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <div className="image-placeholder">📷</div>
                  <div className="product-category-badge">{product.category}</div>
                  {product.featured && <div className="featured-badge">⭐</div>}
                </div>
                
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="description">{product.description}</p>
                  <div className="product-details">
                    <span className="price">${product.price?.toLocaleString()}</span>
                    <span className="stock">Stock: {product.stock}</span>
                  </div>
                </div>

                <div className="product-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(product)}
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {products.length === 0 && !loading && (
          <div className="no-products">
            <div className="no-products-icon">📦</div>
            <h3>No hay productos</h3>
            <p>Crea tu primer producto para comenzar</p>
            <button 
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              📦 Crear Primer Producto
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;