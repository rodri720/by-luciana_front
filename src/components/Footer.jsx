import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section">
            <h3 className="footer-logo">By Luciana</h3>
            <p className="footer-description">
              Tu tienda de moda online con los mejores diseños y calidad. 
              Expresa tu estilo con nuestra colección exclusiva.
            </p>
            <div className="social-links">
  <a 
    href="https://www.instagram.com/luciana_aliendo/" 
    className="social-link"
    target="_blank" 
    rel="noopener noreferrer"
  >
    <span className="social-icon">📱</span>
    Instagram
  </a>
  <a 
    href="https://www.facebook.com/profile.php?id=61582789674739" 
    className="social-link"
    target="_blank" 
    rel="noopener noreferrer"
  >
    <span className="social-icon">📘</span>
    Facebook
  </a>
</div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Enlaces Rápidos</h4>
            <ul className="footer-links">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/productos">Productos</Link></li>
              <li><Link to="/nosotros">Nosotros</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-section">
            <h4>Categorías</h4>
            <ul className="footer-links">
              <li><a href="#">Ropa Mujer</a></li>
              <li><a href="#">Ropa Hombre</a></li>
              <li><a href="#">Accesorios</a></li>
              <li><a href="#">Nueva Colección</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4>Contacto</h4>
            <div className="contact-info">
              <p>📧 bylualiendo@gmail.com</p>
              <p>📞 +54 351 8046979</p>
              <p>📍 Cordoba , Villa Allende</p>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2024 By Luciana. Todos los derechos reservados.</p>
            <div className="footer-legal">
              <a href="#">Términos y Condiciones</a>
              <a href="#">Política de Privacidad</a>
              <a href="#">Política de Devoluciones</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer