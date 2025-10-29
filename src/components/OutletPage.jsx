// src/pages/OutletPage.jsx
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useProducts } from '../context/ProductContext'
import './OutletPage.css'
import logo from '../assets/imagenes/logolu.png'
import { useCart } from '../context/CartContext';

function OutletPage() {
  const { products, loading: productsLoading } = useProducts()
  const [outletProducts, setOutletProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart();

  useEffect(() => {
    if (!productsLoading && products.length > 0) {
      console.log('📦 Products disponibles:', products);
      
      // ✅ FILTRO MEJORADO - maneja diferentes variantes
      const outletItems = products.filter(product => {
        if (!product || !product.category) return false;
        
        const categoryLower = product.category.toLowerCase();
        return categoryLower === 'outlet' || 
               categoryLower.includes('outlet');
      });
      
      console.log('🔥 Productos outlet filtrados:', outletItems);
      setOutletProducts(outletItems);
      setLoading(false);
    } else if (!productsLoading) {
      setOutletProducts([]);
      setLoading(false);
    }
  }, [products, productsLoading]);

  if (loading || productsLoading) {
    return (
      <div className="outlet-page">
        <div className="loading">🔄 Cargando productos de outlet...</div>
      </div>
    )
  }

  return (
    <div className="outlet-page">
      <header className="outlet-header">
        <div className="container">
          <img src={logo} alt="By Luciana" className="outlet-logo" />
          <h1 className="outlet-title">🔥 Outlet</h1>
          <p className="outlet-subtitle">Ofertas especiales y precios increíbles</p>
          
          {/* Botón de recarga */}
          <button 
            onClick={() => window.location.reload()} 
            className="reload-btn"
          >
            🔄 Recargar
          </button>
        </div>
      </header>

      <main className="outlet-content">
        <div className="container">
          {outletProducts.length === 0 ? (
            <div className="no-products">
              <div className="no-products-icon">📦</div>
              <h3>No hay productos en outlet</h3>
              <p>Los productos que agregues en la categoría "Outlet" aparecerán aquí</p>
              
              {/* INFO DE DEBUG */}
              <div style={{background: '#e7f3ff', padding: '15px', borderRadius: '8px', margin: '15px 0', border: '1px solid #b3d9ff'}}>
                <h4 style={{margin: '0 0 10px 0', color: '#0066cc'}}>💡 Información del Sistema:</h4>
                <p style={{margin: '5px 0', fontSize: '14px'}}><strong>Total productos:</strong> {products.length}</p>
                <p style={{margin: '5px 0', fontSize: '14px'}}>
                  <strong>Categorías encontradas:</strong> {[...new Set(products.map(p => p?.category))].join(', ')}
                </p>
                <p style={{margin: '5px 0', fontSize: '12px', color: '#666'}}>
                  <em>¿Falta algún producto? Revisa que la categoría sea exactamente "outlet"</em>
                </p>
              </div>
              
              <Link to="/admin" className="btn btn-primary">
                Ir al Panel de Administración
              </Link>
            </div>
          ) : (
            <>
              <div className="outlet-stats">
                <p>🎯 {outletProducts.length} producto(s) disponibles en outlet</p>
              </div>
              
              <div className="outlet-products-grid">
                {outletProducts.map(product => (
                  <div key={product._id} className="outlet-product-card">
                    <div className="product-image">
                      {product.images && product.images.length > 0 && product.images[0] ? (
                        <img 
                          src={
                            product.images[0].startsWith('http') 
                              ? product.images[0] 
                              : `http://localhost:5000${product.images[0]}`
                          } 
                          alt={product.name}
                          onError={(e) => {
                            console.log('❌ Error cargando imagen:', product.images[0]);
                            e.target.style.display = 'none';
                            const placeholder = e.target.parentElement.querySelector('.image-placeholder');
                            if (placeholder) placeholder.style.display = 'block';
                          }}
                          onLoad={(e) => {
                            const placeholder = e.target.parentElement.querySelector('.image-placeholder');
                            if (placeholder) placeholder.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="image-placeholder">
                          📷<br/>
                          <small>Sin imagen</small>
                        </div>
                      )}
                      <div className="outlet-badge">OUTLET</div>
                      {product.featured && <div className="featured-badge">⭐ Destacado</div>}
                    </div>
                    
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-description">{product.description || 'Sin descripción'}</p>
                      
                      <div className="price-section">
                        <span className="current-price">${product.price?.toLocaleString()}</span>
                        <span className="original-price">
                          ${Math.round((product.price || 0) * 1.3).toLocaleString()}
                        </span>
                        <span className="discount">30% OFF</span>
                      </div>
                      
                      <div className="product-meta">
                        <span className="stock">Stock: {product.stock || 0}</span>
                        <span className="category">Categoría: {product.category}</span>
                      </div>
                    </div>
                    
                    <div className="product-actions">
                      <button 
                        className="btn-add-cart"
                        onClick={() => addToCart(product)}
                        disabled={!product.stock || product.stock === 0}
                      >
                        {(!product.stock || product.stock === 0) ? '❌ Sin Stock' : '🛒 Agregar al Carrito'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="outlet-footer">
        <div className="container">
          <Link to="/" className="btn btn-secondary">
            ← Volver a la Página Principal
          </Link>
        </div>
      </footer>
    </div>
  )
}

export default OutletPage