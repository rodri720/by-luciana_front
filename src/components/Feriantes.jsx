// src/pages/Feriantes.jsx
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useProducts } from '../context/ProductContext'
import './Feriantes.css'
import logo from '../assets/imagenes/logolu.png'
import { useCart } from '../context/CartContext';

function Feriantes() {
  const { products, loading: productsLoading } = useProducts()
  const [feriantesProducts, setFeriantesProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart();

  // Estado para el modal de imagen
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!productsLoading && products.length > 0) {
      console.log('📦 Products disponibles:', products);
      
      const feriantesItems = products.filter(product => {
        if (!product || !product.category) return false;
        
        const categoryLower = product.category.toLowerCase();
        return categoryLower === 'feriantes' || 
               categoryLower === 'feriante' ||
               categoryLower.includes('feriantes');
      });
      
      console.log('🎪 Productos feriantes filtrados:', feriantesItems);
      setFeriantesProducts(feriantesItems);
      setLoading(false);
    } else if (!productsLoading) {
      setFeriantesProducts([]);
      setLoading(false);
    }
  }, [products, productsLoading]);

  // Funciones para el modal
  const openImageModal = (product, index = 0) => {
    setSelectedImage(product);
    setCurrentImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setCurrentImageIndex(0);
  };

  const goToNextImage = () => {
    if (selectedImage && selectedImage.images) {
      setCurrentImageIndex((prev) => 
        prev === selectedImage.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const goToPrevImage = () => {
    if (selectedImage && selectedImage.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedImage.images.length - 1 : prev - 1
      );
    }
  };

  // Cerrar modal con ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeImageModal();
      if (e.key === 'ArrowRight') goToNextImage();
      if (e.key === 'ArrowLeft') goToPrevImage();
    };

    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [selectedImage]);

  if (loading || productsLoading) {
    return (
      <div className="feriantes-page">
        <div className="loading">🔄 Cargando productos feriantes...</div>
      </div>
    )
  }

  return (
    <div className="feriantes-page">
      <header className="feriantes-header">
        <div className="container">
          <img src={logo} alt="By Luciana" className="feriantes-logo" />
          <h1 className="feriantes-title">🎪 Feriantes</h1>
          <p className="feriantes-subtitle">Productos especiales para ferias y eventos</p>
          
          {/* Botón de recarga */}
          <button 
            onClick={() => window.location.reload()} 
            className="reload-btn"
          >
            🔄 Recargar
          </button>
        </div>
      </header>

      <main className="feriantes-content">
        <div className="container">
          {feriantesProducts.length === 0 ? (
            <div className="no-products">
              <div className="no-products-icon">🎪</div>
              <h3>No hay productos feriantes</h3>
              <p>Los productos que agregues en la categoría "Feriantes" aparecerán aquí</p>
              
              <div style={{background: '#e7f3ff', padding: '15px', borderRadius: '8px', margin: '15px 0', border: '1px solid #b3d9ff'}}>
                <h4 style={{margin: '0 0 10px 0', color: '#0066cc'}}>💡 Información del Sistema:</h4>
                <p style={{margin: '5px 0', fontSize: '14px'}}><strong>Total productos:</strong> {products.length}</p>
                <p style={{margin: '5px 0', fontSize: '14px'}}>
                  <strong>Categorías encontradas:</strong> {[...new Set(products.map(p => p?.category))].join(', ')}
                </p>
                <p style={{margin: '5px 0', fontSize: '12px', color: '#666'}}>
                  <em>¿Falta algún producto? Revisa que la categoría sea exactamente "feriantes"</em>
                </p>
              </div>
              
              <Link to="/admin" className="btn btn-primary">
                Ir al Panel de Administración
              </Link>
            </div>
          ) : (
            <>
              <div className="feriantes-stats">
                <p>📊 {feriantesProducts.length} producto(s) feriantes disponibles</p>
              </div>
              
              <div className="feriantes-products-grid">
                {feriantesProducts.map(product => (
                  <div key={product._id} className="feriantes-product-card">
                    <div 
                      className="product-image"
                      onClick={() => openImageModal(product, 0)}
                    >
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
                      <div className="feriantes-badge">FERIANTES</div>
                      {product.featured && <div className="featured-badge">⭐ Destacado</div>}
                    </div>
                    
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-description">{product.description || 'Sin descripción'}</p>
                      
                      <div className="price-section">
                        <span className="current-price">${product.price?.toLocaleString()}</span>
                        <span className="original-price">
                          {product.originalPrice && `$${product.originalPrice.toLocaleString()}`}
                        </span>
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

      {/* Modal para imagen agrandada */}
      {selectedImage && selectedImage.images && selectedImage.images[currentImageIndex] && (
        <div className="image-modal" onClick={closeImageModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeImageModal}>×</button>
            
            {selectedImage.images.length > 1 && (
              <>
                <button className="modal-nav modal-prev" onClick={goToPrevImage}>‹</button>
                <button className="modal-nav modal-next" onClick={goToNextImage}>›</button>
              </>
            )}
            
            <img 
              src={
                selectedImage.images[currentImageIndex].startsWith('http') 
                  ? selectedImage.images[currentImageIndex] 
                  : `http://localhost:5000${selectedImage.images[currentImageIndex]}`
              } 
              alt={selectedImage.name}
              className="modal-image"
            />
            
            <div style={{
              position: 'absolute',
              bottom: '-50px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'white',
              textAlign: 'center'
            }}>
              <p>{selectedImage.name}</p>
              {selectedImage.images.length > 1 && (
                <p>Imagen {currentImageIndex + 1} de {selectedImage.images.length}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="feriantes-footer">
        <div className="container">
          <Link to="/" className="btn btn-secondary">
            ← Volver a la Página Principal
          </Link>
        </div>
      </footer>
    </div>
  )
}

export default Feriantes;