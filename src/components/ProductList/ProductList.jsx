// src/components/ProductList/ProductList.jsx - VERSIÓN CORREGIDA PARA PANEL ADMIN
import { useState, useEffect } from 'react';
import { useProducts } from '../../context/ProductContext';
import './ProductList.css';

function ProductList({ onEditProduct }) {
  const { products, deleteProduct, loading, error } = useProducts();
  const [localLoading, setLocalLoading] = useState(false);

  const handleDelete = async (productId) => {
    if (confirm('¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.')) {
      try {
        setLocalLoading(true);
        await deleteProduct(productId);
        alert('✅ Producto eliminado exitosamente');
      } catch (error) {
        console.error('❌ Error eliminando producto:', error);
        alert('❌ Error eliminando producto: ' + (error.message || 'Error desconocido'));
      } finally {
        setLocalLoading(false);
      }
    }
  };

  // Si hay error
  if (error) {
    return (
      <div className="product-list-error">
        <h3>❌ Error al cargar productos</h3>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn-retry"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Si está cargando
  if (loading || localLoading) {
    return (
      <div className="product-list-loading">
        <div className="spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="product-list">
      <div className="section-header">
        <h2>📦 Gestión de Productos ({products.length})</h2>
        <p className="subtitle">Haz clic en "Editar" para modificar un producto</p>
      </div>

      {products.length === 0 ? (
        <div className="no-products">
          <div className="no-products-icon">📦</div>
          <h3>No hay productos registrados</h3>
          <p>Comienza creando tu primer producto</p>
        </div>
      ) : (
        <>
          {/* Resumen rápido */}
          <div className="products-summary">
            <div className="summary-item">
              <span className="summary-label">Total:</span>
              <span className="summary-value">{products.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Destacados:</span>
              <span className="summary-value">
                {products.filter(p => p.featured).length}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Stock bajo:</span>
              <span className="summary-value warning">
                {products.filter(p => p.stock <= 5).length}
              </span>
            </div>
          </div>

          {/* Lista de productos */}
          <div className="products-grid">
            {products.map(product => {
              // Determinar estado del producto
              const isLowStock = product.stock <= 5;
              const isOutOfStock = product.stock === 0;
              const isFeatured = product.featured;

              return (
                <div key={product._id} className="product-card">
                  <div className="product-header">
                    <span className="product-sku">{product.sku || 'SIN SKU'}</span>
                    <span className="product-category">{product.category || 'Sin categoría'}</span>
                  </div>

                  <div className="product-image">
                    {product.images?.[0] ? (
                      <img 
                        src={
                          product.images[0].startsWith('http') 
                            ? product.images[0] 
                            : product.images[0].startsWith('/')
                              ? `http://localhost:5000${product.images[0]}`
                              : product.images[0]
                        } 
                        alt={product.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          if (e.target.nextSibling) {
                            e.target.nextSibling.style.display = 'block';
                          }
                        }}
                      />
                    ) : null}
                    <div className="image-placeholder">📷 Sin imagen</div>
                    
                    {/* Badges */}
                    {isFeatured && (
                      <div className="featured-badge" title="Producto destacado">
                        ⭐ Destacado
                      </div>
                    )}
                    {isOutOfStock && (
                      <div className="stock-badge out-of-stock" title="Agotado">
                        AGOTADO
                      </div>
                    )}
                    {isLowStock && !isOutOfStock && (
                      <div className="stock-badge low-stock" title="Stock bajo">
                        Stock bajo
                      </div>
                    )}
                  </div>
                  
                  <div className="product-info">
                    <h3 className="product-name">{product.name || 'Sin nombre'}</h3>
                    
                    <p className="product-description">
                      {product.description 
                        ? (product.description.length > 80 
                            ? `${product.description.substring(0, 80)}...` 
                            : product.description)
                        : 'Sin descripción'}
                    </p>
                    
                    <div className="product-details">
                      <div className="price-section">
                        <span className="price-label">Precio:</span>
                        <span className="price-value">
                          ${product.price?.toLocaleString('es-AR') || '0'}
                        </span>
                        {product.comparePrice && product.comparePrice > product.price && (
                          <span className="compare-price">
                            ${product.comparePrice.toLocaleString('es-AR')}
                          </span>
                        )}
                      </div>
                      
                      <div className="stock-section">
                        <span className="stock-label">Stock:</span>
                        <span className={`stock-value ${isOutOfStock ? 'out' : isLowStock ? 'low' : 'ok'}`}>
                          {product.stock || 0} unidades
                        </span>
                      </div>
                    </div>

                    {/* Colores y talles */}
                    {(product.colors?.length > 0 || product.sizes?.length > 0) && (
                      <div className="product-variants">
                        {product.colors?.length > 0 && (
                          <div className="colors-preview">
                            <span className="variant-label">Colores:</span>
                            <div className="colors-list">
                              {product.colors.slice(0, 3).map((color, index) => (
                                <span key={index} className="color-chip" title={color}>
                                  {color}
                                </span>
                              ))}
                              {product.colors.length > 3 && (
                                <span className="color-more">+{product.colors.length - 3}</span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {product.sizes?.length > 0 && (
                          <div className="sizes-preview">
                            <span className="variant-label">Talles:</span>
                            <div className="sizes-list">
                              {product.sizes.slice(0, 4).map((size, index) => (
                                <span key={index} className="size-chip">
                                  {size}
                                </span>
                              ))}
                              {product.sizes.length > 4 && (
                                <span className="size-more">+{product.sizes.length - 4}</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="product-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => onEditProduct && onEditProduct(product)}
                      disabled={localLoading}
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(product._id)}
                      disabled={localLoading}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default ProductList;