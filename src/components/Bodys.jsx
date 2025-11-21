// src/pages/Bodys.jsx
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useProducts } from '../context/ProductContext'
import './Bodys.css'
import logo from '../assets/imagenes/logolu.png'
import { useCart } from '../context/CartContext';

function Bodys() {
  const { products, loading: productsLoading } = useProducts()
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categoryProducts, setCategoryProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart();

  // Estado para el modal de imagen
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Definir las subcategorías disponibles con imágenes LOCALES
  const subcategories = [
    { 
      id: 'remeras', 
      name: '👕 Remeras', 
      icon: '👕', 
      keywords: ['remeras', 'remera', 'camiseta', 'camisetas', 't-shirt', 'tshirt'],
      image: '/src/assets/imagenes/remeras-category.jpg'
    },
    { 
      id: 'buzos', 
      name: '🧥 Buzos', 
      icon: '🧥', 
      keywords: ['buzos', 'buzo', 'sudadera', 'sweater', 'hoodie', 'capucha'],
      image: '/src/assets/imagenes/buzos-category.jpg'
    },
    { 
      id: 'bodys', 
      name: '👚 Bodys', 
      icon: '👚', 
      keywords: ['bodys', 'body', 'enterizo', 'mono', 'jumpsuit'],
      image: '/src/assets/imagenes/bodys-category.jpg'
    },
    { 
      id: 'sueters', 
      name: '🥼 Suéteres', 
      icon: '🥼', 
      keywords: ['sueters', 'suéter', 'sueter', 'pullover', 'chomba', 'polo'],
      image: '/src/assets/imagenes/sueters-category.jpg'
    }
  ];

  // Imágenes de respaldo de Unsplash
  const defaultImages = {
    remeras: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
    buzos: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=300&fit=crop',
    bodys: 'https://images.unsplash.com/photo-1583496661160-fb5886a13d77?w=400&h=300&fit=crop',
    sueters: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=300&fit=crop'
  };

  // Función para obtener la imagen correcta
  const getCategoryImage = (subcat) => {
    try {
      const localImage = new URL(subcat.image, window.location.origin);
      return localImage.href;
    } catch (error) {
      return defaultImages[subcat.id];
    }
  };

  useEffect(() => {
    if (!productsLoading && products.length > 0) {
      console.log('📦 Products disponibles:', products);
      console.log('🏷️ Todas las categorías en productos:', [...new Set(products.map(p => p?.category))]);
      setLoading(false);
    } else if (!productsLoading) {
      setLoading(false);
    }
  }, [products, productsLoading]);

  // Filtrar productos cuando se selecciona una categoría
  useEffect(() => {
    if (selectedCategory && products.length > 0) {
      const subcategory = subcategories.find(sub => sub.id === selectedCategory);
      
      const filteredProducts = products.filter(product => {
        if (!product || !product.category) return false;
        
        const categoryLower = product.category.toLowerCase().trim();
        const nameLower = product.name?.toLowerCase().trim() || '';
        
        console.log(`🔍 Analizando producto: "${product.name}" (categoría: "${categoryLower}")`);

        if (subcategory) {
          const hasKeyword = subcategory.keywords.some(keyword => 
            nameLower.includes(keyword) ||
            categoryLower.includes(keyword)
          );
          
          if (hasKeyword) {
            console.log(`✅ Producto "${product.name}" coincide con ${selectedCategory} por keyword`);
            return true;
          }
        }
        
        console.log(`❌ Producto "${product.name}" NO coincide con ${selectedCategory}`);
        return false;
      });
      
      console.log(`📦 Productos de ${selectedCategory}:`, filteredProducts);
      setCategoryProducts(filteredProducts);
    }
  }, [selectedCategory, products]);

  // Contar productos por categoría
  const getProductCount = (subcategoryId) => {
    if (!products.length) return 0;
    
    const subcategory = subcategories.find(sub => sub.id === subcategoryId);
    if (!subcategory) return 0;
    
    return products.filter(product => {
      if (!product || !product.category) return false;
      
      const categoryLower = product.category.toLowerCase().trim();
      const nameLower = product.name?.toLowerCase().trim() || '';
      
      return subcategory.keywords.some(keyword => 
        nameLower.includes(keyword) ||
        categoryLower.includes(keyword)
      );
    }).length;
  };

  // Resto de las funciones del modal
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
      <div className="bodys-page">
        <div className="loading">🔄 Cargando...</div>
      </div>
    )
  }

  return (
    <div className="bodys-page">
      <header className="bodys-header">
        <div className="container">
          <img src={logo} alt="By Luciana" className="bodys-logo" />
          <h1 className="bodys-title">
            {selectedCategory 
              ? `📁 ${subcategories.find(sub => sub.id === selectedCategory)?.name || selectedCategory}` 
              : '👚 Parte Superior'
            }
          </h1>
          <p className="bodys-subtitle">
            {selectedCategory 
              ? `Productos de ${selectedCategory}` 
              : 'Selecciona una categoría para ver los productos'
            }
          </p>
          
          <div className="header-buttons">
            {selectedCategory && (
              <button 
                onClick={() => {
                  setSelectedCategory(null);
                  setCategoryProducts([]);
                }} 
                className="btn btn-secondary"
              >
                ← Volver a Categorías
              </button>
            )}
            <button 
              onClick={() => window.location.reload()} 
              className="reload-btn"
            >
              🔄 Recargar
            </button>
          </div>
        </div>
      </header>

      <main className="bodys-content">
        <div className="container">
          {!selectedCategory ? (
            <div className="categories-section">
              <h2>📂 Categorías Disponibles</h2>
              <div className="categories-grid">
                {subcategories.map(subcat => {
                  const productCount = getProductCount(subcat.id);

                  return (
                    <div 
                      key={subcat.id}
                      className="category-card"
                      onClick={() => setSelectedCategory(subcat.id)}
                    >
                      <div className="category-image-container">
                        <img 
                          src={getCategoryImage(subcat)} 
                          alt={subcat.name}
                          className="category-image"
                          onError={(e) => {
                            console.log(`❌ Error cargando imagen local para ${subcat.name}, usando respaldo`);
                            e.target.src = defaultImages[subcat.id];
                          }}
                        />
                      </div>
                      <div className="category-simple-info">
                        <h3 className="category-name">{subcat.name}</h3>
                        <p className="category-count">{productCount} producto(s)</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              {categoryProducts.length === 0 ? (
                <div className="no-products">
                  <div className="no-products-icon">📦</div>
                  <h3>No hay productos en {selectedCategory}</h3>
                  <p>Los productos que agregues en la categoría "{selectedCategory}" aparecerán aquí</p>
                  
                  <div style={{background: '#e7f3ff', padding: '15px', borderRadius: '8px', margin: '15px 0', border: '1px solid #b3d9ff'}}>
                    <h4 style={{margin: '0 0 10px 0', color: '#0066cc'}}>💡 Información del Sistema:</h4>
                    <p style={{margin: '5px 0', fontSize: '14px'}}><strong>Total productos:</strong> {products.length}</p>
                    <p style={{margin: '5px 0', fontSize: '14px'}}>
                      <strong>Categorías encontradas:</strong> {[...new Set(products.map(p => p?.category))].join(', ')}
                    </p>
                  </div>
                  
                  <Link to="/admin" className="btn btn-primary">
                    Ir al Panel de Administración
                  </Link>
                </div>
              ) : (
                <>
                  <div className="bodys-stats">
                    <p>📊 {categoryProducts.length} producto(s) en {selectedCategory}</p>
                  </div>
                  
                  <div className="bodys-products-grid">
                    {categoryProducts.map(product => (
                      <div key={product._id} className="bodys-product-card">
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
                          <div className="bodys-badge">{product.category}</div>
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

      <footer className="bodys-footer">
        <div className="container">
          <Link to="/" className="btn btn-secondary">
            ← Volver a la Página Principal
          </Link>
        </div>
      </footer>
    </div>
  )
}

export default Bodys;