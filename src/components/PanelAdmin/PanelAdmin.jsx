// src/components/PanelAdmin/PanelAdmin.jsx
import { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import ProductList from '../ProductList/ProductList';
import ProductForm from '../ProductForm/ProductForm';
import DashboardStats from '../DashboardStats/DashboardStats';
import AdminAuth from '../AdminAuth/AdminAuth';
import './PanelAdmin.css';

function PanelAdmin() {
  const { products, loading, createProduct, updateProduct } = useProducts();
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [editingProduct, setEditingProduct] = useState(null);

  const handleCreateProduct = async (productData) => {
    try {
      console.log('=== 🚨 PANELADMIN: handleCreateProduct INICIADO 🚨 ===');
      await createProduct(productData);
      setActiveSection('products');
      setEditingProduct(null);
      alert('✅ Producto creado correctamente');
    } catch (error) {
      console.error('❌ Error creando producto:', error);
      alert('❌ Error creando producto');
    }
  };

  const handleUpdateProduct = async (productData) => {
    try {
      await updateProduct(editingProduct._id, productData);
      setActiveSection('products');
      setEditingProduct(null);
      alert('✅ Producto actualizado correctamente');
    } catch (error) {
      console.error('❌ Error actualizando producto:', error);
      alert('❌ Error actualizando producto');
    }
  };

  // En tu PanelAdmin.jsx, en la sección del dashboard:
{activeSection === 'dashboard' && (
  <DashboardStats />
)}

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setActiveSection('edit-product');
  };

  const handleBackToDashboard = () => {
    setActiveSection('dashboard');
    setEditingProduct(null);
  };

  const handleLogout = () => {
    logout();
  };

  // Si está cargando la autenticación
  if (authLoading) {
    return (
      <div className="panel-admin">
        <div className="loading">⏳ Verificando acceso...</div>
      </div>
    );
  }

  // Si no está autenticado, mostrar el formulario de login
  if (!isAuthenticated) {
    return <AdminAuth />;
  }

  // DEBUG: Ver qué función se pasa
  console.log('🔍 PanelAdmin - onSave function:', editingProduct ? handleUpdateProduct : handleCreateProduct);

  return (
    <div className="panel-admin">
      {/* Header del Panel */}
      {/* Header del Panel */}
<header className="panel-header">
  <h1>🎯 Panel de Administración - By Luciana</h1>
  <div className="header-actions">
    <span className="backend-status">
      {process.env.NODE_ENV === 'development' ? '🔴 Modo Local' : '🟢 Conectado'}
    </span>
    {/* AGREGA ESTE BOTÓN: */}
    <button onClick={() => {
      localStorage.removeItem('adminAuthenticated');
      window.location.reload();
    }} className="logout-btn">
      <button onClick={handleLogout} className="logout-btn"></button>
      🚪 Cerrar Sesión
    </button>
  </div>
</header>
           {/* Navegación */}
      <nav className="panel-nav">
        <button 
          className={`nav-btn ${activeSection === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveSection('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={`nav-btn ${activeSection === 'products' ? 'active' : ''}`}
          onClick={() => setActiveSection('products')}
        >
          📦 Productos ({products.length})
        </button>
        <button 
          className="nav-btn primary"
          onClick={() => setActiveSection('create-product')}
        >
          ➕ Nuevo Producto
        </button>
        
        {/* BOTÓN DE LOGOUT - SOLO AGREGA ESTA LÍNEA */}
        <button 
          onClick={handleLogout} 
          className="nav-btn logout-nav-btn"
        >
          🚪 Cerrar Sesión
        </button>
      </nav>
      {/* Contenido Principal */}
      <main className="panel-main">
        {loading ? (
          <div className="loading">⏳ Cargando...</div>
        ) : (
          <>
            {activeSection === 'dashboard' && (
              <DashboardStats />
            )}

            {activeSection === 'products' && (
              <ProductList 
                onEditProduct={handleEditProduct}
              />
            )}

            {(activeSection === 'create-product' || activeSection === 'edit-product') && (
              <div className="form-section">
                <div className="form-header">
                  <button 
                    onClick={handleBackToDashboard}
                    className="back-btn"
                  >
                    ← Volver al Panel
                  </button>
                  <h2>
                    {activeSection === 'create-product' ? '🆕 Crear Producto' : '✏️ Editar Producto'}
                  </h2>
                </div>
                
                <ProductForm
                  product={editingProduct}
                  onSave={editingProduct ? handleUpdateProduct : handleCreateProduct}
                  onCancel={handleBackToDashboard}
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default PanelAdmin;