// src/pages/Mayorista.jsx
import { Link } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { useProducts } from '../context/ProductContext'
import './Mayorista.css'
import logo from '../assets/imagenes/logolu.png'
import { useCart } from '../context/CartContext';

function Mayorista() {
  const { products, loadProducts } = useProducts()
  const [mayoristaProducts, setMayoristaProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart();

  useEffect(() => {
    const loadMayoristaProducts = async () => {
      try {
        await loadProducts();
        const mayoristaItems = products.filter(product => 
          product.category === 'mayorista' || product.category === 'wholesale'
        )
        setMayoristaProducts(mayoristaItems)
      } catch (error) {
        console.error('Error loading mayorista products:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMayoristaProducts()
  }, [products, loadProducts])

  if (loading) {
    return (
      <div className="mayorista-page">
        <div className="loading">🔄 Cargando productos mayoristas...</div>
      </div>
    )
  }

  return (
    <div className="mayorista-page">
      {/* Header con logo */}
      <header className="mayorista-header">
        <div className="container">
          <img src={logo} alt="By Luciana" className="mayorista-logo" />
          <h1 className="mayorista-title">🏢 Mayorista</h1>
          <p className="mayorista-subtitle">Precios especiales para compras al por mayor</p>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="mayorista-content">
        <div className="container">
          {mayoristaProducts.length === 0 ? (
            <div className="no-products">
              <div className="no-products-icon">📦</div>
              <h3>No hay productos mayoristas</h3>
              <p>Los productos que agregues en la categoría "Mayorista" aparecerán aquí</p>
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
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                      ) : null}
                      <div className="image-placeholder">
                        📷
                      </div>
                      <div className="mayorista-badge">MAYORISTA</div>
                    </div>
                    
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-description">{product.description}</p>
                      
                      <div className="price-section">
                        <span className="current-price">${product.price?.toLocaleString()}</span>
                        <span className="mayorista-price">Precio mayorista</span>
                      </div>
                      
                      <div className="product-meta">
                        <span className="stock">Stock: {product.stock}</span>
                        {product.minimumOrder && (
                          <span className="minimum-order">Mínimo: {product.minimumOrder} unidades</span>
                        )}
                        {product.featured && <span className="featured-badge">⭐ Destacado</span>}
                      </div>
                    </div>
                    
                    <div className="product-actions">
                      <button 
                        className="btn-add-cart"
                        onClick={() => addToCart(product)}
                      >
                        🛒 Agregar al Carrito
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Botón para volver */}
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

export default Mayorista