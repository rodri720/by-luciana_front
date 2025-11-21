// src/pages/Calzados.jsx
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useProducts } from '../context/ProductContext'
import './Calzados.css'
import logo from '../assets/imagenes/logolu.png'
import { useCart } from '../context/CartContext';

function Calzados() {
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
      id: 'jeans', 
      name: '👖 Jeans', 
      icon: '👖', 
      keywords: ['jeans', 'jean', 'pantalon', 'pantalones', 'vaquero'],
      image: '/src/assets/imagenes/jeans-category.jpg'
    },
    { 
      id: 'vestidos', 
      name: '👗 Vestidos', 
      icon: '👗', 
      keywords: ['vestidos', 'vestido', 'vestir', 'fiesta', 'noche'],
      image: '/src/assets/imagenes/vestidos-category.jpg'
    },
    { 
      id: 'shorts', 
      name: '🩳 Shorts', 
      icon: '🩳', 
      keywords: ['shorts', 'short', 'bermuda', 'bermudas', 'pantalon corto'],
      image: '/src/assets/imagenes/shorts-category.jpg'
    },
    { 
      id: 'calzados', 
      name: '👟 Calzados', 
      icon: '👟', 
      keywords: ['calzados', 'calzado', 'zapatos', 'zapatillas', 'botas', 'sandalia', 'zapato'],
      image: '/src/assets/imagenes/calzados-category.jpg'
    }
  ];

  // Imágenes de respaldo de Unsplash
  const defaultImages = {
    jeans: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=300&fit=crop',
    vestidos: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop',
    shorts: 'https://images.unsplash.com/photo-1506629905607-e48b0e67d879?w=400&h=300&fit=crop',
    calzados: 'https://images.unsplash.com/photo-1542280756-74b2f55e73ab?w=400&h=300&fit=crop'
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
      <div className="calzados-page">
        <div className="loading">🔄 Cargando...</div>
      </div>
    )
  }

  return (
    <div className="calzados-page">
      <header className="calzados-header">
        <div className="container">
          <img src={logo} alt="By Luciana" className="calzados-logo" />
          <h1 className="calzados-title">
            {selectedCategory 
              ? `📁 ${subcategories.find(sub => sub.id === selectedCategory)?.name || selectedCategory}` 
              : '👚 Parte Inferior'
            }
          </h1>
          <p className="calzados-subtitle">
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

      <main className="calzados-content">
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
                        {/* SE ELIMINÓ EL OVERLAY */}
                      </div>
                      {/* SE ELIMINÓ CATEGORY-INFO */}
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
                  <div className="calzados-stats">
                    <p>📊 {categoryProducts.length} producto(s) en {selectedCategory}</p>
                  </div>
                  
                  <div className="calzados-products-grid">
                    {categoryProducts.map(product => (
                      <div key={product._id} className="calzados-product-card">
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
                          <div className="calzados-badge">{product.category}</div>
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

      <footer className="calzados-footer">
        <div className="container">
          <Link to="/" className="btn btn-secondary">
            ← Volver a la Página Principal
          </Link>
        </div>
      </footer>
    </div>
  )
}

export default Calzados;