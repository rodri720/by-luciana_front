// src/pages/Novedades.jsx - VERSIÓN MEJORADA
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useProducts } from '../context/ProductContext'
import './Novedades.css'
import logo from '../assets/imagenes/logolu.png'
import { useCart } from '../context/CartContext';

function Novedades() {
  const { products, loading: productsLoading } = useProducts()
  const [novedadesProducts, setNovedadesProducts] = useState([])
  const { addToCart } = useCart();

  // Estado para el modal de imagen
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Estado para el selector de opciones
  const [showOptions, setShowOptions] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // Filtrar solo productos de novedades
  useEffect(() => {
    if (!productsLoading && products.length > 0) {
      const novedadesItems = products.filter(product => 
        product.category && product.category.toLowerCase() === 'novedades'
      );
      
      console.log('🆕 Productos de novedades:', novedadesItems.length);
      
      setNovedadesProducts(novedadesItems);
      setLoading(false);
    } else if (!productsLoading) {
      setLoading(false);
    }
  }, [products, productsLoading]);

  // Función para abrir selector de opciones
  const openOptions = (product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes?.[0] || '');
    setSelectedColor(product.colors?.[0] || '');
    setShowOptions(true);
  };

  // Función para agregar al carrito con opciones seleccionadas
  const addToCartWithOptions = () => {
    if (!selectedProduct) return;
    
    const productWithOptions = {
      ...selectedProduct,
      selectedSize: selectedSize || null,
      selectedColor: selectedColor || null
    };
    
    addToCart(productWithOptions);
    
    // Cerrar modal
    setShowOptions(false);
    setSelectedProduct(null);
  };

  // Funciones del modal de imágenes
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
      if (e.key === 'Escape') {
        closeImageModal();
        setShowOptions(false);
      }
      if (selectedImage && e.key === 'ArrowRight') goToNextImage();
      if (selectedImage && e.key === 'ArrowLeft') goToPrevImage();
    };

    if (selectedImage || showOptions) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [selectedImage, showOptions]);

  if (loading || productsLoading) {
    return (
      <div className="novedades-page">
        <div className="loading">🔄 Cargando novedades...</div>
      </div>
    )
  }

  return (
    <div className="novedades-page">
      <header className="novedades-header">
        <div className="container">
          <img src={logo} alt="By Luciana" className="novedades-logo" />
          <h1 className="novedades-title">
            🆕 Novedades
          </h1>
          <p className="novedades-subtitle">
            {novedadesProducts.length} producto(s) disponibles
          </p>
          
          <div className="header-buttons">
            <button 
              onClick={() => window.location.reload()} 
              className="reload-btn"
            >
              🔄 Recargar
            </button>
          </div>
        </div>
      </header>

      <main className="novedades-content">
        <div className="container">
          {novedadesProducts.length === 0 ? (
            <div className="no-products">
              <div className="no-products-icon">📦</div>
              <h3>No hay productos de novedades</h3>
              <p>Los productos que agregues en la categoría "novedades" aparecerán aquí</p>
              
              <div className="info-box">
                <h4>💡 Información:</h4>
                <p><strong>Total productos:</strong> {products.length}</p>
                <p>
                  <strong>Categorías:</strong> {[...new Set(products.map(p => p?.category))].join(', ')}
                </p>
              </div>
              
              <Link to="/admin" className="btn btn-primary">
                Ir al Panel de Administración
              </Link>
            </div>
          ) : (
            <>
              <div className="novedades-stats">
                <p>📊 {novedadesProducts.length} producto(s) de novedades</p>
              </div>
              
              <div className="novedades-products-grid">
                {novedadesProducts.map(product => (
                  <div key={product._id} className="novedades-product-card">
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
                      <div className="product-badge">{product.category}</div>
                      {product.featured && <div className="featured-badge">⭐ Destacado</div>}
                    </div>
                    
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-description">{product.description || 'Sin descripción'}</p>
                      
                      {/* Mostrar opciones disponibles de forma simple */}
                      <div className="product-options">
                        {product.sizes && product.sizes.length > 0 && (
                          <div className="option-item">
                            <span className="option-label">📏 Talles:</span>
                            <span className="option-values">{product.sizes.join(', ')}</span>
                          </div>
                        )}
                        
                        {product.colors && product.colors.length > 0 && (
                          <div className="option-item">
                            <span className="option-label">🎨 Colores:</span>
                            <div className="color-dots">
                              {product.colors.slice(0, 4).map((color, index) => (
                                <span 
                                  key={index}
                                  className="color-dot"
                                  style={{ backgroundColor: getColorHex(color) }}
                                  title={color}
                                />
                              ))}
                              {product.colors.length > 4 && (
                                <span className="more-options">+{product.colors.length - 4}</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="price-section">
                        <span className="current-price">${product.price?.toLocaleString()}</span>
                        {product.comparePrice && product.comparePrice > product.price && (
                          <span className="compare-price">${product.comparePrice.toLocaleString()}</span>
                        )}
                      </div>
                      
                      <div className="product-meta">
                        <span className={`stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                          {product.stock > 0 ? `✅ ${product.stock} disponibles` : '❌ Sin stock'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="product-actions">
                      <button 
                        className="btn-choose-options"
                        onClick={() => openOptions(product)}
                        disabled={!product.stock || product.stock === 0}
                      >
                        {(!product.stock || product.stock === 0) 
                          ? 'Sin Stock' 
                          : (product.sizes?.length > 0 || product.colors?.length > 0)
                            ? '🛍️ Elegir Opciones'
                            : '🛒 Agregar al Carrito'
                        }
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
            
            <div className="modal-info">
              <p>{selectedImage.name}</p>
              {selectedImage.images.length > 1 && (
                <p>Imagen {currentImageIndex + 1} de {selectedImage.images.length}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal para elegir opciones */}
      {showOptions && selectedProduct && (
        <div className="options-modal" onClick={() => setShowOptions(false)}>
          <div className="options-content" onClick={(e) => e.stopPropagation()}>
            <button className="options-close" onClick={() => setShowOptions(false)}>
              ×
            </button>
            
            <h2>Elegir Opciones</h2>
            <p className="options-product-name">{selectedProduct.name}</p>
            
            {/* Selector de talla - SIMPLE */}
            {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
              <div className="options-section">
                <h3>📏 Seleccionar Talle:</h3>
                <div className="size-buttons">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Selector de color - SIMPLE */}
            {selectedProduct.colors && selectedProduct.colors.length > 0 && (
              <div className="options-section">
                <h3>🎨 Seleccionar Color:</h3>
                <div className="color-buttons">
                  {selectedProduct.colors.map((color) => (
                    <button
                      key={color}
                      className={`color-btn ${selectedColor === color ? 'selected' : ''}`}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                      style={{ backgroundColor: getColorHex(color) }}
                    >
                      <span className="color-text">{color}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="options-summary">
              <div className="summary-item">
                <span>Producto:</span>
                <strong>{selectedProduct.name}</strong>
              </div>
              {selectedSize && (
                <div className="summary-item">
                  <span>Talle:</span>
                  <strong>{selectedSize}</strong>
                </div>
              )}
              {selectedColor && (
                <div className="summary-item">
                  <span>Color:</span>
                  <strong>{selectedColor}</strong>
                </div>
              )}
              <div className="summary-price">
                <span>Precio:</span>
                <strong>${selectedProduct.price?.toLocaleString()}</strong>
              </div>
            </div>
            
            <div className="options-actions">
              <button 
                className="btn-add-to-cart"
                onClick={addToCartWithOptions}
              >
                🛒 Agregar al Carrito
              </button>
              <button 
                className="btn-cancel"
                onClick={() => setShowOptions(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="novedades-footer">
        <div className="container">
          <Link to="/" className="btn btn-secondary">
            ← Volver a la Página Principal
          </Link>
        </div>
      </footer>
    </div>
  )
}

// Función auxiliar para colores
function getColorHex(colorName) {
  const colorMap = {
    'Negro': '#000000',
    'Blanco': '#FFFFFF',
    'Gris': '#808080',
    'Azul Marino': '#000080',
    'Azul Claro': '#87CEEB',
    'Rojo': '#FF0000',
    'Verde': '#008000',
    'Amarillo': '#FFFF00',
    'Rosa': '#FFC0CB',
    'Beige': '#F5F5DC',
    'Marrón': '#A52A2A',
    'Naranja': '#FFA500',
    'Violeta': '#EE82EE',
    'Celeste': '#87CEEB',
    'Turquesa': '#40E0D0',
    'Bordó': '#800000'
  };
  return colorMap[colorName] || '#CCCCCC';
}

export default Novedades;