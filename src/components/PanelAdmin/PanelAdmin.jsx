// src/components/PanelAdmin/PanelAdmin.jsx - VERSIÓN COMPLETA CORREGIDA
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
  const [isSubmitting, setIsSubmitting] = useState(false); // 🔥 NUEVO: prevenir doble envío

  const handleCreateProduct = async (productData) => {
    // 🔥 PREVENIR DOBLE EJECUCIÓN
    if (isSubmitting) {
      console.log('⚠️ Ya se está enviando, ignorando llamada duplicada...');
      return;
    }
    
    try {
      console.log('=== 🚨 PANELADMIN: handleCreateProduct INICIADO 🚨 ===');
      setIsSubmitting(true); // 🔥 BLOQUEAR NUEVOS ENVÍOS
      
      // 🔥 LIMPIAR DATOS QUE PODRÍAN CAUSAR PROBLEMAS
      const cleanProductData = { ...productData };
      
      // Eliminar campos que MongoDB genera automáticamente
      delete cleanProductData._id;
      delete cleanProductData.createdAt;
      delete cleanProductData.updatedAt;
      delete cleanProductData.__v;
      
      // Asegurar que el SKU sea único (regenerar si ya existe)
      if (cleanProductData.sku && cleanProductData.sku.includes('PROD-')) {
        const randomSuffix = Math.floor(10000 + Math.random() * 90000);
        cleanProductData.sku = `PROD-${randomSuffix}`;
        console.log('🔄 SKU regenerado para evitar duplicados:', cleanProductData.sku);
      }
      
      console.log('📤 Enviando datos limpios al backend:', cleanProductData);
      await createProduct(cleanProductData);
      
      setActiveSection('products');
      setEditingProduct(null);
      alert('✅ Producto creado correctamente');
    } catch (error) {
      console.error('❌ Error creando producto:', error);
      alert('❌ Error creando producto: ' + error.message);
    } finally {
      setIsSubmitting(false); // 🔥 DESBLOQUEAR
    }
  };

  const handleUpdateProduct = async (productData) => {
    // 🔥 PREVENIR DOBLE EJECUCIÓN
    if (isSubmitting) {
      console.log('⚠️ Ya se está enviando, ignorando llamada duplicada...');
      return;
    }
    
    if (!editingProduct?._id) {
      alert('❌ No se puede actualizar: producto no seleccionado');
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log('🔄 Actualizando producto ID:', editingProduct._id);
      
      // 🔥 LIMPIAR DATOS PARA ACTUALIZACIÓN
      const cleanProductData = { ...productData };
      
      // Mantener solo los campos que queremos actualizar
      const updateFields = {
        name: cleanProductData.name,
        description: cleanProductData.description,
        price: cleanProductData.price,
        comparePrice: cleanProductData.comparePrice,
        category: cleanProductData.category,
        stock: cleanProductData.stock,
        featured: cleanProductData.featured,
        colors: cleanProductData.colors,
        sizes: cleanProductData.sizes,
        tags: cleanProductData.tags,
        images: cleanProductData.images,
        active: cleanProductData.active
      };
      
      console.log('📤 Enviando actualización:', updateFields);
      await updateProduct(editingProduct._id, updateFields);
      
      setActiveSection('products');
      setEditingProduct(null);
      alert('✅ Producto actualizado correctamente');
    } catch (error) {
      console.error('❌ Error actualizando producto:', error);
      alert('❌ Error actualizando producto: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = (product) => {
    console.log('✏️ Editando producto:', product._id);
    setEditingProduct(product);
    setActiveSection('edit-product');
  };

  const handleBackToDashboard = () => {
    console.log('⬅️ Volviendo al dashboard');
    setActiveSection('dashboard');
    setEditingProduct(null);
  };

  const handleLogout = () => {
    console.log('🚪 Cerrando sesión...');
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
  console.log('🔍 PanelAdmin - Estado actual:');
  console.log('- activeSection:', activeSection);
  console.log('- editingProduct:', editingProduct?._id || 'ninguno');
  console.log('- isSubmitting:', isSubmitting);
  console.log('- onSave function:', editingProduct ? 'handleUpdateProduct' : 'handleCreateProduct');

  return (
    <div className="panel-admin">
      {/* Header del Panel - CORREGIDO */}
      <header className="panel-header">
        <div className="header-content">
          <h1>🎯 Panel de Administración - By Luciana</h1>
          <div className="header-actions">
            <span className="backend-status">
              {process.env.NODE_ENV === 'development' ? '🔴 Modo Local' : '🟢 Conectado'}
            </span>
            {/* ✅ SE ELIMINÓ EL BOTÓN DE LOGOUT DUPLICADO DEL HEADER */}
          </div>
        </div>
      </header>

      {/* Navegación */}
      <nav className="panel-nav">
        <button 
          className={`nav-btn ${activeSection === 'dashboard' ? 'active' : ''}`}
          onClick={() => {
            console.log('📊 Navegando a Dashboard');
            setActiveSection('dashboard');
            setEditingProduct(null);
          }}
          disabled={isSubmitting}
        >
          📊 Dashboard
        </button>
        <button 
          className={`nav-btn ${activeSection === 'products' ? 'active' : ''}`}
          onClick={() => {
            console.log('📦 Navegando a Productos');
            setActiveSection('products');
            setEditingProduct(null);
          }}
          disabled={isSubmitting}
        >
          📦 Productos ({products.length})
        </button>
        <button 
          className="nav-btn primary"
          onClick={() => {
            console.log('➕ Navegando a Crear Producto');
            setActiveSection('create-product');
            setEditingProduct(null);
          }}
          disabled={isSubmitting}
        >
          ➕ Nuevo Producto
        </button>
        
        {/* Botón de logout en navegación */}
        <button 
          onClick={handleLogout} 
          className="nav-btn logout-nav-btn"
          disabled={isSubmitting}
        >
          🚪 Salir
        </button>
      </nav>

      {/* Contenido Principal */}
      <main className="panel-main">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Cargando datos del panel...</p>
          </div>
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
                    disabled={isSubmitting}
                  >
                    ← Volver al Panel
                  </button>
                  <h2>
                    {activeSection === 'create-product' ? '🆕 Crear Producto' : '✏️ Editar Producto'}
                    {isSubmitting && <span className="submitting-indicator"> (Enviando...)</span>}
                  </h2>
                </div>
                
                <ProductForm
                  product={editingProduct}
                  onSave={editingProduct ? handleUpdateProduct : handleCreateProduct}
                  onCancel={handleBackToDashboard}
                  isSubmitting={isSubmitting} // 🔥 PASAR ESTADO DE ENVÍO
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer informativo */}
      <footer className="panel-footer">
        <div className="footer-info">
          <span>🛠️ Modo: {process.env.NODE_ENV === 'development' ? 'Desarrollo' : 'Producción'}</span>
          <span>📊 Total productos: {products.length}</span>
          <span>🔄 Estado: {isSubmitting ? 'Enviando datos...' : 'Listo'}</span>
        </div>
      </footer>
    </div>
  );
}

export default PanelAdmin;