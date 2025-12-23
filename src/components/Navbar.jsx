import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'
import logo from '../assets/imagenes/logolu.png'
import { useCart } from '../context/CartContext'
import CartWidget from './CartWidget'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isBrandsOpen, setIsBrandsOpen] = useState(false) // Nuevo estado para el dropdown de tiendas
  const [searchTerm, setSearchTerm] = useState('')
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })
  const [darkMode, setDarkMode] = useState(false)
  const [user, setUser] = useState(null)

  // Cargar el modo oscuro desde localStorage al iniciar
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedDarkMode)
    document.body.classList.toggle('dark-mode', savedDarkMode)
  }, [])

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
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

  // Nuevas funciones para manejar el dropdown de tiendas
  const toggleBrands = () => {
    setIsBrandsOpen(!isBrandsOpen)
  }

  const handleMouseEnterBrands = () => {
    setIsBrandsOpen(true)
  }

  const handleMouseLeaveBrands = () => {
    setIsBrandsOpen(false)
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
    // Aquí iría la lógica real de login con email/password
    // Por ahora simulamos un login exitoso
    const mockUser = {
      name: 'Usuario Demo',
      email: loginData.email,
      avatar: '👤'
    }
    setUser(mockUser)
    localStorage.setItem('user', JSON.stringify(mockUser))
    setIsLoginOpen(false)
    setLoginData({ email: '', password: '' })
    alert(`¡Bienvenido ${mockUser.name}!`)
  }

  // Login con Google simulado
  const handleGoogleLoginSimple = () => {
    console.log('🔐 Login con Google (simulado)')
    
    // Simular datos de usuario de Google
    const googleUser = {
      name: 'Usuario Google',
      email: 'usuario@gmail.com',
      avatar: '🅖',
      provider: 'google'
    }
    
    setUser(googleUser)
    localStorage.setItem('user', JSON.stringify(googleUser))
    setIsLoginOpen(false)
    alert(`¡Bienvenido ${googleUser.name}!`)
  }

  const handleLogout = () => {
    console.log('Cerrando sesión')
    setUser(null)
    localStorage.removeItem('user')
    setIsLoginOpen(false)
    alert('¡Sesión cerrada!')
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

  // Nuevo: Marcas/Tiendas disponibles
  const brands = [
    { 
      name: 'By Lualiendo', 
      path: '/marca/by-lualiendo',
      description: 'Ropa urbana y casual'
    },
    { 
      name: 'Bahia', 
      path: '/marca/bahia',
      description: 'Estilo playero y relajado'
    }
    // Puedes agregar más marcas aquí en el futuro
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
          <span className="logo-text">Ropa al por mayor en Cordoba</span>
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
          
          {/* Dropdown de Categorías */}
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

          {/* NUEVO: Dropdown de Tiendas/Marcas */}
          <li 
            className="nav-item brands-item"
            onMouseEnter={handleMouseEnterBrands}
            onMouseLeave={handleMouseLeaveBrands}
          >
            <span className="nav-link brands-link">
              Tiendas
            </span>
            {isBrandsOpen && (
              <ul className="brands-dropdown">
                {brands.map((brand, index) => (
                  <li key={index} className="dropdown-item brand-item">
                    <Link 
                      to={brand.path} 
                      className="dropdown-link brand-link"
                      onClick={() => {
                        closeMenu()
                        setIsBrandsOpen(false)
                      }}
                    >
                      <div className="brand-info">
                        <span className="brand-name">{brand.name}</span>
                        {brand.description && (
                          <span className="brand-description">{brand.description}</span>
                        )}
                      </div>
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

          {/* Login Button & Panel */}
          <div className="login-container">
            <button className="nav-icon" onClick={toggleLogin}>
              {user ? (
                <span className="user-avatar" title={user.name}>
                  {user.avatar}
                </span>
              ) : (
                <span className="icon">👤</span>
              )}
            </button>
            {isLoginOpen && (
              <div className="login-panel">
                {user ? (
                  <div className="user-panel">
                    <h4>¡Hola, {user.name}!</h4>
                    <p>{user.email}</p>
                    <div className="user-actions">
                      <Link to="/perfil" className="profile-btn" onClick={() => setIsLoginOpen(false)}>
                        Mi Perfil
                      </Link>
                      <Link to="/pedidos" className="orders-btn" onClick={() => setIsLoginOpen(false)}>
                        Mis Pedidos
                      </Link>
                      <button onClick={handleLogout} className="logout-btn">
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h4>Iniciar Sesión</h4>
                    <button className="google-login-btn" onClick={handleGoogleLoginSimple}>
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
                  </>
                )}
                <button 
                  className="login-close"
                  onClick={() => setIsLoginOpen(false)}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* CARRITO REAL */}
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