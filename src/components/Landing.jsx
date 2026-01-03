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
import calzadosImage from '../assets/imagenes/calzados.jpg'
import bodysImage from '../assets/imagenes/bodys.jpg'
import accesoriosImage from '../assets/imagenes/accesorios.jpg' // Asegúrate de tener esta imagen
import remerasImage from '../assets/imagenes/remeras.jpg'
import ropadeportivaImage from '../assets/imagenes/ropadeportiva.jpg'
import vestidosImage from '../assets/imagenes/vestidos.jpg'
import jeansImage from '../assets/imagenes/jeans.jpg'
import abrigosImage from '../assets/imagenes/abrigos.jpg'
import ropainteriorImage from '../assets/imagenes/ropainterior.jpg'
import fiestaImage from '../assets/imagenes/fiesta.jpg'
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
      <div className="landing-page">
        <div className="loading">Cargando productos...</div>
      </div>
    )
  }

  return (  
    <div className="landing-page">
      {/* Hero Section - Carousel */}
      <section className="carousel-section">
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
                    <Link to="/ventasalpormayor" className="btn btn-secondary">Para Comerciantes</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-btn carousel-prev" onClick={prevSlide}>‹</button>
          <button className="carousel-btn carousel-next" onClick={nextSlide}>›</button>
        </div>
      </section>

      {/* Categories Section - CORREGIDO */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Nuestras Categorías</h2>
          
          {/* UN SOLO GRID PARA TODAS LAS CATEGORÍAS */}
          <div className="categories-grid">
            {/* Novedades */}
            <div className="category-card">
              <Link to="/novedades" className="category-link">
                <div 
                  className="category-image" 
                  style={{ backgroundImage: `url(${novedadesImage})` }}
                >
                  <span className="category-label">Novedades</span>
                </div>
              </Link>
            </div>
            
            {/* jeans */}
            <div className="category-card">
              <Link to="/jeans" className="category-link">
                <div 
                  className="category-image" 
                  style={{ backgroundImage: `url(${jeansImage})` }}
                >
                  <span className="category-label">Jeans Shorts Pantalones</span>
                </div>
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
              </Link>
            </div>
            
            {/* remeras */}
            <div className="category-card">
              <Link to="/remeras" className="category-link">
                <div 
                  className="category-image" 
                  style={{ backgroundImage: `url(${remerasImage})` }}
                >
                  <span className="category-label">Remeras y Musculosas</span>
                </div>
              </Link>
            </div>
            

             {/* ropa deportiva */}
            <div className="category-card">
              <Link to="/ropadeportiva" className="category-link">
                <div 
                  className="category-image" 
                  style={{ backgroundImage: `url(${ropadeportivaImage})` }}
                >
                  <span className="category-label">Ropa Deportiva</span>
                </div>
              </Link>
            </div>
            
              {/* Vestidos */}
            <div className="category-card">
              <Link to="/vestidos" className="category-link">
                <div 
                  className="category-image" 
                  style={{ backgroundImage: `url(${vestidosImage})` }}
                >
                  <span className="category-label">Vestidos y Polleras</span>
                </div>
              </Link>
            </div>
            
            {/* Bodys */}
            <div className="category-card">
              <Link to="/bodys" className="category-link">
                <div 
                  className="category-image" 
                  style={{ backgroundImage: `url(${bodysImage})` }}
                >
                  <span className="category-label">Bodys y Mallas</span>
                </div>
              </Link>
            </div>

             {/* abrigos */}
            <div className="category-card">
              <Link to="/abrigos" className="category-link">
                <div 
                  className="category-image" 
                  style={{ backgroundImage: `url(${abrigosImage})` }}
                >
                  <span className="category-label">Abrigos</span>
                </div>
              </Link>
            </div>
            
          
            
  {/* fiesta */}
            <div className="category-card">
              <Link to="/fiesta" className="category-link">
                <div 
                  className="category-image" 
                  style={{ backgroundImage: `url(${fiestaImage})` }}
                >
                  <span className="category-label">Ropa De Fiesta</span>
                </div>
              </Link>
            </div>
            

             {/* ropainterior */}
            <div className="category-card">
              <Link to="/ropainterior" className="category-link">
                <div 
                  className="category-image" 
                  style={{ backgroundImage: `url(${ropainteriorImage})` }}
                >
                  <span className="category-label">RopaInterior</span>
                </div>
              </Link>
            </div>


            {/* Outlet */}
            <div className="category-card">
              <Link to="/outlet" className="category-link">
                <div 
                  className="category-image" 
                  style={{ backgroundImage: `url(${ouletImage})` }}
                >
                  <span className="category-label">Outlet</span>
                </div>
              </Link>
            </div>

            {/* Accesorios */}
            <div className="category-card">
              <Link to="/accesorios" className="category-link">
                <div 
                  className="category-image" 
                  style={{ backgroundImage: `url(${accesoriosImage})` }}
                >
                  <span className="category-label">Accesorios</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">¿Por qué elegirnos?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Envíos a todo el pais</h3>
              <p></p>
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
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
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
      </section>
    </div>
  )
}

export default Landing