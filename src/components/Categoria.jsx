// src/pages/Categoria.jsx - VERSIÓN CORREGIDA
import { Link, useParams } from 'react-router-dom'
import { useEffect, useState, useMemo } from 'react'
import { useProducts } from '../context/ProductContext'
import './Categoria.css'
import logo from '../assets/imagenes/logolu.png'
import { useCart } from '../context/CartContext';


function Categoria() {
  const { categoria } = useParams()
  const { products, loading: productsLoading } = useProducts()
  const [categoryProducts, setCategoryProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart();

  // Estado para el modal de imagen
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Definir TODAS las categorías y sus keywords - CON useMemo PARA EVITAR RENDERIZADOS
  const categoriasConfig = useMemo(() => ({
    remeras: {
      name: '👕 Remeras',
      keywords: ['remera', 'camiseta', 't-shirt', 'tshirt', 'camisa'],
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop'
    },
    buzos: {
      name: '🧥 Buzos',
      keywords: ['buzo', 'sudadera', 'hoodie', 'capucha', 'abrigo', 'sweater'],
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=300&fit=crop'
    },
    sueters: {
      name: '🥼 Suéteres',
      keywords: ['suéter', 'sueter', 'pullover', 'chomba', 'polo', 'sweater'],
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=300&fit=crop'
    },
    bodys: {
      name: '👚 Bodys',
      keywords: ['body', 'enterizo', 'mono', 'jumpsuit', 'malla', 'enteriza'],
      image: 'https://images.unsplash.com/photo-1583496661160-fb5886a13d77?w=400&h=300&fit=crop'
    },
    jeans: {
      name: '👖 Jeans',
      keywords: ['jeans', 'jean', 'vaquero', 'denim', 'pantalon', 'pantalones'],
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=300&fit=crop'
    },
    shorts: {
      name: '🩳 Shorts',
      keywords: ['shorts', 'short', 'bermuda', 'corto', 'pantalon corto'],
      image: 'https://images.unsplash.com/photo-1506629905607-e48b0e67d879?w=400&h=300&fit=crop'
    },
    vestidos: {
      name: '👗 Vestidos',
      keywords: ['vestido', 'fiesta', 'noche', 'vestir', 'faldas'],
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop'
    },
    calzados: {
      name: '👟 Calzados',
      keywords: ['zapato', 'zapatilla', 'calzado', 'bota', 'sandalia', 'calzados', 'zapatos'],
      image: 'https://images.unsplash.com/photo-1542280756-74b2f55e73ab?w=400&h=300&fit=crop'
    }, 
    accesorios: {
      name: '👚 Accesorios',
      keywords: ['cintos', 'collares', 'aros', 'carteras'],
      image: 'https://images.unsplash.com/photo-1583496661160-fb5886a13d77?w=400&h=300&fit=crop'
    }
  }), []); // <- Array de dependencias vacío para que no cambie

  // Obtener la configuración de la categoría actual - CON useMemo
  const categoriaActual = useMemo(() => {
    return categoriasConfig[categoria] || {
      name: 'Categoría',
      keywords: [],
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'
    };
  }, [categoria, categoriasConfig]); // <- Solo cambia cuando cambia la categoría

  useEffect(() => {
    if (!productsLoading) {
      console.log('📦 Products disponibles:', products.length);
      console.log('🏷️ Categoría actual:', categoria);
      setLoading(false);
    }
  }, [products, productsLoading, categoria]);

  // FILTRADO CORREGIDO - SIN LOOP INFINITO
  useEffect(() => {
    if (categoria && products.length > 0) {
      console.log(`🎯 Buscando productos para categoría: ${categoria}`);
      console.log(`🔑 Keywords usados:`, categoriaActual.keywords);
      
      const filteredProducts = products.filter(product => {
        if (!product || !product.category) return false;
        
        const categoryLower = product.category.toLowerCase().trim();
        const nameLower = product.name?.toLowerCase().trim() || '';
        const descriptionLower = product.description?.toLowerCase().trim() || '';
        
        // ESTRATEGIA DE BÚSQUEDA
        
        // 1. Coincidencia EXACTA en categoría (máxima prioridad)
        if (categoryLower === categoria) {
          console.log(`🎯 EXACTO - Producto "${product.name}" coincide por categoría exacta`);
          return true;
        }
        
        // 2. Coincidencia en nombre del producto (alta prioridad)
        const nameMatches = categoriaActual.keywords.some(keyword => {
          const match = nameLower.includes(keyword.toLowerCase());
          if (match) {
            console.log(`✅ NOMBRE - Producto "${product.name}" coincide por keyword: ${keyword}`);
          }
          return match;
        });
        if (nameMatches) return true;
        
        // 3. Coincidencia en categoría del producto (media prioridad)
        const categoryMatches = categoriaActual.keywords.some(keyword => {
          const match = categoryLower.includes(keyword.toLowerCase());
          if (match) {
            console.log(`✅ CATEGORÍA - Producto "${product.name}" coincide por categoría con keyword: ${keyword}`);
          }
          return match;
        });
        if (categoryMatches) return true;
        
        // 4. Coincidencia en descripción (baja prioridad)
        const descriptionMatches = categoriaActual.keywords.some(keyword => 
          descriptionLower.includes(keyword.toLowerCase())
        );
        if (descriptionMatches) {
          console.log(`✅ DESCRIPCIÓN - Producto "${product.name}" coincide por descripción`);
          return true;
        }
        
        // 5. Búsqueda por la palabra de la categoría misma
        if (nameLower.includes(categoria.toLowerCase()) || categoryLower.includes(categoria.toLowerCase())) {
          console.log(`✅ CATEGORÍA BASE - Producto "${product.name}" coincide por palabra de categoría`);
          return true;
        }
        
        console.log(`❌ Producto "${product.name}" NO coincide con ${categoria}`);
        return false;
      });
      
      console.log(`📦 RESULTADO - Productos de ${categoria}:`, filteredProducts.length);
      console.log('📋 Lista de productos encontrados:', filteredProducts.map(p => p.name));
      setCategoryProducts(filteredProducts);
    } else {
      setCategoryProducts([]);
    }
  }, [categoria, products, categoriaActual]); // <- Usar categoriaActual en lugar de categoriaActual.keywords

  // Resto del código se mantiene igual...
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

  // Encontrar productos similares para debug - CON useMemo
  const productosSimilares = useMemo(() => {
    return products.filter(product => {
      if (!product || !product.name) return false;
      const nameLower = product.name.toLowerCase();
      const categoryLower = product.category?.toLowerCase() || '';
      
      return categoriaActual.keywords.some(keyword => 
        nameLower.includes(keyword.toLowerCase()) ||
        categoryLower.includes(keyword.toLowerCase()) ||
        nameLower.includes(categoria?.toLowerCase() || '') ||
        categoryLower.includes(categoria?.toLowerCase() || '')
      );
    });
  }, [products, categoriaActual, categoria]);

  if (loading || productsLoading) {
    return (
      <div className="categoria-page">
        <div className="loading">🔄 Cargando productos de {categoriaActual.name}...</div>
      </div>
    )
  }

  return (
    <div className="categoria-page">
      <header className="categoria-header">
        <div className="container">
          <img src={logo} alt="By Luciana" className="categoria-logo" />
          <h1 className="categoria-title">
            {categoriaActual.name}
          </h1>
          <p className="categoria-subtitle">
            Productos de {categoriaActual.name.toLowerCase()}
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

      <main className="categoria-content">
        <div className="container">
          {categoryProducts.length === 0 ? (
            <div className="no-products">
              <div className="no-products-icon">📦</div>
              <h3>No hay productos en {categoriaActual.name}</h3>
              <p>Los productos que agregues en esta categoría aparecerán aquí</p>
              
              <div className="debug-info">
                <h4>💡 Información del Sistema:</h4>
                <p><strong>Total productos:</strong> {products.length}</p>
                <p><strong>Categorías encontradas:</strong> {[...new Set(products.map(p => p?.category))].join(', ') || 'Ninguna'}</p>
                <p><strong>Keywords para {categoria}:</strong> {categoriaActual.keywords.join(', ')}</p>
                
                {productosSimilares.length > 0 && (
                  <div className="similar-products">
                    <h5>🔍 Productos con nombres/categorías similares encontrados:</h5>
                    {productosSimilares.map(product => (
                      <div key={product._id} className="similar-product">
                        <strong>"{product.name}"</strong> 
                        <br/>
                        <span style={{color: '#667eea'}}>Categoría: {product.category}</span>
                        <br/>
                        <small style={{color: '#666'}}>Descripción: {product.description || 'Sin descripción'}</small>
                      </div>
                    ))}
                    <p style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>
                      <em>Estos productos tienen nombres o categorías que coinciden con las keywords pero no pasaron el filtro completo.</em>
                    </p>
                  </div>
                )}
              </div>
              
              <div className="action-buttons">
                <Link to="/admin" className="btn btn-primary">
                  Ir al Panel de Administración
                </Link>
                <Link to="/" className="btn btn-secondary">
                  Volver al Inicio
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="categoria-stats">
                <p>📊 {categoryProducts.length} producto(s) en {categoriaActual.name}</p>
              </div>
              
              <div className="categoria-products-grid">
                {categoryProducts.map(product => (
                  <div key={product._id} className="categoria-product-card">
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
                      <div className="categoria-badge">{product.category}</div>
                      {product.featured && <div className="featured-badge">⭐ Destacado</div>}
                    </div>
                    
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-description">{product.description || 'Sin descripción'}</p>
                      
                      <div className="price-section">
                        <span className="current-price">${product.price?.toLocaleString()}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="original-price">${product.originalPrice.toLocaleString()}</span>
                        )}
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
            
            <div className="modal-info">
              <p>{selectedImage.name}</p>
              {selectedImage.images.length > 1 && (
                <p>Imagen {currentImageIndex + 1} de {selectedImage.images.length}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="categoria-footer">
        <div className="container">
          <Link to="/" className="btn btn-secondary">
            ← Volver a la Página Principal
          </Link>
        </div>
      </footer>
    </div>
  )
}

export default Categoria;