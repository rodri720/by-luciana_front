import { useState, useEffect } from 'react'
import { useProducts } from '../context/ProductContext'
import { Link } from 'react-router-dom'
import './Productos.css'

// Componente mejorado para limpiar URLs
const ImageWithCleanUrl = ({ src, alt, className, onClick, ...props }) => {
  const [imageSrc, setImageSrc] = useState('')
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!src) {
      setHasError(true)
      return
    }
    
    let cleanUrl = src
    
    if (cleanUrl.includes('/uploads/')) {
      const parts = cleanUrl.split('/uploads/')
      const filename = parts[parts.length - 1]
      const cleanFilename = filename.replace(/^\//, '')
      cleanUrl = `http://localhost:5000/uploads/${cleanFilename}`
    }
    else if (!cleanUrl.startsWith('http')) {
      cleanUrl = `http://localhost:5000/uploads/${cleanUrl}`
    }
    
    setImageSrc(cleanUrl)
    setHasError(false)
  }, [src])

  const handleError = () => {
    setHasError(true)
  }

  if (hasError || !imageSrc) {
    return (
      <div 
        className="image-placeholder"
        onClick={onClick}
      >
        <div className="placeholder-content">
          <div className="placeholder-icon">📷</div>
          <div>Imagen no disponible</div>
        </div>
      </div>
    )
  }

  return (
    <img 
      src={imageSrc} 
      alt={alt} 
      className={className}
      onClick={onClick}
      onError={handleError}
      {...props}
    />
  )
}

function Productos() {
  const { products, loading } = useProducts()
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [selectedImage, setSelectedImage] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Procesar productos
  const productsWithImages = products.filter(
    product => product && product.images && product.images.length > 0
  )

  const filteredProducts = selectedCategory === 'todos' 
    ? productsWithImages 
    : productsWithImages.filter(product => product.category === selectedCategory)

  const categories = ['todos', 'novedades', 'mayorista', 'calzados', 'bodys', 'outlet','ventasalpormayor',]

  // Función para abrir imagen en modal
  const openImageModal = (product, index = 0) => {
    setSelectedImage(product)
    setCurrentImageIndex(index)
  }

  // Función para cerrar modal
  const closeImageModal = () => {
    setSelectedImage(null)
    setCurrentImageIndex(0)
  }

  // Navegar entre imágenes
  const goToNextImage = () => {
    if (selectedImage && selectedImage.images) {
      setCurrentImageIndex((prev) => 
        prev === selectedImage.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const goToPrevImage = () => {
    if (selectedImage && selectedImage.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedImage.images.length - 1 : prev - 1
      )
    }
  }

  // Cerrar modal con ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeImageModal()
      if (e.key === 'ArrowRight') goToNextImage()
      if (e.key === 'ArrowLeft') goToPrevImage()
    }

    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'auto'
    }
  }, [selectedImage])

  if (loading) {
    return (
      <section className="productos-page">
        <div className="loading">Cargando productos...</div>
      </section>
    )
  }

  return (
    <section className="productos-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Nuestra Colección</h1>
          <p className="page-subtitle">
            {productsWithImages.length} productos disponibles
          </p>
        </div>

        {/* Filtros */}
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'todos' ? 'Todos' : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Galería MEJORADA */}
        <div className="photos-gallery-improved">
          {filteredProducts.map(product => (
            <div key={product._id} className="photo-card">
              <div className="image-container">
                <ImageWithCleanUrl
                  src={product.images[0]}
                  alt={product.name}
                  className="product-photo-improved"
                  onClick={() => openImageModal(product, 0)}
                />
                <div 
                  className="zoom-overlay-improved"
                  onClick={() => openImageModal(product, 0)}
                >
                  🔍
                </div>
              </div>
              
              <div className="card-info">
                <h4 className="product-name-card">{product.name}</h4>
                <p className="product-price-card">${product.price}</p>
                <p className="product-category-card">{product.category}</p>
                
                {/* Link temporal - mientras creamos la página de producto */}
                <div className="card-actions">
                  <button className="btn-view-details">
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="no-products">
            <h3>No hay productos en esta categoría</h3>
          </div>
        )}
      </div>

      {/* Modal MEJORADO */}
      {selectedImage && (
        <div className="modal-overlay" onClick={closeImageModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeImageModal}>
              ×
            </button>
            
            {selectedImage.images && selectedImage.images.length > 1 && (
              <>
                <button className="modal-nav-btn modal-prev-btn" onClick={goToPrevImage}>
                  ‹
                </button>
                <button className="modal-nav-btn modal-next-btn" onClick={goToNextImage}>
                  ›
                </button>
              </>
            )}
            
            <div className="modal-image-container">
              {selectedImage.images && selectedImage.images[currentImageIndex] ? (
                <img 
                  src={
                    selectedImage.images[currentImageIndex].includes('/uploads/') 
                      ? `http://localhost:5000/uploads/${selectedImage.images[currentImageIndex].split('/uploads/').pop().replace(/^\//, '')}`
                      : selectedImage.images[currentImageIndex].startsWith('http') 
                        ? selectedImage.images[currentImageIndex] 
                        : `http://localhost:5000/uploads/${selectedImage.images[currentImageIndex]}`
                  } 
                  alt={selectedImage.name}
                  className="modal-image-content"
                />
              ) : (
                <div className="modal-placeholder">
                  <div className="placeholder-icon">📷</div>
                  <div>Imagen no disponible</div>
                </div>
              )}
            </div>
            
            <div className="modal-info">
              <h3 className="modal-product-name">{selectedImage.name}</h3>
              <p className="modal-product-price">${selectedImage.price}</p>
              <p className="modal-product-category">{selectedImage.category}</p>
              
              {selectedImage.images && selectedImage.images.length > 1 && (
                <p className="modal-image-counter">
                  Imagen {currentImageIndex + 1} de {selectedImage.images.length}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Productos