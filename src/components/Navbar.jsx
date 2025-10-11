import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'
// Importa tu logo - ajusta la ruta según tu archivo
import logo from '../assets/imagenes/logolu.png'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo con imagen */}
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <img 
            src={logo} 
            alt="By Luciana Logo" 
            className="logo-image"
          />
          <span className="logo-text">by Luciana Aliendo</span>
        </Link>

        {/* Menu para desktop */}
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={closeMenu}>
              Inicio
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/mujer" className="nav-link" onClick={closeMenu}>
              Mujer
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/hombre" className="nav-link" onClick={closeMenu}>
              Hombre
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/accesorios" className="nav-link" onClick={closeMenu}>
              Accesorios
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/nosotros" className="nav-link" onClick={closeMenu}>
              Nosotros
            </Link>
          </li>
        </ul>

        {/* Iconos de acción */}
        <div className="nav-actions">
          <button className="nav-icon">
            <span className="icon">🔍</span>
          </button>
          <button className="nav-icon">
            <span className="icon">👤</span>
          </button>
          <button className="nav-icon">
            <span className="icon">🛒</span>
            <span className="cart-count">0</span>
          </button>
        </div>

        {/* Menú hamburguesa para mobile */}
        <div className="nav-toggle" onClick={toggleMenu}>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
        </div>
      </div>

      {/* Overlay para mobile */}
      {isMenuOpen && <div className="nav-overlay" onClick={closeMenu}></div>}
    </nav>
  )
}

export default Navbar