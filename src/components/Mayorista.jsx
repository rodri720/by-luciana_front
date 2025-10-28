// src/pages/Mayorista.jsx
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useProducts } from '../context/ProductContext'
import './Mayorista.css'
import logo from '../assets/imagenes/logolu.png'
import { useCart } from '../context/CartContext';

function Mayorista() {
  const { products, loading: productsLoading } = useProducts()
  const [mayoristaProducts, setMayoristaProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart();

  useEffect(() => {
    if (!productsLoading && products.length > 0) {
      console.log('📦 Products disponibles:', products);
      
      // ✅ FILTRO MEJORADO - maneja diferentes variantes
      const mayoristaItems = products.filter(product => {
        if (!product || !product.category) return false;
        
        const categoryLower = product.category.toLowerCase();
        return categoryLower === 'mayorista' || 
               categoryLower === 'wholesale' ||
               categoryLower.includes('mayorista');
      });
      
      console.log('🏢 Productos mayoristas filtrados:', mayoristaItems);
      setMayoristaProducts(mayoristaItems);
      setLoading(false);
    } else if (!productsLoading) {
      setMayoristaProducts([]);
      setLoading(false);
    }
  }, [products, productsLoading]);

  if (loading || productsLoading) {
    return (
      <div className="mayorista-page">
        <div className="loading">🔄 Cargando productos mayoristas...</div>
      </div>
    )
  }

  return (
    <div className="mayorista-page">
      <header className="mayorista-header">
        <div className="container">
          <img src={logo} alt="By Luciana" className="mayorista-logo" />
          <h1 className="mayorista-title">🏢 Mayorista</h1>
          <p className="mayorista-subtitle">Precios especiales para compras al por mayor</p>
        </div>
      </header>

      <main className="mayorista-content">
        <div className="container">
          {mayoristaProducts.length === 0 ? (
            <div className="no-products">
              <div className="no-products-icon">📦</div>
              <h3>No hay productos mayoristas</h3>
              <p>Los productos que agregues en la categoría "Mayorista" aparecerán aquí</p>
              
              {/* INFO DE DEBUG */}
              <div style={{background: '#e7f3ff', padding: '15px', borderRadius: '8px', margin: '15px 0', border: '1px solid #b3d9ff'}}>
                <h4 style={{margin: '0 0 10px 0', color: '#0066cc'}}>💡 Información del Sistema:</h4>
                <p style={{margin: '5px 0', fontSize: '14px'}}><strong>Total productos:</strong> {products.length}</p>
                <p style={{margin: '5px 0', fontSize: '14px'}}>
                  <strong>Categorías encontradas:</strong> {[...new Set(products.map(p => p?.category))].join(', ')}
                </p>
                <p style={{margin: '5px 0', fontSize: '12px', color: '#666'}}>
                  <em>¿Falta algún producto? Revisa que la categoría sea exactamente "mayorista"</em>
                </p>
              </div>
              
              <Link to="/admin" className="btn btn-primary">
                Ir al Panel de Administración
              </Link>
            </div>
          ) : (
            <>
              <div className="mayorista-stats">
                <p>📊 {mayoristaProducts.length} producto(s) disponibles para mayorista</p>
              </div>
              
              <div className="mayorista-products-grid">
                {mayoristaProducts.map(product => (
                  <div key={product._id} className="mayorista-product-card">
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
                      <div className="mayorista-badge">MAYORISTA</div>
                      {product.featured && <div className="featured-badge">⭐ Destacado</div>}
                    </div>
                    
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-description">{product.description || 'Sin descripción'}</p>
                      
                      <div className="price-section">
                        <span className="current-price">${product.price?.toLocaleString()}</span>
                        <span className="mayorista-price">Precio mayorista</span>
                      </div>
                      
                      <div className="product-meta">
                        <span className="stock">Stock: {product.stock || 0}</span>
                        <span className="category">Categoría: {product.category}</span>
                      </div>
                    </div>

                    // En el header, después del título, agrega:
<button 
  onClick={() => window.location.reload()} 
  style={{
    background: '#28a745',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginLeft: '10px'
  }}
>
  🔄 Recargar
</button>
                    
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

      <footer className="mayorista-footer">
        <div className="container">
          <Link to="/" className="btn btn-secondary">
            ← Volver a la Página Principal
          </Link>
        </div>
      </footer>
    </div>
  )
}

export default Mayorista;