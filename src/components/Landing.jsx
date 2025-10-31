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
// Importa tus imágenes de categorías
import ouletImage from '../assets/imagenes/oulet.jpg'
import novedadesImage from '../assets/imagenes/novedades.jpg'
import mayoristaImage from '../assets/imagenes/mayorista.jpg'
import calzadosImage from '../assets/imagenes/calzados.jpg'
import bodysImage from '../assets/imagenes/bodys.jpg'
import feriantesImage from '../assets/imagenes/feriantes.jpg'

function Landing() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { products, loading } = useProducts()
  
  const [email, setEmail] = useState('')
  const [loadingNewsletter, setLoadingNewsletter] = useState(false)
  const [message, setMessage] = useState('')
  
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

  const getProductsByCategory = (category) => {
    if (!products || !Array.isArray(products)) return []
    return products.filter(product => product && product.category === category)
  }

  const handleSubscribe = async (e) => {
    e.preventDefault()
    
    if (!email) {
      alert('Por favor ingresa tu email')
      return
    }

    setLoadingNewsletter(true)

    try {
      const response = await fetch('http://localhost:5000/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('¡Gracias por subscribirte a By Luciana Aliendo!')
        setMessage('¡Gracias por suscribirte! Revisa tu email para más detalles.')
        setEmail('')
      } else {
        alert(data.error || 'Error al suscribirse')
        setMessage(data.error || 'Error al suscribirse')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión')
      setMessage('Error de conexión')
    } finally {
      setLoadingNewsletter(false)
    }
  }

  if (loading) {
    return (
      <section className="landing">
        <div className="loading">Cargando productos...</div>
      </section>
    )
  }

  return (  
    <section className="landing">
      <div className="carousel-section">
        <div className="carousel-container">
          <div 
            className="carousel-slide" 
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {carouselImages.map((image, index) => (
              <div key={index} className="carousel-item">
                <div className="image-wrapper">
                  <img src={image} alt={`Moda By Luciana ${index + 1}`} className="carousel-image" />
                </div>
                <div className="carousel-overlay">
                  <h1 className="carousel-title">By Luciana</h1>
                  <p className="carousel-subtitle">Moda que expresa tu estilo único</p>
                  <div className="carousel-buttons">
                    <Link to="/productos" className="btn btn-primary">Ver Colección</Link>
                    <Link to="/nosotros" className="btn btn-secondary">Conocer Más</Link>
                              </div>
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-btn carousel-prev" onClick={prevSlide}>‹</button>
          <button className="carousel-btn carousel-next" onClick={nextSlide}>›</button>
        </div>
      </div>

      <div className="categories-section">
        <div className="container">
          <h2 className="section-title">Nuestras Categorías</h2>
          
          <div className="categories-grid">
           {/* Outlet */}
            <div className="category-card">
              <Link to="/outlet" className="category-link">
                <div 
                  className="category-image" 
                  style={{ backgroundImage: `url(${ouletImage})` }}
                >
                  <span className="category-label">Outlet</span>
                </div>
                <h3>Outlet</h3>
                {getProductsByCategory('outlet').slice(0, 1).map(product => (
                  <div key={product._id} className="product-info">
                    <p className="product-example">{product.name}</p>
                    <p className="product-price">Desde ${product.price}</p>
                  </div>
                ))}
                {getProductsByCategory('outlet').length === 0 && (
                  <div className="product-info">
                    <p className="product-example">Precios mayoristas</p>
                    <p className="product-price">Consultar</p>
                  </div>
                )}
              </Link>
            </div>
            
           {/* Novedades */}
           <div className="category-card">
              <Link to="/novedades" className="category-link">
                <div 
                  className="category-image" 
                  style={{ backgroundImage: `url(${novedadesImage})` }}
                >
                  <span className="category-label">Novedades</span>
                </div>
                <h3>Novedades</h3>
                {getProductsByCategory('novedades').slice(0, 1).map(product => (
                  <div key={product._id} className="product-info">
                    <p className="product-example">{product.name}</p>
                    <p className="product-price">Desde ${product.price}</p>
                  </div>
                ))}
                {getProductsByCategory('novedades').length === 0 && (
                  <div className="product-info">
                    <p className="product-example">Precios mayoristas</p>
                    <p className="product-price">Consultar</p>
                  </div>
                )}
              </Link>
            </div>
            
            {/* Mayorista */}
            <div className="category-card">
              <Link to="/mayorista" className="category-link">
                <div 
                  className="category-image" 
                  style={{ backgroundImage: `url(${mayoristaImage})` }}
                >
                  <span className="category-label">Mayorista</span>
                </div>
                <h3>Mayorista</h3>
                {getProductsByCategory('mayorista').slice(0, 1).map(product => (
                  <div key={product._id} className="product-info">
                    <p className="product-example">{product.name}</p>
                    <p className="product-price">Desde ${product.price}</p>
                  </div>
                ))}
                {getProductsByCategory('mayorista').length === 0 && (
                  <div className="product-info">
                    <p className="product-example">Precios mayoristas</p>
                    <p className="product-price">Consultar</p>
                  </div>
                )}
              </Link>
            </div>
          </div>

          <div className="categories-grid">
            {/* Accesorios */}
            <div className="category-card">
              <Link to="/feriantes" className="category-link">
                <div 
                  className="category-image" 
                  style={{ backgroundImage: `url(${feriantesImage})` }}
                >
                  <span className="category-label">Feriantes</span>
                </div>
                <h3>Feriantes</h3>
                {getProductsByCategory('feriantes').slice(0, 1).map(product => (
                  <div key={product._id} className="product-info">
                    <p className="product-example">{product.name}</p>
                    <p className="product-price">Desde ${product.price}</p>
                  </div>
                ))}
                {getProductsByCategory('feriantes').length === 0 && (
                  <div className="product-info">
                    <p className="product-example">Precios mayoristas</p>
                    <p className="product-price">Consultar</p>
                  </div>
                )}
              </Link>
            </div>
            
            {/* Calzados */}
            <div className="category-card">
              <Link to="/calzados" className="category-link">
                <div 
                  className="category-image" 
                  style={{ backgroundImage: `url(${calzadosImage})` }}
                >
                  <span className="category-label">Calzados</span>
                </div>
                <h3>Calzados</h3>
                {getProductsByCategory('calzados').slice(0, 1).map(product => (
                  <div key={product._id} className="product-info">
                    <p className="product-example">{product.name}</p>
                    <p className="product-price">Desde ${product.price}</p>
                  </div>
                ))}
                {getProductsByCategory('calzados').length === 0 && (
                  <div className="product-info">
                    <p className="product-example">Precios mayoristas</p>
                    <p className="product-price">Consultar</p>
                  </div>
                )}
              </Link>
            </div>
            
            {/* Bodys */}
            <div className="category-card">
              <Link to="/bodys" className="category-link">
                <div 
                  className="category-image" 
                  style={{ backgroundImage: `url(${bodysImage})` }}
                >
                  <span className="category-label">Bodys</span>
                </div>
                <h3>Bodys</h3>
                {getProductsByCategory('bodys').slice(0, 1).map(product => (
                  <div key={product._id} className="product-info">
                    <p className="product-example">{product.name}</p>
                    <p className="product-price">Desde ${product.price}</p>
                  </div>
                ))}
                {getProductsByCategory('bodys').length === 0 && (
                  <div className="product-info">
                    <p className="product-example">Precios mayoristas</p>
                    <p className="product-price">Consultar</p>
                  </div>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">¿Por qué elegirnos?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Envío Gratis</h3>
            <p>En compras mayores a $50.000</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">↩️</div>
            <h3>Devoluciones</h3>
            <p>30 días para cambiar tu producto</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Pago Seguro</h3>
            <p>Transacciones 100% protegidas</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Calidad Premium</h3>
            <p>Materiales de primera calidad</p>
          </div>
        </div>
      </div>

      <div className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2>¡No te pierdas nuestras novedades!</h2>
            <p>Suscríbete y recibe un 10% de descuento en tu primera compra</p>
            
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input 
                type="email" 
                placeholder="Tu correo electrónico" 
                className="newsletter-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loadingNewsletter}
              >
                {loadingNewsletter ? 'Suscribiendo...' : 'Suscribirse'}
              </button>
            </form>
            
            {message && (
              <div className={`newsletter-message ${message.includes('Error') ? 'error' : 'success'}`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Landing