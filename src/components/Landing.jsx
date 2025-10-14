import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import './Landing.css'
import imagen1 from '../assets/imagenes/carousel1.jpg'
import imagen2 from '../assets/imagenes/carousel2.jpg'
import imagen3 from '../assets/imagenes/carousel3.jpg'
import imagen4 from '../assets/imagenes/carousel4.jpg'
import imagen5 from '../assets/imagenes/carousel5.jpg'
import imagen6 from '../assets/imagenes/carousel6.jpg'

function Landing() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { products, categories, loading } = useProducts()
  
  const carouselImages = [imagen1, imagen2, imagen3, imagen4, imagen5, imagen6]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [carouselImages.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }

  // Obtener productos destacados
  const featuredProducts = products.filter(product => product.featured).slice(0, 6)

  return (
    <section className="landing">
      {/* Carousel (se mantiene igual) */}
      <div className="carousel-section">
        {/* ... mismo código del carousel ... */}
      </div>

      {/* Categories Section - Ahora con productos reales */}
      <div className="categories-section">
        <div className="container">
          <h2 className="section-title">Nuestras Categorías</h2>
          
          {loading ? (
            <div className="loading">Cargando productos...</div>
          ) : (
            <>
              <div className="categories-grid">
                {featuredProducts.slice(0, 3).map((product, index) => (
                  <div key={product._id} className="category-card">
                    <div 
                      className="category-image" 
                      style={{ 
                        backgroundImage: product.images && product.images.length > 0 
                          ? `url(${product.images[0]})` 
                          : 'linear-gradient(45deg, #667eea, #764ba2)'
                      }}
                    >
                      <span className="category-label">
                        {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                      </span>
                    </div>
                    <h3>{product.name}</h3>
                    <p className="product-price">${product.price}</p>
                  </div>
                ))}
              </div>

              <div className="categories-grid">
                {featuredProducts.slice(3, 6).map((product) => (
                  <div key={product._id} className="category-card">
                    <div 
                      className="category-image" 
                      style={{ 
                        backgroundImage: product.images && product.images.length > 0 
                          ? `url(${product.images[0]})` 
                          : 'linear-gradient(45deg, #667eea, #764ba2)'
                      }}
                    >
                      <span className="category-label">
                        {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                      </span>
                    </div>
                    <h3>{product.name}</h3>
                    <p className="product-price">${product.price}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Features Section (se mantiene igual) */}
      <div className="features-section">
        {/* ... mismo código ... */}
      </div>

      {/* Newsletter Section (se mantiene igual) */}
      <div className="newsletter-section">
        {/* ... mismo código ... */}
      </div>
    </section>
  )
}

export default Landing