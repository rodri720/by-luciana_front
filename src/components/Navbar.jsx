import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'
import logo from '../assets/imagenes/logolu.png'
import { useCart } from '../context/CartContext' // ← Agregar esta importación
import CartWidget from './CartWidget' // ← Agregar esta importación

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })
  const [darkMode, setDarkMode] = useState(false)

  // Cargar el modo oscuro desde localStorage al iniciar
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedDarkMode)
    document.body.classList.toggle('dark-mode', savedDarkMode)
  }, [])

  // Función para alternar modo oscuro/claro
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    document.body.classList.toggle('dark-mode', newDarkMode)
  }

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

  const toggleCategories = () => {
    setIsCategoriesOpen(!isCategoriesOpen)
  }

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      e.preventDefault()
      console.log('Buscando:', searchTerm)
      setIsSearchOpen(false)
      setSearchTerm('')
    }
  }

  const handleLogin = (e) => {
    e.preventDefault()
    console.log('Login data:', loginData)
    setIsLoginOpen(false)
    setLoginData({ email: '', password: '' })
  }

  const handleGoogleLogin = () => {
    console.log('Login con Google')
  }

  const handleLogout = () => {
    console.log('Cerrando sesión')
    setIsLoginOpen(false)
  }

  // Categorías disponibles
  const categories = [
    { name: 'Remeras', path: '/categoria/remeras' },
    { name: 'Buzos', path: '/categoria/buzos' },
    { name: 'Suéters', path: '/categoria/sueters' },
    { name: 'Bodys', path: '/categoria/bodys' },
    { name: 'Jeans', path: '/categoria/jeans' },
    { name: 'Shorts', path: '/categoria/shorts' },
    { name: 'Vestidos', path: '/categoria/vestidos' },
    { name: 'Calzados', path: '/categoria/calzados' },
    { name: 'accesorios', path: '/categoria/accesorios' }

  ]

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
          
          <li 
            className="nav-item categories-item"
            onMouseEnter={() => setIsCategoriesOpen(true)}
            onMouseLeave={() => setIsCategoriesOpen(false)}
          >
            <span className="nav-link categories-link">
              Categorías
            </span>
            {isCategoriesOpen && (
              <ul className="categories-dropdown">
                {categories.map((category, index) => (
                  <li key={index} className="dropdown-item">
                    <Link 
                      to={category.path} 
                      className="dropdown-link"
                      onClick={() => {
                        closeMenu()
                        setIsCategoriesOpen(false)
                      }}
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>

        {/* Iconos de acción */}
        <div className="nav-actions">
          {/* Botón Modo Oscuro/Claro */}
          <button 
            className="nav-icon dark-mode-toggle"
            onClick={toggleDarkMode}
            title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            <span className="icon">
              {darkMode ? '☀️' : '🌙'}
            </span>
          </button>

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

          {/* CARRITO REAL - Reemplazar el botón falso por CartWidget */}
          <CartWidget />

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