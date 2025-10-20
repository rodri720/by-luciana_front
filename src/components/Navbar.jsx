import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'
// Importa tu logo - ajusta la ruta según tu archivo
import logo from '../assets/imagenes/logolu.png'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    if (isLoginOpen) setIsLoginOpen(false)
  }

  const toggleLogin = () => {
    setIsLoginOpen(!isLoginOpen)
    if (isSearchOpen) setIsSearchOpen(false)
  }

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      e.preventDefault()
      // Aquí implementas la búsqueda
      console.log('Buscando:', searchTerm)
      // Ejemplo: redirigir a página de resultados
      // navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
      setIsSearchOpen(false)
      setSearchTerm('')
    }
  }

  const handleLogin = (e) => {
    e.preventDefault()
    // Aquí implementas el login
    console.log('Login data:', loginData)
    // Ejemplo: llamar a API de autenticación
    setIsLoginOpen(false)
    setLoginData({ email: '', password: '' })
  }

  const handleGoogleLogin = () => {
    // Aquí implementas el login con Google
    console.log('Login con Google')
    // Ejemplo: window.location.href = 'tu-backend/auth/google'
  }

  const handleLogout = () => {
    // Aquí implementas el logout
    console.log('Cerrando sesión')
    setIsLoginOpen(false)
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
              Ubicacion
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
          {/* Search Button & Panel */}
          <div className="search-container">
            <button className="nav-icon" onClick={toggleSearch}>
              <span className="icon">🔍</span>
            </button>
            {isSearchOpen && (
              <div className="search-panel">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleSearch}
                  autoFocus
                  className="search-input"
                />
                <button 
                  className="search-close"
                  onClick={() => setIsSearchOpen(false)}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Login Button & Panel */}
          <div className="login-container">
            <button className="nav-icon" onClick={toggleLogin}>
              <span className="icon">👤</span>
            </button>
            {isLoginOpen && (
              <div className="login-panel">
                <h4>Iniciar Sesión</h4>
                
                {/* Botón de Google */}
                <button className="google-login-btn" onClick={handleGoogleLogin}>
                  <span className="google-icon">G</span>
                  Continuar con Google
                </button>
                
                <div className="login-divider">
                  <span>o ingresa con tu email</span>
                </div>
                
                <form onSubmit={handleLogin} className="login-form">
                  <input
                    type="email"
                    placeholder="Email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    required
                    className="login-input"
                  />
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    required
                    className="login-input"
                  />
                  <button type="submit" className="login-btn">
                    Ingresar
                  </button>
                </form>
                <div className="login-links">
                  <a href="#registro">Crear cuenta</a>
                  <a href="#olvide">¿Olvidé mi contraseña?</a>
                </div>
                <button 
                  className="login-close"
                  onClick={() => setIsLoginOpen(false)}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <button className="nav-icon">
            <span className="icon">🛒</span>
            <span className="cart-count">0</span>
          </button>
          <Link to="/admin" className="btn btn-admin">Panel Admin</Link>
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